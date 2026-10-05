import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROLES_DATA } from '../../constants/uwoConnectConstants';
import { fadeUp, EASE_PREMIUM } from './motionVariants';

const chainContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const nodeVariants = {
  hidden: { opacity: 0, x: 12 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.45, ease: EASE_PREMIUM } 
  },
};

export default function RolesExplorer() {
  const [activeRoleId, setActiveRoleId] = useState('owner');
  const activeRole = ROLES_DATA.find((r) => r.id === activeRoleId) || ROLES_DATA[0];

  return (
    <section className="uwoc-section uwoc-bg-contrast" id="roles">
      <div className="uwoc-container">
        {/* Section Header */}
        <motion.div
          className="uwoc-section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="uwoc-eyebrow">
            <i className="fa-solid fa-users-gear"></i>
            <span>MULTI-STAKEHOLDER ARCHITECTURE</span>
          </div>

          <h2 className="uwoc-section-title">
            Built for <span className="uwoc-gradient-gold">Every Role.</span>
          </h2>

          <p className="uwoc-section-subtitle">
            Whether steering business revenue, closing mid-market deals, executing marketing broadcasts, or managing client workspaces — UWO Connect adapts to your daily mission.
          </p>
        </motion.div>

        {/* ROLE NAVIGATION TABS WITH SPRING ACTIVE GLIDER */}
        <div className="uwoc-roles-tab-bar" role="tablist" aria-label="Stakeholder Roles">
          {ROLES_DATA.map((role) => {
            const isActive = role.id === activeRoleId;
            return (
              <button
                key={role.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`uwoc-role-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveRoleId(role.id)}
                style={{ position: 'relative' }}
              >
                {isActive && (
                  <motion.div
                    className="uwoc-role-tab-glider"
                    layoutId="uwocRoleActiveTabGlider"
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'var(--uwoc-primary)',
                      borderRadius: 'var(--uwoc-radius-md)',
                      zIndex: 1,
                    }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <i className={role.icon}></i>
                  <span>{role.title}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE ROLE DETAIL CARD WITH RICH ANIMATION */}
        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole.id}
              className="uwoc-role-showcase-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: EASE_PREMIUM }}
            >
              <div className="uwoc-role-card-grid">
                {/* LEFT: ROLE NEEDS & HOW CONNECT HELPS */}
                <div className="uwoc-role-left">
                  <div className="uwoc-role-badge-row">
                    <motion.div 
                      className="uwoc-role-icon-box"
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 0.6, ease: EASE_PREMIUM }}
                    >
                      <i className={activeRole.icon}></i>
                    </motion.div>
                    <div>
                      <h3>{activeRole.title}</h3>
                      <span className="uwoc-role-sub">{activeRole.subtitle}</span>
                    </div>
                  </div>

                  {/* Challenge Card with Progressive Stagger */}
                  <motion.div 
                    className="uwoc-role-block block-needs"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.1, ease: EASE_PREMIUM }}
                  >
                    <div className="block-label red">
                      <div className="label-icon-box">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                      </div>
                      <span>Operational Challenge / What They Need</span>
                    </div>
                    <p>{activeRole.needs}</p>
                  </motion.div>

                  {/* Solution Card with Progressive Stagger */}
                  <motion.div 
                    className="uwoc-role-block block-helps"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.2, ease: EASE_PREMIUM }}
                  >
                    <div className="block-label green">
                      <div className="label-icon-box">
                        <i className="fa-solid fa-circle-check"></i>
                      </div>
                      <span>How UWO Connect Solves It</span>
                    </div>
                    <p>{activeRole.howHelps}</p>
                  </motion.div>

                  {/* Core Tools Chips */}
                  <div className="uwoc-role-features">
                    <span className="feat-title">Relevant Core Tools:</span>
                    <div className="feat-chips">
                      {activeRole.keyFeatures.map((kf, i) => (
                        <motion.span 
                          key={i} 
                          className="feat-chip"
                          whileHover={{ y: -2, scale: 1.04, transition: { duration: 0.2 } }}
                        >
                          <i className="fa-solid fa-check"></i>
                          <span>{kf}</span>
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT: ANIMATED OPERATIONAL WORKFLOW PIPELINE */}
                <div className="uwoc-role-right">
                  <div className="uwoc-role-workflow-box">
                    <div className="box-top">
                      <span>Role-Specific Operational Flow</span>
                      <span className="status-tag">Active Template</span>
                    </div>

                    <motion.div 
                      className="uwoc-role-chain"
                      variants={chainContainerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {activeRole.workflow.split('→').map((node, idx, arr) => (
                        <React.Fragment key={idx}>
                          <motion.div 
                            className="uwoc-chain-node"
                            variants={nodeVariants}
                            whileHover={{ scale: 1.02, x: 5, transition: { duration: 0.2, ease: EASE_PREMIUM } }}
                          >
                            <span className="node-num">0{idx + 1}</span>
                            <span className="node-text">{node.trim()}</span>
                            <span className="node-pulse-indicator" />
                          </motion.div>
                          {idx < arr.length - 1 && (
                            <motion.div className="uwoc-chain-arrow" variants={nodeVariants}>
                              <i className="fa-solid fa-chevron-down"></i>
                            </motion.div>
                          )}
                        </React.Fragment>
                      ))}
                    </motion.div>

                    <div className="uwoc-role-foot">
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                      <span>Configured in seconds with zero custom scripting.</span>
                    </div>
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
