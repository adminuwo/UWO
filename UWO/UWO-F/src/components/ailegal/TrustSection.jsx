import React from 'react';
import { motion } from 'framer-motion';
import { TRUST_PILLARS } from '../../constants/aiLegalConstants';
import { fadeUp, EASE_PREMIUM } from './motionVariants';

export default function TrustSection() {
  const statusLabels = [
    'Cryptographically Isolated',
    'Role-Gated Permissions',
    'Ethical Guardrails Active',
    'Tenant Privacy Enforced',
    'Immutable Audit Logs',
    '99.9% Uptime Redundancy'
  ];

  return (
    <section className="al-trust-section" id="security">
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
            <i className="fa-solid fa-shield-halved"></i>
            <span>Ethics & Security Standards</span>
          </div>

          <h2 className="al-section-title">
            Designed for <span className="al-gold-text">Professional Legal Work.</span>
          </h2>

          <p className="al-section-subtitle">
            Legal technology demands strict adherence to attorney-client privilege boundaries, isolated matter memory, and predictable procedural guardrails.
          </p>
        </motion.div>

        {/* 6 Trust Pillars Grid with Staggered Entrance & Status Badges */}
        <motion.div
          className="al-trust-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.14, delayChildren: 0.1 },
            },
          }}
        >
          {TRUST_PILLARS.map((pillar, idx) => (
            <motion.div
              className="al-trust-card"
              key={idx}
              variants={fadeUp}
              whileHover={{ y: -5, transition: { duration: 0.3, ease: EASE_PREMIUM } }}
            >
              <div className="al-trust-top-status">
                <span className="al-trust-dot"></span>
                <span className="al-trust-status-txt">{statusLabels[idx] || 'Verified Protocol'}</span>
              </div>

              <div className="al-trust-icon">
                <i className={`fa-solid ${pillar.icon}`}></i>
              </div>

              <h4>{pillar.title}</h4>
              <p>{pillar.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
