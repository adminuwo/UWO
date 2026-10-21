import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Atom, Binary, Scale, FlaskConical, Code2, Sparkles,
  BookOpen, CheckCircle2, ArrowRight
} from 'lucide-react';

const CAMPX_SYSTEMS = [
  {
    id: 'academics',
    systemNumber: 'SYSTEM 1',
    systemCount: '1 / 6',
    title: 'Academics',
    tagline: 'Unified curriculum planning, smart practice, and academic cycles.',
    icon: Atom,
    accentColor: '#5145FF',
    badgeColor: 'rgba(81, 69, 255, 0.1)',
    appBg: '#EEF2FF',
    appBorder: 'rgba(99, 102, 241, 0.25)',
    appColor: '#4338CA',
    buttonGradient: 'linear-gradient(135deg, #5145FF 0%, #312E81 100%)',
    ctaText: 'Explore Academics',
    applications: ['Curriculum Grounding', 'Lesson Planning', 'Smart Practice', 'Exam Generation'],
    workspaces: ['Academic Dean', 'Faculty', 'Students'],
    source: 'NCERT & University Syllabus Handbooks',
    artwork: '/images/aieducation/cropped-academic-open-book-atom.png'
  },
  {
    id: 'math',
    systemNumber: 'SYSTEM 2',
    systemCount: '2 / 6',
    title: 'Engineering Math',
    tagline: 'Matrix transformations, calculus proofs, and analytical rigor.',
    icon: Binary,
    accentColor: '#7C3AED',
    badgeColor: 'rgba(124, 58, 237, 0.1)',
    appBg: '#F5F3FF',
    appBorder: 'rgba(124, 58, 237, 0.25)',
    appColor: '#6D28D9',
    buttonGradient: 'linear-gradient(135deg, #7C3AED 0%, #4338CA 100%)',
    ctaText: 'Explore Mathematics',
    applications: ['Matrix Solver', 'Eigenvalue Proofs', 'Vector Spaces', 'Calculus Engine'],
    workspaces: ['Engineering Faculty', 'Students', 'Researchers'],
    source: 'Higher Engineering Mathematics · Chapter 4',
    artwork: '/images/aieducation/cropped-how-it-works-textbook-brain.png'
  },
  {
    id: 'finance',
    systemNumber: 'SYSTEM 3',
    systemCount: '3 / 6',
    title: 'Finance & ERP',
    tagline: 'Real-time ledger sync, fee reconciliation, and automated audits.',
    icon: Scale,
    accentColor: '#2563EB',
    badgeColor: 'rgba(37, 99, 235, 0.1)',
    appBg: '#EFF6FF',
    appBorder: 'rgba(37, 99, 235, 0.25)',
    appColor: '#1D4ED8',
    buttonGradient: 'linear-gradient(135deg, #2563EB 0%, #1E1B4B 100%)',
    ctaText: 'Explore Finance ERP',
    applications: ['Tally Prime Sync', 'Fee Collection', 'Online Receipts', 'Statutory Audit'],
    workspaces: ['Finance Office', 'Parents', 'Auditors'],
    source: 'IT Act 2000 Statutory Handbook · §79',
    artwork: '/images/aieducation/cropped-law-justice-cyber-nobg.png'
  },
  {
    id: 'chemistry',
    systemNumber: 'SYSTEM 4',
    systemCount: '4 / 6',
    title: 'Natural Sciences',
    tagline: 'Laboratory-grounded reactions, molecular formulas, and simulations.',
    icon: FlaskConical,
    accentColor: '#059669',
    badgeColor: 'rgba(5, 150, 105, 0.1)',
    appBg: '#ECFDF5',
    appBorder: 'rgba(5, 150, 105, 0.25)',
    appColor: '#047857',
    buttonGradient: 'linear-gradient(135deg, #059669 0%, #064E3B 100%)',
    ctaText: 'Explore Science Lab',
    applications: ['Reaction Mechanisms', 'Thermodynamics', 'Steric Kinetics', 'Virtual Lab'],
    workspaces: ['Science Faculty', 'Lab Instructors', 'Students'],
    source: 'NCERT Chemistry Part 2 · Chapter 10',
    artwork: '/images/aieducation/cropped-physics-gravity-orbit-nobg.png'
  },
  {
    id: 'cs',
    systemNumber: 'SYSTEM 5',
    systemCount: '5 / 6',
    title: 'Computer Science',
    tagline: 'Algorithm visualizer, code compilation, and systems architecture.',
    icon: Code2,
    accentColor: '#D97706',
    badgeColor: 'rgba(217, 119, 6, 0.1)',
    appBg: '#FFFBEB',
    appBorder: 'rgba(217, 119, 6, 0.25)',
    appColor: '#B45309',
    buttonGradient: 'linear-gradient(135deg, #D97706 0%, #78350F 100%)',
    ctaText: 'Explore Algorithms',
    applications: ['Code Execution', 'Algorithm Tracing', 'Complexity Proofs', 'Git Architecture'],
    workspaces: ['CSE Faculty', 'Developers', 'Students'],
    source: 'CLRS Algorithms 3rd Ed · Chapter 2',
    artwork: '/images/aieducation/cropped-math-matrix-geometry-nobg.png'
  },
  {
    id: 'medha',
    systemNumber: 'SYSTEM 6',
    systemCount: '6 / 6',
    title: 'Medha AI',
    tagline: 'Intelligent autonomous assistant across all campus workflows.',
    icon: Sparkles,
    accentColor: '#E11D48',
    badgeColor: 'rgba(225, 29, 72, 0.1)',
    appBg: '#FFF1F2',
    appBorder: 'rgba(225, 29, 72, 0.25)',
    appColor: '#BE123C',
    buttonGradient: 'linear-gradient(135deg, #E11D48 0%, #1E027F 100%)',
    ctaText: 'Meet Medha',
    applications: ['Contextual Chat', 'Voice Assistant', 'Instant Summaries', 'Workflow Agents'],
    workspaces: ['Administrators', 'Faculty', 'Students'],
    source: 'UWO Digital Platforms · Architecture Whitepaper · §4.2',
    artwork: '/images/aieducation/ai-tutor-robot.png'
  }
];

export default function AIEducationLearning() {
  const [activeSystemIdx, setActiveSystemIdx] = useState(0); // System 1 (Academics)
  const current = CAMPX_SYSTEMS[activeSystemIdx];

  return (
    <section className="aied-campx-section" id="learning-section">
      <div className="aied-campx-container">

        {/* CampX Top Navigation & Header Row */}
        <div className="aied-campx-top-row">

          {/* Left: Horizontal System Icons Strip */}
          <div className="aied-campx-systems-strip" role="tablist">
            {CAMPX_SYSTEMS.map((sys, idx) => {
              const Icon = sys.icon;
              const isActive = activeSystemIdx === idx;
              return (
                <button
                  key={sys.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`aied-campx-icon-btn ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveSystemIdx(idx)}
                  title={`${sys.systemNumber}: ${sys.title}`}
                >
                  <Icon size={19} className="campx-btn-icon" style={{ color: isActive ? sys.accentColor : undefined }} />
                  {isActive && (
                    <motion.div
                      layoutId="campxActiveIndicator"
                      className="aied-campx-active-pill"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    >
                      <span className="campx-indicator-bar" style={{ background: sys.accentColor }} />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: The Product Eyebrow + Main Heading */}
          <div className="aied-campx-header-text">
            <span className="campx-eyebrow" style={{ color: current.accentColor }}>
              THE PRODUCT
            </span>
            <h2 className="campx-main-title">
              One Platform. Every Campus Function.
            </h2>
          </div>

        </div>

        {/* Main CampX White Showcase Card */}
        <div className="aied-campx-showcase-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className="aied-campx-card-grid"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              
              {/* Left Column: System Info, Applications & Workspaces */}
              <div className="aied-campx-info-col">

                {/* System Number & Counter */}
                <div className="campx-system-meta-row">
                  <span className="campx-system-pill" style={{ color: current.accentColor }}>
                    {current.systemNumber}
                  </span>
                  <span className="campx-system-counter">
                    {current.systemCount}
                  </span>
                </div>

                {/* Brand Logo & Big Title */}
                <div className="campx-brand-header">
                  <div className="campx-brand-logo-tile" style={{ background: current.badgeColor }}>
                    <current.icon size={28} style={{ color: current.accentColor }} />
                  </div>
                  <h3 className="campx-brand-title">
                    {current.title}
                  </h3>
                </div>

                {/* Concise Subtitle / Tagline */}
                <p className="campx-brand-tagline">
                  {current.tagline}
                </p>

                {/* Section 1: APPLICATIONS Themed Pills */}
                <div className="campx-meta-section">
                  <span className="campx-meta-heading">
                    APPLICATIONS
                  </span>
                  <div className="campx-pills-wrap">
                    {current.applications.map((app, i) => (
                      <span
                        key={i}
                        className="campx-tag-pill is-application"
                        style={{
                          backgroundColor: current.appBg,
                          borderColor: current.appBorder,
                          color: current.appColor
                        }}
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Section 2: WORKSPACES Pills */}
                <div className="campx-meta-section">
                  <span className="campx-meta-heading">
                    WORKSPACES
                  </span>
                  <div className="campx-pills-wrap">
                    {current.workspaces.map((ws, i) => (
                      <span key={i} className="campx-tag-pill is-workspace">
                        {ws}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Dotted Matrix Graphic, 3D Art & Gradient CTA */}
              <div className="aied-campx-visual-col">

                {/* Dotted Matrix Background Visual Stage */}
                <div className="campx-matrix-stage">
                  {/* Subtle Ambient Radial Glow */}
                  <div
                    className="campx-matrix-glow"
                    style={{
                      background: `radial-gradient(circle at center, ${current.accentColor}18 0%, transparent 70%)`
                    }}
                    aria-hidden="true"
                  />

                  {/* Geometric Dotted Matrix Pattern */}
                  <div className="campx-dotted-matrix-bg" aria-hidden="true">
                    {[...Array(56)].map((_, i) => (
                      <span
                        key={i}
                        className="matrix-dot"
                        style={{
                          backgroundColor: current.accentColor,
                          opacity: 0.10 + ((i % 7) * 0.12)
                        }}
                      />
                    ))}
                  </div>

                  {/* 3D Model Artwork Floating in Center */}
                  <motion.div
                    className="campx-art-centerpiece"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <img
                      src={current.artwork}
                      alt={current.title}
                      className="campx-3d-img"
                      loading="eager"
                    />
                  </motion.div>

                  {/* Verified Citation Strip */}
                  <div className="campx-citation-badge">
                    <BookOpen size={13} style={{ color: current.accentColor }} />
                    <span className="citation-source">{current.source}</span>
                    <CheckCircle2 size={13} className="text-emerald-500" />
                  </div>
                </div>

                {/* Gradient CTA Button (Matching CampX Screenshot!) */}
                <div className="campx-cta-row">
                  <button
                    type="button"
                    className="campx-primary-btn"
                    style={{
                      background: current.buttonGradient,
                      boxShadow: `0 10px 24px -6px ${current.accentColor}55`
                    }}
                  >
                    <span>{current.ctaText}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}


