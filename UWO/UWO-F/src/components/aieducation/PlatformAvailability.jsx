import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Globe, Smartphone, Apple, ExternalLink, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { PLATFORM_SPECS } from '../../constants/aiEducationConstants';
import { fadeInUp, staggerContainer } from './motionVariants';

const PLATFORM_ICONS = {
  'Web Application': Globe,
  'Android Mobile App': Smartphone,
  'iOS Mobile App': Apple
};

export default function PlatformAvailability() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="aied-section" id="platform-availability">
      <div className="aied-container">
        <div className="aied-section-header">
          <span className="aied-badge aied-badge-cyan">
            <Globe size={14} />
            Cross-Platform Availability
          </span>
          <h2 className="aied-section-title">
            Academic Intelligence, <br />
            <span className="aied-gradient-emerald">Wherever Learning Happens.</span>
          </h2>
          <p className="aied-section-subtitle">
            Deploy across desktop browser smart-boards, laboratory computer stations, and native mobile smartphones 
            with zero device fragmentation.
          </p>
        </div>

        <motion.div 
          className="aied-trust-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
        >
          {PLATFORM_SPECS.map((spec, i) => {
            const Icon = PLATFORM_ICONS[spec.platform] || Globe;
            const floatDelay = i * 0.4;
            return (
              <motion.div 
                key={i} 
                className="aied-trust-card"
                variants={fadeInUp}
                whileHover={{ y: -5, borderColor: 'var(--aied-emerald)' }}
                animate={shouldReduceMotion ? {} : { y: [0, -3, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, delay: floatDelay, ease: 'easeInOut' }}
                style={{ position: 'relative' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div className="aied-trust-icon" style={{ color: 'var(--aied-emerald)', background: 'var(--aied-emerald-surface)', marginBottom: 0 }}>
                    <Icon size={18} />
                  </div>
                  <span style={{ fontSize: '0.66rem', color: 'var(--aied-cyan)', fontFamily: 'var(--aied-font-mono)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#16b8e8', boxShadow: '0 0 5px #16b8e8' }}></span>
                    {spec.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                  {spec.platform}
                </h3>

                <div style={{ fontSize: '0.72rem', color: 'var(--aied-emerald)', fontFamily: 'var(--aied-font-mono)', fontWeight: 600, marginBottom: '8px' }}>
                  {spec.tech}
                </div>

                <p style={{ fontSize: '0.76rem', color: 'var(--aied-text-muted)', lineHeight: 1.45, marginBottom: '16px' }}>
                  {spec.specs}
                </p>

                <a 
                  href={spec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aied-btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', padding: '7px 12px', fontSize: '0.78rem' }}
                >
                  <span>Launch on Web</span>
                  <ExternalLink size={13} />
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
