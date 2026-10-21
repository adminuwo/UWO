const firebaseAnalytics = require('./firebaseAnalyticsService');
const googlePlaySync = require('./googlePlaySyncService');

/**
 * Hybrid Telemetry Engine: Google Play Console (Historical Truth) + Firebase Analytics (Live Edge)
 * 
 * Splicing & Deduplication Logic:
 * 1. Google Play Console provides authoritative official store reports (3-7 day reporting lag).
 * 2. Firebase SDK provides real-time live telemetry up to the current minute.
 * 3. Watermark Rule:
 *    - For any date d <= PlayConsoleLatestDate: Take Play Console data ONLY.
 *    - For any date d > PlayConsoleLatestDate: Take Firebase SDK live data ONLY.
 *    - Strict deduplication: A date is NEVER counted twice.
 * 4. As Google Play Console updates and advances its latest date, historical Firebase data is seamlessly
 *    superseded by official Play Store reports, with zero data gaps.
 */

const mergedCache = new Map();
const MERGED_CACHE_TTL_MS = 45 * 1000; // 45 seconds cache to serve parallel endpoints in <1ms

function invalidateMergedCache() {
  mergedCache.clear();
}

async function getMergedAppTelemetry(db, appCode, forceRefresh = false) {
  const cacheKey = String(appCode || '').toLowerCase().trim();
  const cached = mergedCache.get(cacheKey);
  const nowMs = Date.now();
  if (!forceRefresh && cached && (nowMs - cached.timestamp < MERGED_CACHE_TTL_MS)) {
    return cached.data;
  }

  // 1. Fetch Google Play Console historical records from DB
  let playRecords = [];
  let playRating = null;
  let playCrash = null;
  let playPerf = null;

  if (db) {
    playRecords = await db.collection('play_install_metrics')
      .find({ app_code: appCode, dimension_type: 'overview' })
      .sort({ metric_date: 1 })
      .toArray()
      .catch(() => []);

    playRating = await db.collection('play_rating_metrics')
      .find({ app_code: appCode })
      .sort({ metric_date: -1 })
      .limit(1)
      .toArray()
      .then(a => a[0] || null)
      .catch(() => null);

    playCrash = await db.collection('play_crash_metrics')
      .find({ app_code: appCode })
      .sort({ metric_date: -1 })
      .limit(1)
      .toArray()
      .then(a => a[0] || null)
      .catch(() => null);

    playPerf = await db.collection('play_store_performance')
      .find({ app_code: appCode })
      .sort({ metric_date: -1 })
      .limit(1)
      .toArray()
      .then(a => a[0] || null)
      .catch(() => null);
  }

  // 2. Fetch Live Firebase Telemetry
  const fbData = await firebaseAnalytics.getFirebaseTelemetry().catch(() => null);
  const appFb = fbData?.by_app?.[appCode] || null;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  // 3. Process Google Play Console records (for baseline before Firebase)
  let playDailyMap = {};
  let dedupedPlayRecords = [];
  let playMaxDate = null;

  if (playRecords.length > 0) {
    const dedupedRecordsMap = {};
    for (const r of playRecords) {
      if (!dedupedRecordsMap[r.metric_date] || (r.daily_user_installs || 0) >= (dedupedRecordsMap[r.metric_date].daily_user_installs || 0)) {
        dedupedRecordsMap[r.metric_date] = r;
      }
    }
    dedupedPlayRecords = Object.values(dedupedRecordsMap).sort((a, b) => a.metric_date.localeCompare(b.metric_date));
    playMaxDate = dedupedPlayRecords[dedupedPlayRecords.length - 1].metric_date;

    let runningPlayTotal = 0;
    for (const r of dedupedPlayRecords) {
      runningPlayTotal += (r.daily_user_installs || r.daily_device_installs || 0);
      playDailyMap[r.metric_date] = {
        date: r.metric_date,
        daily_user_installs: r.daily_user_installs || 0,
        daily_user_uninstalls: r.daily_user_uninstalls || 0,
        daily_device_installs: r.daily_device_installs || 0,
        installs_on_active_devices: r.installs_on_active_devices || 0,
        total_user_installs: r.total_user_installs > 0 ? r.total_user_installs : runningPlayTotal,
        source: 'google_play_console'
      };
    }
  }

  // 4. Determine Hybrid Watermark & Totals
  // Google Play Console is the authoritative historical ground truth up to playMaxDate.
  // Firebase SDK provides the real-time forward leading edge for dates strictly after playMaxDate.
  let playInstallsTotal = 0;
  let playLatestActive = 0;

  for (const r of dedupedPlayRecords) {
    playInstallsTotal += (r.daily_user_installs || r.daily_device_installs || 0);
    playLatestActive = r.installs_on_active_devices || playLatestActive;
  }

  const fbDaily = appFb?.daily_metrics || {};
  const fbDates = Object.keys(fbDaily).sort();
  let postPlayFbInstalls = 0;

  for (const d of fbDates) {
    if (!playMaxDate || d > playMaxDate) {
      const dayData = fbDaily[d];
      postPlayFbInstalls += (dayData.android || dayData.installs || 0);
    }
  }

  const totalAndroidInstalls = playInstallsTotal + postPlayFbInstalls;
  // 5. Construct Unified Spliced Timeline
  // Google Play Console official records (dates <= playMaxDate) + Firebase leading edge (dates > playMaxDate)
  const mergedTimeline = [];
  let runningCum = 0;

  for (const r of dedupedPlayRecords) {
    const dailyInstalls = r.daily_user_installs || r.daily_device_installs || 0;
    runningCum += dailyInstalls;
    mergedTimeline.push({
      ...playDailyMap[r.metric_date],
      total_user_installs: runningCum
    });
  }

  let runningActive = playLatestActive;
  for (const d of fbDates) {
    if (!playMaxDate || d > playMaxDate) {
      const dayData = fbDaily[d];
      const dayInstalls = dayData.android || dayData.installs || 0;
      const dayUninstalls = dayData.uninstalls || 0;
      runningCum += dayInstalls;

      // Realistic net active devices flow: smoothly evolves from the official Google Play Console baseline
      if (dayData.active > 0) {
        runningActive = dayData.active;
      } else {
        runningActive = Math.max(0, runningActive + dayInstalls - dayUninstalls);
      }

      mergedTimeline.push({
        date: d,
        daily_user_installs: dayInstalls,
        daily_user_uninstalls: dayUninstalls,
        daily_device_installs: dayInstalls,
        installs_on_active_devices: runningActive,
        total_user_installs: runningCum,
        source: 'firebase_sdk_ga4_live_edge'
      });
    }
  }

  const activeDevices = runningActive > 0 ? runningActive : (appFb?.active_users || playLatestActive || 0);

  // 6. Query Apple App Store Metrics for iOS Store Downloads
  let iosRecords = [];
  if (db) {
    iosRecords = await db.collection('app_store_metrics')
      .find({ app_code: appCode })
      .sort({ metric_date: 1 })
      .toArray()
      .catch(() => []);
  }

  let iosMaxDate = null;
  let iosBaselineTotal = 0;
  let iosDailyMap = {};

  if (iosRecords.length > 0) {
    for (const r of iosRecords) {
      iosMaxDate = r.metric_date;
      iosBaselineTotal += (r.total_downloads || 0);
      iosDailyMap[r.metric_date] = (r.total_downloads || 0);
    }
  }

  let totalIosInstalls = iosBaselineTotal;

  // Today & Yesterday installs
  let todayInstalls = 0;
  let yesterdayInstalls = 0;
  let todayAndroid = 0;
  let todayIos = 0;
  let yesterdayAndroid = 0;
  let yesterdayIos = 0;

  if (fbDaily[todayStr]) {
    todayAndroid = fbDaily[todayStr].android || 0;
    todayIos = fbDaily[todayStr].ios || 0;
    todayInstalls = fbDaily[todayStr].installs || (todayAndroid + todayIos);
  } else if (appFb?.today_installs !== undefined) {
    todayInstalls = appFb.today_installs;
    todayAndroid = appFb.today_installs;
  }

  if (fbDaily[yesterdayStr]) {
    yesterdayAndroid = fbDaily[yesterdayStr].android || 0;
    yesterdayIos = fbDaily[yesterdayStr].ios || 0;
    yesterdayInstalls = fbDaily[yesterdayStr].installs || (yesterdayAndroid + yesterdayIos);
  } else if (appFb?.yesterday_installs !== undefined) {
    yesterdayInstalls = appFb.yesterday_installs;
    yesterdayAndroid = appFb.yesterday_installs;
  } else if (playDailyMap[yesterdayStr]) {
    yesterdayInstalls = playDailyMap[yesterdayStr].daily_user_installs;
    yesterdayAndroid = yesterdayInstalls;
  }

  const realtimeActive = appFb?.realtime_android ?? appFb?.realtime_active ?? 0;
  const realtimeIos = appFb?.realtime_ios ?? 0;

  // Option B: User Retention (Active Users / Total Store Installs)
  // Reflects true retained human users from Firebase SDK / GA4
  const activeUsers = appFb?.active_users || (runningActive > 0 ? runningActive : (playLatestActive || 0));
  const netLostUsers = Math.max(0, totalAndroidInstalls - activeUsers);
  const netLostDevices = Math.max(0, totalAndroidInstalls - activeDevices);
  const retentionRate = totalAndroidInstalls > 0
    ? Number(((activeUsers / totalAndroidInstalls) * 100).toFixed(1))
    : 0;
  const churnRate = Number((100 - retentionRate).toFixed(1));
  const totalUninstalls = netLostUsers;

  const result = {
    app_code: appCode,
    display_name: appCode === 'ailegal' ? 'AI-LEGAL' : (appCode === 'aisa' ? 'AISA' : appCode.toUpperCase()),
    watermark_date: playMaxDate ? `Google Play Console (to ${playMaxDate}) + Live Firebase Edge` : 'Firebase Primary',
    ios_watermark_date: iosMaxDate,
    sources: {
      primary_engine: playMaxDate ? `Google Play Console (Official to ${playMaxDate})` : 'Google Play Console',
      live_leading_edge: playMaxDate ? `Firebase Analytics GA4 (Live Edge since ${playMaxDate})` : 'Firebase Analytics SDK',
      ios_historical: iosMaxDate ? `Apple App Store Connect (up to ${iosMaxDate})` : 'App Store Connect Baseline'
    },
    total_android_installs: totalAndroidInstalls,
    total_ios_installs: totalIosInstalls,
    active_devices: activeDevices,
    active_users: activeUsers,
    net_lost_devices: netLostUsers,
    net_lost_hardware_devices: netLostDevices,
    retention_rate: retentionRate,
    churn_rate: churnRate,
    total_uninstalls_raw: totalUninstalls,
    today_installs: todayInstalls,
    today_android: todayAndroid,
    today_ios: todayIos,
    yesterday_installs: yesterdayInstalls,
    yesterday_android: yesterdayAndroid,
    yesterday_ios: yesterdayIos,
    realtime_active_devices: realtimeActive,
    realtime_ios: realtimeIos,
    avg_rating: playRating?.total_avg_rating || playRating?.avg_rating || 0,
    crashes: playCrash?.crashes || 0,
    anrs: playCrash?.anrs || 0,
    store_visitors: playPerf?.visitors || 0,
    store_installers: playPerf?.installers || 0,
    timeline: mergedTimeline
  };

  mergedCache.set(cacheKey, { timestamp: nowMs, data: result });
  return result;
}

module.exports = {
  getMergedAppTelemetry,
  invalidateMergedCache
};
