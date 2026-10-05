import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Lock, KeyRound, Server, EyeOff, FileCode, CheckCircle2 } from 'lucide-react';
import { SECURITY_STANDARDS } from '../../constants/aiEducationConstants';
import { fadeInUp, staggerContainer } from './motionVariants';

const TRUST_ICONS = [
  ShieldCheck,
  Lock,
  KeyRound,
  EyeOff,
  Server,
  FileCode
];

export default function TrustSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="aied-section" id="security-governance">
      <div className="aied-container">
        <div className="aied-section-header">
          <span className="aied-badge">
            <ShieldCheck size={14} />
            Institutional Governance &amp; Security
          </span>
          <h2 className="aied-section-title">
            Enterprise Security &amp; <br />
            <span className="aied-gradient-emerald">CASA Tier-2 Compliance.</span>
          </h2>
          <p className="aied-section-subtitle">
            Engineered in strict accordance with Cloud Application Security Assessment Tier-2 guidelines, 
            OWASP Top 10 standards, and student data privacy principles.
          </p>
        </div>

        <motion.div 
          className="aied-trust-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
        >
          {SECURITY_STANDARDS.map((std, i) => {
            const Icon = TRUST_ICONS[i] || ShieldCheck;
            return (
              <motion.div 
                key={i} 
                className="aied-trust-card"
                variants={fadeInUp}
                whileHover={{ y: -4, borderColor: 'var(--aied-emerald)' }}
                style={{ position: 'relative' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div className="aied-trust-icon" style={{ color: 'var(--aied-emerald)', background: 'var(--aied-emerald-surface)', marginBottom: 0 }}>
                    <Icon size={18} />
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.3 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0, 184, 122, 0.08)', border: '1px solid rgba(0, 184, 122, 0.25)', borderRadius: '4px', padding: '2px 6px' }}
                  >
                    <CheckCircle2 size={10} style={{ color: 'var(--aied-emerald)' }} />
                    <span style={{ fontSize: '0.62rem', color: 'var(--aied-emerald)', fontFamily: 'var(--aied-font-mono)', fontWeight: 700 }}>
                      VERIFIED
                    </span>
                  </motion.div>
                </div>

                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                  {std.title}
                </h3>
                <p style={{ fontSize: '0.76rem', color: 'var(--aied-text-muted)', lineHeight: 1.45, margin: 0 }}>
                  {std.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
