import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Dna, CheckCircle2, Sparkles, Globe, ArrowRight, ShieldCheck, 
  RotateCcw, Sliders, Target, HeartHandshake, Eye, Award, Zap, Activity
} from 'lucide-react';
import { BRAND_DNA_SIMULATION } from '../../constants/aiAdsConstants';

const DNA_VECTORS = [
  { id: 'voice', label: 'Tone & Formality Spectrum', score: 98.4, color: '#7c3aed' },
  { id: 'audience', label: 'Audience Persona Resonance', score: 96.2, color: '#2563eb' },
  { id: 'usp', label: 'Value Anchor Synthesizer', score: 99.1, color: '#10b981' },
  { id: 'messaging', label: 'Narrative Campaign Pillars', score: 97.5, color: '#f97316' }
];

export default function BrandDnaSection() {
  const shouldReduceMotion = useReducedMotion();
  const [analyzingState, setAnalyzingState] = useState('extracted');
  const [inputUrl, setInputUrl] = useState('https://aeropulse.io');

  const triggerExtraction = () => {
    setAnalyzingState('analyzing');
    setTimeout(() => {
      setAnalyzingState('extracted');
    }, 1200);
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
            Brand DNA™ is the <span className="aiads-gradient-title">Single Source of Truth.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Persistent institutional identity anchoring every generation with 100% tone fidelity.
          </p>
        </div>

        {/* Integrated Brand DNA Vector Spectrogram (Visual Instrument - ZERO CARDS) */}
        <div className="aiads-dna-instrument">
          {/* Top Scanner Ribbon */}
          <div className="aiads-dna-scanner-bar">
            <div className="aiads-scanner-input-wrap">
              <Globe size={14} className="text-slate-400" />
              <input 
                type="text" 
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="aiads-scanner-input"
                placeholder="Enter company URL..."
              />
            </div>
            <button
              type="button"
              className="aiads-btn-primary"
              onClick={triggerExtraction}
              style={{ padding: '8px 18px', fontSize: '0.78rem' }}
            >
              <span>Scan Identity</span>
              <Zap size={13} />
            </button>
            <div className="aiads-scanner-status">
              <span className="aiads-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              <span>Vector Namespace: Active</span>
            </div>
          </div>

          {/* Middle: 4 Dynamic Vector Gauges */}
          <div className="aiads-dna-gauges-grid">
            {DNA_VECTORS.map((vec) => (
              <div key={vec.id} className="aiads-dna-gauge-tile">
                <div className="aiads-gauge-head">
                  <span className="aiads-gauge-label">{vec.label}</span>
                  <span className="aiads-gauge-score" style={{ color: vec.color }}>{vec.score}%</span>
                </div>
                <div className="aiads-gauge-track">
                  <motion.div 
                    className="aiads-gauge-fill"
                    style={{ background: vec.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${vec.score}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom: Synthesized Persona & Tone Pill Cloud */}
          <div className="aiads-dna-footer-strip">
            <div className="aiads-dna-chips-left">
              <span className="aiads-dna-chip-head">SYNTHESIZED TRAITS:</span>
              {BRAND_DNA_SIMULATION.toneAttributes.map((attr, idx) => (
                <span key={idx} className="aiads-dna-trait-pill">
                  {attr.trait} · <strong style={{ color: '#7c3aed' }}>{attr.score}</strong>
                </span>
              ))}
            </div>
            <div className="aiads-dna-chips-right">
              <span className="aiads-badge" style={{ margin: 0, padding: '2px 8px', fontSize: '0.66rem' }}>
                <ShieldCheck size={11} style={{ marginRight: 4, color: '#10b981' }} />
                Zero Hallucination Anchor
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
