import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LEGAL_ROLES } from '../../constants/aiLegalConstants';
import { fadeUp, EASE_PREMIUM } from './motionVariants';

export default function RoleExplorer() {
  const [selectedRole, setSelectedRole] = useState(LEGAL_ROLES[0]);

  return (
    <section className="al-roles-section" id="roles">
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
            <i className="fa-solid fa-users-gear"></i>
            <span>Tailored Practice Personas</span>
          </div>

          <h2 className="al-section-title">
            Built Around the People Who <span className="al-gold-text">Practice Law.</span>
          </h2>

          <p className="al-section-subtitle">
            Whether arguing before appellate benches, running chamber associate workflows, or mastering moot court.
          </p>
        </motion.div>

        {/* Role Selector Tabs with layoutId Active Pill */}
        <div className="al-role-selector-tabs" role="tablist" aria-label="Legal Practice Roles">
          {LEGAL_ROLES.map((role) => {
            const isActive = selectedRole.id === role.id;
            return (
              <button
                key={role.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`al-role-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedRole(role)}
                style={{ position: 'relative' }}
              >
                {isActive && (
                  <motion.div
                    className="al-role-tab-glider"
                    layoutId="roleActiveTabGlider"
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <i className={`fa-solid ${role.icon}`}></i>
                  <span>{role.title}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Role Detail Card with AnimatePresence */}
        <div className="al-role-detail-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRole.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.5, ease: EASE_PREMIUM }}
            >
              {/* Role Header */}
              <div className="al-role-top">
                <div>
                  <span className="al-eyebrow" style={{ marginBottom: '10px' }}>
                    {selectedRole.badge}
                  </span>
                  <h3>{selectedRole.title}</h3>
                  <p className="al-role-summary">{selectedRole.summary}</p>
                </div>
              </div>

              {/* Problems vs AI Legal Solution Grid */}
              <div className="al-role-grid-2">
                {/* The Challenges */}
                <motion.div
                  className="al-role-box"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.12, ease: EASE_PREMIUM }}
                >
                  <div className="al-role-box-title">
                    <i className="fa-solid fa-triangle-exclamation" style={{ color: '#f87171' }}></i>
                    <span>Practice Challenges & Bottlenecks</span>
                  </div>
                  <ul className="al-role-list problems">
                    {selectedRole.problems.map((prob, idx) => (
                      <li key={idx}>
                        <i className="fa-solid fa-xmark"></i>
                        <span>{prob}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* The AI Legal Solution */}
                <motion.div
                  className="al-role-box"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.24, ease: EASE_PREMIUM }}
                >
                  <div className="al-role-box-title">
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>The AI LEGAL™ Solution</span>
                  </div>
                  <p style={{ color: 'var(--al-text-sub)', fontSize: '0.8rem', lineHeight: '1.45', marginBottom: '10px' }}>
                    {selectedRole.solution}
                  </p>
                  <div style={{ marginTop: 'auto' }}>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--al-text-muted)', fontWeight: '700', letterSpacing: '0.04em' }}>
                      Relevant Integrated Modules:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                      {selectedRole.modules.map((mod, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.72rem',
                            background: 'rgba(200, 163, 77, 0.1)',
                            border: '1px solid var(--al-gold-border)',
                            color: 'var(--al-gold-dark)',
                            padding: '3px 8px',
                            borderRadius: '5px',
                            fontWeight: '600',
                          }}
                        >
                          {mod}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Animated 4-Step Practice Workflow */}
              <div style={{ marginTop: '22px' }}>
                <div className="al-role-workflow-title">
                  <i className="fa-solid fa-arrow-progress" style={{ color: 'var(--al-gold)', marginRight: '10px' }}></i>
                  Example Practice Workflow:
                </div>

                {/* Progress Track Line */}
                <div className="al-role-workflow-track" aria-hidden="true">
                  <motion.div
                    className="al-role-workflow-progress-line"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.4, delay: 0.35, ease: EASE_PREMIUM }}
                  />
                </div>

                <div className="al-role-workflow-grid">
                  {selectedRole.workflow.map((item, idx) => (
                    <motion.div
                      className="al-role-step-card"
                      key={idx}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.3 + idx * 0.12, ease: EASE_PREMIUM }}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    >
                      <div className="al-role-step-num">STAGE {item.step}</div>
                      <div className="al-role-step-title">{item.title}</div>
                      <p className="al-role-step-desc">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
