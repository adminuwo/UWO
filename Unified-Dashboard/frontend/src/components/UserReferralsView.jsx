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
  const [copyFeedback, setCopyFeedback] = useState('');
  const [simulatingCode, setSimulatingCode] = useState(null);

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

  const filteredLinks = links.filter((l) => {
    const q = searchTerm.toLowerCase();
    const userName = l.user?.name?.toLowerCase() || '';
    const userEmail = l.user?.email?.toLowerCase() || '';
    const userId = l.userId?.toLowerCase() || '';
    const code = l.code?.toLowerCase() || '';
    const prodName = l.product?.name?.toLowerCase() || '';
    return userName.includes(q) || userEmail.includes(q) || userId.includes(q) || code.includes(q) || prodName.includes(q);
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Card 1: Registered Referrers */}
        <div
          style={{
            backgroundColor: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Registered Referrers
            </span>
            <span style={{ fontSize: '20px' }}>👥</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#FABE56', marginTop: '10px' }}>
            {summary?.total_referral_users?.toLocaleString() || '0'}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#10B981', fontWeight: '700' }}>● {summary?.total_submissions || 0}</span>
            <span>Earn & Refer applications submitted</span>
          </div>
        </div>

        {/* Card 2: Referral Links Generated */}
        <div
          style={{
            backgroundColor: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Active Referral Links
            </span>
            <span style={{ fontSize: '20px' }}>🔗</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#6366F1', marginTop: '10px' }}>
            {summary?.total_links?.toLocaleString() || links.length}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
            Across all 8 official UWO ecosystem products
          </div>
        </div>

        {/* Card 3: Total Referral Clicks */}
        <div
          style={{
            backgroundColor: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Total Referral Clicks
            </span>
            <span style={{ fontSize: '20px' }}>🖱️</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#38BDF8', marginTop: '10px' }}>
            {summary?.total_clicks?.toLocaleString() || '0'}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
            <strong style={{ color: '#34D399' }}>{summary?.unique_clicks || 0}</strong> unique visitor IP clicks
          </div>
        </div>

        {/* Card 4: Verified App Downloads */}
        <div
          style={{
            backgroundColor: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Verified App Installs
            </span>
            <span style={{ fontSize: '20px' }}>📥</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#10B981', marginTop: '10px' }}>
            {summary?.total_downloads?.toLocaleString() || '0'}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px', display: 'flex', gap: '8px' }}>
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
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', background: '#0F172A', padding: '4px', borderRadius: '12px', border: '1px solid #1E293B' }}>
          <button
            onClick={() => setActiveSubTab('links')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeSubTab === 'links' ? '#1E293B' : 'transparent',
              color: activeSubTab === 'links' ? '#FABE56' : '#94A3B8',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            🔗 User Referral Links ({filteredLinks.length})
          </button>
          <button
            onClick={() => setActiveSubTab('registrations')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeSubTab === 'registrations' ? '#1E293B' : 'transparent',
              color: activeSubTab === 'registrations' ? '#FABE56' : '#94A3B8',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            📋 Earn & Refer Applicants ({filteredRegistrations.length})
          </button>
          <button
            onClick={() => setActiveSubTab('activity')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeSubTab === 'activity' ? '#1E293B' : 'transparent',
              color: activeSubTab === 'activity' ? '#FABE56' : '#94A3B8',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            ⚡ Live Activity Stream ({activity.length})
          </button>
        </div>

        {/* Search & Refresh */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by user, ID, product or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: '#0F172A',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '8px 14px',
              color: '#F8FAFC',
              fontSize: '13px',
              minWidth: '260px',
              outline: 'none',
            }}
          />
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '10px',
              color: '#F8FAFC',
              fontSize: '13px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Syncing...' : '🔄 Refresh Data'}
          </button>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#818CF8' }}>{l.code}</span>
                          <button
                            onClick={() => handleCopy(l.fullUrl, 'Referral Link')}
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
                            📋 Copy
                          </button>
                          <a
                            href={l.fullUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open redirection link"
                            style={{ color: '#38BDF8', textDecoration: 'none', fontSize: '12px' }}
                          >
                            ↗
                          </a>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{l.fullUrl}</div>
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
                  <th style={{ padding: '12px 16px' }}>Application ID</th>
                  <th style={{ padding: '12px 16px' }}>Phone / Contact</th>
                  <th style={{ padding: '12px 16px' }}>Program Preference</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                      No applicant submissions recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((r) => (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: '1px solid #1E293B',
                      }}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: '#F8FAFC' }}>{r.name}</td>
                      <td style={{ padding: '14px 16px', color: '#38BDF8' }}>{r.email}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: 'rgba(250, 190, 86, 0.15)',
                            color: '#FABE56',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontFamily: 'monospace',
                            fontWeight: '700',
                            fontSize: '12px',
                          }}
                        >
                          {r.referralCode}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8' }}>{r.phone || '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: '#1E293B', padding: '3px 8px', borderRadius: '6px', color: '#E2E8F0', fontSize: '12px' }}>
                          {r.preferredProgram || 'All Platforms'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#34D399',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700',
                          }}
                        >
                          ● Credentials Active
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '12px' }}>
                        {r.createdAt ? new Date(r.createdAt).toLocaleString() : 'Recent'}
                      </td>
                    </tr>
                  ))
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
    </div>
  );
};

export default UserReferralsView;
