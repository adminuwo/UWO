import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, fadeLeft, fadeRight, EASE_PREMIUM } from './motionVariants';

export default function ProductOverview() {
  const pillars = [
    {
      icon: 'fa-brain',
      title: 'Contextual Case Reasoning',
      desc: 'Connects your pleadings, witness exhibits, and court precedents into an active contextual intelligence engine.',
    },
    {
      icon: 'fa-file-lines',
      title: 'Structured Drafting Suite',
      desc: 'Generate procedural court instruments, notices, and commercial agreements with verified templates.',
    },
    {
      icon: 'fa-shield',
      title: 'Forensic Evidence Vault',
      desc: 'Process bilingual scanned documents, police records, and financial exhibits with deep OCR extraction.',
    },
    {
      icon: 'fa-gavel',
      title: 'Simulated Courtroom Prep',
      desc: 'Rehearse oral arguments and anticipate judicial scrutiny through voice- and text-driven simulated hearings.',
    },
  ];

  return (
    <section className="al-overview-section" id="overview">
      <div className="ai-legal-container">
        <div className="al-split-layout">
          {/* LEFT: Visual Interface Mockup */}
          <motion.div
            className="al-overview-visual"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeLeft}
          >
            <div className="al-overview-visual-card">
              <img
                src="/images/ai-legal-login-workspace.png"
                alt="AI LEGAL™ Workspace & Chambers CRM — Advocate Aarohi Portal"
                className="al-overview-real-img"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* RIGHT: Product Description with Progressive Text Stagger */}
          <motion.div
            className="al-overview-text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeRight}
          >
            <div className="al-eyebrow">
              <i className="fa-solid fa-scale-balanced"></i>
              <span>Unified Legal Ecosystem</span>
            </div>

            <h2>
              Meet <span className="al-gold-text">AI LEGAL™</span>
            </h2>

            <p className="al-overview-lead">
              AI LEGAL™ is an AI-powered legal technology platform designed to simplify legal research, case analysis, drafting, evidence management, and day-to-day legal workflows.
            </p>

            <p style={{ color: 'var(--al-text-sub)', fontSize: '0.94rem', lineHeight: '1.65', margin: '0' }}>
              Instead of scattering legal work across disjointed word processors, legacy research databases, unindexed document drives, and separate messaging apps, AI LEGAL unites the entire advocate lifecycle into a unified, intelligent operating environment.
            </p>
          </motion.div>
        </div>

        {/* 4 Pillars in a Single Row with Staggered Entrance */}
        <motion.div
          className="al-overview-pillars-row"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.16, delayChildren: 0.15 },
            },
          }}
        >
          {pillars.map((pillar, idx) => (
            <motion.div
              className="al-pillar-item"
              key={idx}
              variants={fadeUp}
              whileHover={{ y: -5, transition: { duration: 0.3, ease: EASE_PREMIUM } }}
            >
              <div className="al-pillar-icon">
                <i className={`fa-solid ${pillar.icon}`}></i>
              </div>
              <h4>{pillar.title}</h4>
              <p>{pillar.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
