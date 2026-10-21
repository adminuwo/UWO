import React from 'react';
import { motion } from 'framer-motion';
import { AI_LEGAL_WEB_URL } from '../../constants/aiLegalConstants';
import { fadeUp, EASE_PREMIUM } from './motionVariants';

export default function AiLegalHero({ onExploreClick, onDownloadClick }) {
  return (
    <section className="al-hero-section al-hero-fullscreen" id="hero">
      {/* Background Lifestyle Image on Right with Seamless Left & Bottom Gradients */}
      <div className="al-hero-bg-visual" aria-hidden="true">
        <img 
          src="/images/aarohi_chamber_banner.jpg" 
          alt="AI LEGAL Chamber Advocate" 
          className="al-hero-bg-img"
        />
        <div className="al-hero-bg-overlay-left" />
        <div className="al-hero-bg-overlay-bottom" />
      </div>

      <div className="al-container ai-legal-container">
        <div className="al-hero-content-wrapper">
          <motion.div
            className="al-hero-text-block"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {/* Main Title */}
            <h1 className="al-hero-title">
              <span>Smarter Practice.</span>
              <span className="al-gradient-gold">Faster Justice.</span>
            </h1>

            {/* Lead Description */}
            <p className="al-hero-lead">
              Replace fragmented tools with a single AI-powered platform that centralizes cases, compliances, communication, and decision-making.
            </p>

            {/* Bold Sub-headline */}
            <h2 className="al-hero-subheading">
              All-in-one legal case management &amp; litigation software for India
            </h2>

            {/* Detailed Feature Summary */}
            <p className="al-hero-desc">
              Track cases across the Supreme Court, High Courts, District Courts and 8,200+ courts and tribunals. Automate cause lists and hearing alerts. Research 3.8 crore+ judgments with AI. Built for Indian advocates, law firms and in-house teams.
            </p>

            {/* Clean Action Buttons */}
            <div className="al-hero-actions">
              <motion.a
                href={AI_LEGAL_WEB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="al-btn al-btn-gold-action"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: EASE_PREMIUM }}
              >
                <span>Start Free Trial</span>
                <i className="fa-solid fa-chevron-right"></i>
              </motion.a>

              <motion.button
                type="button"
                className="al-btn al-btn-white-action"
                onClick={onDownloadClick}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: EASE_PREMIUM }}
              >
                <i className="fa-solid fa-mobile-screen"></i>
                <span>Download App</span>
              </motion.button>
            </div>

            {/* Trust Checks Line */}
            <div className="al-hero-trust-row">
              <div className="al-trust-item">
                <i className="fa-regular fa-circle-check text-gold"></i>
                <span>Free Trial Included</span>
              </div>
              <span className="al-trust-dot">•</span>
              <div className="al-trust-item">
                <span>No Credit Card Required</span>
              </div>
              <span className="al-trust-dot">•</span>
              <div className="al-trust-item">
                <span>Instant Setup</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
