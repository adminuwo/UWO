import React, { useState, useEffect } from 'react';

export const UserReferralsView = ({
  summary,
  links = [],
  registrations = [],
  activity = [],
  loading = false,
  onRefresh,
  onSimulateClick,
  token,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('links'); // 'links' | 'registrations' | 'activity' | 'products'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProduct, setFilterProduct] = useState('all');
  const [copyFeedback, setCopyFeedback] = useState('');
  const [simulatingCode, setSimulatingCode] = useState(null);
  const [userQrModal, setUserQrModal] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Admin Ecosystem Projects Management State
  const [adminProducts, setAdminProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productModal, setProductModal] = useState(null); // null | 'add' | 'edit'
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    webUrl: '',
    androidUrl: '',
    iosUrl: '',
    active: true,
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [productFeedback, setProductFeedback] = useState({ type: '', text: '' });

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch('/api/products?includeInactive=true');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setAdminProducts(data.products);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin ecosystem products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      webUrl: '',
      androidUrl: '',
      iosUrl: '',
      active: true,
    });
    setProductFeedback({ type: '', text: '' });
    setProductModal('add');
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || '',
      description: prod.description || '',
      webUrl: prod.webUrl || '',
      androidUrl: prod.androidUrl || '',
      iosUrl: prod.iosUrl || '',
      active: prod.active !== undefined ? prod.active : true,
    });
    setProductFeedback({ type: '', text: '' });
    setProductModal('edit');
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    setProductFeedback({ type: '', text: '' });

    try {
      const activeToken = token || localStorage.getItem('admin_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (activeToken) {
        headers['Authorization'] = `Bearer ${activeToken}`;
      }

      const url = productModal === 'edit'
        ? `/api/products/${editingProduct._id}`
        : '/api/products';
      const method = productModal === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(productForm),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save ecosystem project');
      }

      setProductFeedback({
        type: 'success',
        text: productModal === 'edit'
          ? `✓ Project "${productForm.name}" updated successfully!`
          : `✓ New project "${productForm.name}" created successfully!`,
      });

      await fetchProducts();
      setTimeout(() => {
        setProductModal(null);
        setProductFeedback({ type: '', text: '' });
      }, 1200);
    } catch (err) {
      setProductFeedback({ type: 'error', text: err.message });
    } finally {
      setSavingProduct(false);
    }
  };

  const handleToggleActive = async (prod) => {
    try {
      const activeToken = token || localStorage.getItem('admin_token');
      const headers = { 'Content-Type': 'application/json' };
      if (activeToken) headers['Authorization'] = `Bearer ${activeToken}`;

      const res = await fetch(`/api/products/${prod._id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ name: prod.name, active: !prod.active }),
      });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (err) {
      console.error('Failed to toggle product status:', err);
    }
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`${label} copied to clipboard!`);
    setTimeout(() => setCopyFeedback(''), 3000);
  };

  const handleSimulate = async (code, deviceType = 'desktop') => {
    try {
      setSimulatingCode(code);
      if (onSimulateClick) {
        await onSimulateClick(code, deviceType);
      }
    } finally {
      setSimulatingCode(null);
    }
  };

  const availableProducts = Array.from(
    new Set(links.map((l) => l.product?.name).filter(Boolean))
  );

  // Map of registered user emails from links to provide instant fallback even before backend deployment
  const knownUserEmailMap = React.useMemo(() => {
    const map = new Map();
    links.forEach((l) => {
      const em = l.user?.email?.toLowerCase().trim();
      if (em) {
        map.set(em, l.userId || l.user?.userId || '');
      }
    });
    return map;
  }, [links]);

  const filteredLinks = links.filter((l) => {
    const q = searchTerm.toLowerCase();
    const userName = l.user?.name?.toLowerCase() || '';
    const userEmail = l.user?.email?.toLowerCase() || '';
    const userId = l.userId?.toLowerCase() || '';
    const code = l.code?.toLowerCase() || '';
    const prodName = l.product?.name?.toLowerCase() || '';
    const matchesSearch = userName.includes(q) || userEmail.includes(q) || userId.includes(q) || code.includes(q) || prodName.includes(q);
    const matchesProduct = filterProduct === 'all' || l.product?.name === filterProduct;
    return matchesSearch && matchesProduct;
  });

  const filteredRegistrations = registrations.filter((r) => {
    const q = searchTerm.toLowerCase();
    const name = r.name?.toLowerCase() || '';
    const email = r.email?.toLowerCase() || '';
    const code = r.referralCode?.toLowerCase() || '';
    return name.includes(q) || email.includes(q) || code.includes(q);
  });

  const filteredProducts = adminProducts.filter((p) => {
    const q = searchTerm.toLowerCase();
    const name = (p.name || '').toLowerCase();
    const slug = (p.slug || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    return name.includes(q) || slug.includes(q) || desc.includes(q);
  });

  return (
    <div style={{ width: '100%', color: '#F8FAFC' }}>
      {/* Copy Alert Feedback */}
      {copyFeedback && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 99999,
            fontWeight: '800',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>✓</span> {copyFeedback}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '16px',
        }}
      >
        {/* Card 1: Registered Referrers */}
        <div
          style={{
            backgroundColor: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '14px',
            padding: '16px 18px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Registered Referrers
            </span>
            <span style={{ fontSize: '18px' }}>👥</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#FABE56', marginTop: '6px' }}>
            {summary?.total_referral_users?.toLocaleString() || '0'}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#10B981', fontWeight: '700' }}>● {summary?.total_submissions || 0}</span>
            <span>Earn & Refer applications submitted</span>
          </div>
        </div>

        {/* Card 2: Referral Links Generated */}
        <div
          style={{
            backgroundColor: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '14px',
            padding: '16px 18px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Active Referral Links
            </span>
            <span style={{ fontSize: '18px' }}>🔗</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#6366F1', marginTop: '6px' }}>
            {summary?.total_links?.toLocaleString() || links.length}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
            Across all {availableProducts.length > 0 ? availableProducts.length : 8} official UWO ecosystem products
          </div>
        </div>

        {/* Card 3: Total Referral Clicks */}
        <div
          style={{
            backgroundColor: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '14px',
            padding: '16px 18px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Total Referral Clicks
            </span>
            <span style={{ fontSize: '18px' }}>🖱️</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#38BDF8', marginTop: '6px' }}>
            {summary?.total_clicks?.toLocaleString() || '0'}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
            <strong style={{ color: '#34D399' }}>{summary?.unique_clicks || 0}</strong> unique visitor IP clicks
          </div>
        </div>

        {/* Card 4: Verified App Downloads */}
        <div
          style={{
            backgroundColor: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '14px',
            padding: '16px 18px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Verified App Installs
            </span>
            <span style={{ fontSize: '18px' }}>📥</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#10B981', marginTop: '6px' }}>
            {summary?.total_downloads?.toLocaleString() || '0'}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px', display: 'flex', gap: '8px' }}>
            <span>🤖 Android: <strong style={{ color: '#F8FAFC' }}>{summary?.android_downloads || 0}</strong></span>
            <span>•</span>
            <span>🍏 iOS: <strong style={{ color: '#F8FAFC' }}>{summary?.ios_downloads || 0}</strong></span>
          </div>
        </div>
      </div>

      {/* Action Bar & Sub-Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', background: '#0F172A', padding: '4px', borderRadius: '12px', border: '1px solid #1E293B' }}>
          <button
            onClick={() => setActiveSubTab('links')}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeSubTab === 'links' ? '#1E293B' : 'transparent',
              color: activeSubTab === 'links' ? '#FABE56' : '#94A3B8',
              fontWeight: '800',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            🔗 User Referral Links ({filteredLinks.length})
          </button>
          <button
            onClick={() => setActiveSubTab('registrations')}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeSubTab === 'registrations' ? '#1E293B' : 'transparent',
              color: activeSubTab === 'registrations' ? '#FABE56' : '#94A3B8',
              fontWeight: '800',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            📋 Earn & Refer Applicants ({filteredRegistrations.length})
          </button>
          <button
            onClick={() => setActiveSubTab('activity')}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeSubTab === 'activity' ? '#1E293B' : 'transparent',
              color: activeSubTab === 'activity' ? '#FABE56' : '#94A3B8',
              fontWeight: '800',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            ⚡ Live Activity Stream ({activity.length})
          </button>
          <button
            onClick={() => setActiveSubTab('products')}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeSubTab === 'products' ? '#1E293B' : 'transparent',
              color: activeSubTab === 'products' ? '#FABE56' : '#94A3B8',
              fontWeight: '800',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            📦 Ecosystem Projects & Links ({adminProducts.length})
          </button>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {activeSubTab === 'links' && availableProducts.length > 0 && (
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              style={{
                background: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '7px 10px',
                color: '#F8FAFC',
                fontSize: '12px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Products ({availableProducts.length})</option>
              {availableProducts.map((pName) => (
                <option key={pName} value={pName}>
                  {pName}
                </option>
              ))}
            </select>
          )}

          <input
            type="text"
            placeholder={
              activeSubTab === 'products'
                ? 'Search projects by name, slug, or description...'
                : 'Search by user, ID, product or code...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: '#0F172A',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '7px 12px',
              color: '#F8FAFC',
              fontSize: '12px',
              minWidth: '220px',
              outline: 'none',
            }}
          />

          {activeSubTab === 'products' && (
            <button
              onClick={handleOpenAddProduct}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
              }}
            >
              <span>+</span> Add Ecosystem Project
            </button>
          )}
        </div>
      </div>

      {/* 1. User Referral Links View */}
      {activeSubTab === 'links' && (
        <div
          style={{
            background: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#F8FAFC' }}>
                User Referral Links & Performance
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94A3B8' }}>
                All personalized tracking links generated by registered users with real click and verified install metrics.
              </p>
            </div>
            <span style={{ fontSize: '12px', color: '#FABE56', fontWeight: '700', background: 'rgba(250, 190, 86, 0.1)', padding: '4px 10px', borderRadius: '8px' }}>
              {filteredLinks.length} Active Links
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#1E293B', color: '#94A3B8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.6px' }}>
                  <th style={{ padding: '12px 16px', minWidth: '170px' }}>Referrer User</th>
                  <th style={{ padding: '12px 16px', minWidth: '110px', whiteSpace: 'nowrap' }}>User ID</th>
                  <th style={{ padding: '12px 16px', minWidth: '120px', whiteSpace: 'nowrap' }}>Product</th>
                  <th style={{ padding: '12px 16px', minWidth: '320px' }}>Referral Link & Code</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', minWidth: '70px', whiteSpace: 'nowrap' }}>Clicks</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', minWidth: '70px', whiteSpace: 'nowrap' }}>Unique</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', minWidth: '90px', whiteSpace: 'nowrap' }}>Downloads</th>
                  <th style={{ padding: '12px 16px', minWidth: '95px', whiteSpace: 'nowrap' }}>Created</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', minWidth: '110px', whiteSpace: 'nowrap' }}>Quick Test</th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                      No user referral links found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredLinks.map((l) => (
                    <tr
                      key={l.id}
                      style={{
                        borderBottom: '1px solid #1E293B',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#1E293B55')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* User Info */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '700', color: '#F8FAFC' }}>{l.user?.name || 'Referral Partner'}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>{l.user?.email || 'Registered User'}</div>
                      </td>

                      {/* User ID */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            background: 'rgba(250, 190, 86, 0.12)',
                            color: '#FABE56',
                            padding: '4px 9px',
                            borderRadius: '6px',
                            fontFamily: 'monospace',
                            fontWeight: '700',
                            fontSize: '12px',
                            border: '1px solid rgba(250, 190, 86, 0.3)',
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                          }}
                        >
                          {l.userId}
                        </span>
                      </td>

                      {/* Product */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            background: '#1E293B',
                            color: '#38BDF8',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontWeight: '700',
                            fontSize: '12px',
                            border: '1px solid #334155',
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                          }}
                        >
                          {l.product?.name || 'UWO Product'}
                        </span>
                      </td>

                      {/* Referral Code & URL */}
                      <td style={{ padding: '14px 16px', minWidth: '320px' }}>
                        {(() => {
                          const cleanUrl = l.code 
                            ? `https://uwo24.com/r/${l.code}` 
                            : ((l.fullUrl || '').replace(/^https?:\/\/[^\/]+\/r\//i, 'https://uwo24.com/r/'));
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#818CF8', fontSize: '13px', whiteSpace: 'nowrap' }}>
                                  {l.code}
                                </span>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                                  <button
                                    onClick={() => handleCopy(cleanUrl, 'Referral Link')}
                                    title="Copy full tracking link"
                                    style={{
                                      background: '#1E293B',
                                      border: '1px solid #334155',
                                      color: '#94A3B8',
                                      borderRadius: '6px',
                                      padding: '3px 8px',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    📋 Link
                                  </button>
                                  <button
                                    onClick={() => handleCopy(l.code, 'Referral Code')}
                                    title="Copy referral code only"
                                    style={{
                                      background: '#1E293B',
                                      border: '1px solid #334155',
                                      color: '#94A3B8',
                                      borderRadius: '6px',
                                      padding: '3px 8px',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    🏷️ Code
                                  </button>
                                  <button
                                    onClick={() =>
                                      setUserQrModal({
                                        code: l.code,
                                        fullUrl: cleanUrl,
                                        productName: l.product?.name,
                                        userName: l.user?.name,
                                      })
                                    }
                                    title="Show QR Code"
                                    style={{
                                      background: '#1E293B',
                                      border: '1px solid #334155',
                                      color: '#F59E0B',
                                      borderRadius: '6px',
                                      padding: '3px 8px',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    🏁 QR
                                  </button>
                                  <a
                                    href={cleanUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Open redirection link"
                                    style={{
                                      background: '#1E293B',
                                      border: '1px solid #334155',
                                      color: '#38BDF8',
                                      textDecoration: 'none',
                                      borderRadius: '6px',
                                      padding: '2px 7px',
                                      fontSize: '12px',
                                      fontWeight: '700',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    ↗
                                  </a>
                                </div>
                              </div>
                              <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {cleanUrl}
                              </div>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Clicks */}
                      <td style={{ padding: '14px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: '900', fontSize: '15px', color: '#38BDF8' }}>{l.clicks}</span>
                      </td>

                      {/* Unique Clicks */}
                      <td style={{ padding: '14px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: '800', fontSize: '13px', color: '#34D399' }}>{l.uniqueClicks || 0}</span>
                      </td>

                      {/* Downloads */}
                      <td style={{ padding: '14px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            fontWeight: '900',
                            fontSize: '14px',
                            color: l.downloads > 0 ? '#10B981' : '#64748B',
                            background: l.downloads > 0 ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {l.downloads}
                        </span>
                      </td>

                      {/* Created At */}
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {l.createdAt ? new Date(l.createdAt).toLocaleDateString() : 'Active'}
                      </td>

                      {/* Action */}
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleSimulate(l.code, 'desktop')}
                          disabled={simulatingCode === l.code}
                          style={{
                            background: 'rgba(99, 102, 241, 0.15)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            color: '#818CF8',
                            borderRadius: '8px',
                            padding: '5px 10px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: simulatingCode === l.code ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {simulatingCode === l.code ? '⚡ Clicking...' : '⚡ Test Click'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Earn & Refer Applicants View */}
      {activeSubTab === 'registrations' && (
        <div
          style={{
            background: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #1E293B' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#F8FAFC' }}>
              Earn &amp; Refer Applicant Submissions
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94A3B8' }}>
              Registered applicants from the UWO Main Website "Earn &amp; Refer" form with instant credentials provisioned.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#1E293B', color: '#94A3B8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.6px' }}>
                  <th style={{ padding: '12px 16px' }}>Applicant Name</th>
                  <th style={{ padding: '12px 16px' }}>Email Address</th>
                  <th style={{ padding: '12px 16px' }}>User / App ID</th>
                  <th style={{ padding: '12px 16px' }}>Phone / Contact</th>
                  <th style={{ padding: '12px 16px' }}>Program Preference</th>
                  <th style={{ padding: '12px 16px' }}>Account Status</th>
                  <th style={{ padding: '12px 16px' }}>Date Submitted</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                      No applicant submissions recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((r) => {
                    const em = (r.email || '').toLowerCase().trim();
                    const linkedUserId = r.userId || (em ? knownUserEmailMap.get(em) : null);
                    const isAccountActive = Boolean(r.has_account || linkedUserId);

                    return (
                      <tr
                        key={r.id}
                        style={{
                          borderBottom: '1px solid #1E293B',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#1E293B55')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '14px 16px', fontWeight: '700', color: '#F8FAFC' }}>{r.name}</td>
                        <td style={{ padding: '14px 16px', color: '#38BDF8' }}>{r.email}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              background: isAccountActive ? 'rgba(167, 139, 250, 0.15)' : 'rgba(250, 190, 86, 0.15)',
                              color: isAccountActive ? '#A78BFA' : '#FABE56',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontFamily: 'monospace',
                              fontWeight: '700',
                              fontSize: '12px',
                              border: `1px solid ${isAccountActive ? 'rgba(167, 139, 250, 0.3)' : 'rgba(250, 190, 86, 0.3)'}`,
                            }}
                          >
                            {linkedUserId || r.referralCode}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#94A3B8' }}>{r.phone || '—'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: '#1E293B', padding: '3px 8px', borderRadius: '6px', color: '#E2E8F0', fontSize: '12px' }}>
                            {r.preferredProgram || 'All Platforms'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {isAccountActive ? (
                            <span
                              style={{
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#34D399',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '700',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              ● Account Active
                            </span>
                          ) : (
                            <span
                              style={{
                                background: 'rgba(56, 189, 248, 0.12)',
                                color: '#38BDF8',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '700',
                                border: '1px solid rgba(56, 189, 248, 0.3)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              ○ Application Received
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '12px' }}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleString() : 'Recent'}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <button
                            onClick={() => setSelectedApplicant({ ...r, has_account: isAccountActive, userId: linkedUserId || r.userId })}
                            style={{
                              background: '#1E293B',
                              border: '1px solid #334155',
                              color: '#FABE56',
                              borderRadius: '8px',
                              padding: '5px 12px',
                              fontSize: '11px',
                              fontWeight: '700',
                              cursor: 'pointer',
                            }}
                          >
                            🔍 Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Live Referral Activity Stream View */}
      {activeSubTab === 'activity' && (
        <div
          style={{
            background: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#F8FAFC' }}>
              Live Referral Clicks &amp; Conversions Telemetry
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94A3B8' }}>
              Real-time chronological events recorded when referees click referral links or install mobile apps.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activity.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#94A3B8' }}>
                No recent referral click or install events detected.
              </div>
            ) : (
              activity.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: '#1E293B55',
                    border: '1px solid #1E293B',
                    borderRadius: '12px',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: act.type === 'download' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                        color: act.type === 'download' ? '#34D399' : '#38BDF8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      {act.type === 'download' ? '📥' : '🖱️'}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '13px', color: '#F8FAFC' }}>
                        {act.title}
                        <span style={{ marginLeft: '8px', color: '#818CF8', fontFamily: 'monospace', fontSize: '12px' }}>
                          [{act.code}]
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                        Product: <strong style={{ color: '#E2E8F0' }}>{act.productName}</strong> • Device: {act.deviceType || 'desktop'} • IP: {act.ip}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                    {act.timestamp ? new Date(act.timestamp).toLocaleTimeString() : 'Just now'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. Ecosystem Projects & Destination Links Management */}
      {activeSubTab === 'products' && (
        <div
          style={{
            background: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #1E293B',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#F8FAFC' }}>
                Ecosystem Projects &amp; Destination Routing URLs
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94A3B8' }}>
                Master catalog of official ecosystem products. Destination links configured here dictate where users' referral links redirect on Web, Android, and iOS.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '12px',
                  color: '#FABE56',
                  fontWeight: '700',
                  background: 'rgba(250, 190, 86, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '8px',
                }}
              >
                {filteredProducts.length} Ecosystem Projects
              </span>
              <button
                onClick={fetchProducts}
                disabled={loadingProducts}
                style={{
                  background: '#1E293B',
                  border: '1px solid #334155',
                  color: '#E2E8F0',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {loadingProducts ? '⟳ Refreshing...' : '⟳ Refresh'}
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#1E293B', color: '#94A3B8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.6px' }}>
                  <th style={{ padding: '12px 16px' }}>Project &amp; Slug</th>
                  <th style={{ padding: '12px 16px' }}>Description</th>
                  <th style={{ padding: '12px 16px' }}>Web URL (Desktop)</th>
                  <th style={{ padding: '12px 16px' }}>Android Google Play URL</th>
                  <th style={{ padding: '12px 16px' }}>iOS App Store URL</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: '#94A3B8' }}>
                      {loadingProducts
                        ? 'Loading ecosystem projects...'
                        : 'No ecosystem projects found matching your search. Click "+ Add Ecosystem Project" above.'}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => (
                    <tr
                      key={prod._id}
                      style={{
                        borderBottom: '1px solid #1E293B33',
                        background: 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#1E293B44')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '700', color: '#F8FAFC', fontSize: '14px' }}>
                          {prod.name}
                        </div>
                        <div
                          style={{
                            display: 'inline-block',
                            marginTop: '4px',
                            fontFamily: 'monospace',
                            fontSize: '11px',
                            color: '#818CF8',
                            background: 'rgba(99, 102, 241, 0.15)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: '1px solid rgba(99, 102, 241, 0.25)',
                          }}
                        >
                          slug: {prod.slug}
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px', color: '#94A3B8', maxWidth: '240px', fontSize: '12px' }}>
                        {prod.description || <span style={{ color: '#475569', fontStyle: 'italic' }}>No description</span>}
                      </td>

                      <td style={{ padding: '14px 16px', maxWidth: '200px' }}>
                        {prod.webUrl ? (
                          <a
                            href={prod.webUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: '#38BDF8',
                              textDecoration: 'none',
                              fontSize: '12px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              wordBreak: 'break-all',
                            }}
                            title={prod.webUrl}
                          >
                            🌐 {prod.webUrl.length > 28 ? `${prod.webUrl.slice(0, 28)}...` : prod.webUrl} ↗
                          </a>
                        ) : (
                          <span style={{ color: '#64748B', fontSize: '11px', fontStyle: 'italic' }}>— None (Fallback) —</span>
                        )}
                      </td>

                      <td style={{ padding: '14px 16px', maxWidth: '200px' }}>
                        {prod.androidUrl ? (
                          <div>
                            <a
                              href={prod.androidUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                color: '#34D399',
                                textDecoration: 'none',
                                fontSize: '12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                wordBreak: 'break-all',
                              }}
                              title={prod.androidUrl}
                            >
                              🤖 {prod.androidUrl.length > 26 ? `${prod.androidUrl.slice(0, 26)}...` : prod.androidUrl} ↗
                            </a>
                            <div style={{ fontSize: '10px', color: '#10B981', marginTop: '2px', fontWeight: '600' }}>
                              ✓ Play Referrer Ready
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#64748B', fontSize: '11px', fontStyle: 'italic' }}>— None (Fallback) —</span>
                        )}
                      </td>

                      <td style={{ padding: '14px 16px', maxWidth: '200px' }}>
                        {prod.iosUrl ? (
                          <div>
                            <a
                              href={prod.iosUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                color: '#E2E8F0',
                                textDecoration: 'none',
                                fontSize: '12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                wordBreak: 'break-all',
                              }}
                              title={prod.iosUrl}
                            >
                              🍏 {prod.iosUrl.length > 26 ? `${prod.iosUrl.slice(0, 26)}...` : prod.iosUrl} ↗
                            </a>
                            <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px', fontWeight: '600' }}>
                              ✓ IP Match (3h TTL)
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#64748B', fontSize: '11px', fontStyle: 'italic' }}>— None (Fallback) —</span>
                        )}
                      </td>

                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        {prod.active ? (
                          <span
                            style={{
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#34D399',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            ● Active
                          </span>
                        ) : (
                          <span
                            style={{
                              background: 'rgba(100, 116, 139, 0.2)',
                              color: '#94A3B8',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700',
                              border: '1px solid #334155',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            ○ Inactive
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            style={{
                              background: '#1E293B',
                              border: '1px solid #334155',
                              color: '#FABE56',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontWeight: '700',
                              fontSize: '12px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            title="Edit project destination links"
                          >
                            ✏️ Edit Links
                          </button>
                          <button
                            onClick={() => handleToggleActive(prod)}
                            style={{
                              background: prod.active ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                              border: prod.active ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                              color: prod.active ? '#F87171' : '#34D399',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontWeight: '600',
                              fontSize: '11px',
                              cursor: 'pointer',
                            }}
                            title={prod.active ? 'Deactivate project' : 'Activate project'}
                          >
                            {prod.active ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User QR Code Modal */}
      {userQrModal && (
        <div
          onClick={() => setUserQrModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0F172A',
              border: '1px solid #1E293B',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setUserQrModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800', color: '#F8FAFC' }}>
              Referral QR Code
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#94A3B8' }}>
              {userQrModal.productName} • {userQrModal.userName || 'Referrer'}
            </p>
            <div
              style={{
                background: '#FFFFFF',
                padding: '16px',
                borderRadius: '16px',
                display: 'inline-block',
                margin: '0 auto 16px auto',
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(userQrModal.fullUrl)}`}
                alt={`QR code for ${userQrModal.code}`}
                style={{ width: '220px', height: '220px', display: 'block' }}
              />
            </div>
            <div style={{ background: '#1E293B', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>Referral Code</div>
              <div style={{ fontFamily: 'monospace', fontWeight: '800', color: '#FABE56', fontSize: '16px' }}>
                {userQrModal.code}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleCopy(userQrModal.fullUrl, 'Referral Link')}
                style={{
                  flex: 1,
                  background: '#FABE56',
                  color: '#0F172A',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '10px',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                📋 Copy Link
              </button>
              <button
                onClick={() => handleCopy(userQrModal.code, 'Referral Code')}
                style={{
                  flex: 1,
                  background: '#1E293B',
                  border: '1px solid #334155',
                  color: '#F8FAFC',
                  padding: '10px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                🏷️ Copy Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applicant Details Modal */}
      {selectedApplicant && (
        <div
          onClick={() => setSelectedApplicant(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0F172A',
              border: '1px solid #1E293B',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setSelectedApplicant(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(250, 190, 86, 0.15)',
                  color: '#FABE56',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}
              >
                👤
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#F8FAFC' }}>
                  {selectedApplicant.name}
                </h3>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    background: selectedApplicant.has_account ? 'rgba(167, 139, 250, 0.15)' : 'rgba(56, 189, 248, 0.12)',
                    color: selectedApplicant.has_account ? '#A78BFA' : '#38BDF8',
                    border: selectedApplicant.has_account ? '1px solid rgba(167, 139, 250, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)',
                  }}
                >
                  {selectedApplicant.has_account ? '● Registered Account Active' : '○ Application Received (Pending User Login)'}
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                background: '#1E293B55',
                border: '1px solid #1E293B',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
                fontSize: '13px',
              }}
            >
              <div>
                <div style={{ color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Email Address</div>
                <div style={{ color: '#38BDF8', fontWeight: '600', marginTop: '2px', wordBreak: 'break-all' }}>{selectedApplicant.email}</div>
              </div>
              <div>
                <div style={{ color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Phone / WhatsApp</div>
                <div style={{ color: '#F8FAFC', fontWeight: '600', marginTop: '2px' }}>{selectedApplicant.phone || 'Not provided'}</div>
              </div>
              <div>
                <div style={{ color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>User ID / Ref Code</div>
                <div style={{ color: '#FABE56', fontFamily: 'monospace', fontWeight: '700', marginTop: '2px' }}>
                  {selectedApplicant.userId || selectedApplicant.referralCode || '—'}
                </div>
              </div>
              <div>
                <div style={{ color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Preferred Program</div>
                <div style={{ color: '#F8FAFC', fontWeight: '600', marginTop: '2px' }}>
                  {selectedApplicant.preferredProgram || 'All Ecosystem Products'}
                </div>
              </div>
              <div>
                <div style={{ color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>UPI / Payment ID</div>
                <div style={{ color: '#34D399', fontWeight: '600', marginTop: '2px' }}>{selectedApplicant.upiId || 'None registered'}</div>
              </div>
              <div>
                <div style={{ color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Application ID</div>
                <div style={{ color: '#A78BFA', fontFamily: 'monospace', fontWeight: '700', marginTop: '2px' }}>
                  {selectedApplicant.referralCode || '—'}
                </div>
              </div>
            </div>

            {selectedApplicant.message && (
              <div
                style={{
                  background: '#1E293B33',
                  border: '1px solid #1E293B',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>
                  Applicant Note / Experience
                </div>
                <div style={{ color: '#CBD5E1', fontSize: '13px', lineHeight: '1.5' }}>
                  {selectedApplicant.message}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748B' }}>
              <span>Submitted: {selectedApplicant.createdAt ? new Date(selectedApplicant.createdAt).toLocaleString() : 'N/A'}</span>
              <button
                onClick={() => setSelectedApplicant(null)}
                style={{
                  background: '#1E293B',
                  border: '1px solid #334155',
                  color: '#F8FAFC',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add or Edit Ecosystem Project */}
      {productModal && (
        <div
          onClick={() => setProductModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0F172A',
              border: '1px solid #1E293B',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => setProductModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: '#818CF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                }}
              >
                📦
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#F8FAFC' }}>
                  {productModal === 'edit' ? `Edit "${editingProduct?.name}"` : 'Add New Ecosystem Project'}
                </h3>
                <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#94A3B8' }}>
                  Configure project destination URLs across Web, Android, and iOS platforms.
                </p>
              </div>
            </div>

            {productFeedback.text && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  fontSize: '12px',
                  fontWeight: '700',
                  backgroundColor: productFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${productFeedback.type === 'success' ? '#10B981' : '#EF4444'}`,
                  color: productFeedback.type === 'success' ? '#34D399' : '#F87171',
                }}
              >
                {productFeedback.text}
              </div>
            )}

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AISA Connect or AI Legal"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Brief description of the product or application"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ borderTop: '1px solid #1E293B', paddingTop: '12px', marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#F8FAFC' }}>
                    Platform Destination Routing URLs:
                  </span>
                  <span style={{ fontSize: '11px', color: '#818CF8', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                    Provide at least 1 destination
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#38BDF8', marginBottom: '4px' }}>
                      🌐 Desktop / Laptop Web URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://uwo24.com/aisa"
                      value={productForm.webUrl}
                      onChange={(e) => setProductForm({ ...productForm, webUrl: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#34D399', marginBottom: '4px' }}>
                      🤖 Android Google Play Store URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://play.google.com/store/apps/details?id=com.uwo.aisa"
                      value={productForm.androidUrl}
                      onChange={(e) => setProductForm({ ...productForm, androidUrl: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        boxSizing: 'border-box',
                      }}
                    />
                    <span style={{ fontSize: '10px', color: '#64748B', marginTop: '2px', display: 'block' }}>
                      Android clicks automatically attach &amp;referrer=utm_source%3Dreferral%26ref%3DCODE tags.
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>
                      🍏 iOS Apple App Store URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://apps.apple.com/app/aisa/id123456789"
                      value={productForm.iosUrl}
                      onChange={(e) => setProductForm({ ...productForm, iosUrl: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        boxSizing: 'border-box',
                      }}
                    />
                    <span style={{ fontSize: '10px', color: '#64748B', marginTop: '2px', display: 'block' }}>
                      iOS clicks capture visitor IP with 3-hour TTL for first-launch attribution.
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <input
                  type="checkbox"
                  id="productActiveCheckbox"
                  checked={productForm.active}
                  onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                  style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#4F46E5' }}
                />
                <label htmlFor="productActiveCheckbox" style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC', cursor: 'pointer' }}>
                  Project Active (Visible in user dashboard link generator)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setProductModal(null)}
                  style={{
                    background: '#1E293B',
                    border: '1px solid #334155',
                    color: '#94A3B8',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  style={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '10px 22px',
                    borderRadius: '10px',
                    fontWeight: '800',
                    fontSize: '12px',
                    cursor: savingProduct ? 'not-allowed' : 'pointer',
                    opacity: savingProduct ? 0.6 : 1,
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                  }}
                >
                  {savingProduct ? 'Saving...' : productModal === 'edit' ? 'Save Destination Links' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReferralsView;
