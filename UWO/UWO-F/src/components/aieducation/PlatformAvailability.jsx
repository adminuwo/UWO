import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Globe, Smartphone, Monitor, ExternalLink, ArrowRight, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';

const DEVICE_TARGETS = [
  {
    id: 'desktop',
    name: 'Web Platform',
    sub: 'React 19 & Next.js Core',
    icon: Globe,
    badge: 'Desktop & Smartboards',
    features: ['Multi-tab administration', 'High information density', 'Tally XML sync bridge'],
    url: 'https://education.uwo24.com'
  },
  {
    id: 'mobile',
    name: 'Native Mobile App',
    sub: 'Expo SDK 56 · Android 15 & iOS',
    icon: Smartphone,
    badge: 'Faculty & Student Phones',
    features: ['Biometric quick-unlock', 'Instant substitute push alerts', 'Offline textbook caching'],
    url: 'https://education.uwo24.com'
  },
  {
    id: 'smartboard',
    name: 'Classroom Display',
    sub: 'Interactive Whiteboards',
    icon: Monitor,
    badge: 'Smart Classrooms',
    features: ['Dynamic QR roll call', 'Curriculum split-screen', 'Real-time quiz polling'],
    url: 'https://education.uwo24.com'
  }
];

export default function PlatformAvailability() {
  const shouldReduceMotion = useReducedMotion();
  const [activeDeviceId, setActiveDeviceId] = useState('desktop');
  const activeDevice = DEVICE_TARGETS.find(d => d.id === activeDeviceId) || DEVICE_TARGETS[0];

  return (
    <section className="aied-section" id="platform-availability">
      <div className="aied-container">
        <div className="aied-section-header">
          <span className="aied-badge aied-badge-cyan">
            <Globe size={14} />
            Unified Deployment
          </span>
          <h2 className="aied-section-title">
            Cross-Device <span className="aied-gradient-emerald">Hardware Stage.</span>
          </h2>
          <p className="aied-section-subtitle">
            Deploy seamlessly across university desktop workstations, mobile phones, and classroom touch-screens.
          </p>
        </div>

        {/* Unified Device Showcase Stage (Non-Card Object) */}
        <div className="aied-device-stage">
          {/* Top Device Dock Selector */}
          <div className="aied-device-dock">
            {DEVICE_TARGETS.map((device) => {
              const DeviceIcon = device.icon;
              const isSelected = activeDeviceId === device.id;
              return (
                <button
                  key={device.id}
                  type="button"
                  className={`aied-device-tab ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveDeviceId(device.id)}
                >
                  <DeviceIcon size={16} className={isSelected ? 'text-emerald-400' : 'text-slate-400'} />
                  <div className="aied-device-tab-text">
                    <span className="aied-device-tab-name">{device.name}</span>
                    <span className="aied-device-tab-badge">{device.badge}</span>
                  </div>
                  {isSelected && (
                    <span className="aied-device-active-dot"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Device Screen Frame */}
          <div className="aied-device-canvas">
            <AnimatePresence mode="wait">
              {activeDeviceId === 'desktop' && (
                <motion.div
                  key="desktop"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="aied-device-mockup desktop-frame"
                >
                  <div className="aied-browser-chrome" style={{ background: '#090e17' }}>
                    <div className="aied-browser-dots">
                      <div className="aied-browser-dot red"></div>
                      <div className="aied-browser-dot yellow"></div>
                      <div className="aied-browser-dot green"></div>
                    </div>
                    <div className="aied-browser-address">
                      <ShieldCheck size={11} className="text-emerald-400" />
                      <span>https://education.uwo24.com/dashboard/operations</span>
                    </div>
                  </div>
                  <div className="aied-device-mock-content">
                    <div className="aied-mock-topbar">
                      <span className="aied-mock-logo">AI EDUCATION · CAMPUS OS</span>
                      <div className="aied-mock-status-pill">
                        <span className="aied-pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#00b87a', display: 'inline-block' }}></span>
                        <span>Institutional Tenancy: Connected</span>
                      </div>
                    </div>
                    <div className="aied-mock-grid-row">
                      <div className="aied-mock-stat-tile">
                        <div className="aied-mock-lbl">Active Roster</div>
                        <div className="aied-mock-val" style={{ color: '#00b87a' }}>1,840 Students</div>
                      </div>
                      <div className="aied-mock-stat-tile">
                        <div className="aied-mock-lbl">Today's Attendance</div>
                        <div className="aied-mock-val" style={{ color: '#16b8e8' }}>96.4% Logged</div>
                      </div>
                      <div className="aied-mock-stat-tile">
                        <div className="aied-mock-lbl">Tally Ledger Sync</div>
                        <div className="aied-mock-val" style={{ color: '#8b5cf6' }}>128 Vouchers Clean</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeDeviceId === 'mobile' && (
                <motion.div
                  key="mobile"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="aied-device-mockup mobile-frame"
                >
                  <div className="aied-mobile-notch"></div>
                  <div className="aied-device-mock-content mobile-content">
                    <div className="aied-mobile-header">
                      <span>9:41</span>
                      <span className="text-emerald-400">● 5G · 100%</span>
                    </div>
                    <div className="aied-mobile-body">
                      <div className="aied-mobile-alert">
                        <Zap size={13} className="text-amber-400" />
                        <div>
                          <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.72rem' }}>Period 2 Proxy Assigned</div>
                          <div style={{ fontSize: '0.64rem', color: '#8b9ab0' }}>Covering Class 11-A Physics in Room 302</div>
                        </div>
                      </div>
                      <div className="aied-mobile-stat">
                        <div style={{ fontSize: '0.64rem', color: '#8b9ab0' }}>AI Study Buddy Streak</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00b87a' }}>14 Days 🔥</div>
                      </div>
                    </div>
                    <div className="aied-mobile-tabbar">
                      <span className="active">Dashboard</span>
                      <span>Timetable</span>
                      <span>Study AI</span>
                      <span>Profile</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeDeviceId === 'smartboard' && (
                <motion.div
                  key="smartboard"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="aied-device-mockup smartboard-frame"
                >
                  <div className="aied-smartboard-bezel">
                    <div className="aied-smartboard-inner">
                      <div className="aied-smartboard-header">
                        <span style={{ color: '#00b87a', fontWeight: 800 }}>LECTURE HALL 402 · ACTIVE SESSION</span>
                        <span style={{ color: '#16b8e8', fontFamily: 'var(--aied-font-mono)' }}>LIVE SYNC: 42 LEARNERS</span>
                      </div>
                      <div className="aied-smartboard-split">
                        <div className="aied-smartboard-qr-box">
                          <div className="aied-smartboard-qr-placeholder">
                            <span>[ DYNAMIC ROLL CALL QR ]</span>
                          </div>
                          <span style={{ fontSize: '0.64rem', color: '#8b9ab0' }}>Scan via Student Mobile App</span>
                        </div>
                        <div className="aied-smartboard-quiz-box">
                          <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Live Micro-Assessment</div>
                          <div style={{ fontSize: '0.7rem', color: '#00b87a' }}>38/42 Submitted · Avg Time: 45s</div>
                          <div className="aied-smartboard-progress">
                            <div className="aied-smartboard-progress-fill"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Direct Action & Tech Strip */}
          <div className="aied-device-footer">
            <div className="aied-device-features-strip">
              {activeDevice.features.map((feat, fIdx) => (
                <span key={fIdx} className="aied-device-feat-chip">
                  <CheckCircle2 size={11} className="text-emerald-400" />
                  <span>{feat}</span>
                </span>
              ))}
            </div>
            <a
              href={activeDevice.url}
              target="_blank"
              rel="noopener noreferrer"
              className="aied-btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.78rem' }}
            >
              <span>Launch Live Interface</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
