import React, { useState } from 'react';

export const UserReferralsView = ({
  summary,
  links = [],
  registrations = [],
  activity = [],
  loading = false,
  onRefresh,
  onSimulateClick,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('links'); // 'links' | 'registrations' | 'activity'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProduct, setFilterProduct] = useState('all');
  const [copyFeedback, setCopyFeedback] = useState('');
  const [simulatingCode, setSimulatingCode] = useState(null);
  const [userQrModal, setUserQrModal] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

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
            placeholder="Search by user, ID, product or code..."
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
                  <th style={{ padding: '12px 16px' }}>Referrer User</th>
                  <th style={{ padding: '12px 16px' }}>User ID</th>
                  <th style={{ padding: '12px 16px' }}>Product</th>
                  <th style={{ padding: '12px 16px' }}>Referral Link & Code</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Clicks</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Unique</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Downloads</th>
                  <th style={{ padding: '12px 16px' }}>Created</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Quick Test</th>
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
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: 'rgba(250, 190, 86, 0.12)',
                            color: '#FABE56',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontFamily: 'monospace',
                            fontWeight: '700',
                            fontSize: '12px',
                            border: '1px solid rgba(250, 190, 86, 0.3)',
                          }}
                        >
                          {l.userId}
                        </span>
                      </td>

                      {/* Product */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: '#1E293B',
                            color: '#38BDF8',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontWeight: '700',
                            fontSize: '12px',
                            border: '1px solid #334155',
                          }}
                        >
                          {l.product?.name || 'UWO Product'}
                        </span>
                      </td>

                      {/* Referral Code & URL */}
                      <td style={{ padding: '14px 16px' }}>
                        {(() => {
                          const cleanUrl = (l.fullUrl || '').replace(/^https?:\/\/admin\.uwo24\.com\/r\//i, 'https://uwo24.com/r/');
                          return (
                            <>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#818CF8' }}>{l.code}</span>
                                <button
                                  onClick={() => handleCopy(cleanUrl, 'Referral Link')}
                                  title="Copy full tracking link"
                                  style={{
                                    background: '#1E293B',
                                    border: '1px solid #334155',
                                    color: '#94A3B8',
                                    borderRadius: '6px',
                                    padding: '2px 8px',
                                    fontSize: '11px',
                                    cursor: 'pointer',
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
                                    padding: '2px 8px',
                                    fontSize: '11px',
                                    cursor: 'pointer',
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
                                    padding: '2px 8px',
                                    fontSize: '11px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  🏁 QR
                                </button>
                                <a
                                  href={cleanUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Open redirection link"
                                  style={{ color: '#38BDF8', textDecoration: 'none', fontSize: '13px', marginLeft: '2px' }}
                                >
                                  ↗
                                </a>
                              </div>
                              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>{cleanUrl}</div>
                            </>
                          );
                        })()}
                      </td>

                      {/* Clicks */}
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{ fontWeight: '900', fontSize: '15px', color: '#38BDF8' }}>{l.clicks}</span>
                      </td>

                      {/* Unique Clicks */}
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{ fontWeight: '800', fontSize: '13px', color: '#34D399' }}>{l.uniqueClicks || 0}</span>
                      </td>

                      {/* Downloads */}
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
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
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '12px' }}>
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
    </div>
  );
};

export default UserReferralsView;
