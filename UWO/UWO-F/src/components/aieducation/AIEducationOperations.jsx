import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Building2, School, GraduationCap, Layers, Cpu, CheckCircle2
} from 'lucide-react';

const OPERATIONAL_NODES = [
  {
    id: 'students',
    label: 'Learners & Students',
    role: 'Pedagogy & Attendance',
    icon: GraduationCap,
    color: '#4F46E5',
    positionClass: 'pos-top',
    status: 'Active Attendance & RAG Access',
    metric: 'Dynamic QR Passports · 100% Verified Syllabi'
  },
  {
    id: 'faculty',
    label: 'Faculty & Instructors',
    role: 'Timetables & Delivery',
    icon: School,
    color: '#0EA5E9',
    positionClass: 'pos-right',
    status: 'Automated Substitute Proxy',
    metric: 'Clash-Free Timetable Solver · 8 Periods'
  },
  {
    id: 'governance',
    label: 'Campus Governance',
    role: 'Administration & Finance',
    icon: Building2,
    color: '#8B5CF6',
    positionClass: 'pos-bottom',
    status: 'ERP Ledger Synchronization',
    metric: 'Tally ERP 9 / Prime XML Bridge · Multi-Tenant'
  },
  {
    id: 'resources',
    label: 'Academic Resources',
    role: 'Libraries & Laboratories',
    icon: Layers,
    color: '#F59E0B',
    positionClass: 'pos-left',
    status: 'Catalog & Hall Ticket Registry',
    metric: 'Digital Seals · Automated Exam Hall Allocation'
  }
];

export default function AIEducationOperations() {
  const shouldReduceMotion = useReducedMotion();
  const [activeNodeId, setActiveNodeId] = useState('faculty');
  const activeNode = OPERATIONAL_NODES.find(n => n.id === activeNodeId) || OPERATIONAL_NODES[1];

  return (
    <section className="aied-section-operations" id="operations-section">
      <div className="aied-container">
        {/* Minimal Section Header */}
        <div className="aied-section-header">
          <div className="aied-section-eyebrow">
            <Cpu size={13} />
            <span>03 / Operations</span>
          </div>
          <h2 className="aied-section-title">
            The Connected <span className="accent">Campus Orbit.</span>
          </h2>
          <p className="aied-section-subtitle">
            A single synchronized kernel connecting governance, faculty, students, and academic resources in real time.
          </p>
        </div>

        <div className="aied-operations-stage">
          {/* Orbital Viewport */}
          <div className="aied-orbital-viewport">
            {/* SVG Orbit Lines & Traveling Signals */}
            <svg className="aied-orbital-svg-bg" viewBox="0 0 800 420" fill="none">
              <ellipse 
                cx="400" 
                cy="210" 
                rx="300" 
                ry="150" 
                stroke="#E2E8F0" 
                strokeWidth="1.5" 
                strokeDasharray="6 6" 
              />
              <ellipse 
                cx="400" 
                cy="210" 
                rx="200" 
                ry="95" 
                stroke="rgba(79, 70, 229, 0.18)" 
                strokeWidth="1" 
                strokeDasharray="4 4" 
              />

              {/* Connecting Lines from Central Core to Nodes */}
              <line x1="400" y1="130" x2="400" y2="40" stroke="rgba(79, 70, 229, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="480" y1="210" x2="650" y2="210" stroke="rgba(14, 165, 233, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="400" y1="290" x2="400" y2="380" stroke="rgba(139, 92, 246, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="320" y1="210" x2="150" y2="210" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1" strokeDasharray="3 3" />

              {/* Traveling Orbit Pulse */}
              {!shouldReduceMotion && (
                <motion.circle
                  r="3.5"
                  fill="#4F46E5"
                  animate={{
                    cx: [400, 700, 400, 100, 400],
                    cy: [60, 210, 360, 210, 60],
                    opacity: [0.3, 0.9, 0.3, 0.9, 0.3]
                  }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </svg>

            {/* Central Operating Core */}
            <div className="aied-orbital-center-core">
              <div className="aied-center-core-icon">
                <Cpu size={22} />
              </div>
              <span className="aied-center-core-title">Campus OS</span>
              <span className="aied-center-core-sub">Unified Kernel</span>
            </div>

            {/* 4 Connected Satellite Nodes */}
            {OPERATIONAL_NODES.map((node) => {
              const Icon = node.icon;
              const isActive = activeNodeId === node.id;
              return (
                <div
                  key={node.id}
                  className={`aied-orbital-node ${node.positionClass} ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveNodeId(node.id)}
                  style={{
                    borderColor: isActive ? node.color : undefined
                  }}
                >
                  <div 
                    className="aied-orbital-node-icon"
                    style={{ 
                      background: `${node.color}15`,
                      color: node.color
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="aied-node-title">{node.label}</div>
                    <div className="aied-node-desc">{node.role}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Node Live Status Bar */}
          <div className="aied-operations-detail-bar">
            <div className="aied-detail-label-wrap">
              <span className="aied-detail-dot" style={{ background: activeNode.color }} />
              <div>
                <span className="aied-detail-title">{activeNode.label}: </span>
                <span className="aied-detail-signal">{activeNode.status}</span>
              </div>
            </div>

            <div className="aied-detail-sla">
              <CheckCircle2 size={13} />
              <span>{activeNode.metric}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
