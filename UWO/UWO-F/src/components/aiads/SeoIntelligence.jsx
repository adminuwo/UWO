import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, Radio, Target, Sparkles, BarChart2, Activity } from 'lucide-react';

const RADAR_NODES = [
  { id: 1, keyword: 'AI Marketing Automation', vol: '49,200/mo', kd: 28, intent: 'Commercial', cpc: '$4.20', x: 62, y: 35, outline: ['Zero-Prompt Pipeline', 'Cross-Platform ROI Model'] },
  { id: 2, keyword: 'Autonomous Ad Creatives', vol: '18,500/mo', kd: 22, intent: 'Transactional', cpc: '$6.80', x: 78, y: 68, outline: ['Dynamic Asset Generation', 'Conversion Benchmark'] },
  { id: 3, keyword: 'Brand DNA Engine', vol: '12,100/mo', kd: 19, intent: 'Informational', cpc: '$3.10', x: 30, y: 40, outline: ['Persistent Tone Vectors', 'Anti-Hallucination Guardrails'] },
  { id: 4, keyword: 'SERP Semantic Clusters', vol: '8,400/mo', kd: 31, intent: 'Commercial', cpc: '$5.50', x: 42, y: 72, outline: ['Search Gap Discovery', 'Editorial H2 Structuring'] }
];

export default function SeoIntelligence() {
  const shouldReduceMotion = useReducedMotion();
  const [activeNode, setActiveNode] = useState(RADAR_NODES[0]);

  return (
    <section className="aiads-section" id="seo-intelligence" style={{ background: '#ffffff', overflow: 'hidden' }}>
      <div className="aiads-container">
        {/* Minimal Header */}
        <div className="aiads-section-header" style={{ marginBottom: '32px' }}>
          <span className="aiads-badge aiads-badge-blue">
            <Radio size={13} className="text-blue-500 animate-pulse" />
            SERP Radar Scanner
          </span>
          <h2 className="aiads-section-title">
            Semantic SEO <span className="aiads-gradient-title">Frequency Radar.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Zero guess work. Target high-intent search volumes with real-time editorial brief structuring.
          </p>
        </div>

        {/* NON-CARD OBJECT: Interactive SERP Radar Scope + Integrated Telemetry Strip */}
        <div className="aiads-serp-radar-object">
          {/* LEFT: Radar Display Scope */}
          <div className="aiads-radar-screen">
            {/* Concentric distance rings */}
            <div className="aiads-radar-ring ring-1"></div>
            <div className="aiads-radar-ring ring-2"></div>
            <div className="aiads-radar-ring ring-3"></div>
            
            {/* Crosshairs */}
            <div className="aiads-radar-axis axis-x"></div>
            <div className="aiads-radar-axis axis-y"></div>

            {/* Sweep Beam */}
            {!shouldReduceMotion && <div className="aiads-radar-sweep"></div>}

            {/* Floating Keyword Blips */}
            {RADAR_NODES.map((node) => {
              const isSelected = activeNode.id === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveNode(node)}
                  className={`aiads-radar-blip ${isSelected ? 'active' : ''}`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  title={`${node.keyword} (${node.vol})`}
                >
                  <span className="aiads-blip-pulse"></span>
                  <span className="aiads-blip-core"></span>
                  <span className="aiads-blip-tag">{node.keyword}</span>
                </button>
              );
            })}

            <div className="aiads-radar-hud-tag">
              <Activity size={12} />
              <span>SERP FREQUENCY: 24.8 GHz · ACTIVE BLIPS: 4</span>
            </div>
          </div>

          {/* RIGHT: Consolidated Optical HUD Telemetry (NO BOXED CARDS) */}
          <div className="aiads-radar-telemetry">
            <div className="aiads-telemetry-header">
              <div className="aiads-telemetry-status">
                <Target size={15} style={{ color: '#2563eb' }} />
                <span>LOCKED TARGET QUERY</span>
              </div>
              <span className="aiads-intent-badge">{activeNode.intent}</span>
            </div>

            <h3 className="aiads-telemetry-query">"{activeNode.keyword}"</h3>

            {/* Micro Metrics Row */}
            <div className="aiads-telemetry-gauges">
              <div className="aiads-gauge-cell">
                <span className="aiads-gauge-label">Search Volume</span>
                <span className="aiads-gauge-val" style={{ color: '#2563eb' }}>{activeNode.vol}</span>
              </div>
              <div className="aiads-gauge-cell">
                <span className="aiads-gauge-label">KD Score</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="aiads-gauge-val" style={{ color: '#10b981' }}>{activeNode.kd}/100</span>
                  <div className="aiads-mini-bar-track">
                    <div className="aiads-mini-bar-fill" style={{ width: `${activeNode.kd}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="aiads-gauge-cell">
                <span className="aiads-gauge-label">Est. CPC</span>
                <span className="aiads-gauge-val" style={{ color: '#7c3aed' }}>{activeNode.cpc}</span>
              </div>
            </div>

            {/* Generated Editorial Structure Chits */}
            <div className="aiads-editorial-structure">
              <span className="aiads-editorial-label">
                <Sparkles size={12} /> AUTO-SYNTHESIZED EDITORIAL NODES
              </span>
              <div className="aiads-structure-pills">
                {activeNode.outline.map((heading, i) => (
                  <div key={i} className="aiads-structure-chip">
                    <span className="chip-prefix">H2.{i + 1}</span>
                    <span className="chip-title">{heading}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
