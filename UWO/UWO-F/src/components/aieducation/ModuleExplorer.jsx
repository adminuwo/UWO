import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Calendar, Award, QrCode, BookOpen, FileText, 
  Users, MessageSquare, DollarSign, Scale, Database, ArrowRight, CheckCircle2, Zap, Clock
} from 'lucide-react';
import { CORE_MODULES } from '../../constants/aiEducationConstants';
import { fadeInUp, staggerContainer } from './motionVariants';

const MODULE_ICONS = {
  Calendar,
  Award,
  QrCode,
  BookOpen,
  FileText,
  Users,
  MessageSquare,
  DollarSign,
  Scale
};

export default function ModuleExplorer() {
  const shouldReduceMotion = useReducedMotion();
  const [activeModuleId, setActiveModuleId] = useState('timetable');
  const activeModule = CORE_MODULES.find(m => m.id === activeModuleId) || CORE_MODULES[0];
  const ActiveIcon = MODULE_ICONS[activeModule.icon] || FileText;

  return (
    <section className="aied-section" id="core-modules" style={{ padding: '36px 0' }}>
      <div className="aied-container">
        <div className="aied-section-header" style={{ marginBottom: '18px' }}>
          <span className="aied-badge aied-badge-cyan">
            <Database size={12} />
            Modular Functional Architecture
          </span>
          <h2 className="aied-section-title" style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
            Enterprise Academic Modules, <br />
            <span className="aied-gradient-emerald">Engineered for Scale.</span>
          </h2>
          <p className="aied-section-subtitle" style={{ fontSize: '0.82rem', maxWidth: '600px' }}>
            Explore verified functional modules operating natively inside Convee Education, 
            backed by 44 PostgreSQL relational entities and real-time event pipelines.
          </p>
        </div>

        <div className="aied-modules-split">
          {/* LEFT: Module Selector List */}
          <div className="aied-modules-list">
            {CORE_MODULES.map((mod) => {
              const IconComp = MODULE_ICONS[mod.icon] || FileText;
              const isActive = activeModuleId === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  className={`aied-module-item-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveModuleId(mod.id)}
                  style={{ position: 'relative' }}
                >
                  {isActive && !shouldReduceMotion && (
                    <motion.div
                      layoutId="activeModuleHighlight"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '8px',
                        background: 'rgba(0, 184, 122, 0.12)',
                        border: '1px solid var(--aied-emerald)',
                        zIndex: -1
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <div className="aied-module-item-left">
                    <div className="aied-module-item-icon" style={{ color: isActive ? mod.accent : 'var(--aied-text-subtle)' }}>
                      <IconComp size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isActive ? '#ffffff' : 'var(--aied-text-main)', lineHeight: 1.25 }}>
                        {mod.name}
                      </div>
                      <div style={{ fontSize: '0.64rem', color: 'var(--aied-text-subtle)', fontFamily: 'var(--aied-font-mono)' }}>
                        {mod.code} · {mod.category}
                      </div>
                    </div>
                  </div>
                  <span className="aied-badge" style={{ margin: 0, padding: '2px 6px', fontSize: '0.62rem', background: isActive ? `${mod.accent}20` : 'transparent', borderColor: isActive ? mod.accent : 'var(--aied-border)' }}>
                    {mod.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* RIGHT: Large Animated Product Preview Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="aied-module-preview-panel"
            >
              {/* Header Strip */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--aied-border)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: `${activeModule.accent}20`, color: activeModule.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ActiveIcon size={17} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      {activeModule.name}
                    </h3>
                    <div style={{ fontSize: '0.72rem', color: 'var(--aied-text-muted)', fontFamily: 'var(--aied-font-mono)' }}>
                      Module ID: {activeModule.code} · Classification: {activeModule.category}
                    </div>
                  </div>
                </div>
                <span className="aied-badge" style={{ margin: 0, padding: '3px 8px', fontSize: '0.65rem', background: `${activeModule.accent}15`, borderColor: `${activeModule.accent}40`, color: activeModule.accent }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: activeModule.accent, display: 'inline-block', boxShadow: `0 0 5px ${activeModule.accent}` }}></span>
                  {activeModule.tag}
                </span>
              </div>

              {/* Core Description */}
              <p style={{ fontSize: '0.86rem', color: '#ffffff', lineHeight: 1.5, marginBottom: '8px', fontWeight: 600 }}>
                {activeModule.summary}
              </p>

              <p style={{ fontSize: '0.78rem', color: 'var(--aied-text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
                {activeModule.details}
              </p>

              {/* Prisma Database Entities Matrix */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--aied-text-subtle)', fontFamily: 'var(--aied-font-mono)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  // Relational Data Models (Prisma ORM 5.22)
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {activeModule.entities.map((ent, i) => (
                    <span 
                      key={i} 
                      className="aied-badge" 
                      style={{ margin: 0, padding: '2px 6px', fontSize: '0.65rem', background: 'rgba(255,255,255,0.04)', borderColor: 'var(--aied-border)', color: 'var(--aied-cyan)', textTransform: 'none' }}
                    >
                      <Database size={10} style={{ marginRight: 3 }} />
                      model {ent}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Module Mockup Frame */}
              <div style={{ background: 'var(--aied-bg-surface)', border: '1px solid var(--aied-border)', borderRadius: '10px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--aied-font-mono)', color: 'var(--aied-emerald)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Zap size={11} />
                    OPERATIONAL TELEMETRY: {activeModule.id.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.66rem', color: 'var(--aied-text-muted)' }}>Status: Active Ingress</span>
                </div>

                {activeModule.id === 'timetable' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', fontSize: '0.68rem' }}>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      style={{ background: 'var(--aied-bg-card)', padding: '8px', borderRadius: '6px', border: '1px solid var(--aied-border)' }}
                    >
                      <div style={{ color: 'var(--aied-text-subtle)' }}>09:00 AM · P1</div>
                      <div style={{ fontWeight: 700, color: '#ffffff', margin: '2px 0' }}>Cyber Laws</div>
                      <div style={{ color: 'var(--aied-emerald)', fontSize: '0.64rem' }}>Room 402 · Active</div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      style={{ background: 'var(--aied-bg-card)', padding: '8px', borderRadius: '6px', border: '1px solid var(--aied-border)' }}
                    >
                      <div style={{ color: 'var(--aied-text-subtle)' }}>10:00 AM · P2</div>
                      <div style={{ fontWeight: 700, color: '#ffffff', margin: '2px 0' }}>AI Neural Nets</div>
                      <div style={{ color: 'var(--aied-emerald)', fontSize: '0.64rem' }}>Lab 3 · Active</div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.25)' }}
                    >
                      <div style={{ color: '#ef4444' }}>11:15 AM · Leave</div>
                      <div style={{ fontWeight: 700, color: '#ffffff', margin: '2px 0' }}>Chemistry Lab</div>
                      <div style={{ color: '#f59e0b', fontSize: '0.64rem', fontWeight: 600 }}>Proxy: Dr. Bhat ➔</div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      style={{ background: 'var(--aied-bg-card)', padding: '8px', borderRadius: '6px', border: '1px solid var(--aied-border)' }}
                    >
                      <div style={{ color: 'var(--aied-text-subtle)' }}>12:15 PM · P4</div>
                      <div style={{ fontWeight: 700, color: '#ffffff', margin: '2px 0' }}>Thermodynamics</div>
                      <div style={{ color: 'var(--aied-emerald)', fontSize: '0.64rem' }}>Hall A · Active</div>
                    </motion.div>
                  </div>
                )}

                {activeModule.id === 'exams' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.72rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--aied-bg-card)', padding: '8px 12px', borderRadius: '6px' }}>
                      <span>Mid-Term Examination Pipeline</span>
                      <span style={{ color: 'var(--aied-emerald)', fontWeight: 700 }}>Published · 3 Signatures Verified</span>
                    </div>
                    <div style={{ background: 'var(--aied-bg-card)', padding: '10px 12px', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Theory vs Practical Weighting</span>
                        <span style={{ color: 'var(--aied-cyan)' }}>70% Theory / 30% Practical</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                        <motion.div 
                          style={{ height: '100%', background: 'linear-gradient(90deg, #00b87a, #16b8e8)' }}
                          initial={{ width: 0 }}
                          animate={{ width: '85%' }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeModule.id === 'admissions' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--aied-bg-card)', padding: '10px 14px', borderRadius: '6px' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.78rem' }}>Admit Card #ADM-2026-8920</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--aied-text-muted)' }}>Candidate: Aarav Sharma · Center: CNLU Exam Hall 2</div>
                    </div>
                    <div style={{ padding: '5px 10px', background: 'var(--aied-emerald-surface)', border: '1px solid var(--aied-emerald-border)', borderRadius: '6px', color: 'var(--aied-emerald)', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00b87a', boxShadow: '0 0 6px #00b87a' }}></span>
                      [ Dynamic QR Hall Ticket ]
                    </div>
                  </div>
                )}

                {activeModule.id === 'textbook-rag' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.72rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--aied-bg-card)', padding: '8px 12px', borderRadius: '6px' }}>
                      <span style={{ color: '#ffffff' }}>Query: "Explain Kepler's Second Law with torque"</span>
                      <span style={{ color: 'var(--aied-emerald)', fontWeight: 700 }}>Vector Match: 0.942</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--aied-bg-card)', padding: '8px 12px', borderRadius: '6px' }}>
                      <span style={{ color: 'var(--aied-text-muted)' }}>Source: NCERT Physics Class 11 · Ch. 7 · p. 168</span>
                      <span style={{ color: 'var(--aied-cyan)' }}>Grounded · 0% Hallucination</span>
                    </div>
                  </div>
                )}

                {activeModule.id === 'communication' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.72rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--aied-bg-card)', padding: '8px 12px', borderRadius: '6px' }}>
                      <span style={{ color: '#ffffff' }}>#physics-faculty · Threaded Channel</span>
                      <span style={{ color: 'var(--aied-emerald)', fontWeight: 700 }}>WebSocket Online · 24 Active</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--aied-bg-card)', padding: '8px 12px', borderRadius: '6px' }}>
                      <span style={{ color: 'var(--aied-text-muted)' }}>AI Summarizer: "3 Decisions synthesized from 48 messages"</span>
                      <span style={{ color: 'var(--aied-cyan)' }}>End-to-End Scoped</span>
                    </div>
                  </div>
                )}

                {activeModule.id === 'tally-sync' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.72rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--aied-bg-card)', padding: '8px 12px', borderRadius: '6px' }}>
                      <span style={{ color: '#ffffff' }}>Tally ERP 9 / Prime Gateway (Port 9000)</span>
                      <span style={{ color: 'var(--aied-emerald)', fontWeight: 700 }}>XML Bi-Directional Sync Active</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--aied-bg-card)', padding: '8px 12px', borderRadius: '6px' }}>
                      <span style={{ color: 'var(--aied-text-muted)' }}>Ledger: Student Fee Collection ➔ Sundry Debtors</span>
                      <span style={{ color: 'var(--aied-cyan)' }}>TallyTombstone Verified</span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '14px' }}>
                <a 
                  href="https://education.uwo24.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="aied-btn-primary"
                  style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                >
                  <span>Explore {activeModule.name} Live</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
