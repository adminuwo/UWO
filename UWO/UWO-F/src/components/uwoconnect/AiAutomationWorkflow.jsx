import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AUTOMATION_WORKFLOW_STEPS } from '../../constants/uwoConnectConstants';
import { fadeUp, staggerContainer, EASE_PREMIUM } from './motionVariants';

export default function AiAutomationWorkflow() {
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  // Cycling active step highlight (identical to AI LEGAL™ Workflow Section)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStepIdx((prev) => (prev + 1) % AUTOMATION_WORKFLOW_STEPS.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="uwoc-section uwoc-bg-contrast" id="automation-workflow">
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
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <span>AUTONOMOUS BUSINESS EXECUTION</span>
          </div>

          <h2 className="uwoc-section-title">
            From Message to Business Action — <br />
            <span className="uwoc-gradient-gold">Automatically.</span>
          </h2>

          <p className="uwoc-section-subtitle">
            Eliminate hours of manual data entry and disjointed back-and-forth. Watch how UWO Connect transforms a single customer chat into a closed, invoiced deal without human friction.
          </p>
        </motion.div>

        {/* 8-STEP HORIZONTAL / GRID CANVAS WITH STAGGERED REVEAL & ACTIVE HIGHLIGHT */}
        <div className="uwoc-workflow-canvas">
          <motion.div 
            className="uwoc-steps-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.02 }}
            variants={staggerContainer(0.08, 0.05)}
          >
            {AUTOMATION_WORKFLOW_STEPS.map((step, idx) => {
              const isStepActive = activeStepIdx === idx;
              return (
                <motion.div
                  key={step.step}
                  className={`uwoc-step-card ${isStepActive ? 'pipeline-active' : ''}`}
                  variants={fadeUp}
                  whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_PREMIUM } }}
                  onMouseEnter={() => setActiveStepIdx(idx)}
                  style={{
                    borderColor: isStepActive ? 'var(--uwoc-primary)' : undefined,
                    boxShadow: isStepActive ? '0 10px 25px rgba(11, 143, 120, 0.18)' : undefined,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div className="uwoc-step-top">
                    <span className="uwoc-step-num" style={{ color: isStepActive ? 'var(--uwoc-primary)' : undefined }}>
                      {step.step}
                    </span>
                    <span className="uwoc-step-badge">{step.badge}</span>
                  </div>

                  <motion.div 
                    className="uwoc-step-icon"
                    animate={isStepActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.6, ease: EASE_PREMIUM }}
                  >
                    <i className={step.icon}></i>
                  </motion.div>

                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>

                  <div className="uwoc-step-live-chip">
                    <i className="fa-solid fa-check"></i>
                    <span>{step.liveDetail}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
