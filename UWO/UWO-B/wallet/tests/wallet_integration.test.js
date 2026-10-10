'use strict';

/**
 * UWO Central Financial Wallet Integration & Resilience Test Suite
 * Covers Phases 1, 2, and 3: Foundation, Razorpay Top-Up, Holds, and Saga Lifecycle.
 */

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://postgres@127.0.0.1:5433/uwo_wallet_test';
process.env.DATABASE_TEST_URL = 'postgresql://postgres@127.0.0.1:5433/uwo_wallet_test';
process.env.JWT_SECRET = 'test_uwo_super_secret_jwt_key_32_bytes!';
process.env.WALLET_SERVICE_SECRET = 'test_service_secret_2026';
process.env.RAZORPAY_WEBHOOK_SECRET = 'test_razorpay_webhook_secret_xyz';

const assert = require('assert');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { pool, withTransaction } = require('../db/pool');
const { runMigrations } = require('../db/migrate');
const catalogService = require('../services/catalogService');
const walletService = require('../services/walletService');
const topupService = require('../services/topupService');
const reconciliationService = require('../services/reconciliationService');

function generateUserToken(userId, email = 'testuser@uwo24.com') {
  return jwt.sign(
    { sub: userId, email, role: 'user', name: 'Test User' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function computeWebhookSignature(rawBody, secret = process.env.RAZORPAY_WEBHOOK_SECRET) {
  return crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
}

let passed = 0;
let failed = 0;

async function runTest(name, fn) {
  process.stdout.write(`  [TEST] ${name} ... `);
  try {
    await fn();
    console.log('✅ PASSED');
    passed++;
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
    console.error(err);
    failed++;
  }
}

async function main() {
  console.log('===============================================================');
  console.log('  UWO CENTRAL FINANCIAL WALLET - AUTOMATED TEST SUITE');
  console.log('===============================================================\n');

  // Step 0: Ensure migrations are up in test DB
  await runMigrations('up');

  // Clean test tables
  await pool.query(`
    TRUNCATE TABLE
      refund_records,
      idempotency_records,
      outbox_events,
      payment_webhook_events,
      wallet_holds,
      wallet_quotes,
      topup_orders,
      wallet_ledger,
      wallets
    CASCADE;
  `);

  const userA = `usr_test_a_${Date.now()}`;
  const userB = `usr_test_b_${Date.now()}`;

  console.log('\n--- PHASE 1: WALLET FOUNDATION & PRICING CATALOG ---');

  await runTest('1.1 Initialize Wallet with 0 balances', async () => {
    const wallet = await walletService.getOrCreateWallet(userA);
    assert.strictEqual(wallet.uwo_user_id, userA);
    assert.strictEqual(wallet.balances.total_balance_paise, 0);
    assert.strictEqual(wallet.balances.available_cash_paise, 0);
    assert.strictEqual(wallet.balances.available_promo_paise, 0);
    assert.strictEqual(wallet.status, 'ACTIVE');
  });

  await runTest('1.2 Authoritative Catalog resolves prices in paise & rejects untrusted prices', async () => {
    // AISA Pro monthly = 29900 paise (₹299)
    const aisaPro = catalogService.resolvePrice({
      appId: 'aisa',
      productId: 'aisa_subscription',
      planId: 'pro',
      billingCycle: 'monthly',
    });
    assert.strictEqual(aisaPro.amountPaise, 29900);
    assert.strictEqual(aisaPro.currency, 'INR');

    // AI Legal Advocate pack = 3000 paise (₹30)
    const legalPack = catalogService.resolvePrice({
      appId: 'ai_legal',
      productId: 'legal_plan',
      planId: 'advocate_pack',
    });
    assert.strictEqual(legalPack.amountPaise, 3000);

    // AI Ads 50 Visual Credits = 3000 paise (₹30)
    const adsCredits = catalogService.resolvePrice({
      appId: 'ai_ads',
      productId: 'ads_plan',
      planId: 'visual_credits_50',
    });
    assert.strictEqual(adsCredits.amountPaise, 3000);

    // Reject unknown app
    assert.throws(() => {
      catalogService.resolvePrice({ appId: 'fake_app', productId: 'xyz', planId: 'abc' });
    }, /UNKNOWN_APP/);
  });

  await runTest('1.3 Authoritative Quote creation and expiry validation', async () => {
    const quote = await catalogService.createQuote({
      uwoUserId: userA,
      appId: 'ai_legal',
      productId: 'legal_plan',
      planId: 'advocate_pack',
      ttlSeconds: 60,
    });
    assert.ok(quote.quote_id.startsWith('quo_'));
    assert.strictEqual(Number(quote.amount_paise), 3000);
    assert.strictEqual(quote.amount_rupees, '30.00');

    const fetchedQuote = await catalogService.getValidQuote(quote.quote_id);
    assert.strictEqual(fetchedQuote.quote_id, quote.quote_id);
  });

  await runTest('1.4 Promotional credit grant and ledger recording', async () => {
    const promoGrant = await walletService.grantPromo({
      uwoUserId: userA,
      amountPaise: 2000, // ₹20.00 promo
      reason: 'WELCOME_BONUS',
      idempotencyKey: `promo_key_${userA}`,
    });
    assert.ok(promoGrant.success);
    assert.strictEqual(promoGrant.granted_promo_paise, 2000);

    const summary = await walletService.getWalletSummary(userA);
    assert.strictEqual(summary.balances.promo_paise, 2000);
    assert.strictEqual(summary.balances.available_promo_paise, 2000);
    assert.strictEqual(summary.balances.cash_paise, 0);
    assert.strictEqual(summary.balances.total_balance_paise, 2000);
    assert.strictEqual(summary.balances.total_balance_inr, '20.00');

    // Verify ledger entry
    const history = await walletService.getTransactionHistory(userA);
    assert.strictEqual(history.items.length, 1);
    assert.strictEqual(history.items[0].type, 'PROMO_GRANT');
    assert.strictEqual(history.items[0].amount_paise, 2000);
  });

  console.log('\n--- PHASE 2: CENTRAL RAZORPAY TOP-UP ---');

  let testTopupOrderId = null;
  let testGatewayOrderId = null;

  await runTest('2.1 Central Top-up order creation (₹100 = 10000 paise)', async () => {
    const order = await topupService.createTopupOrder({
      uwoUserId: userA,
      appId: 'aisa',
      amountPaise: 10000,
      idempotencyKey: `topup_key_${userA}_100`,
    });
    assert.ok(order.topup_order_id.startsWith('top_'));
    assert.strictEqual(order.amount_paise, 10000);
    assert.strictEqual(order.amount_inr, '100.00');
    assert.strictEqual(order.status, 'CREATED');

    testTopupOrderId = order.topup_order_id;
    testGatewayOrderId = order.gateway_order_id;
  });

  await runTest('2.2 Top-up status endpoint returns pending status before payment', async () => {
    const status = await topupService.getTopupOrderStatus(testTopupOrderId, userA);
    assert.strictEqual(status.status, 'CREATED');
    assert.strictEqual(status.amount_paise, 10000);
  });

  await runTest('2.3 Webhook rejects invalid signature', async () => {
    const rawPayload = JSON.stringify({
      id: 'evt_fake_sig_1',
      event: 'payment.captured',
      payload: {
        payment: { entity: { id: 'pay_fake_1', order_id: testGatewayOrderId, amount: 10000, currency: 'INR' } },
      },
    });

    await assert.rejects(
      async () => {
        await topupService.processRazorpayWebhook({
          rawBody: Buffer.from(rawPayload),
          signature: 'invalid_hex_signature_here',
          eventPayload: JSON.parse(rawPayload),
        });
      },
      /INVALID_SIGNATURE/
    );
  });

  await runTest('2.4 Webhook fulfills ₹100 top-up exactly once with valid signature', async () => {
    const rawPayload = JSON.stringify({
      id: 'evt_valid_topup_1',
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_rzp_test_100',
            order_id: testGatewayOrderId,
            amount: 10000,
            currency: 'INR',
          },
        },
      },
    });

    const signature = computeWebhookSignature(rawPayload);

    const result = await topupService.processRazorpayWebhook({
      rawBody: Buffer.from(rawPayload),
      signature,
      eventPayload: JSON.parse(rawPayload),
    });

    assert.ok(result.success);
    assert.strictEqual(result.fulfillment.amount_paise, 10000);
    assert.strictEqual(result.fulfillment.amount_inr, '100.00');

    // Verify wallet balance: had 2000 promo + now 10000 cash = 12000 paise (₹120.00)
    const summary = await walletService.getWalletSummary(userA);
    assert.strictEqual(summary.balances.cash_paise, 10000);
    assert.strictEqual(summary.balances.promo_paise, 2000);
    assert.strictEqual(summary.balances.total_balance_paise, 12000);
    assert.strictEqual(summary.balances.total_balance_inr, '120.00');

    // Verify top-up status is FULFILLED
    const status = await topupService.getTopupOrderStatus(testTopupOrderId, userA);
    assert.strictEqual(status.status, 'FULFILLED');
    assert.strictEqual(status.gateway_payment_id, 'pay_rzp_test_100');
  });

  await runTest('2.5 Idempotency: Replayed webhook causes zero duplicate credit', async () => {
    const rawPayload = JSON.stringify({
      id: 'evt_valid_topup_1', // Same event ID
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_rzp_test_100',
            order_id: testGatewayOrderId,
            amount: 10000,
            currency: 'INR',
          },
        },
      },
    });
    const signature = computeWebhookSignature(rawPayload);

    const duplicateResult = await topupService.processRazorpayWebhook({
      rawBody: Buffer.from(rawPayload),
      signature,
      eventPayload: JSON.parse(rawPayload),
    });

    assert.ok(duplicateResult.success);
    assert.strictEqual(duplicateResult.duplicate, true);

    // Balance must STILL be exactly ₹120.00 (not ₹220.00!)
    const summary = await walletService.getWalletSummary(userA);
    assert.strictEqual(summary.balances.cash_paise, 10000);
    assert.strictEqual(summary.balances.total_balance_paise, 12000);
  });

  console.log('\n--- PHASE 3: HOLDS, SAGA, AND ENTITLEMENT WORKFLOW ---');

  let activeQuoteId = null;
  let activeHoldId = null;

  await runTest('3.1 Create Hold reserves funds with FIFO Promo-First burn', async () => {
    // Purchase ₹30 product (3000 paise)
    // User has 2000 promo + 10000 cash.
    // FIFO Promo-first spend: should reserve 2000 promo + 1000 cash = 3000 total.
    const quote = await catalogService.createQuote({
      uwoUserId: userA,
      appId: 'ai_legal',
      productId: 'legal_plan',
      planId: 'advocate_pack',
    });
    activeQuoteId = quote.quote_id;

    const purchaseId = `pur_saga_test_30_${Date.now()}`;
    const hold = await walletService.createHold({
      uwoUserId: userA,
      appId: 'ai_legal',
      quoteId: activeQuoteId,
      purchaseId,
      idempotencyKey: `idemp_${purchaseId}`,
    });

    activeHoldId = hold.hold_id;
    assert.strictEqual(hold.total_amount_paise, 3000);
    assert.strictEqual(hold.held_promo_paise, 2000); // 2000 from promo
    assert.strictEqual(hold.held_cash_paise, 1000); // 1000 from cash
    assert.strictEqual(hold.status, 'ACTIVE');

    // Available balance should be 12000 - 3000 = 9000 paise (₹90.00)
    const summary = await walletService.getWalletSummary(userA);
    assert.strictEqual(summary.balances.total_available_paise, 9000);
    assert.strictEqual(summary.balances.total_available_inr, '90.00');
    assert.strictEqual(summary.balances.total_locked_paise, 3000);
  });

  await runTest('3.2 Capture Hold commits debit to ledger and updates balance to ₹70 cash', async () => {
    const hold = await walletService.getHold(activeHoldId);
    const captureResult = await walletService.captureHold({
      holdId: activeHoldId,
      appId: 'ai_legal',
      purchaseId: hold.purchase_id,
    });

    assert.ok(captureResult.success);
    assert.strictEqual(captureResult.status, 'CAPTURED');
    assert.strictEqual(captureResult.amount_captured_paise, 3000);

    // Final balance:
    // Initial cash 10000 - 1000 held = 9000 paise (₹90.00)
    // Initial promo 2000 - 2000 held = 0 promo.
    // Total balance = 9000 paise = ₹90.00.
    const summary = await walletService.getWalletSummary(userA);
    assert.strictEqual(summary.balances.cash_paise, 9000);
    assert.strictEqual(summary.balances.promo_paise, 0);
    assert.strictEqual(summary.balances.total_balance_paise, 9000);
    assert.strictEqual(summary.balances.total_locked_paise, 0);
    assert.strictEqual(summary.balances.total_available_paise, 9000);
  });

  await runTest('3.3 Capture Hold is idempotent on replay', async () => {
    const hold = await walletService.getHold(activeHoldId);
    const replayResult = await walletService.captureHold({
      holdId: activeHoldId,
      appId: 'ai_legal',
      purchaseId: hold.purchase_id,
    });
    assert.ok(replayResult.success);
    assert.strictEqual(replayResult.already_captured, true);

    // Balance remains exactly unchanged
    const summary = await walletService.getWalletSummary(userA);
    assert.strictEqual(summary.balances.total_balance_paise, 9000);
  });

  await runTest('3.4 Saga Failure compensation: Hold Release restores locked funds', async () => {
    // Create new ₹30 quote and hold
    const quote = await catalogService.createQuote({
      uwoUserId: userA,
      appId: 'aisa',
      productId: 'quota_topup',
      planId: 'test_spend_30',
    });

    const purchaseId = `pur_failed_act_${Date.now()}`;
    const hold = await walletService.createHold({
      uwoUserId: userA,
      appId: 'aisa',
      quoteId: quote.quote_id,
      purchaseId,
      idempotencyKey: `idemp_${purchaseId}`,
    });

    // Before release: locked = 3000, available = 6000
    let summary = await walletService.getWalletSummary(userA);
    assert.strictEqual(summary.balances.total_available_paise, 6000);
    assert.strictEqual(summary.balances.total_locked_paise, 3000);

    // Simulate downstream entitlement activation failure -> Release Hold
    const releaseResult = await walletService.releaseHold({
      holdId: hold.hold_id,
      appId: 'aisa',
      purchaseId,
      reason: 'DOWNSTREAM_SUBSCRIPTION_DB_ERROR',
    });

    assert.ok(releaseResult.success);
    assert.strictEqual(releaseResult.status, 'RELEASED');

    // After release: funds returned to available balance (9000 paise = ₹90.00)
    summary = await walletService.getWalletSummary(userA);
    assert.strictEqual(summary.balances.total_available_paise, 9000);
    assert.strictEqual(summary.balances.total_locked_paise, 0);
  });

  await runTest('3.5 Insufficient balance rejection', async () => {
    // Quote for AISA Ultra ₹799 (79900 paise) when user has 9000 paise
    const bigQuote = await catalogService.createQuote({
      uwoUserId: userA,
      appId: 'aisa',
      productId: 'aisa_subscription',
      planId: 'ultra',
    });

    await assert.rejects(
      async () => {
        await walletService.createHold({
          uwoUserId: userA,
          appId: 'aisa',
          quoteId: bigQuote.quote_id,
          purchaseId: `pur_insufficient_${Date.now()}`,
          idempotencyKey: `idemp_insuf_${Date.now()}`,
        });
      },
      (err) => err.code === 'INSUFFICIENT_BALANCE'
    );
  });

  await runTest('3.6 Tenant Isolation: User B cannot access User A hold or wallet', async () => {
    // User B tries to read User A's hold
    const hold = await walletService.getHold(activeHoldId);
    assert.strictEqual(hold.uwo_user_id, userA);

    // Verify User B's separate wallet is empty
    const summaryB = await walletService.getWalletSummary(userB);
    assert.strictEqual(summaryB.balances.total_balance_paise, 0);
    assert.notStrictEqual(summaryB.wallet_id, hold.wallet_id);
  });

  await runTest('3.7 Zero-Variance Financial Reconciliation Audit', async () => {
    const reconReport = await reconciliationService.reconcileAllWallets();
    assert.ok(reconReport.is_healthy);
    assert.strictEqual(reconReport.total_discrepancies, 0);

    const userARecon = reconReport.wallets.find((w) => w.uwo_user_id === userA);
    assert.ok(userARecon);
    assert.strictEqual(userARecon.is_reconciled, true);
    assert.strictEqual(userARecon.cash_variance_paise, 0);
    assert.strictEqual(userARecon.promo_variance_paise, 0);
  });

  console.log('\n===============================================================');
  console.log(`  RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  await pool.end();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
