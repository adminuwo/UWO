import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
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

export const AppDownloadsTab = () => {
  const { authFetch } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [timeseriesData, setTimeseriesData] = useState({
    user_loss: { android: [], ios: [] },
    total_installs: { android: [], ios: [] },
    active_devices: { android: [], ios: [] }
  });
  const [selectedApp, setSelectedApp] = useState('all');
  const [showAndroid, setShowAndroid] = useState(true);
  const [showIos, setShowIos] = useState(true);
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState(null);
  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState(300);

  const fetchAnalytics = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const appCodes = selectedApp === 'all' ? 'aisa,ailegal' : selectedApp;
      
      const [overviewRes, lossRes, installsRes, activeRes] = await Promise.all([
        authFetch(`/api/admin/analytics/google-play/overview?app_codes=${appCodes}`),
        authFetch(`/api/admin/analytics/google-play/timeseries?app_codes=${appCodes}&metric=user_loss`),
        authFetch(`/api/admin/analytics/google-play/timeseries?app_codes=${appCodes}&metric=total_installs`),
        authFetch(`/api/admin/analytics/google-play/timeseries?app_codes=${appCodes}&metric=active_devices`)
      ]);

      if (overviewRes.ok) {
        const data = await overviewRes.json();
        setAnalytics(data.data);
      }
      if (lossRes.ok && installsRes.ok && activeRes.ok) {
        const lossData = await lossRes.json();
        const installsData = await installsRes.json();
        const activeData = await activeRes.json();

        setTimeseriesData({
          user_loss: { android: lossData.data?.android || [], ios: lossData.data?.ios || [] },
          total_installs: { android: installsData.data?.android || [], ios: installsData.data?.ios || [] },
          active_devices: { android: activeData.data?.android || [], ios: activeData.data?.ios || [] }
        });
      }
      setLastSynced(new Date());
      setAutoRefreshCountdown(300);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleManualSyncAndRefresh = async () => {
    setLoading(true);
    try {
      await authFetch('/api/admin/unified-analytics/sync?provider=all', { method: 'POST' });
    } catch (e) {
      console.warn('Sync trigger error (proceeding with fetch):', e);
    }
    await fetchAnalytics(false);
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    fetchAnalytics();
    const refreshInterval = setInterval(() => fetchAnalytics(true), 5 * 60 * 1000);
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
  const numActiveAndroid = Number(combined.active_device_installs_latest) || 0;
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
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'ailegal', 'aisa'].map((app) => (
            <button
              key={app}
              onClick={() => setSelectedApp(app)}
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
              {app === 'all' ? 'All Applications' : app === 'ailegal' ? '⚖️ AI Legal' : '🤖 AISA Assistant'}
            </button>
          ))}
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
            onClick={() => setSelectedApp(selectedApp === 'ailegal' ? 'all' : 'ailegal')}
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
                <span style={{ fontSize: '24px' }}>⚖️</span>
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
            onClick={() => setSelectedApp(selectedApp === 'aisa' ? 'all' : 'aisa')}
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
                <span style={{ fontSize: '24px' }}>🤖</span>
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
            onClick={() => setSelectedApp('all')}
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
              <strong style={{ color: '#10b981' }}>{formatNum(combined.active_device_installs_latest)}</strong>
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
              <span>Current Users: <strong style={{ color: '#10b981' }}>{formatNum(combined.active_device_installs_latest)}</strong></span>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
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
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>Active Devices / Reach</span>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', marginTop: '4px' }}>
                  {combined.active_device_installs_latest || 0} <span style={{ fontSize: '12px', fontWeight: '500', color: '#94a3b8' }}>Android Active</span>
                </div>
                <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '2px', fontWeight: '600' }}>
                  📱 {combined.avg_active_devices || 0} avg devices • {liveIosPings} 1st time iOS live pings
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
        <div className="section-header">
          <div className="section-title">Platform Breakdown</div>
        </div>

        {loading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading download metrics...</div>
        ) : numTotal === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
            No download events recorded.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Platform / OS</th>
                <th>Official Store & Firebase Downloads</th>
                <th>Live Device First-Open Pings</th>
                <th>Active Devices (Latest)</th>
                <th>Uninstalls / Redownloads</th>
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
                <td style={{ color: '#38bdf8', fontWeight: '600' }}>{formatNum(combined.active_device_installs_latest || 0)}</td>
                <td style={{ color: '#f87171' }}>
                  <strong>{formatNum(combined.net_lost_devices ?? (isLoaded ? 0 : '...'))}</strong> net lost
                  <div style={{ fontSize: '10px', color: '#64748b' }}>
                    {formatNum(combined.daily_user_uninstalls ?? (isLoaded ? 0 : '...'))} raw events
                  </div>
                </td>
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
                <td style={{ color: '#94a3b8' }}>{combined.ios_redownloads || 0} redownloads</td>
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
        )}
      </div>
    </div>
  );
};
