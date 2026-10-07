import React from 'react';
import { motion } from 'framer-motion';
import { 
  UWO_CONNECT_WEB_URL,
  UWO_CONNECT_ANDROID_URL
} from '../../constants/uwoConnectConstants';
import { fadeUp, btnMotion, EASE_PREMIUM } from './motionVariants';

export default function FinalCtaSection() {
  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const perks = [
    'Official Meta Cloud API Partner',
    'Zero-Code Connectors',
    'Multi-Agent Team Collaboration',
    'GST Tax Invoicing Built-in',
  ];

  return (
    <section className="uwoc-final-cta-section" id="cta">
      <div className="uwoc-cta-glow-mesh" aria-hidden="true" />

      <div className="uwoc-container">
        <motion.div
          className="uwoc-final-cta-box"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="uwoc-eyebrow">
            <span className="uwoc-eyebrow-dot" />
            <i className="fa-solid fa-rocket"></i>
            <span>GET STARTED TODAY</span>
          </div>

          <h2 className="uwoc-final-title">
            Ready to Connect <br />
            <span className="uwoc-gradient-emerald">Your Business?</span>
          </h2>

          <p className="uwoc-final-subtitle">
            Bring conversations, customers, teams and automation into one intelligent workspace. Start responding faster, closing more deals, and scaling operations today.
          </p>

          <div className="uwoc-final-actions">
            <motion.a
              href={UWO_CONNECT_WEB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="uwoc-btn uwoc-btn-emerald uwoc-btn-lg"
              whileHover={btnMotion.hover}
              whileTap={btnMotion.tap}
            >
              <span>Start Free Now</span>
              <i className="fa-solid fa-arrow-right"></i>
            </motion.a>

            <motion.a
              href={UWO_CONNECT_ANDROID_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="uwoc-btn uwoc-btn-secondary uwoc-btn-lg"
              aria-label="Download UWO Connect on Google Play Store"
              whileHover={btnMotion.hover}
              whileTap={btnMotion.tap}
            >
              <i className="fa-brands fa-google-play"></i>
              <span>Get on Google Play</span>
            </motion.a>

            <motion.button
              type="button"
              className="uwoc-btn uwoc-btn-dark-outline uwoc-btn-lg"
              onClick={scrollToFeatures}
              whileHover={btnMotion.hover}
              whileTap={btnMotion.tap}
            >
              <i className="fa-solid fa-shapes"></i>
              <span>Explore Features</span>
            </motion.button>
          </div>

          <div className="uwoc-final-perks">
            {perks.map((perk, idx) => (
              <motion.span 
                key={idx}
                whileHover={{ y: -2, scale: 1.03, transition: { duration: 0.2, ease: EASE_PREMIUM } }}
              >
                <i className="fa-solid fa-check text-emerald"></i> {perk}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
