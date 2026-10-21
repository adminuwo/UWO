import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  RotateCw, Dna, Compass, FileText, Palette, 
  Send, Globe, BarChart2, TrendingUp, Sparkles, Activity 
} from 'lucide-react';

const FLYWHEEL_NODES = [
  { id: 'brand', label: 'Brand DNA', angle: 0, icon: Dna, color: '#7c3aed', telemetry: 'Ingests live audience sentiment to calibrate brand vectors.' },
  { id: 'strategy', label: 'Strategy', angle: 45, icon: Compass, color: '#f97316', telemetry: 'Calculates 30-day budget & channel velocity roadmap.' },
  { id: 'content', label: 'Content', angle: 90, icon: FileText, color: '#06b6d4', telemetry: 'Generates native LinkedIn, X, Meta, & Email copy streams.' },
  { id: 'creative', label: 'Creative', angle: 135, icon: Palette, color: '#10b981', telemetry: 'Synthesizes pixel-accurate 1:1, 16:9, and 9:16 banner assets.' },
  { id: 'campaign', label: 'Campaign', angle: 180, icon: Send, color: '#ec4899', telemetry: 'Automates programmatic delivery into Meta & Google Ads APIs.' },
  { id: 'website', label: 'Website', angle: 225, icon: Globe, color: '#f59e0b', telemetry: 'Deploys dedicated high-conversion landing page variants.' },
  { id: 'data', label: 'Telemetry', angle: 270, icon: BarChart2, color: '#2563eb', telemetry: 'Monitors real-time CTR, CPA, and conversion signals.' },
  { id: 'opt', label: 'Auto-Opt', angle: 315, icon: TrendingUp, color: '#7c3aed', telemetry: 'Feeds performance outcomes back into Brand DNA perpetually.' }
];

export default function MarketingFlywheel() {
  const shouldReduceMotion = useReducedMotion();
  const [activeNodeId, setActiveNodeId] = useState('brand');
  const activeNode = FLYWHEEL_NODES.find(n => n.id === activeNodeId) || FLYWHEEL_NODES[0];

  return (
    <section className="aiads-section" id="flywheel" style={{ background: '#ffffff', overflow: 'hidden' }}>
      <div className="aiads-container">
        {/* Minimal Header */}
        <div className="aiads-section-header" style={{ marginBottom: '28px' }}>
          <span className="aiads-badge aiads-badge-pink">
            <RotateCw size={13} className="animate-spin" />
            Closed Loop Compounding Growth
          </span>
          <h2 className="aiads-section-title">
            Autonomous <span className="aiads-gradient-title">Marketing Flywheel.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Not a disconnected prompt tool. A compounding closed loop where performance data refines future outputs.
          </p>
        </div>

        {/* NON-CARD OBJECT: Interactive Planetary Rotor Stage */}
        <div className="aiads-flywheel-rotor-stage">
          {/* Orbital Track Scope */}
          <div className="aiads-rotor-orbit-container">
            {/* SVG Track Rings */}
            <svg className="aiads-rotor-svg">
              <circle cx="50%" cy="50%" r="145" fill="none" stroke="rgba(124, 58, 237, 0.15)" strokeWidth="1.5" strokeDasharray="6 8" />
              <circle cx="50%" cy="50%" r="195" fill="none" stroke="rgba(37, 99, 235, 0.1)" strokeWidth="1" strokeDasharray="3 6" />
            </svg>

            {/* Central Fusion Core */}
            <div className="aiads-rotor-core">
              <Sparkles size={22} className="text-white animate-pulse" />
              <span className="core-brand">AI ADS™</span>
              <span className="core-sub">Loop Core</span>
            </div>

            {/* 8 Satellite Nodes Arranged in Circle */}
            {FLYWHEEL_NODES.map((node) => {
              const isSelected = activeNodeId === node.id;
              const Icon = node.icon;
              const rad = (node.angle * Math.PI) / 180;
              // Radius 145px
              const x = 50 + 40 * Math.cos(rad);
              const y = 50 + 40 * Math.sin(rad);

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveNodeId(node.id)}
                  className={`aiads-rotor-satellite ${isSelected ? 'active' : ''}`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    '--sat-color': node.color
                  }}
                  title={node.label}
                >
                  <Icon size={14} />
                  <span className="sat-label">{node.label}</span>
                </button>
              );
            })}
          </div>

          {/* Single Continuous Optical Feedback Strip (NO CARD GRIDS) */}
          <div className="aiads-rotor-feedback-strip">
            <div className="aiads-feedback-badge" style={{ background: `${activeNode.color}15`, color: activeNode.color }}>
              <Activity size={12} />
              <span>ACTIVE STAGE: {activeNode.label.toUpperCase()}</span>
            </div>
            <p className="aiads-feedback-text">
              {activeNode.telemetry}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
