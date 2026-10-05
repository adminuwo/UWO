import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQS_DATA } from '../../constants/uwoConnectConstants';
import { fadeUp } from './motionVariants';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleIndex = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="uwoc-section uwoc-bg-contrast" id="faq">
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
            <i className="fa-solid fa-circle-question"></i>
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="uwoc-section-title">
            Answers to Common <span className="uwoc-gradient-gold">Product Questions.</span>
          </h2>

          <p className="uwoc-section-subtitle">
            Everything you need to know about channel setup, AI capabilities, CRM features, pricing, and agency white-label solutions.
          </p>
        </motion.div>

        {/* ACCORDION CONTAINER */}
        <div className="uwoc-faq-accordion">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                className={`uwoc-faq-item ${isOpen ? 'open' : ''}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeUp}
              >
                <button
                  type="button"
                  className="uwoc-faq-question-btn"
                  onClick={() => toggleIndex(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="q-num">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}.</span>
                  <span className="q-text">{faq.q}</span>
                  <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} icon-arrow`}></i>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="uwoc-faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                    >
                      <div className="answer-inner">
                        <p>{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
