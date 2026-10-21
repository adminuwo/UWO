import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Layers, ArrowRight, Zap, Check, X, ShieldAlert, Sparkles } from 'lucide-react';

const FRAGMENTED_CHIPS = [
  'SEO App ($199/mo)',
  'AI Copywriting ($49/mo)',
  'Design Tool ($89/mo)',
  'Agency Retainer ($5,000/mo)',
  'Landing Page Builder ($149/mo)',
  'Google Drive Media Chaos'
];

export default function ConvergenceSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="aiads-section" id="one-workspace" style={{ background: '#f8fafc', overflow: 'hidden' }}>
      <div className="aiads-container">
        {/* Minimal Header */}
        <div className="aiads-section-header" style={{ marginBottom: '32px' }}>
          <span className="aiads-badge aiads-badge-purple">
            <Layers size={13} />
            Ecosystem Convergence
          </span>
          <h2 className="aiads-section-title">
            Stop Juggling 8 Tools. <span className="aiads-gradient-title">Run One Marketing OS.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Zero cross-tool context loss. Seamless convergence from Brand DNA to live multi-channel campaigns.
          </p>
        </div>

        {/* NON-CARD OBJECT: Interactive Convergence Bridge */}
        <div className="aiads-convergence-bridge-object">
          {/* LEFT: Fragmented Cloud Cluster */}
          <div className="aiads-fragment-cluster">
            <div className="aiads-cluster-header">
              <ShieldAlert size={14} className="text-red-500" />
              <span>THE FRAGMENTED STATUS QUO</span>
            </div>
            <div className="aiads-scattered-nodes">
              {FRAGMENTED_CHIPS.map((chip, idx) => (
                <div key={idx} className="aiads-fractured-chip">
                  <X size={11} className="text-red-500 flex-shrink-0" />
                  <span>{chip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER: Laser Flux Convergence Gate */}
          <div className="aiads-convergence-funnel">
            <div className="aiads-funnel-arrow">
              <Zap size={16} className="text-purple-600 animate-pulse" />
              <span className="aiads-funnel-tag">CONVERGENCE</span>
            </div>
            <div className="aiads-funnel-beam"></div>
          </div>

          {/* RIGHT: Unified Core Reactor */}
          <div className="aiads-unified-target-core">
            <div className="aiads-target-header">
              <Sparkles size={14} className="text-purple-600" />
              <span>UWO™ AI ADS OS</span>
            </div>

            <div className="aiads-target-specs">
              <div className="aiads-target-spec-item">
                <Check size={13} className="text-emerald-500" />
                <span>Single Persistent Brand DNA</span>
              </div>
              <div className="aiads-target-spec-item">
                <Check size={13} className="text-emerald-500" />
                <span>Zero Cross-Tool Context Loss</span>
              </div>
              <div className="aiads-target-spec-item">
                <Check size={13} className="text-emerald-500" />
                <span>Multi-Ratio Graphics &amp; Copy Native</span>
              </div>
              <div className="aiads-target-spec-item">
                <Check size={13} className="text-emerald-500" />
                <span>Direct Programmatic Deployment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Comparison Dock */}
        <div className="aiads-convergence-telemetry-dock">
          <div className="aiads-telemetry-pill">
            <span className="telemetry-stat">8 Bills ➔ 1</span>
            <span className="telemetry-label">Tool Consolidation</span>
          </div>
          <div className="aiads-telemetry-pill">
            <span className="telemetry-stat">14 Days ➔ 60s</span>
            <span className="telemetry-label">Campaign Turnaround</span>
          </div>
          <div className="aiads-telemetry-pill">
            <span className="telemetry-stat">100% Brand Safe</span>
            <span className="telemetry-label">Deterministic Voice</span>
          </div>
        </div>
      </div>
    </section>
  );
}
