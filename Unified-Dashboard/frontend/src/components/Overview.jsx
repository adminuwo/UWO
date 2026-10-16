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

export const Overview = () => {
  const { authFetch } = useAuth();
  const [stats, setStats] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [playAnalytics, setPlayAnalytics] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [trendPeriod, setTrendPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // 1. Fetch main stats immediately so dashboard renders in milliseconds
      authFetch('/api/admin/stats')
        .then(async (res) => {
          if (res.ok) setStats(await res.json());
        })
        .catch((err) => console.warn('[Overview] Stats error:', err))
        .finally(() => setLoading(false));

      // 2. Fetch AI telemetry concurrently
      authFetch('/api/telemetry/overview')
        .then(async (res) => {
          if (res.ok) setTelemetry(await res.json());
        })
        .catch((err) => console.warn('[Overview] Telemetry error:', err));

      // 3. Fetch Google Play & App Store analytics concurrently
      authFetch('/api/admin/analytics/google-play/overview?app_codes=aisa,ailegal')
        .then(async (res) => {
          if (res.ok) {
            const pData = await res.json();
            setPlayAnalytics(pData.data);
          }
        })
        .catch((err) => console.warn('[Overview] Store analytics error:', err));
    } catch (err) {
      console.error('Failed to fetch overview data:', err);
      setLoading(false);
    }
  };

  const fetchRevenueTrend = async (period = '30d') => {
    try {
      const res = await authFetch(`/api/admin/revenue/trend?period=${period}`);
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.data)) {
          setRevenueTrend(json.data);
        }
      }
    } catch (e) {
      console.warn('[Overview] Revenue trend error:', e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchRevenueTrend(trendPeriod);
  }, [trendPeriod]);

  const chartLabels = revenueTrend.length > 0
    ? revenueTrend.map((p) => p.label || (p.date ? p.date.slice(5) : ''))
    : ['Today'];

  const chartPoints = revenueTrend.length > 0
    ? revenueTrend.map((p) => p.gross || p.net || 0)
    : [stats?.total_revenue || 0];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Gross Revenue (₹)',
        data: chartPoints,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#8b5cf6',
        pointRadius: revenueTrend.length > 30 ? 1 : 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8' } },
      tooltip: {
        callbacks: {
          label: (context) => ` Revenue: ₹${Number(context.raw || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
        }
      }
    },
    scales: {
      x: { ticks: { color: '#64748b', maxTicksLimit: 12 }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: {
        ticks: {
          color: '#64748b',
          callback: (val) => `₹${Number(val).toLocaleString('en-IN')}`
        },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
    },
  };

  if (loading && !stats) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading platform analytics...</div>;
  }

  const appTenants = [
    { code: 'ailegal', name: 'AI Legal', icon: '/images/ailegallogo.png', isImage: true },
    { code: 'aisa', name: 'AISA Assistant', icon: '/images/aisa-logo.png', isImage: true },
    { code: 'aiads', name: 'AI Ads Generator', icon: '/images/aiads-logo.png', isImage: true },
    { code: 'uwoconnect', name: 'UWO Connect', icon: '/images/uwoconnectlogo.png', isImage: true },
    { code: 'efvframework', name: 'EFV Framework', icon: '/images/efv-logo.png', isImage: true },
    { code: 'aimall', name: 'AI Mall', icon: '/images/aimall-logo.webp', isImage: true },
    { code: 'aieducation', name: 'AI Education', icon: '/images/ai-education-logo.png', isImage: true },
  ];

  return (
    <div>
      {/* Connected Applications Tenant Bar */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '10px' }}>
          Connected Application Tenants
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {appTenants.map((app) => (
            <div
              key={app.code}
              style={{
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {app.isImage ? (
                  <img src={app.icon} alt={app.name} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '18px' }}>{app.icon}</span>
                )}
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>{app.name}</span>
              </div>
              <span style={{ fontSize: '10px', fontWeight: '800', color: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.15)', padding: '2px 8px', borderRadius: '10px' }}>
                ACTIVE
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span>Total Identities</span>
            <div className="metric-icon">👥</div>
          </div>
          <div className="metric-value">{stats?.total_users || 0}</div>
          <div className="metric-sub">{stats?.verified_users || 0} verified users</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Total Revenue</span>
            <div className="metric-icon">💳</div>
          </div>
          <div className="metric-value">
            ₹{(stats?.total_revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">{stats?.active_subscriptions || 0} active subscriptions</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Google Play Installs</span>
            <div className="metric-icon">🤖</div>
          </div>
          <div className="metric-value">
            {((playAnalytics?.combined?.total_user_installs_latest > 0
              ? playAnalytics?.combined?.total_user_installs_latest
              : playAnalytics?.combined?.daily_device_installs) || telemetry?.total_downloads || 0).toLocaleString()}
          </div>
          <div className="metric-sub">Android Devices (Google Play)</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>App Store Downloads</span>
            <div className="metric-icon">🍏</div>
          </div>
          <div className="metric-value">{playAnalytics?.combined?.ios_total_downloads || 0}</div>
          <div className="metric-sub">iOS Devices (App Store Connect)</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>AI Tokens Consumed</span>
            <div className="metric-icon">🧠</div>
          </div>
          <div className="metric-value">{(telemetry?.total_tokens || 0).toLocaleString()}</div>
          <div className="metric-sub">{telemetry?.total_chat_sessions || 0} prompt sessions</div>
        </div>
      </div>

      <div className="card-section">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div className="section-title">Revenue & Subscription Activity</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Real-time daily transaction volume & billing across all connected platforms
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: '90d', label: '90D' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setTrendPeriod(p.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  border: trendPeriod === p.id ? '1px solid #6366f1' : '1px solid #334155',
                  background: trendPeriod === p.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  color: trendPeriod === p.id ? '#a5b4fc' : '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ height: '280px', marginTop: '12px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

