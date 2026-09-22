const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getUnifiedDb } = require('./db');

// POST /api/payment/create
router.post('/create', async (req, res) => {
  try {
    const body = req.body || {};
    const amount = Number(body.amount || 0);
    const currency = body.currency || 'INR';
    const planId = body.plan_id || 'basic';
    const userId = body.user_id || 'guest';

    const orderId = 'order_' + crypto.randomBytes(8).toString('hex');
    const paymentIntent = {
      order_id: orderId,
      amount,
      currency,
      plan_id: planId,
      user_id: userId,
      status: 'created',
      provider: process.env.RAZORPAY_KEY_ID ? 'razorpay' : 'mock_gateway',
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
      created_at: new Date()
    };

    const db = await getUnifiedDb();
    await db.collection('payments').insertOne(paymentIntent);

    return res.status(201).json({
      success: true,
      order_id: orderId,
      amount,
      currency,
      provider: paymentIntent.provider,
      key_id: paymentIntent.key_id
    });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/payment/verify
router.post('/verify', async (req, res) => {
  try {
    const body = req.body || {};
    const orderId = body.order_id || body.orderId;
    const paymentId = body.payment_id || body.paymentId || 'pay_' + Date.now();

    const db = await getUnifiedDb();
    if (orderId) {
      await db.collection('payments').updateOne(
        { order_id: orderId },
        {
          $set: {
            status: 'completed',
            provider_payment_id: paymentId,
            updated_at: new Date()
          }
        }
      );
    }

    return res.json({
      success: true,
      status: 'completed',
      order_id: orderId,
      payment_id: paymentId,
      verified_at: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
