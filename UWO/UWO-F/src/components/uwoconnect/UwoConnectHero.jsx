import React from 'react';
import { motion } from 'framer-motion';
import { UWO_CONNECT_WEB_URL, UWO_CONNECT_ANDROID_URL } from '../../constants/uwoConnectConstants';

export default function UwoConnectHero() {
  return (
    <section className="uwoc-hero" id="hero">
      <div className="uwoc-hero-bg-glow" aria-hidden="true" />
      <div className="uwoc-hero-pattern" aria-hidden="true" />

      <div className="uwoc-container">
        <div className="uwoc-hero-layout">
          {/* Left: Content */}
          <motion.div
            className="uwoc-hero-content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="uwoc-eyebrow">
              <span className="uwoc-pill-dot" />
              <span>Unified Communication &amp; Business Automation</span>
            </div>

            <h1 className="uwoc-hero-title">
              Connect Everything. <br />
              <span className="uwoc-highlight">Automate Anything.</span>
            </h1>

            <p className="uwoc-hero-desc">
              UWO Connect brings your communication channels, business tools, and automation into one intelligent workspace.
            </p>

            <div className="uwoc-hero-actions">
              <a
                href={UWO_CONNECT_WEB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="uwoc-btn-primary"
              >
                <i className="fa-solid fa-globe"></i>
                <span>Launch Web App</span>
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>

              <a
                href={UWO_CONNECT_ANDROID_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="uwoc-btn-secondary"
              >
                <i className="fa-brands fa-google-play text-emerald"></i>
                <span>Download Android App</span>
              </a>

              <a href="#channels" className="uwoc-btn-ghost">
                <span>Learn More</span>
                <i className="fa-solid fa-arrow-down"></i>
              </a>
            </div>

            {/* Subtle trust highlights */}
            <div className="uwoc-hero-badges">
              <div className="uwoc-hero-badge-item">
                <i className="fa-brands fa-whatsapp text-emerald"></i>
                <span>Official Meta Cloud API</span>
              </div>
              <div className="uwoc-hero-badge-dot">•</div>
              <div className="uwoc-hero-badge-item">
                <i className="fa-solid fa-bolt text-emerald"></i>
                <span>24/7 AI Auto-Replies</span>
              </div>
              <div className="uwoc-hero-badge-dot">•</div>
              <div className="uwoc-hero-badge-item">
                <i className="fa-solid fa-shield-halved text-emerald"></i>
                <span>Zero-Code Setup</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Clean Green-and-White Visual Composition with Animated Motion Objects */}
          <motion.div
            className="uwoc-hero-visual"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="uwoc-visual-glow" aria-hidden="true" />

            <div className="uwoc-visual-frame">
              {/* Animated Geometric Orbital Rings & Energy Particles */}
              <div className="uwoc-hero-orbits" aria-hidden="true">
                <div className="uwoc-orbit-circle orbit-outer">
                  <span className="uwoc-satellite-dot dot-1" />
                </div>
                <div className="uwoc-orbit-circle orbit-inner">
                  <span className="uwoc-satellite-dot dot-2" />
                </div>

                {/* SVG Connecting Synapse Line between Dev & Abha */}
                <svg className="uwoc-hero-synapse-svg" viewBox="0 0 380 120" fill="none">
                  <path
                    d="M 90 60 Q 190 20, 290 60"
                    stroke="rgba(11, 143, 120, 0.28)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <circle cx="190" cy="40" r="4" fill="#0B8F78" className="uwoc-synapse-pulse" />
                </svg>
              </div>

              {/* Product preview / Intelligence team from reference site */}
              <div className="uwoc-visual-characters">
                <motion.div
                  className="uwoc-char-wrap char-dev"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <img
                    src="/images/uwoconnect/Dev_transparent.png"
                    alt="Dev — Connector Intelligence"
                    className="uwoc-char-img"
                  />
                  <div className="uwoc-char-caption">
                    <span className="uwoc-char-name">DEV</span>
                    <span className="uwoc-char-role">Connectors &amp; Data</span>
                  </div>
                </motion.div>

                <motion.div
                  className="uwoc-char-wrap char-abha"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                >
                  <img
                    src="/images/uwoconnect/Abha_transparent.png"
                    alt="Abha — Automation Intelligence"
                    className="uwoc-char-img"
                  />
                  <div className="uwoc-char-caption">
                    <span className="uwoc-char-name">ABHA</span>
                    <span className="uwoc-char-role">AI &amp; Workflows</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
