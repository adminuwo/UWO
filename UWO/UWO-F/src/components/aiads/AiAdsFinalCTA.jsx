import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight, ExternalLink, Zap, ShieldCheck } from 'lucide-react';
import { AI_ADS_META } from '../../constants/aiAdsConstants';
import { fadeInUp } from '../aieducation/motionVariants';

export default function AiAdsFinalCTA({ onExploreClick }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="aiads-section" id="final-cta" style={{ background: 'radial-gradient(circle at 50% 50%, #faf5ff 0%, #ffffff 80%)', padding: '80px 0' }}>
      <div className="aiads-container" style={{ maxWidth: '840px', textAlign: 'center' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="aiads-badge" style={{ marginBottom: '14px' }}>
            <Sparkles size={13} />
            Autonomous Marketing Velocity
          </span>

          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--aiads-text-main)', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '14px' }}>
            Ready to Run Your Marketing from <br />
            <span className="aiads-gradient-title">One Intelligent Workspace?</span>
          </h2>

          <p style={{ fontSize: '0.96rem', color: 'var(--aiads-text-muted)', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 28px auto' }}>
            Transform raw brand intelligence into strategy, SEO briefs, multi-format creatives, 
            and live landing pages in seconds. Built by UWO™ for high-performance marketing teams.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <a
              href={AI_ADS_META.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="aiads-btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.9rem' }}
            >
              <span>Visit AI Ads Platform</span>
              <ExternalLink size={16} />
            </a>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', padding: '6px 14px', background: '#f8fafc', border: '1px solid var(--aiads-border)', borderRadius: '9999px', fontSize: '0.7rem', color: 'var(--aiads-text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              Live Autonomous Studio
            </span>
            <span style={{ color: 'var(--aiads-border)' }}>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={12} style={{ color: '#7c3aed' }} />
              Enterprise Brand DNA Scoped
            </span>
          </div>

          <div style={{ marginTop: '28px', color: 'var(--aiads-text-subtle)', fontSize: '0.72rem', fontFamily: 'var(--aiads-font-mono)' }}>
            UWO™ · Unified Web Options &amp; Services Pvt. Ltd. · AI Ads™ Autonomous Marketing Platform
          </div>
        </motion.div>
      </div>
    </section>
  );
}
