import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Layers, ArrowRight, Check, X, ShieldAlert, Zap } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../aieducation/motionVariants';

const FRAGMENTED_TOOLS = [
  'Disconnected SEO Software ($199/mo)',
  'Generic Copywriting Subscriptions ($49/mo)',
  'Third-Party Banner Design Suites ($89/mo)',
  'External Creative Agency Retainers ($5,000/mo)',
  'Standalone Landing Page Builders ($149/mo)',
  'Isolated Media Vault & Google Drive Chaos'
];

const UNIFIED_BENEFITS = [
  'Single persistent Brand DNA foundation',
  'Autonomous 30-day cross-channel roadmap',
  'Multi-ratio commercial ad creatives (1:1, 16:9, 9:16)',
  'Automated SERP intent & editorial brief generation',
  'Integrated landing page synthesis in 60 seconds',
  'Zero cross-app context loss or tone hallucination'
];

export default function ConvergenceSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="aiads-section" id="one-workspace" style={{ background: '#ffffff' }}>
      <div className="aiads-container">
        <div className="aiads-section-header">
          <span className="aiads-badge aiads-badge-purple">
            <Layers size={14} />
            Ecosystem Convergence
          </span>
          <h2 className="aiads-section-title">
            Stop Juggling 8 Disconnected Tools. <br />
            <span className="aiads-gradient-title">Run Marketing from One OS.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Traditional marketing relies on fragmented tools with zero shared memory. 
            AI Ads consolidates your entire strategy, editorial, design, and web stack into a single workspace.
          </p>
        </div>

        {/* 2-Column Comparison with animated convergence */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
          {/* LEFT: Fragmented Status Quo */}
          <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '20px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <ShieldAlert size={18} style={{ color: '#e11d48' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#9f1239', margin: 0 }}>
                The Fragmented Status Quo
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {FRAGMENTED_TOOLS.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#881337', background: 'rgba(255,255,255,0.7)', padding: '9px 12px', borderRadius: '8px', border: '1px solid #fecdd3' }}>
                  <X size={14} style={{ color: '#e11d48', flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', fontSize: '0.74rem', color: '#9f1239', fontWeight: 600 }}>
              Result: Inconsistent brand voice, endless context switching, and slow campaign turnaround times.
            </div>
          </div>

          {/* RIGHT: Unified AI Ads Workspace */}
          <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '20px', padding: '28px', position: 'relative', boxShadow: '0 10px 30px rgba(124, 58, 237, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: '#7c3aed' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#5b21b6', margin: 0 }}>
                  AI Ads™ Unified Workspace
                </h4>
              </div>
              <span style={{ fontSize: '0.66rem', fontWeight: 700, background: '#7c3aed', color: '#ffffff', padding: '2px 8px', borderRadius: '9999px' }}>
                ALL-IN-ONE
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {UNIFIED_BENEFITS.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#4c1d95', background: '#ffffff', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
                  <Check size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                  <span style={{ fontWeight: 600 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', fontSize: '0.74rem', color: '#5b21b6', fontWeight: 700 }}>
              Result: 10x marketing output, complete brand alignment, and rapid multi-channel scale.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
