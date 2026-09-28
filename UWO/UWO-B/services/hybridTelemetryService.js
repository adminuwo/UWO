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

async function getMergedAppTelemetry(db, appCode) {
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

  // 3. Determine Google Play latest date (Watermark)
  let playMaxDate = null;
  let playBaselineTotal = 0;
  let playBaselineActive = 0;
  let playDailyMap = {};

  if (playRecords.length > 0) {
    const latestRec = playRecords[playRecords.length - 1];
    playMaxDate = latestRec.metric_date;
    playBaselineTotal = latestRec.total_user_installs || 0;
    playBaselineActive = latestRec.installs_on_active_devices || 0;

    for (const r of playRecords) {
      playDailyMap[r.metric_date] = {
        date: r.metric_date,
        daily_user_installs: r.daily_user_installs || 0,
        daily_user_uninstalls: r.daily_user_uninstalls || 0,
        daily_device_installs: r.daily_device_installs || 0,
        installs_on_active_devices: r.installs_on_active_devices || 0,
        total_user_installs: r.total_user_installs || 0,
        source: 'google_play_console'
      };
    }
  }

  // 4. Merge Firebase Daily Metrics for dates > playMaxDate (Deduplicated Splicing)
  const mergedTimeline = [];
  const fbDaily = appFb?.daily_metrics || {};
  let fbPostWatermarkInstalls = 0;
  let fbPostWatermarkUninstalls = 0;

  // Add all Play Console dates first
  const sortedPlayDates = Object.keys(playDailyMap).sort();
  for (const d of sortedPlayDates) {
    mergedTimeline.push(playDailyMap[d]);
  }

  // Add Firebase dates strictly after playMaxDate (or all if no Play Console data yet)
  const sortedFbDates = Object.keys(fbDaily).sort();
  for (const d of sortedFbDates) {
    if (!playMaxDate || d > playMaxDate) {
      const item = fbDaily[d];
      const installs = item.android || item.installs || 0;
      const uninstalls = item.uninstalls || 0;
      fbPostWatermarkInstalls += installs;
      fbPostWatermarkUninstalls += uninstalls;

      mergedTimeline.push({
        date: d,
        daily_user_installs: installs,
        daily_user_uninstalls: uninstalls,
        daily_device_installs: installs,
        installs_on_active_devices: item.active || 0,
        total_user_installs: playBaselineTotal + fbPostWatermarkInstalls,
        source: 'firebase_live_sdk'
      });
    }
    // If d <= playMaxDate, it is SKIPPED to prevent any duplicate data!
  }

  // 5. Query Apple App Store Metrics for iOS Hybrid Splicing
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

  let fbPostWatermarkIos = 0;
  for (const d of sortedFbDates) {
    if (!iosMaxDate || d > iosMaxDate) {
      const item = fbDaily[d];
      fbPostWatermarkIos += (item.ios || 0);
    }
  }

  let totalIosInstalls = 0;
  if (iosBaselineTotal > 0) {
    totalIosInstalls = iosBaselineTotal + fbPostWatermarkIos;
  } else {
    totalIosInstalls = appFb?.ios_installs || 0;
  }

  // 6. Compute Totals & Key Indicators
  let totalAndroidInstalls = 0;
  let activeDevices = 0;

  if (playBaselineTotal > 0) {
    totalAndroidInstalls = playBaselineTotal + fbPostWatermarkInstalls;
    activeDevices = playBaselineActive > 0 ? playBaselineActive : (appFb?.active_users || 0);
  } else {
    // If no Play Console GCS records exist yet, use live Firebase metrics
    totalAndroidInstalls = appFb?.android_installs || appFb?.total_installs || 0;
    activeDevices = appFb?.active_users || 0;
  }

  // Today & Yesterday installs
  let todayInstalls = 0;
  let yesterdayInstalls = 0;

  if (appFb?.today_installs !== undefined) {
    todayInstalls = appFb.today_installs;
  } else if (fbDaily[todayStr]) {
    todayInstalls = fbDaily[todayStr].android || fbDaily[todayStr].installs || 0;
  }

  if (playDailyMap[yesterdayStr]) {
    yesterdayInstalls = playDailyMap[yesterdayStr].daily_user_installs;
  } else if (appFb?.yesterday_installs !== undefined) {
    yesterdayInstalls = appFb.yesterday_installs;
  } else if (fbDaily[yesterdayStr]) {
    yesterdayInstalls = fbDaily[yesterdayStr].android || fbDaily[yesterdayStr].installs || 0;
  }

  const realtimeActive = appFb?.realtime_android ?? appFb?.realtime_active ?? 0;
  const realtimeIos = appFb?.realtime_ios ?? 0;

  return {
    app_code: appCode,
    display_name: appCode === 'ailegal' ? 'AI-LEGAL' : 'AISA',
    watermark_date: playMaxDate,
    ios_watermark_date: iosMaxDate,
    sources: {
      android_historical: playMaxDate ? `Google Play Console (up to ${playMaxDate})` : 'Awaiting Play Console GCS Sync',
      ios_historical: iosMaxDate ? `Apple App Store Connect (up to ${iosMaxDate})` : 'App Store Connect Baseline',
      live_leading_edge: 'Firebase Analytics SDK (Live Realtime)'
    },
    total_android_installs: totalAndroidInstalls,
    total_ios_installs: totalIosInstalls,
    active_devices: activeDevices,
    today_installs: todayInstalls,
    yesterday_installs: yesterdayInstalls,
    realtime_active_devices: realtimeActive,
    realtime_ios: realtimeIos,
    avg_rating: playRating?.avg_rating || 0,
    crashes: playCrash?.crashes || 0,
    anrs: playCrash?.anrs || 0,
    store_visitors: playPerf?.visitors || 0,
    store_installers: playPerf?.installers || 0,
    timeline: mergedTimeline
  };
}

module.exports = {
  getMergedAppTelemetry
};
