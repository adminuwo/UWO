import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { fadeInUp } from './motionVariants';

export default function FinalCTA({ onExploreClick }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="aied-final-cta-section" id="final-cta">
      <div className="aied-container" style={{ maxWidth: '840px', position: 'relative' }}>
        {/* Subtle Ambient Breathing Radial Glow */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '450px',
            height: '250px',
            background: 'radial-gradient(ellipse, rgba(0, 184, 122, 0.18) 0%, rgba(22, 184, 232, 0.08) 50%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
          animate={shouldReduceMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={fadeInUp}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <span className="aied-badge" style={{ marginBottom: '12px' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00b87a', display: 'inline-block', boxShadow: '0 0 5px #00b87a' }}></span>
            <Cpu size={12} />
            Institutional Deployment
          </span>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 850, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '10px' }}>
            Build the Future of <br />
            <span className="aied-gradient-emerald">Academic Operations.</span>
          </h2>

          <p style={{ fontSize: '0.86rem', color: 'var(--aied-text-muted)', lineHeight: 1.5, maxWidth: '580px', margin: '0 auto 20px auto' }}>
            One intelligent platform for institutions, educators, students and families. 
            Transform timetables, examinations, admissions, and learning with curriculum-grounded AI.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <motion.a 
              href="https://education.uwo24.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="aied-btn-primary"
              style={{ padding: '9px 22px', fontSize: '0.82rem' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Open Platform</span>
              <ExternalLink size={14} />
            </motion.a>
          </div>

          {/* Operational Status Strip */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', padding: '6px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--aied-border)', borderRadius: '9999px', fontSize: '0.68rem', color: 'var(--aied-text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00b87a', boxShadow: '0 0 6px #00b87a' }}></span>
              Production Ready v2.6
            </span>
            <span style={{ color: 'var(--aied-border)' }}>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <ShieldCheck size={11} style={{ color: 'var(--aied-cyan)' }} />
              Zero-BOLA Tenancy
            </span>
          </div>

          <div style={{ marginTop: '24px', color: 'var(--aied-text-subtle)', fontSize: '0.72rem', fontFamily: 'var(--aied-font-mono)' }}>
            UWO™ · Unified Web Options &amp; Services Pvt. Ltd. · Convee AI Education Operating System
          </div>
        </motion.div>
      </div>
    </section>
  );
}
