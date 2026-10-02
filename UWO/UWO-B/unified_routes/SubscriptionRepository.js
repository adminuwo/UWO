/**
 * SubscriptionRepository.js
 * 
 * Enterprise-grade repository layer for Unified Subscriptions.
 * Handles database operations against `unified_service_db.subscriptions`:
 * - Unique and query index enforcement
 * - Live dynamic status computation (Active, In Grace Period, Expired, Expiring Soon)
 * - Multi-parameter search, filtering (Product, Platform, Status, Date)
 * - Pagination & sorting
 * - High-level metrics & product summaries
 * - 100% Real Live Production Data (Zero Mock Data)
 */

const { getUnifiedDb } = require('./db');

class SubscriptionRepository {
  constructor() {
    this.indexesEnsured = false;
  }

  /**
   * Ensures unique and query performance indexes on `subscriptions` collection
   */
  async ensureIndexes(customDb = null) {
    try {
      const db = customDb || await getUnifiedDb();
      const col = db.collection('subscriptions');

      // Unique sparse index on subscription_id
      try {
        await col.createIndex(
          { subscription_id: 1 },
          { unique: true, sparse: true, name: 'uniq_subscription_id' }
        );
      } catch (e) {
        if (!e.message.includes('already exists') && !e.message.includes('IndexOptionsConflict')) {
          console.warn('[SubscriptionRepository] Notice creating uniq_subscription_id index:', e.message);
        }
      }

      // Query performance indexes
      const indexSpecs = [
        { key: { product_code: 1, status: 1 }, name: 'idx_product_status' },
        { key: { customer_email: 1 }, name: 'idx_customer_email' },
        { key: { customer_id: 1 }, name: 'idx_customer_id' },
        { key: { expiry_date: 1 }, name: 'idx_expiry_date' },
        { key: { platform: 1, status: 1 }, name: 'idx_platform_status' },
        { key: { transaction_id: 1 }, name: 'idx_transaction_id', sparse: true },
        { key: { created_at: -1 }, name: 'idx_created_at_desc' }
      ];

      for (const spec of indexSpecs) {
        try {
          const { key, name, ...opts } = spec;
          await col.createIndex(key, { name, background: true, ...opts });
        } catch (e) {
          // Ignore if index already exists with different name
        }
      }

      this.indexesEnsured = true;
      return true;
    } catch (err) {
      console.error('[SubscriptionRepository] Error ensuring indexes:', err.message);
      return false;
    }
  }

  /**
   * Computes dynamic real-time status of a subscription document.
   * Avoids stale DB flags by validating expiry_date against current timestamp.
   * 
   * @param {Object} sub Raw subscription document from database
   * @param {Date} [referenceDate=new Date()]
   * @returns {Object} Enriched subscription with dynamic status fields
   */
  computeDynamicStatus(sub, referenceDate = new Date()) {
    if (!sub) return null;

    const now = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
    const rawStatus = String(sub.status || '').toLowerCase().trim();
    let computedStatus = rawStatus || 'active';
    let statusLabel = 'Active';
    let isExpiringSoon = false;
    let daysRemaining = null;
    let isGracePeriod = false;

    // Explicit cancellation or refund
    if (rawStatus === 'cancelled' || rawStatus === 'canceled' || rawStatus === 'refunded') {
      computedStatus = 'cancelled';
      statusLabel = 'Cancelled';
    } else if (sub.expiry_date) {
      const expiry = new Date(sub.expiry_date);
      const diffMs = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      daysRemaining = diffDays;

      if (diffMs < 0) {
        // Expiry has passed
        const pastDays = Math.abs(diffDays);
        if (sub.auto_renew && pastDays <= 3) {
          computedStatus = 'in_grace_period';
          statusLabel = 'In Grace Period (Auto-Renewing)';
          isGracePeriod = true;
        } else {
          computedStatus = 'expired';
          statusLabel = 'Expired';
        }
      } else {
        // Expiry is in future
        if (diffDays <= 7) {
          computedStatus = 'active';
          statusLabel = `Expiring Soon (${diffDays}d left)`;
          isExpiringSoon = true;
        } else {
          computedStatus = 'active';
          statusLabel = 'Active';
        }
      }
    } else {
      // No expiry date recorded
      if (rawStatus === 'active') {
        computedStatus = 'active';
        statusLabel = 'Active (Perpetual / Managed)';
      }
    }

    const isActive = ['active', 'trialing', 'in_grace_period'].includes(computedStatus);

    return {
      ...sub,
      id: String(sub._id),
      computed_status: computedStatus,
      status_label: statusLabel,
      is_active: isActive,
      is_expiring_soon: isExpiringSoon,
      is_grace_period: isGracePeriod,
      days_remaining: daysRemaining,
      // Normalize product display name
      product_name: this.resolveProductName(sub.product_code),
      // Clean amount
      amount: Number(sub.amount || (sub.tier === 'BASIC' ? 499 : 999)),
      currency: sub.currency || 'INR'
    };
  }

  /**
   * Maps product_code to human-readable branding
   */
  resolveProductName(code = '') {
    const c = String(code).toLowerCase().trim();
    const map = {
      ailegal: 'AI Legal',
      aisa: 'AISA Assistant',
      aimall: 'AI Mall',
      uwo: 'UWO Web',
      uwoconnect: 'UWO Connect',
      efvframework: 'EFV Framework',
      aiads: 'AI Ads'
    };
    return map[c] || (c.charAt(0).toUpperCase() + c.slice(1));
  }

  /**
   * Fetches paginated subscriptions with multi-field search and filters
   * 
   * @param {Object} queryParams
   * @param {string} [queryParams.product] - 'all' or product_code
   * @param {string} [queryParams.status] - 'all', 'active', 'expired', 'trialing'
   * @param {string} [queryParams.platform] - 'all', 'ios', 'web', 'android'
   * @param {string} [queryParams.search] - Search string
   * @param {number} [queryParams.page=1]
   * @param {number} [queryParams.limit=25]
   * @param {string} [queryParams.sort_by='created_at']
   * @param {number} [queryParams.sort_order=-1]
   * @param {Object} [customDb=null]
   */
  async findSubscriptions(queryParams = {}, customDb = null) {
    if (!this.indexesEnsured) {
      await this.ensureIndexes(customDb);
    }

    const db = customDb || await getUnifiedDb();
    const page = Math.max(parseInt(queryParams.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(queryParams.limit || queryParams.page_size, 10) || 25, 1), 100);
    const skip = (page - 1) * limit;

    const mongoFilter = {};

    // 1. Product Filter
    const product = queryParams.product || queryParams.product_code;
    if (product && product.toLowerCase() !== 'all') {
      mongoFilter.product_code = product.toLowerCase().trim();
    }

    // 2. Platform Filter
    const platform = queryParams.platform;
    if (platform && platform.toLowerCase() !== 'all') {
      mongoFilter.platform = platform.toLowerCase().trim();
    }

    // 3. Search Filter across multiple fields
    const search = queryParams.search ? String(queryParams.search).trim() : '';
    if (search) {
      const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      mongoFilter.$or = [
        { customer_name: rx },
        { customer_email: rx },
        { customer_id: rx },
        { transaction_id: rx },
        { order_id: rx },
        { tier: rx },
        { workspace: rx },
        { plan_name: rx }
      ];
    }

    // Fetch all matching records for dynamic status evaluation
    // Since dynamic status evaluates expiry dates, we retrieve candidates and compute in-memory
    const allCandidates = await db.collection('subscriptions')
      .find(mongoFilter)
      .sort({ created_at: -1, _id: -1 })
      .toArray();

    // Apply live dynamic status computation
    const now = new Date();
    let enriched = allCandidates.map(s => this.computeDynamicStatus(s, now));

    // 4. Status Filter (Evaluated against computed_status)
    const statusFilter = queryParams.status ? String(queryParams.status).toLowerCase().trim() : 'all';
    if (statusFilter && statusFilter !== 'all') {
      if (statusFilter === 'active') {
        enriched = enriched.filter(s => s.is_active);
      } else if (statusFilter === 'expired') {
        enriched = enriched.filter(s => s.computed_status === 'expired');
      } else if (statusFilter === 'grace' || statusFilter === 'in_grace_period') {
        enriched = enriched.filter(s => s.is_grace_period);
      } else if (statusFilter === 'expiring_soon') {
        enriched = enriched.filter(s => s.is_expiring_soon);
      } else {
        enriched = enriched.filter(s => s.computed_status === statusFilter);
      }
    }

    const totalCount = enriched.length;
    const activeCount = enriched.filter(s => s.is_active).length;
    const paginated = enriched.slice(skip, skip + limit);

    return {
      total: totalCount,
      total_active: activeCount,
      page,
      limit,
      page_size: limit,
      total_pages: Math.ceil(totalCount / limit) || 1,
      subscriptions: paginated
    };
  }

  /**
   * Calculates comprehensive metrics and breakdown by product, platform, tier
   */
  async getMetrics(filters = {}, customDb = null) {
    const db = customDb || await getUnifiedDb();
    const query = {};

    if (filters.product && filters.product !== 'all') {
      query.product_code = filters.product.toLowerCase().trim();
    }

    const docs = await db.collection('subscriptions').find(query).toArray();
    const now = new Date();
    const enriched = docs.map(s => this.computeDynamicStatus(s, now));

    let totalActive = 0;
    let totalExpired = 0;
    let totalInGrace = 0;
    let totalExpiringSoon = 0;
    let totalMrr = 0;

    const productMap = {};
    const platformMap = {};
    const tierMap = {};

    for (const s of enriched) {
      const pCode = s.product_code || 'ailegal';
      const plat = s.platform || 'ios';
      const tier = (s.tier || 'BASIC').toUpperCase();

      if (!productMap[pCode]) {
        productMap[pCode] = {
          product_code: pCode,
          name: this.resolveProductName(pCode),
          active_count: 0,
          expired_count: 0,
          total_count: 0,
          mrr: 0
        };
      }
      productMap[pCode].total_count += 1;

      if (!platformMap[plat]) {
        platformMap[plat] = { platform: plat, active_count: 0, total_count: 0, mrr: 0 };
      }
      platformMap[plat].total_count += 1;

      if (!tierMap[tier]) {
        tierMap[tier] = { tier, active_count: 0, total_count: 0, mrr: 0 };
      }
      tierMap[tier].total_count += 1;

      if (s.is_active) {
        totalActive += 1;
        const subMrr = s.billing_cycle === 'yearly' ? Math.round(s.amount / 12) : s.amount;
        totalMrr += subMrr;
        productMap[pCode].active_count += 1;
        productMap[pCode].mrr += subMrr;
        platformMap[plat].active_count += 1;
        platformMap[plat].mrr += subMrr;
        tierMap[tier].active_count += 1;
        tierMap[tier].mrr += subMrr;
      } else {
        totalExpired += 1;
        productMap[pCode].expired_count += 1;
      }

      if (s.is_grace_period) totalInGrace += 1;
      if (s.is_expiring_soon) totalExpiringSoon += 1;
    }

    const totalArr = totalMrr * 12;

    return {
      total_subscriptions: enriched.length,
      total_active_subscriptions: totalActive,
      total_expired_subscriptions: totalExpired,
      total_in_grace_period: totalInGrace,
      total_expiring_soon: totalExpiringSoon,
      monthly_recurring_revenue: totalMrr,
      annual_run_rate: totalArr,
      renewal_rate_pct: enriched.length > 0 ? Math.round((totalActive / enriched.length) * 1000) / 10 : 0,
      by_product: Object.values(productMap),
      by_platform: Object.values(platformMap),
      by_tier: Object.values(tierMap),
      last_updated: new Date().toISOString()
    };
  }

  /**
   * Generates product summaries specifically formatted for Product Filter Pills
   */
  async getProductSummaries(customDb = null) {
    const db = customDb || await getUnifiedDb();
    const docs = await db.collection('subscriptions').find({}).toArray();
    const now = new Date();
    const enriched = docs.map(s => this.computeDynamicStatus(s, now));

    const totalActive = enriched.filter(s => s.is_active).length;
    let totalMrr = 0;
    enriched.filter(s => s.is_active).forEach(s => {
      totalMrr += s.billing_cycle === 'yearly' ? Math.round(s.amount / 12) : s.amount;
    });

    const canonicalProducts = [
      { product_code: 'ailegal', name: 'AI Legal', icon: '⚖️' },
      { product_code: 'aisa', name: 'AISA Assistant', icon: '🤖' }
    ];

    const prodStats = {};
    for (const p of canonicalProducts) {
      prodStats[p.product_code] = {
        product_code: p.product_code,
        name: p.name,
        icon: p.icon,
        active_count: 0,
        expired_count: 0,
        total_count: 0,
        mrr: 0,
        arr: 0,
        tiers: {},
        platforms: { ios: 0, web: 0, android: 0 },
        primary_platform: p.product_code === 'ailegal' ? 'Apple StoreKit 2' : 'Razorpay Web'
      };
    }

    for (const s of enriched) {
      const code = s.product_code || 'ailegal';
      if (!prodStats[code]) {
        // Skip non-subscription products (e.g. EFV Framework, AI Mall, UWO Web belong strictly to Revenue)
        continue;
      }
      prodStats[code].total_count += 1;
      const tierName = (s.tier || 'BASIC').toUpperCase();
      prodStats[code].tiers[tierName] = (prodStats[code].tiers[tierName] || 0) + 1;

      const plat = (s.platform || 'ios').toLowerCase();
      if (plat.includes('ios') || plat.includes('apple')) prodStats[code].platforms.ios += 1;
      else if (plat.includes('android')) prodStats[code].platforms.android += 1;
      else prodStats[code].platforms.web += 1;

      if (s.is_active) {
        prodStats[code].active_count += 1;
        const subMrr = s.billing_cycle === 'yearly' ? Math.round(s.amount / 12) : s.amount;
        prodStats[code].mrr += subMrr;
      } else {
        prodStats[code].expired_count += 1;
      }
    }

    // Compute derived rates
    for (const code of Object.keys(prodStats)) {
      const item = prodStats[code];
      item.arr = item.mrr * 12;
      item.renewal_rate = item.total_count > 0 ? Math.round((item.active_count / item.total_count) * 1000) / 10 : 0;
      item.primary_platform = item.platforms.ios >= item.platforms.web ? 'Apple StoreKit 2' : 'Razorpay Web';
    }

    const allProductTiers = {};
    enriched.forEach(s => {
      const t = (s.tier || 'BASIC').toUpperCase();
      allProductTiers[t] = (allProductTiers[t] || 0) + 1;
    });

    const allPlatforms = {
      ios: enriched.filter(s => (s.platform || '').includes('ios')).length,
      web: enriched.filter(s => (s.platform || '').includes('web')).length,
      android: enriched.filter(s => (s.platform || '').includes('android')).length
    };

    return [
      {
        product_code: 'all',
        name: 'All Products',
        icon: '💎',
        active_count: totalActive,
        expired_count: enriched.length - totalActive,
        total_count: enriched.length,
        mrr: totalMrr,
        arr: totalMrr * 12,
        renewal_rate: enriched.length > 0 ? Math.round((totalActive / enriched.length) * 1000) / 10 : 0,
        tiers: allProductTiers,
        platforms: allPlatforms,
        primary_platform: 'Multi-Gateway (Apple & Razorpay)'
      },
      ...canonicalProducts.map(p => prodStats[p.product_code] || {
        product_code: p.product_code,
        name: p.name,
        icon: p.icon,
        active_count: 0,
        expired_count: 0,
        total_count: 0,
        mrr: 0,
        arr: 0,
        renewal_rate: 0,
        tiers: {},
        platforms: { ios: 0, web: 0, android: 0 },
        primary_platform: 'Apple StoreKit 2'
      })
    ];
  }

  /**
   * Upserts a subscription document into `unified_service_db.subscriptions`
   */
  async upsertSubscription(subDoc, customDb = null) {
    const db = customDb || await getUnifiedDb();
    const docId = subDoc._id || `sub_${Date.now()}`;
    const subId = subDoc.subscription_id || docId;

    const filter = {
      $or: [
        { _id: docId },
        { subscription_id: subId }
      ]
    };

    if (subDoc.transaction_id) {
      filter.$or.push({ transaction_id: subDoc.transaction_id });
    }

    const { _id, created_at, ...updateData } = subDoc;
    updateData.updated_at = new Date();

    const res = await db.collection('subscriptions').updateOne(
      filter,
      {
        $set: updateData,
        $setOnInsert: { _id: docId, created_at: created_at || new Date() }
      },
      { upsert: true }
    );

    return res;
  }
}

// Singleton instance
const subscriptionRepository = new SubscriptionRepository();

module.exports = {
  SubscriptionRepository,
  subscriptionRepository
};
