import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { AI_ADS_USE_CASES } from '../../constants/aiAdsConstants';
import { fadeInUp, staggerContainer } from '../aieducation/motionVariants';

export default function UseCasesSection() {
  return (
    <section className="aiads-section" id="use-cases" style={{ background: '#f8fafc' }}>
      <div className="aiads-container">
        <div className="aiads-section-header">
          <span className="aiads-badge aiads-badge-blue">
            <Users size={14} />
            Tailored Solutions
          </span>
          <h2 className="aiads-section-title">
            Built for Every <br />
            <span className="aiads-gradient-title">Growth Stage.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Whether you are a solo founder launching your first campaign or an enterprise marketing division 
            managing dozens of global brand accounts, AI Ads adapts to your operational scale.
          </p>
        </div>

        {/* 4 Use Case Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {AI_ADS_USE_CASES.map((uc) => (
            <motion.div
              key={uc.id}
              className="aiads-card"
              whileHover={{ y: -4 }}
              style={{
                padding: '24px',
                background: '#ffffff',
                border: '1px solid var(--aiads-border)',
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: uc.accent, fontFamily: 'var(--aiads-font-mono)', background: `${uc.accent}12`, padding: '3px 8px', borderRadius: '9999px', textTransform: 'uppercase' }}>
                  {uc.id}
                </span>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 850, color: 'var(--aiads-text-main)', margin: '10px 0 6px 0' }}>
                  {uc.title}
                </h4>

                <p style={{ fontSize: '0.8rem', color: 'var(--aiads-text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {uc.subtitle}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {uc.benefits.map((b, bIdx) => (
                    <div key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.74rem', color: '#334155', lineHeight: 1.4 }}>
                      <CheckCircle2 size={13} style={{ color: uc.accent, flexShrink: 0, marginTop: '2px' }} />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--aiads-border-light)', paddingTop: '12px' }}>
                <a
                  href="https://aiads.aisa24.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 700, color: uc.accent, textDecoration: 'none' }}
                >
                  <span>Explore for {uc.id}</span>
                  <ArrowRight size={12} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
