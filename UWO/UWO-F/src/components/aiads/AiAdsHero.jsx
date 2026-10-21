import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Sparkles, ArrowRight, ExternalLink, Dna, Search, 
  Compass, FileText, Palette, Globe, Zap, CheckCircle2 
} from 'lucide-react';
import { AI_ADS_META } from '../../constants/aiAdsConstants';
import { fadeInUp, staggerContainer } from '../aieducation/motionVariants';

const SYNAPSE_NODES = [
  { id: 'dna', label: 'Brand DNA', icon: Dna, color: '#7c3aed', angle: 30, r: 190 },
  { id: 'seo', label: 'SEO Engine', icon: Search, color: '#2563eb', angle: 90, r: 185 },
  { id: 'strategy', label: 'Strategy', icon: Compass, color: '#f97316', angle: 150, r: 195 },
  { id: 'content', label: 'Editorial', icon: FileText, color: '#06b6d4', angle: 210, r: 190 },
  { id: 'creative', label: 'Creative', icon: Palette, color: '#10b981', angle: 270, r: 185 },
  { id: 'website', label: 'Web Builder', icon: Globe, color: '#f59e0b', angle: 330, r: 195 }
];

export default function AiAdsHero({ onExploreClick }) {
  const shouldReduceMotion = useReducedMotion();
  const [activeNodeId, setActiveNodeId] = useState('dna');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsFinePointer(window.matchMedia('(pointer: fine)').matches);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!isFinePointer || shouldReduceMotion) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 2,
      y: (clientY / innerHeight - 0.5) * 2
    });
  };

  const activeNode = SYNAPSE_NODES.find(n => n.id === activeNodeId) || SYNAPSE_NODES[0];

  return (
    <section 
      className="aiads-hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
    >
      <div className="aiads-container">
        <div className="aiads-hero-content">
          {/* LEFT: Crisp, Punchy Value Proposition (Minimal Text) */}
          <motion.div 
            className="aiads-hero-text"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <span className="aiads-badge">
                <Sparkles size={13} className="text-purple-600" />
                AI ADS™ AUTONOMOUS OS
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp}>
              Autonomous Marketing. <br />
              <span className="aiads-gradient-title">Engineered by AI.</span>
            </motion.h1>

            <motion.p className="aiads-hero-desc" variants={fadeInUp}>
              Brand intelligence, creative studios, and multi-channel campaigns unified into one autonomous operating engine.
            </motion.p>

            <motion.div className="aiads-hero-actions" variants={fadeInUp}>
              <a 
                href={AI_ADS_META.productUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="aiads-btn-primary"
              >
                <span>Launch Platform</span>
                <ExternalLink size={15} />
              </a>

              <button
                type="button"
                onClick={onExploreClick}
                className="aiads-btn-secondary"
              >
                <span>Explore Architecture</span>
                <ArrowRight size={14} />
              </button>
            </motion.div>

            {/* Hardware Telemetry Ribbon (Sleek Horizontal Dock - NOT Cards) */}
            <motion.div className="aiads-telemetry-dock" variants={fadeInUp}>
              <div className="aiads-dock-item">
                <span className="aiads-dock-dot" style={{ background: '#7c3aed' }}></span>
                <span className="aiads-dock-val">8 Engines</span>
                <span className="aiads-dock-lbl">Active</span>
              </div>
              <div className="aiads-dock-sep">/</div>
              <div className="aiads-dock-item">
                <span className="aiads-dock-dot" style={{ background: '#10b981' }}></span>
                <span className="aiads-dock-val">100% Fidelity</span>
                <span className="aiads-dock-lbl">Brand DNA</span>
              </div>
              <div className="aiads-dock-sep">/</div>
              <div className="aiads-dock-item">
                <span className="aiads-dock-dot" style={{ background: '#2563eb' }}></span>
                <span className="aiads-dock-val">Multi-Format</span>
                <span className="aiads-dock-lbl">Sync</span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Atomic Marketing Synapse Reactor (Visual Object - ZERO CARDS) */}
          <motion.div 
            className="aiads-hero-visual-col"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="aiads-synapse-stage">
              {/* SVG Animated Orbital Rays & Particles */}
              <svg className="aiads-synapse-svg" viewBox="0 0 500 500">
                <defs>
                  <linearGradient id="synapseCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.4" />
                  </linearGradient>
                  <radialGradient id="synapseAura" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
                    <stop offset="60%" stopColor="#2563eb" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Aura Field */}
                <circle cx="250" cy="250" r="230" fill="url(#synapseAura)" />

                {/* Concentric Orbital Tracks */}
                <circle cx="250" cy="250" r="120" fill="none" stroke="rgba(124, 58, 237, 0.15)" strokeWidth="1.2" strokeDasharray="4 6" />
                <circle cx="250" cy="250" r="190" fill="none" stroke="rgba(37, 99, 235, 0.12)" strokeWidth="1.2" strokeDasharray="6 8" />

                {/* Synapse Connection Rays to each Node */}
                {SYNAPSE_NODES.map((node) => {
                  const rad = (node.angle * Math.PI) / 180;
                  const targetX = 250 + node.r * Math.cos(rad);
                  const targetY = 250 + node.r * Math.sin(rad);
                  const isSelected = activeNodeId === node.id;

                  return (
                    <g key={node.id}>
                      <line
                        x1="250"
                        y1="250"
                        x2={targetX}
                        y2={targetY}
                        stroke={isSelected ? node.color : 'rgba(124, 58, 237, 0.2)'}
                        strokeWidth={isSelected ? 2 : 1}
                        strokeDasharray={isSelected ? 'none' : '3 5'}
                      />
                      {!shouldReduceMotion && (
                        <motion.circle
                          r={isSelected ? 3.5 : 2}
                          fill={node.color}
                          animate={{
                            cx: [250, targetX],
                            cy: [250, targetY],
                            opacity: [0, 1, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Central Hologram Core Reactor (Circular Holographic Node) */}
              <motion.div 
                className="aiads-core-reactor"
                animate={shouldReduceMotion ? {} : { rotate: [0, 360] }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              >
                <div className="aiads-reactor-halo"></div>
              </motion.div>

              <div className="aiads-reactor-nucleus">
                <img 
                  src="/images/aiads-logo.png" 
                  alt="AI Ads Logo" 
                  className="aiads-reactor-logo"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className="aiads-reactor-title">AI ADS<sup>™</sup></span>
                <span className="aiads-reactor-pulse">
                  <span className="aiads-reactor-dot"></span>
                  Active Core
                </span>
              </div>

              {/* 6 Circular Floating Synapse Orbs (NO CARDS - Pure Circular Glass Lenses) */}
              {SYNAPSE_NODES.map((node) => {
                const rad = (node.angle * Math.PI) / 180;
                // Offset percentages from center
                const offsetX = (node.r / 250) * 44 * Math.cos(rad);
                const offsetY = (node.r / 250) * 44 * Math.sin(rad);
                const Icon = node.icon;
                const isSelected = activeNodeId === node.id;

                return (
                  <button
                    key={node.id}
                    type="button"
                    className={`aiads-synapse-orb ${isSelected ? 'active' : ''}`}
                    onClick={() => setActiveNodeId(node.id)}
                    style={{
                      left: `calc(50% + ${offsetX}%)`,
                      top: `calc(50% + ${offsetY}%)`,
                      borderColor: isSelected ? node.color : undefined,
                      boxShadow: isSelected ? `0 0 25px ${node.color}60` : undefined
                    }}
                    title={node.label}
                  >
                    <div 
                      className="aiads-orb-lens" 
                      style={{ 
                        color: node.color, 
                        background: isSelected ? `${node.color}25` : `${node.color}12` 
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <span 
                      className="aiads-orb-label"
                      style={{ 
                        color: isSelected ? node.color : undefined 
                      }}
                    >
                      {node.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Hologram Telemetry HUD (Single 1-Line Readout) */}
            <div className="aiads-synapse-hud">
              <span className="aiads-hud-dot" style={{ background: activeNode.color }}></span>
              <span className="aiads-hud-engine">SYNAPSE: {activeNode.label.toUpperCase()}</span>
              <span className="aiads-hud-sep">·</span>
              <span className="aiads-hud-status">Synchronized with central Brand DNA repository</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
