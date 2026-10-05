import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FEATURE_ECOSYSTEM } from '../../constants/uwoConnectConstants';
import { fadeUp, EASE_PREMIUM } from './motionVariants';

export default function FeatureEcosystem() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFeatureModal, setActiveFeatureModal] = useState(null);
  const [scrollState, setScrollState] = useState({ canLeft: false, canRight: true, progress: 0 });

  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const categories = ['All', 'Communication', 'Sales & CRM', 'AI & Automation', 'Management'];

  const filteredFeatures = selectedCategory === 'All'
    ? FEATURE_ECOSYSTEM
    : FEATURE_ECOSYSTEM.filter((f) => f.category === selectedCategory);

  // Measure and update scroll state
  const checkScroll = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    const maxScroll = scrollWidth - clientWidth;
    setScrollState({
      canLeft: scrollLeft > 10,
      canRight: maxScroll > 10 && scrollLeft < maxScroll - 10,
      progress: maxScroll > 0 ? scrollLeft / maxScroll : 0,
    });
  }, []);

  useEffect(() => {
    checkScroll();
    const track = trackRef.current;
    if (track) {
      track.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        track.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [filteredFeatures, checkScroll]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const handleScroll = (direction) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const card = track.querySelector('.uwoc-feature-card');
    const step = card ? card.offsetWidth + 20 : 360;
    const scrollAmount = direction === 'left' ? -step : step;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Drag to scroll handlers for desktop
  const onMouseDown = (e) => {
    if (!trackRef.current) return;
    isDragging.current = true;
    dragMoved.current = false;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftStart.current = trackRef.current.scrollLeft;
  };

  const onMouseMove = (e) => {
    if (!isDragging.current || !trackRef.current) return;
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.3;
    if (Math.abs(walk) > 6) {
      dragMoved.current = true;
    }
    trackRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const onMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  const handleCardClick = (feat) => {
    if (dragMoved.current) {
      dragMoved.current = false;
      return;
    }
    setActiveFeatureModal(feat);
  };

  return (
    <section className="uwoc-section" id="features">
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
            <i className="fa-solid fa-shapes"></i>
            <span>COMPLETE FEATURE ECOSYSTEM</span>
          </div>

          <h2 className="uwoc-section-title">
            Everything Your Business Needs. <span className="uwoc-gradient-gold">Connected.</span>
          </h2>

          <p className="uwoc-section-subtitle">
            An all-in-one industrial engine engineered to replace fragmented toolsets with clean, native, and deeply integrated SaaS capabilities.
          </p>
        </motion.div>

        {/* Toolbar: Category Filters (Left) + Carousel Controls (Right) */}
        <div className="uwoc-features-toolbar">
          <div className="uwoc-filter-pills">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                type="button"
                className={`uwoc-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                <span>{cat}</span>
                {cat === 'All' && <span className="pill-count">{FEATURE_ECOSYSTEM.length}</span>}
              </motion.button>
            ))}
          </div>

          <div className="uwoc-carousel-controls">
            <motion.button
              type="button"
              className="uwoc-carousel-btn"
              onClick={() => handleScroll('left')}
              disabled={!scrollState.canLeft}
              aria-label="Previous card"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </motion.button>
            <span className="uwoc-carousel-counter">
              {filteredFeatures.length} Modules
            </span>
            <motion.button
              type="button"
              className="uwoc-carousel-btn"
              onClick={() => handleScroll('right')}
              disabled={!scrollState.canRight}
              aria-label="Next card"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </motion.button>
          </div>
        </div>

        {/* Features Carousel Container */}
        <div className="uwoc-carousel-wrapper">
          <div className={`uwoc-carousel-fade fade-left ${scrollState.canLeft ? 'visible' : ''}`} />
          <div className={`uwoc-carousel-fade fade-right ${scrollState.canRight ? 'visible' : ''}`} />

          <div
            ref={trackRef}
            className="uwoc-features-carousel-track"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUpOrLeave}
            onMouseLeave={onMouseUpOrLeave}
          >
            {filteredFeatures.map((feat) => (
              <motion.div
                key={feat.id}
                className="uwoc-feature-card"
                onClick={() => handleCardClick(feat)}
                whileHover={{ y: -6, transition: { duration: 0.28, ease: EASE_PREMIUM } }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="uwoc-feature-top">
                  <div className="uwoc-feature-icon">
                    <i className={feat.icon}></i>
                  </div>
                  <span className="uwoc-feature-tag">{feat.highlight}</span>
                </div>

                <h3>{feat.name}</h3>
                <p>{feat.desc}</p>

                <div className="uwoc-feature-foot">
                  <span className="category-label">{feat.category}</span>
                  <span className="explore-link">
                    Explore Details <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Progress Bar + Drag Hint */}
        <div className="uwoc-carousel-progress">
          <div className="uwoc-carousel-progress-track">
            <div
              className="uwoc-carousel-progress-fill"
              style={{
                width: `${Math.max(14, scrollState.progress * 100)}%`,
              }}
            />
          </div>
          <span className="uwoc-carousel-hint">
            <i className="fa-solid fa-arrows-left-right"></i> Drag or use arrows to explore
          </span>
        </div>

        {/* FEATURE DETAIL POPUP MODAL */}
        <AnimatePresence>
          {activeFeatureModal && (
            <div className="uwoc-modal-backdrop" onClick={() => setActiveFeatureModal(null)}>
              <motion.div
                className="uwoc-modal-content"
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ duration: 0.35, ease: EASE_PREMIUM }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="uwoc-modal-close"
                  onClick={() => setActiveFeatureModal(null)}
                  aria-label="Close modal"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="uwoc-modal-head">
                  <div className="uwoc-modal-icon">
                    <i className={activeFeatureModal.icon}></i>
                  </div>
                  <div>
                    <span className="uwoc-modal-cat">{activeFeatureModal.category}</span>
                    <h3>{activeFeatureModal.name}</h3>
                  </div>
                </div>

                <p className="uwoc-modal-desc">{activeFeatureModal.desc}</p>

                <div className="uwoc-modal-specs">
                  <div className="spec-row">
                    <span className="spec-label">
                      <i className="fa-solid fa-check text-emerald"></i> Core Capability:
                    </span>
                    <span className="spec-value">{activeFeatureModal.highlight}</span>
                  </div>

                  <div className="spec-row">
                    <span className="spec-label">
                      <i className="fa-solid fa-bolt text-emerald"></i> Automation Latency:
                    </span>
                    <span className="spec-value">&lt; 250 milliseconds</span>
                  </div>

                  <div className="spec-row">
                    <span className="spec-label">
                      <i className="fa-solid fa-shield-halved text-emerald"></i> Security &amp; RBAC:
                    </span>
                    <span className="spec-value">Enterprise Tier Isolated</span>
                  </div>

                  <div className="spec-row">
                    <span className="spec-label">
                      <i className="fa-solid fa-cloud text-emerald"></i> Sync Status:
                    </span>
                    <span className="spec-value text-emerald">Live &amp; Bi-directional</span>
                  </div>
                </div>

                <div className="uwoc-modal-actions">
                  <button
                    type="button"
                    className="uwoc-btn uwoc-btn-emerald"
                    onClick={() => setActiveFeatureModal(null)}
                  >
                    <span>Done Exploring</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
