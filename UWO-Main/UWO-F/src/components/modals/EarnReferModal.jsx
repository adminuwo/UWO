import React, { useState, useEffect } from 'react';
import { submitReferral, registerPortalUser, DASHBOARD_LOGIN_URL } from '../../services/api';
import { useAffiliate } from '../../context/AffiliateContext';

export default function EarnReferModal({ isOpen, onClose }) {
  const { affiliateCode } = useAffiliate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [portalLoginUrl, setPortalLoginUrl] = useState(DASHBOARD_LOGIN_URL);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setError('');
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName || !cleanEmail) {
      setError('Please enter your full name and email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await submitReferral({
        name: cleanName,
        email: cleanEmail,
        affiliateCode: affiliateCode || ''
      });

      const creds = (data && data.credentials) || {};
      const uId = creds.userId || data.userId || '';
      const pwd = creds.password || '';
      const logUrl = creds.loginUrl || portalLoginUrl || DASHBOARD_LOGIN_URL;

      setSuccessData({
        email: cleanEmail,
        referralCode: data.referralCode || 'UWO-REF-ACTIVE',
        userId: uId,
        password: pwd,
        loginUrl: logUrl,
        emailSent: Boolean(data.emailSent)
      });

      // Optional confetti trigger
      if (typeof window.confetti === 'function') {
        try {
          window.confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        } catch (cErr) {}
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setError('');
    setSuccessData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      id="earnReferOverlay" 
      className="earn-refer-overlay active" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="earn-refer-card" role="dialog" aria-modal="true" aria-labelledby="earnReferTitle">
        {/* Close Button */}
        <button 
          type="button" 
          className="earn-refer-close" 
          onClick={onClose} 
          title="Close modal" 
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {!successData ? (
          /* Form View - EXACTLY TWO FIELDS: Name and Email */
          <div id="earnReferFormView">
            <div className="earn-badge">
              <i className="fa-solid fa-gift"></i> Earn &amp; Refer
            </div>
            <h2 className="earn-title" id="earnReferTitle">Join UWO™ Earn &amp; Refer</h2>
            <p className="earn-subtitle">
              Partner with us to refer revolutionary AI &amp; enterprise platforms and earn competitive commissions.
            </p>

            <form id="earnReferForm" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="earn-form-group">
                <label htmlFor="earnName">Full Name <span className="req">*</span></label>
                <div className="earn-input-wrap">
                  <input 
                    type="text" 
                    id="earnName" 
                    name="name" 
                    placeholder="e.g. Rahul Sharma" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                    autoComplete="name"
                  />
                  <i className="fa-solid fa-user"></i>
                </div>
              </div>

              {/* Email Field */}
              <div className="earn-form-group">
                <label htmlFor="earnEmail">Email Address <span className="req">*</span></label>
                <div className="earn-input-wrap">
                  <input 
                    type="email" 
                    id="earnEmail" 
                    name="email" 
                    placeholder="rahul@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    autoComplete="email"
                  />
                  <i className="fa-solid fa-envelope"></i>
                </div>
              </div>

              {error && (
                <div id="earnErrorMessage" style={{ display: 'block', color: '#ef4444', fontSize: '13px', fontWeight: '600', marginTop: '10px', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="earn-submit-btn" 
                id="earnSubmitBtn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Get My Referral Account</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success View */
          <div id="earnReferSuccessView" className="earn-success-view" style={{ display: 'block' }}>
            <div className="earn-success-badge">
              <i className="fa-solid fa-check"></i>
            </div>
            <h2 className="earn-success-title">Welcome to UWO™ Earn &amp; Refer!</h2>
            <p className="earn-success-text" style={{ marginBottom: '16px' }}>
              Your referral account has been created for <strong id="earnSuccessEmail" style={{ color: '#FABE56' }}>{successData.email}</strong>.
            </p>

            <div className="earn-success-info">
              Application Reference: <strong id="earnSuccessRefCode">{successData.referralCode}</strong>
            </div>

            {successData.userId && (
              <div style={{
                background: 'rgba(214, 165, 89, 0.12)',
                border: '1.5px solid #D6A559',
                borderRadius: '14px',
                padding: '18px 20px',
                margin: '18px 0',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(214, 165, 89, 0.25)', paddingBottom: '8px' }}>
                  <span style={{ color: '#FABE56', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🔑 Your Portal Login Credentials
                  </span>
                  <span style={{ fontSize: '11px', background: '#10b981', color: '#022c22', fontWeight: 'bold', padding: '2px 8px', borderRadius: '6px' }}>
                    ACTIVE
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '13.5px', borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
                  <span style={{ color: '#94a3b8', fontWeight: 600 }}>User ID:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#FABE56', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '15px' }}>{successData.userId}</span>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        navigator.clipboard.writeText(successData.userId);
                        e.target.textContent = 'Copied!';
                        setTimeout(() => { e.target.textContent = 'Copy'; }, 1500);
                      }} 
                      style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', color: '#f1f5f9', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {successData.password && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '13.5px', borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
                    <span style={{ color: '#94a3b8', fontWeight: 600 }}>Password:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#ffffff', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '15px' }}>{successData.password}</span>
                      <button 
                        type="button" 
                        onClick={(e) => {
                          navigator.clipboard.writeText(successData.password);
                          e.target.textContent = 'Copied!';
                          setTimeout(() => { e.target.textContent = 'Copy'; }, 1500);
                        }} 
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', color: '#f1f5f9', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', cursor: 'pointer' }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ fontSize: '12px', color: successData.emailSent ? '#10b981' : '#cbd5e1', marginTop: '8px' }}>
                  {successData.emailSent 
                    ? '✅ A confirmation email was also sent to your inbox.' 
                    : 'ℹ️ Please save the User ID and Password above to log in directly below.'}
                </div>
              </div>
            )}

            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '22px' }}>
              You can now log in to your personal User Referral Dashboard to generate referral links for all UWO products and track your clicks and downloads in real time.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a 
                id="earnDashboardLink" 
                href={successData.loginUrl || portalLoginUrl || DASHBOARD_LOGIN_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="earn-done-btn" 
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #D6A559 0%, #FABE56 100%)', color: '#0b1120', fontWeight: 'bold', border: 'none' }}
              >
                <span>Login to User Dashboard</span>
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
              <button 
                type="button" 
                className="earn-done-btn" 
                style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)' }} 
                onClick={handleReset}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
