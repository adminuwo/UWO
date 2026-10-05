import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Dna, CheckCircle2, Sparkles, Globe, ArrowRight, ShieldCheck, 
  RotateCcw, Sliders, Target, HeartHandshake, Eye, Award, Zap
} from 'lucide-react';
import { BRAND_DNA_SIMULATION } from '../../constants/aiAdsConstants';
import { fadeInUp, staggerContainer } from '../aieducation/motionVariants';

const DNA_PILLARS = [
  { id: 'voice', label: 'Voice & Tone Guardrails', icon: Sliders, color: '#7c3aed', desc: 'Enforces vocabulary, formality scale, and forbidden words across outputs.' },
  { id: 'audience', label: 'Audience Personas', icon: Target, color: '#2563eb', desc: 'B2B & B2C demographic pain points, buying triggers, and role motivators.' },
  { id: 'usp', label: 'Value Propositions', icon: Award, color: '#10b981', desc: 'Synthesizes competitive differentiators into high-converting conversion anchors.' },
  { id: 'messaging', label: 'Messaging Pillars', icon: HeartHandshake, color: '#f97316', desc: 'Core thematic narrative pillars binding social, blog, and ad campaigns.' },
  { id: 'provenance', label: 'Data Provenance', icon: ShieldCheck, color: '#06b6d4', desc: 'Exact confidence scores anchoring every generation back to original source assets.' }
];

export default function BrandDnaSection() {
  const shouldReduceMotion = useReducedMotion();
  const [analyzingState, setAnalyzingState] = useState('ready'); // 'ready' | 'analyzing' | 'extracted'
  const [inputUrl, setInputUrl] = useState('https://aeropulse.io');

  const triggerExtraction = () => {
    if (shouldReduceMotion) {
      setAnalyzingState('extracted');
      return;
    }
    setAnalyzingState('analyzing');
    setTimeout(() => {
      setAnalyzingState('extracted');
    }, 1800);
  };

  return (
    <section className="aiads-section" id="brand-dna">
      <div className="aiads-container">
        <div className="aiads-section-header">
          <span className="aiads-badge">
            <Dna size={14} />
            Foundational Intelligence
          </span>
          <h2 className="aiads-section-title">
            Brand DNA™ is the <br />
            <span className="aiads-gradient-title">Single Source of Truth.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Disconnected AI tools hallucinate brand voices because they lack persistent institutional context. 
            AI Ads anchors every single campaign, ad creative, and blog to your centralized Brand DNA.
          </p>
        </div>

        {/* 2-Column Showcase: Interactive Brand DNA Extractor + Foundation Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
          {/* LEFT: Live Interactive Extraction Console */}
          <div style={{ background: '#ffffff', border: '1px solid var(--aiads-border)', borderRadius: '20px', padding: '24px', boxShadow: 'var(--aiads-shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--aiads-border-light)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--aiads-purple-light)', color: 'var(--aiads-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Dna size={16} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, color: 'var(--aiads-text-main)' }}>
                    Brand DNA Extraction Console
                  </h4>
                  <div style={{ fontSize: '0.68rem', color: 'var(--aiads-text-muted)' }}>
                    Multi-Vector Identity Synthesizer
                  </div>
                </div>
              </div>
              <span className="aiads-badge" style={{ margin: 0, padding: '2px 8px', fontSize: '0.64rem' }}>
                Active Studio
              </span>
            </div>

            {/* URL Input Form Simulation */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--aiads-text-muted)', marginBottom: '6px' }}>
                TARGET ASSET OR WEBSITE URL:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, background: 'var(--aiads-bg-input)', border: '1px solid var(--aiads-border)', borderRadius: '10px', padding: '8px 12px' }}>
                  <Globe size={14} style={{ color: 'var(--aiads-text-muted)' }} />
                  <input 
                    type="text" 
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.8rem', color: 'var(--aiads-text-main)', fontFamily: 'var(--aiads-font-mono)' }}
                  />
                </div>
                <button
                  type="button"
                  className="aiads-btn-primary"
                  onClick={triggerExtraction}
                  style={{ padding: '8px 16px', fontSize: '0.78rem', borderRadius: '10px' }}
                >
                  <span>Extract</span>
                  <Zap size={13} />
                </button>
              </div>
            </div>

            {/* Extraction State Visualization */}
            <AnimatePresence mode="wait">
              {analyzingState === 'analyzing' ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ background: 'var(--aiads-purple-light)', border: '1px solid var(--aiads-purple-border)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block', color: 'var(--aiads-purple)', marginBottom: '10px' }}
                  >
                    <Dna size={28} />
                  </motion.div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--aiads-purple)', marginBottom: '4px' }}>
                    Extracting Core Identity Vectors...
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--aiads-text-muted)' }}>
                    Scanning tone coordinates, target personas, and value differentiators.
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="extracted"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '16px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--aiads-purple)' }}>
                      SYNTHESIZED PROFILE: {BRAND_DNA_SIMULATION.company}
                    </div>
                    <span style={{ fontSize: '0.66rem', background: '#dcfce7', color: '#15803d', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                      Confidence: 98.4%
                    </span>
                  </div>

                  {/* Messaging Pillars Chips */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--aiads-text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                      Messaging Pillars:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {BRAND_DNA_SIMULATION.pillars.map((pil, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', background: '#ffffff', padding: '5px 8px', borderRadius: '6px', border: '1px solid #f3e8ff' }}>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>{pil.title}</span>
                          <span style={{ color: 'var(--aiads-purple)', fontWeight: 700, fontSize: '0.68rem' }}>{pil.confidence}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tone Scale */}
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--aiads-text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                      Tone Guardrail Attributes:
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {BRAND_DNA_SIMULATION.toneAttributes.map((attr, idx) => (
                        <span key={idx} style={{ fontSize: '0.68rem', padding: '2px 8px', background: '#ffffff', border: '1px solid #e9d5ff', borderRadius: '9999px', color: '#6b21a8', fontWeight: 600 }}>
                          {attr.trait} ({attr.score})
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Downstream Flow Pillars */}
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--aiads-purple)', fontFamily: 'var(--aiads-font-mono)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              // Persistent Upstream Context
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--aiads-text-main)', marginBottom: '12px', lineHeight: 1.25 }}>
              One Ingestion. Infinite Aligned Generations.
            </h3>
            <p style={{ color: 'var(--aiads-text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Once your Brand DNA is mapped, the platform feeds it directly into every downstream engine. 
              Your copywriters, ad designers, and website builders speak with one unmistakable voice.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {DNA_PILLARS.map((pillar) => {
                const PillIcon = pillar.icon;
                return (
                  <div 
                    key={pillar.id}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '12px', 
                      padding: '12px 14px', 
                      background: '#ffffff', 
                      border: '1px solid var(--aiads-border)', 
                      borderRadius: '12px',
                      boxShadow: 'var(--aiads-shadow-sm)'
                    }}
                  >
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '8px', 
                      background: `${pillar.color}15`, 
                      color: pillar.color, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <PillIcon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--aiads-text-main)', marginBottom: '2px' }}>
                        {pillar.label}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--aiads-text-muted)', lineHeight: 1.45 }}>
                        {pillar.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
