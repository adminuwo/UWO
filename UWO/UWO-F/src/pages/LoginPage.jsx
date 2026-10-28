import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../services/api';

export default function LoginPage({ initialRole = 'admin' }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, partnerToken, loginAdmin, loginPartner } = useAuth();

  // Determine starting role from URL or prop
  const urlRole = searchParams.get('role');
  const [currentRole, setCurrentRole] = useState(
    urlRole === 'partner' || initialRole === 'partner' ? 'partner' : 'admin'
  );

  const [isRegister, setIsRegister] = useState(searchParams.get('register') === 'true');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Partner Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Handle redirect if already authenticated
  useEffect(() => {
    if (currentRole === 'partner' && partnerToken && !isRegister) {
      navigate('/partner-dashboard');
    }
  }, [currentRole, partnerToken, isRegister, navigate]);

  const handleRoleChange = (role) => {
    setCurrentRole(role);
    setIsRegister(false);
    setMessage({ text: '', type: '' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ text: 'Please enter both email and password', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (currentRole === 'admin') {
        const result = await loginAdmin(email, password);
        if (result.success) {
          setMessage({
            text: 'Access Granted. Redirecting to Unified Admin Dashboard...',
            type: 'success'
          });
          setTimeout(() => {
            const adminUrl =
              window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:5174'
                : 'https://admin.uwo24.com';
            window.location.href = adminUrl;
          }, 1000);
        } else {
          setMessage({
            text: 'Admin Login Failed: ' + (result.message || 'Invalid admin credentials'),
            type: 'error'
          });
        }
      } else {
        const result = await loginPartner(email, password);
        if (result.success) {
          setMessage({
            text: 'Access Granted. Loading Sales Partner Dashboard...',
            type: 'success'
          });
          setTimeout(() => {
            navigate('/partner-dashboard');
          }, 1000);
        } else {
          setMessage({
            text: 'Partner Login Failed: ' + (result.message || 'Invalid partner credentials'),
            type: 'error'
          });
        }
      }
    } catch (err) {
      setMessage({ text: 'Cannot connect to server. Please check connection.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !regPassword) {
      setMessage({ text: 'All required fields must be filled', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/affiliate/partner/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          phone: regPhone.trim(),
          password: regPassword
        })
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({
          text: data.message || 'Registration request submitted! Awaiting administrator approval.',
          type: 'success'
        });
        setRegName('');
        setRegEmail('');
        setRegPhone('');
        setRegPassword('');
        setTimeout(() => {
          setIsRegister(false);
          setMessage({ text: 'Registration received. Once approved, sign in with your credentials.', type: 'info' });
        }, 3000);
      } else {
        setMessage({ text: data.message || 'Registration failed', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Server unreachable. Please check connection.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 20px 60px',
        background: '#050811',
        position: 'relative',
        overflow: 'hidden',
        color: '#f1f5f9',
        fontFamily: "'Outfit', 'Inter', sans-serif"
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '750px',
          height: '750px',
          background: 'radial-gradient(circle, rgba(214, 165, 89, 0.09) 0%, rgba(22, 35, 119, 0.05) 50%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 10 }}>
        <div
          style={{
            background: 'rgba(11, 17, 32, 0.88)',
            backdropFilter: 'blur(25px)',
            border: '1.5px solid rgba(214, 165, 89, 0.25)',
            borderRadius: '32px',
            padding: 'clamp(26px, 5vw, 45px) clamp(20px, 4vw, 36px)',
            boxShadow: '0 40px 100px rgba(0, 0, 0, 0.85), inset 0 0 30px rgba(214, 165, 89, 0.04)',
            textAlign: 'center'
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            title="Return to UWO Home"
            style={{
              width: '84px',
              height: '84px',
              margin: '0 auto 20px',
              background: 'rgba(214, 165, 89, 0.1)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(214, 165, 89, 0.35)',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            <img
              src="/images/uwo-logo.png"
              alt="UWO™ Logo"
              onError={(e) => { e.currentTarget.src = '/images/logo..webp'; }}
              style={{ width: '52px', height: 'auto', objectFit: 'contain' }}
            />
          </Link>

          {/* Heading */}
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              letterSpacing: '1px',
              marginBottom: '6px',
              textTransform: 'uppercase',
              color: '#ffffff'
            }}
          >
            {isRegister
              ? 'JOIN SALES NETWORK'
              : currentRole === 'admin'
              ? 'ADMIN ACCESS'
              : 'SALES PARTNER PORTAL'}
          </h1>
          <p
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '26px'
            }}
          >
            {isRegister
              ? 'Official Distributor Registration'
              : currentRole === 'admin'
              ? 'Authorized Personnel Only'
              : 'Unified Web Options & Services'}
          </p>

          {/* Segmented Role Selector Toggle */}
          {!isRegister && (
            <div
              style={{
                display: 'flex',
                background: 'rgba(0, 0, 0, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '5px',
                marginBottom: '26px',
                position: 'relative'
              }}
            >
              <button
                type="button"
                id="roleToggleAdminBtn"
                onClick={() => handleRoleChange('admin')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderRadius: '12px',
                  border: 'none',
                  transition: 'all 0.3s ease',
                  background:
                    currentRole === 'admin'
                      ? 'linear-gradient(135deg, #D6A559 0%, #B48E3D 100%)'
                      : 'transparent',
                  color: currentRole === 'admin' ? '#000' : '#94a3b8',
                  boxShadow:
                    currentRole === 'admin' ? '0 4px 15px rgba(214, 165, 89, 0.3)' : 'none'
                }}
              >
                <i className="fa-solid fa-shield-halved" style={{ marginRight: '8px' }}></i>
                Admin
              </button>

              <button
                type="button"
                id="roleTogglePartnerBtn"
                onClick={() => handleRoleChange('partner')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderRadius: '12px',
                  border: 'none',
                  transition: 'all 0.3s ease',
                  background:
                    currentRole === 'partner'
                      ? 'linear-gradient(135deg, #D6A559 0%, #B48E3D 100%)'
                      : 'transparent',
                  color: currentRole === 'partner' ? '#000' : '#94a3b8',
                  boxShadow:
                    currentRole === 'partner' ? '0 4px 15px rgba(214, 165, 89, 0.3)' : 'none'
                }}
              >
                <i className="fa-solid fa-handshake" style={{ marginRight: '8px' }}></i>
                Sales Partner
              </button>
            </div>
          )}

          {/* Alert Message */}
          {message.text && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '20px',
                fontSize: '13px',
                fontWeight: 600,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background:
                  message.type === 'error'
                    ? 'rgba(239, 68, 68, 0.15)'
                    : message.type === 'success'
                    ? 'rgba(34, 197, 94, 0.15)'
                    : 'rgba(214, 165, 89, 0.15)',
                color:
                  message.type === 'error'
                    ? '#f87171'
                    : message.type === 'success'
                    ? '#4ade80'
                    : '#D6A559',
                border: `1px solid ${
                  message.type === 'error'
                    ? 'rgba(239, 68, 68, 0.3)'
                    : message.type === 'success'
                    ? 'rgba(34, 197, 94, 0.3)'
                    : 'rgba(214, 165, 89, 0.3)'
                }`
              }}
            >
              <i
                className={
                  message.type === 'error'
                    ? 'fa-solid fa-circle-exclamation'
                    : message.type === 'success'
                    ? 'fa-solid fa-circle-check'
                    : 'fa-solid fa-circle-info'
                }
              ></i>
              <span>{message.text}</span>
            </div>
          )}

          {/* Already logged in as Admin Banner */}
          {currentRole === 'admin' && token && !message.text && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '20px',
                fontSize: '12.5px',
                textAlign: 'left',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>Signed in as Admin</span>
              <a
                href={
                  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                    ? 'http://localhost:5174'
                    : 'https://admin.uwo24.com'
                }
                style={{
                  color: '#38bdf8',
                  fontWeight: 700,
                  textDecoration: 'underline'
                }}
              >
                Go to Dashboard →
              </a>
            </div>
          )}

          {!isRegister ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
              {/* Email Field */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#D6A559',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: '8px'
                  }}
                >
                  {currentRole === 'admin' ? 'Admin Email' : 'Partner Email'}
                </label>
                <div style={{ position: 'relative' }}>
                  <i
                    className="fa-regular fa-envelope"
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(214, 165, 89, 0.7)',
                      fontSize: '14px'
                    }}
                  ></i>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={currentRole === 'admin' ? 'admin@uwo.com' : 'partner@domain.com'}
                    required
                    autoComplete="email"
                    style={{
                      width: '100%',
                      padding: '13px 16px 13px 44px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '14px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#D6A559')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '25px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#D6A559',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: '8px'
                  }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <i
                    className="fa-solid fa-lock"
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(214, 165, 89, 0.7)',
                      fontSize: '14px'
                    }}
                  ></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    style={{
                      width: '100%',
                      padding: '13px 44px 13px 44px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '14px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#D6A559')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                  />
                  <i
                    className={showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  ></i>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="loginSubmitBtn"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #D6A559, #FABE56)',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '1rem',
                  letterSpacing: '0.5px',
                  cursor: loading ? 'wait' : 'pointer',
                  boxShadow: '0 10px 25px rgba(214, 165, 89, 0.35)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                {loading && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                <span>
                  {loading
                    ? 'Signing In...'
                    : currentRole === 'admin'
                    ? 'Sign In as Admin'
                    : 'Sign In as Partner'}
                </span>
              </button>

              {/* Partner Registration Switch */}
              {currentRole === 'partner' && (
                <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '13px', color: '#94a3b8' }}>
                  Don’t have a sales partner account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(true);
                      setMessage({ text: '', type: '' });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#D6A559',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline'
                    }}
                  >
                    Apply Here
                  </button>
                </div>
              )}
            </form>
          ) : (
            /* PARTNER REGISTRATION FORM */
            <form onSubmit={handleRegister} style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#D6A559',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: '6px'
                  }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Official Representative Name"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#D6A559',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: '6px'
                  }}
                >
                  Business Email *
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="corporate@domain.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#D6A559',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: '6px'
                  }}
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#D6A559',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: '6px'
                  }}
                >
                  Password *
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #D6A559, #FABE56)',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: loading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                {loading && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                <span>{loading ? 'Submitting Application...' : 'Register as Partner'}</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#94a3b8' }}>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setMessage({ text: '', type: '' });
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#D6A559',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* Bottom Bar: Back to Home */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '30px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <Link
              to="/"
              style={{
                color: '#94a3b8',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#D6A559')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
