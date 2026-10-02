const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const jwt = require('jsonwebtoken');

/**
 * Apple App Store Connect Sync Service
 * 
 * Sourcing Strategy:
 * 1. App Store Connect REST API (Sales & Trends API):
 *    - Authenticates via ES256 JWT using Issuer ID, Key ID, and AuthKey_*.p8
 *    - Fetches daily compressed gzip TSV reports
 * 2. File-drop / Upload Fallback:
 *    - Parses any exported TSV/CSV reports placed in `reports/app_store/`
 * 3. Normalizes metrics into MongoDB `app_store_metrics` collection
 */

const APP_CONFIGS = [
  { app_code: 'ailegal', apple_id: process.env.AI_LEGAL_APPLE_APP_ID || '6797449251', bundle_id: 'com.uwo.ailegal' },
  { app_code: 'aisa', apple_id: process.env.AISA_APPLE_APP_ID || '6779135418', bundle_id: 'com.uwo.aisa' }
];

function getAppStoreCredentials() {
  const issuerId = process.env.APP_STORE_CONNECT_ISSUER_ID;
  const keyId = process.env.APP_STORE_CONNECT_KEY_ID;
  const vendorNumber = process.env.APP_STORE_CONNECT_VENDOR_NUMBER;
  const keyPathRel = process.env.APP_STORE_CONNECT_PRIVATE_KEY_PATH || `keys/AuthKey_${keyId}.p8`;
  const resolvedKeyPath = path.isAbsolute(keyPathRel) ? keyPathRel : path.resolve(__dirname, '..', keyPathRel);

  let privateKey = process.env.APP_STORE_CONNECT_PRIVATE_KEY || null;
  if (!privateKey && process.env.APP_STORE_CONNECT_PRIVATE_KEY_BASE64) {
    const rawVal = process.env.APP_STORE_CONNECT_PRIVATE_KEY_BASE64.trim();
    if (rawVal.includes('BEGIN PRIVATE KEY') || rawVal.includes('BEGIN EC PRIVATE KEY')) {
      privateKey = rawVal;
    } else {
      try {
        const decoded = Buffer.from(rawVal, 'base64').toString('utf8');
        privateKey = decoded;
      } catch (e) {
        console.warn('[AppStoreSync] Could not decode APP_STORE_CONNECT_PRIVATE_KEY_BASE64:', e.message);
      }
    }
  }

  if (!privateKey && fs.existsSync(resolvedKeyPath)) {
    try {
      privateKey = fs.readFileSync(resolvedKeyPath, 'utf8');
    } catch (e) {
      console.warn('[AppStoreSync] Could not read private key:', e.message);
    }
  }

  return {
    issuerId,
    keyId,
    vendorNumber,
    privateKey,
    keyPath: resolvedKeyPath,
    isConfigured: !!(issuerId && keyId && privateKey && vendorNumber)
  };
}

/**
 * Generate Apple App Store Connect ES256 JWT Token (valid 20 minutes)
 */
function generateAppStoreJwt() {
  const creds = getAppStoreCredentials();
  if (!creds.isConfigured) return null;

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: creds.issuerId,
    exp: now + 20 * 60, // 20 minutes expiration
    aud: 'appstoreconnect-v1'
  };

  const token = jwt.sign(payload, creds.privateKey, {
    algorithm: 'ES256',
    header: {
      alg: 'ES256',
      kid: creds.keyId,
      typ: 'JWT'
    }
  });

  return token;
}

/**
 * Parse Apple Sales & Trends TSV content (decompressed string)
 */
function parseAppStoreTsv(tsvString) {
  if (!tsvString) return [];
  const lines = tsvString.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split('\t').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t');
    const row = {};
    for (let c = 0; c < headers.length; c++) {
      row[headers[c]] = (cols[c] || '').trim();
    }
    rows.push(row);
  }

  return rows;
}

/**
 * Ingest parsed App Store rows into MongoDB `app_store_metrics`
 */
async function ingestAppStoreRows(db, rows) {
  if (!db || !rows || rows.length === 0) return 0;
  let inserted = 0;

  // Group by (app_code, date)
  const grouped = {};

  for (const r of rows) {
    const appleId = r['Apple Identifier'] || r['apple_identifier'];
    const dateStr = r['Begin Date'] || r['End Date'] || r['date'];
    const units = parseInt(r['Units'] || '0', 10);
    const prodType = (r['Product Type Identifier'] || '').toUpperCase();

    // Map to app_code
    const appCfg = APP_CONFIGS.find(a => a.apple_id === appleId || (r['SKU'] && r['SKU'].toLowerCase().includes(a.app_code)));
    const appCode = appCfg ? appCfg.app_code : (appleId === '6797449251' ? 'ailegal' : (appleId === '6779135418' ? 'aisa' : 'ailegal'));

    if (!dateStr) continue;
    // Format MM/DD/YYYY to YYYY-MM-DD
    let normDate = dateStr;
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const month = parts[0].padStart(2, '0');
        const day = parts[1].padStart(2, '0');
        const year = parts[2];
        normDate = `${year}-${month}-${day}`;
      }
    } else {
      normDate = dateStr.slice(0, 10);
    }

    const key = `${appCode}_${normDate}`;
    if (!grouped[key]) {
      grouped[key] = {
        app_code: appCode,
        metric_date: normDate,
        total_downloads: 0,
        first_time_downloads: 0,
        redownloads: 0,
        updates: 0,
        page_views: 0,
        impressions: 0
      };
    }

    if (prodType === '1' || prodType === '1F' || prodType.includes('FREE') || prodType.includes('DOWNLOAD')) {
      grouped[key].first_time_downloads += units;
      grouped[key].total_downloads += units;
    } else if (prodType === '7' || prodType === '7F' || prodType.includes('RE-DOWNLOAD')) {
      grouped[key].redownloads += units;
      grouped[key].total_downloads += units;
    } else if (prodType === '3' || prodType === '3F' || prodType.includes('UPDATE')) {
      grouped[key].updates = (grouped[key].updates || 0) + units;
    } else {
      grouped[key].total_downloads += units;
    }
  }

  for (const item of Object.values(grouped)) {
    await db.collection('app_store_metrics').updateOne(
      { app_code: item.app_code, metric_date: item.metric_date },
      { $set: { ...item, synced_at: new Date() } },
      { upsert: true }
    );
    inserted++;
  }

  return inserted;
}

/**
 * Fetch daily sales report from Apple App Store Connect REST API
 */
async function fetchAppStoreDailyReport(dateStr) {
  const creds = getAppStoreCredentials();
  if (!creds.isConfigured) {
    throw new Error('App Store Connect credentials incomplete (requires ISSUER_ID, KEY_ID, VENDOR_NUMBER, and AuthKey_*.p8)');
  }

  const token = generateAppStoreJwt();
  const url = `https://api.appstoreconnect.apple.com/v1/salesReports?filter[frequency]=DAILY&filter[reportDate]=${dateStr}&filter[reportSubType]=SUMMARY&filter[reportType]=SALES&filter[vendorNumber]=${creds.vendorNumber}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/a-gzip, application/json'
    }
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Apple API returned ${res.status}: ${errText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Decompress gzip
  const decompressed = zlib.gunzipSync(buffer).toString('utf8');
  return parseAppStoreTsv(decompressed);
}

/**
 * Sync a range of recent dates from Apple App Store Connect API
 */
async function syncAppStoreDateRange(db, days = 14) {
  const creds = getAppStoreCredentials();
  if (!creds.isConfigured) {
    return { success: false, error: 'App Store Connect credentials not configured' };
  }

  const results = {
    started_at: new Date().toISOString(),
    dates_queried: 0,
    dates_synced: 0,
    rows_inserted: 0,
    errors: []
  };

  const now = new Date();
  // Start from yesterday backwards (Apple reports are generated for completed days)
  for (let i = 1; i <= days; i++) {
    const targetDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = targetDate.toISOString().slice(0, 10);
    results.dates_queried++;

    try {
      const rows = await fetchAppStoreDailyReport(dateStr);
      if (rows && rows.length > 0) {
        const count = await ingestAppStoreRows(db, rows);
        results.rows_inserted += count;
        results.dates_synced++;
      }
    } catch (err) {
      // 404 or missing report for a date is normal for very recent or empty days
      results.errors.push(`${dateStr}: ${err.message}`);
    }
  }

  results.completed_at = new Date().toISOString();
  results.success = results.dates_synced > 0;
  return results;
}

/**
 * Scan and process any offline or exported TSV/CSV reports dropped in `reports/app_store/`
 */
async function scanLocalAppStoreReports(db) {
  const reportsDir = path.resolve(__dirname, '..', 'reports', 'app_store');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
    return { files_processed: 0, rows_inserted: 0 };
  }

  const files = fs.readdirSync(reportsDir);
  let totalProcessed = 0;
  let totalRows = 0;

  for (const f of files) {
    if (!f.endsWith('.tsv') && !f.endsWith('.csv') && !f.endsWith('.txt')) continue;
    const fullPath = path.join(reportsDir, f);
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const rows = parseAppStoreTsv(content);
      const inserted = await ingestAppStoreRows(db, rows);
      totalRows += inserted;
      totalProcessed++;
    } catch (e) {
      console.warn(`[AppStoreSync] Error reading local report ${f}:`, e.message);
    }
  }

  return { files_processed: totalProcessed, rows_inserted: totalRows };
}

/**
 * Get latest date and summary from Apple App Store in MongoDB
 */
async function getAppStoreDateRange(db, appCode) {
  if (!db) return null;
  const docs = await db.collection('app_store_metrics')
    .find({ app_code: appCode })
    .sort({ metric_date: -1 })
    .limit(1)
    .toArray();

  if (!docs || docs.length === 0) return null;
  return {
    latest_date: docs[0].metric_date,
    latest_record: docs[0]
  };
}

/**
 * Background auto-sync worker for Apple App Store Connect
 */
let appStoreAutoSyncTimer = null;
function startAppStoreAutoSyncWorker(dbGetter, intervalMinutes = 60) {
  if (appStoreAutoSyncTimer) return;

  const runWorker = async () => {
    try {
      const creds = getAppStoreCredentials();
      if (!creds.isConfigured) return;

      const db = typeof dbGetter === 'function' ? await dbGetter() : dbGetter;
      console.log(`[AppStoreSync] 🔄 Automated Apple App Store sync running (Vendor: ${creds.vendorNumber})...`);
      const res = await syncAppStoreDateRange(db, 7);
      if (res.dates_synced > 0) {
        console.log(`[AppStoreSync] ✅ Successfully synced ${res.dates_synced} dates (${res.rows_inserted} records) from App Store Connect!`);
      }
    } catch (err) {
      console.warn('[AppStoreSync] Worker warning:', err.message);
    }
  };

  // Run initial sync after 15 seconds
  setTimeout(runWorker, 15000);
  appStoreAutoSyncTimer = setInterval(runWorker, intervalMinutes * 60 * 1000);
  console.log(`[AppStoreSync] 🚀 Automated Apple App Store sync worker active (Interval: every ${intervalMinutes}m)`);
}

module.exports = {
  getAppStoreCredentials,
  generateAppStoreJwt,
  parseAppStoreTsv,
  ingestAppStoreRows,
  fetchAppStoreDailyReport,
  syncAppStoreDateRange,
  scanLocalAppStoreReports,
  getAppStoreDateRange,
  startAppStoreAutoSyncWorker,
  APP_CONFIGS
};
