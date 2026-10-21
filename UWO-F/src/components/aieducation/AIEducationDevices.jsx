import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, Smartphone, Globe, ExternalLink, 
  CheckCircle2, ShieldCheck, Zap, ArrowRight, Laptop
} from 'lucide-react';

const DEVICES = [
  {
    id: 'web',
    name: 'Web Application',
    sub: 'Desktop & Smartboards',
    icon: Laptop,
    badge: 'Desktop & Interactive Boards',
    headline: 'High-density institutional administration, timetable solver, and teacher grading.',
    specs: [
      'Multi-tab institutional administration and roster management',
      'Tally ERP 9 / Prime direct XML ledger sync',
      'Classroom smartboard dynamic roll-call QR display'
    ],
    actionText: 'Launch Live Web Portal',
    url: 'https://education.uwo24.com'
  },
  {
    id: 'android',
    name: 'Android Mobile App',
    sub: 'Phones & Tablets',
    icon: Smartphone,
    badge: 'Google Play Store',
    headline: 'Fast, offline-ready student study companion and instant faculty proxy dispatch.',
    specs: [
      'Bilingual support (English & Hindi Devanagari)',
      'Low-bandwidth offline textbook and quiz caching',
      'Real-time push notifications for period attendance & leaves'
    ],
    actionText: 'Get Android App',
    url: 'https://education.uwo24.com'
  },
  {
    id: 'ios',
    name: 'iOS Mobile App',
    sub: 'iPhone & iPad',
    icon: Smartphone,
    badge: 'Apple App Store',
    headline: 'Secure, native iOS experience with biometric authentication and Apple Push alerts.',
    specs: [
      'Native FaceID & TouchID biometric quick-unlock',
      'Optimized for iPad split-view study sessions',
      'Multi-child guardian switcher with digital report card viewing'
    ],
    actionText: 'Get iOS App',
    url: 'https://education.uwo24.com'
  }
];

export default function AIEducationDevices() {
  const [activeDevIdx, setActiveDevIdx] = useState(0);
  const activeDev = DEVICES[activeDevIdx];
  const DevIcon = activeDev.icon;

  return (
    <section className="aied-section-devices" id="devices-section">
      <div className="aied-container">
        
        {/* Short, Punchy Section Header */}
        <div className="aied-section-header">
          <div className="aied-section-eyebrow">
            <Globe size={13} />
            <span>Cross-Platform</span>
          </div>
          <h2 className="aied-section-title">
            Available on <span className="accent">Every Device.</span>
          </h2>
          <p className="aied-section-subtitle">
            Seamless real-time synchronization across Web, Android, and iOS.
          </p>
        </div>

        {/* 3-Device Dock Selector */}
        <div className="aied-device-dock">
          {DEVICES.map((d, idx) => {
            const Icon = d.icon;
            const isSelected = activeDevIdx === idx;
            return (
              <button
                key={d.id}
                type="button"
                className={`aied-dock-tab ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveDevIdx(idx)}
              >
                <Icon size={16} />
                <div className="aied-dock-tab-info">
                  <span className="aied-dock-name">{d.name}</span>
                  <span className="aied-dock-sub">{d.sub}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Device Stage Exhibit */}
        <div className="aied-device-stage-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDev.id}
              className="aied-device-content-row"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.28 }}
            >
              {/* Left Column: Device Info & Specs */}
              <div className="aied-device-left">
                <div className="aied-device-badge">
                  <DevIcon size={14} />
                  <span>{activeDev.badge}</span>
                </div>

                <h3 className="aied-device-headline">{activeDev.headline}</h3>

                <div className="aied-device-specs-list">
                  {activeDev.specs.map((sp, sIdx) => (
                    <div key={sIdx} className="aied-device-spec-item">
                      <CheckCircle2 size={15} style={{ color: 'var(--aied-indigo)', flexShrink: 0 }} />
                      <span>{sp}</span>
                    </div>
                  ))}
                </div>

                <div className="aied-device-actions">
                  <a
                    href={activeDev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aied-btn-primary"
                  >
                    <span>{activeDev.actionText}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Right Column: Live Mockup Frame */}
              <div className="aied-device-mock-box">
                <div className="aied-device-chrome-head">
                  <div className="aied-chrome-dots">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <span className="aied-chrome-url">https://education.uwo24.com</span>
                  <span className="aied-chrome-status">● Live Active</span>
                </div>

                <div className="aied-device-mock-interior">
                  <div className="aied-mock-badge-strip">
                    <span className="mock-tag">AI Education™ Platform</span>
                    <span className="mock-role">Active Session: Verified</span>
                  </div>

                  <div className="aied-mock-kpi-grid">
                    <div className="aied-mock-kpi">
                      <span className="lbl">Active Institution</span>
                      <span className="val">UWO Campus OS</span>
                    </div>
                    <div className="aied-mock-kpi">
                      <span className="lbl">Sync Protocol</span>
                      <span className="val" style={{ color: '#10B981' }}>Real-Time WebSocket</span>
                    </div>
                  </div>

                  <div className="aied-mock-security-banner">
                    <ShieldCheck size={14} style={{ color: 'var(--aied-indigo)' }} />
                    <span>CASA Tier-2 Certified · Zero PII Retention</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
