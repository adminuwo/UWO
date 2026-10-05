import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  RotateCw, Dna, Compass, FileText, Palette, 
  Send, Globe, BarChart2, TrendingUp, Sparkles, Zap 
} from 'lucide-react';
import { fadeInUp } from '../aieducation/motionVariants';

const FLYWHEEL_STAGES = [
  { id: 'brand', label: 'Brand DNA', icon: Dna, color: '#7c3aed' },
  { id: 'strategy', label: 'Strategy', icon: Compass, color: '#f97316' },
  { id: 'content', label: 'Content', icon: FileText, color: '#06b6d4' },
  { id: 'creative', label: 'Creative', icon: Palette, color: '#10b981' },
  { id: 'campaign', label: 'Campaign', icon: Send, color: '#ec4899' },
  { id: 'website', label: 'Website', icon: Globe, color: '#f59e0b' },
  { id: 'data', label: 'Data', icon: BarChart2, color: '#2563eb' },
  { id: 'opt', label: 'Optimization', icon: TrendingUp, color: '#7c3aed' }
];

export default function MarketingFlywheel() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="aiads-section" id="flywheel" style={{ background: '#ffffff' }}>
      <div className="aiads-container">
        <div className="aiads-section-header">
          <span className="aiads-badge aiads-badge-pink">
            <RotateCw size={14} />
            Compounding Growth Architecture
          </span>
          <h2 className="aiads-section-title">
            The Autonomous <br />
            <span className="aiads-gradient-title">Marketing Flywheel.</span>
          </h2>
          <p className="aiads-section-subtitle">
            AI Ads is not a disconnected one-off prompt generator. It is a compounding operating loop 
            where campaign performance data continuously refines your Brand DNA and future roadmaps.
          </p>
        </div>

        {/* Circular Flywheel Visual Layout */}
        <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Ambient Rotating SVG Track */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <circle cx="50%" cy="50%" r="180" fill="none" stroke="rgba(124, 58, 237, 0.12)" strokeWidth="2" strokeDasharray="6 8" />
            <circle cx="50%" cy="50%" r="240" fill="none" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="1" strokeDasharray="4 6" />

            {!shouldReduceMotion && (
              <motion.circle
                r="4"
                fill="#7c3aed"
                animate={{
                  cx: ['50%', '75%', '50%', '25%', '50%'],
                  cy: ['20%', '50%', '80%', '50%', '20%']
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </svg>

          {/* Central Hub Core */}
          <div style={{ 
            width: '160px', 
            height: '160px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#ffffff',
            boxShadow: '0 12px 35px rgba(124, 58, 237, 0.3)',
            zIndex: 4,
            textAlign: 'center',
            padding: '16px'
          }}>
            <Sparkles size={24} style={{ marginBottom: '4px' }} />
            <div style={{ fontSize: '0.88rem', fontWeight: 900 }}>AI ADS™</div>
            <div style={{ fontSize: '0.66rem', opacity: 0.9, fontFamily: 'var(--aiads-font-mono)' }}>Flywheel Engine</div>
          </div>
        </div>

        {/* Linear Stage Pills - Exactly 2 rows (4 per row) */}
        <div className="aiads-flywheel-grid">
          {FLYWHEEL_STAGES.map((stg, i) => {
            const Icon = stg.icon;
            return (
              <div
                key={stg.id}
                style={{
                  background: '#ffffff',
                  border: `1px solid var(--aiads-border)`,
                  borderRadius: '12px',
                  padding: '12px 14px',
                  textAlign: 'center',
                  boxShadow: 'var(--aiads-shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${stg.color}15`, color: stg.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} />
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--aiads-text-main)', whiteSpace: 'nowrap' }}>
                  {stg.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
