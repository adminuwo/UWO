import React from 'react';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import { fadeUp, fadeLeft, fadeRight } from './motionVariants';

// 3 Dedicated Realistic 3D Legal Objects (Zero Cards, No Boxes, Transparent Assets)
const LEGAL_OBJECTS = [
  {
    image: '/images/ailegal/scales_3d.png',
    title: 'Contextual Case Strategy',
    desc: 'Synthesizes facts, exhibits, and timeline chronologies into structured intelligence.'
  },
  {
    image: '/images/ailegal/drafting_3d.png',
    title: 'Court-Ready Pleadings',
    desc: 'Generates verified petitions, writ memos, notices, and affidavits with IRAC logic.'
  },
  {
    image: '/images/ailegal/gavel_3d.png',
    title: 'Binding Precedent Research',
    desc: 'Instant cross-referencing against 3.9 Cr+ Supreme Court & High Court judgments.'
  }
];

export default function ProductOverview() {
  return (
    <section className="al-overview-section" id="overview">
      <div className="ai-legal-container al-overview-container">
        {/* CENTERED HEADER: Clean & Light */}
        <motion.div
          className="al-overview-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="al-eyebrow">
            <Scale size={13} style={{ color: 'var(--al-gold)' }} />
            <span>Unified Legal Operating System</span>
          </div>

          <h2 className="al-overview-title">
            Meet <span className="al-gold-text">AI LEGAL™</span>
          </h2>

          <p className="al-overview-subtitle">
            An intelligent operating environment engineered for modern advocates and law chambers.
          </p>
        </motion.div>

        {/* 2-COLUMN BALANCED EDITORIAL: Left Workspace Preview + Right Content with 3D Objects */}
        <div className="al-overview-split">
          {/* LEFT: Clean Interface Preview (Card-Free, Soft Natural Depth) */}
          <motion.div
            className="al-overview-visual"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeLeft}
          >
            <div className="al-overview-visual-wrapper">
              <div className="al-overview-ambient-glow" aria-hidden="true"></div>
              <div className="al-overview-visual-card">
                <img
                  src="/images/ai-legal-login-workspace.png"
                  alt="AI LEGAL™ Workspace & Chambers CRM"
                  className="al-overview-real-img"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Pure Editorial Content with 3D Legal Objects (Zero Cards, Breathable) */}
          <motion.div
            className="al-overview-text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeRight}
          >
            <div className="al-overview-text-main">
              <p className="al-overview-lead">
                AI LEGAL™ is an AI-powered legal technology platform designed to simplify legal research, case analysis, drafting, evidence management, and day-to-day legal workflows.
              </p>

              <p className="al-overview-desc">
                Instead of scattering legal work across disjointed word processors, legacy research databases, unindexed document drives, and separate messaging apps, AI LEGAL unites the entire advocate lifecycle into a unified, intelligent operating environment.
              </p>
            </div>

            {/* 3 Real 3D Legal Objects (100% Card-Free, No Boxes, Clean & Elegant) */}
            <div className="al-overview-objects-list">
              {LEGAL_OBJECTS.map((obj, idx) => (
                <div key={idx} className="al-overview-object-row">
                  <div className="al-overview-obj-icon-wrap">
                    <img
                      src={obj.image}
                      alt={obj.title}
                      className="al-overview-obj-img"
                    />
                  </div>
                  <div className="al-overview-obj-details">
                    <h4>{obj.title}</h4>
                    <p>{obj.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

