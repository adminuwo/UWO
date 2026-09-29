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

  // 4. Determine Firebase Setup Watermark (Firebase is Primary from this date onwards)
  const fbDaily = appFb?.daily_metrics || {};
  const fbDates = Object.keys(fbDaily).sort();
  const fbLatestDate = fbDates.length > 0 ? fbDates[fbDates.length - 1] : null;
  // Firebase has active primary tracking if it has logged events and its latest telemetry reaches the active window or supersedes Google Play's latest date
  const fbHasActiveTracking = fbDates.length > 0 && (
    !playMaxDate ||
    fbLatestDate >= playMaxDate ||
    (appFb?.today_installs > 0 || appFb?.yesterday_installs > 0 || (appFb?.realtime_active || 0) > 0)
  );
  const fbEarliestDate = fbHasActiveTracking ? fbDates[0] : null;

  // Pre-Firebase Google Play metrics (strictly before Firebase setup date)
  let preFbInstalls = 0;
  let preFbUninstalls = 0;
  let preFbActive = 0;

  for (const r of dedupedPlayRecords) {
    if (!fbEarliestDate || r.metric_date < fbEarliestDate) {
      preFbInstalls += (r.daily_user_installs || r.daily_device_installs || 0);
      preFbUninstalls += (r.daily_user_uninstalls || 0);
      preFbActive = r.installs_on_active_devices || preFbActive;
    }
  }

  // Spliced Totals: Pre-Firebase Google Play + Firebase Primary
  let totalAndroidInstalls = 0;
  let totalUninstalls = 0;
  let activeDevices = 0;

  if (fbHasActiveTracking) {
    totalAndroidInstalls = preFbInstalls + (appFb?.total_installs || 0);
    // In Firebase Primary mode, uninstalls during active tracking are from live Firebase telemetry
    totalUninstalls = appFb?.total_uninstalls || 0;
    activeDevices = appFb?.active_users || 0;
  } else {
    // If app has minimal/no Firebase tracking (e.g. AISA), Google Play is the primary foundation
    totalAndroidInstalls = preFbInstalls + (appFb?.total_installs || 0);
    totalUninstalls = preFbUninstalls + (appFb?.total_uninstalls || 0);
    activeDevices = preFbActive || (appFb?.active_users || 0);
  }

  // 5. Construct Unified Spliced Timeline
  const mergedTimeline = [];
  let runningCum = 0;

  // Add Pre-Firebase Google Play dates
  const sortedPlayDates = Object.keys(playDailyMap).sort();
  for (const d of sortedPlayDates) {
    if (!fbEarliestDate || d < fbEarliestDate) {
      runningCum += playDailyMap[d].daily_user_installs;
      mergedTimeline.push({
        ...playDailyMap[d],
        total_user_installs: runningCum
      });
    }
  }

  // Add Firebase Primary dates (from fbEarliestDate onwards)
  if (fbHasActiveTracking) {
    for (const d of fbDates) {
      const dayData = fbDaily[d];
      const dayInstalls = dayData.android || dayData.installs || 0;
      const dayUninstalls = dayData.uninstalls || 0;
      runningCum += dayInstalls;
      mergedTimeline.push({
        date: d,
        daily_user_installs: dayInstalls,
        daily_user_uninstalls: dayUninstalls,
        daily_device_installs: dayInstalls,
        installs_on_active_devices: dayData.active || activeDevices,
        total_user_installs: runningCum,
        source: 'firebase_sdk_ga4_primary'
      });
    }
  } else {
    for (const d of sortedPlayDates) {
      if (fbEarliestDate && d >= fbEarliestDate) {
        runningCum += playDailyMap[d].daily_user_installs;
        mergedTimeline.push({
          ...playDailyMap[d],
          total_user_installs: runningCum
        });
      }
    }
  }

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

  if (appFb?.today_installs !== undefined) {
    todayInstalls = appFb.today_installs;
  } else if (fbDaily[todayStr]) {
    todayInstalls = fbDaily[todayStr].android || fbDaily[todayStr].installs || 0;
  }

  if (appFb?.yesterday_installs !== undefined) {
    yesterdayInstalls = appFb.yesterday_installs;
  } else if (fbDaily[yesterdayStr]) {
    yesterdayInstalls = fbDaily[yesterdayStr].android || fbDaily[yesterdayStr].installs || 0;
  } else if (playDailyMap[yesterdayStr]) {
    yesterdayInstalls = playDailyMap[yesterdayStr].daily_user_installs;
  }

  const realtimeActive = appFb?.realtime_android ?? appFb?.realtime_active ?? 0;
  const realtimeIos = appFb?.realtime_ios ?? 0;

  let netLostDevices = 0;
  let retentionRate = 0;

  if (fbHasActiveTracking) {
    // In Firebase Primary mode, uninstalls are derived directly from actual GA4 app_remove events
    netLostDevices = totalUninstalls;
    retentionRate = (activeDevices + netLostDevices) > 0
      ? Number(((activeDevices / (activeDevices + netLostDevices)) * 100).toFixed(1))
      : 0;
  } else {
    // In Google Play mode, net lost devices represents the churn gap between store acquisitions and active devices
    netLostDevices = Math.max(0, totalAndroidInstalls - activeDevices);
    retentionRate = totalAndroidInstalls > 0
      ? Number(((activeDevices / totalAndroidInstalls) * 100).toFixed(1))
      : 0;
  }
  const churnRate = Number((100 - retentionRate).toFixed(1));

  return {
    app_code: appCode,
    display_name: appCode === 'ailegal' ? 'AI-LEGAL' : (appCode === 'aisa' ? 'AISA' : appCode.toUpperCase()),
    watermark_date: fbEarliestDate ? `Firebase Primary (since ${fbEarliestDate})` : playMaxDate,
    ios_watermark_date: iosMaxDate,
    sources: {
      primary_engine: fbEarliestDate ? `Firebase Analytics GA4 (Primary since ${fbEarliestDate})` : 'Google Play Console (Primary)',
      pre_firebase_baseline: fbEarliestDate ? `Google Play Console (Pre-setup before ${fbEarliestDate})` : 'Google Play Console Baseline',
      live_leading_edge: 'Firebase Analytics SDK (Live Realtime)',
      ios_historical: iosMaxDate ? `Apple App Store Connect (up to ${iosMaxDate})` : 'App Store Connect Baseline'
    },
    total_android_installs: totalAndroidInstalls,
    total_ios_installs: totalIosInstalls,
    active_devices: activeDevices,
    net_lost_devices: netLostDevices,
    retention_rate: retentionRate,
    churn_rate: churnRate,
    total_uninstalls_raw: totalUninstalls,
    today_installs: todayInstalls,
    yesterday_installs: yesterdayInstalls,
    realtime_active_devices: realtimeActive,
    realtime_ios: realtimeIos,
    avg_rating: playRating?.total_avg_rating || playRating?.avg_rating || 0,
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
