import React from 'react';
import { motion } from 'framer-motion';
import { AI_LEGAL_WEB_URL } from '../../constants/aiLegalConstants';
import { fadeUp, btnMotion, EASE_PREMIUM } from './motionVariants';

export default function FinalCTA({ onExploreClick, onDownloadClick }) {
  return (
    <section className="al-final-cta-section" id="get-started">
      <div className="ai-legal-container">
        <motion.div
          className="al-final-cta-box"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
        >
          {/* Subtle Ambient Gold Light Drift */}
          <div className="al-cta-ambient-glow" aria-hidden="true"></div>

          {/* Animated Border Light Sweep */}
          <div className="al-cta-border-shimmer" aria-hidden="true"></div>

          <motion.span
            className="al-final-cta-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_PREMIUM }}
          >
            Next-Generation Legal Technology
          </motion.span>

          <motion.h2
            className="al-final-cta-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.95, delay: 0.18, ease: EASE_PREMIUM }}
          >
            Experience the Future of <span className="al-gold-text">Legal Intelligence.</span>
          </motion.h2>

          <motion.p
            className="al-final-cta-sub"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.95, delay: 0.32, ease: EASE_PREMIUM }}
          >
            Research. Analyze. Draft. Manage. Connect.
          </motion.p>

          <motion.div
            className="al-final-cta-actions"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.48, ease: EASE_PREMIUM }}
          >
            <motion.button
              type="button"
              className="al-btn al-btn-primary"
              onClick={onExploreClick}
              aria-label="Explore AI Legal Core Capabilities"
              whileHover={btnMotion.hover}
              whileTap={btnMotion.tap}
            >
              <i className="fa-solid fa-compass"></i>
              <span>Explore AI LEGAL™</span>
            </motion.button>

            <motion.a
              href={AI_LEGAL_WEB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="al-btn al-btn-secondary"
              aria-label="Open AI Legal Web Application"
              whileHover={btnMotion.hover}
              whileTap={btnMotion.tap}
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
              <span>Open Web App</span>
            </motion.a>

            <motion.button
              type="button"
              className="al-btn al-btn-outline-gold"
              onClick={onDownloadClick}
              aria-label="Download AI Legal Mobile Applications"
              whileHover={btnMotion.hover}
              whileTap={btnMotion.tap}
            >
              <i className="fa-solid fa-mobile-screen"></i>
              <span>Download the App</span>
            </motion.button>
          </motion.div>

          <motion.div
            className="al-final-brand-tag"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.65 }}
          >
            AI LEGAL™ by <span>UWO™</span>
          </motion.div>

          {/* Mandatory Legal Disclaimer */}
          <div className="al-legal-disclaimer-card">
            <p>
              <strong>Legal Disclaimer:</strong> AI LEGAL™ provides AI-assisted legal information and workflow support. It is designed to assist legal professionals and does not replace professional legal judgment or constitute legal advice.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
