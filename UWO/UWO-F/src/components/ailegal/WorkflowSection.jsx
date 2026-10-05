import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WORKFLOW_STEPS } from '../../constants/aiLegalConstants';
import { fadeUp, EASE_PREMIUM } from './motionVariants';

export default function WorkflowSection() {
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  // Cycling data packet that loops through stages 0 -> 1 -> 2 -> 3 with relaxed, unhurried timing
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStageIdx((prev) => (prev + 1) % WORKFLOW_STEPS.length);
    }, 4800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="al-workflow-section" id="how-it-works">
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
            <i className="fa-solid fa-gears"></i>
            <span>System Architecture</span>
          </div>

          <h2 className="al-section-title">
            How <span className="al-gold-text">AI LEGAL™ Works</span>
          </h2>

          <p className="al-section-subtitle">
            A rigorous 4-stage pipeline that transforms unstructured case documents, statutory rules, and procedural inquiries into authoritative legal work products.
          </p>
        </motion.div>

        {/* Global Pipeline Track with Traveling Data Packet (Relaxed 14s cycle) */}
        <div className="al-workflow-pipeline-track" aria-hidden="true">
          <div className="al-pipeline-line-bg"></div>
          <motion.div
            className="al-pipeline-packet"
            animate={{
              left: ['5%', '33%', '64%', '95%'],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="al-packet-dot"></span>
            <span className="al-packet-glow"></span>
          </motion.div>
        </div>

        {/* 4-Step Grid with Staggered Entrance & Active Highlighting */}
        <motion.div
          className="al-workflow-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.18, delayChildren: 0.15 },
            },
          }}
        >
          {WORKFLOW_STEPS.map((wf, idx) => {
            const isStageActive = activeStageIdx === idx;
            return (
              <motion.div
                className={`al-workflow-card ${isStageActive ? 'pipeline-active' : ''}`}
                key={wf.number}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_PREMIUM } }}
                onMouseEnter={() => setActiveStageIdx(idx)}
              >
                <div className="al-workflow-step-badge">STAGE {wf.number}</div>

                <motion.div
                  className="al-workflow-icon-wrap"
                  animate={isStageActive ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  transition={{ duration: 0.7, ease: EASE_PREMIUM }}
                >
                  <i className={`fa-solid ${wf.icon}`}></i>
                </motion.div>

                <div className="al-workflow-phase">{wf.phase}</div>
                <div className="al-workflow-summary">{wf.summary}</div>
                <p className="al-workflow-desc">{wf.description}</p>

                <div className="al-workflow-tags">
                  {wf.tags.map((t, tidx) => (
                    <span className="al-workflow-tag" key={tidx}>
                      {t}
                    </span>
                  ))}
                </div>

                {isStageActive && <div className="al-workflow-active-glow"></div>}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Responsible Legal Disclaimer */}
        <motion.div
          className="al-workflow-disclaimer-box"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <i className="fa-solid fa-scale-balanced"></i>
          <p>
            <strong>Professional Notice:</strong> AI LEGAL provides AI-assisted information and workflow support. It does not replace professional legal judgment or constitute legal advice. Advocates maintain full editorial discretion over all court filings.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
