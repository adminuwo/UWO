import React from 'react';
import { motion } from 'framer-motion';
import { VALUE_METRICS } from '../../constants/uwoConnectConstants';
import { fadeUp } from './motionVariants';

export default function ValueStrip() {
  return (
    <section className="uwoc-value-strip-section">
      <div className="uwoc-container">
        <motion.div
          className="uwoc-value-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12, delayChildren: 0.1 },
            },
          }}
        >
          {VALUE_METRICS.map((metric, idx) => (
            <motion.div
              className="uwoc-value-card"
              key={idx}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
            >
              <div className="uwoc-value-icon">
                <i className={metric.icon}></i>
              </div>
              <div className="uwoc-value-num">{metric.num}</div>
              <div className="uwoc-value-label">{metric.label}</div>
              <div className="uwoc-value-sub">{metric.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
