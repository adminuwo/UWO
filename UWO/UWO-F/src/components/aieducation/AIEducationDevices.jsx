import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, ArrowRight, ShieldCheck, 
  ExternalLink
} from 'lucide-react';
import {
  AI_EDUCATION_WEB_URL,
  AI_EDUCATION_ANDROID_URL,
  AI_EDUCATION_IOS_URL
} from '../../constants/aiEducationConstants';

/* ==========================================================================
   OFFICIAL BRAND VECTOR LOGOS
   ========================================================================== */

/** Official Apple Inc. Bitten Apple Silhouette */
const AppleOfficialLogo = ({ size = 20, className = "", color = "currentColor" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 170 170" 
    fill={color} 
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    aria-label="Apple Official Logo"
  >
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.7-11.64-13.99-5.99-9.35-10.74-20.08-14.25-32.19-3.51-12.11-5.27-23.77-5.27-34.99 0-14.42 3.65-26.68 10.96-36.79 7.31-10.11 16.65-15.34 28.02-15.69 5.09-.13 10.59 1.25 16.51 4.14 5.92 2.89 9.87 4.39 11.85 4.5 2.22-.11 6.39-1.61 12.51-4.5 6.13-2.89 11.45-4.22 15.98-3.99 10.45.65 19.11 4.54 25.98 11.68 6.87 7.14 11.04 15.89 12.51 26.25-9.35 5.66-13.91 13.6-13.68 23.82.23 9.79 4.35 17.73 12.36 23.82 4.13 3.05 8.81 5.23 14.04 6.54-2.18 6.53-4.79 12.94-7.83 19.23zM119.22 33.15c0-6.75 2.45-13.34 7.35-19.77 4.9-6.43 11.16-10.89 18.78-13.38.44 1.74.65 3.49.65 5.23 0 6.75-2.56 13.39-7.68 19.92-5.12 6.53-11.43 10.89-18.93 13.08-.11-1.74-.17-3.41-.17-5.08z" />
  </svg>
);

/** Official Google Android Bugdroid Robot Head */
const AndroidOfficialLogo = ({ size = 22, className = "", color = "#10B981" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    aria-label="Google Android Official Logo"
  >
    <path 
      d="M17.52 8.44l1.9-3.3a.5.5 0 00-.18-.68.5.5 0 00-.69.18l-1.93 3.35C15.17 7.38 13.62 7 12 7s-3.17.38-4.62.99L5.45 4.64a.5.5 0 00-.69-.18.5.5 0 00-.18.68l1.9 3.3C3.62 10.15 1.7 13.06 1.5 16.5h21c-.2-3.44-2.12-6.35-4.98-8.06z" 
      fill={color} 
    />
    <circle cx="7.5" cy="12.5" r="1.1" fill="#FFFFFF" />
    <circle cx="16.5" cy="12.5" r="1.1" fill="#FFFFFF" />
  </svg>
);

/** Official Google Chrome 4-Color Web Browser Logo */
const ChromeOfficialLogo = ({ size = 22, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    aria-label="Google Chrome Web Official Logo"
  >
    <path 
      d="M12 0C8.21 0 4.83 1.76 2.63 4.5l3.95 6.85A5.45 5.45 0 0 1 12 6.55h10.69A12 12 0 0 0 12 0z" 
      fill="#EA4335" 
    />
    <path 
      d="M1.93 5.5A11.94 11.94 0 0 0 0 12c0 6.01 4.42 10.99 10.19 11.86l3.95-6.85a5.45 5.45 0 0 1-6.86-2.29L1.93 5.5z" 
      fill="#34A853" 
    />
    <path 
      d="M13.81 13.81a5.44 5.44 0 0 1-1.81.31c-2.41 0-4.45-1.56-5.19-3.73L2.86 17.23A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-.68-.06-1.34-.16-1.99H13.24a5.44 5.44 0 0 1 .57 3.8z" 
      fill="#FBBC05" 
    />
    <circle cx="12" cy="12" r="5.2" fill="#FFFFFF" />
    <circle cx="12" cy="12" r="4.1" fill="#4285F4" />
  </svg>
);

/** Official Google Play Store Triangle Logo */
const GooglePlayOfficialLogo = ({ size = 15, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    aria-label="Google Play Official Logo"
  >
    <path d="M3.61 1.81A2 2 0 0 0 3 3.24v17.52a2 2 0 0 0 .61 1.43l.08.07 9.81-9.81v-.23L3.69 1.74l-.08.07z" fill="#00D2FF"/>
    <path d="M16.78 15.71l-3.28-3.28v-.23l3.28-3.28.07.04 3.88 2.21c1.11.63 1.11 1.66 0 2.29l-3.88 2.21-.07.04z" fill="#FFCE00"/>
    <path d="M13.5 12.43l-9.89 9.89c.39.41 1.05.46 1.79.04l11.45-6.5-3.35-3.43z" fill="#00E676"/>
    <path d="M13.5 11.57l3.35-3.43-11.45-6.5C4.66 1.22 4 .17 3.61 1.68l9.89 9.89z" fill="#FF3A44"/>
  </svg>
);

const PLATFORMS_DATA = [
  {
    id: 'ios',
    name: 'Apple iOS & iPadOS',
    type: 'iPhone, iPad & Watch',
    badge: 'App Store',
    iconType: 'apple',
    brandTheme: '#111827',
    activeBorderColor: '#5145FF',
    accentBg: '#EEF2FF',
    url: AI_EDUCATION_IOS_URL,
    tagline: 'Native FaceID & Apple Wallet passes',
    desc: 'Instant period WhatsApp alerts, multi-child switching, and digital exam hall tickets.',
    ctaText: 'Download on App Store',
    preview: {
      screenTitle: 'Apple Ecosystem Sync',
      status: 'Live on iOS 16 & Above',
      stat1: 'FaceID Biometric Login',
      stat2: 'Apple Wallet QR Pass',
      stat3: '< 200ms Period Alerts',
      pill: 'Exam QR Pass Active on Lock Screen'
    }
  },
  {
    id: 'android',
    name: 'Google Android App',
    type: 'Phones & Tablets',
    badge: 'Google Play',
    iconType: 'android',
    brandTheme: '#10B981',
    activeBorderColor: '#10B981',
    accentBg: '#ECFDF5',
    url: AI_EDUCATION_ANDROID_URL,
    tagline: 'Camera AI doubt solver & offline notes',
    desc: 'Snap any textbook problem for instant verified citations and practice quizzes on the go.',
    ctaText: 'Get it on Google Play',
    preview: {
      screenTitle: 'Android Learning Portal',
      status: 'Live on Android 8 & Above',
      stat1: 'Camera AI Doubt Scanner',
      stat2: 'Offline Course Cache',
      stat3: '5-Day Study Streak 🔥',
      pill: 'NCERT Textbook Formula Verified'
    }
  },
  {
    id: 'web',
    name: 'Institutional Web ERP',
    type: 'Desktops & Laptops',
    badge: 'Web Browser',
    iconType: 'chrome',
    brandTheme: '#0284C7',
    activeBorderColor: '#0284C7',
    accentBg: '#E0F2FE',
    url: AI_EDUCATION_WEB_URL,
    tagline: 'Clash-free timetables & 2-way Tally sync',
    desc: 'Total institutional control for principals, admins, and faculty across all modern browsers.',
    ctaText: 'Launch Web Platform',
    preview: {
      screenTitle: 'Campus ERP Cloud Console',
      status: 'education.uwo24.com',
      stat1: '1,840 Active Students',
      stat2: 'Tally Prime Auto-Sync',
      stat3: '0 Proxy Timetable Clashes',
      pill: 'All 8 Periods Operational in Real-Time'
    }
  }
];

export default function AIEducationDevices() {
  const [activeTab, setActiveTab] = useState(PLATFORMS_DATA[0].id);
  const curPlatform = PLATFORMS_DATA.find(p => p.id === activeTab) || PLATFORMS_DATA[0];

  const renderOfficialIcon = (type, size = 20, isActive = false) => {
    if (type === 'apple') {
      return <AppleOfficialLogo size={size} color={isActive ? '#FFFFFF' : '#111827'} />;
    }
    if (type === 'android') {
      return <AndroidOfficialLogo size={size} color={isActive ? '#FFFFFF' : '#10B981'} />;
    }
    return <ChromeOfficialLogo size={size} />;
  };

  const renderBadgeLogo = (type) => {
    if (type === 'apple') return <AppleOfficialLogo size={11} color="#64748B" />;
    if (type === 'android') return <GooglePlayOfficialLogo size={11} />;
    return <ChromeOfficialLogo size={11} />;
  };

  const renderCtaIcon = (type) => {
    if (type === 'apple') return <AppleOfficialLogo size={15} color="#FFFFFF" />;
    if (type === 'android') return <GooglePlayOfficialLogo size={15} />;
    return <ChromeOfficialLogo size={15} />;
  };

  return (
    <section className="aied-section-devices" id="devices-section">
      <div className="aied-container">
        
        {/* Section Header (Platform Availability Eyebrow Removed as Requested) */}
        <div className="aied-section-header">
          <h2 className="aied-section-title">
            Available on <span className="accent">Every Device.</span>
          </h2>
          <p className="aied-section-subtitle">
            One unified ecosystem with instant real-time synchronization across all platforms.
          </p>
        </div>

        {/* 2-Column Stage: Left Platform Selectors (with Official Logos) | Right Cloud Workspace Preview */}
        <div className="aied-device-platforms-stage">
          
          {/* LEFT SIDE: Platform Selector Cards with Official Apple, Android & Chrome Logos */}
          <div className="aied-platform-selector-col">
            <div className="aied-platform-selector-list" role="tablist">
              {PLATFORMS_DATA.map((plat) => {
                const isActive = plat.id === activeTab;
                
                // Card icon box styling
                let iconBoxBg = '#F8FAFC';
                if (isActive) {
                  if (plat.id === 'ios') iconBoxBg = '#111827';
                  else if (plat.id === 'android') iconBoxBg = '#10B981';
                  else iconBoxBg = '#EFF6FF';
                } else {
                  if (plat.id === 'android') iconBoxBg = '#ECFDF5';
                  else if (plat.id === 'web') iconBoxBg = '#F8FAFC';
                  else iconBoxBg = '#F1F5F9';
                }

                return (
                  <button
                    key={plat.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    className={`aied-platform-card-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveTab(plat.id)}
                  >
                    {/* Official Platform Logo Box */}
                    <div 
                      className="aied-platform-icon-box"
                      style={{ 
                        background: iconBoxBg,
                        border: isActive ? 'none' : '1px solid rgba(226, 232, 240, 0.9)'
                      }}
                    >
                      {renderOfficialIcon(plat.iconType, 22, isActive)}
                    </div>

                    {/* Platform Info */}
                    <div className="aied-platform-card-text">
                      <div className="aied-platform-title-row">
                        <span className="aied-platform-name">{plat.name}</span>
                        <a 
                          href={plat.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="aied-platform-badge-tag"
                          onClick={(e) => e.stopPropagation()}
                          title={`Open ${plat.name} Link`}
                        >
                          {renderBadgeLogo(plat.iconType)}
                          <span>{plat.badge}</span>
                          <ExternalLink size={9} style={{ opacity: 0.6, marginLeft: '1px' }} />
                        </a>
                      </div>
                      <span className="aied-platform-tagline">{plat.tagline}</span>
                    </div>

                    {/* Active Accent Border Indicator */}
                    {isActive && (
                      <motion.div 
                        layoutId="activePlatformBorder" 
                        className="aied-platform-active-border"
                        style={{ borderColor: plat.activeBorderColor }}
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Platform Primary CTA Button with Live External Link */}
            <div className="aied-platform-cta-box">
              <a 
                href={curPlatform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="aied-platform-action-btn"
                style={{ 
                  background: curPlatform.id === 'ios' ? '#111827' : curPlatform.activeBorderColor,
                  boxShadow: `0 4px 14px ${curPlatform.activeBorderColor}40`
                }}
              >
                {renderCtaIcon(curPlatform.iconType)}
                <span>{curPlatform.ctaText}</span>
                <ExternalLink size={13} style={{ marginLeft: '3px', opacity: 0.8 }} />
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: Clean Modern Desktop Cloud Workspace Preview (NO phone frame!) */}
          <div className="aied-platform-preview-col">
            <div className="aied-cloud-preview-card">
              
              {/* Subtle Ambient Radial Glow */}
              <div 
                className="aied-cloud-ambient-glow" 
                style={{ background: `radial-gradient(circle, ${curPlatform.activeBorderColor}1A 0%, transparent 70%)` }}
                aria-hidden="true" 
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={curPlatform.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="aied-cloud-screen-inner"
                >
                  {/* Top Header Strip */}
                  <div className="aied-cloud-top-strip">
                    <div className="cloud-strip-left">
                      <div className="cloud-strip-icon">
                        {renderOfficialIcon(curPlatform.iconType, 18, false)}
                      </div>
                      <span className="cloud-strip-title">{curPlatform.preview.screenTitle}</span>
                    </div>
                    <a 
                      href={curPlatform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cloud-strip-status" 
                      style={{ color: curPlatform.activeBorderColor, textDecoration: 'none' }}
                      title={`Open ${curPlatform.preview.status}`}
                    >
                      <span className="cloud-pulse-dot" style={{ background: curPlatform.activeBorderColor }} />
                      <span>{curPlatform.preview.status}</span>
                      <ExternalLink size={10} style={{ opacity: 0.7, marginLeft: '2px' }} />
                    </a>
                  </div>

                  {/* Description */}
                  <p className="aied-cloud-desc-line">{curPlatform.desc}</p>

                  {/* 3 Clean Metric / Feature Tiles */}
                  <div className="aied-cloud-tiles-grid">
                    <div className="cloud-tile">
                      <CheckCircle2 size={14} style={{ color: curPlatform.activeBorderColor, flexShrink: 0 }} />
                      <span>{curPlatform.preview.stat1}</span>
                    </div>
                    <div className="cloud-tile">
                      <CheckCircle2 size={14} style={{ color: curPlatform.activeBorderColor, flexShrink: 0 }} />
                      <span>{curPlatform.preview.stat2}</span>
                    </div>
                    <div className="cloud-tile">
                      <CheckCircle2 size={14} style={{ color: curPlatform.activeBorderColor, flexShrink: 0 }} />
                      <span>{curPlatform.preview.stat3}</span>
                    </div>
                  </div>

                  {/* Active Highlight Banner */}
                  <div className="aied-cloud-highlight-bar" style={{ background: curPlatform.accentBg }}>
                    <ShieldCheck size={15} style={{ color: curPlatform.activeBorderColor }} />
                    <span style={{ color: curPlatform.activeBorderColor }}>{curPlatform.preview.pill}</span>
                  </div>

                  {/* Bottom Multi-Device Sync Footer */}
                  <div className="aied-cloud-sync-footer">
                    <div className="sync-footer-icons">
                      <AppleOfficialLogo size={13} color="#111827" />
                      <AndroidOfficialLogo size={14} color="#10B981" />
                      <ChromeOfficialLogo size={13} />
                    </div>
                    <span>Continuous 2-Way Cloud Sync · Zero Manual Export</span>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

