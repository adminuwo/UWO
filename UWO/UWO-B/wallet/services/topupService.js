'use strict';

const crypto = require('crypto');
const Razorpay = require('razorpay');
const { query, withTransaction } = require('../db/pool');
const { getOrCreateWallet, lockWalletForUpdate, formatRupees } = require('./walletService');
const { checkIdempotency, recordIdempotency } = require('./idempotencyService');

const MIN_TOPUP_PAISE = 100; // ₹1.00 (permits ₹1 micro-top-ups)
const MAX_TOPUP_PAISE = 5000000; // ₹50,000.00

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.warn('[UWO-B Wallet] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not configured. Using mock mode.');
    return null;
  }
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Verify Razorpay Webhook signature using timingSafeEqual on raw request body.
 */
function verifyWebhookSignature(rawBody, signature, secret = null) {
  const webhookSecret = secret || process.env.RAZORPAY_WEBHOOK_SECRET || 'affiliate-payment';
  if (!signature || !rawBody) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  const sigBuffer = Buffer.from(signature, 'utf8');
  const expBuffer = Buffer.from(expectedSignature, 'utf8');

  if (sigBuffer.length !== expBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(sigBuffer, expBuffer);
}

/**
 * Create a centralized Razorpay top-up order.
 * Client-safe: Only returns order ID, amount, and public Key ID.
 */
async function createTopupOrder({
  uwoUserId,
  appId,
  amountPaise,
  idempotencyKey,
  traceId = `trc_${Date.now()}`,
}) {
  const amount = parseInt(amountPaise, 10);
  if (isNaN(amount) || amount < MIN_TOPUP_PAISE || amount > MAX_TOPUP_PAISE) {
    const err = new Error(
      `INVALID_TOPUP_AMOUNT: Top-up amount must be between ₹${formatRupees(MIN_TOPUP_PAISE)} and ₹${formatRupees(MAX_TOPUP_PAISE)}.`
    );
    err.code = 'INVALID_TOPUP_AMOUNT';
    err.status = 400;
    throw err;
  }

  const idempotencyScope = `topup:${uwoUserId}`;
  const payload = { appId, amountPaise: amount, idempotencyKey };

  const idemp = await checkIdempotency(idempotencyScope, idempotencyKey, payload);
  if (idemp.cached) {
    return idemp.responseBody;
  }

  const wallet = await getOrCreateWallet(uwoUserId);
  const topupOrderId = `top_${crypto.randomBytes(16).toString('hex')}`;

  let gatewayOrderId = null;
  const rzp = getRazorpayClient();

  if (rzp) {
    try {
      const order = await rzp.orders.create({
        amount,
        currency: 'INR',
        receipt: topupOrderId,
        notes: {
          uwo_user_id: uwoUserId,
          app_id: appId,
          topup_order_id: topupOrderId,
        },
      });
      gatewayOrderId = order.id;
    } catch (rzpErr) {
      console.error('[UWO-B Razorpay Order Error]', rzpErr.message);
      // If gateway fails or network is disconnected, throw safe error
      const err = new Error(`GATEWAY_ERROR: Failed to create gateway order: ${rzpErr.message}`);
      err.code = 'GATEWAY_ERROR';
      err.status = 502;
      throw err;
    }
  } else {
    // Deterministic mock gateway order for test mode / sandbox
    gatewayOrderId = `order_mock_${crypto.randomBytes(12).toString('hex')}`;
  }

  const insertSql = `
    INSERT INTO topup_orders (
      topup_order_id, wallet_id, uwo_user_id, app_id,
      gateway_order_id, expected_cash_amount_paise, currency,
      status, idempotency_key, trace_id, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, 'INR', 'CREATED', $6, $7, NOW(), NOW())
    RETURNING *;
  `;

  await query(
    `
    INSERT INTO topup_orders (
      topup_order_id, wallet_id, uwo_user_id, app_id,
      gateway_order_id, expected_cash_amount_paise, currency,
      status, idempotency_key, trace_id, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, 'INR', 'CREATED', $7, $8, NOW(), NOW());
    `,
    [
      topupOrderId,
      wallet.wallet_id,
      uwoUserId,
      appId,
      gatewayOrderId,
      amount,
      idempotencyKey,
      traceId,
    ]
  );

  const responseBody = {
    topup_order_id: topupOrderId,
    gateway_order_id: gatewayOrderId,
    amount_paise: amount,
    amount_inr: formatRupees(amount),
    currency: 'INR',
    razorpay_key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_public_key',
    app_id: appId,
    status: 'CREATED',
    created_at: new Date().toISOString(),
  };

  await recordIdempotency(idempotencyScope, idempotencyKey, payload, 201, responseBody);
  return responseBody;
}

/**
 * Fulfill a top-up atomically in PostgreSQL.
 * Exactly-once fulfillment: verifies payment, increases cash balance, writes ledger and outbox.
 */
async function fulfillTopup({
  topupOrderId = null,
  gatewayOrderId = null,
  gatewayPaymentId,
  paidAmountPaise,
  currency = 'INR',
  source = 'WEBHOOK',
  traceId = `trc_${Date.now()}`,
}) {
  return withTransaction(async (client) => {
    // 1. Locate topup order record
    let findSql = 'SELECT * FROM topup_orders WHERE ';
    const params = [];

    if (topupOrderId) {
      findSql += 'topup_order_id = $1';
      params.push(topupOrderId);
    } else if (gatewayOrderId) {
      findSql += 'gateway_order_id = $1';
      params.push(gatewayOrderId);
    } else {
      throw new Error('MISSING_IDENTIFIER: Must provide topupOrderId or gatewayOrderId');
    }

    findSql += ' FOR UPDATE;';
    const { rows: orderRows } = await client.query(findSql, params);

    if (orderRows.length === 0) {
      const err = new Error(`TOPUP_ORDER_NOT_FOUND: Topup order not found for ${topupOrderId || gatewayOrderId}`);
      err.code = 'TOPUP_ORDER_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    const order = orderRows[0];

    // Idempotency: If already fulfilled, return existing confirmation
    if (order.status === 'FULFILLED') {
      return {
        success: true,
        already_fulfilled: true,
        topup_order_id: order.topup_order_id,
        status: 'FULFILLED',
        gateway_payment_id: order.gateway_payment_id,
        amount_paise: Number(order.expected_cash_amount_paise),
      };
    }

    // 2. Validate amount & currency
    const expectedPaise = BigInt(order.expected_cash_amount_paise);
    const paidPaise = BigInt(paidAmountPaise);

    if (currency.toUpperCase() !== 'INR') {
      const err = new Error(`CURRENCY_MISMATCH: Expected INR, received ${currency}`);
      err.code = 'CURRENCY_MISMATCH';
      err.status = 400;
      throw err;
    }

    if (paidPaise !== expectedPaise) {
      const err = new Error(
        `AMOUNT_MISMATCH: Expected ${expectedPaise} paise, but received payment for ${paidPaise} paise.`
      );
      err.code = 'AMOUNT_MISMATCH';
      err.status = 400;
      throw err;
    }

    // 3. Lock wallet row and credit cash balance
    const lockedWallet = await lockWalletForUpdate(order.wallet_id, client);
    const newCash = BigInt(lockedWallet.cash_balance_paise) + expectedPaise;

    await client.query(
      `
      UPDATE wallets
      SET cash_balance_paise = $1,
          version = version + 1,
          updated_at = NOW()
      WHERE wallet_id = $2;
      `,
      [newCash.toString(), lockedWallet.wallet_id]
    );

    // 4. Record immutable ledger posting
    const ledgerId = `led_${crypto.randomBytes(16).toString('hex')}`;
    await client.query(
      `
      INSERT INTO wallet_ledger (
        ledger_id, wallet_id, uwo_user_id, direction, type,
        amount_paise, cash_amount_paise, promo_amount_paise,
        reference_type, reference_id, app_id, idempotency_key,
        trace_id, actor, description, created_at
      ) VALUES ($1, $2, $3, 'CREDIT', 'TOPUP', $4, $4, 0, 'TOPUP_ORDER', $5, $6, $7, $8, 'GATEWAY', $9, NOW());
      `,
      [
        ledgerId,
        lockedWallet.wallet_id,
        order.uwo_user_id,
        expectedPaise.toString(),
        order.topup_order_id,
        order.app_id,
        order.idempotency_key,
        traceId,
        `Razorpay wallet top-up (Payment: ${gatewayPaymentId}) via ${order.app_id}`,
      ]
    );

    // 5. Update topup_orders status
    await client.query(
      `
      UPDATE topup_orders
      SET status = 'FULFILLED',
          gateway_payment_id = $1,
          fulfillment_source = $2,
          updated_at = NOW()
      WHERE topup_order_id = $3;
      `,
      [gatewayPaymentId, source, order.topup_order_id]
    );

    // 6. Transactional Outbox Event
    const eventId = `evt_${crypto.randomBytes(16).toString('hex')}`;
    await client.query(
      `
      INSERT INTO outbox_events (event_id, aggregate_id, aggregate_type, event_type, payload, status)
      VALUES ($1, $2, 'TOPUP', 'WALLET_TOPUP_FULFILLED', $3, 'PENDING');
      `,
      [
        eventId,
        order.topup_order_id,
        JSON.stringify({
          topup_order_id: order.topup_order_id,
          wallet_id: lockedWallet.wallet_id,
          uwo_user_id: order.uwo_user_id,
          amount_paise: Number(expectedPaise),
          gateway_payment_id: gatewayPaymentId,
          ledger_id: ledgerId,
        }),
      ]
    );

    return {
      success: true,
      topup_order_id: order.topup_order_id,
      ledger_id: ledgerId,
      gateway_payment_id: gatewayPaymentId,
      amount_paise: Number(expectedPaise),
      amount_inr: formatRupees(expectedPaise),
      status: 'FULFILLED',
      wallet_id: lockedWallet.wallet_id,
    };
  });
}

/**
 * Process Razorpay Webhook securely.
 * Checks idempotency of event_id, verifies signature, fulfills top-up atomically.
 */
async function processRazorpayWebhook({ rawBody, signature, eventPayload }) {
  const eventId = eventPayload.id || `evt_${crypto.randomBytes(12).toString('hex')}`;
  const eventType = eventPayload.event;

  // 1. Signature Verification
  const isSignatureValid = verifyWebhookSignature(rawBody, signature);
  if (!isSignatureValid) {
    console.error(`[UWO-B Webhook] Signature verification failed for event: ${eventId}`);
    // Record failed webhook attempt for auditing
    await query(
      `
      INSERT INTO payment_webhook_events (
        webhook_event_id, gateway, event_id, event_type, payload,
        signature_verified, status, error_message, created_at, updated_at
      ) VALUES ($1, 'RAZORPAY', $2, $3, $4, FALSE, 'FAILED', 'Invalid webhook signature', NOW(), NOW())
      ON CONFLICT (event_id) DO NOTHING;
      `,
      [`wh_${crypto.randomBytes(16).toString('hex')}`, eventId, eventType || 'unknown', JSON.stringify(eventPayload)]
    );

    const err = new Error('INVALID_SIGNATURE: Webhook signature verification failed.');
    err.code = 'INVALID_SIGNATURE';
    err.status = 400;
    throw err;
  }

  // 2. Check if webhook event was already processed
  const webhookRecordId = `wh_${crypto.randomBytes(16).toString('hex')}`;
  const { rows: existingEvent } = await query(
    'SELECT * FROM payment_webhook_events WHERE event_id = $1;',
    [eventId]
  );

  if (existingEvent.length > 0 && existingEvent[0].status === 'PROCESSED') {
    return {
      success: true,
      duplicate: true,
      message: `Event ${eventId} was already processed.`,
    };
  }

  // 3. Insert or update webhook event inbox
  await query(
    `
    INSERT INTO payment_webhook_events (
      webhook_event_id, gateway, event_id, event_type, payload,
      signature_verified, status, created_at, updated_at
    ) VALUES ($1, 'RAZORPAY', $2, $3, $4, TRUE, 'RECEIVED', NOW(), NOW())
    ON CONFLICT (event_id) DO UPDATE SET updated_at = NOW();
    `,
    [webhookRecordId, eventId, eventType, JSON.stringify(eventPayload)]
  );

  // 4. Process event types
  if (eventType === 'order.paid' || eventType === 'payment.captured') {
    const paymentEntity = eventPayload.payload?.payment?.entity;
    const orderEntity = eventPayload.payload?.order?.entity;

    const gatewayOrderId = paymentEntity?.order_id || orderEntity?.id;
    const gatewayPaymentId = paymentEntity?.id;
    const paidAmount = paymentEntity?.amount || orderEntity?.amount_paid;
    const currency = paymentEntity?.currency || orderEntity?.currency || 'INR';

    if (!gatewayOrderId || !paidAmount) {
      console.warn(`[UWO-B Webhook] Webhook event ${eventId} missing order_id or amount.`);
      return { success: false, reason: 'MISSING_PAYMENT_DATA' };
    }

    try {
      const fulfillment = await fulfillTopup({
        gatewayOrderId,
        gatewayPaymentId: gatewayPaymentId || `pay_wh_${Date.now()}`,
        paidAmountPaise: paidAmount,
        currency,
        source: 'WEBHOOK',
        traceId: `trc_wh_${eventId}`,
      });

      await query(
        `UPDATE payment_webhook_events SET status = 'PROCESSED', updated_at = NOW() WHERE event_id = $1;`,
        [eventId]
      );

      return {
        success: true,
        fulfillment,
      };
    } catch (fulfillErr) {
      console.error(`[UWO-B Webhook] Fulfillment error for ${eventId}:`, fulfillErr.message);
      await query(
        `UPDATE payment_webhook_events SET status = 'FAILED', error_message = $1, retry_count = retry_count + 1, updated_at = NOW() WHERE event_id = $2;`,
        [fulfillErr.message, eventId]
      );
      throw fulfillErr;
    }
  }

  // Other non-topup payment events acknowledged
  await query(
    `UPDATE payment_webhook_events SET status = 'PROCESSED', updated_at = NOW() WHERE event_id = $1;`,
    [eventId]
  );
  return { success: true, ignored: true, eventType };
}

/**
 * Read top-up order status for an authorized user.
 */
async function getTopupOrderStatus(topupOrderId, uwoUserId) {
  const { rows } = await query(
    'SELECT * FROM topup_orders WHERE topup_order_id = $1;',
    [topupOrderId]
  );

  if (rows.length === 0) {
    const err = new Error(`TOPUP_ORDER_NOT_FOUND: Order ${topupOrderId} not found.`);
    err.code = 'TOPUP_ORDER_NOT_FOUND';
    err.status = 404;
    throw err;
  }

  const order = rows[0];
  if (uwoUserId && order.uwo_user_id !== uwoUserId) {
    const err = new Error('FORBIDDEN: You do not have permission to view this top-up order.');
    err.code = 'FORBIDDEN';
    err.status = 403;
    throw err;
  }

  return {
    topup_order_id: order.topup_order_id,
    wallet_id: order.wallet_id,
    uwo_user_id: order.uwo_user_id,
    app_id: order.app_id,
    gateway_order_id: order.gateway_order_id,
    gateway_payment_id: order.gateway_payment_id,
    amount_paise: Number(order.expected_cash_amount_paise),
    amount_inr: formatRupees(order.expected_cash_amount_paise),
    currency: order.currency,
    status: order.status,
    created_at: order.created_at,
    updated_at: order.updated_at,
  };
}

/**
 * Verify Razorpay payment signature from client checkout modal
 */
function verifyPaymentSignature(orderId, paymentId, signature) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !signature || !orderId || !paymentId) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  const sigBuffer = Buffer.from(signature, 'utf8');
  const expBuffer = Buffer.from(expected, 'utf8');
  if (sigBuffer.length !== expBuffer.length) return false;
  return crypto.timingSafeEqual(sigBuffer, expBuffer);
}

/**
 * Verify payment signature from client checkout and atomically fulfill topup.
 */
async function verifyAndFulfillPayment({ uwoUserId, gatewayOrderId, gatewayPaymentId, gatewaySignature, traceId }) {
  const valid = verifyPaymentSignature(gatewayOrderId, gatewayPaymentId, gatewaySignature);
  if (!valid) {
    const err = new Error('INVALID_PAYMENT_SIGNATURE: Payment signature verification failed.');
    err.code = 'INVALID_PAYMENT_SIGNATURE';
    err.status = 400;
    throw err;
  }

  const { rows } = await query(
    'SELECT * FROM topup_orders WHERE gateway_order_id = $1;',
    [gatewayOrderId]
  );
  if (rows.length === 0) {
    const err = new Error(`ORDER_NOT_FOUND: No topup order found for gateway order ${gatewayOrderId}`);
    err.code = 'ORDER_NOT_FOUND';
    err.status = 404;
    throw err;
  }
  const order = rows[0];
  if (uwoUserId && order.uwo_user_id !== uwoUserId) {
    const err = new Error('FORBIDDEN: User does not match topup order.');
    err.code = 'FORBIDDEN';
    err.status = 403;
    throw err;
  }

  return fulfillTopup({
    gatewayOrderId,
    gatewayPaymentId,
    paidAmountPaise: order.expected_cash_amount_paise,
    currency: order.currency || 'INR',
    source: 'CLIENT_VERIFY',
    traceId: traceId || `trc_verify_${Date.now()}`,
  });
}

module.exports = {
  MIN_TOPUP_PAISE,
  MAX_TOPUP_PAISE,
  createTopupOrder,
  fulfillTopup,
  verifyWebhookSignature,
  verifyPaymentSignature,
  verifyAndFulfillPayment,
  processRazorpayWebhook,
  getTopupOrderStatus,
};

