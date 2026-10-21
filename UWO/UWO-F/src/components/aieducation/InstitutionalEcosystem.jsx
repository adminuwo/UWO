import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Building2, School, GraduationCap, Users, ArrowRight, Zap, Network, RefreshCw } from 'lucide-react';

const ECO_STAKEHOLDERS = [
  {
    id: 'inst',
    title: 'Institution',
    role: 'Governance Root',
    icon: Building2,
    color: '#00B87A',
    outputs: ['Policy & Rules', 'Tally Audits', '3-Tier Seals'],
    signalsTo: 'Faculty',
    activeFlow: 'Broadcasts academic calendars, timetables & fee governance'
  },
  {
    id: 'faculty',
    title: 'Faculty',
    role: 'Classroom Operations',
    icon: School,
    color: '#16B8E8',
    outputs: ['Substitute Proxy', 'Roll Calls', 'Rubric Marks'],
    signalsTo: 'Students',
    activeFlow: 'Instant substitute proxy dispatch (<200ms) & exam grading'
  },
  {
    id: 'student',
    title: 'Students',
    role: 'Pedagogical Learning',
    icon: GraduationCap,
    color: '#00B87A',
    outputs: ['Adaptive Quizzes', 'RAG Citations', 'QR Admit Card'],
    signalsTo: 'Parents',
    activeFlow: 'Class textbook AI citations & daily learning streak telemetry'
  },
  {
    id: 'parent',
    title: 'Parents',
    role: 'Guardian Portal',
    icon: Users,
    color: '#8B5CF6',
    outputs: ['Multi-Child View', 'Attendance Feed', 'Fee Receipts'],
    signalsTo: 'Institution',
    activeFlow: 'Seamless multi-student tracking & digital fee reconciliation'
  }
];

export default function InstitutionalEcosystem() {
  const shouldReduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState('inst');
  const activeStakeholder = ECO_STAKEHOLDERS.find(s => s.id === activeId) || ECO_STAKEHOLDERS[0];

  return (
    <section className="aied-section" id="connected-ecosystem">
      <div className="aied-container">
        <div className="aied-section-header">
          <span className="aied-badge">
            <Network size={14} />
            Ecosystem Loop
          </span>
          <h2 className="aied-section-title">
            The Campus <span className="aied-gradient-emerald">Synapse Loop.</span>
          </h2>
          <p className="aied-section-subtitle">
            Zero departmental silos. Real-time operational data circulates continuously across all four institutional stakeholders.
          </p>
        </div>

        {/* Continuous Campus Flow Ring (Object-Based Visual Circuit) */}
        <div className="aied-eco-circuit-container">
          {/* Top Integrated Continuous Stream Pipeline */}
          <div className="aied-eco-loop-track">
            {ECO_STAKEHOLDERS.map((stk, idx) => {
              const Icon = stk.icon;
              const isSelected = activeId === stk.id;
              return (
                <React.Fragment key={stk.id}>
                  <button
                    type="button"
                    className={`aied-eco-node ${isSelected ? 'active' : ''}`}
                    onClick={() => setActiveId(stk.id)}
                    style={{
                      borderColor: isSelected ? stk.color : undefined,
                      boxShadow: isSelected ? `0 0 24px ${stk.color}45` : undefined
                    }}
                  >
                    <div className="aied-eco-node-icon" style={{ color: stk.color, background: `${stk.color}15` }}>
                      <Icon size={20} />
                    </div>
                    <div className="aied-eco-node-info">
                      <span className="aied-eco-node-title">{stk.title}</span>
                      <span className="aied-eco-node-role" style={{ color: stk.color }}>{stk.role}</span>
                    </div>
                    {isSelected && (
                      <span className="aied-eco-active-indicator" style={{ background: stk.color, boxShadow: `0 0 8px ${stk.color}` }}></span>
                    )}
                  </button>

                  {idx < ECO_STAKEHOLDERS.length - 1 && (
                    <div className="aied-eco-connector">
                      <div className="aied-eco-connector-line">
                        {!shouldReduceMotion && (
                          <motion.div
                            className="aied-eco-connector-packet"
                            animate={{ left: ['0%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: idx * 0.5 }}
                          />
                        )}
                      </div>
                      <ArrowRight size={12} className="aied-eco-arrow" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Integrated Interactive Transaction Readout Terminal (Visual HUD Console) */}
          <div className="aied-eco-terminal">
            <div className="aied-eco-terminal-header">
              <div className="aied-eco-terminal-left">
                <span className="aied-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: activeStakeholder.color, display: 'inline-block', boxShadow: `0 0 6px ${activeStakeholder.color}` }}></span>
                <span className="aied-eco-terminal-label">TRANSACTION PIPELINE:</span>
                <span className="aied-eco-terminal-target" style={{ color: activeStakeholder.color }}>
                  {activeStakeholder.title} ➔ {activeStakeholder.signalsTo}
                </span>
              </div>
              <div className="aied-eco-terminal-pill">
                <RefreshCw size={11} className="text-emerald-400" />
                <span>Zero-Latency Sync</span>
              </div>
            </div>

            <div className="aied-eco-terminal-body">
              <div className="aied-eco-terminal-flow">
                <Zap size={14} style={{ color: activeStakeholder.color, flexShrink: 0 }} />
                <span>{activeStakeholder.activeFlow}</span>
              </div>

              {/* Data payload badges */}
              <div className="aied-eco-payload-tags">
                <span className="aied-eco-payload-lbl">EMITTED PAYLOADS:</span>
                {activeStakeholder.outputs.map((out, oIdx) => (
                  <span key={oIdx} className="aied-eco-payload-chip" style={{ borderColor: `${activeStakeholder.color}35`, color: activeStakeholder.color }}>
                    {out}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
