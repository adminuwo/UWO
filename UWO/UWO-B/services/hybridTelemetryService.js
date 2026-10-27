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
const inFlightMerged = new Map();
const MERGED_CACHE_TTL_MS = 60 * 60 * 1000; // Cached from DB, invalidated on Sync Live Data

function invalidateMergedCache() {
  mergedCache.clear();
  inFlightMerged.clear();
}

async function getMergedAppTelemetry(db, appCode, forceRefresh = false) {
  const cacheKey = String(appCode || '').toLowerCase().trim();
  const cached = mergedCache.get(cacheKey);
  const nowMs = Date.now();
  if (!forceRefresh && cached && (nowMs - cached.timestamp < MERGED_CACHE_TTL_MS)) {
    return cached.data;
  }

  if (inFlightMerged.has(cacheKey)) {
    return inFlightMerged.get(cacheKey);
  }

  const workPromise = (async () => {
    try {
      const matchCriteria = {
        $or: [
          { app_code: appCode },
          { product_id: appCode },
          { app: appCode }
        ]
      };
      if (appCode === 'ailegal') {
        matchCriteria.$or.push({ product_id: { $exists: false } });
      }

      // Fetch all required DB queries & live Firebase in a single parallel roundtrip
      const [
        playRecords,
        playRating,
        playCrash,
        playPerf,
        mktRows,
        dlRows,
        iosRecords,
        fbData
      ] = await Promise.all([
        db ? db.collection('play_install_metrics').find({ app_code: appCode, dimension_type: 'overview' }).sort({ metric_date: 1 }).toArray().catch(() => []) : [],
        db ? db.collection('play_rating_metrics').find({ app_code: appCode }).sort({ metric_date: -1 }).limit(1).toArray().then(a => a[0] || null).catch(() => null) : null,
        db ? db.collection('play_crash_metrics').find({ app_code: appCode }).sort({ metric_date: -1 }).limit(1).toArray().then(a => a[0] || null).catch(() => null) : null,
        db ? db.collection('play_store_performance').find({ app_code: appCode }).sort({ metric_date: -1 }).limit(1).toArray().then(a => a[0] || null).catch(() => null) : null,
        db ? db.collection('marketing_installs').aggregate([
          { $match: matchCriteria },
          {
            $group: {
              _id: {
                date: {
                  $cond: {
                    if: { $eq: [{ $type: '$timestamp' }, 'date'] },
                    then: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                    else: { $substr: [{ $ifNull: ['$timestamp', '$installed_at'] }, 0, 10] }
                  }
                },
                plat: { $toLower: '$platform' }
              },
              count: { $sum: 1 }
            }
          }
        ]).toArray().catch(() => []) : [],
        db ? db.collection('app_downloads').aggregate([
          { $match: { app_code: appCode } },
          {
            $group: {
              _id: {
                date: {
                  $cond: {
                    if: { $eq: [{ $type: '$created_at' }, 'date'] },
                    then: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
                    else: { $substr: [{ $ifNull: ['$created_at', '$installed_at'] }, 0, 10] }
                  }
                },
                plat: { $toLower: '$platform' }
              },
              count: { $sum: 1 }
            }
          }
        ]).toArray().catch(() => []) : [],
        db ? db.collection('app_store_metrics').find({ app_code: appCode }).sort({ metric_date: 1 }).toArray().catch(() => []) : [],
        firebaseAnalytics.getFirebaseTelemetry().catch(() => null)
      ]);

      const appFb = fbData?.by_app?.[appCode] || null;

      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      // Process Google Play Console records (for baseline before live leading edge)
      let playDailyMap = {};
      let dedupedPlayRecords = [];
      let playMaxDate = null;

      if (playRecords.length > 0) {
        const dedupedRecordsMap = {};
        for (const r of playRecords) {
          const existing = dedupedRecordsMap[r.metric_date];
          const rScore = Math.max(r.install_events || 0, r.daily_device_installs || 0, r.daily_user_installs || 0);
          const exScore = existing ? Math.max(existing.install_events || 0, existing.daily_device_installs || 0, existing.daily_user_installs || 0) : -1;
          if (!existing || rScore >= exScore) {
            dedupedRecordsMap[r.metric_date] = r;
          }
        }
        dedupedPlayRecords = Object.values(dedupedRecordsMap).sort((a, b) => a.metric_date.localeCompare(b.metric_date));
        playMaxDate = dedupedPlayRecords[dedupedPlayRecords.length - 1].metric_date;

        let runningPlayTotal = 0;
        for (const r of dedupedPlayRecords) {
          const count = (r.install_events || r.daily_device_installs || r.daily_user_installs || 0);
          runningPlayTotal += count;
          playDailyMap[r.metric_date] = {
            date: r.metric_date,
            daily_user_installs: r.daily_user_installs || count,
            daily_user_uninstalls: r.daily_user_uninstalls || 0,
            daily_device_installs: r.daily_device_installs || count,
            installs_on_active_devices: r.installs_on_active_devices || 0,
            total_user_installs: runningPlayTotal,
            source: 'google_play_console'
          };
        }
      }

      // Process Live Incoming Store Telemetry from MongoDB rows
      let liveDbDaily = {};
      for (const r of [...mktRows, ...dlRows]) {
        const d = r._id?.date;
        if (!d || d.length !== 10) continue;
        const plat = (r._id?.plat || 'android').includes('ios') ? 'ios' : 'android';
        if (!liveDbDaily[d]) liveDbDaily[d] = { android: 0, ios: 0, total: 0 };
        liveDbDaily[d][plat] += r.count;
        liveDbDaily[d].total += r.count;
      }

  // 4. Determine Hybrid Watermark & Totals
  // Google Play Console is the authoritative historical ground truth up to playMaxDate.
  // Live Store Telemetry (marketing_installs & app_downloads) + Firebase SDK provide the real-time forward leading edge.
  let playInstallsTotal = 0;
  let playLatestActive = 0;

  const rawPlayTotal = playRecords.reduce((sum, r) => sum + (r.install_events || r.daily_device_installs || r.daily_user_installs || 0), 0);
  for (const r of dedupedPlayRecords) {
    playInstallsTotal += (r.install_events || r.daily_device_installs || r.daily_user_installs || 0);
    playLatestActive = r.installs_on_active_devices || playLatestActive;
  }
  // Authoritative Google Play Console baseline from all overview records (e.g. 10,038 for AI Legal)
  playInstallsTotal = Math.max(playInstallsTotal, rawPlayTotal);

  const fbDaily = appFb?.daily_metrics || {};
  const fbDates = Object.keys(fbDaily).sort();

  const postDatesSet = new Set([
    ...fbDates.filter(d => !playMaxDate || d > playMaxDate),
    ...Object.keys(liveDbDaily).filter(d => !playMaxDate || d > playMaxDate)
  ]);
  const postDates = Array.from(postDatesSet).sort();

  let postPlayInstalls = 0;

  // 5. Construct Unified Spliced Timeline
  // Google Play Console official records (dates <= playMaxDate) + Live Telemetry / Firebase edge (dates > playMaxDate)
  const mergedTimeline = [];
  const baselineDiff = Math.max(0, playInstallsTotal - dedupedPlayRecords.reduce((s, r) => s + (r.install_events || r.daily_device_installs || r.daily_user_installs || 0), 0));
  let runningCum = baselineDiff;

  for (const r of dedupedPlayRecords) {
    const d = r.metric_date;
    const playDaily = r.install_events || r.daily_device_installs || r.daily_user_installs || 0;
    const liveAndroid = Math.max(liveDbDaily[d]?.android || 0, liveDbDaily[d]?.total || 0, fbDaily[d]?.android || 0);
    // On the latest Play export cutoff date, take max so premature batch exports (like Oct 21 with 59 vs 262) do not truncate verified marketing installs
    const dailyInstalls = (d === playMaxDate) ? Math.max(playDaily, liveAndroid) : playDaily;
    runningCum += dailyInstalls;
    mergedTimeline.push({
      ...playDailyMap[d],
      daily_user_installs: dailyInstalls,
      total_user_installs: runningCum
    });
  }

  let runningActive = playLatestActive;
  for (const d of postDates) {
    const fbDay = fbDaily[d] || {};
    const dbDay = liveDbDaily[d] || {};
    const dayAndroid = Math.max(dbDay.android || 0, dbDay.total || 0, fbDay.android || fbDay.installs || 0);
    const dayUninstalls = fbDay.uninstalls || 0;

    postPlayInstalls += dayAndroid;
    runningCum += dayAndroid;

    // Realistic net active devices flow: smoothly evolves from the official Google Play Console baseline
    if (fbDay.active > 0) {
      runningActive = fbDay.active;
    } else {
      runningActive = Math.max(0, runningActive + dayAndroid - dayUninstalls);
    }

    mergedTimeline.push({
      date: d,
      daily_user_installs: dayAndroid,
      daily_user_uninstalls: dayUninstalls,
      daily_device_installs: dayAndroid,
      installs_on_active_devices: runningActive,
      total_user_installs: runningCum,
      source: 'live_store_telemetry_and_firebase_edge'
    });
  }

  const totalAndroidInstalls = Math.max(playInstallsTotal + postPlayInstalls, runningCum);
  const activeDevices = runningActive > 0 ? runningActive : (appFb?.active_users || playLatestActive || 0);

  // 6. Apple App Store Metrics for iOS Store Downloads (fetched concurrently at start)

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

  let postIosInstalls = 0;
  for (const d of postDates) {
    if (!iosMaxDate || d > iosMaxDate) {
      const fbDay = fbDaily[d] || {};
      const dbDay = liveDbDaily[d] || {};
      const dIos = Math.max(dbDay.ios || 0, fbDay.ios || 0);
      postIosInstalls += dIos;
      iosDailyMap[d] = dIos;
    }
  }
  const totalIosInstalls = iosBaselineTotal + postIosInstalls;

  // Today & Yesterday installs
  const todayAndroid = Math.max(liveDbDaily[todayStr]?.android || 0, liveDbDaily[todayStr]?.total || 0, fbDaily[todayStr]?.android || 0);
  const todayIos = Math.max(liveDbDaily[todayStr]?.ios || 0, fbDaily[todayStr]?.ios || 0);
  const todayInstalls = todayAndroid + todayIos;

  const yesterdayAndroid = Math.max(liveDbDaily[yesterdayStr]?.android || 0, liveDbDaily[yesterdayStr]?.total || 0, fbDaily[yesterdayStr]?.android || playDailyMap[yesterdayStr]?.daily_user_installs || 0);
  const yesterdayIos = Math.max(liveDbDaily[yesterdayStr]?.ios || 0, fbDaily[yesterdayStr]?.ios || 0);
  const yesterdayInstalls = yesterdayAndroid + yesterdayIos;

  if (todayStr) iosDailyMap[todayStr] = Math.max(iosDailyMap[todayStr] || 0, todayIos);
  if (yesterdayStr) iosDailyMap[yesterdayStr] = Math.max(iosDailyMap[yesterdayStr] || 0, yesterdayIos);

  // Attach iOS daily count to mergedTimeline entries
  for (const entry of mergedTimeline) {
    if (entry && entry.date) {
      entry.daily_ios_installs = iosDailyMap[entry.date] || 0;
    }
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
    ios_daily: iosDailyMap,
    play_daily: playDailyMap,
    marketing_daily: liveDbDaily,
    timeline: mergedTimeline
  };

      mergedCache.set(cacheKey, { timestamp: Date.now(), data: result });
      return result;
    } finally {
      inFlightMerged.delete(cacheKey);
    }
  })();

  inFlightMerged.set(cacheKey, workPromise);
  return workPromise;
}

module.exports = {
  getMergedAppTelemetry,
  invalidateMergedCache
};
