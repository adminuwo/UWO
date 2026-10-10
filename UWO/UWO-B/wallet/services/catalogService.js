'use strict';

const crypto = require('crypto');
const { query } = require('../db/pool');

/**
 * Authoritative central pricing catalog for the UWO Ecosystem.
 * All prices are stored and resolved in integer paise (INR).
 * Downstream apps and frontend clients NEVER send trusted rupee amounts.
 */
const CATALOG = {
  aisa: {
    aisa_subscription: {
      basic: { monthly: 0, yearly: 0, name: 'AISA Free / Basic' },
      pro: { monthly: 29900, yearly: 299900, name: 'AISA Pro' },
      ultra: { monthly: 79900, yearly: 799900, name: 'AISA Ultra' },
    },
    quota_topup: {
      credits_100: { one_time: 10000, name: 'AISA 100 Quota Pack' },
      test_spend_30: { one_time: 3000, name: 'AISA Test Spend (₹30)' },
    },
  },
  ai_legal: {
    legal_plan: {
      basic: { monthly: 0, name: 'AI Legal Starter' },
      pro: { monthly: 49900, yearly: 499900, name: 'AI Legal Pro' },
      enterprise: { monthly: 149900, yearly: 1499900, name: 'AI Legal Enterprise' },
      advocate_pack: { one_time: 3000, name: 'AI Legal Advocate Test Pack (₹30)' }, // Specific ₹30 test product
    },
  },
  ai_ads: {
    ads_plan: {
      starter: { monthly: 39900, yearly: 399900, name: 'AI Ads Starter' },
      pro: { monthly: 99900, yearly: 999900, name: 'AI Ads Pro' },
      visual_credits_50: { one_time: 3000, name: 'AI Ads 50 Visual Credits (₹30)' },
    },
  },
  efv: {
    efv_subscription: {
      monthly_pass: { monthly: 29900, name: 'EFV Monthly Pass' },
    },
  },
  ai_mall: {
    mall_pass: {
      standard: { monthly: 19900, name: 'AI Mall Standard' },
    },
  },
  uwoconnect: {
    connect_pass: {
      pro: { monthly: 19900, name: 'UWO Connect Pro' },
    },
  },
};

const CATALOG_VERSION = '2026.10.1';
const DEFAULT_QUOTE_TTL_SECONDS = 15 * 60; // 15 minutes

/**
 * Resolve price in paise from authoritative catalog.
 */
function resolvePrice({ appId, productId, planId, billingCycle = 'monthly', quantity = 1 }) {
  const appCatalog = CATALOG[appId];
  if (!appCatalog) {
    throw new Error(`UNKNOWN_APP: Application "${appId}" is not registered in catalog.`);
  }

  const product = appCatalog[productId];
  if (!product) {
    throw new Error(`UNKNOWN_PRODUCT: Product "${productId}" not found for app "${appId}".`);
  }

  const plan = product[planId];
  if (!plan) {
    throw new Error(`UNKNOWN_PLAN: Plan "${planId}" not found for product "${productId}".`);
  }

  const cyclePrice = plan[billingCycle] !== undefined ? plan[billingCycle] : plan['one_time'];
  if (cyclePrice === undefined) {
    throw new Error(`INVALID_BILLING_CYCLE: Cycle "${billingCycle}" not available for plan "${planId}".`);
  }

  const qty = parseInt(quantity, 10) || 1;
  if (qty < 1) {
    throw new Error('INVALID_QUANTITY: Quantity must be at least 1.');
  }

  const totalPaise = cyclePrice * qty;

  return {
    appId,
    productId,
    planId,
    billingCycle,
    quantity: qty,
    unitPricePaise: cyclePrice,
    amountPaise: totalPaise,
    currency: 'INR',
    productName: plan.name || `${productId} - ${planId}`,
    catalogVersion: CATALOG_VERSION,
  };
}

/**
 * Create an authoritative quote record in PostgreSQL.
 */
async function createQuote({ uwoUserId, appId, productId, planId, billingCycle = 'monthly', quantity = 1, ttlSeconds = DEFAULT_QUOTE_TTL_SECONDS }) {
  const priceInfo = resolvePrice({ appId, productId, planId, billingCycle, quantity });

  const quoteId = `quo_${crypto.randomBytes(16).toString('hex')}`;
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  const insertSql = `
    INSERT INTO wallet_quotes (
      quote_id, uwo_user_id, app_id, product_id, plan_id, billing_cycle,
      quantity, amount_paise, currency, catalog_version, expires_at, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
    RETURNING *;
  `;

  const { rows } = await query(insertSql, [
    quoteId,
    uwoUserId,
    appId,
    productId,
    planId,
    priceInfo.billingCycle,
    priceInfo.quantity,
    priceInfo.amountPaise,
    priceInfo.currency,
    priceInfo.catalogVersion,
    expiresAt,
  ]);

  return {
    ...rows[0],
    amount_rupees: (rows[0].amount_paise / 100).toFixed(2),
  };
}

/**
 * Verify and retrieve an existing quote. Throws if expired or not found.
 */
async function getValidQuote(quoteId, client = null) {
  const sql = `
    SELECT * FROM wallet_quotes
    WHERE quote_id = $1;
  `;
  const runner = client ? client.query.bind(client) : query;
  const { rows } = await runner(sql, [quoteId]);

  if (rows.length === 0) {
    const err = new Error(`QUOTE_NOT_FOUND: Quote ${quoteId} does not exist.`);
    err.code = 'QUOTE_NOT_FOUND';
    err.status = 404;
    throw err;
  }

  const quote = rows[0];
  if (new Date(quote.expires_at) < new Date()) {
    const err = new Error(`QUOTE_EXPIRED: Quote ${quoteId} has expired.`);
    err.code = 'QUOTE_EXPIRED';
    err.status = 410;
    throw err;
  }

  return quote;
}

module.exports = {
  CATALOG,
  CATALOG_VERSION,
  resolvePrice,
  createQuote,
  getValidQuote,
};
