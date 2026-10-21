import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Building2, School, GraduationCap, Users, QrCode, 
  Calendar, Award, BookOpen, MessageSquare, DollarSign, Cpu, Zap, ShieldCheck
} from 'lucide-react';
import { fadeInUp, staggerContainer } from './motionVariants';

const STAKEHOLDER_NODES = [
  { id: 'inst', label: 'Institution', sub: 'Governance', icon: Building2, color: '#00B87A', metric: 'Multi-Tenant Root', signal: 'Enforces timetable clash rules & audits Tally ledgers' },
  { id: 'faculty', label: 'Faculty', sub: 'Instruction', icon: School, color: '#16B8E8', metric: '<200ms Proxy', signal: 'Automated substitute proxy & rubric grading' },
  { id: 'students', label: 'Students', sub: 'Pedagogy', icon: GraduationCap, color: '#00B87A', metric: '100% Grounded', signal: 'Class textbook RAG citations & adaptive quizzes' },
  { id: 'parents', label: 'Parents', sub: 'Oversight', icon: Users, color: '#8B5CF6', metric: 'Multi-Child', signal: 'Real-time attendance tracking & verified report cards' }
];

const OPERATIONAL_CHIPS = [
  { id: 'academics', label: '8-Period Timetable', icon: Calendar, color: '#16B8E8', spec: 'Clash-Free Solver' },
  { id: 'admissions', label: 'Admissions & Hall Tickets', icon: QrCode, color: '#00B87A', spec: 'Dynamic QR' },
  { id: 'assessment', label: '3-Tier Exam Pipeline', icon: Award, color: '#8B5CF6', spec: 'Digital Seals' },
  { id: 'learning', label: 'Textbook RAG Citations', icon: BookOpen, color: '#16B8E8', spec: 'NCERT / CBSE' },
  { id: 'comm', label: 'Live Academic Channels', icon: MessageSquare, color: '#00B87A', spec: 'WebSocket Mesh' },
  { id: 'finance', label: 'Tally ERP 9 / Prime', icon: DollarSign, color: '#8B5CF6', spec: 'XML Ledger Sync' }
];

export default function AcademicOS() {
  const shouldReduceMotion = useReducedMotion();
  const [activeNodeId, setActiveNodeId] = useState('faculty');

  const activeStakeholder = STAKEHOLDER_NODES.find(n => n.id === activeNodeId) || STAKEHOLDER_NODES[0];
  const activeChip = OPERATIONAL_CHIPS.find(c => c.id === activeNodeId);

  return (
    <section className="aied-section" id="academic-os">
      <div className="aied-container">
        <div className="aied-section-header">
          <span className="aied-badge">
            <Cpu size={14} />
            Unified Neural Core
          </span>
          <h2 className="aied-section-title">
            The Academic <span className="aied-gradient-emerald">Neural Hub.</span>
          </h2>
          <p className="aied-section-subtitle">
            A single connected operating kernel synchronizing campus governance, instructors, learners, and families in real time.
          </p>
        </div>

        {/* Cohesive Orbital Constellation Hub (Non-Card Object) */}
        <div className="aied-os-hub-canvas">
          {/* Animated SVG Orbital & Vector Transmission Grid */}
          <svg className="aied-os-hub-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="hubBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00b87a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#16b8e8" stopOpacity="0.2" />
              </linearGradient>
              <radialGradient id="hubCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00b87a" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00b87a" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Orbital Rings */}
            <circle cx="500" cy="250" r="140" fill="none" stroke="rgba(0, 184, 122, 0.16)" strokeWidth="1" strokeDasharray="4 6" />
            <circle cx="500" cy="250" r="210" fill="none" stroke="rgba(22, 184, 232, 0.12)" strokeWidth="1" strokeDasharray="6 8" />

            {/* Center Aura */}
            <circle cx="500" cy="250" r="90" fill="url(#hubCoreGlow)" />

            {/* Transmission lines to 4 primary anchors */}
            <line x1="500" y1="250" x2="250" y2="130" stroke="rgba(0, 184, 122, 0.3)" strokeWidth="1.5" strokeDasharray="5 5" />
            <line x1="500" y1="250" x2="750" y2="130" stroke="rgba(22, 184, 232, 0.3)" strokeWidth="1.5" strokeDasharray="5 5" />
            <line x1="500" y1="250" x2="250" y2="370" stroke="rgba(0, 184, 122, 0.3)" strokeWidth="1.5" strokeDasharray="5 5" />
            <line x1="500" y1="250" x2="750" y2="370" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1.5" strokeDasharray="5 5" />

            {/* Traveling Data Signal Pulses */}
            {!shouldReduceMotion && (
              <>
                <motion.circle
                  r="3.5"
                  fill="#00b87a"
                  animate={{
                    cx: [500, 250],
                    cy: [250, 130],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.circle
                  r="3.5"
                  fill="#16b8e8"
                  animate={{
                    cx: [500, 750],
                    cy: [250, 130],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 4, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.circle
                  r="3.5"
                  fill="#00b87a"
                  animate={{
                    cx: [500, 250],
                    cy: [250, 370],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 3.8, delay: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.circle
                  r="3.5"
                  fill="#8b5cf6"
                  animate={{
                    cx: [500, 750],
                    cy: [250, 370],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 4.2, delay: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              </>
            )}
          </svg>

          {/* Center Kernel Object */}
          <div className="aied-os-hub-core">
            <div className="aied-os-hub-core-inner">
              <img 
                src="/images/ai-education-logo.jpg" 
                alt="AI Education Logo" 
                className="aied-os-center-logo" 
              />
              <div className="aied-os-core-title">AI EDUCATION<sup>™</sup></div>
              <div className="aied-os-core-status">
                <span className="aied-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#00b87a', display: 'inline-block', boxShadow: '0 0 6px #00b87a' }}></span>
                <span>Active Kernel v2.6</span>
              </div>
            </div>
          </div>

          {/* 4 Interactive Stakeholder Anchors (Circular Orbital Badges) */}
          <div className="aied-os-anchors-layer">
            {STAKEHOLDER_NODES.map((node) => {
              const Icon = node.icon;
              const isSelected = activeNodeId === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  className={`aied-os-anchor-node anchor-${node.id} ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveNodeId(node.id)}
                  style={{
                    borderColor: isSelected ? node.color : undefined,
                    boxShadow: isSelected ? `0 0 20px ${node.color}50` : undefined
                  }}
                >
                  <div className="aied-os-anchor-icon" style={{ color: node.color, background: `${node.color}18` }}>
                    <Icon size={20} />
                  </div>
                  <div className="aied-os-anchor-meta">
                    <span className="aied-os-anchor-title">{node.label}</span>
                    <span className="aied-os-anchor-tag" style={{ color: node.color }}>{node.metric}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Integrated Operational Bus Ribbon (Pill Network, NOT Cards) */}
          <div className="aied-os-bus-ribbon">
            <div className="aied-os-bus-title">
              <Zap size={12} className="text-emerald-400" />
              <span>ACTIVE SYNAPSE ENGINES:</span>
            </div>
            <div className="aied-os-bus-chips">
              {OPERATIONAL_CHIPS.map((chip) => {
                const ChipIcon = chip.icon;
                const isSelected = activeNodeId === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    className={`aied-os-bus-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => setActiveNodeId(chip.id)}
                    style={{
                      borderColor: isSelected ? chip.color : undefined,
                      color: isSelected ? '#ffffff' : undefined,
                      background: isSelected ? `${chip.color}18` : undefined
                    }}
                  >
                    <ChipIcon size={13} style={{ color: chip.color }} />
                    <span className="aied-os-chip-label">{chip.label}</span>
                    <span className="aied-os-chip-spec" style={{ color: chip.color }}>{chip.spec}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Telemetry Readout Strip (Minimalist 1-Line HUD) */}
          <div className="aied-os-hud-strip">
            <div className="aied-os-hud-left">
              <span className="aied-os-hud-dot"></span>
              <span className="aied-os-hud-tag">
                {activeChip ? activeChip.label : activeStakeholder.label}
              </span>
              <span className="aied-os-hud-sep">/</span>
              <span className="aied-os-hud-desc">
                {activeChip ? `Active engine: ${activeChip.spec} with zero-latency synchronization` : activeStakeholder.signal}
              </span>
            </div>
            <div className="aied-os-hud-right">
              <span className="aied-badge" style={{ margin: 0, padding: '2px 8px', fontSize: '0.66rem' }}>
                <ShieldCheck size={11} style={{ marginRight: 4, color: '#00b87a' }} />
                100% Org-Isolated
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
