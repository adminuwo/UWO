import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, EASE_PREMIUM } from './motionVariants';

export default function ProductShowcase() {
  const [activeShowcase, setActiveShowcase] = useState('workspace');

  const showcaseViews = [
    {
      id: 'workspace',
      label: 'Case Intelligence Workspace',
      icon: 'fa-briefcase',
      image: '/images/ai-legal-workspace-real.png',
      caption: 'Matter #CIV-2026-00154 — Rajesh Yadav vs Aryan Sharma (Client: Ayush Dubey)',
    },
    {
      id: 'draft',
      label: 'AI Draft Maker',
      icon: 'fa-file-lines',
      image: '/images/ai-legal-draft-maker-real.png',
      caption: 'Step 1 — Choose Legal Template (Legal Notice, Demand Notice, Eviction Notice)',
    },
    {
      id: 'courtroom',
      label: 'AI Mock Courtroom',
      icon: 'fa-gavel',
      image: '/images/ai-legal-courtroom-real.png',
      caption: 'Configure Simulated Courtroom Hearing — Voice Hearing & Text Hearing Modes',
    },
  ];

  const currentView = showcaseViews.find((v) => v.id === activeShowcase) || showcaseViews[0];

  return (
    <section className="al-showcase-section" id="showcase">
      <div className="ai-legal-container">
        {/* Section Header */}
        <motion.div
          className="al-section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="al-eyebrow">
            <i className="fa-solid fa-desktop"></i>
            <span>Verified Interface Preview</span>
          </div>

          <h2 className="al-section-title">
            Built for the Way Legal <span className="al-gold-text">Professionals Work.</span>
          </h2>

          <p className="al-section-subtitle">
            An uncompromising, clean user interface designed for precision, effortless navigation, high focus, and zero cognitive fatigue.
          </p>
        </motion.div>

        {/* Tab Switcher with layoutId Glider */}
        <div className="al-showcase-tabs" role="tablist" aria-label="Product Showcase Views">
          {showcaseViews.map((view) => {
            const isActive = activeShowcase === view.id;
            return (
              <button
                key={view.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`al-showcase-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveShowcase(view.id)}
                style={{ position: 'relative' }}
              >
                {isActive && (
                  <motion.div
                    className="al-showcase-tab-glider"
                    layoutId="showcaseActiveTabGlider"
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <i className={`fa-solid ${view.icon}`}></i>
                  <span>{view.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Browser Frame Window */}
        <motion.div
          className="al-showcase-browser-frame"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="al-mockup-topbar">
            <div className="al-mockup-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="al-mockup-address">
              <i className="fa-solid fa-lock"></i>
              <span>{currentView.caption}</span>
            </div>
            <span className="al-verified-platform-tag">
              UWO™ VERIFIED
            </span>
          </div>

          <div className="al-showcase-img-wrap" style={{ cursor: 'default' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView.id}
                className="al-showcase-img-inner"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.55, ease: EASE_PREMIUM }}
                style={{ position: 'relative', display: 'inline-block' }}
              >
                <img
                  src={currentView.image}
                  alt={currentView.label}
                  loading="lazy"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
