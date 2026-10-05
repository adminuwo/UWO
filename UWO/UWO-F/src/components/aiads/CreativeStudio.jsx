import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Palette, Layers, Sparkles, ExternalLink, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';
import { CREATIVE_VARIATIONS } from '../../constants/aiAdsConstants';
import { fadeInUp, staggerContainer } from '../aieducation/motionVariants';

export default function CreativeStudio() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedRatio, setSelectedRatio] = useState('all');

  const filteredVariations = selectedRatio === 'all' 
    ? CREATIVE_VARIATIONS 
    : CREATIVE_VARIATIONS.filter(v => v.ratio === selectedRatio);

  return (
    <section className="aiads-section" id="creative-studio" style={{ background: '#f8fafc' }}>
      <div className="aiads-container">
        <div className="aiads-section-header">
          <span className="aiads-badge aiads-badge-emerald">
            <Palette size={14} />
            Autonomous Ad Visual Synthesis
          </span>
          <h2 className="aiads-section-title">
            One Core Brief. <br />
            <span className="aiads-gradient-title">Every Commercial Ad Ratio.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Generate pixel-perfect ad banners and social graphics tailored for high conversion rates. 
            AI Ads maintains strict brand color palettes, typography rules, and logo safety margins.
          </p>
        </div>

        {/* Ratio Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
          {['all', '1:1', '16:9', '9:16'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRatio(r)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: `1px solid ${selectedRatio === r ? 'var(--aiads-purple)' : 'var(--aiads-border)'}`,
                background: selectedRatio === r ? 'var(--aiads-purple-light)' : '#ffffff',
                color: selectedRatio === r ? 'var(--aiads-purple)' : 'var(--aiads-text-muted)',
                fontWeight: selectedRatio === r ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {r === 'all' ? 'All Aspect Ratios' : `Ratio ${r}`}
            </button>
          ))}
        </div>

        {/* Multi-Ratio Creative Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredVariations.map((item) => (
            <motion.div
              key={item.id}
              className="aiads-card"
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '20px',
                border: '1px solid var(--aiads-border)',
                background: '#ffffff',
                boxShadow: 'var(--aiads-shadow-sm)'
              }}
            >
              {/* Creative Visual Banner Mockup with Dynamic Gradient */}
              <div 
                style={{
                  height: item.ratio === '9:16' ? '260px' : item.ratio === '16:9' ? '170px' : '220px',
                  background: item.gradient,
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  color: '#ffffff',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.66rem', fontWeight: 800, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', padding: '3px 8px', borderRadius: '4px', fontFamily: 'var(--aiads-font-mono)' }}>
                    RATIO {item.ratio}
                  </span>
                  <span style={{ fontSize: '0.64rem', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px' }}>
                    {item.tag}
                  </span>
                </div>

                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 900, lineHeight: 1.25, margin: '0 0 6px 0', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.74rem', opacity: 0.95, margin: 0, lineHeight: 1.4 }}>
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Bottom Metadata Strip */}
              <div style={{ padding: '16px 20px', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--aiads-text-main)' }}>
                    {item.aspectLabel}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--aiads-text-muted)' }}>
                    {item.badge}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: 'var(--aiads-purple)', fontWeight: 700 }}>
                  <Eye size={13} />
                  <span>8K Canvas</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
