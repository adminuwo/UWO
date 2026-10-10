'use strict';

/**
 * High-Concurrency & Double-Spend Resilience Test
 * Proves that parallel contested wallet operations serialize cleanly under load
 * without deadlocks, race conditions, or negative balances.
 */

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://postgres@127.0.0.1:5433/uwo_wallet_test';
process.env.DATABASE_TEST_URL = 'postgresql://postgres@127.0.0.1:5433/uwo_wallet_test';
process.env.JWT_SECRET = 'test_uwo_super_secret_jwt_key_32_bytes!';
process.env.WALLET_SERVICE_SECRET = 'test_service_secret_2026';

const assert = require('assert');
const { pool } = require('../db/pool');
const { runMigrations } = require('../db/migrate');
const catalogService = require('../services/catalogService');
const walletService = require('../services/walletService');
const topupService = require('../services/topupService');
const reconciliationService = require('../services/reconciliationService');

async function testParallelContestedDebits() {
  console.log('========================================================================');
  console.log('  UWO WALLET CONCURRENCY & DOUBLE-SPEND RESILIENCE TEST');
  console.log('========================================================================\n');

  await runMigrations('up');

  const userId = `usr_concurrent_${Date.now()}`;
  console.log(`Testing with user: ${userId}`);

  // Step 1: Credit ₹100 (10000 paise) to the wallet
  const topupOrder = await topupService.createTopupOrder({
    uwoUserId: userId,
    appId: 'aisa',
    amountPaise: 10000,
    idempotencyKey: `topup_conc_${userId}`,
  });

  await topupService.fulfillTopup({
    topupOrderId: topupOrder.topup_order_id,
    gatewayPaymentId: `pay_conc_${Date.now()}`,
    paidAmountPaise: 10000,
    currency: 'INR',
    source: 'TEST',
  });

  const initialSummary = await walletService.getWalletSummary(userId);
  assert.strictEqual(initialSummary.balances.cash_paise, 10000);
  console.log(`Initial Cash Balance: ₹${initialSummary.balances.cash_balance_inr}`);

  // Step 2: Create a quote for ₹30 (3000 paise)
  const quote = await catalogService.createQuote({
    uwoUserId: userId,
    appId: 'ai_legal',
    productId: 'legal_plan',
    planId: 'advocate_pack',
  });
  console.log(`Authoritative Quote: ${quote.quote_id} for ₹${quote.amount_rupees}`);

  // Step 3: Launch 10 simultaneous parallel hold/purchase requests for ₹30 each.
  // ₹100 balance / ₹30 = exactly 3 should succeed (9000 paise), and 7 MUST fail with INSUFFICIENT_BALANCE.
  console.log('\nLaunching 10 concurrent parallel purchase requests...');

  const attempts = Array.from({ length: 10 }, (_, i) => i + 1);
  const results = await Promise.allSettled(
    attempts.map(async (i) => {
      const purchaseId = `pur_race_${i}_${Date.now()}`;
      const hold = await walletService.createHold({
        uwoUserId: userId,
        appId: 'ai_legal',
        quoteId: quote.quote_id,
        purchaseId,
        idempotencyKey: `race_idemp_${purchaseId}`,
      });

      // Capture hold
      const capture = await walletService.captureHold({
        holdId: hold.hold_id,
        appId: 'ai_legal',
        purchaseId,
      });

      return capture;
    })
  );

  let successCount = 0;
  let rejectedCount = 0;

  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    if (res.status === 'fulfilled') {
      successCount++;
    } else {
      rejectedCount++;
      assert.strictEqual(res.reason.code, 'INSUFFICIENT_BALANCE');
    }
  }

  console.log(`Results: ${successCount} Succeeded, ${rejectedCount} Rejected (Insufficient Balance)`);

  assert.strictEqual(successCount, 3, 'Exactly 3 purchases must succeed');
  assert.strictEqual(rejectedCount, 7, 'Exactly 7 purchases must be safely rejected');

  // Step 4: Verify final balance is exactly ₹10 (1000 paise)
  const finalSummary = await walletService.getWalletSummary(userId);
  console.log(`Final Available Balance: ₹${finalSummary.balances.total_available_inr} (${finalSummary.balances.cash_paise} paise)`);
  assert.strictEqual(finalSummary.balances.cash_paise, 1000);
  assert.strictEqual(finalSummary.balances.total_locked_paise, 0);

  // Step 5: Verify zero balance variance in reconciliation audit
  const recon = await reconciliationService.reconcileAllWallets();
  assert.ok(recon.is_healthy);
  assert.strictEqual(recon.total_discrepancies, 0);

  const userRecon = recon.wallets.find((w) => w.uwo_user_id === userId);
  assert.ok(userRecon);
  assert.strictEqual(userRecon.is_reconciled, true);
  assert.strictEqual(userRecon.cash_variance_paise, 0);

  console.log('Zero-variance audit: PASSED (₹0.00 discrepancy)');
  console.log('\n========================================================================');
  console.log('  CONCURRENCY & INTEGRITY TEST: ALL ASSERTIONS PASSED ✅');
  console.log('========================================================================');

  await pool.end();
}

testParallelContestedDebits().catch((err) => {
  console.error('Fatal concurrency test error:', err);
  process.exit(1);
});
