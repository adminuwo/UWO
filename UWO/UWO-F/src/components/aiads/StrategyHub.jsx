import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Compass, Calendar, ArrowRight, CheckCircle2, TrendingUp, Layers, Zap } from 'lucide-react';
import { STRATEGY_ROADMAP_WEEKS } from '../../constants/aiAdsConstants';
import { fadeInUp, staggerContainer } from '../aieducation/motionVariants';

export default function StrategyHub() {
  const shouldReduceMotion = useReducedMotion();
  const [activeWeek, setActiveWeek] = useState(0);

  return (
    <section className="aiads-section" id="strategy-hub" style={{ background: '#f8fafc' }}>
      <div className="aiads-container">
        <div className="aiads-section-header">
          <span className="aiads-badge aiads-badge-coral">
            <Compass size={14} />
            Autonomous Roadmap Planning
          </span>
          <h2 className="aiads-section-title">
            Dynamic 30-Day Strategy Hub, <br />
            <span className="aiads-gradient-title">Orchestrated in Advance.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Say goodbye to reactive marketing scrambles. AI Ads generates a structured, multi-channel 
            4-week go-to-market blueprint allocating cadence, budget, and creative assets.
          </p>
        </div>

        {/* 4-Week Strategic Roadmap Rail */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', position: 'relative' }}>
          {STRATEGY_ROADMAP_WEEKS.map((week, idx) => {
            const isSelected = activeWeek === idx;
            return (
              <motion.div
                key={idx}
                className="aiads-card"
                onClick={() => setActiveWeek(idx)}
                whileHover={{ y: -4 }}
                style={{
                  padding: '24px',
                  cursor: 'pointer',
                  borderColor: isSelected ? week.color : 'var(--aiads-border)',
                  boxShadow: isSelected ? `0 10px 30px ${week.color}25` : 'var(--aiads-shadow-sm)',
                  background: '#ffffff',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.74rem', fontFamily: 'var(--aiads-font-mono)', fontWeight: 800, color: week.color }}>
                    {week.week}
                  </span>
                  <span style={{ fontSize: '0.64rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: `${week.color}15`, color: week.color }}>
                    {week.badge}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--aiads-text-main)', marginBottom: '14px', lineHeight: 1.3 }}>
                  {week.theme}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {week.deliverables.map((item, dIdx) => (
                    <div key={dIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.76rem', color: 'var(--aiads-text-muted)', lineHeight: 1.4 }}>
                      <CheckCircle2 size={13} style={{ color: week.color, flexShrink: 0, marginTop: '2px' }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {isSelected && !shouldReduceMotion && (
                  <motion.div
                    layoutId="activeStrategyGlow"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: week.color,
                      borderRadius: '0 0 16px 16px'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
