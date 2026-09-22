let MongoClient;
try {
  MongoClient = require('mongodb').MongoClient;
} catch (e) {
  MongoClient = require('mongoose').mongo.MongoClient;
}
const dns = require('dns');
const crypto = require('crypto');

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
 * 1. Synchronize a User Dashboard user to the Unified Central Users table
 */
async function syncUserToUnified(user) {
  try {
    if (!user || !user.email) return;
    const db = await getUnifiedDb();
    const now = new Date();
    const email = user.email.trim().toLowerCase();
    const userId = user.userId || String(user._id);

    const userDoc = {
      $set: {
        email: email,
        name: user.name || 'Referral Partner',
        is_active: true,
        is_verified: true,
        updated_at: now,
      },
      $addToSet: {
        connected_apps: { $each: ['user_dashboard', 'referral_system'] }
      },
      $setOnInsert: {
        _id: userId,
        password_hash: user.password || '',
        created_at: user.createdAt || now,
      }
    };

    await db.collection('users').updateOne(
      { email: email },
      userDoc,
      { upsert: true }
    );
    console.log(`[MarketingSync] Synced user "${email}" (${userId}) to Unified Central Users`);
  } catch (err) {
    console.warn(`[MarketingSync Warning] Could not sync user "${user?.email}":`, err.message);
  }
}

/**
 * 2. Upserts a referral link into marketing_links collection in unified_service_db
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
      unique_installs: link.downloads || 0,
      unique_devices: [],
      is_active: true,
      created_by: userId || 'ReferralUser',
      created_at: link.createdAt || now,
      updated_at: now,
      last_clicked_at: link.updatedAt || null,
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
 * 3. Deletes a referral link from marketing_links in unified_service_db
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

/**
 * 4. Synchronize a click event to Unified Dashboard in real time
 */
async function syncClickToMarketing(clickData) {
  try {
    if (!clickData || !clickData.code) return;
    const db = await getUnifiedDb();
    const now = new Date();
    const code = clickData.code;

    // 1. Increment total_clicks and unique_clicks in marketing_links
    const incOps = { total_clicks: 1 };
    if (clickData.isUnique) {
      incOps.unique_clicks = 1;
    }

    await db.collection('marketing_links').updateOne(
      { slug: code },
      {
        $inc: incOps,
        $set: {
          last_clicked_at: now,
          updated_at: now,
        }
      }
    );

    // 2. Insert detailed click log into marketing_clicks
    const ipHash = crypto.createHash('sha256').update(clickData.ip || '127.0.0.1').digest('hex').slice(0, 16);
    await db.collection('marketing_clicks').insertOne({
      slug: code,
      link_id: String(clickData.linkId || ''),
      platform: 'referral',
      campaign_name: 'Referral Program',
      post_name: clickData.userId || 'ReferralUser',
      timestamp: now,
      client_ip: clickData.ip || null,
      ip_hash: ipHash,
      device_type: clickData.deviceType || 'desktop',
      target_url: clickData.targetUrl || '',
      is_unique: Boolean(clickData.isUnique),
      user_agent: (clickData.userAgent || '').slice(0, 250),
      referrer: (clickData.referrer || '').slice(0, 200),
    });

    console.log(`[MarketingSync] Synced click for "${code}" (${clickData.deviceType}) to Unified Dashboard`);
  } catch (err) {
    console.warn(`[MarketingSync Warning] Could not sync click for "${clickData?.code}":`, err.message);
  }
}

/**
 * 5. Synchronize an app install / download event to Unified Dashboard in real time
 */
async function syncDownloadToMarketing(dlData) {
  try {
    if (!dlData || !dlData.code) return;
    const db = await getUnifiedDb();
    const now = new Date();
    const code = dlData.code;
    const normPlatform = (dlData.platform || 'android').toLowerCase();

    // 1. Increment download counters in marketing_links
    const incOps = {
      total_downloads: 1,
      unique_installs: 1,
    };
    if (normPlatform === 'ios') {
      incOps.ios_downloads = 1;
    } else {
      incOps.android_downloads = 1;
    }

    await db.collection('marketing_links').updateOne(
      { slug: code },
      {
        $inc: incOps,
        $set: {
          last_downloaded_at: now,
          updated_at: now,
        }
      }
    );

    // 2. Insert into marketing_downloads
    await db.collection('marketing_downloads').insertOne({
      slug: code,
      link_id: String(dlData.linkId || ''),
      platform: normPlatform,
      timestamp: now,
      client_ip: dlData.ip || null,
      fingerprint: dlData.fingerprint || null,
      attribution_method: dlData.attributionMethod || 'store_referrer',
      user_id: dlData.userId || null,
    });

    // 3. Insert into central app_downloads
    await db.collection('app_downloads').insertOne({
      application_id: String(dlData.linkId || 'referral_system'),
      app_code: dlData.productSlug || 'aisa',
      platform: normPlatform,
      version: '1.0.0',
      ip_country: 'IN',
      ip: dlData.ip || null,
      fingerprint: dlData.fingerprint || null,
      attribution_method: dlData.attributionMethod || 'store_referrer',
      user_id: dlData.userId || null,
      created_at: now,
    });

    console.log(`[MarketingSync] Synced download for "${code}" (${normPlatform}) to Unified Dashboard`);
  } catch (err) {
    console.warn(`[MarketingSync Warning] Could not sync download for "${dlData?.code}":`, err.message);
  }
}

/**
 * 6. Master Full Synchronization:
 * Iterates through all existing RefUsers, ReferralLinks, ClickLogs, DownloadLogs in UWO-web
 * and migrates/upserts them into unified_service_db so historical and newly created items match 100%.
 */
async function syncAllReferralDataToUnified() {
  console.log('🔄 [MarketingSync] Starting full synchronization from UWO-web to Unified Dashboard...');
  const results = {
    usersSynced: 0,
    linksSynced: 0,
    clicksSynced: 0,
    downloadsSynced: 0,
  };

  try {
    const RefUser = require('../models/RefUser');
    const RefProduct = require('../models/RefProduct');
    const ReferralLink = require('../models/ReferralLink');
    const ClickLog = require('../models/ClickLog');
    const DownloadLog = require('../models/DownloadLog');

    const db = await getUnifiedDb();

    // A. Sync all Referral Users -> users
    const allUsers = await RefUser.find({}).lean();
    for (const u of allUsers) {
      await syncUserToUnified(u);
      results.usersSynced++;
    }

    // B. Sync all Referral Links -> marketing_links
    const allLinks = await ReferralLink.find({}).populate('product').lean();
    for (const link of allLinks) {
      // Calculate real click counts from ClickLog
      const totalClicks = await ClickLog.countDocuments({ referralLink: link._id });
      const uniqueClicks = await ClickLog.countDocuments({ referralLink: link._id, isUnique: true });
      const totalDownloads = await DownloadLog.countDocuments({ referralLink: link._id });
      const androidDownloads = await DownloadLog.countDocuments({ referralLink: link._id, platform: 'android' });
      const iosDownloads = await DownloadLog.countDocuments({ referralLink: link._id, platform: 'ios' });

      link.clicks = Math.max(link.clicks || 0, totalClicks);
      link.uniqueClicks = Math.max(link.uniqueClicks || 0, uniqueClicks);
      link.downloads = Math.max(link.downloads || 0, totalDownloads);

      await syncLinkToMarketing(link, link.product);

      // Update accurate download counts in marketing_links
      await db.collection('marketing_links').updateOne(
        { slug: link.code },
        {
          $set: {
            total_clicks: link.clicks,
            unique_clicks: link.uniqueClicks,
            total_downloads: link.downloads,
            android_downloads: androidDownloads,
            ios_downloads: iosDownloads,
            unique_installs: link.downloads,
          }
        }
      );

      results.linksSynced++;
    }

    // C. Sync all Click Logs -> marketing_clicks
    const allClicks = await ClickLog.find({}).lean();
    for (const clk of allClicks) {
      const ipHash = crypto.createHash('sha256').update(clk.ip || '127.0.0.1').digest('hex').slice(0, 16);
      await db.collection('marketing_clicks').updateOne(
        { slug: clk.code, timestamp: clk.createdAt || clk.timestamp },
        {
          $setOnInsert: {
            slug: clk.code,
            link_id: String(clk.referralLink || ''),
            platform: 'referral',
            campaign_name: 'Referral Program',
            post_name: clk.userId || 'ReferralUser',
            timestamp: clk.createdAt || clk.timestamp || new Date(),
            client_ip: clk.ip || null,
            ip_hash: ipHash,
            device_type: clk.deviceType || 'desktop',
            target_url: clk.targetUrl || '',
            is_unique: Boolean(clk.isUnique),
            user_agent: (clk.userAgent || '').slice(0, 250),
            referrer: '',
          }
        },
        { upsert: true }
      );
      results.clicksSynced++;
    }

    // D. Sync all Download Logs -> marketing_downloads & app_downloads
    const allDownloads = await DownloadLog.find({}).populate('product').lean();
    for (const dl of allDownloads) {
      const normPlatform = (dl.platform || 'android').toLowerCase();
      const ts = dl.createdAt || new Date();

      await db.collection('marketing_downloads').updateOne(
        { slug: dl.code, timestamp: ts },
        {
          $setOnInsert: {
            slug: dl.code,
            link_id: String(dl.referralLink || ''),
            platform: normPlatform,
            timestamp: ts,
            client_ip: dl.ip || null,
            fingerprint: dl.fingerprint || null,
            attribution_method: dl.attributionMethod || 'store_referrer',
            user_id: dl.userId || null,
          }
        },
        { upsert: true }
      );

      await db.collection('app_downloads').updateOne(
        { application_id: String(dl.referralLink || 'referral_system'), created_at: ts },
        {
          $setOnInsert: {
            application_id: String(dl.referralLink || 'referral_system'),
            app_code: dl.product?.slug || 'aisa',
            platform: normPlatform,
            version: '1.0.0',
            ip_country: 'IN',
            ip: dl.ip || null,
            fingerprint: dl.fingerprint || null,
            attribution_method: dl.attributionMethod || 'store_referrer',
            user_id: dl.userId || null,
            created_at: ts,
          }
        },
        { upsert: true }
      );
      results.downloadsSynced++;
    }

    console.log('✅ [MarketingSync] Full sync finished successfully:', results);
  } catch (err) {
    console.error('❌ [MarketingSync Error] Full sync encountered an error:', err);
  }

  return results;
}

module.exports = {
  getUnifiedDb,
  syncUserToUnified,
  syncLinkToMarketing,
  deleteLinkFromMarketing,
  syncClickToMarketing,
  syncDownloadToMarketing,
  syncAllReferralDataToUnified,
};
