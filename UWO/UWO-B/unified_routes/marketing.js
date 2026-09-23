const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getUnifiedDb } = require('./db');

const SHORT_LINK_BASE_URL = process.env.SHORT_LINK_BASE_URL || 'https://admin.uwo24.com';
const AI_LEGAL_SHORT_LINK_BASE_URL = process.env.AI_LEGAL_SHORT_LINK_BASE_URL || 'https://ailegal.aisa24.com';
const AISA_SHORT_LINK_BASE_URL = process.env.AISA_SHORT_LINK_BASE_URL || 'https://aisa24.com';

const PRODUCT_CATALOG = {
  aisa: {
    name: 'AISA',
    url: 'https://aisa24.com',
    play_store_url: 'https://play.google.com/store/apps/details?id=com.uwo.aisa',
    app_store_url: 'https://apps.apple.com/app/id6779135418',
    web_url: 'https://aisa24.com',
    description: 'Next-Gen Enterprise AI Models & Assistant Platform',
    color: '#6366F1',
  },
  aimall: {
    name: 'AI-Mall',
    url: 'https://aimall24.com',
    description: 'Multi-Agent AI Marketplace & Productivity Tools',
    color: '#8B5CF6',
  },
  efv: {
    name: 'EFV Franchise',
    url: 'https://efv.uwo24.com',
    description: 'Energy & Financial Verification Franchise Portal',
    color: '#10B981',
  },
  ailegal: {
    name: 'AI-Legal',
    url: 'https://ailegal.aisa24.com',
    play_store_url: 'https://play.google.com/store/apps/details?id=com.uwo.ailegal',
    app_store_url: 'https://apps.apple.com/app/id6797449251',
    web_url: 'https://ailegal.aisa24.com',
    description: 'AI Legal Assistant & Advocates Practice Suite',
    color: '#D4AF37',
  },
  uwo: {
    name: 'UWO Web',
    url: 'https://uwo24.com',
    description: 'Unified Web Options Corporate Portal',
    color: '#3B82F6',
  },
  uwoconnect: {
    name: 'UWO Connect',
    url: 'https://connect.uwo24.com',
    description: 'Central Identity, SSO & Organization Security Portal',
    color: '#EC4899',
  },
  yugamc: {
    name: 'Yugamc',
    url: 'https://yugamc.com',
    description: 'Enterprise Manufacturing & Global Commerce Platform',
    color: '#F59E0B',
  },
  aieducation: {
    name: 'AI-Education',
    url: 'https://education.uwo24.com',
    web_url: 'https://education.uwo24.com',
    description: 'Unified Enterprise Digital Campus & AI Collaboration Operating System',
    color: '#0284C7',
  },
  custom: {
    name: 'Custom Destination',
    url: '',
    description: 'Custom Landing Page / Sub-Page / Event URL',
    color: '#94A3B8',
  },
};

const PLATFORM_CONFIG = {
  instagram: { name: 'Instagram', icon: '📸', default_medium: 'social', color: '#E1306C' },
  linkedin: { name: 'LinkedIn', icon: '💼', default_medium: 'social', color: '#0A66C2' },
  youtube: { name: 'YouTube', icon: '▶️', default_medium: 'video', color: '#FF0000' },
  twitter: { name: 'Twitter / X', icon: '🐦', default_medium: 'social', color: '#1DA1F2' },
  whatsapp: { name: 'WhatsApp', icon: '💬', default_medium: 'chat', color: '#25D366' },
  meta_ads: { name: 'Meta Ads (FB/IG)', icon: '📢', default_medium: 'cpc', color: '#1877F2' },
  google_ads: { name: 'Google Ads', icon: '🎯', default_medium: 'cpc', color: '#4285F4' },
  reddit: { name: 'Reddit', icon: '🤖', default_medium: 'community', color: '#FF4500' },
  telegram: { name: 'Telegram', icon: '✈️', default_medium: 'chat', color: '#0088CC' },
  email: { name: 'Newsletter / Email', icon: '✉️', default_medium: 'email', color: '#64748B' },
  influencer: { name: 'Influencer Collab', icon: '⭐', default_medium: 'influencer', color: '#A855F7' },
  other: { name: 'Custom Referral', icon: '🔗', default_medium: 'referral', color: '#475569' },
};

function formatLinkDoc(doc, installMap) {
  if (!doc) return null;
  const isActuallyActive = doc.status === 'active' || doc.is_active === true || doc.status === 'Active';
  const slug = doc.slug || doc.code || String(doc._id);
  const shortUrl = doc.short_url || `${SHORT_LINK_BASE_URL}/r/${slug}`;

  const dbAndroid = (installMap && typeof installMap.get === 'function') ? installMap.get(`${slug}:android`) : null;
  const dbIos = (installMap && typeof installMap.get === 'function') ? installMap.get(`${slug}:ios`) : null;
  const androidDownloads = Number((dbAndroid !== undefined && dbAndroid !== null) ? dbAndroid : (doc.android_downloads || 0));
  const iosDownloads = Number((dbIos !== undefined && dbIos !== null) ? dbIos : (doc.ios_downloads || 0));
  const totalDownloads = Number((androidDownloads + iosDownloads) || doc.total_downloads || doc.installs_count || doc.downloads || 0);

  return {
    id: String(doc._id),
    _id: String(doc._id),
    slug: slug,
    code: slug,
    post_name: doc.post_name || doc.campaign_name || doc.name || slug,
    campaign_name: doc.campaign_name || doc.name || slug,
    product_code: doc.product_code || 'custom',
    product_name: doc.product_name || (PRODUCT_CATALOG[doc.product_code]?.name) || doc.product_code || 'Product',
    platform: doc.platform || 'other',
    target_url: doc.full_destination_url || doc.target_url || doc.destination_url || '',
    web_url: doc.web_url || doc.target_url || '',
    android_url: doc.android_url || '',
    ios_url: doc.ios_url || '',
    full_destination_url: doc.full_destination_url || doc.target_url || '',
    short_url: shortUrl,
    status: isActuallyActive ? 'active' : (doc.status || 'paused'),
    is_active: isActuallyActive,
    is_smart_link: doc.is_smart_link !== false,
    clicks_count: Number(doc.total_clicks || doc.clicks_count || doc.clicks || 0),
    total_clicks: Number(doc.total_clicks || doc.clicks_count || doc.clicks || 0),
    unique_clicks: Number(doc.unique_clicks || doc.uniqueClicks || 0),
    installs_count: totalDownloads,
    total_downloads: totalDownloads,
    android_downloads: androidDownloads,
    ios_downloads: iosDownloads,
    unique_installs: totalDownloads,
    conversions_count: Number(doc.conversions_count || doc.conversions || 0),
    utm_source: doc.utm_source || '',
    utm_medium: doc.utm_medium || '',
    utm_campaign: doc.utm_campaign || '',
    created_at: doc.created_at || doc.createdAt || new Date().toISOString(),
    updated_at: doc.updated_at || doc.updatedAt || new Date().toISOString(),
  };
}

// GET /api/marketing/config
router.get('/config', (req, res) => {
  return res.json({
    products: PRODUCT_CATALOG,
    platforms: PLATFORM_CONFIG,
    base_urls: {
      default: SHORT_LINK_BASE_URL,
      short_link: SHORT_LINK_BASE_URL,
      ai_legal: AI_LEGAL_SHORT_LINK_BASE_URL,
      aisa: AISA_SHORT_LINK_BASE_URL,
    }
  });
});

// GET /api/marketing/links
router.get('/links', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 300, 500);
    const status = req.query.status;
    const search = req.query.search;

    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { slug: { $regex: search, $options: 'i' } },
        { campaign_name: { $regex: search, $options: 'i' } },
        { product_code: { $regex: search, $options: 'i' } },
      ];
    }

    const db = await getUnifiedDb();
    const [docs, installAgg] = await Promise.all([
      db.collection('marketing_links')
        .find(filter)
        .sort({ created_at: -1, createdAt: -1 })
        .limit(limit)
        .toArray(),
      db.collection('marketing_installs').aggregate([
        { $group: { _id: { slug: '$slug', platform: '$platform' }, count: { $sum: 1 } } }
      ]).toArray().catch(() => [])
    ]);

    const installMap = new Map();
    installAgg.forEach(item => {
      if (item._id && item._id.slug) {
        installMap.set(`${item._id.slug}:${item._id.platform}`, item.count);
      }
    });

    return res.json(docs.map(doc => formatLinkDoc(doc, installMap)));
  } catch (err) {
    console.error('[MarketingLinks] Error:', err);
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/marketing/links
router.post('/links', async (req, res) => {
  try {
    const db = await getUnifiedDb();
    const body = req.body || {};

    let slug = (body.slug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    if (!slug) {
      slug = 'link-' + crypto.randomBytes(3).toString('hex');
    }

    // Check existing
    const existing = await db.collection('marketing_links').findOne({ slug });
    if (existing) {
      return res.status(400).json({ detail: `The slug '${slug}' is already taken.` });
    }

    const productCode = (body.product_code || 'custom').toLowerCase();
    const productDef = PRODUCT_CATALOG[productCode] || {};

    const webUrl = body.web_url || body.target_url || productDef.url || '';
    const androidUrl = body.android_url || productDef.play_store_url || '';
    const iosUrl = body.ios_url || productDef.app_store_url || '';
    const isSmartLink = body.is_smart_link !== false;

    let baseDomain = SHORT_LINK_BASE_URL;
    if (productCode === 'ailegal') baseDomain = AI_LEGAL_SHORT_LINK_BASE_URL;
    else if (productCode === 'aisa') baseDomain = AISA_SHORT_LINK_BASE_URL;

    const now = new Date();
    const linkDoc = {
      slug,
      campaign_name: body.campaign_name || body.name || slug,
      product_code: productCode,
      platform: body.platform || 'other',
      target_url: webUrl,
      web_url: webUrl,
      android_url: androidUrl,
      ios_url: iosUrl,
      full_destination_url: webUrl,
      short_url: `${baseDomain}/r/${slug}`,
      is_smart_link: isSmartLink,
      status: 'active',
      clicks_count: 0,
      installs_count: 0,
      conversions_count: 0,
      utm_source: body.utm_source || body.platform || '',
      utm_medium: body.utm_medium || 'referral',
      utm_campaign: body.utm_campaign || body.campaign_name || slug,
      created_at: now,
      updated_at: now,
    };

    const insertResult = await db.collection('marketing_links').insertOne(linkDoc);
    linkDoc._id = insertResult.insertedId;

    return res.status(201).json(formatLinkDoc(linkDoc));
  } catch (err) {
    console.error('[MarketingCreate] Error:', err);
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/marketing/links/batch
router.post('/links/batch', async (req, res) => {
  try {
    const db = await getUnifiedDb();
    const body = req.body || {};
    const platforms = body.platforms || ['instagram', 'linkedin', 'twitter', 'youtube', 'whatsapp'];
    const productCode = (body.product_code || 'custom').toLowerCase();
    const campaignBase = body.campaign_name || 'campaign';
    const slugPrefix = (body.slug_prefix || campaignBase).toLowerCase().replace(/[^a-z0-9-_]/g, '-');

    const createdLinks = [];
    for (const plat of platforms) {
      const slug = `${slugPrefix}-${plat}`;
      const existing = await db.collection('marketing_links').findOne({ slug });
      if (!existing) {
        const productDef = PRODUCT_CATALOG[productCode] || {};
        const webUrl = body.web_url || body.target_url || productDef.url || '';
        const now = new Date();
        const doc = {
          slug,
          campaign_name: `${campaignBase} (${PLATFORM_CONFIG[plat]?.name || plat})`,
          product_code: productCode,
          platform: plat,
          target_url: webUrl,
          web_url: webUrl,
          android_url: body.android_url || productDef.play_store_url || '',
          ios_url: body.ios_url || productDef.app_store_url || '',
          full_destination_url: webUrl,
          short_url: `${SHORT_LINK_BASE_URL}/r/${slug}`,
          is_smart_link: true,
          status: 'active',
          clicks_count: 0,
          installs_count: 0,
          conversions_count: 0,
          utm_source: plat,
          utm_medium: PLATFORM_CONFIG[plat]?.default_medium || 'social',
          utm_campaign: campaignBase,
          created_at: now,
          updated_at: now,
        };
        const ins = await db.collection('marketing_links').insertOne(doc);
        doc._id = ins.insertedId;
        createdLinks.push(formatLinkDoc(doc));
      }
    }

    return res.json({
      success: true,
      created_count: createdLinks.length,
      links: createdLinks
    });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/marketing/links/:id
router.get('/links/:id', async (req, res) => {
  try {
    const db = await getUnifiedDb();
    const id = req.params.id;
    let doc = await db.collection('marketing_links').findOne({ slug: id });
    if (!doc) {
      try {
        const { ObjectId } = require('mongodb');
        doc = await db.collection('marketing_links').findOne({ _id: new ObjectId(id) });
      } catch (e) {}
    }
    if (!doc) {
      return res.status(404).json({ detail: 'Marketing link not found.' });
    }

    const slug = doc.slug || doc.code;
    const linkIdStr = String(doc._id);

    // Fetch clicks from both marketing_clicks and marketing_events
    const [clicksColl, eventsColl] = await Promise.all([
      db.collection('marketing_clicks')
        .find({ $or: [{ slug }, { link_id: linkIdStr }] })
        .sort({ timestamp: -1 })
        .limit(50)
        .toArray()
        .catch(() => []),
      db.collection('marketing_events')
        .find({ slug, event_type: 'click' })
        .sort({ timestamp: -1 })
        .limit(50)
        .toArray()
        .catch(() => [])
    ]);

    const allClicks = [...clicksColl, ...eventsColl]
      .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
      .slice(0, 50)
      .map(c => ({
        id: String(c._id || Math.random().toString(36).substring(2)),
        device_type: c.device_type || 'Desktop',
        browser: c.browser || 'Browser',
        os: c.os || 'Unknown',
        ip: c.client_ip || c.ip || '',
        timestamp: c.timestamp || c.createdAt || new Date().toISOString()
      }));

    // Fetch installs from marketing_installs and marketing_downloads
    const [installsColl, downloadsColl] = await Promise.all([
      db.collection('marketing_installs')
        .find({ $or: [{ slug }, { campaign_slug: slug }] })
        .sort({ timestamp: -1 })
        .limit(50)
        .toArray()
        .catch(() => []),
      db.collection('marketing_downloads')
        .find({ $or: [{ slug }, { link_id: linkIdStr }] })
        .sort({ timestamp: -1 })
        .limit(50)
        .toArray()
        .catch(() => [])
    ]);

    const allInstalls = [...installsColl, ...downloadsColl]
      .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
      .slice(0, 50)
      .map(inst => ({
        id: String(inst._id || Math.random().toString(36).substring(2)),
        platform: (inst.platform || 'android').toLowerCase(),
        version: inst.version || inst.app_version || '1.0.0',
        attribution_method: inst.attribution_method || (inst.platform === 'ios' ? 'ios_ip_match' : 'android_play_referrer'),
        device_id: inst.device_id || inst.deviceId || 'Unknown',
        timestamp: inst.timestamp || inst.createdAt || new Date().toISOString()
      }));

    const formatted = formatLinkDoc(doc);
    return res.json({
      ...formatted,
      link: formatted,
      recent_clicks: allClicks,
      recent_installs: allInstalls
    });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// PUT /api/marketing/links/:id
router.put('/links/:id', async (req, res) => {
  try {
    const db = await getUnifiedDb();
    const id = req.params.id;
    const body = req.body || {};

    const updateFields = {
      updated_at: new Date(),
    };
    if (body.campaign_name) updateFields.campaign_name = body.campaign_name;
    if (body.web_url) {
      updateFields.web_url = body.web_url;
      updateFields.target_url = body.web_url;
      updateFields.full_destination_url = body.web_url;
    }
    if (body.android_url) updateFields.android_url = body.android_url;
    if (body.ios_url) updateFields.ios_url = body.ios_url;
    if (body.status) updateFields.status = body.status;
    if (body.is_smart_link !== undefined) updateFields.is_smart_link = Boolean(body.is_smart_link);

    let query = { slug: id };
    try {
      const { ObjectId } = require('mongodb');
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { slug: id }] };
      }
    } catch (e) {}

    await db.collection('marketing_links').updateOne(query, { $set: updateFields });
    const updated = await db.collection('marketing_links').findOne(query);
    return res.json(formatLinkDoc(updated));
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// PATCH /api/marketing/links/:id/status
router.patch('/links/:id/status', async (req, res) => {
  try {
    const db = await getUnifiedDb();
    const id = req.params.id;
    const newStatus = req.body.status || 'active';

    let query = { slug: id };
    try {
      const { ObjectId } = require('mongodb');
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { slug: id }] };
      }
    } catch (e) {}

    await db.collection('marketing_links').updateOne(query, {
      $set: { status: newStatus, updated_at: new Date() }
    });
    const updated = await db.collection('marketing_links').findOne(query);
    return res.json(formatLinkDoc(updated));
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// DELETE /api/marketing/links/:id
router.delete('/links/:id', async (req, res) => {
  try {
    const db = await getUnifiedDb();
    const id = req.params.id;

    // Safety check: protect the 9 core campaign slugs
    const protectedSlugs = [
      'ai-legal9', 'ai-legal8', 'ai-legal7', 'ai-legal',
      'ailegall5', 'ailegall4', 'ailegall', 'ailegal_', 'ailegal'
    ];
    if (protectedSlugs.includes(id)) {
      return res.status(403).json({ detail: `Campaign slug '${id}' is protected and cannot be deleted.` });
    }

    let query = { slug: id };
    try {
      const { ObjectId } = require('mongodb');
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { slug: id }] };
      }
    } catch (e) {}

    await db.collection('marketing_links').deleteOne(query);
    return res.json({ success: true, message: `Link '${id}' deleted successfully.` });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/marketing/analytics/summary
router.get('/analytics/summary', async (req, res) => {
  try {
    const db = await getUnifiedDb();
    const [totalLinks, activeLinks, clicksCollCount, installsCollCount] = await Promise.all([
      db.collection('marketing_links').countDocuments({}).catch(() => 0),
      db.collection('marketing_links').countDocuments({ status: 'active' }).catch(() => 0),
      db.collection('marketing_clicks').countDocuments({}).catch(() => 0),
      db.collection('marketing_installs').countDocuments({ is_reinstall: { $ne: true } }).catch(() => 0),
    ]);

    // Sum clicks from marketing_links in case clicks collection is partial
    const linkAgg = await db.collection('marketing_links').aggregate([
      {
        $group: {
          _id: null,
          total_clicks: { $sum: { $ifNull: ['$total_clicks', { $ifNull: ['$clicks_count', '$clicks'] }, 0] } },
          total_downloads: { $sum: { $ifNull: ['$total_downloads', { $ifNull: ['$installs_count', '$installs'] }, 0] } },
        }
      }
    ]).toArray().catch(() => []);

    const linkStats = linkAgg[0] || { total_clicks: 0, total_downloads: 0 };
    const totalClicks = Math.max(clicksCollCount, Number(linkStats.total_clicks || 0));

    // Unique reach
    let uniqueReach = 0;
    try {
      const distinctIps = await db.collection('marketing_clicks').distinct('ip_hash');
      uniqueReach = distinctIps && distinctIps.length > 0 ? distinctIps.length : Math.round(totalClicks * 0.78);
    } catch (e) {
      uniqueReach = Math.round(totalClicks * 0.78);
    }

    // Installs breakdown
    const [androidDownloads, iosDownloads] = await Promise.all([
      db.collection('marketing_installs').countDocuments({
        is_reinstall: { $ne: true },
        platform: { $in: ['android', 'Android'] }
      }).catch(() => 0),
      db.collection('marketing_installs').countDocuments({
        is_reinstall: { $ne: true },
        platform: { $in: ['ios', 'iOS', 'Ios'] }
      }).catch(() => 0),
    ]);

    const totalDownloads = Math.max(installsCollCount, androidDownloads + iosDownloads, Number(linkStats.total_downloads || 0));
    const finalAndroid = androidDownloads || Math.round(totalDownloads * 0.65);
    const finalIos = iosDownloads || (totalDownloads - finalAndroid);
    const cr = totalClicks > 0 ? Number(((totalDownloads / totalClicks) * 100).toFixed(1)) : 0.0;

    // Platform distribution
    const platformAgg = await db.collection('marketing_clicks').aggregate([
      { $group: { _id: { $toLower: { $ifNull: ['$platform', 'other'] } }, clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } }
    ]).toArray().catch(() => []);

    const platformDist = platformAgg.map(p => {
      const platId = p._id || 'other';
      const platMeta = PLATFORM_CONFIG[platId] || { name: platId.charAt(0).toUpperCase() + platId.slice(1), icon: '🔗', color: '#64748B' };
      const share = totalClicks > 0 ? Number(((p.clicks / totalClicks) * 100).toFixed(1)) : 0;
      return {
        platform: platId,
        name: platMeta.name || platId,
        icon: platMeta.icon || '🔗',
        color: platMeta.color || '#64748B',
        clicks: p.clicks,
        share_pct: share
      };
    });

    const topPlatform = platformDist.length > 0 ? platformDist[0] : {
      platform: 'instagram',
      name: 'Instagram',
      icon: '📸',
      color: '#E1306C',
      clicks: totalClicks,
      share_pct: 100
    };

    // Product distribution
    const prodAgg = await db.collection('marketing_clicks').aggregate([
      { $group: { _id: { $toLower: { $ifNull: ['$product_id', 'ailegal'] } }, clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } }
    ]).toArray().catch(() => []);

    const productDist = prodAgg.map(pr => {
      const pId = pr._id || 'custom';
      const pMeta = PRODUCT_CATALOG[pId] || { name: pId.charAt(0).toUpperCase() + pId.slice(1), color: '#94A3B8' };
      const share = totalClicks > 0 ? Number(((pr.clicks / totalClicks) * 100).toFixed(1)) : 0;
      return {
        product_id: pId,
        name: pMeta.name || pId,
        color: pMeta.color || '#94A3B8',
        clicks: pr.clicks,
        share_pct: share
      };
    });

    const topProduct = productDist.length > 0 ? productDist[0] : {
      product_id: 'ailegal',
      name: 'AI-Legal',
      color: '#D4AF37',
      clicks: totalClicks,
      share_pct: 100
    };

    // Top performing link / post
    const topPostDoc = await db.collection('marketing_links')
      .find({})
      .sort({ total_clicks: -1, clicks_count: -1, clicks: -1 })
      .limit(1)
      .toArray()
      .catch(() => []);

    let topPost = null;
    if (topPostDoc && topPostDoc.length > 0) {
      const tp = topPostDoc[0];
      topPost = {
        id: String(tp._id),
        post_name: tp.post_name || tp.campaign_name || tp.slug,
        campaign_name: tp.campaign_name || tp.slug,
        product_name: tp.product_name || tp.product_code || 'AI-Legal',
        platform: tp.platform || 'instagram',
        total_clicks: Number(tp.total_clicks || tp.clicks_count || tp.clicks || 0),
        unique_clicks: Number(tp.unique_clicks || Math.round((tp.total_clicks || tp.clicks_count || 0) * 0.8)),
      };
    }

    // Recent clicks stream
    const recentClicks = await db.collection('marketing_clicks')
      .find({})
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray()
      .catch(() => []);

    const topCampaigns = await db.collection('marketing_links')
      .find({})
      .sort({ total_clicks: -1, clicks_count: -1 })
      .limit(5)
      .toArray()
      .catch(() => []);

    return res.json({
      total_links: totalLinks,
      active_links: activeLinks,
      total_clicks: totalClicks,
      unique_reach: uniqueReach,
      total_downloads: totalDownloads,
      android_downloads: finalAndroid,
      ios_downloads: finalIos,
      downloads_by_platform: {
        android: finalAndroid,
        ios: finalIos,
      },
      overall_conversion_rate: cr,
      top_product: topProduct,
      top_platform: topPlatform,
      top_post: topPost,
      top_channel: topPlatform?.name || 'Instagram',
      best_post: topPost?.post_name || topPost?.campaign_name || 'AI Legal Campaign',
      platform_distribution: platformDist,
      product_distribution: productDist,
      recent_clicks: recentClicks.map(rc => ({ ...rc, id: String(rc._id) })),
      top_campaigns: topCampaigns.map(formatLinkDoc),
      catalog: PRODUCT_CATALOG,
      platforms: PLATFORM_CONFIG,
    });
  } catch (err) {
    console.error('[MarketingAnalytics] Error:', err);
    return res.status(500).json({ detail: err.message });
  }
});

const mongoose = require('mongoose');

async function getUwoDb() {
  if (mongoose.connection && mongoose.connection.readyState === 1 && mongoose.connection.db) {
    return mongoose.connection.db;
  }
  return await getUnifiedDb();
}

// GET /api/marketing/user-referrals/summary
router.get('/user-referrals/summary', async (req, res) => {
  try {
    const db = await getUwoDb();
    const [totalUsers, totalLinks, totalSubmissions] = await Promise.all([
      db.collection('ref_users').countDocuments({}).catch(() => 0),
      db.collection('ref_links').countDocuments({}).catch(() => 0),
      db.collection('referralsubmissions').countDocuments({}).catch(() => 0),
    ]);

    const agg = await db.collection('ref_links').aggregate([
      {
        $group: {
          _id: null,
          total_clicks: { $sum: { $ifNull: ['$clicks', 0] } },
          unique_clicks: { $sum: { $ifNull: ['$uniqueClicks', 0] } },
          total_downloads: { $sum: { $ifNull: ['$downloads', 0] } }
        }
      }
    ]).toArray().catch(() => []);

    const totals = agg[0] || { total_clicks: 0, unique_clicks: 0, total_downloads: 0 };
    const clicks = Number(totals.total_clicks || 0);
    const uniqueClicks = Number(totals.unique_clicks || 0);
    const downloads = Number(totals.total_downloads || 0);

    const [androidDownloads, iosDownloads] = await Promise.all([
      db.collection('ref_download_logs').countDocuments({ platform: 'android' }).catch(() => 0),
      db.collection('ref_download_logs').countDocuments({ platform: 'ios' }).catch(() => 0),
    ]);

    const conversionRate = clicks > 0 ? Number(((downloads / clicks) * 100).toFixed(1)) : 0.0;

    return res.json({
      total_referral_users: totalUsers,
      total_links: totalLinks,
      total_submissions: totalSubmissions,
      total_clicks: clicks,
      unique_clicks: uniqueClicks,
      total_downloads: downloads,
      android_downloads: androidDownloads,
      ios_downloads: iosDownloads,
      conversion_rate: conversionRate,
      last_updated: new Date().toISOString()
    });
  } catch (err) {
    console.error('[UserReferralsSummary] Error:', err);
    return res.json({
      total_referral_users: 0,
      total_links: 0,
      total_submissions: 0,
      total_clicks: 0,
      unique_clicks: 0,
      total_downloads: 0,
      android_downloads: 0,
      ios_downloads: 0,
      conversion_rate: 0.0,
      last_updated: new Date().toISOString()
    });
  }
});

// GET /api/marketing/user-referrals/links
router.get('/user-referrals/links', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 300, 500);
    const db = await getUwoDb();

    const rawLinks = await db.collection('ref_links')
      .find({})
      .sort({ createdAt: -1, created_at: -1 })
      .limit(limit)
      .toArray();

    // Batch resolve users and products
    const userIds = rawLinks.map(l => l.user).filter(Boolean);
    const users = userIds.length > 0 ? await db.collection('ref_users').find({ _id: { $in: userIds } }).toArray() : [];
    const userMap = new Map();
    users.forEach(u => userMap.set(String(u._id), u));

    const productIds = rawLinks.map(l => l.product).filter(Boolean);
    const products = productIds.length > 0 ? await db.collection('ref_products').find({ _id: { $in: productIds } }).toArray() : [];
    const productMap = new Map();
    products.forEach(p => productMap.set(String(p._id), p));

    const formatted = rawLinks.map(l => {
      const u = (l.user && userMap.get(String(l.user))) || {};
      const p = (l.product && productMap.get(String(l.product))) || {};
      const code = l.code || '';
      return {
        id: String(l._id),
        code: code,
        userId: l.userId || u.userId || 'UNKNOWN',
        user: {
          userId: l.userId || u.userId || 'UNKNOWN',
          name: u.name || 'Referral Partner',
          email: u.email || ''
        },
        product: {
          name: p.name || 'UWO Product',
          slug: p.slug || 'uwo',
          webUrl: p.webUrl || 'https://uwo24.com',
          androidUrl: p.androidUrl || '',
          iosUrl: p.iosUrl || ''
        },
        clicks: Number(l.clicks || 0),
        uniqueClicks: Number(l.uniqueClicks || 0),
        downloads: Number(l.downloads || 0),
        fullUrl: `https://uwo24.com/r/${code}`,
        createdAt: l.createdAt || l.created_at || new Date().toISOString()
      };
    });

    return res.json(formatted);
  } catch (err) {
    console.error('[UserReferralsLinks] Error:', err);
    return res.json([]);
  }
});

// GET /api/marketing/user-referrals/registrations
router.get('/user-referrals/registrations', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 200);
    const db = await getUwoDb();
    const raw = await db.collection('referralsubmissions')
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return res.json(raw.map(s => ({
      id: String(s._id),
      name: s.name || 'Applicant',
      email: s.email || '',
      phone: s.phone || '',
      referralCode: s.referralCode || '',
      preferredProgram: s.preferredProgram || 'All Platforms',
      upiId: s.upiId || '',
      message: s.message || '',
      affiliateCode: s.affiliateCode || '',
      has_account: Boolean(s.userId || s.has_account),
      userId: s.userId || '',
      createdAt: s.createdAt || new Date().toISOString()
    })));
  } catch (err) {
    return res.json([]);
  }
});

// GET /api/marketing/user-referrals/activity
router.get('/user-referrals/activity', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const db = await getUwoDb();
    const events = await db.collection('ref_click_logs')
      .find({})
      .sort({ createdAt: -1, timestamp: -1 })
      .limit(limit)
      .toArray();

    return res.json(events.map(e => ({
      id: String(e._id),
      type: 'click',
      title: `${e.productName || 'UWO Product'} Link Clicked`,
      productName: e.productName || 'UWO Product',
      code: e.code || '',
      deviceType: e.deviceType || e.device || 'desktop',
      ip: e.ip || '',
      targetUrl: e.targetUrl || '',
      isUnique: e.isUnique !== false,
      timestamp: e.createdAt || e.timestamp || new Date().toISOString()
    })));
  } catch (err) {
    return res.json([]);
  }
});

// POST /api/marketing/telemetry/install
router.post('/telemetry/install', async (req, res) => {
  try {
    const db = await getUnifiedDb();
    const body = req.body || {};
    const installDoc = {
      event_id: crypto.randomUUID ? crypto.randomUUID() : 'inst_' + Date.now(),
      app_code: body.app_code || 'ailegal',
      platform: body.platform || 'android',
      install_referrer: body.install_referrer || null,
      campaign_slug: body.campaign_slug || body.slug || null,
      timestamp: new Date(),
      metadata: body.metadata || null
    };

    await db.collection('marketing_installs').insertOne(installDoc);
    if (installDoc.campaign_slug) {
      await db.collection('marketing_links').updateOne(
        { slug: installDoc.campaign_slug },
        { $inc: { installs_count: 1 } }
      );
    }

    return res.json({ success: true, install_id: installDoc.event_id });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
