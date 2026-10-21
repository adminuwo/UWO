import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { USE_CASES } from '../../constants/aiLegalConstants';
import { fadeUp } from './motionVariants';

// Bespoke 3D Legal Object visual assets (transparent PNGs, no background)
const LEGAL_OBJECT_META = {
  'case-research': {
    image: '/images/ailegal/scales_3d.png',
    category: 'JUDICIAL PRECEDENT & STATUTES',
    objectName: 'Scales of Justice',
  },
  'document-analysis': {
    image: '/images/ailegal/doc_analysis_3d.png',
    category: 'FORENSIC RECORD EXTRACTION',
    objectName: 'Evidence Dossier & Magnifier',
  },
  'legal-drafting': {
    image: '/images/ailegal/drafting_3d.png',
    category: 'PLEADINGS & INSTRUMENTS',
    objectName: 'Fountain Pen & Wax Sealed Petition',
  },
  'case-workspace': {
    image: '/images/ailegal/courthouse_3d.png',
    category: 'MATTER DOCKET COMMAND',
    objectName: 'Neoclassical Courthouse',
  },
  'mock-courtroom': {
    image: '/images/ailegal/gavel_3d.png',
    category: 'BENCH REHEARSAL & ADVOCACY',
    objectName: "Judge's Gavel & Sounding Block",
  },
  'client-connect': {
    image: '/images/ailegal/client_comm_3d.png',
    category: 'SECURE CLIENT BROADCASTS',
    objectName: 'Shield Letterhead & Certificate',
  },
};

export default function UseCaseSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const currentScenario = USE_CASES[activeIdx];
  const currentMeta = LEGAL_OBJECT_META[currentScenario.id] || {};
  const nextScenario = USE_CASES[(activeIdx + 1) % USE_CASES.length];

  // Reset active step when scenario changes
  useEffect(() => {
    setActiveStep(0);
  }, [activeIdx]);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? USE_CASES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % USE_CASES.length);
  };

  return (
    <section className="al-usecases-section" id="use-cases">
      <div className="al-usecases-container">
        {/* Section Header: Pure, Clean, Editorial Typography (Eyebrow Removed) */}
        <motion.div
          className="al-section-header al-usecases-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <h2 className="al-section-title">
            From Legal Research to <span className="al-gold-text">Case Strategy.</span>
          </h2>

          <p className="al-section-subtitle">
            Explore step-by-step litigation, document analysis, and drafting workflows with AI LEGAL™.
          </p>
        </motion.div>

        {/* 1. Legal Object Interactive Dock (Icons with transparent bg) */}
        <div className="al-objects-dock-wrap">
          <div className="al-objects-dock" role="tablist" aria-label="Legal Strategy Scenarios">
            {USE_CASES.map((uc, idx) => {
              const meta = LEGAL_OBJECT_META[uc.id] || {};
              const isActive = activeIdx === idx;

              return (
                <button
                  key={uc.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`al-dock-item ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveIdx(idx)}
                >
                  {isActive && (
                    <motion.div
                      className="al-dock-active-pill"
                      layoutId="activeDockGlider"
                      transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                    />
                  )}
                  <div className="al-dock-thumb-wrap">
                    <img
                      src={meta.image}
                      alt={meta.objectName}
                      className="al-dock-thumb-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="al-dock-info">
                    <span className="al-dock-scenario-num">SCENARIO 0{idx + 1}</span>
                    <span className="al-dock-scenario-title">{uc.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Master Legal Object Studio Stage (Card-Free, Popups Removed) */}
        <div className="al-workbench-stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScenario.id}
              className="al-workbench-split"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Left Wing: The 3D Legal Object Hero Experience (Clean, No Popups) */}
              <div className="al-workbench-visual-col">
                <div className="al-object-stage-canvas">
                  {/* Subtle golden ambient radial aura */}
                  <div className="al-object-glow-backdrop" aria-hidden="true"></div>

                  {/* The 3D Legal Object with gentle floating motion & transparent background */}
                  <motion.div
                    className="al-object-hero-wrap"
                    animate={{ y: [-6, 6, -6] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <img
                      src={currentMeta.image}
                      alt={currentMeta.objectName}
                      className="al-object-hero-img"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Right Wing: Editorial Legal Workflow Content */}
              <div className="al-workbench-content-col">
                {/* Meta Row: Scenario 0N OF 06 + Phase */}
                <div className="al-content-meta-row">
                  <span className="al-content-gold-tag">SCENARIO 0{activeIdx + 1} OF 06</span>
                  <span className="al-content-dot-sep"></span>
                  <span className="al-content-category">{currentMeta.category}</span>
                </div>

                {/* Title & Description */}
                <h3 className="al-content-title">{currentScenario.title}</h3>
                <p className="al-content-subtitle">{currentScenario.subtitle}</p>

                {/* 4-Step Connected Workflow Rail */}
                <div className="al-content-workflow-deck">
                  <div className="al-content-rail-line" aria-hidden="true"></div>
                  <div className="al-content-steps-wrap">
                    {currentScenario.steps.map((st, stepIdx) => {
                      const isStepActive = activeStep === stepIdx;
                      return (
                        <div
                          key={stepIdx}
                          className={`al-content-step-row ${isStepActive ? 'is-active-step' : ''}`}
                          onClick={() => setActiveStep(stepIdx)}
                          tabIndex={0}
                          onFocus={() => setActiveStep(stepIdx)}
                        >
                          <div className="al-step-indicator">
                            <span className="al-step-circle-num">{st.step}</span>
                          </div>
                          <div className="al-step-body">
                            <span className="al-step-title-text">{st.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Controls Footer (Auto-tour removed) */}
                <div className="al-workbench-controls">
                  <div className="al-nav-buttons-group">
                    <button
                      type="button"
                      className="al-stage-nav-btn prev"
                      onClick={handlePrev}
                      aria-label="Previous Scenario"
                    >
                      <ArrowLeft size={15} />
                      <span>Previous</span>
                    </button>
                    <button
                      type="button"
                      className="al-stage-nav-btn next"
                      onClick={handleNext}
                      aria-label="Next Scenario"
                    >
                      <span>Next: {nextScenario.title}</span>
                      <ArrowRight size={15} />
                    </button>
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
