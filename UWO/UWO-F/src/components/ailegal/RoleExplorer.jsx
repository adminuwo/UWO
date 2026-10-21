import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { LEGAL_ROLES } from '../../constants/aiLegalConstants';
import { fadeUp } from './motionVariants';

export default function RoleExplorer() {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef(null);

  // Track scroll progress through the 250vh section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Sync active persona tab as user scrolls through the section
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.35) {
      setActiveIdx(0);
    } else if (latest < 0.70) {
      setActiveIdx(1);
    } else {
      setActiveIdx(2);
    }
  });

  // Clicking tab smoothly scrolls to that persona's position
  const scrollToTab = (index) => {
    setActiveIdx(index);
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const sectionTop = scrollTop + rect.top;
    const scrollDistance = sectionRef.current.offsetHeight - window.innerHeight;

    const targets = [0.08, 0.50, 0.88];
    const targetY = sectionTop + scrollDistance * targets[index];
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const currentRole = LEGAL_ROLES[activeIdx];

  return (
    <section className="al-roles-section" id="roles" ref={sectionRef}>
      {/* Pinned Viewport Container (stays anchored during scroll animation, exactly matching the screenshot view) */}
      <div className="al-roles-pin-wrapper">
        <div className="al-roles-container">
          {/* Section Header: Centered & Clean below navbar */}
          <motion.div
            className="al-section-header al-roles-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            <h2 className="al-section-title">
              Built Around the People Who <span className="al-gold-text">Practice Law.</span>
            </h2>
          </motion.div>

          {/* Quick Persona Navigation Tabs */}
          <div className="al-role-selector-tabs" role="tablist" aria-label="Legal Practice Roles">
            {LEGAL_ROLES.map((role, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={role.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`al-role-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => scrollToTab(idx)}
                >
                  <span className="al-role-tab-content">
                    <i className={`fa-solid ${role.icon}`}></i>
                    <span>{role.title}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Card Stage: Displays the active card in the exact position, switching cleanly on scroll */}
          <div className="al-roles-card-stage">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRole.id}
                id={`role-card-${currentRole.id}`}
                className="al-role-active-card-wrapper"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="al-role-detail-card al-waterfall-card">
                  {/* Card Header (Horizontal Layout) */}
                  <div className="al-role-top">
                    <div className="al-role-top-meta">
                      <div className="al-role-badge-row">
                        <span className="al-eyebrow al-eyebrow-xs">
                          {currentRole.badge}
                        </span>
                        <span className="al-role-counter">PERSONA 0{activeIdx + 1} OF 03</span>
                      </div>
                      <h3 className="al-role-card-heading">
                        <i className={`fa-solid ${currentRole.icon}`} style={{ color: 'var(--al-gold)', marginRight: '8px' }}></i>
                        {currentRole.title}
                      </h3>
                    </div>
                    <p className="al-role-summary">{currentRole.summary}</p>
                  </div>

                  {/* Problems vs AI Legal Solution Grid */}
                  <div className="al-role-grid-2">
                    {/* The Challenges */}
                    <div className="al-role-box">
                      <div className="al-role-box-title">
                        <i className="fa-solid fa-triangle-exclamation" style={{ color: '#ef4444' }}></i>
                        <span>Practice Challenges &amp; Bottlenecks</span>
                      </div>
                      <ul className="al-role-list problems">
                        {currentRole.problems.map((prob, idx) => (
                          <li key={idx}>
                            <i className="fa-solid fa-xmark"></i>
                            <span>{prob}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* The AI Legal Solution */}
                    <div className="al-role-box">
                      <div className="al-role-box-title">
                        <i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'var(--al-gold)' }}></i>
                        <span>The AI LEGAL™ Solution</span>
                      </div>
                      <p className="al-role-solution-desc">
                        {currentRole.solution}
                      </p>
                      <div className="al-role-modules-wrap">
                        <span className="al-role-modules-label">
                          Relevant Modules:
                        </span>
                        <div className="al-role-modules-list">
                          {currentRole.modules.map((mod, idx) => (
                            <span
                              key={idx}
                              className="al-role-module-tag"
                            >
                              {mod}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3-Step Practice Workflow */}
                  <div className="al-role-workflow-section">
                    <div className="al-role-workflow-title">
                      <i className="fa-solid fa-arrow-progress" style={{ color: 'var(--al-gold)', marginRight: '7px' }}></i>
                      Example Practice Workflow:
                    </div>

                    <div className="al-role-workflow-grid">
                      {currentRole.workflow.map((item, idx) => (
                        <div className="al-role-step-card" key={idx}>
                          <div className="al-role-step-num">STAGE {item.step}</div>
                          <div className="al-role-step-title">{item.title}</div>
                          <p className="al-role-step-desc">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
