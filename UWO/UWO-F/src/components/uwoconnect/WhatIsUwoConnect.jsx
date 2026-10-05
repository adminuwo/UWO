import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, fadeLeft, fadeRight, staggerContainer, EASE_PREMIUM } from './motionVariants';

export default function WhatIsUwoConnect() {
  const [activeNode, setActiveNode] = useState(null);

  const inputs = [
    { id: 'wa', label: 'WhatsApp API', icon: 'fa-brands fa-whatsapp', color: '#25D366' },
    { id: 'ig', label: 'Instagram Direct', icon: 'fa-brands fa-instagram', color: '#E4405F' },
    { id: 'fb', label: 'Facebook Messenger', icon: 'fa-brands fa-facebook-messenger', color: '#0084FF' },
    { id: 'gmail', label: 'Gmail & Outlook', icon: 'fa-solid fa-envelope', color: '#EA4335' },
    { id: 'sheets', label: 'Sheets & ERP', icon: 'fa-solid fa-table-cells', color: '#0F9D58' },
  ];

  const outputs = [
    { id: 'inbox', label: 'Unified Inbox', icon: 'fa-solid fa-inbox' },
    { id: 'crm', label: 'Industrial CRM', icon: 'fa-solid fa-chart-pie' },
    { id: 'auto', label: 'AI Automation', icon: 'fa-solid fa-wand-magic-sparkles' },
    { id: 'quote', label: 'Quotation Engine', icon: 'fa-solid fa-file-contract' },
    { id: 'invoice', label: 'GST Invoicing', icon: 'fa-solid fa-file-invoice-dollar' },
    { id: 'pay', label: 'Instant UPI Pay', icon: 'fa-solid fa-credit-card' },
    { id: 'analytics', label: 'Live Analytics', icon: 'fa-solid fa-chart-line' },
    { id: 'docs', label: 'Cloud Storage', icon: 'fa-solid fa-cloud-arrow-up' },
  ];

  const highlights = [
    {
      title: 'Unified Influx Engine',
      desc: 'Every inquiry from WhatsApp, Instagram, Facebook, and email converges into one queue.',
    },
    {
      title: 'Autonomous Action Triggers',
      desc: 'Incoming messages automatically qualify leads, draft quotations, and log transactions.',
    },
    {
      title: 'Zero Operational Leakage',
      desc: 'No forgotten customer inquiries, zero missed follow-ups, and complete team transparency.',
    },
  ];

  return (
    <section className="uwoc-section" id="what-is-connect">
      <div className="uwoc-container">
        <div className="uwoc-what-grid">
          {/* LEFT: EDITORIAL COPY WITH FADE LEFT & STAGGERED CHECKLIST */}
          <motion.div
            className="uwoc-what-copy"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeLeft}
          >
            <div className="uwoc-eyebrow">
              <i className="fa-solid fa-layer-group"></i>
              <span>ARCHITECTURAL INTELLIGENCE</span>
            </div>

            <h2 className="uwoc-section-title">
              Meet <span className="uwoc-gradient-gold">UWO Connect™.</span>
            </h2>

            <p className="uwoc-editorial-lead">
              UWO Connect is a unified business communication and automation platform designed to help modern enterprises manage customer conversations, leads, teams, documents and workflows from one central workspace.
            </p>

            <p className="uwoc-editorial-text">
              Instead of switching between disconnected browser tabs, spreadsheets, standalone CRM apps, and manual accounting tools, UWO Connect links every customer interaction directly to your business logic, inventory, and revenue engine.
            </p>

            <motion.div 
              className="uwoc-what-highlights"
              variants={staggerContainer(0.12, 0.15)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {highlights.map((item, idx) => (
                <motion.div 
                  className="uwoc-highlight-item"
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ x: 4, transition: { duration: 0.25, ease: EASE_PREMIUM } }}
                >
                  <div className="uwoc-check-bullet"><i className="fa-solid fa-check"></i></div>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.desc}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT: INTERACTIVE ARCHITECTURAL TOPOLOGY DIAGRAM */}
          <motion.div
            className="uwoc-architecture-diagram"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeRight}
          >
            <div className="uwoc-diagram-card">
              <div className="uwoc-diagram-header">
                <span>Data Flow Topology</span>
                <span className="uwoc-tag-live"><span className="pulse-dot" /> Real-time Streaming</span>
              </div>

              <div className="uwoc-flow-canvas">
                {/* INFLOW CHANNELS WITH STAGGERED ENTRANCE */}
                <motion.div 
                  className="uwoc-flow-column inflow"
                  variants={staggerContainer(0.08, 0.1)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <span className="uwoc-col-title">Inbound Channels</span>
                  {inputs.map((inp) => (
                    <motion.div
                      key={inp.id}
                      className={`uwoc-node-chip ${activeNode === inp.id ? 'active' : ''}`}
                      variants={fadeUp}
                      whileHover={{ x: 5, scale: 1.02, transition: { duration: 0.2 } }}
                      onMouseEnter={() => setActiveNode(inp.id)}
                      onMouseLeave={() => setActiveNode(null)}
                    >
                      <i className={inp.icon} style={{ color: inp.color }}></i>
                      <span>{inp.label}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CENTRAL CORE ENGINE WITH BREATHING PULSE GLOW */}
                <div className="uwoc-flow-center">
                  <motion.div 
                    className="uwoc-central-core"
                    animate={{
                      scale: activeNode ? [1, 1.1, 1] : [1, 1.05, 1],
                      filter: activeNode 
                        ? ['drop-shadow(0 0 16px rgba(11,143,120,0.45))', 'drop-shadow(0 0 28px rgba(11,143,120,0.85))', 'drop-shadow(0 0 16px rgba(11,143,120,0.45))']
                        : ['drop-shadow(0 0 10px rgba(11,143,120,0.25))', 'drop-shadow(0 0 22px rgba(11,143,120,0.55))', 'drop-shadow(0 0 10px rgba(11,143,120,0.25))']
                    }}
                    transition={{
                      duration: activeNode ? 2.2 : 3.6,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    <img
                      src="/images/uwoconnectlogo.png"
                      alt="UWO Connect Logo"
                      className="uwoc-core-logo-img"
                      onError={(e) => {
                        e.currentTarget.src = '/images/uwoconnect/uwoconnectlogo.png';
                      }}
                    />
                  </motion.div>
                </div>

                {/* OUTFLOW BUSINESS MODULES WITH STAGGERED ENTRANCE */}
                <motion.div 
                  className="uwoc-flow-column outflow"
                  variants={staggerContainer(0.06, 0.15)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <span className="uwoc-col-title">Business Execution</span>
                  {outputs.map((out) => (
                    <motion.div
                      key={out.id}
                      className={`uwoc-node-chip mini ${activeNode === out.id ? 'active' : ''}`}
                      variants={fadeUp}
                      whileHover={{ x: 5, scale: 1.02, transition: { duration: 0.2 } }}
                      onMouseEnter={() => setActiveNode(out.id)}
                      onMouseLeave={() => setActiveNode(null)}
                    >
                      <i className={out.icon}></i>
                      <span>{out.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="uwoc-diagram-caption">
                <i className="fa-solid fa-circle-info"></i>
                <span>Hover over any channel or module to preview real-time automated data synchronization.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
