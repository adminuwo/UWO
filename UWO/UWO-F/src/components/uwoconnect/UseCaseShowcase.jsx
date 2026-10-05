import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { USE_CASES_DATA } from '../../constants/uwoConnectConstants';
import { fadeUp, EASE_PREMIUM } from './motionVariants';

export default function UseCaseShowcase() {
  const [scrollState, setScrollState] = useState({ canLeft: false, canRight: true, progress: 0 });

  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // Check scroll position to update arrows and progress bar
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
  }, [checkScroll]);

  const handleScroll = (direction) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const card = track.querySelector('.uwoc-usecase-card');
    const step = card ? card.offsetWidth + 24 : 400;
    const scrollAmount = direction === 'left' ? -step : step;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Drag-to-scroll mouse handlers for desktop
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

  return (
    <section className="uwoc-section uwoc-bg-contrast" id="use-cases">
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
            <i className="fa-solid fa-briefcase"></i>
            <span>PRODUCTION ENTERPRISE PLAYBOOKS</span>
          </div>

          <h2 className="uwoc-section-title">
            Built Around <span className="uwoc-gradient-gold">Real Business Workflows.</span>
          </h2>

          <p className="uwoc-section-subtitle">
            Engineered to solve high-friction bottlenecks across acquisition, commerce, customer satisfaction, and accounting compliance.
          </p>
        </motion.div>

        {/* Carousel Header Toolbar */}
        <div className="uwoc-uc-toolbar">
          <div className="uwoc-uc-meta-pill">
            <i className="fa-solid fa-diagram-project text-emerald"></i>
            <span>6 Battle-Tested Production Workflows</span>
          </div>

          {/* Carousel Arrows */}
          <div className="uwoc-carousel-controls">
            <motion.button
              type="button"
              className="uwoc-carousel-btn"
              onClick={() => handleScroll('left')}
              disabled={!scrollState.canLeft}
              aria-label="Previous playbook"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </motion.button>
            <span className="uwoc-carousel-counter">
              Playbooks
            </span>
            <motion.button
              type="button"
              className="uwoc-carousel-btn"
              onClick={() => handleScroll('right')}
              disabled={!scrollState.canRight}
              aria-label="Next playbook"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </motion.button>
          </div>
        </div>

        {/* Animated Carousel Track Wrapper */}
        <div className="uwoc-carousel-wrapper">
          <div className={`uwoc-carousel-fade fade-left ${scrollState.canLeft ? 'visible' : ''}`} />
          <div className={`uwoc-carousel-fade fade-right ${scrollState.canRight ? 'visible' : ''}`} />

          <div
            ref={trackRef}
            className="uwoc-uc-carousel-track"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUpOrLeave}
            onMouseLeave={onMouseUpOrLeave}
          >
            {USE_CASES_DATA.map((uc, idx) => (
              <motion.div
                key={idx}
                className="uwoc-usecase-card"
                whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_PREMIUM } }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Top Badge & Icon */}
                <div className="uwoc-uc-card-head">
                  <div className="uwoc-uc-icon-wrap">
                    <i className={uc.icon}></i>
                  </div>
                  <span className="uwoc-uc-tag">{uc.tag}</span>
                </div>

                {/* Card Title & Headline */}
                <h3>{uc.title}</h3>
                <p className="uwoc-uc-headline">{uc.headline}</p>

                {/* Structured Step Flow Pills */}
                <div className="uwoc-uc-steps-chain">
                  {uc.steps.map((st, sIdx) => (
                    <div key={sIdx} className="uwoc-uc-step-chip">
                      <span className="uwoc-uc-step-num">0{sIdx + 1}</span>
                      <span className="uwoc-uc-step-label">{st}</span>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p className="uwoc-uc-desc">{uc.desc}</p>

                {/* Card Footer Tag */}
                <div className="uwoc-uc-card-foot">
                  <span className="playbook-badge">
                    <i className="fa-solid fa-circle-check text-emerald"></i>
                    <span>Ready to Deploy</span>
                  </span>
                  <span className="playbook-action">
                    Active Blueprint <i className="fa-solid fa-arrow-right"></i>
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
                width: `${Math.max(16, scrollState.progress * 100)}%`,
              }}
            />
          </div>
          <span className="uwoc-carousel-hint">
            <i className="fa-solid fa-arrows-left-right"></i> Drag or use arrows to explore playbooks
          </span>
        </div>
      </div>
    </section>
  );
}
