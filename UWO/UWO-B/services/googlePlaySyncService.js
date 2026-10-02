const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

/**
 * Google Play Console GCS Reports Sync Service
 * 
 * Bucket: pubsite_prod_5002243960657921085
 * Folders:
 *   - stats/installs/
 *   - stats/crashes/
 *   - stats/ratings/
 *   - stats/store_performance/
 * 
 * Encoding: UTF-16LE with BOM
 * Format: CSV
 */

const DEFAULT_BUCKET_ID = process.env.GOOGLE_PLAY_GCS_BUCKET_ID || 'pubsite_prod_5002243960657921085';

const APP_CONFIGS = [
  { app_code: 'ailegal', package_name: 'com.uwo.ailegal', display_name: 'AI-LEGAL' },
  { app_code: 'aisa', package_name: 'com.uwo.aisa', display_name: 'AISA' }
];

let storageClient = null;

function getStorageClient() {
  if (storageClient) return storageClient;

  // 1. From Base64 environment variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
      const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64.trim(), 'base64').toString('utf8');
      const creds = JSON.parse(decoded);
      storageClient = new Storage({ credentials: creds });
      return storageClient;
    } catch (err) {
      console.warn('[GooglePlaySync] Could not initialize Storage with FIREBASE_SERVICE_ACCOUNT_BASE64:', err.message);
    }
  }

  // 2. From raw JSON string environment variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      storageClient = new Storage({ credentials: creds });
      return storageClient;
    } catch (err) {
      console.warn('[GooglePlaySync] Could not initialize Storage with FIREBASE_SERVICE_ACCOUNT_JSON:', err.message);
    }
  }

  // 3. From physical file
  const keyPathRel = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS || 'keys/firebase-service-account.json';
  const resolvedPath = path.isAbsolute(keyPathRel) ? keyPathRel : path.resolve(__dirname, '..', keyPathRel);

  if (fs.existsSync(resolvedPath)) {
    try {
      storageClient = new Storage({ keyFilename: resolvedPath });
      return storageClient;
    } catch (err) {
      console.warn('[GooglePlaySync] Could not initialize Storage with keyFilename:', err.message);
    }
  }

  // Fallback to default ADC
  try {
    storageClient = new Storage();
    return storageClient;
  } catch (err) {
    console.warn('[GooglePlaySync] Could not initialize Storage with ADC:', err.message);
    return null;
  }
}

/**
 * Parse UTF-16LE CSV string from Buffer
 */
function parseUtf16LeCsv(buffer) {
  if (!buffer || buffer.length === 0) return { headers: [], rows: [] };

  // Decode UTF-16LE and strip leading BOM (\ufeff)
  let text = buffer.toString('utf16le');
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = lines[i].split(',');
    const rowObj = {};
    for (let c = 0; c < headers.length; c++) {
      const colName = headers[c];
      const val = (rawCols[c] || '').trim().replace(/^"|"$/g, '');
      rowObj[colName] = val;
    }
    rows.push(rowObj);
  }

  return { headers, rows };
}

/**
 * Sync installs, crashes, ratings, and store performance from GCS bucket
 */
async function syncGooglePlayBucket(db, bucketName = DEFAULT_BUCKET_ID) {
  const client = getStorageClient();
  if (!client) {
    return {
      success: false,
      error: 'Google Cloud Storage client not configured. Check service account key.',
      bucket: bucketName
    };
  }

  const bucket = client.bucket(bucketName);
  const syncSummary = {
    started_at: new Date().toISOString(),
    bucket: bucketName,
    files_found: 0,
    files_processed: 0,
    rows_inserted: 0,
    errors: []
  };

  try {
    for (const app of APP_CONFIGS) {
      const { app_code, package_name } = app;

      // 1. Process stats/installs/
      const installPrefix = `stats/installs/installs_${package_name}_`;
      try {
        const [installFiles] = await bucket.getFiles({ prefix: installPrefix });
        syncSummary.files_found += (installFiles || []).length;

        for (const file of installFiles || []) {
          // Process overview files as primary source of daily metrics
          if (!file.name.endsWith('_overview.csv')) continue;

          try {
            const [buffer] = await file.download();
            const { rows } = parseUtf16LeCsv(buffer);

            const ops = rows.map(r => {
              const metricDate = r['Date'] || r['date'];
              if (!metricDate) return null;

              const dailyUserInstalls = parseInt(r['Daily User Installs'] || '0', 10);
              const dailyUserUninstalls = parseInt(r['Daily User Uninstalls'] || '0', 10);
              const dailyDeviceInstalls = parseInt(r['Daily Device Installs'] || '0', 10);
              const dailyDeviceUninstalls = parseInt(r['Daily Device Uninstalls'] || '0', 10);
              const installsOnActive = parseInt(r['Active Device Installs'] || r['Installs on Active Devices'] || '0', 10);
              const totalUserInstalls = parseInt(r['Total User Installs'] || '0', 10);
              const installEvents = parseInt(r['Install events'] || '0', 10);
              const uninstallEvents = parseInt(r['Uninstall events'] || '0', 10);

              const doc = {
                app_code,
                package_name,
                metric_date: metricDate,
                dimension_type: 'overview',
                daily_user_installs: dailyUserInstalls,
                daily_user_uninstalls: dailyUserUninstalls,
                daily_device_installs: dailyDeviceInstalls,
                daily_device_uninstalls: dailyDeviceUninstalls,
                installs_on_active_devices: installsOnActive,
                total_user_installs: totalUserInstalls,
                install_events: installEvents,
                uninstall_events: uninstallEvents,
                source_file: file.name,
                source_bucket: bucketName,
                synced_at: new Date()
              };

              return {
                updateOne: {
                  filter: { app_code, metric_date: metricDate, dimension_type: 'overview' },
                  update: { $set: doc },
                  upsert: true
                }
              };
            }).filter(Boolean);

            if (db && ops.length > 0) {
              await db.collection('play_install_metrics').bulkWrite(ops);
              syncSummary.rows_inserted += ops.length;
            }
            syncSummary.files_processed++;
          } catch (fileErr) {
            syncSummary.errors.push(`Error reading ${file.name}: ${fileErr.message}`);
          }
        }
      } catch (prefixErr) {
        syncSummary.errors.push(`Failed to list installs for ${package_name}: ${prefixErr.message}`);
      }

      // 2. Process stats/crashes/
      const crashPrefix = `stats/crashes/crashes_${package_name}_`;
      try {
        const [crashFiles] = await bucket.getFiles({ prefix: crashPrefix });
        for (const file of crashFiles || []) {
          if (!file.name.endsWith('_overview.csv')) continue;
          try {
            const [buffer] = await file.download();
            const { rows } = parseUtf16LeCsv(buffer);
            const ops = rows.map(r => {
              const metricDate = r['Date'] || r['date'];
              if (!metricDate) return null;
              const crashes = parseInt(r['Daily Crashes'] || r['Crashes'] || '0', 10);
              const anrs = parseInt(r['Daily ANRs'] || r['ANRs'] || '0', 10);
              return {
                updateOne: {
                  filter: { app_code, metric_date: metricDate },
                  update: { $set: { app_code, package_name, metric_date: metricDate, crashes, anrs, synced_at: new Date() } },
                  upsert: true
                }
              };
            }).filter(Boolean);

            if (db && ops.length > 0) {
              await db.collection('play_crash_metrics').bulkWrite(ops);
            }
          } catch (e) {}
        }
      } catch (e) {}

      // 3. Process stats/ratings/
      const ratingPrefix = `stats/ratings/ratings_${package_name}_`;
      try {
        const [ratingFiles] = await bucket.getFiles({ prefix: ratingPrefix });
        for (const file of ratingFiles || []) {
          if (!file.name.endsWith('_overview.csv')) continue;
          try {
            const [buffer] = await file.download();
            const { rows } = parseUtf16LeCsv(buffer);
            const ops = rows.map(r => {
              const metricDate = r['Date'] || r['date'];
              if (!metricDate) return null;
              const avgRating = parseFloat(r['Daily Average Rating'] || r['Total Average Rating'] || '0');
              const totalAvgRating = parseFloat(r['Total Average Rating'] || '0');
              return {
                updateOne: {
                  filter: { app_code, metric_date: metricDate },
                  update: { $set: { app_code, package_name, metric_date: metricDate, avg_rating: avgRating, total_avg_rating: totalAvgRating, synced_at: new Date() } },
                  upsert: true
                }
              };
            }).filter(Boolean);

            if (db && ops.length > 0) {
              await db.collection('play_rating_metrics').bulkWrite(ops);
            }
          } catch (e) {}
        }
      } catch (e) {}

      // 4. Process stats/store_performance/
      const perfPrefix = `stats/store_performance/store_performance_${package_name}_`;
      try {
        const [perfFiles] = await bucket.getFiles({ prefix: perfPrefix });
        for (const file of perfFiles || []) {
          if (!file.name.endsWith('_traffic_source.csv') && !file.name.endsWith('_country.csv')) continue;
          try {
            const [buffer] = await file.download();
            const { rows } = parseUtf16LeCsv(buffer);
            // Aggregate totals by date across sources/countries
            const byDate = {};
            for (const r of rows) {
              const metricDate = r['Date'] || r['date'];
              if (!metricDate) continue;
              const visitors = parseInt(r['Store Listing Visitors'] || r['Visitors'] || '0', 10);
              const installers = parseInt(r['Installers'] || '0', 10);
              if (!byDate[metricDate]) byDate[metricDate] = { visitors: 0, installers: 0 };
              byDate[metricDate].visitors += visitors;
              byDate[metricDate].installers += installers;
            }

            const ops = Object.keys(byDate).map(metricDate => ({
              updateOne: {
                filter: { app_code, metric_date: metricDate },
                update: {
                  $set: {
                    app_code,
                    package_name,
                    metric_date: metricDate,
                    visitors: byDate[metricDate].visitors,
                    installers: byDate[metricDate].installers,
                    synced_at: new Date()
                  }
                },
                upsert: true
              }
            }));

            if (db && ops.length > 0) {
              await db.collection('play_store_performance').bulkWrite(ops);
            }
          } catch (e) {}
        }
      } catch (e) {}
    }

    syncSummary.completed_at = new Date().toISOString();
    syncSummary.success = syncSummary.errors.length === 0;
    return syncSummary;

  } catch (err) {
    syncSummary.completed_at = new Date().toISOString();
    syncSummary.success = false;
    syncSummary.error = err.message;
    return syncSummary;
  }
}

/**
 * Get latest date and summary from Google Play Console in MongoDB
 */
async function getPlayConsoleDateRange(db, appCode) {
  if (!db) return null;
  const docs = await db.collection('play_install_metrics')
    .find({ app_code: appCode, dimension_type: 'overview' })
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
 * Background auto-sync worker for Google Play Store GCS
 */
let autoSyncTimer = null;
function startPlayStoreAutoSyncWorker(dbGetter, intervalMinutes = 15) {
  if (autoSyncTimer) return;
  
  const runWorker = async () => {
    try {
      const db = typeof dbGetter === 'function' ? await dbGetter() : dbGetter;
      console.log(`[PlayStoreSync] 🔄 Polling Google Play GCS bucket (${DEFAULT_BUCKET_ID})...`);
      const res = await syncGooglePlayBucket(db, DEFAULT_BUCKET_ID);
      if (res.success) {
        console.log(`[PlayStoreSync] ✅ Successfully synced ${res.rows_inserted} new rows from Google Play Console!`);
      } else if (res.errors && res.errors[0]?.includes('does not have storage.objects.list access')) {
        console.log(`[PlayStoreSync] ⏳ Google Play IAM propagation in progress for service account... will re-poll in ${intervalMinutes}m.`);
      }
    } catch (err) {
      console.warn('[PlayStoreSync] Worker warning:', err.message);
    }
  };

  // Run initial check after 10 seconds
  setTimeout(runWorker, 10000);
  autoSyncTimer = setInterval(runWorker, intervalMinutes * 60 * 1000);
  console.log(`[PlayStoreSync] 🚀 Automated Google Play sync worker active (Interval: every ${intervalMinutes}m)`);
}

module.exports = {
  syncGooglePlayBucket,
  parseUtf16LeCsv,
  getPlayConsoleDateRange,
  startPlayStoreAutoSyncWorker,
  DEFAULT_BUCKET_ID,
  APP_CONFIGS
};
