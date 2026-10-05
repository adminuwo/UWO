import React from 'react';
import { motion } from 'framer-motion';
import { COMPARISON_POINTS } from '../../constants/aiLegalConstants';
import { fadeUp, EASE_PREMIUM } from './motionVariants';

export default function DifferentiatorSection() {
  const equationItems = [
    { type: 'pill', label: 'AI Assistant' },
    { type: 'plus', label: '+' },
    { type: 'pill', label: 'Case Context' },
    { type: 'plus', label: '+' },
    { type: 'pill', label: 'Legal Research' },
    { type: 'plus', label: '+' },
    { type: 'pill', label: 'Evidence Vault' },
    { type: 'plus', label: '+' },
    { type: 'pill', label: 'Drafting Suite' },
    { type: 'plus', label: '+' },
    { type: 'pill', label: 'Client Connect' },
    { type: 'equals', label: '=' },
    { type: 'result', label: 'AI LEGAL™ Operating System' },
  ];

  return (
    <section className="al-diff-section" id="differentiator">
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
            <i className="fa-solid fa-code-compare"></i>
            <span>Architectural Distinction</span>
          </div>

          <h2 className="al-section-title">
            More Than a <span className="al-gold-text">Chatbot.</span>
          </h2>

          <p className="al-section-subtitle">
            Generic AI chat models provide conversational responses without matter memory, court procedural rules, or document indexing. AI LEGAL™ is a complete, connected legal operating system.
          </p>
        </motion.div>

        {/* Visual Formula Equation with Relaxed Staggered Entrance */}
        <motion.div
          className="al-diff-equation"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.11, delayChildren: 0.15 },
            },
          }}
        >
          {equationItems.map((item, idx) => {
            if (item.type === 'pill') {
              return (
                <motion.span
                  className="al-eq-pill"
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -2, scale: 1.04, transition: { duration: 0.25 } }}
                >
                  {item.label}
                </motion.span>
              );
            }
            if (item.type === 'plus') {
              return (
                <motion.span
                  className="al-eq-plus"
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, scale: 0.6 },
                    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
                  }}
                >
                  +
                </motion.span>
              );
            }
            if (item.type === 'equals') {
              return (
                <motion.span
                  className="al-eq-equals"
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, scale: 0.6 },
                    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
                  }}
                >
                  =
                </motion.span>
              );
            }
            return (
              <motion.span
                className="al-eq-result"
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
                <i className="fa-solid fa-sparkles" style={{ marginRight: '6px', fontSize: '0.85em' }}></i>
                {item.label}
              </motion.span>
            );
          })}
        </motion.div>

        {/* Comparison Matrix Table with Staggered Rows */}
        <motion.div
          style={{ overflowX: 'auto' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
        >
          <table className="al-diff-table" aria-label="Comparison between Generic AI Chat and AI Legal Platform">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Capability Dimension</th>
                <th style={{ width: '37%' }}>Generic AI Chatbots</th>
                <th className="al-th-ailegal" style={{ width: '38%' }}>
                  <i className="fa-solid fa-shield-halved" style={{ marginRight: '6px' }}></i>
                  AI LEGAL™ Legal Intelligence
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_POINTS.map((pt, idx) => (
                <motion.tr
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, delay: idx * 0.08, ease: EASE_PREMIUM },
                    },
                  }}
                >
                  <td className="al-diff-dim">{pt.dimension}</td>
                  <td className="al-diff-generic">{pt.genericAi}</td>
                  <td className="al-diff-highlight">
                    <span className="al-diff-highlight-badge">
                      <i className="fa-solid fa-check" style={{ color: 'var(--al-gold)', marginRight: '6px' }}></i>
                      {pt.aiLegal}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
