import React from 'react';
import { motion } from 'framer-motion';
import AnimatedProblemChaos from './AnimatedProblemChaos';
import AnimatedSolutionEngine from './AnimatedSolutionEngine';

export default function AboutUwoConnect() {
  return (
    <section className="uwoc-section uwoc-about-section" id="about">
      <div className="uwoc-container">
        {/* Section Header */}
        <motion.div
          className="uwoc-section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className="uwoc-eyebrow">
            <span className="uwoc-pill-dot" />
            <span>About UWO Connect</span>
          </div>

          <h2 className="uwoc-section-title">
            From Fragmented Chats. <br />
            <span className="uwoc-highlight">To Automated Growth.</span>
          </h2>
        </motion.div>

        {/* 2-Column Comparison with Interactive Animated Motion Systems (Zero Static Images) */}
        <div className="uwoc-about-grid">
          {/* Left: The Problem - Live Animated Motion Stage */}
          <motion.div
            className="uwoc-about-col uwoc-about-visual-col"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <div className="uwoc-about-badge-tag challenge">
              <span>The Problem</span>
            </div>

            <h3 className="uwoc-about-h3">
              Fragmented apps slow down your sales.
            </h3>

            {/* Live Animated Problem Chaos Object (Vector/SVG/Framer Motion) */}
            <AnimatedProblemChaos />
          </motion.div>

          {/* Right: The Solution - Live Animated Motion Stage */}
          <motion.div
            className="uwoc-about-col uwoc-about-visual-col"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <div className="uwoc-about-badge-tag solution">
              <span>The Solution</span>
            </div>

            <h3 className="uwoc-about-h3">
              One intelligent operating system for growth.
            </h3>

            {/* Live Animated Solution Growth Engine (Vector/SVG/Framer Motion) */}
            <AnimatedSolutionEngine />
          </motion.div>
        </div>

        {/* Animated Visual Metaphor: From Fragmented Chats to Automated Growth */}
        <motion.div
          className="uwoc-about-metaphor-strip"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Node 1: Fragmented Inputs */}
          <div className="uwoc-metaphor-node node-inputs">
            <div className="uwoc-metaphor-icon-stack">
              <span className="stack-token token-wa" title="WhatsApp Business">
                <i className="fa-brands fa-whatsapp"></i>
              </span>
              <span className="stack-token token-ig" title="Instagram Direct">
                <i className="fa-brands fa-instagram"></i>
              </span>
              <span className="stack-token token-fb" title="Facebook Messenger">
                <i className="fa-brands fa-facebook-messenger"></i>
              </span>
              <span className="stack-token token-mail" title="Gmail Inbound">
                <i className="fa-solid fa-envelope"></i>
              </span>
            </div>
            <div className="uwoc-metaphor-text">
              <span className="metaphor-label">Fragmented Inbound</span>
              <span className="metaphor-sub">Customer chats across 4+ apps</span>
            </div>
          </div>

          {/* Connecting Animated Energy Conduit 1 */}
          <div className="uwoc-metaphor-conduit">
            <svg className="uwoc-conduit-svg" viewBox="0 0 160 20" fill="none">
              <line x1="0" y1="10" x2="160" y2="10" stroke="rgba(11, 143, 120, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="80" cy="10" r="3.5" fill="#0B8F78" className="uwoc-conduit-beam" />
            </svg>
          </div>

          {/* Center Node: UWO Connect Logo */}
          <div className="uwoc-metaphor-node node-core">
            <div className="uwoc-core-orb">
              <div className="uwoc-core-ring ring-spin" />
              <div className="uwoc-core-glow-center">
                <img
                  src="/images/uwoconnect/uwoconnectlogo.png"
                  alt="UWO Connect Logo"
                  className="uwoc-core-logo-icon"
                />
              </div>
            </div>
            <div className="uwoc-metaphor-text">
              <div className="uwoc-hub-logo-wrap">
                <img
                  src="/images/uwoconnect/uwoconnectlogo.png"
                  alt="UWO Connect"
                  className="uwoc-hub-brand-logo"
                />
              </div>
              <span className="metaphor-sub">AI Copilot &amp; Smart Routing</span>
            </div>
          </div>

          {/* Connecting Animated Energy Conduit 2 */}
          <div className="uwoc-metaphor-conduit">
            <svg className="uwoc-conduit-svg" viewBox="0 0 160 20" fill="none">
              <line x1="0" y1="10" x2="160" y2="10" stroke="rgba(11, 143, 120, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="80" cy="10" r="3.5" fill="#10B981" className="uwoc-conduit-beam beam-reverse" />
            </svg>
          </div>

          {/* Node 3: Automated Revenue & Growth */}
          <div className="uwoc-metaphor-node node-outputs">
            <div className="uwoc-metaphor-icon-stack">
              <span className="stack-token token-crm" title="CRM Pipeline Sync">
                <i className="fa-solid fa-chart-line"></i>
              </span>
              <span className="stack-token token-quote" title="Dynamic GST Quote">
                <i className="fa-solid fa-file-invoice"></i>
              </span>
              <span className="stack-token token-pay" title="Instant UPI Checkout">
                <i className="fa-solid fa-receipt"></i>
              </span>
              <span className="stack-token token-done" title="Closed Deal">
                <i className="fa-solid fa-circle-check"></i>
              </span>
            </div>
            <div className="uwoc-metaphor-text">
              <span className="metaphor-label">Automated Growth</span>
              <span className="metaphor-sub">Quotes, CRM deals &amp; paid orders</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
