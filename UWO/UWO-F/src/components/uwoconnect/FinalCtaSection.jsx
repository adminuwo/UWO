import React from 'react';
import { motion } from 'framer-motion';
import { UWO_CONNECT_WEB_URL, UWO_CONNECT_ANDROID_URL } from '../../constants/uwoConnectConstants';

export default function FinalCtaSection() {
  return (
    <section className="uwoc-section uwoc-final-cta-section" id="cta">
      <div className="uwoc-cta-glow-mesh" aria-hidden="true" />
      <div className="uwoc-cta-ambient-orbit" aria-hidden="true">
        <div className="uwoc-cta-ring-1" />
        <div className="uwoc-cta-ring-2" />
      </div>

      <div className="uwoc-container">
        <motion.div
          className="uwoc-final-cta-box"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
        >
          <div className="uwoc-eyebrow">
            <span className="uwoc-pill-dot" />
            <span>Discover The Full Platform</span>
          </div>

          <h2 className="uwoc-final-title">
            Ready To Scale? <br />
            <span className="uwoc-highlight">Start With UWO Connect.</span>
          </h2>

          <p className="uwoc-final-subtitle">
            Unify your customer communication channels, automate repetitive tasks with AI, and scale your sales pipeline with zero friction.
          </p>

          <div className="uwoc-final-actions">
            <a
              href={UWO_CONNECT_WEB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="uwoc-btn-primary uwoc-btn-lg"
            >
              <i className="fa-solid fa-globe"></i>
              <span>Launch Web Platform</span>
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>

            <a
              href={UWO_CONNECT_ANDROID_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="uwoc-btn-secondary uwoc-btn-lg"
            >
              <i className="fa-brands fa-google-play text-emerald"></i>
              <span>Download Android App</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
