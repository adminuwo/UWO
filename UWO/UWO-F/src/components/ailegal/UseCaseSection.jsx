import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { USE_CASES } from '../../constants/aiLegalConstants';
import { fadeUp, EASE_PREMIUM } from './motionVariants';

export default function UseCaseSection() {
  const [activeStepPerCard, setActiveStepPerCard] = useState({});

  const handleStepHover = (cardId, stepIdx) => {
    setActiveStepPerCard((prev) => ({ ...prev, [cardId]: stepIdx }));
  };

  const handleCardLeave = (cardId) => {
    setActiveStepPerCard((prev) => {
      const next = { ...prev };
      delete next[cardId];
      return next;
    });
  };

  return (
    <section className="al-usecases-section" id="use-cases">
      <div className="ai-legal-container">
        {/* Section Header */}
        <motion.div
          className="al-section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="al-eyebrow">
            <i className="fa-solid fa-briefcase"></i>
            <span>Real-World Application</span>
          </div>

          <h2 className="al-section-title">
            From Legal Research to <span className="al-gold-text">Case Strategy.</span>
          </h2>

          <p className="al-section-subtitle">
            Explore step-by-step how advocates and legal teams navigate high-stakes litigation, document scrutiny, and drafting sprints with AI LEGAL™.
          </p>
        </motion.div>

        {/* 6 Use Case Cards with Staggered Entrance */}
        <motion.div
          className="al-usecases-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.14, delayChildren: 0.1 },
            },
          }}
        >
          {USE_CASES.map((uc) => {
            const activeStep = activeStepPerCard[uc.id] ?? 0;

            return (
              <motion.div
                className="al-usecase-card"
                key={uc.id}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.3, ease: EASE_PREMIUM } }}
                onMouseLeave={() => handleCardLeave(uc.id)}
              >
                <div className="al-usecase-top">
                  <span className="al-usecase-num">SCENARIO {uc.number}</span>
                  <span className="al-usecase-badge">4-Step Flow</span>
                </div>

                <h3>{uc.title}</h3>
                <p className="al-usecase-subtitle">{uc.subtitle}</p>

                <div className="al-usecase-flow">
                  {uc.steps.map((st, idx) => {
                    const isStepActive = activeStep === idx;
                    return (
                      <div
                        className={`al-flow-step ${isStepActive ? 'active' : ''}`}
                        key={idx}
                        onMouseEnter={() => handleStepHover(uc.id, idx)}
                        tabIndex={0}
                        onFocus={() => handleStepHover(uc.id, idx)}
                      >
                        <motion.div
                          className="al-flow-circle"
                          animate={isStepActive ? { scale: 1.12, backgroundColor: '#B88E2D', color: '#FFFFFF' } : { scale: 1 }}
                          transition={{ duration: 0.25 }}
                        >
                          {st.step}
                        </motion.div>
                        <div className="al-flow-info">
                          <strong className="al-flow-title">{st.title}: </strong>
                          <span className="al-flow-desc">{st.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
