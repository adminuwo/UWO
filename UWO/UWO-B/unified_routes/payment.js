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

// -----------------------------------------------------------------------------
// RAZORPAY AUTOPAY / RECURRING SUBSCRIPTIONS SUBSYSTEM (AISA & AI LEGAL)
// -----------------------------------------------------------------------------
const Razorpay = require('razorpay');
const { subscriptionRepository } = require('./SubscriptionRepository');

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_SBFlInxBiRfOGd',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'GQYnxmOl910sC76rShXhRk3o'
  });
};

// GET /api/payment/subscriptions/plans
// Fetches live Razorpay recurring plans and canonical product templates
router.get('/subscriptions/plans', async (req, res) => {
  try {
    const rzp = getRazorpayInstance();
    const plansList = await rzp.plans.all();

    const canonicalTemplates = [
      {
        product_code: 'ailegal',
        product_name: 'AI Legal Advocate Suite',
        tier: 'BASIC',
        name: 'AI Legal Advocate Basic Monthly',
        amount: 499,
        period: 'monthly',
        interval: 1,
        description: 'AI Legal Advocate Practice Management & Legal AI Assistant'
      },
      {
        product_code: 'ailegal',
        product_name: 'AI Legal Advocate Suite',
        tier: 'PROFESSIONAL',
        name: 'AI Legal Professional Monthly',
        amount: 999,
        period: 'monthly',
        interval: 1,
        description: 'AI Legal Advocate Professional Practice Management + Document AI'
      },
      {
        product_code: 'ailegal',
        product_name: 'AI Legal Advocate Suite',
        tier: 'ENTERPRISE',
        name: 'AI Legal Enterprise Monthly',
        amount: 2399,
        period: 'monthly',
        interval: 1,
        description: 'AI Legal Law Firm / High Court Practice Management & Multi-User'
      },
      {
        product_code: 'aisa',
        product_name: 'AISA Executive Virtual Assistant',
        tier: 'STARTER',
        name: 'AISA Assistant Starter Monthly',
        amount: 1,
        period: 'monthly',
        interval: 1,
        description: 'AISA Personal AI Executive Assistant & Productivity Tools'
      },
      {
        product_code: 'aisa',
        product_name: 'AISA Executive Virtual Assistant',
        tier: 'PRO',
        name: 'AISA Assistant Pro Monthly',
        amount: 499,
        period: 'monthly',
        interval: 1,
        description: 'AISA Pro Multi-agent Executive Assistant with Voice & Vision'
      }
    ];

    return res.json({
      success: true,
      count: plansList.count || 0,
      plans: plansList.items || [],
      templates: canonicalTemplates
    });
  } catch (err) {
    console.error('[Razorpay Plans] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/payment/subscriptions/create-plan
// Creates a recurring billing plan on Razorpay
router.post('/subscriptions/create-plan', async (req, res) => {
  try {
    const { name, amount, period = 'monthly', interval = 1, description, product_code = 'ailegal', tier = 'BASIC' } = req.body;
    if (!name || !amount) {
      return res.status(400).json({ success: false, error: 'Name and amount are required.' });
    }

    const rzp = getRazorpayInstance();
    const plan = await rzp.plans.create({
      period,
      interval: Number(interval) || 1,
      item: {
        name,
        amount: Math.round(Number(amount) * 100), // amount in paise
        currency: 'INR',
        description: description || `${name} recurring subscription`
      },
      notes: {
        product_code,
        tier
      }
    });

    return res.status(201).json({
      success: true,
      message: `Plan "${name}" created on Razorpay with ID: ${plan.id}`,
      plan
    });
  } catch (err) {
    console.error('[Razorpay Create Plan] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/payment/subscriptions/create
// Creates a recurring subscription instance on Razorpay for UPI Autopay / e-Mandate
router.post('/subscriptions/create', async (req, res) => {
  try {
    const {
      plan_id,
      total_count = 12, // number of billing cycles (default 1 year / 12 months)
      customer_name,
      customer_email,
      customer_phone,
      product_code = 'ailegal',
      tier = 'BASIC',
      workspace = 'default'
    } = req.body;

    if (!plan_id) {
      return res.status(400).json({ success: false, error: 'plan_id is required to create a recurring subscription.' });
    }

    const rzp = getRazorpayInstance();
    const subOptions = {
      plan_id,
      total_count: Number(total_count) || 12,
      quantity: 1,
      customer_notify: 1, // Razorpay automatically sends SMS/Email pre-debit notifications required by RBI
      notes: {
        customer_name: customer_name || 'Subscriber',
        customer_email: customer_email || '',
        customer_phone: customer_phone || '',
        product_code,
        tier,
        workspace
      }
    };

    const subscription = await rzp.subscriptions.create(subOptions);

    return res.status(201).json({
      success: true,
      subscription_id: subscription.id,
      plan_id: subscription.plan_id,
      status: subscription.status,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_SBFlInxBiRfOGd',
      subscription
    });
  } catch (err) {
    console.error('[Razorpay Create Subscription] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/payment/subscriptions/verify
// Verifies recurring subscription signature after initial UPI Autopay authorization
router.post('/subscriptions/verify', async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      product_code = 'ailegal',
      customer_name,
      customer_email,
      customer_phone,
      tier = 'BASIC',
      workspace = 'default',
      amount = 499
    } = req.body;

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing razorpay_payment_id, razorpay_subscription_id, or razorpay_signature.'
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'GQYnxmOl910sC76rShXhRk3o';
    const text = `${razorpay_payment_id}|${razorpay_subscription_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Razorpay subscription signature.'
      });
    }

    // Upsert subscription into unified_service_db.subscriptions
    const db = await getUnifiedDb();
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const doc = {
      _id: `rzp_sub_${razorpay_subscription_id}`,
      subscription_id: razorpay_subscription_id,
      source: 'razorpay',
      product_code,
      product_name: subscriptionRepository.resolveProductName(product_code),
      customer_email: customer_email || 'subscriber@direct.com',
      customer_name: customer_name || 'Razorpay Subscriber',
      customer_phone: customer_phone || '',
      workspace,
      tier,
      billing_cycle: 'monthly',
      billing_type: 'individual',
      amount: Number(amount) || 499,
      currency: 'INR',
      status: 'active',
      platform: 'web',
      provider: 'razorpay',
      transaction_id: razorpay_payment_id,
      order_id: razorpay_subscription_id,
      start_date: new Date(),
      expiry_date: expiryDate,
      auto_renew: true,
      created_at: new Date(),
      updated_at: new Date()
    };

    await subscriptionRepository.upsertSubscription(doc, db);

    return res.json({
      success: true,
      message: 'Razorpay Auto-Pay subscription authorized and verified successfully!',
      subscription_id: razorpay_subscription_id,
      status: 'active',
      expiry_date: expiryDate
    });
  } catch (err) {
    console.error('[Razorpay Verify Subscription] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

