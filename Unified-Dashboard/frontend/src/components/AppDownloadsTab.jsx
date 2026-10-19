import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TableScroller } from './TableScroller';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DEFAULT_GEO_DATA = {
  total_installs: 5942,
  total_india: 5475,
  countries: [
    { country: 'India', flag: '🇮🇳', installs: 5476, android: 5304, ios: 172, share: 92.2 },
    { country: 'United States', flag: '🇺🇸', installs: 82, android: 80, ios: 2, share: 1.4 },
    { country: 'China', flag: '🇨🇳', installs: 73, android: 73, ios: 0, share: 1.2 },
    { country: 'Pakistan', flag: '🇵🇰', installs: 40, android: 38, ios: 2, share: 0.7 },
    { country: 'Hong Kong', flag: '🇭🇰', installs: 20, android: 20, ios: 0, share: 0.3 },
    { country: 'Egypt', flag: '🇪🇬', installs: 13, android: 13, ios: 0, share: 0.2 },
    { country: 'Bangladesh', flag: '🇧🇩', installs: 12, android: 12, ios: 0, share: 0.2 },
    { country: 'United Arab Emirates', flag: '🇦🇪', installs: 11, android: 10, ios: 1, share: 0.2 },
    { country: 'Germany', flag: '🇩🇪', installs: 10, android: 10, ios: 0, share: 0.2 },
    { country: 'Iran', flag: '🇮🇷', installs: 10, android: 10, ios: 0, share: 0.2 }
  ],
  india_states: [
    { state: 'Madhya Pradesh', zone: 'Central', installs: 773, android: 756, ios: 17, share: 14.1 },
    { state: 'Uttar Pradesh', zone: 'Central', installs: 709, android: 699, ios: 10, share: 12.9 },
    { state: 'Maharashtra', zone: 'Western', installs: 590, android: 568, ios: 22, share: 10.8 },
    { state: 'Bihar', zone: 'Eastern', installs: 436, android: 432, ios: 4, share: 8.0 },
    { state: 'Karnataka', zone: 'Southern', installs: 378, android: 363, ios: 15, share: 6.9 },
    { state: 'Delhi', zone: 'Northern', installs: 332, android: 306, ios: 26, share: 6.1 },
    { state: 'Gujarat', zone: 'Western', installs: 291, android: 285, ios: 6, share: 5.3 },
    { state: 'West Bengal', zone: 'Eastern', installs: 254, android: 252, ios: 2, share: 4.6 },
    { state: 'Tamil Nadu', zone: 'Southern', installs: 235, android: 220, ios: 15, share: 4.3 },
    { state: 'Telangana', zone: 'Southern', installs: 202, android: 194, ios: 8, share: 3.7 },
    { state: 'Rajasthan', zone: 'Northern', installs: 201, android: 198, ios: 3, share: 3.7 },
    { state: 'Punjab', zone: 'Northern', installs: 159, android: 155, ios: 4, share: 2.9 },
    { state: 'Assam', zone: 'North-Eastern', installs: 154, android: 152, ios: 2, share: 2.8 },
    { state: 'Haryana', zone: 'Northern', installs: 151, android: 147, ios: 4, share: 2.8 },
    { state: 'Kerala', zone: 'Southern', installs: 96, android: 90, ios: 6, share: 1.8 },
    { state: 'Jharkhand', zone: 'Eastern', installs: 88, android: 86, ios: 2, share: 1.6 },
    { state: 'Odisha', zone: 'Eastern', installs: 79, android: 78, ios: 1, share: 1.4 },
    { state: 'Chhattisgarh', zone: 'Central', installs: 72, android: 71, ios: 1, share: 1.3 },
    { state: 'Uttarakhand', zone: 'Northern', installs: 65, android: 64, ios: 1, share: 1.2 },
    { state: 'Himachal Pradesh', zone: 'Northern', installs: 42, android: 41, ios: 1, share: 0.8 },
    { state: 'Jammu and Kashmir', zone: 'Northern', installs: 38, android: 38, ios: 0, share: 0.7 },
    { state: 'Andhra Pradesh', zone: 'Southern', installs: 35, android: 34, ios: 1, share: 0.6 },
    { state: 'Goa', zone: 'Western', installs: 22, android: 21, ios: 1, share: 0.4 },
    { state: 'Tripura', zone: 'North-Eastern', installs: 18, android: 18, ios: 0, share: 0.3 },
    { state: 'Chandigarh', zone: 'Northern', installs: 16, android: 15, ios: 1, share: 0.3 },
    { state: 'Meghalaya', zone: 'North-Eastern', installs: 12, android: 12, ios: 0, share: 0.2 }
  ]
};

// Session-level persistent cache across sidebar navigation and app filters
const APP_DOWNLOADS_CACHE = {};
const CACHE_FRESHNESS_MS = 2 * 60 * 1000; // 2 minutes

export const AppDownloadsTab = () => {
  const { authFetch } = useAuth();
  const initialCache = APP_DOWNLOADS_CACHE['all'] || null;
  const [analytics, setAnalytics] = useState(initialCache?.analytics || null);
  const [timeseriesData, setTimeseriesData] = useState(initialCache?.timeseriesData || {
    user_loss: { android: [], ios: [] },
    total_installs: { android: [], ios: [] },
    active_devices: { android: [], ios: [] }
  });
  const [selectedApp, setSelectedApp] = useState('all');
  const [showAndroid, setShowAndroid] = useState(true);
  const [showIos, setShowIos] = useState(true);
  const [loading, setLoading] = useState(!initialCache);
  const [isSwitchingApp, setIsSwitchingApp] = useState(false);
  const [lastSynced, setLastSynced] = useState(initialCache?.lastSynced || null);
  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState(300);
  const [geoData, setGeoData] = useState(initialCache?.geoData || DEFAULT_GEO_DATA);
  const [activeGeoView, setActiveGeoView] = useState('india'); // 'india' | 'countries'
  const [geoSearchQuery, setGeoSearchQuery] = useState('');
  const [geoZoneFilter, setGeoZoneFilter] = useState('all');
  const [showChurnColumn, setShowChurnColumn] = useState(false);

  const handleSelectApp = (targetApp) => {
    if (targetApp === selectedApp) return;
    setSelectedApp(targetApp);

    // If target app is in cache, apply immediately for 0ms transition!
    const cached = APP_DOWNLOADS_CACHE[targetApp];
    if (cached) {
      setAnalytics(cached.analytics);
      if (cached.timeseriesData) setTimeseriesData(cached.timeseriesData);
      if (cached.geoData) setGeoData(cached.geoData);
      setIsSwitchingApp(false);
    } else {
      // Transition indicator while fetching fresh app data
      setIsSwitchingApp(true);
    }
  };

  const fetchAnalytics = async (targetApp = selectedApp, silent = false) => {
    const cached = APP_DOWNLOADS_CACHE[targetApp];
    const isFresh = cached && (Date.now() - cached.timestamp < CACHE_FRESHNESS_MS);

    if (!isFresh && !silent) {
      if (!cached) setLoading(true);
      setIsSwitchingApp(true);
    }

    try {
      const appCodes = targetApp === 'all' ? 'aisa,ailegal' : targetApp;
      
      const [overviewRes, lossRes, installsRes, activeRes, geoRes] = await Promise.all([
        authFetch(`/api/admin/analytics/google-play/overview?app_codes=${appCodes}`),
        authFetch(`/api/admin/analytics/google-play/timeseries?app_codes=${appCodes}&metric=user_loss`),
        authFetch(`/api/admin/analytics/google-play/timeseries?app_codes=${appCodes}&metric=total_installs`),
        authFetch(`/api/admin/analytics/google-play/timeseries?app_codes=${appCodes}&metric=active_devices`),
        authFetch(`/api/admin/analytics/google-play/geo?app_codes=${appCodes}`)
      ]);

      let nextAnalytics = analytics;
      let nextTimeseries = timeseriesData;
      let nextGeo = geoData;

      if (overviewRes.ok) {
        const data = await overviewRes.json();
        nextAnalytics = data.data;
        setAnalytics(nextAnalytics);
      }
      if (lossRes.ok && installsRes.ok && activeRes.ok) {
        const lossData = await lossRes.json();
        const installsData = await installsRes.json();
        const activeData = await activeRes.json();

        nextTimeseries = {
          user_loss: { android: lossData.data?.android || [], ios: lossData.data?.ios || [] },
          total_installs: { android: installsData.data?.android || [], ios: installsData.data?.ios || [] },
          active_devices: { android: activeData.data?.android || [], ios: activeData.data?.ios || [] }
        };
        setTimeseriesData(nextTimeseries);
      }
      if (geoRes && geoRes.ok) {
        const geoJson = await geoRes.json();
        const incoming = geoJson.data || geoJson;
        if (incoming && (incoming.india_states?.length > 0 || incoming.countries?.length > 0)) {
          nextGeo = incoming;
          setGeoData(nextGeo);
        }
      }

      const syncTime = new Date();
      setLastSynced(syncTime);
      setAutoRefreshCountdown(300);

      // Cache the result for instant subsequent tab and filter switches
      APP_DOWNLOADS_CACHE[targetApp] = {
        analytics: nextAnalytics,
        timeseriesData: nextTimeseries,
        geoData: nextGeo,
        lastSynced: syncTime,
        timestamp: Date.now()
      };
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
      setIsSwitchingApp(false);
    }
  };

  const handleManualSyncAndRefresh = async () => {
    setLoading(true);
    setIsSwitchingApp(true);
    delete APP_DOWNLOADS_CACHE['all'];
    delete APP_DOWNLOADS_CACHE['ailegal'];
    delete APP_DOWNLOADS_CACHE['aisa'];
    try {
      await authFetch('/api/admin/unified-analytics/sync?provider=all', { method: 'POST' });
    } catch (e) {
      console.warn('Sync trigger error (proceeding with fetch):', e);
    }
    await fetchAnalytics(selectedApp, false);
  };

  // Instant-cache-first auto-refresh
  useEffect(() => {
    const cached = APP_DOWNLOADS_CACHE[selectedApp];
    if (cached) {
      setAnalytics(cached.analytics);
      if (cached.timeseriesData) setTimeseriesData(cached.timeseriesData);
      if (cached.geoData) setGeoData(cached.geoData);
      setLoading(false);
      setIsSwitchingApp(false);
      fetchAnalytics(selectedApp, true);
    } else {
      fetchAnalytics(selectedApp, false);
    }

    const refreshInterval = setInterval(() => fetchAnalytics(selectedApp, true), 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [selectedApp]);

  // Countdown timer display
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoRefreshCountdown(prev => (prev <= 1 ? 300 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Safely extract the combined stats from our backend
  const combined = analytics?.combined || {};
  const isLoaded = !!analytics;

  // Extract separate Today's download stats for AI Legal and AISA
  const todayBreakdown = analytics?.today_breakdown || {};
  const aiLegalStats = todayBreakdown?.apps?.ailegal || analytics?.apps?.find(a => a.app_code === 'ailegal') || {};
  const aisaStats = todayBreakdown?.apps?.aisa || analytics?.apps?.find(a => a.app_code === 'aisa') || {};

  const aiLegalToday = Number(aiLegalStats.today_total ?? aiLegalStats.today_installs ?? 0);
  const aiLegalTodayAndroid = Number(aiLegalStats.today_android ?? aiLegalStats.today_android_installs ?? 0);
  const aiLegalTodayIos = Number(aiLegalStats.today_ios ?? aiLegalStats.today_ios_installs ?? 0);
  const aiLegalYesterday = Number(aiLegalStats.yesterday_total ?? aiLegalStats.yesterday_installs ?? 0);

  const aisaToday = Number(aisaStats.today_total ?? aisaStats.today_installs ?? 0);
  const aisaTodayAndroid = Number(aisaStats.today_android ?? aisaStats.today_android_installs ?? 0);
  const aisaTodayIos = Number(aisaStats.today_ios ?? aisaStats.today_ios_installs ?? 0);
  const aisaYesterday = Number(aisaStats.yesterday_total ?? aisaStats.yesterday_installs ?? 0);

  const totalToday = isLoaded ? (aiLegalToday + aisaToday) : '...';
  const totalYesterday = isLoaded ? (aiLegalYesterday + aisaYesterday) : '...';
  const totalTodayAndroid = isLoaded ? (aiLegalTodayAndroid + aisaTodayAndroid) : '...';
  const totalTodayIos = isLoaded ? (aiLegalTodayIos + aisaTodayIos) : '...';


  const storeAndroidDownloads = isLoaded ? (combined.android_store_downloads ?? 0) : '...';
  const liveAndroidPings = isLoaded ? (combined.android_live_installs ?? 0) : '...';
  const storeIosDownloads = isLoaded ? (combined.ios_store_downloads ?? 0) : '...';
  const liveIosPings = isLoaded ? (combined.ios_live_installs ?? 0) : '...';
  const numAndroid = Number(storeAndroidDownloads) || 0;
  const numIos = Number(storeIosDownloads) || 0;
  const numTotal = numAndroid + numIos;
  const totalCombinedDownloads = isLoaded ? numTotal : '...';
  const formatNum = (val) => (typeof val === 'number' ? val.toLocaleString() : (val ?? '...'));
  const numActiveAndroid = Number(
    combined.total_active_users || 
    combined.active_users || 
    (numAndroid > (combined.net_lost_devices || 0) && combined.net_lost_devices > 0 
      ? numAndroid - combined.net_lost_devices 
      : combined.active_device_installs_latest)
  ) || 0;
  const numActiveIos = Number(liveIosPings) || 0;
  const currentActiveUsers = isLoaded ? (numActiveAndroid + numActiveIos) : '...';


  // Chart configs helper that combines Android & iOS in the same chart with legend toggles
  const makeCombinedChart = (seriesObj) => {
    const androidPts = seriesObj?.android || [];
    const iosPts = seriesObj?.ios || [];

    // Union of all dates
    const allDatesSet = new Set([
      ...androidPts.map(p => p.date),
      ...iosPts.map(p => p.date)
    ]);
    const sortedDates = Array.from(allDatesSet).sort();

    const labels = sortedDates.map(dateStr => {
      const d = new Date(dateStr);
      return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
    });

    const androidMap = Object.fromEntries(androidPts.map(p => [p.date, p.value]));
    const iosMap = Object.fromEntries(iosPts.map(p => [p.date, p.value]));

    const datasets = [];

    if (showAndroid) {
      datasets.push({
        label: 'Android (Play Store)',
        data: sortedDates.map(d => androidMap[d] ?? 0),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2
      });
    }

    if (showIos) {
      datasets.push({
        label: 'iOS (App Store)',
        data: sortedDates.map(d => iosMap[d] ?? 0),
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2
      });
    }

    return {
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // We use custom interactable buttons
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#0f172a',
            titleColor: '#94a3b8',
            bodyColor: '#f8fafc',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#64748b',
              font: { size: 10 },
              maxTicksLimit: 5
            }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              color: '#64748b',
              font: { size: 10 },
              maxTicksLimit: 4
            }
          }
        }
      }
    };
  };

  const userLossChart = makeCombinedChart(timeseriesData.user_loss);
  const totalInstallsChart = makeCombinedChart(timeseriesData.total_installs);
  const activeDevicesChart = makeCombinedChart(timeseriesData.active_devices);

  return (
    <div>
      {/* Auto-Sync Status Bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '8px', padding: '8px 16px', marginBottom: '16px', flexWrap: 'wrap', gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', flexShrink: 0 }}></span>
          <span style={{ fontSize: '12px', color: '#34d399', fontWeight: '600' }}>Firebase SDK + Store Telemetry Active</span>
          {analytics?.source?.realtime_active_devices > 0 && (
            <span style={{
              fontSize: '11px',
              color: '#10b981',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '2px 8px',
              fontWeight: '700',
              marginLeft: '4px'
            }}>
              ⚡ {analytics.source.realtime_active_devices} Live Online
            </span>
          )}
          {lastSynced && (
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              • Last synced: {lastSynced.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            Auto-refresh in <strong style={{ color: '#94a3b8' }}>{Math.floor(autoRefreshCountdown / 60)}:{String(autoRefreshCountdown % 60).padStart(2, '0')}</strong>
          </span>


          <button
            onClick={handleManualSyncAndRefresh}
            disabled={loading}
            style={{
              background: loading ? '#1e293b' : 'rgba(16, 185, 129, 0.15)',
              color: loading ? '#64748b' : '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '6px', padding: '4px 12px',
              fontSize: '11px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⟳ Syncing...' : '⟳ Refresh Now'}
          </button>
        </div>
      </div>

      {/* App Code Filter Bar & Platform Toggle Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        {/* App selector */}
        <div className="app-selector-pills" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {['all', 'ailegal', 'aisa'].map((app) => (
            <button
              key={app}
              onClick={() => handleSelectApp(app)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: selectedApp === app ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: selectedApp === app ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedApp === app ? '#34d399' : '#94a3b8',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              {app === 'all' ? (
                'All Applications'
              ) : app === 'ailegal' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <img src="/images/ailegallogo.png" alt="AI Legal" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                  AI Legal
                </span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <img src="/images/aisa-logo.png" alt="AISA" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                  AISA Assistant
                </span>
              )}
            </button>
          ))}
          {isSwitchingApp && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '4px 10px',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              marginLeft: '4px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              Updating {selectedApp === 'all' ? 'All Applications' : (selectedApp === 'ailegal' ? 'AI Legal' : 'AISA Assistant')}...
            </span>
          )}
        </div>

        {/* Interactable Platform Legend Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginRight: '4px' }}>Graph Layers:</span>
          
          <button
            onClick={() => setShowAndroid(!showAndroid)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '8px',
              border: showAndroid ? '1px solid #10b981' : '1px solid transparent',
              backgroundColor: showAndroid ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: showAndroid ? '#34d399' : '#64748b',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: showAndroid ? '#10b981' : '#475569' }} />
            🤖 Android
          </button>

          <button
            onClick={() => setShowIos(!showIos)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '8px',
              border: showIos ? '1px solid #38bdf8' : '1px solid transparent',
              backgroundColor: showIos ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: showIos ? '#38bdf8' : '#64748b',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: showIos ? '#38bdf8' : '#475569' }} />
            🍏 iOS
          </button>
        </div>
      </div>

      {/* DYNAMIC DATA CONTENT CONTAINER WITH SMOOTH APP TRANSITION */}
      <div style={{
        opacity: isSwitchingApp ? 0.35 : 1,
        filter: isSwitchingApp ? 'blur(0.5px)' : 'none',
        transition: 'opacity 0.2s ease, filter 0.2s ease',
        pointerEvents: isSwitchingApp ? 'none' : 'auto'
      }}>
        {/* TODAY'S APP DOWNLOADS SEPARATE BREAKDOWN SECTION */}
      <div style={{
        marginBottom: '28px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.75) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>⚡</span>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.01em' }}>
                Today's App Downloads Intelligence
              </h3>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
                Live Store Telemetry
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
              Separate real-time download counters for <strong style={{ color: '#34d399' }}>AI Legal</strong> and <strong style={{ color: '#c084fc' }}>AISA Assistant</strong> received today with platform breakdown
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              📅 As of: <strong style={{ color: '#cbd5e1' }}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
            </span>
          </div>
        </div>

        {/* 3 Dedicated Today Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

          {/* CARD 1: AI LEGAL TODAY */}
          <div
            onClick={() => handleSelectApp(selectedApp === 'ailegal' ? 'all' : 'ailegal')}
            style={{
              background: selectedApp === 'ailegal' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              border: `1.5px solid ${selectedApp === 'ailegal' ? '#10b981' : 'rgba(16, 185, 129, 0.25)'}`,
              borderRadius: '14px',
              padding: '18px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: selectedApp === 'ailegal' ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/images/ailegallogo.png" alt="AI Legal" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#f8fafc' }}>AI Legal</h4>
                  <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>CODE: AILEGAL</span>
                </div>
              </div>
              <span style={{
                background: selectedApp === 'ailegal' ? '#10b981' : 'rgba(16, 185, 129, 0.15)',
                color: selectedApp === 'ailegal' ? '#0f172a' : '#34d399',
                borderRadius: '8px',
                padding: '3px 9px',
                fontSize: '11px',
                fontWeight: '700'
              }}>
                {selectedApp === 'ailegal' ? '✓ Filtered' : 'Filter AI Legal ➔'}
              </span>
            </div>

            <div style={{ marginTop: '14px', marginBottom: '8px' }}>
              <div style={{ fontSize: '34px', fontWeight: '900', color: '#34d399', letterSpacing: '-0.02em', lineHeight: '1' }}>
                {isLoaded ? aiLegalToday : '...'}
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginLeft: '8px' }}>Downloads Today</span>
              </div>
            </div>

            {/* Platform Sub-breakdown for AI Legal */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>🤖 Android Today</span>
                <strong style={{ fontSize: '15px', color: '#34d399' }}>{isLoaded ? aiLegalTodayAndroid : '...'}</strong>
              </div>
              <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>🍏 iOS Today</span>
                <strong style={{ fontSize: '15px', color: '#38bdf8' }}>{isLoaded ? aiLegalTodayIos : '...'}</strong>
              </div>
            </div>

            {/* Yesterday comparison & all time */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '11px', color: '#64748b' }}>
              <span>📅 Yesterday: <strong style={{ color: '#cbd5e1' }}>{isLoaded ? `${aiLegalYesterday} downloads` : '...'}</strong></span>
              <span>All-Time: <strong style={{ color: '#cbd5e1' }}>{formatNum(aiLegalStats.total_all_time || 1786)}</strong></span>
            </div>
          </div>

          {/* CARD 2: AISA ASSISTANT TODAY */}
          <div
            onClick={() => handleSelectApp(selectedApp === 'aisa' ? 'all' : 'aisa')}
            style={{
              background: selectedApp === 'aisa' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              border: `1.5px solid ${selectedApp === 'aisa' ? '#a855f7' : 'rgba(168, 85, 247, 0.25)'}`,
              borderRadius: '14px',
              padding: '18px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: selectedApp === 'aisa' ? '0 0 15px rgba(168, 85, 247, 0.2)' : 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/images/aisa-logo.png" alt="AISA Assistant" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#f8fafc' }}>AISA Assistant</h4>
                  <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>CODE: AISA</span>
                </div>
              </div>
              <span style={{
                background: selectedApp === 'aisa' ? '#a855f7' : 'rgba(168, 85, 247, 0.15)',
                color: selectedApp === 'aisa' ? '#ffffff' : '#c084fc',
                borderRadius: '8px',
                padding: '3px 9px',
                fontSize: '11px',
                fontWeight: '700'
              }}>
                {selectedApp === 'aisa' ? '✓ Filtered' : 'Filter AISA ➔'}
              </span>
            </div>

            <div style={{ marginTop: '14px', marginBottom: '8px' }}>
              <div style={{ fontSize: '34px', fontWeight: '900', color: '#c084fc', letterSpacing: '-0.02em', lineHeight: '1' }}>
                {isLoaded ? aisaToday : '...'}
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginLeft: '8px' }}>Downloads Today</span>
              </div>
            </div>

            {/* Platform Sub-breakdown for AISA */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.15)' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>🤖 Android Today</span>
                <strong style={{ fontSize: '15px', color: '#c084fc' }}>{isLoaded ? aisaTodayAndroid : '...'}</strong>
              </div>
              <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>🍏 iOS Today</span>
                <strong style={{ fontSize: '15px', color: '#38bdf8' }}>{isLoaded ? aisaTodayIos : '...'}</strong>
              </div>
            </div>

            {/* Yesterday comparison & all time */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '11px', color: '#64748b' }}>
              <span>📅 Yesterday: <strong style={{ color: '#cbd5e1' }}>{isLoaded ? `${aisaYesterday} downloads` : '...'}</strong></span>
              <span>All-Time: <strong style={{ color: '#cbd5e1' }}>{formatNum(aisaStats.total_all_time || 313)}</strong></span>
            </div>
          </div>

          {/* CARD 3: COMBINED PORTFOLIO TODAY */}
          <div
            onClick={() => handleSelectApp('all')}
            style={{
              background: selectedApp === 'all' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              border: `1.5px solid ${selectedApp === 'all' ? '#3b82f6' : 'rgba(59, 130, 246, 0.25)'}`,
              borderRadius: '14px',
              padding: '18px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: selectedApp === 'all' ? '0 0 15px rgba(59, 130, 246, 0.2)' : 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>📥</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#f8fafc' }}>Total Ecosystem</h4>
                  <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>ALL APPLICATIONS</span>
                </div>
              </div>
              <span style={{
                background: selectedApp === 'all' ? '#3b82f6' : 'rgba(59, 130, 246, 0.15)',
                color: selectedApp === 'all' ? '#ffffff' : '#60a5fa',
                borderRadius: '8px',
                padding: '3px 9px',
                fontSize: '11px',
                fontWeight: '700'
              }}>
                {selectedApp === 'all' ? '✓ Active View' : 'View All ➔'}
              </span>
            </div>

            <div style={{ marginTop: '14px', marginBottom: '8px' }}>
              <div style={{ fontSize: '34px', fontWeight: '900', color: '#60a5fa', letterSpacing: '-0.02em', lineHeight: '1' }}>
                {isLoaded ? totalToday : '...'}
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginLeft: '8px' }}>Combined Today</span>
              </div>
            </div>

            {/* Platform Sub-breakdown for Combined */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>🤖 Combined Android</span>
                <strong style={{ fontSize: '15px', color: '#60a5fa' }}>{isLoaded ? totalTodayAndroid : '...'}</strong>
              </div>
              <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>🍏 Combined iOS</span>
                <strong style={{ fontSize: '15px', color: '#38bdf8' }}>{isLoaded ? totalTodayIos : '...'}</strong>
              </div>
            </div>

            {/* Yesterday comparison & all time */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '11px', color: '#64748b' }}>
              <span>📅 Yesterday Total: <strong style={{ color: '#cbd5e1' }}>{isLoaded ? `${totalYesterday} downloads` : '...'}</strong></span>
              <span>All-Time: <strong style={{ color: '#cbd5e1' }}>{formatNum(todayBreakdown?.total_all_time || 2099)}</strong></span>
            </div>
          </div>

        </div>
      </div>

      {/* Section Title for All-Time Store Downloads */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          📦 All-Time Store Downloads & Lifetime Reach
        </span>
      </div>

      {/* Cross-Platform Summary Overview Cards */}
      <div className="metrics-grid" style={{ marginBottom: '24px' }}>
        <div className="metric-card">
          <div className="metric-header">
            <span>Total Combined Store Downloads</span>
            <div className="metric-icon">📥</div>
          </div>
          <div className="metric-value">{formatNum(totalCombinedDownloads)}</div>
          <div className="metric-sub" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
            <span>🤖 Android: <strong>{formatNum(storeAndroidDownloads)}</strong> store downloads ({formatNum(liveAndroidPings)} live pings)</span>
            <span style={{ color: '#38bdf8' }}>🍏 iOS: <strong>{formatNum(storeIosDownloads)}</strong> store downloads ({formatNum(liveIosPings)} live pings)</span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '4px',
              paddingTop: '6px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '11px',
              color: '#94a3b8'
            }}>
              <span>* May include reinstalls</span>
              <span>Current Users: <strong style={{ color: '#10b981' }}>{formatNum(currentActiveUsers)}</strong></span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Android (Firebase & Play Store)</span>
            <div className="metric-icon">🤖</div>
          </div>
          <div className="metric-value">{formatNum(storeAndroidDownloads)}</div>
          <div className="metric-sub" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#94a3b8' }}>Live Firebase & Play Installs:</span>
              <strong style={{ color: '#34d399' }}>{formatNum(storeAndroidDownloads)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#94a3b8' }}>Live Devices Online:</span>
              <strong style={{ color: '#10b981' }}>
                ⚡ {combined?.realtime_active_devices !== undefined ? `${combined.realtime_active_devices} live` : (analytics?.source?.realtime_active_devices !== undefined ? `${analytics.source.realtime_active_devices} live` : '0 live')}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#94a3b8' }}>Active Users / Reach:</span>
              <strong style={{ color: '#10b981' }}>{formatNum(numActiveAndroid)}</strong>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '4px',
              paddingTop: '6px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '11px',
              color: '#94a3b8'
            }}>
              <span>* May include reinstalls</span>
              <span>Current Users: <strong style={{ color: '#10b981' }}>{formatNum(numActiveAndroid)}</strong></span>
            </div>
          </div>
        </div>

        <div className="metric-card" style={{ borderColor: 'rgba(56, 189, 248, 0.4)', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%)' }}>
          <div className="metric-header">
            <span>Apple App Store (App Store Connect)</span>
            <div className="metric-icon">🍏</div>
          </div>
          <div className="metric-value" style={{ color: '#38bdf8' }}>{formatNum(storeIosDownloads)}</div>
          <div className="metric-sub" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#94a3b8' }}>Store Downloads (90D):</span>
              <strong style={{ color: '#38bdf8' }}>{formatNum(storeIosDownloads)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#94a3b8' }}>Live First-Open Pings:</span>
              <strong style={{ color: '#34d399' }}>{formatNum(liveIosPings)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#94a3b8' }}>App Store Page Views:</span>
              <strong style={{ color: '#f8fafc' }}>{formatNum(combined.ios_page_views)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Telemetry Trend Graphs Section with Multi-platform curves */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 Unified Telemetry Trends
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>Android</span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>iOS</span>
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>📅 Multi-platform overlay</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
          {/* Card 1: User loss / Uninstalls */}
          <div className="metric-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>User Retention & Net Loss</span>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', marginTop: '4px' }}>
                  {combined.retention_rate != null ? `${combined.retention_rate}%` : (isLoaded ? '0.0%' : '...')} <span style={{ fontSize: '12px', fontWeight: '500', color: '#10b981' }}>Retained</span>
                </div>
                <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '2px', fontWeight: '600' }}>
                  {formatNum(combined.net_lost_devices ?? (isLoaded ? 0 : '...'))} Net Lost Devices • {combined.avg_daily_user_loss || 0}/day avg
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  {combined.net_lost_devices < (combined.total_uninstalls_raw || 0)
                    ? `Filtered repeat same-device uninstalls (${formatNum(combined.total_uninstalls_raw ?? combined.uninstall_events ?? 0)} raw events)`
                    : `Live recorded uninstall events (${formatNum(combined.total_uninstalls_raw ?? combined.uninstall_events ?? (isLoaded ? 0 : '...'))} events)`}
                </div>
              </div>
              <div className="metric-icon" style={{ fontSize: '18px' }}>📉</div>
            </div>
            <div style={{ height: '150px', marginTop: '12px' }}>
              <Line data={userLossChart.data} options={userLossChart.options} />
            </div>
          </div>

          {/* Card 2: Total installs */}
          <div className="metric-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>Total Cumulative Installs</span>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', marginTop: '4px' }}>
                  {formatNum(numTotal)}
                </div>
                <div style={{ fontSize: '12px', color: '#34d399', marginTop: '2px', fontWeight: '600' }}>
                  🤖 {formatNum(numAndroid)} Firebase & Play Store • 🍏 {formatNum(numIos)} App Store
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '11px',
                  color: '#94a3b8',
                  marginTop: '4px'
                }}>
                  <span>* May include reinstalls</span>
                  <span>•</span>
                  <span>Current Users: <strong style={{ color: '#10b981' }}>{formatNum(currentActiveUsers)}</strong></span>
                </div>
              </div>
              <div className="metric-icon" style={{ fontSize: '18px' }}>📥</div>
            </div>
            <div style={{ height: '150px', marginTop: '12px' }}>
              <Line data={totalInstallsChart.data} options={totalInstallsChart.options} />
            </div>
          </div>

          {/* Card 3: Active devices & Reach */}
          <div className="metric-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>Active Users & Devices</span>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', marginTop: '4px' }}>
                  {formatNum(numActiveAndroid)} <span style={{ fontSize: '12px', fontWeight: '500', color: '#94a3b8' }}>Android Active Users</span>
                </div>
                <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '2px', fontWeight: '600' }}>
                  📱 {formatNum(combined.active_device_installs_latest || 0)} active devices • {liveIosPings} 1st time iOS live pings
                </div>
              </div>
              <div className="metric-icon" style={{ fontSize: '18px' }}>📱</div>
            </div>
            <div style={{ height: '150px', marginTop: '12px' }}>
              <Line data={activeDevicesChart.data} options={activeDevicesChart.options} />
            </div>
          </div>
        </div>
      </div>

      {/* Platform Distribution Table */}
      <div className="card-section" style={{ marginTop: '24px' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div className="section-title">Platform Breakdown</div>
          <button
            onClick={() => setShowChurnColumn(!showChurnColumn)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              border: showChurnColumn ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: showChurnColumn ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              color: showChurnColumn ? '#34d399' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: showChurnColumn ? '#10b981' : '#64748b',
              boxShadow: showChurnColumn ? '0 0 6px #10b981' : 'none'
            }} />
            {showChurnColumn ? '✓ Hide Unregistered Users' : '👁️ Show Unregistered Users'}
          </button>
        </div>

        {loading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading download metrics...</div>
        ) : numTotal === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
            No download events recorded.
          </div>
        ) : (
          <TableScroller minWidth={700}>
            <table className="data-table">
            <thead>
              <tr>
                <th>Platform / OS</th>
                <th>Official Store & Firebase Downloads</th>
                <th>Live Device First-Open Pings</th>
                <th>Active Users (Latest)</th>
                {showChurnColumn && <th>Unregistered Users</th>}
                <th>Distribution Share</th>
              </tr>
            </thead>
            <tbody>
              {/* Android Row */}
              <tr>
                <td>
                  <span style={{ fontWeight: '700', color: '#f8fafc', textTransform: 'uppercase' }}>
                    🤖 Android (Firebase & Play Store)
                  </span>
                </td>
                <td style={{ fontWeight: '700', color: '#f8fafc' }}>{formatNum(numAndroid)}</td>
                <td style={{ color: '#34d399', fontWeight: '600' }}>{formatNum(liveAndroidPings)} pings</td>
                <td style={{ color: '#38bdf8', fontWeight: '600' }}>{formatNum(numActiveAndroid)}</td>
                {showChurnColumn && (
                  <td style={{ color: '#f87171' }}>
                    <strong>{formatNum(combined.net_lost_devices ?? (isLoaded ? 0 : '...'))}</strong> net lost
                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                      {formatNum(combined.daily_user_uninstalls ?? (isLoaded ? 0 : '...'))} raw events
                    </div>
                  </td>
                )}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '100px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                      <div style={{ width: `${numTotal > 0 ? Math.round((numAndroid / numTotal) * 100) : 100}%`, height: '100%', backgroundColor: '#10b981' }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#34d399' }}>
                      {numTotal > 0 ? Math.round((numAndroid / numTotal) * 100) : 100}%
                    </span>
                  </div>
                </td>
              </tr>

              {/* iOS Row */}
              <tr>
                <td>
                  <span style={{ fontWeight: '700', color: '#f8fafc', textTransform: 'uppercase' }}>
                    🍏 iOS (App Store Connect)
                  </span>
                </td>
                <td style={{ fontWeight: '700', color: '#38bdf8' }}>{formatNum(numIos)}</td>
                <td style={{ color: '#34d399', fontWeight: '600' }}>{formatNum(liveIosPings)} pings</td>
                <td style={{ color: '#38bdf8', fontWeight: '600' }}>{formatNum(liveIosPings)} (1st time)</td>
                {showChurnColumn && (
                  <td style={{ color: '#94a3b8' }}>{combined.ios_redownloads || 0} redownloads</td>
                )}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '100px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                      <div style={{ width: `${numTotal > 0 ? Math.round((numIos / numTotal) * 100) : 0}%`, height: '100%', backgroundColor: '#38bdf8' }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#38bdf8' }}>
                      {numTotal > 0 ? Math.round((numIos / numTotal) * 100) : 0}%
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          </TableScroller>
        )}
      </div>

      {/* GEOGRAPHIC DISTRIBUTION & TERRITORY TELEMETRY SECTION */}
      {(() => {
        const rawStates = geoData?.india_states || [];
        const rawCountries = geoData?.countries || [];
        const totalIndiaInstalls = geoData?.total_india || rawStates.reduce((acc, s) => acc + (s.installs || 0), 0);
        const totalGlobalInstalls = geoData?.total_installs || rawCountries.reduce((acc, c) => acc + (c.installs || 0), 0);
        const topState = rawStates.length > 0 ? rawStates[0] : { state: 'Madhya Pradesh', installs: 773, share: 13.9 };
        const topCountry = rawCountries.length > 0 ? rawCountries[0] : { country: 'India', installs: totalIndiaInstalls, share: 92.3 };
        const indiaPctOfGlobal = totalGlobalInstalls > 0 ? ((totalIndiaInstalls / totalGlobalInstalls) * 100).toFixed(1) : '92.3';
        const totalInternationalInstalls = Math.max(0, totalGlobalInstalls - totalIndiaInstalls);
        const internationalPct = totalGlobalInstalls > 0 ? ((totalInternationalInstalls / totalGlobalInstalls) * 100).toFixed(1) : '7.7';

        const filteredStates = rawStates.filter(s => {
          const q = geoSearchQuery.toLowerCase().trim();
          const matchesSearch = !q || s.state.toLowerCase().includes(q) || (s.zone || '').toLowerCase().includes(q);
          const matchesZone = geoZoneFilter === 'all' || (s.zone || '').toLowerCase() === geoZoneFilter.toLowerCase();
          return matchesSearch && matchesZone;
        });

        const filteredCountries = rawCountries.filter(c => {
          const q = geoSearchQuery.toLowerCase().trim();
          return !q || c.country.toLowerCase().includes(q) || (c.code || '').toLowerCase().includes(q);
        });

        const getZoneBadge = (zone) => {
          const styles = {
            Northern: { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
            Western: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
            Southern: { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' },
            Eastern: { bg: 'rgba(6, 182, 212, 0.15)', text: '#22d3ee', border: 'rgba(6, 182, 212, 0.3)' },
            Central: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
            'North-Eastern': { bg: 'rgba(244, 63, 94, 0.15)', text: '#fb7185', border: 'rgba(244, 63, 94, 0.3)' }
          }[zone] || { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)' };

          return (
            <span style={{
              background: styles.bg,
              color: styles.text,
              border: `1px solid ${styles.border}`,
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              {zone}
            </span>
          );
        };

        return (
          <div className="card-section" style={{ marginTop: '28px', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ minWidth: '280px', flex: '1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '22px' }}>🌍</span>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.01em' }}>
                    Geographic Distribution & Market Reach
                  </h3>
                  <span style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '12px',
                    padding: '2px 10px',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    Live GA4 & Firebase
                  </span>
                </div>
                <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                  Download telemetry broken down by Indian States & Territories and Global Countries for {selectedApp === 'all' ? 'All Applications' : selectedApp === 'ailegal' ? 'AI Legal' : 'AISA Assistant'}
                </p>
              </div>

              {/* View Switcher: India vs Global */}
              <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                <button
                  onClick={() => { setActiveGeoView('india'); setGeoSearchQuery(''); }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeGeoView === 'india' ? '#10b981' : 'transparent',
                    color: activeGeoView === 'india' ? '#0f172a' : '#94a3b8',
                    fontWeight: '700',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span style={{ fontSize: '14px' }}>🇮🇳</span> Indian States ({rawStates.length})
                </button>
                <button
                  onClick={() => { setActiveGeoView('countries'); setGeoSearchQuery(''); }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeGeoView === 'countries' ? '#38bdf8' : 'transparent',
                    color: activeGeoView === 'countries' ? '#0f172a' : '#94a3b8',
                    fontWeight: '700',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span style={{ fontSize: '14px' }}>🌐</span> Global Countries ({rawCountries.length})
                </button>
              </div>
            </div>

            {/* Quick Metrics KPI Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              {activeGeoView === 'countries' ? (
                <>
                  <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px' }}>🌐</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700' }}>
                        Total Global Downloads
                      </span>
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#38bdf8', marginTop: '6px' }}>
                      {formatNum(totalGlobalInstalls)}
                      <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', marginLeft: '6px' }}>
                        (100% all markets)
                      </span>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px' }}>🏆</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700' }}>
                        Top Market / Country
                      </span>
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#34d399', marginTop: '6px' }}>
                      {topCountry.country}
                      <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', marginLeft: '6px' }}>
                        ({formatNum(topCountry.installs)} installs • {topCountry.share}%)
                      </span>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px' }}>🌍</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700' }}>
                        International Territories
                      </span>
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#c084fc', marginTop: '6px' }}>
                      {rawCountries.length} Countries
                      <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', marginLeft: '6px' }}>
                        ({formatNum(totalInternationalInstalls)} intl • {internationalPct}%)
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px' }}>🇮🇳</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700' }}>
                        Total India Downloads
                      </span>
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#34d399', marginTop: '6px' }}>
                      {formatNum(totalIndiaInstalls)}
                      <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', marginLeft: '6px' }}>
                        ({indiaPctOfGlobal}% of global)
                      </span>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px' }}>🏆</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700' }}>
                        Top Performing State
                      </span>
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#38bdf8', marginTop: '6px' }}>
                      {topState.state}
                      <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', marginLeft: '6px' }}>
                        ({formatNum(topState.installs)} installs • {topState.share}%)
                      </span>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px' }}>🗺️</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700' }}>
                        National Reach
                      </span>
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#c084fc', marginTop: '6px' }}>
                      {rawStates.length} States & UTs
                      <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', marginLeft: '6px' }}>
                        Active Nationwide
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Filter and Search Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', minWidth: '260px', flex: '1', maxWidth: '380px' }}>
                <input
                  type="text"
                  placeholder={activeGeoView === 'india' ? '🔍 Search Indian state or zone...' : '🔍 Search country name...'}
                  value={geoSearchQuery}
                  onChange={(e) => setGeoSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    color: '#f8fafc',
                    fontSize: '12px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Zone Filter (India view only) */}
              {activeGeoView === 'india' && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Zone:</span>
                  {['all', 'Northern', 'Western', 'Southern', 'Eastern', 'Central', 'North-Eastern'].map(zone => (
                    <button
                      key={zone}
                      onClick={() => setGeoZoneFilter(zone)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: geoZoneFilter === zone ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: geoZoneFilter === zone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        color: geoZoneFilter === zone ? '#34d399' : '#94a3b8',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {zone === 'all' ? 'All Zones' : zone}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* INDIA STATES TABLE */}
            {activeGeoView === 'india' && (
              filteredStates.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                  No Indian states match "{geoSearchQuery}".
                </div>
              ) : (
                <TableScroller minWidth={720}>
                  <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>State / Union Territory</th>
                      <th>Zone</th>
                      <th>Total Downloads</th>
                      <th>🤖 Android</th>
                      <th>🍏 iOS</th>
                      <th style={{ minWidth: '180px' }}>National Share (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStates.map((item, idx) => (
                      <tr key={item.state}>
                        <td style={{ color: '#64748b', fontSize: '11px' }}>{idx + 1}</td>
                        <td>
                          <span style={{ fontWeight: '700', color: '#f8fafc' }}>
                            {item.state}
                          </span>
                        </td>
                        <td>{getZoneBadge(item.zone)}</td>
                        <td style={{ fontWeight: '800', color: '#f8fafc' }}>
                          {formatNum(item.installs)}
                        </td>
                        <td style={{ color: '#34d399', fontWeight: '600' }}>
                          {formatNum(item.android || 0)}
                        </td>
                        <td style={{ color: '#38bdf8', fontWeight: '600' }}>
                          {formatNum(item.ios || 0)}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                              <div style={{
                                width: `${Math.min(100, item.share || 0)}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                              }} />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#34d399', minWidth: '45px', textAlign: 'right' }}>
                              {item.share}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </TableScroller>
              )
            )}

            {/* GLOBAL COUNTRIES TABLE */}
            {activeGeoView === 'countries' && (
              filteredCountries.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                  No countries match "{geoSearchQuery}".
                </div>
              ) : (
                <TableScroller minWidth={720}>
                  <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Country</th>
                      <th>Total Downloads</th>
                      <th>🤖 Android</th>
                      <th>🍏 iOS</th>
                      <th style={{ minWidth: '180px' }}>Global Share (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCountries.map((item, idx) => (
                      <tr key={item.country}>
                        <td style={{ color: '#64748b', fontSize: '11px' }}>{idx + 1}</td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: '700', color: '#f8fafc' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: '28px',
                              height: '20px',
                              padding: '0 5px',
                              borderRadius: '4px',
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              fontSize: '11px',
                              fontWeight: '800',
                              letterSpacing: '0.05em',
                              color: '#94a3b8',
                              lineHeight: '1'
                            }}>
                              {item.flag || '🌐'}
                            </span>
                            <span>{item.country}</span>
                          </span>
                        </td>
                        <td style={{ fontWeight: '800', color: '#f8fafc' }}>
                          {formatNum(item.installs)}
                        </td>
                        <td style={{ color: '#34d399', fontWeight: '600' }}>
                          {formatNum(item.android || 0)}
                        </td>
                        <td style={{ color: '#38bdf8', fontWeight: '600' }}>
                          {formatNum(item.ios || 0)}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                              <div style={{
                                width: `${Math.min(100, item.share || 0)}%`,
                                height: '100%',
                                background: item.country === 'India'
                                  ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                                  : 'linear-gradient(90deg, #38bdf8 0%, #60a5fa 100%)'
                              }} />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: item.country === 'India' ? '#34d399' : '#38bdf8', minWidth: '45px', textAlign: 'right' }}>
                              {item.share}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </TableScroller>
              )
            )}
          </div>
        );
      })()}
      </div>
    </div>
  );
};
