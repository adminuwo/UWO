let MongoClient;
try {
  MongoClient = require('mongodb').MongoClient;
} catch (e) {
  MongoClient = require('mongoose').mongo.MongoClient;
}
const dns = require('dns');

// Configure public DNS resolvers to ensure robust SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

let unifiedClient = null;

async function getUnifiedDb() {
  const uri = process.env.UNIFIED_MONGODB_URI || 'mongodb+srv://admin_db_user:uSYUbw06q4coR6Nv@unified-dashboard.wisisoq.mongodb.net/?appName=Unified-Dashboard';
  const dbName = process.env.UNIFIED_MONGODB_DB_NAME || 'unified_service_db';

  if (!unifiedClient) {
    unifiedClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      retryWrites: true,
    });
    await unifiedClient.connect();
    console.log(`[MarketingSync] Connected to Unified Dashboard DB (${dbName})`);
  }
  return unifiedClient.db(dbName);
}

/**
 * Upserts a referral link into marketing_links collection in unified_service_db
 * so that https://admin.uwo24.com/r/:code redirects properly across Android, iOS & Desktop.
 */
async function syncLinkToMarketing(link, product) {
  try {
    if (!link || !link.code) return;
    const db = await getUnifiedDb();
    const now = new Date();

    const prodName = product?.name || 'App';
    const webUrl = product?.webUrl || 'https://uwo24.com';
    let androidUrl = product?.androidUrl || '';
    const iosUrl = product?.iosUrl || '';
    const userId = link.userId || '';

    // Pre-bake Google Play Store referrer parameter into android_url
    if (androidUrl && androidUrl.includes('play.google.com')) {
      const sep = androidUrl.includes('?') ? '&' : '?';
      androidUrl = `${androidUrl}${sep}referrer=utm_source%3Dreferral%26ref%3D${encodeURIComponent(link.code)}%26ref_by%3D${encodeURIComponent(userId)}`;
    }

    const isSmart = Boolean(androidUrl || iosUrl);

    const doc = {
      slug: link.code,
      product_id: String(product?._id || link.product || ''),
      product_name: prodName,
      target_url: webUrl,
      full_destination_url: webUrl,
      platform: 'referral',
      campaign_name: 'Referral Program',
      post_name: userId,
      channel_type: 'referral',
      notes: `Referral link for ${userId}`,
      is_smart_link: isSmart,
      android_url: isSmart ? androidUrl : null,
      ios_url: isSmart ? iosUrl : null,
      web_url: isSmart ? webUrl : null,
      total_clicks: link.clicks || 0,
      unique_clicks: link.uniqueClicks || 0,
      unique_ips: [],
      total_downloads: link.downloads || 0,
      android_downloads: 0,
      ios_downloads: 0,
      unique_installs: 0,
      unique_devices: [],
      is_active: true,
      created_by: userId || 'ReferralUser',
      created_at: link.createdAt || now,
      updated_at: now,
      last_clicked_at: null,
      last_downloaded_at: null,
    };

    await db.collection('marketing_links').replaceOne(
      { slug: link.code },
      doc,
      { upsert: true }
    );
    console.log(`[MarketingSync] Synced referral link "${link.code}" to marketing_links`);
  } catch (err) {
    console.warn(`[MarketingSync Warning] Could not sync link "${link?.code}":`, err.message);
  }
}

/**
 * Deletes a referral link from marketing_links in unified_service_db when user deletes it.
 */
async function deleteLinkFromMarketing(code) {
  try {
    if (!code) return;
    const db = await getUnifiedDb();
    await db.collection('marketing_links').deleteOne({ slug: code });
    console.log(`[MarketingSync] Deleted referral link "${code}" from marketing_links`);
  } catch (err) {
    console.warn(`[MarketingSync Warning] Could not delete link "${code}":`, err.message);
  }
}

module.exports = {
  syncLinkToMarketing,
  deleteLinkFromMarketing,
};
