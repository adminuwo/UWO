import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ECOSYSTEM_NODES } from '../../constants/aiLegalConstants';
import { fadeUp, EASE_PREMIUM } from './motionVariants';

export default function EcosystemSection() {
  const [selectedNode, setSelectedNode] = useState(ECOSYSTEM_NODES[0]);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  const activeNode = hoveredNodeId 
    ? ECOSYSTEM_NODES.find(n => n.id === hoveredNodeId) || selectedNode 
    : selectedNode;

  return (
    <section className="al-ecosystem-section" id="ecosystem">
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
            <i className="fa-solid fa-network-wired"></i>
            <span>Interconnected Legal OS</span>
          </div>

          <h2 className="al-section-title">
            One Platform. <span className="al-gold-text">Complete Legal Intelligence.</span>
          </h2>

          <p className="al-section-subtitle">
            An interconnected legal operating system where research feeds drafting, evidence drives arguments, and case memory powers every courtroom interaction.
          </p>
        </motion.div>

        {/* Central Hub Display Banner with Breathing Rings & Live Status */}
        <motion.div
          className="al-central-hub-box"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
        >
          {/* Animated Ambient Pulse Background */}
          <div className="al-hub-ambient-pulse" aria-hidden="true"></div>

          <div className="al-central-hub-title">
            <div className="al-central-hub-logo-wrap">
              <motion.div
                className="al-central-hub-ring"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.25, 0.65, 0.25],
                }}
                transition={{
                  duration: 5.5, // Relaxed breathing pace
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <div className="al-central-hub-logo">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="al-hub-live-dot"></span>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--al-gold)', fontWeight: '700' }}>
                  Live Neural Bus Active
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>AI LEGAL™ Operating Core</h3>

              {/* Dynamic node detail with AnimatePresence */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeNode.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.45, ease: EASE_PREMIUM }}
                  style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--al-text-sub)' }}
                >
                  Active Pipeline Node: <strong style={{ color: 'var(--al-gold)' }}>{activeNode.title}</strong> — {activeNode.category}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <div className="al-central-hub-stats">
            <div className="al-hub-stat-item">
              <div className="al-hub-stat-num">
                <span>8</span> Modules
              </div>
              <div className="al-hub-stat-lbl">Connected Core</div>
            </div>
            <div className="al-hub-stat-item">
              <div className="al-hub-stat-num">
                <span className="al-sync-indicator"></span> 100% Shared
              </div>
              <div className="al-hub-stat-lbl">Context Sync</div>
            </div>
            <div className="al-hub-stat-item">
              <div className="al-hub-stat-num">Multi-Court</div>
              <div className="al-hub-stat-lbl">Compliance</div>
            </div>
          </div>
        </motion.div>

        {/* 8-Node Matrix with Staggered Entrance & Interactive Pulse */}
        <motion.div
          className="al-ecosystem-matrix"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.13, delayChildren: 0.1 },
            },
          }}
        >
          {ECOSYSTEM_NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isActive = isSelected || isHovered;

            return (
              <motion.div
                key={node.id}
                className={`al-ecosystem-card ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedNode(node)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.3, ease: EASE_PREMIUM } }}
                whileTap={{ scale: 0.98 }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setSelectedNode(node);
                }}
                aria-pressed={isActive}
              >
                {/* Active Data Stream Glow Line */}
                {isActive && (
                  <motion.div
                    className="al-eco-active-glow-bar"
                    layoutId="ecoGlowBar"
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                  />
                )}

                <div className="al-eco-card-top">
                  <motion.div
                    className="al-eco-icon"
                    animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={{ duration: 0.6, ease: EASE_PREMIUM }}
                  >
                    <i className={`fa-solid ${node.icon}`}></i>
                  </motion.div>
                  <span className="al-eco-badge">{node.badge}</span>
                </div>

                <h3>{node.title}</h3>
                <p>{node.description}</p>

                {/* Data Packet Pulse on Active */}
                {isActive && (
                  <div className="al-eco-packet-stream">
                    <span className="al-eco-packet-dot"></span>
                    <span className="al-eco-stream-text">Syncing Context...</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
