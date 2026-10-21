import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ExternalLink, ChevronDown } from 'lucide-react';

const ROTATING_PHRASES = [
  'Modern Education.',
  'Connected Campuses.',
  'Adaptive Learning.',
  'Academic Excellence.'
];

export default function AIEducationHero({ onExploreClick }) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Smooth rotating keyword timer
  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="aied-hero-section">
      {/* High-End Architectural Campus Background Image & Overlays */}
      <div className="aied-hero-bg-image" aria-hidden="true" />
      <div className="aied-hero-bg-overlay" aria-hidden="true" />
      <div className="aied-hero-bg-vignette" aria-hidden="true" />

      {/* Ambient Lighting Canvas & Subtle Grid */}
      <div className="aied-hero-ambient" aria-hidden="true" />
      <div className="aied-hero-grid" aria-hidden="true" />
      <div className="aied-hero-grid-fade" aria-hidden="true" />

      <div className="aied-container aied-hero-container">
        <div className="aied-hero-center-content">

          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="aied-hero-eyebrow">
              <span className="aied-beacon-dot" />
              <span>AI EDUCATION ECOSYSTEM · UNIFIED DIGITAL CAMPUS PLATFORM</span>
            </div>
          </motion.div>

          {/* Main Headline with Animated Rotating Accent */}
          <motion.h1
            className="aied-hero-title"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Intelligence for <br />
            <span className="aied-rotating-wrapper">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIndex}
                  className="aied-hero-accent"
                  initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -24, filter: 'blur(8px)' }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  {ROTATING_PHRASES[phraseIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* Short, Punchy Supporting Line */}
          <motion.p
            className="aied-hero-subtitle"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            One intelligent ecosystem for learning and teaching.
          </motion.p>

          {/* Primary & Secondary Call To Actions */}
          <motion.div
            className="aied-hero-actions"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href="/contact"
              className="aied-btn-primary"
              title="Book an Institutional Demo"
            >
              <span>Book an Institutional Demo</span>
              <ArrowRight size={17} />
            </a>

            <button
              type="button"
              className="aied-btn-secondary"
              onClick={onExploreClick}
              title="Explore Features"
            >
              <span>Explore Features</span>
              <ChevronDown size={17} />
            </button>

            <a
              href="https://education.uwo24.com"
              target="_blank"
              rel="noopener noreferrer"
              className="aied-btn-portal"
              title="Launch Live Education Portal (education.uwo24.com)"
              aria-label="Open Live Education Platform"
            >
              <span>Live Portal</span>
              <ExternalLink size={15} />
            </a>
          </motion.div>

        </div>
      </div>

      {/* Subtle Scroll Cue at Bottom */}
      <motion.div
        className="aied-hero-scroll-cue"
        onClick={onExploreClick}
        role="button"
        tabIndex={0}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <span className="aied-scroll-mouse">
          <span className="aied-scroll-wheel" />
        </span>
      </motion.div>
    </section>
  );
}
