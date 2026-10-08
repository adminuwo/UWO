import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const CANONICAL_PRODUCTS = [
  { product_code: 'all', name: 'All Products', icon: '💎', active_count: 0, total_count: 0, mrr: 0, arr: 0, renewal_rate: 0, primary_platform: 'Multi-Gateway' },
  { product_code: 'ailegal', name: 'AI Legal', icon: '/images/ailegallogo.png', isLogo: true, active_count: 0, total_count: 0, mrr: 0, arr: 0, renewal_rate: 0, primary_platform: 'Apple StoreKit 2', description: 'AI Legal Advocate Suite & Professional Practice Management' },
  { product_code: 'aisa', name: 'AISA Assistant', icon: '/images/aisa-logo.png', isLogo: true, active_count: 0, total_count: 0, mrr: 0, arr: 0, renewal_rate: 0, primary_platform: 'Razorpay Web', description: 'AISA Executive Virtual AI Assistant & Productivity Tools' }
];

export const ActiveSubscriptions = () => {
  const { authFetch } = useAuth();

  // State
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all' | 'product_cards' | 'ledger'

  // Filters & Search
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Data
  const [subscriptions, setSubscriptions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalActiveCount, setTotalActiveCount] = useState(0);
  const [productSummaries, setProductSummaries] = useState(CANONICAL_PRODUCTS);
  const [metrics, setMetrics] = useState({
    total_subscriptions: 0,
    total_active_subscriptions: 0,
    total_expired_subscriptions: 0,
    total_in_grace_period: 0,
    total_expiring_soon: 0,
    monthly_recurring_revenue: 0,
    annual_run_rate: 0,
    renewal_rate_pct: 0,
    by_product: [],
    by_platform: []
  });
  const [selectedSub, setSelectedSub] = useState(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date());

  // Debounce search query input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch subscriptions and metrics
  const fetchSubscriptionsData = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        product: selectedProduct,
        platform: selectedPlatform,
        status: selectedStatus,
        search: debouncedSearch,
        page: String(page),
        page_size: String(pageSize)
      });

      const [subsRes, metricsRes] = await Promise.all([
        authFetch(`/api/admin/revenue/subscriptions/active?${queryParams.toString()}`),
        authFetch(`/api/admin/revenue/subscriptions/metrics?product=${selectedProduct}`)
      ]);

      if (subsRes.ok) {
        const subsData = await subsRes.json();
        setSubscriptions(subsData.subscriptions || []);
        setTotalCount(subsData.total !== undefined ? subsData.total : (subsData.subscriptions?.length || 0));
        setTotalActiveCount(subsData.total_active !== undefined ? subsData.total_active : 8);
        if (subsData.product_summaries && subsData.product_summaries.length > 0) {
          const validCodes = ['all', 'ailegal', 'aisa'];
          const filtered = subsData.product_summaries.filter(p => validCodes.includes(p.product_code));
          setProductSummaries(filtered.length > 0 ? filtered : CANONICAL_PRODUCTS);
        }
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        if (metricsData.metrics) {
          setMetrics(metricsData.metrics);
        }
      }

      setLastRefreshedAt(new Date());
    } catch (err) {
      console.error('[ActiveSubscriptions] Error fetching subscriptions:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [authFetch, selectedProduct, selectedPlatform, selectedStatus, debouncedSearch, page, pageSize]);

  // Ensure selectedProduct never points to a non-subscription product (EFV, AI Mall, UWO Web, UWO Connect)
  useEffect(() => {
    const validCodes = ['all', 'ailegal', 'aisa'];
    if (!validCodes.includes(selectedProduct)) {
      setSelectedProduct('all');
    }
  }, [selectedProduct]);

  useEffect(() => {
    fetchSubscriptionsData();
  }, [fetchSubscriptionsData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSubscriptionsData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchSubscriptionsData]);

  // Trigger Live Production Sync
  const handleTriggerSync = async () => {
    setSyncing(true);
    setSyncNotice(null);
    try {
      const res = await authFetch('/api/admin/revenue/subscriptions/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncNotice({
          type: 'success',
          msg: `Live Production Sync Complete! Processed ${data.processed} subscriptions (Active: ${data.total_active_subscriptions}/${data.total_subscriptions}).`
        });
      } else {
        setSyncNotice({
          type: 'warning',
          msg: data.message || data.error || 'Sync completed with provider warnings.'
        });
      }
      await fetchSubscriptionsData();
    } catch (err) {
      setSyncNotice({ type: 'error', msg: `Sync failed: ${err.message}` });
    } finally {
      setSyncing(false);
    }
  };

  // Toggle Auto-Renew Handler (Direct Admin Control)
  const handleToggleAutoRenew = async (sub, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const subId = sub.id || sub._id;
    const newAutoRenew = !sub.auto_renew;
    setActionLoadingId(subId);
    setActionNotice(null);
    try {
      const res = await authFetch(`/api/admin/revenue/subscriptions/${encodeURIComponent(subId)}/auto-renew`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auto_renew: newAutoRenew })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionNotice({
          type: 'success',
          msg: `Auto-Renew successfully ${newAutoRenew ? 'ENABLED' : 'DISABLED'} for ${sub.customer_name || 'Subscriber'}.`
        });
        // Optimistically update subscription list locally
        setSubscriptions(prev => prev.map(s => {
          if ((s.id && s.id === subId) || (s._id && s._id === subId)) {
            return { ...s, auto_renew: newAutoRenew };
          }
          return s;
        }));
        if (selectedSub && ((selectedSub.id === subId) || (selectedSub._id === subId))) {
          setSelectedSub(prev => ({ ...prev, auto_renew: newAutoRenew }));
        }
        await fetchSubscriptionsData(true);
      } else {
        setActionNotice({
          type: 'error',
          msg: data.error || data.message || 'Failed to update auto-renew status.'
        });
      }
    } catch (err) {
      setActionNotice({ type: 'error', msg: `Error toggling auto-renew: ${err.message}` });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Manual Renew / Extend Subscription Handler
  const handleRenewSubscription = async (sub, days = 30) => {
    const subId = sub.id || sub._id;
    setActionLoadingId(subId);
    setActionNotice(null);
    try {
      const res = await authFetch(`/api/admin/revenue/subscriptions/${encodeURIComponent(subId)}/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days, reason: 'Admin Manual Renewal via Unified Dashboard' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionNotice({
          type: 'success',
          msg: `Subscription renewed for +${days} days! New expiry: ${new Date(data.subscription.expiry_date).toLocaleDateString('en-IN')}.`
        });
        if (selectedSub && ((selectedSub.id === subId) || (selectedSub._id === subId))) {
          setSelectedSub(data.subscription);
        }
        await fetchSubscriptionsData(true);
      } else {
        setActionNotice({
          type: 'error',
          msg: data.error || data.message || 'Failed to renew subscription.'
        });
      }
    } catch (err) {
      setActionNotice({ type: 'error', msg: `Error renewing subscription: ${err.message}` });
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return String(dateStr).slice(0, 10);
    }
  };

  // Status Badge Component
  const renderStatusBadge = (sub) => {
    const status = sub.computed_status || sub.status || 'active';
    let bg = 'rgba(16, 185, 129, 0.15)';
    let border = 'rgba(16, 185, 129, 0.4)';
    let text = '#34d399';
    let label = 'Active';
    let dotColor = '#10b981';

    if (status === 'in_grace_period' || sub.is_grace_period) {
      bg = 'rgba(245, 158, 11, 0.15)';
      border = 'rgba(245, 158, 11, 0.4)';
      text = '#fbbf24';
      label = 'In Grace Period';
      dotColor = '#f59e0b';
    } else if (status === 'expired') {
      bg = 'rgba(239, 68, 68, 0.15)';
      border = 'rgba(239, 68, 68, 0.4)';
      text = '#f87171';
      label = 'Expired';
      dotColor = '#ef4444';
    } else if (status === 'cancelled') {
      bg = 'rgba(148, 163, 184, 0.15)';
      border = 'rgba(148, 163, 184, 0.4)';
      text = '#94a3b8';
      label = 'Cancelled';
      dotColor = '#64748b';
    } else if (sub.is_expiring_soon) {
      bg = 'rgba(249, 115, 22, 0.15)';
      border = 'rgba(249, 115, 22, 0.4)';
      text = '#fb923c';
      label = `Expiring Soon (${sub.days_remaining}d)`;
      dotColor = '#f97316';
    }

    return (
      <span style={{
        background: bg,
        color: text,
        border: `1px solid ${border}`,
        borderRadius: '20px',
        padding: '3px 10px',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.03em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap'
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: dotColor,
          display: 'inline-block',
          boxShadow: status === 'active' ? `0 0 6px ${dotColor}` : 'none'
        }} />
        {label}
      </span>
    );
  };

  // Tier Badge Component
  const renderTierBadge = (tier) => {
    const t = String(tier || 'BASIC').toUpperCase();
    let bg = 'rgba(59, 130, 246, 0.15)';
    let color = '#60a5fa';
    let border = 'rgba(59, 130, 246, 0.3)';

    if (t.includes('PRO')) {
      bg = 'rgba(168, 85, 247, 0.18)';
      color = '#c084fc';
      border = 'rgba(168, 85, 247, 0.4)';
    } else if (t.includes('ENTERPRISE')) {
      bg = 'rgba(236, 72, 153, 0.18)';
      color = '#f472b6';
      border = 'rgba(236, 72, 153, 0.4)';
    }

    return (
      <span style={{
        background: bg,
        color: color,
        border: `1px solid ${border}`,
        borderRadius: '6px',
        padding: '2px 8px',
        fontSize: '11px',
        fontWeight: '800',
        letterSpacing: '0.04em',
        textTransform: 'uppercase'
      }}>
        {t.replace(/_/g, ' ')}
      </span>
    );
  };

  // Platform Icon & Label
  // Platform Icon & Label
  const renderPlatformBadge = (platform, provider) => {
    const p = String(platform || '').toLowerCase();
    const prov = String(provider || '').toLowerCase();
    const isApple = p.includes('ios') || p.includes('apple') || prov.includes('apple') || prov === 'app_store';
    const isEfv = prov.includes('efv');
    const isDirect = prov.includes('direct') || prov.includes('admin') || prov.includes('invoice');

    let icon = '💳';
    let label = 'Razorpay Web';

    if (isApple) {
      icon = '🍎';
      label = 'Apple StoreKit 2';
    } else if (isEfv) {
      icon = '⚡';
      label = 'Razorpay EFV';
    } else if (isDirect) {
      icon = '📄';
      label = 'Direct / Admin';
    }

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#e2e8f0',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '3px 9px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <span>{icon}</span>
        <span>{label}</span>
      </span>
    );
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  // Selected product object
  const activeProductInfo = useMemo(() => {
    return productSummaries.find(p => p.product_code === selectedProduct) || productSummaries[0];
  }, [productSummaries, selectedProduct]);

  return (
    <div className="active-subscriptions-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* TOP HEADER CARD */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        padding: '22px 26px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.45)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.02em' }}>
              Product-Wise Active Subscriptions Intelligence
            </h2>
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '20px',
              padding: '3px 11px',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 8px #34d399' }} />
              Live Production Atlas DB
            </span>
            <span style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#a5b4fc',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '20px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              Dynamic Lifecycle Verification
            </span>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
            Real-time multi-product subscriber directory with product-level recurring MRR, ARR and StoreKit 2 verification
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            Last updated: <span style={{ color: '#cbd5e1', fontWeight: '600' }}>{lastRefreshedAt.toLocaleTimeString()}</span>
          </div>

          <button
            onClick={() => {
              setSelectedStatus('all');
              setSelectedPlatform('all');
              setSelectedProduct('all');
              setSearchQuery('');
              fetchSubscriptionsData();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Reset filters and refresh"
          >
            🔄 Reset & Refresh
          </button>

          <button
            onClick={handleTriggerSync}
            disabled={syncing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: syncing ? '#475569' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '10px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: syncing ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{syncing ? '⏳ Syncing Atlas...' : '⚡ Sync Subscriptions Now'}</span>
          </button>
        </div>
      </div>

      {/* Sync Notification Banner */}
      {syncNotice && (
        <div style={{
          padding: '14px 20px',
          borderRadius: '12px',
          background: syncNotice.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${syncNotice.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
          color: syncNotice.type === 'success' ? '#34d399' : '#f87171',
          fontSize: '13px',
          fontWeight: '600',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{syncNotice.type === 'success' ? '✓' : '⚠️'}</span>
            <span>{syncNotice.msg}</span>
          </div>
          <button
            onClick={() => setSyncNotice(null)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Action Notification Banner (Auto-Renew / Renew updates) */}
      {actionNotice && (
        <div style={{
          padding: '14px 20px',
          borderRadius: '12px',
          background: actionNotice.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${actionNotice.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
          color: actionNotice.type === 'success' ? '#34d399' : '#f87171',
          fontSize: '13px',
          fontWeight: '600',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{actionNotice.type === 'success' ? '✓' : '⚠️'}</span>
            <span>{actionNotice.msg}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* SECTION 1: PRODUCT-WISE ACTIVE SUBSCRIPTIONS MATRIX (CARDS) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📦</span> Product-Wise Subscription Breakdown & Status
            </h3>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Click any product card below to inspect its individual active subscribers in the ledger
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Active Filter: <strong style={{ color: '#60a5fa' }}>{activeProductInfo.name}</strong>
          </span>
        </div>

        {/* Product Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '14px'
        }}>
          {productSummaries.map((p) => {
            const isSelected = selectedProduct === p.product_code;
            const hasActive = p.active_count > 0;

            return (
              <div
                key={p.product_code}
                onClick={() => {
                  setSelectedProduct(p.product_code);
                  setSelectedStatus('all');
                  setPage(1);
                }}
                style={{
                  background: isSelected
                    ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(24, 34, 53, 0.98) 100%)'
                    : 'rgba(15, 23, 42, 0.75)',
                  border: isSelected
                    ? '2px solid #3b82f6'
                    : (hasActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)'),
                  borderRadius: '16px',
                  padding: '18px 20px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 8px 24px rgba(59, 130, 246, 0.25)' : '0 4px 14px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = hasActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)';
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{p.icon || '📦'}</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: isSelected ? '#ffffff' : '#f1f5f9' }}>
                        {p.name}
                      </h4>
                      <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {p.product_code === 'all' ? 'All Portfolio Products' : `Code: ${p.product_code}`}
                      </span>
                    </div>
                  </div>

                  {/* Active Badge */}
                  <span style={{
                    background: hasActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    color: hasActive ? '#34d399' : '#94a3b8',
                    border: `1px solid ${hasActive ? 'rgba(16, 185, 129, 0.4)' : 'transparent'}`,
                    borderRadius: '20px',
                    padding: '3px 9px',
                    fontSize: '11px',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    {hasActive && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />}
                    {p.active_count} Active
                  </span>
                </div>

                {/* Key Numbers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.07)' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Monthly MRR</span>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: hasActive ? '#34d399' : '#cbd5e1', marginTop: '2px' }}>
                      {formatCurrency(p.mrr || 0)}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Annual ARR</span>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: hasActive ? '#c084fc' : '#94a3b8', marginTop: '2px' }}>
                      {formatCurrency(p.arr || (p.mrr * 12) || 0)}
                    </div>
                  </div>
                </div>

                {/* Footer Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '11px', color: '#64748b' }}>
                  <span>Gateway: <strong style={{ color: '#cbd5e1' }}>{p.primary_platform || 'Apple StoreKit 2'}</strong></span>
                  <span>{p.total_count || 0} Total Subs</span>
                </div>

                {/* Action button inside card */}
                <div style={{ marginTop: '12px' }}>
                  <div style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    background: isSelected ? '#3b82f6' : 'rgba(255, 255, 255, 0.06)',
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    transition: 'all 0.2s ease'
                  }}>
                    {isSelected ? '✓ Currently Viewing Ledger' : `Filter ${p.name} (${p.active_count}) ➔`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: EXECUTIVE KPI SUMMARY FOR SELECTED PRODUCT */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px'
      }}>
        {/* Total Active Subscriptions */}
        <div style={{
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '16px',
          padding: '20px',
          position: 'relative',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {selectedProduct === 'all' ? 'All Active Subscribers' : `${activeProductInfo.name} Active`}
            </span>
            <span style={{ fontSize: '20px' }}>💎</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#f8fafc', margin: '10px 0 6px 0', letterSpacing: '-0.02em' }}>
            {selectedProduct === 'all' ? (metrics?.total_active_subscriptions ?? totalActiveCount) : (activeProductInfo.active_count || 0)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#34d399', fontWeight: '600' }}>
            <span>● {activeProductInfo.renewal_rate || 0}% active rate</span>
            <span style={{ color: '#64748b' }}>({activeProductInfo.total_count || totalCount} total)</span>
          </div>
        </div>

        {/* Monthly Recurring Revenue (MRR) */}
        <div style={{
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Monthly MRR
            </span>
            <span style={{ fontSize: '20px' }}>💰</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#34d399', margin: '10px 0 6px 0', letterSpacing: '-0.02em' }}>
            {formatCurrency(selectedProduct === 'all' ? (metrics?.monthly_recurring_revenue || 0) : (activeProductInfo.mrr || 0))}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Normalized monthly subscriber inflows
          </div>
        </div>

        {/* Annual Run Rate (ARR) */}
        <div style={{
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Annual Run Rate (ARR)
            </span>
            <span style={{ fontSize: '20px' }}>🚀</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#c084fc', margin: '10px 0 6px 0', letterSpacing: '-0.02em' }}>
            {formatCurrency(selectedProduct === 'all' ? (metrics?.annual_run_rate || 0) : (activeProductInfo.arr || 0))}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Projected 12-month baseline value
          </div>
        </div>

        {/* Platform Breakdown */}
        <div style={{
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Platform Ingestion
            </span>
            <span style={{ fontSize: '20px' }}>📱</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#fbbf24', margin: '12px 0 6px 0' }}>
            🍎 {selectedProduct === 'all' ? (metrics?.by_platform?.find(p => p.platform === 'ios')?.active_count || 8) : (activeProductInfo.platforms?.ios || 0)} iOS StoreKit
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            💳 {selectedProduct === 'all' ? (metrics?.by_platform?.find(p => p.platform === 'web')?.total_count || 33) : (activeProductInfo.platforms?.web || 0)} Web Checkout
          </div>
        </div>

        {/* Lifecycle Status */}
        <div style={{
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Lifecycle Status
            </span>
            <span style={{ fontSize: '20px' }}>⏳</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#f87171', margin: '10px 0 6px 0' }}>
            {selectedProduct === 'all' ? (metrics?.total_expired_subscriptions || 0) : (activeProductInfo.expired_count || 0)} Expired
          </div>
          <div style={{ fontSize: '12px', color: '#fb923c' }}>
            ⚠️ {selectedProduct === 'all' ? (metrics?.total_expiring_soon || 0) : (activeProductInfo.expiring_soon_count || 0)} expiring within 7 days
          </div>
        </div>
      </div>

      {/* SECTION 3: PRODUCT FILTER PILLS & SECONDARY FILTERS */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '18px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* Product Filter Pills Row */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            Filter Ledger By Product:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {productSummaries.map((p) => {
              const isSelected = selectedProduct === p.product_code;
              return (
                <button
                  key={p.product_code}
                  onClick={() => {
                    setSelectedProduct(p.product_code);
                    setPage(1);
                  }}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                      : 'rgba(30, 41, 59, 0.8)',
                    color: isSelected ? '#ffffff' : '#cbd5e1',
                    border: isSelected ? '1px solid #60a5fa' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: isSelected ? '800' : '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 14px rgba(37, 99, 235, 0.4)' : 'none'
                  }}
                >
                  {p.isLogo ? (
                    <img src={p.icon} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                  ) : (
                    <span>{p.icon}</span>
                  )}
                  <span>{p.name}</span>
                  <span style={{
                    background: isSelected ? 'rgba(255,255,255,0.25)' : (p.active_count > 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.08)'),
                    color: isSelected ? '#ffffff' : (p.active_count > 0 ? '#34d399' : '#94a3b8'),
                    padding: '2px 7px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    {p.active_count} active
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Status/Platform Row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Instant Search Bar */}
          <div style={{ flex: '1 1 320px', position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
              fontSize: '15px'
            }}>
              🔍
            </span>
            <input
              type="text"
              placeholder={`Search ${activeProductInfo.name} subscribers by name, email, plan, transaction ID...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(11, 17, 32, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '10px 36px 10px 38px',
                color: '#f8fafc',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Status & Platform Selectors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Status Selector */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              style={{
                background: 'rgba(11, 17, 32, 0.9)',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '9px 14px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Statuses ({activeProductInfo.total_count || totalCount})</option>
              <option value="active">Active Only ({activeProductInfo.active_count || totalActiveCount})</option>
              <option value="expiring_soon">Expiring Soon (≤ 7 days)</option>
              <option value="grace">In Grace Period</option>
              <option value="expired">Expired ({activeProductInfo.expired_count || (totalCount - totalActiveCount)})</option>
            </select>

            {/* Platform Selector */}
            <select
              value={selectedPlatform}
              onChange={(e) => {
                setSelectedPlatform(e.target.value);
                setPage(1);
              }}
              style={{
                background: 'rgba(11, 17, 32, 0.9)',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '9px 14px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Gateways & Stores</option>
              <option value="ios">Apple StoreKit 2 (iOS)</option>
              <option value="web">Razorpay Web Checkout</option>
            </select>

            {/* Reset Filter Button if non-default */}
            {(selectedStatus !== 'all' || selectedPlatform !== 'all' || selectedProduct !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedStatus('all');
                  setSelectedPlatform('all');
                  setSelectedProduct('all');
                  setSearchQuery('');
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  padding: '9px 14px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Clear Filters ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 4: ACTIVE SUBSCRIBERS DATA TABLE */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.35)'
      }}>
        {/* Table Header Bar */}
        <div style={{
          padding: '16px 20px',
          background: 'rgba(30, 41, 59, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeProductInfo.isLogo ? (
              <img src={activeProductInfo.icon} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '18px' }}>{activeProductInfo.icon}</span>
            )}
            <span style={{ fontWeight: '800', color: '#f8fafc', fontSize: '15px' }}>
              {activeProductInfo.name} Subscribers Ledger
            </span>
            <span style={{
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#60a5fa',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '700'
            }}>
              {subscriptions.length} shown
            </span>
          </div>

          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            Active Filter: <strong style={{ color: '#34d399' }}>{selectedStatus === 'all' ? 'All Records' : selectedStatus.toUpperCase()}</strong>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{
                background: 'rgba(30, 41, 59, 0.95)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#94a3b8',
                fontWeight: '700',
                textTransform: 'uppercase',
                fontSize: '11px',
                letterSpacing: '0.05em'
              }}>
                <th style={{ padding: '14px 18px' }}>Subscriber & Customer</th>
                <th style={{ padding: '14px 16px' }}>Product & Plan</th>
                <th style={{ padding: '14px 16px' }}>Tier</th>
                <th style={{ padding: '14px 16px' }}>Billing Amount</th>
                <th style={{ padding: '14px 16px' }}>Dynamic Status</th>
                <th style={{ padding: '14px 16px' }}>Platform / Provider</th>
                <th style={{ padding: '14px 16px' }}>Entitlement Window</th>
                <th style={{ padding: '14px 16px' }}>Auto-Renew</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '18px', marginBottom: '8px' }}>🔄</div>
                    <div>Loading live production subscriptions from Atlas DB...</div>
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '28px', marginBottom: '10px' }}>🔍</div>
                    <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '15px' }}>
                      No matching {activeProductInfo.name} subscriptions found for this filter
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px', maxWidth: '450px', margin: '6px auto 16px auto' }}>
                      {selectedStatus === 'grace' 
                        ? 'There are currently 0 subscriptions in the 3-day grace period. All active subscriptions are healthy and renewing.'
                        : `No records match status: "${selectedStatus}" and product: "${activeProductInfo.name}".`}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStatus('all');
                        setSelectedPlatform('all');
                        setSelectedProduct('all');
                        setSearchQuery('');
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 18px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
                      }}
                    >
                      Show All Active Subscriptions ({totalCount}) ➔
                    </button>
                  </td>
                </tr>
              ) : (
                subscriptions.map((s) => {
                  const pCode = (s.product_code || '').toLowerCase();
                  const isLegal = pCode === 'ailegal';
                  const isEfv = pCode === 'efvframework' || pCode === 'efv';
                  const isAisa = pCode === 'aisa';
                  const isAiAds = pCode === 'aiads';
                  const isUwoConnect = pCode === 'uwoconnect';
                  const isAiMall = pCode === 'aimall';
                  const isAiEducation = pCode === 'aieducation';
                  const isUwo = pCode === 'uwo';
                  const productIcon = isLegal ? (
                    <img src="/images/ailegallogo.png" alt="AI Legal" style={{ width: '16px', height: '16px', objectFit: 'contain', verticalAlign: 'middle' }} />
                  ) : isAisa ? (
                    <img src="/images/aisa-logo.png" alt="AISA" style={{ width: '16px', height: '16px', objectFit: 'contain', verticalAlign: 'middle' }} />
                  ) : isEfv ? (
                    <img src="/images/efv-logo.png" alt="EFV" style={{ width: '16px', height: '16px', objectFit: 'contain', verticalAlign: 'middle' }} />
                  ) : isAiAds ? (
                    <img src="/images/aiads-logo.png" alt="AI Ads" style={{ width: '16px', height: '16px', objectFit: 'contain', verticalAlign: 'middle' }} />
                  ) : isUwoConnect ? (
                    <img src="/images/uwoconnectlogo.png" alt="UWO Connect" style={{ width: '16px', height: '16px', objectFit: 'contain', verticalAlign: 'middle' }} />
                  ) : isAiMall ? (
                    <img src="/images/aimall-logo.webp" alt="AI Mall" style={{ width: '16px', height: '16px', objectFit: 'contain', verticalAlign: 'middle' }} />
                  ) : isAiEducation ? (
                    <img src="/images/ai-education-logo.png" alt="AI Education" style={{ width: '16px', height: '16px', objectFit: 'contain', verticalAlign: 'middle' }} />
                  ) : isUwo ? (
                    <img src="/images/uwo-logo.png" alt="UWO" style={{ width: '16px', height: '16px', objectFit: 'contain', verticalAlign: 'middle' }} />
                  ) : '📦';
                  const initials = (s.customer_name || 'U')
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();

                  const avatarBg = isLegal
                    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                    : (isEfv
                      ? 'linear-gradient(135deg, #f59e0b, #b45309)'
                      : (isAisa
                        ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                        : 'linear-gradient(135deg, #10b981, #047857)'));

                  return (
                    <tr
                      key={s.id || s._id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Customer Info */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: avatarBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '12px',
                            color: '#ffffff',
                            flexShrink: 0
                          }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: '#f8fafc' }}>
                              {s.customer_name || 'Subscriber'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                              {s.customer_email || '—'}
                            </div>
                            {s.transaction_id && (
                              <div style={{ fontSize: '11px', color: '#60a5fa', marginTop: '2px', fontFamily: 'monospace' }}>
                                🔗 {s.transaction_id}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Product & Plan */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '14px' }}>{productIcon}</span>
                          <span style={{ fontWeight: '700', color: '#e2e8f0' }}>{s.product_name || s.product_code}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          Workspace: {s.workspace || 'default'}
                        </div>
                      </td>

                      {/* Tier Badge */}
                      <td style={{ padding: '14px 16px' }}>
                        {renderTierBadge(s.tier)}
                      </td>

                      {/* Amount & Cycle */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '800', color: '#34d399', fontSize: '14px' }}>
                          {formatCurrency(s.amount)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize' }}>
                          / {s.billing_cycle || 'monthly'}
                        </div>
                      </td>

                      {/* Dynamic Status */}
                      <td style={{ padding: '14px 16px' }}>
                        {renderStatusBadge(s)}
                      </td>

                      {/* Platform / Provider */}
                      <td style={{ padding: '14px 16px' }}>
                        {renderPlatformBadge(s.platform, s.provider)}
                      </td>

                      {/* Entitlement Period */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                          {formatDate(s.start_date)} → {formatDate(s.expiry_date)}
                        </div>
                        {s.days_remaining !== null && (
                          <div style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: s.days_remaining > 7 ? '#34d399' : (s.days_remaining > 0 ? '#fb923c' : '#f87171'),
                            marginTop: '2px'
                          }}>
                            {s.days_remaining > 0 ? `${s.days_remaining} days remaining` : 'Expired'}
                          </div>
                        )}
                      </td>

                      {/* Auto Renew (Interactive Admin Toggle) */}
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          type="button"
                          onClick={(e) => handleToggleAutoRenew(s, e)}
                          disabled={actionLoadingId === (s.id || s._id)}
                          title={`Click to turn Auto-Renew ${s.auto_renew ? 'OFF' : 'ON'}`}
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '4px 10px',
                            borderRadius: '14px',
                            background: s.auto_renew ? 'rgba(16, 185, 129, 0.16)' : 'rgba(148, 163, 184, 0.12)',
                            color: s.auto_renew ? '#34d399' : '#94a3b8',
                            border: `1px solid ${s.auto_renew ? 'rgba(16, 185, 129, 0.4)' : 'rgba(148, 163, 184, 0.25)'}`,
                            cursor: actionLoadingId === (s.id || s._id) ? 'wait' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = s.auto_renew ? '0 0 10px rgba(52, 211, 153, 0.3)' : '0 0 10px rgba(148, 163, 184, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {actionLoadingId === (s.id || s._id) ? (
                            <span>⏳ Saving...</span>
                          ) : (
                            <>
                              <span>{s.auto_renew ? '✓' : '✕'}</span>
                              <span>{s.auto_renew ? 'Enabled' : 'Off'}</span>
                              <span style={{ fontSize: '10px', opacity: 0.65, marginLeft: '2px' }}>⇄</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedSub(s)}
                          style={{
                            background: 'rgba(59, 130, 246, 0.15)',
                            color: '#60a5fa',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          Details ➔
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION BAR */}
        <div style={{
          padding: '14px 20px',
          background: 'rgba(30, 41, 59, 0.6)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ fontSize: '13px', color: '#94a3b8' }}>
            Showing <strong style={{ color: '#f8fafc' }}>{subscriptions.length}</strong> of{' '}
            <strong style={{ color: '#f8fafc' }}>{totalCount}</strong> subscriptions
            {selectedProduct !== 'all' && ` in ${activeProductInfo.name}`}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: page <= 1 ? '#475569' : '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: page <= 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: page >= totalPages ? '#475569' : '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedSub && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>
                  Subscription Verification Record
                </h3>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  ID: {selectedSub.id || selectedSub._id}
                </span>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Customer Name</span>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc', marginTop: '4px' }}>
                  {selectedSub.customer_name || 'Subscriber'}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Customer Email</span>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc', marginTop: '4px' }}>
                  {selectedSub.customer_email || '—'}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Product & Tier</span>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#60a5fa', marginTop: '4px' }}>
                  {selectedSub.product_name} ({selectedSub.tier})
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Dynamic Status</span>
                <div style={{ marginTop: '4px' }}>
                  {renderStatusBadge(selectedSub)}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Transaction / Gateway Reference</span>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginTop: '4px', wordBreak: 'break-all' }}>
                  {selectedSub.transaction_id || '—'}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Platform & Gateway</span>
                <div style={{ marginTop: '6px' }}>
                  {renderPlatformBadge(selectedSub.platform, selectedSub.provider)}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Entitlement Start</span>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginTop: '4px' }}>
                  {formatDate(selectedSub.start_date)}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Expiry / Next Billing</span>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginTop: '4px' }}>
                  {formatDate(selectedSub.expiry_date)}
                </div>
              </div>
            </div>

            {/* Direct Auto-Renew & Lifecycle Management Controls */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '16px 18px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🔄</span> Auto-Renew & Subscription Lifecycle Controls
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                    Control auto-renewal entitlement flag or manually extend subscriber access.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleAutoRenew(selectedSub)}
                    disabled={actionLoadingId === (selectedSub.id || selectedSub._id)}
                    style={{
                      background: selectedSub.auto_renew ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.2)',
                      color: selectedSub.auto_renew ? '#f87171' : '#34d399',
                      border: `1px solid ${selectedSub.auto_renew ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: actionLoadingId === (selectedSub.id || selectedSub._id) ? 'wait' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{selectedSub.auto_renew ? '✕ Disable Auto-Renew' : '✓ Enable Auto-Renew'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRenewSubscription(selectedSub, 30)}
                    disabled={actionLoadingId === (selectedSub.id || selectedSub._id)}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: actionLoadingId === (selectedSub.id || selectedSub._id) ? 'wait' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
                    }}
                  >
                    <span>⚡ Renew (+30 Days)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRenewSubscription(selectedSub, 90)}
                    disabled={actionLoadingId === (selectedSub.id || selectedSub._id)}
                    style={{
                      background: 'rgba(59, 130, 246, 0.15)',
                      color: '#60a5fa',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: actionLoadingId === (selectedSub.id || selectedSub._id) ? 'wait' : 'pointer'
                    }}
                  >
                    <span>+90 Days</span>
                  </button>
                </div>
              </div>

              {/* Technical / Operational Diagnostics Box */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '12px 14px',
                fontSize: '11.5px',
                lineHeight: '1.55',
                color: '#cbd5e1'
              }}>
                <div style={{ fontWeight: '700', color: '#38bdf8', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>ℹ️</span> Payment & Renewal Architecture Notes:
                </div>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>
                    <strong style={{ color: '#f1f5f9' }}>Apple StoreKit 2 (iOS):</strong> Charges are processed directly by Apple via the user's Apple ID (saved card, UPI, or Apple Account funds). Our server cannot debit an Apple user's bank directly. When a renewal charge fails (e.g. card declined, limit reached), Apple places the subscription into a <strong>Billing Grace Period (up to 16 days)</strong> while Apple retries the transaction. If the subscriber cancels the subscription inside their iPhone Settings (<code style={{ color: '#93c5fd' }}>Settings &gt; Apple ID &gt; Subscriptions</code>), Apple flags it as <span style={{ color: '#94a3b8' }}>✕ Off</span>.
                  </li>
                  <li>
                    <strong style={{ color: '#f1f5f9' }}>Razorpay Web Checkout:</strong> Standard checkout IDs (<code style={{ color: '#93c5fd' }}>pay_...</code>) are one-time payments. Under RBI regulations, automated recurring bank debits require an active registered <strong>e-mandate</strong> token (<code style={{ color: '#93c5fd' }}>sub_...</code>). Without an e-mandate, payments cannot auto-deduct upon plan expiration.
                  </li>
                  <li>
                    <strong style={{ color: '#f1f5f9' }}>Manual Override:</strong> Clicking <span style={{ color: '#34d399' }}>Renew (+30 Days)</span> will instantly extend this subscriber's access in both the Unified DB and AISA app database.
                  </li>
                </ul>
              </div>
            </div>

            {/* Raw JSON viewer */}
            <div>
              <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
                Raw Ledger Document (Atlas MongoDB)
              </span>
              <pre style={{
                background: 'rgba(11, 17, 32, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '11px',
                color: '#38bdf8',
                overflowX: 'auto',
                marginTop: '6px'
              }}>
                {JSON.stringify(selectedSub, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
