const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');
const fs = require('fs');

let clientInstance = null;
let cachedData = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

function getClient() {
  if (clientInstance) return clientInstance;

  const keyPathRel = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.GA4_CREDENTIALS_PATH || 'keys/firebase-service-account.json';
  const resolvedPath = path.isAbsolute(keyPathRel) ? keyPathRel : path.resolve(__dirname, '..', keyPathRel);

  if (!fs.existsSync(resolvedPath)) {
    console.warn(`[FirebaseAnalytics] Service account key not found at ${resolvedPath}`);
    return null;
  }

  try {
    clientInstance = new BetaAnalyticsDataClient({ keyFilename: resolvedPath });
    return clientInstance;
  } catch (err) {
    console.error('[FirebaseAnalytics] Failed to initialize BetaAnalyticsDataClient:', err.message);
    return null;
  }
}

function getPropertyId() {
  return process.env.FIREBASE_PROPERTY_ID || process.env.GA4_PROPERTY_ID || '545341929';
}

function resolveAppCode(streamName) {
  const s = (streamName || '').toLowerCase();
  if (s.includes('legal')) return 'ailegal';
  if (s.includes('aisa')) return 'aisa';
  return 'ailegal';
}

/**
 * Fetch Realtime Active Users directly from Firebase SDK / GA4
 */
async function getLiveRealtimeUsers() {
  const client = getClient();
  const propertyId = getPropertyId();
  if (!client || !propertyId) return { total: 0, android: 0, ios: 0, by_app: { ailegal: 0, aisa: 0 } };

  try {
    const [res] = await client.runRealtimeReport({
      property: `properties/${propertyId}`,
      dimensions: [{ name: 'streamName' }, { name: 'platform' }],
      metrics: [{ name: 'activeUsers' }]
    });

    let android = 0;
    let ios = 0;
    let total = 0;
    const byApp = { ailegal: 0, aisa: 0 };

    for (const row of res.rows || []) {
      const stream = row.dimensionValues[0]?.value || '';
      const plat = (row.dimensionValues[1]?.value || '').toLowerCase();
      const count = parseInt(row.metricValues[0]?.value || '0', 10);
      const appCode = resolveAppCode(stream);

      if (plat.includes('android')) android += count;
      else if (plat.includes('ios')) ios += count;
      else android += count;

      total += count;
      if (byApp[appCode] !== undefined) {
        byApp[appCode] += count;
      } else {
        byApp[appCode] = count;
      }
    }

    return {
      total,
      android,
      ios,
      by_app: byApp
    };
  } catch (err) {
    console.warn('[FirebaseAnalytics] runRealtimeReport error:', err.message);
    return { total: 0, android: 0, ios: 0, by_app: { ailegal: 0, aisa: 0 } };
  }
}

/**
 * Fetch Comprehensive 30-Day Metrics from Firebase SDK / GA4
 */
async function fetchFirebaseDirectMetrics(days = 30) {
  const client = getClient();
  const propertyId = getPropertyId();
  if (!client || !propertyId) return null;

  try {
    const now = new Date();
    const todayStrRaw = now.toISOString().slice(0, 10).replace(/-/g, '');
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStrRaw = yesterday.toISOString().slice(0, 10).replace(/-/g, '');

    // 1. Fetch Events & Installs with streamName
    const [eventsRes] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '2026-07-01', endDate: 'today' }],
      dimensions: [{ name: 'date' }, { name: 'eventName' }, { name: 'platform' }, { name: 'streamName' }],
      metrics: [{ name: 'eventCount' }]
    });

    // 2. Fetch Active Users & Sessions per stream
    const [trafficRes] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '2026-07-01', endDate: 'today' }],
      dimensions: [{ name: 'streamName' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }]
    });

    // 3. Realtime Report
    const realtime = await getLiveRealtimeUsers();

    const byApp = {
      ailegal: {
        total_installs: 0,
        total_uninstalls: 0,
        today_installs: 0,
        yesterday_installs: 0,
        active_users: 0,
        sessions: 0,
        realtime_active: realtime.by_app?.ailegal || 0,
        daily_metrics: {}
      },
      aisa: {
        total_installs: 0,
        total_uninstalls: 0,
        today_installs: 0,
        yesterday_installs: 0,
        active_users: 0,
        sessions: 0,
        realtime_active: realtime.by_app?.aisa || 0,
        daily_metrics: {}
      }
    };

    const combinedDailyMetrics = {};
    let totalInstalls = 0;
    let totalUninstalls = 0;
    let todayInstalls = 0;
    let yesterdayInstalls = 0;

    for (const r of eventsRes.rows || []) {
      const rawDate = r.dimensionValues[0]?.value || '';
      if (!rawDate) continue;
      const formattedDate = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
      const eventName = r.dimensionValues[1]?.value || '';
      const plat = (r.dimensionValues[2]?.value || '').toLowerCase();
      const stream = r.dimensionValues[3]?.value || '';
      const appCode = resolveAppCode(stream);
      const count = parseInt(r.metricValues[0]?.value || '0', 10);

      if (!byApp[appCode]) {
        byApp[appCode] = {
          total_installs: 0,
          total_uninstalls: 0,
          today_installs: 0,
          yesterday_installs: 0,
          active_users: 0,
          sessions: 0,
          realtime_active: 0,
          daily_metrics: {}
        };
      }

      if (!byApp[appCode].daily_metrics[formattedDate]) {
        byApp[appCode].daily_metrics[formattedDate] = { installs: 0, uninstalls: 0, active: 0, sessions: 0, android: 0, ios: 0 };
      }
      if (!combinedDailyMetrics[formattedDate]) {
        combinedDailyMetrics[formattedDate] = { installs: 0, uninstalls: 0, active: 0, sessions: 0, android: 0, ios: 0 };
      }

      if (eventName === 'first_open' || (appCode === 'aisa' && eventName === 'first_visit')) {
        byApp[appCode].daily_metrics[formattedDate].installs += count;
        combinedDailyMetrics[formattedDate].installs += count;
        if (plat.includes('ios')) {
          byApp[appCode].daily_metrics[formattedDate].ios += count;
          combinedDailyMetrics[formattedDate].ios += count;
        } else {
          byApp[appCode].daily_metrics[formattedDate].android += count;
          combinedDailyMetrics[formattedDate].android += count;
        }

        byApp[appCode].total_installs += count;
        totalInstalls += count;
        if (rawDate === todayStrRaw) {
          byApp[appCode].today_installs += count;
          todayInstalls += count;
        } else if (rawDate === yesterdayStrRaw) {
          byApp[appCode].yesterday_installs += count;
          yesterdayInstalls += count;
        }
      } else if (eventName === 'app_remove') {
        byApp[appCode].daily_metrics[formattedDate].uninstalls += count;
        combinedDailyMetrics[formattedDate].uninstalls += count;
        byApp[appCode].total_uninstalls += count;
        totalUninstalls += count;
      }
    }

    let totalActiveUsers = 0;
    for (const r of trafficRes.rows || []) {
      const stream = r.dimensionValues[0]?.value || '';
      const appCode = resolveAppCode(stream);
      const active = parseInt(r.metricValues[0]?.value || '0', 10);
      const sessions = parseInt(r.metricValues[1]?.value || '0', 10);

      if (byApp[appCode]) {
        byApp[appCode].active_users = active;
        byApp[appCode].sessions = sessions;
      }
      totalActiveUsers += active;
    }

    // Build timeseries
    const sortedDates = Object.keys(combinedDailyMetrics).sort();
    const timeseries = {
      total_installs: { android: [], ios: [] },
      user_loss: { android: [], ios: [] },
      active_devices: { android: [], ios: [] }
    };

    let cumAndroid = 0;
    let cumIos = 0;
    for (const d of sortedDates) {
      const item = combinedDailyMetrics[d];
      cumAndroid += item.android;
      cumIos += item.ios;
      timeseries.total_installs.android.push({ date: d, value: cumAndroid });
      timeseries.total_installs.ios.push({ date: d, value: cumIos });
      timeseries.user_loss.android.push({ date: d, value: item.uninstalls });
      timeseries.user_loss.ios.push({ date: d, value: 0 });
      timeseries.active_devices.android.push({ date: d, value: item.active });
      timeseries.active_devices.ios.push({ date: d, value: 0 });
    }

    return {
      success: true,
      provider: 'firebase_sdk_ga4_direct',
      property_id: propertyId,
      fetched_at: new Date().toISOString(),
      realtime_active: realtime.total,
      realtime_android: realtime.android,
      realtime_ios: realtime.ios,
      total_all_time_installs: totalInstalls,
      total_installs_30d: totalInstalls,
      total_uninstalls: totalUninstalls,
      today_installs: todayInstalls,
      yesterday_installs: yesterdayInstalls,
      total_active_users: totalActiveUsers,
      by_app: byApp,
      timeseries
    };
  } catch (err) {
    console.error('[FirebaseAnalytics] fetchFirebaseDirectMetrics error:', err);
    return null;
  }
}

/**
 * Get Cached or Fresh Firebase Telemetry
 */
async function getFirebaseTelemetry(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedData && (now - lastFetchTime < CACHE_TTL_MS)) {
    return cachedData;
  }

  const liveData = await fetchFirebaseDirectMetrics(30);
  if (liveData) {
    cachedData = liveData;
    lastFetchTime = now;
  }
  return cachedData;
}

module.exports = {
  getClient,
  getPropertyId,
  getLiveRealtimeUsers,
  fetchFirebaseDirectMetrics,
  getFirebaseTelemetry
};
