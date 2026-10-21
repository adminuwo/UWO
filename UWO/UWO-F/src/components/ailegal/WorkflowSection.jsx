import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Check, Scale, Layers, ChevronRight } from 'lucide-react';
import { fadeUp } from './motionVariants';

// 4 Pipeline Stages with Concise, Punchy Editorial Content
const PIPELINE_STAGES = [
  {
    id: 'input',
    number: '01',
    phase: 'INPUT',
    navTitle: 'Data Ingestion',
    title: 'Multi-Modal Data Ingestion',
    description: 'Ingest raw briefs, scanned court records, contracts, and transcripts into an isolated, secure judicial workspace.',
    image: '/images/ailegal/pipe_input_3d.png',
    objectName: 'Leather Legal Case Binder',
    features: ['PDFs & Court Filings', 'Scanned OCR', 'Deposition Transcripts', 'Bilingual Ingestion']
  },
  {
    id: 'understand',
    number: '02',
    phase: 'UNDERSTAND',
    navTitle: 'Context Processing',
    title: 'Contextual Legal Processing',
    description: 'Synthesizes document facts, court authorities, and timeline chronologies into structured case intelligence.',
    image: '/images/ailegal/pipe_understand_3d.png',
    objectName: 'Legal Intelligence Neural Core',
    features: ['Jurisdiction Engine', 'Timeline Chronology', 'Statute Matrix', 'Entity Graph']
  },
  {
    id: 'analyze',
    number: '03',
    phase: 'ANALYZE',
    navTitle: 'Precedent Synthesis',
    title: 'Precedent & Pattern Synthesis',
    description: 'Identifies binding precedents, contradictory testimonies, missing safeguards, and strategic vulnerabilities.',
    image: '/images/ailegal/pipe_analyze_3d.png',
    objectName: 'Supreme Court Law Reports & Magnifier',
    features: ['Precedent Matching', 'Contradiction Audit', 'Risk Scoring', 'IRAC Logic']
  },
  {
    id: 'assist',
    number: '04',
    phase: 'ASSIST',
    navTitle: 'Actionable Outputs',
    title: 'Actionable Legal Outputs',
    description: 'Generates court-ready draft pleadings, research briefs, forensic evidence reports, and client updates.',
    image: '/images/ailegal/pipe_assist_3d.png',
    objectName: 'Court-Ready Petition & Wax Seal',
    features: ['Court Pleadings', 'Citation Verification', 'Hearing Prep', 'Multi-Format Export']
  }
];

export default function WorkflowSection() {
  const containerRef = useRef(null);
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  // Track scroll progress through the 320vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  useMotionValueEvent(scrollYProgress, 'change', (val) => {
    let step = 0;
    if (val >= 0.72) step = 3;
    else if (val >= 0.46) step = 2;
    else if (val >= 0.20) step = 1;
    else step = 0;

    setActiveStageIdx(step);
  });

  const handleStepClick = (idx) => {
    setActiveStageIdx(idx);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const containerTop = rect.top + scrollTop;
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      const stepRatios = [0.08, 0.35, 0.62, 0.88];
      const targetY = containerTop + (stepRatios[idx] || 0) * totalScrollable;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  const activeStage = PIPELINE_STAGES[activeStageIdx];

  return (
    <section className="al-workflow-section" ref={containerRef} id="how-it-works">
      {/* Pinned Sticky Viewport: Keeps heading & active stage in view throughout the scroll */}
      <div className="al-workflow-sticky-viewport">
        <div className="al-workflow-container">
          {/* Section Header: Clean, balanced */}
          <motion.div
            className="al-section-header al-workflow-compact-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            <div className="al-eyebrow">
              <Layers size={13} style={{ color: 'var(--al-gold)' }} />
              <span>System Architecture</span>
            </div>

            <h2 className="al-section-title">
              How <span className="al-gold-text">AI LEGAL™ Works</span>
            </h2>

            <p className="al-section-subtitle">
              A continuous 4-stage pipeline transforming unstructured case records into court-ready intelligence.
            </p>
          </motion.div>

          {/* CARD-FREE STICKY SCROLL WORKFLOW LAYOUT */}
          <div className="al-workflow-scroll-layout">
            {/* Left Column: Clean Pipeline Sequence */}
            <aside className="al-workflow-sticky-sidebar">
              <div className="al-sticky-nav-inner">
                <span className="al-sidebar-caption">PIPELINE SEQUENCE</span>

                <nav className="al-pipeline-vertical-nav" aria-label="Workflow Stages">
                  <div className="al-vertical-rail-track" aria-hidden="true"></div>

                  {PIPELINE_STAGES.map((step, idx) => {
                    const isActive = activeStageIdx === idx;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        className={`al-pipeline-nav-item ${isActive ? 'is-active' : ''}`}
                        onClick={() => handleStepClick(idx)}
                        aria-current={isActive ? 'step' : undefined}
                      >
                        <div className="al-nav-marker">
                          <span className="al-nav-num">{step.number}</span>
                        </div>

                        <div className="al-nav-info">
                          <span className="al-nav-phase">{step.phase}</span>
                          <span className="al-nav-title">{step.navTitle}</span>
                        </div>

                        <ChevronRight size={14} className="al-nav-arrow" />
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Right Column: ONLY the Active Stage (Concise, Uncluttered, Breathable) */}
            <div className="al-workflow-stage-display">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage.id}
                  className="al-stage-editorial-grid"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Left Sub-Column: Punchy Text & Chips */}
                  <div className="al-stage-text-col">
                    <div className="al-stage-meta-badge">
                      <span className="al-phase-tag">PHASE {activeStage.number} // {activeStage.phase}</span>
                    </div>

                    <h3 className="al-stage-main-title">{activeStage.title}</h3>
                    <p className="al-stage-description-body">{activeStage.description}</p>

                    <div className="al-cap-chips-row">
                      {activeStage.features.map((feat, fIdx) => (
                        <span key={fIdx} className="al-cap-chip">
                          <Check size={11} className="al-chip-check" />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Sub-Column: Hero 3D Legal Object (Card-Free, Floating, Clean) */}
                  <div className="al-stage-visual-col">
                    <div className="al-stage-object-canvas">
                      <div className="al-stage-object-glow" aria-hidden="true"></div>

                      <motion.div
                        className="al-pipe-object-wrapper"
                        animate={{ y: [-6, 6, -6] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <img
                          src={activeStage.image}
                          alt={activeStage.objectName}
                          className="al-pipe-object-image"
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Minimal Low-Key Disclaimer Note (Clean, No Heavy Box) */}
          <div className="al-workflow-disclaimer-note">
            <Scale size={13} style={{ color: 'var(--al-gold)' }} />
            <span>
              <strong>Professional Notice:</strong> AI LEGAL provides AI workflow support and does not constitute formal legal advice. Advocates retain full editorial discretion over all court filings.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
