import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Atom, Binary, Scale, BookOpen, CheckCircle2, Sparkles, ChevronRight 
} from 'lucide-react';

const LEARNING_TOPICS = [
  {
    id: 'physics',
    subject: 'Physics · Class 11',
    icon: Atom,
    artwork: '/images/aieducation/pencil-portal-nobg.png',
    artworkAlt: '3D Pencil Learning Portal with Student',
    query: "How does conservation of angular momentum apply to Kepler's second law?",
    explanation: "Because solar gravitational force is purely central, it exerts zero net external torque about the Sun. Total angular momentum is conserved, locking planetary areal velocity constant so it sweeps equal areas in equal intervals of time.",
    formula: 'τ_ext = 0  ⟹  L = constant  (dA/dt = const)',
    source: 'NCERT Physics Part 1 · Chapter 7 · Page 168'
  },
  {
    id: 'math',
    subject: 'Engineering Math',
    icon: Binary,
    artwork: '/images/aieducation/grounded-textbook-nobg.png',
    artworkAlt: '3D Grounded Curriculum Textbook',
    query: 'What is the relation between the trace of a square matrix and its eigenvalues?',
    explanation: 'The trace of any square matrix identically equals the sum of its characteristic eigenvalues, and its determinant equals their product, verified directly from its characteristic polynomial det(A - λI) = 0.',
    formula: 'Tr(A) = ∑ λ_i   |   det(A) = ∏ λ_i',
    source: 'Higher Engineering Mathematics · Chapter 4 · Page 115'
  },
  {
    id: 'law',
    subject: 'Cyber Law · LL.B',
    icon: Scale,
    artwork: '/images/aieducation/education-concept-nobg.png',
    artworkAlt: 'Connected Education and Statutory Shield',
    query: 'What statutory due diligence is required for intermediary safe harbor under Section 79?',
    explanation: 'Intermediary immunity is preserved when functioning solely as a technical conduit, without initiating or modifying data, and acting promptly on valid court takedown notices.',
    formula: 'Section 79(2)(b) · Transmission Conduit Rule',
    source: 'IT Act 2000 Handbook · Part IV · Page 242'
  }
];

export default function AIEducationLearning() {
  const [activeTopicIdx, setActiveTopicIdx] = useState(0);
  const activeTopic = LEARNING_TOPICS[activeTopicIdx];

  return (
    <section className="aied-section-learning" id="learning-section">
      <div className="aied-container">

        {/* Section Header */}
        <div className="aied-section-header">
          <h2 className="aied-section-title">
            Ask Doubts From <span className="accent">Any Textbook.</span>
          </h2>
          <p className="aied-section-subtitle">
            Open coursebooks to get instant, step-by-step answers with verified page and chapter citations.
          </p>
        </div>

        {/* Master Visual Knowledge Canvas */}
        <div className="aied-learning-master-stage">

          {/* Top Subject Switcher */}
          <div className="aied-subject-tabs">
            {LEARNING_TOPICS.map((topic, idx) => {
              const Icon = topic.icon;
              const isActive = activeTopicIdx === idx;
              return (
                <button
                  key={topic.id}
                  type="button"
                  className={`aied-subject-tab ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTopicIdx(idx)}
                >
                  <Icon size={15} />
                  <span>{topic.subject}</span>
                  {isActive && <span className="aied-tab-active-dot" />}
                </button>
              );
            })}
          </div>

          {/* 2-Column Showcase: Left = Pure Transparent 3D Visual (NO POPUPS), Right = Simple, Elegant Doubt Solver */}
          <div className="aied-learning-grid">

            {/* Left: Pure Background-Removed 3D Visual (No Box, No Popups) */}
            <div className="aied-visual-art-stage">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTopic.id}
                  className="aied-visual-art-frame"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* Floating 3D Render Image */}
                  <motion.div
                    className="aied-visual-img-container"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <img
                      src={activeTopic.artwork}
                      alt={activeTopic.artworkAlt}
                      className="aied-visual-art-img"
                      loading="eager"
                    />
                  </motion.div>

                  {/* Soft Ambient Radial Glow Behind 3D Art */}
                  <div className="aied-visual-art-ambient" aria-hidden="true" />

                  {/* Soft Ground Shadow */}
                  <div className="aied-visual-art-shadow" aria-hidden="true" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Simple, Clean & Elegant Solver Content */}
            <div className="aied-fluid-solver-stream">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTopic.id}
                  className="aied-fluid-solver-inner aied-simple-solver"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                >
                  {/* Clean Category Pill */}
                  <div className="aied-simple-category-pill">
                    <Sparkles size={13} className="text-purple-600" />
                    <span>Instant Textbook Resolution</span>
                  </div>

                  {/* Clear Student Question */}
                  <h3 className="aied-simple-question">
                    "{activeTopic.query}"
                  </h3>

                  {/* Simple, Readable Explanation */}
                  <p className="aied-simple-explanation">
                    {activeTopic.explanation}
                  </p>

                  {/* Clean Key Formula / Coordinate */}
                  {activeTopic.formula && (
                    <div className="aied-simple-formula-row">
                      <span className="aied-formula-tag">Key Concept:</span>
                      <code>{activeTopic.formula}</code>
                    </div>
                  )}

                  {/* Single Clean Verified Source Citation */}
                  <div className="aied-simple-citation-box">
                    <BookOpen size={16} className="aied-citation-book-icon" />
                    <span className="aied-citation-source-text">{activeTopic.source}</span>
                    <span className="aied-citation-check">
                      <CheckCircle2 size={13} />
                      <span>Verified</span>
                    </span>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
