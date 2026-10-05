import React from 'react';
import { motion } from 'framer-motion';
import { BEFORE_AFTER_DATA } from '../../constants/uwoConnectConstants';
import { fadeUp, staggerContainer, EASE_PREMIUM } from './motionVariants';

export default function BeforeAfterComparison() {
  const equationItems = [
    { type: 'pill', label: 'Inbound WhatsApp' },
    { type: 'plus', label: '+' },
    { type: 'pill', label: 'Real-time CRM' },
    { type: 'plus', label: '+' },
    { type: 'pill', label: 'RAG AI Assistant' },
    { type: 'plus', label: '+' },
    { type: 'pill', label: 'GST Invoicing' },
    { type: 'plus', label: '+' },
    { type: 'pill', label: 'Instant UPI Pay' },
    { type: 'equals', label: '=' },
    { type: 'result', label: 'UWO Connect™ Unified Platform' },
  ];

  return (
    <section className="uwoc-section uwoc-bg-contrast" id="comparison">
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
            <i className="fa-solid fa-code-compare"></i>
            <span>THE OPERATIONAL SHIFT</span>
          </div>

          <h2 className="uwoc-section-title">
            Stop Switching <span className="uwoc-gradient-gold">Between Tools.</span>
          </h2>

          <p className="uwoc-section-subtitle">
            Compare the friction of juggling fragmented subscriptions against the clean velocity of a single intelligent workspace.
          </p>
        </motion.div>

        {/* Visual Formula Equation with Relaxed Staggered Entrance (identical to AI Legal Differentiator) */}
        <motion.div
          className="uwoc-diff-equation"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer(0.09, 0.12)}
        >
          {equationItems.map((item, idx) => {
            if (item.type === 'pill') {
              return (
                <motion.span
                  className="uwoc-eq-pill"
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -2, scale: 1.04, transition: { duration: 0.2 } }}
                >
                  {item.label}
                </motion.span>
              );
            }
            if (item.type === 'plus') {
              return (
                <motion.span
                  className="uwoc-eq-plus"
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, scale: 0.6 },
                    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
                  }}
                >
                  +
                </motion.span>
              );
            }
            if (item.type === 'equals') {
              return (
                <motion.span
                  className="uwoc-eq-equals"
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, scale: 0.6 },
                    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
                  }}
                >
                  =
                </motion.span>
              );
            }
            return (
              <motion.span
                className="uwoc-eq-result"
                key={idx}
                variants={{
                  hidden: { opacity: 0, scale: 0.9, y: 10 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: { duration: 0.85, ease: EASE_PREMIUM },
                  },
                }}
                whileHover={{ scale: 1.03 }}
              >
                <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: '6px', fontSize: '0.85em' }}></i>
                {item.label}
              </motion.span>
            );
          })}
        </motion.div>

        {/* COMPARISON TABLE / DUAL CARDS WITH STAGGERED ROW REVEAL */}
        <div className="uwoc-comparison-wrapper">
          <div className="uwoc-comp-header-row">
            <div className="uwoc-comp-col-header before">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>Without UWO Connect (Fragmented &amp; Manual)</span>
            </div>
            <div className="uwoc-comp-col-header after">
              <i className="fa-solid fa-circle-check"></i>
              <span>With UWO Connect (Unified &amp; Autonomous)</span>
            </div>
          </div>

          <div className="uwoc-comp-rows-container">
            {BEFORE_AFTER_DATA.map((item, idx) => (
              <motion.div
                key={idx}
                className="uwoc-comp-item-row"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: idx * 0.08, ease: EASE_PREMIUM },
                  },
                }}
                whileHover={{
                  y: -3,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                  transition: { duration: 0.25 },
                }}
              >
                <div className="uwoc-comp-side before">
                  <div className="uwoc-comp-cat">
                    <i className="fa-solid fa-xmark text-red"></i>
                    <span>{item.category}</span>
                  </div>
                  <p>{item.before}</p>
                </div>

                <div className="uwoc-comp-divider">
                  <i className="fa-solid fa-arrow-right"></i>
                </div>

                <div className="uwoc-comp-side after">
                  <div className="uwoc-comp-cat">
                    <i className="fa-solid fa-check text-gold"></i>
                    <span>{item.category}</span>
                  </div>
                  <p>{item.after}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
