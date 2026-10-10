'use strict';

const express = require('express');
const router = express.Router();

const {
  requireUserAuth,
  requireServiceAuth,
  requireUserOrDelegatedServiceAuth,
} = require('../middleware/walletAuth');

const walletService = require('../services/walletService');
const topupService = require('../services/topupService');
const catalogService = require('../services/catalogService');
const reconciliationService = require('../services/reconciliationService');

// ─── 1. USER WALLET SUMMARY & TRANSACTIONS ──────────────────────────────────

/**
 * GET /api/v1/wallet/me
 * Read authenticated user's central wallet summary.
 */
router.get('/wallet/me', requireUserOrDelegatedServiceAuth, async (req, res, next) => {
  try {
    const summary = await walletService.getWalletSummary(req.uwo_user_id);
    return res.json({
      success: true,
      wallet: summary,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/wallet/transactions
 * Read paginated central transaction history.
 */
router.get('/wallet/transactions', requireUserOrDelegatedServiceAuth, async (req, res, next) => {
  try {
    const { limit, cursor, type } = req.query;
    const history = await walletService.getTransactionHistory(req.uwo_user_id, {
      limit,
      cursor,
      type,
    });
    return res.json({
      success: true,
      ...history,
    });
  } catch (err) {
    next(err);
  }
});

// ─── 2. AUTHORITATIVE PRICE QUOTES ──────────────────────────────────────────

/**
 * POST /api/v1/wallet/quotes
 * Request authoritative price quote from catalog.
 */
router.post('/wallet/quotes', requireUserOrDelegatedServiceAuth, async (req, res, next) => {
  try {
    const { product_id, plan_id, billing_cycle, quantity, ttl_seconds } = req.body || {};
    const appId = req.headers['x-app-id'] || req.body?.app_id;

    if (!appId || !product_id || !plan_id) {
      return res.status(400).json({
        error: 'MISSING_FIELDS',
        message: 'app_id, product_id, and plan_id are required to generate a quote.',
      });
    }

    const quote = await catalogService.createQuote({
      uwoUserId: req.uwo_user_id,
      appId,
      productId: product_id,
      planId: plan_id,
      billingCycle: billing_cycle || 'monthly',
      quantity: quantity || 1,
      ttlSeconds: ttl_seconds || 900,
    });

    return res.status(201).json({
      success: true,
      quote,
    });
  } catch (err) {
    next(err);
  }
});

// ─── 3. CENTRAL RAZORPAY TOP-UP ORDERS ──────────────────────────────────────

/**
 * POST /api/v1/wallet/topup-orders
 * Create central Razorpay top-up order.
 */
router.post('/wallet/topup-orders', requireUserOrDelegatedServiceAuth, async (req, res, next) => {
  try {
    const { amount_paise, amount_inr, idempotency_key, trace_id } = req.body || {};
    const appId = req.headers['x-app-id'] || req.body?.app_id || 'aisa';

    const paise =
      amount_paise !== undefined
        ? parseInt(amount_paise, 10)
        : amount_inr !== undefined
        ? Math.round(parseFloat(amount_inr) * 100)
        : null;

    if (!paise || paise <= 0) {
      return res.status(400).json({
        error: 'INVALID_AMOUNT',
        message: 'Must provide valid positive amount_paise or amount_inr.',
      });
    }

    const key = idempotency_key || req.headers['idempotency-key'] || `topup_k_${Date.now()}`;
    const order = await topupService.createTopupOrder({
      uwoUserId: req.uwo_user_id,
      appId,
      amountPaise: paise,
      idempotencyKey: key,
      traceId: trace_id || req.headers['x-trace-id'],
    });

    return res.status(201).json({
      success: true,
      topup_order: order,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/wallet/topup-orders/:id
 * Query top-up order status.
 */
router.get('/wallet/topup-orders/:id', requireUserOrDelegatedServiceAuth, async (req, res, next) => {
  try {
    const topupOrderId = req.params.id;
    const status = await topupService.getTopupOrderStatus(topupOrderId, req.uwo_user_id);
    return res.json({
      success: true,
      topup_order: status,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/wallet/topup-orders/verify
 * Complete client checkout verification and immediate fulfillment
 */
router.post('/wallet/topup-orders/verify', requireUserOrDelegatedServiceAuth, async (req, res, next) => {
  try {
    const { gateway_order_id, gateway_payment_id, gateway_signature, trace_id } = req.body || {};
    if (!gateway_order_id || !gateway_payment_id || !gateway_signature) {
      return res.status(400).json({
        error: 'MISSING_FIELDS',
        message: 'gateway_order_id, gateway_payment_id, and gateway_signature are required.',
      });
    }

    const fulfillment = await topupService.verifyAndFulfillPayment({
      uwoUserId: req.uwo_user_id,
      gatewayOrderId: gateway_order_id,
      gatewayPaymentId: gateway_payment_id,
      gatewaySignature: gateway_signature,
      traceId: trace_id || req.headers['x-trace-id'],
    });

    return res.status(200).json({
      success: true,
      fulfillment,
    });
  } catch (err) {
    next(err);
  }
});

// ─── 4. SIGNED RAZORPAY WEBHOOK (EXACT RAW BODY VERIFICATION) ───────────────

/**
 * POST /api/v1/payments/razorpay/webhook
 * Centralized signed webhook handler.
 */
router.post('/payments/razorpay/webhook', async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.rawBody || (typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
    const eventPayload = typeof req.body === 'object' && !Buffer.isBuffer(req.body)
      ? req.body
      : JSON.parse(rawBody.toString('utf8'));

    const result = await topupService.processRazorpayWebhook({
      rawBody: Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody, 'utf8'),
      signature,
      eventPayload,
    });

    return res.status(200).json(result);
  } catch (err) {
    if (err.code === 'INVALID_SIGNATURE') {
      return res.status(400).json({ error: 'INVALID_SIGNATURE', message: err.message });
    }
    next(err);
  }
});

// ─── 5. SAGA HOLDS, CAPTURE, AND RELEASE ────────────────────────────────────

/**
 * POST /api/v1/wallet/holds
 * Reserve spendable funds before app entitlement activation.
 */
router.post('/wallet/holds', requireUserOrDelegatedServiceAuth, async (req, res, next) => {
  try {
    const { quote_id, purchase_id, idempotency_key, ttl_seconds, trace_id } = req.body || {};
    const appId = req.headers['x-app-id'] || req.body?.app_id;

    if (!quote_id || !purchase_id) {
      return res.status(400).json({
        error: 'MISSING_FIELDS',
        message: 'quote_id and purchase_id are required.',
      });
    }

    const key = idempotency_key || req.headers['idempotency-key'] || `hold_k_${purchase_id}`;
    const hold = await walletService.createHold({
      uwoUserId: req.uwo_user_id,
      appId,
      quoteId: quote_id,
      purchaseId: purchase_id,
      idempotencyKey: key,
      ttlSeconds: ttl_seconds || 900,
      traceId: trace_id || req.headers['x-trace-id'],
    });

    return res.status(201).json({
      success: true,
      hold,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/wallet/holds/:id/capture
 * Capture hold after successful downstream entitlement activation.
 */
router.post('/wallet/holds/:id/capture', requireServiceAuth, async (req, res, next) => {
  try {
    const holdId = req.params.id;
    const { purchase_id, trace_id } = req.body || {};
    const appId = req.headers['x-app-id'] || req.body?.app_id;

    const result = await walletService.captureHold({
      holdId,
      appId,
      purchaseId: purchase_id,
      traceId: trace_id || req.headers['x-trace-id'],
    });

    return res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/wallet/holds/:id/release
 * Release hold on downstream entitlement failure.
 */
router.post('/wallet/holds/:id/release', requireServiceAuth, async (req, res, next) => {
  try {
    const holdId = req.params.id;
    const { purchase_id, reason, trace_id } = req.body || {};
    const appId = req.headers['x-app-id'] || req.body?.app_id;

    const result = await walletService.releaseHold({
      holdId,
      appId,
      purchaseId: purchase_id,
      reason: reason || 'APP_ACTIVATION_FAILED',
      traceId: trace_id || req.headers['x-trace-id'],
    });

    return res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/wallet/holds/:id
 * Query hold state for safe recovery.
 */
router.get('/wallet/holds/:id', requireUserOrDelegatedServiceAuth, async (req, res, next) => {
  try {
    const holdId = req.params.id;
    const hold = await walletService.getHold(holdId);

    // Enforce tenant/user isolation
    if (req.uwo_user_id && hold.uwo_user_id !== req.uwo_user_id) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'You cannot access another user’s hold reservation.',
      });
    }

    return res.json({
      success: true,
      hold,
    });
  } catch (err) {
    next(err);
  }
});

// ─── 6. PROMO GRANTS & RECONCILIATION (INTERNAL / ADMIN) ───────────────────

/**
 * POST /api/v1/wallet/promo-grants
 * Restricted promotional credit grant.
 */
router.post('/wallet/promo-grants', requireServiceAuth, async (req, res, next) => {
  try {
    const { uwo_user_id, amount_paise, reason, idempotency_key, trace_id } = req.body || {};
    if (!uwo_user_id || !amount_paise) {
      return res.status(400).json({ error: 'MISSING_FIELDS', message: 'uwo_user_id and amount_paise required.' });
    }

    const result = await walletService.grantPromo({
      uwoUserId: uwo_user_id,
      amountPaise: parseInt(amount_paise, 10),
      reason,
      idempotencyKey: idempotency_key || `promo_${Date.now()}`,
      traceId,
      actor: 'SERVICE_ADMIN',
    });

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/wallet/reconcile
 * Trigger reconciliation audits and release expired holds.
 */
router.post('/wallet/reconcile', requireServiceAuth, async (req, res, next) => {
  try {
    const holdRecon = await reconciliationService.reconcileExpiredHolds();
    const walletRecon = await reconciliationService.reconcileAllWallets();
    const outboxRecon = await reconciliationService.processPendingOutbox();

    return res.json({
      success: true,
      reconciled_at: new Date().toISOString(),
      expired_holds: holdRecon,
      wallet_audits: walletRecon,
      outbox: outboxRecon,
    });
  } catch (err) {
    next(err);
  }
});

// ─── ERROR HANDLER ──────────────────────────────────────────────────────────
router.use((err, req, res, next) => {
  console.error('[UWO-B Wallet Error]', err);
  const status = err.status || 500;
  return res.status(status).json({
    error: err.code || 'WALLET_ERROR',
    message: err.message,
    details: err.details,
  });
});

module.exports = router;
