import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ECOSYSTEM_NODES } from '../../constants/aiLegalConstants';
import { fadeUp, EASE_PREMIUM } from './motionVariants';

export default function EcosystemSection() {
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeDot, setActiveDot] = useState(0);
  const trackRef = useRef(null);

  const checkScrollState = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    const cardTotalWidth = 340;
    const index = Math.round(scrollLeft / cardTotalWidth);
    setActiveDot(Math.min(Math.max(index, 0), ECOSYSTEM_NODES.length - 1));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    checkScrollState();
    track.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState);
    return () => {
      track.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [checkScrollState]);

  const handleScroll = (direction) => {
    if (!trackRef.current) return;
    const scrollAmount = 340;
    trackRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const scrollToCard = (index) => {
    if (!trackRef.current) return;
    trackRef.current.scrollTo({
      left: index * 340,
      behavior: 'smooth',
    });
  };

  return (
    <section className="al-ecosystem-section" id="ecosystem">
      <div className="ai-legal-container">
        {/* Section Header: Clean Heading without dense subtitle text */}
        <motion.div
          className="al-section-header al-eco-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="al-eyebrow">
            <i className="fa-solid fa-network-wired"></i>
            <span>Interconnected Legal OS</span>
          </div>

          <h2 className="al-section-title">
            One Platform. <span className="al-gold-text">Complete Legal Intelligence.</span>
          </h2>
        </motion.div>

        {/* 1-Line Slider Carousel with Left & Right Arrows */}
        <div className="al-eco-carousel-wrapper">
          {/* Left Arrow Button */}
          <button
            type="button"
            className="al-eco-slider-btn al-eco-slider-prev"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous modules"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          {/* Single-Row Scrollable Track */}
          <div
            className="al-eco-carousel-track"
            ref={trackRef}
            onScroll={checkScrollState}
          >
            {ECOSYSTEM_NODES.map((node) => {
              const isHovered = hoveredNodeId === node.id;

              return (
                <motion.div
                  key={node.id}
                  className={`al-ecosystem-card ${isHovered ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  whileHover={{ y: -6, transition: { duration: 0.25, ease: EASE_PREMIUM } }}
                  tabIndex={0}
                >
                  {/* Subtle Hover Gradient Glow Frame */}
                  <div className="al-eco-card-glow" />

                  {/* Top Row: Floating Icon + Clean Badge */}
                  <div className="al-eco-card-top">
                    <motion.div 
                      className="al-eco-icon-wrap"
                      animate={isHovered ? { scale: 1.1, rotate: [0, -3, 3, 0] } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <i className={`fa-solid ${node.icon}`}></i>
                    </motion.div>
                    <span className="al-eco-badge">{node.badge}</span>
                  </div>

                  {/* Content */}
                  <h3 className="al-eco-title">{node.title}</h3>
                  <p className="al-eco-desc">{node.description}</p>

                  {/* Bottom Highlight Pill */}
                  <div className="al-eco-footer">
                    <span className="al-eco-highlight-pill">
                      <i className="fa-solid fa-sparkles"></i>
                      <span>{node.highlight}</span>
                    </span>
                    <span className="al-eco-arrow">
                      <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            className="al-eco-slider-btn al-eco-slider-next"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next modules"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        {/* Minimalist Dot Indicators */}
        <div className="al-eco-dots-nav">
          {ECOSYSTEM_NODES.map((node, idx) => (
            <button
              key={node.id}
              type="button"
              className={`al-eco-dot-indicator ${activeDot === idx ? 'active' : ''}`}
              onClick={() => scrollToCard(idx)}
              aria-label={`Slide to ${node.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
