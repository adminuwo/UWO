import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Calendar, Award, QrCode, BookOpen, FileText, 
  Users, MessageSquare, DollarSign, Scale, Database, ArrowRight, CheckCircle2, Zap, Clock, ShieldCheck
} from 'lucide-react';
import { CORE_MODULES } from '../../constants/aiEducationConstants';

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
    <section className="aied-section" id="core-modules">
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
            Nine verified engines backed by unified campus workflows and real-time event pipelines.
          </p>
        </div>

        <div className="aied-modules-split">
          {/* LEFT: Compact Module Selector Strip */}
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
                >
                  <div className="aied-module-item-left">
                    <div className="aied-module-item-icon" style={{ color: isActive ? mod.accent : 'var(--aied-text-subtle)' }}>
                      <IconComp size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isActive ? '#ffffff' : 'var(--aied-text-main)', lineHeight: 1.25 }}>
                        {mod.name}
                      </div>
                      <div style={{ fontSize: '0.64rem', color: 'var(--aied-text-subtle)', fontFamily: 'var(--aied-font-mono)' }}>
                        {mod.code}
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

          {/* RIGHT: Live Module Instrument (Visual Object) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="aied-module-preview-panel"
            >
              {/* Header Strip */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--aied-border)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${activeModule.accent}20`, color: activeModule.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ActiveIcon size={16} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      {activeModule.name}
                    </h3>
                    <div style={{ fontSize: '0.7rem', color: 'var(--aied-text-muted)', fontFamily: 'var(--aied-font-mono)' }}>
                      ID: {activeModule.code} · Type: {activeModule.category}
                    </div>
                  </div>
                </div>
                <span className="aied-badge" style={{ margin: 0, padding: '3px 8px', fontSize: '0.65rem', background: `${activeModule.accent}15`, borderColor: `${activeModule.accent}40`, color: activeModule.accent }}>
                  {activeModule.tag}
                </span>
              </div>

              {/* Crisp 1-Line Value Summary */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--aied-border)', marginBottom: '12px' }}>
                <Zap size={13} style={{ color: activeModule.accent, flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 600 }}>{activeModule.summary}</span>
              </div>

              {/* Managed Data Schema Objects */}
              <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--aied-text-subtle)', fontFamily: 'var(--aied-font-mono)' }}>DATA OBJECTS:</span>
                {activeModule.entities.map((ent, i) => (
                  <span 
                    key={i} 
                    className="aied-badge" 
                    style={{ margin: 0, padding: '2px 7px', fontSize: '0.64rem', background: 'rgba(255,255,255,0.04)', borderColor: 'var(--aied-border)', color: 'var(--aied-cyan)' }}
                  >
                    {ent.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                ))}
              </div>

              {/* Interactive Live Visual Module Instrument Frame */}
              <div style={{ background: '#090e17', border: '1px solid var(--aied-border)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                  <span style={{ fontSize: '0.66rem', fontFamily: 'var(--aied-font-mono)', color: 'var(--aied-emerald)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span className="aied-pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#00b87a', display: 'inline-block' }}></span>
                    LIVE INSTRUMENT: {activeModule.id.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.64rem', color: 'var(--aied-text-muted)' }}>Status: Active Ingress</span>
                </div>

                {activeModule.id === 'timetable' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', fontSize: '0.66rem' }}>
                    <div style={{ background: 'var(--aied-bg-card)', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--aied-border)' }}>
                      <div style={{ color: 'var(--aied-text-subtle)' }}>P1 · 09:00</div>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>Cyber Laws</div>
                      <div style={{ color: 'var(--aied-emerald)', fontSize: '0.62rem' }}>Room 402</div>
                    </div>
                    <div style={{ background: 'var(--aied-bg-card)', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--aied-border)' }}>
                      <div style={{ color: 'var(--aied-text-subtle)' }}>P2 · 10:00</div>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>AI Neural Nets</div>
                      <div style={{ color: 'var(--aied-emerald)', fontSize: '0.62rem' }}>Lab 3</div>
                    </div>
                    <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                      <div style={{ color: '#ef4444' }}>P3 · Leave</div>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>Chemistry</div>
                      <div style={{ color: '#f59e0b', fontSize: '0.62rem', fontWeight: 600 }}>Proxy: Dr. Bhat</div>
                    </div>
                    <div style={{ background: 'var(--aied-bg-card)', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--aied-border)' }}>
                      <div style={{ color: 'var(--aied-text-subtle)' }}>P4 · 12:15</div>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>Thermodynamics</div>
                      <div style={{ color: 'var(--aied-emerald)', fontSize: '0.62rem' }}>Hall A</div>
                    </div>
                  </div>
                )}

                {activeModule.id === 'exams' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.7rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--aied-bg-card)', padding: '6px 10px', borderRadius: '4px' }}>
                      <span>Examination Pipeline</span>
                      <span style={{ color: 'var(--aied-emerald)', fontWeight: 700 }}>Published · 3 Signatures Verified</span>
                    </div>
                    <div style={{ background: 'var(--aied-bg-card)', padding: '8px 10px', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span>Theory vs Practical Weighting</span>
                        <span style={{ color: 'var(--aied-cyan)' }}>70% Theory / 30% Practical</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #00b87a, #16b8e8)' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {activeModule.id === 'admissions' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--aied-bg-card)', padding: '8px 12px', borderRadius: '4px' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.74rem' }}>Admit Card #ADM-2026-8920</div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--aied-text-muted)' }}>Candidate: Aarav Sharma · Center: UWO Demo Campus</div>
                    </div>
                    <div style={{ padding: '4px 8px', background: 'var(--aied-emerald-surface)', border: '1px solid var(--aied-emerald-border)', borderRadius: '4px', color: 'var(--aied-emerald)', fontSize: '0.66rem', fontWeight: 700 }}>
                      [ Dynamic QR Hall Ticket ]
                    </div>
                  </div>
                )}

                {activeModule.id === 'textbook' && (
                  <div style={{ background: 'var(--aied-bg-card)', padding: '8px 12px', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: '#ffffff' }}>Grounded RAG Pipeline</span>
                      <span style={{ color: '#00b87a', fontWeight: 700 }}>Score: 0.968</span>
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--aied-cyan)' }}>Source: NCERT Class 11 Physics · Chapter 7 · Page 168</div>
                  </div>
                )}

                {!['timetable', 'exams', 'admissions', 'textbook'].includes(activeModule.id) && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--aied-bg-card)', padding: '8px 12px', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#ffffff' }}>Active Module: {activeModule.name}</span>
                    <span style={{ fontSize: '0.66rem', color: 'var(--aied-emerald)', fontWeight: 700 }}>Telemetry Stream Synced</span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
