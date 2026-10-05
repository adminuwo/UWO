import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Layers, Database, Cpu, ShieldCheck, Check, Server, Smartphone, Globe, 
  User, ArrowRight, Zap, Cloud
} from 'lucide-react';
import { fadeInUp, staggerContainer, CountUpNumber } from './motionVariants';

const FLOW_STEPS = [
  { id: 'user', label: 'User Context', sub: 'Student / Faculty / Parent', icon: User, color: '#00b87a' },
  { id: 'client', label: 'Web & Mobile', sub: 'React 19 & Expo Native', icon: Smartphone, color: '#16b8e8' },
  { id: 'api', label: 'API Gateway', sub: 'Express & FastAPI Bridge', icon: Server, color: '#00b87a' },
  { id: 'services', label: 'Academic Services', sub: 'Timetables, Roll Call, Exams', icon: Layers, color: '#8b5cf6' },
  { id: 'db', label: 'PostgreSQL DB', sub: '44 Scoped Entities', icon: Database, color: '#16b8e8' },
  { id: 'ai', label: 'AI Services', sub: 'Vertex & OpenAI RAG', icon: Cpu, color: '#00b87a' }
];

export default function PlatformOverview() {
  const shouldReduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  // Cycling active signal through the architecture flow
  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % FLOW_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <section className="aied-section" id="platform-overview">
      <div className="aied-container">
        <div className="aied-section-header">
          <span className="aied-badge aied-badge-cyan">
            <Layers size={14} />
            Unified Academic Operating System
          </span>
          <h2 className="aied-section-title">
            One Platform for the <br />
            <span className="aied-gradient-emerald">Complete Academic Ecosystem.</span>
          </h2>
          <p className="aied-section-subtitle">
            AI Education bridges institutional operations, classroom timetables, multi-tier examinations, 
            curriculum-grounded learning, family collaboration, and financial reconciliation into one cohesive environment.
          </p>
        </div>

        {/* ⚡ Visual Animated System Flow Pipeline */}
        <motion.div 
          className="aied-system-flow-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
          style={{
            background: 'linear-gradient(180deg, rgba(16, 24, 39, 0.7) 0%, rgba(8, 12, 18, 0.9) 100%)',
            border: '1px solid var(--aied-border)',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '32px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={14} className="text-emerald-400" />
              <span style={{ fontSize: '0.74rem', fontWeight: 700, fontFamily: 'var(--aied-font-mono)', letterSpacing: '0.05em', color: '#ffffff' }}>
                ACTIVE TRANSACTION FLOW &amp; DATA PIPELINE
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00b87a', boxShadow: '0 0 6px #00b87a' }}></span>
              <span style={{ fontSize: '0.68rem', color: 'var(--aied-text-muted)', fontFamily: 'var(--aied-font-mono)' }}>
                Signal: {FLOW_STEPS[activeStep].label} Active
              </span>
            </div>
          </div>

          {/* Connected Flow Steps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', position: 'relative', zIndex: 2 }}>
            {FLOW_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = activeStep === idx;
              return (
                <motion.div
                  key={step.id}
                  variants={fadeInUp}
                  style={{
                    background: isActive ? 'rgba(0, 184, 122, 0.12)' : 'var(--aied-bg-card)',
                    border: `1px solid ${isActive ? step.color : 'var(--aied-border)'}`,
                    boxShadow: isActive ? `0 0 14px ${step.color}35` : 'none',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ 
                      width: '26px', 
                      height: '26px', 
                      borderRadius: '6px', 
                      background: `${step.color}20`, 
                      color: step.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <StepIcon size={14} />
                    </div>
                    <span style={{ fontSize: '0.62rem', color: isActive ? step.color : 'var(--aied-text-subtle)', fontFamily: 'var(--aied-font-mono)', fontWeight: 700 }}>
                      0{idx + 1}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isActive ? '#ffffff' : 'var(--aied-text-main)', marginBottom: '2px' }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--aied-text-muted)', lineHeight: 1.3 }}>
                    {step.sub}
                  </div>

                  {/* Micro connection pulse indicator */}
                  {isActive && !shouldReduceMotion && (
                    <motion.div
                      layoutId="flowPulse"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: step.color,
                        boxShadow: `0 0 8px ${step.color}`
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="aied-modules-split" style={{ alignItems: 'center' }}>
          {/* LEFT: Structural Explanation */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            <motion.h3 
              variants={fadeInUp}
              style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px', lineHeight: 1.28 }}
            >
              Beyond fragmented spreadsheets, standalone LMS, and manual ledgers.
            </motion.h3>

            <motion.p 
              variants={fadeInUp}
              style={{ color: 'var(--aied-text-muted)', fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '16px' }}
            >
              Academic institutions historically juggle 6 to 10 disconnected tools: isolated attendance software, 
              standalone exam scoring apps, third-party chat messengers, unverified tuition portals, and manual Tally cash receipts.
            </motion.p>

            <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--aied-emerald-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--aied-emerald)', flexShrink: 0, marginTop: '2px' }}>
                  <Check size={13} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', margin: '0 0 2px 0' }}>Institutional Tenancy with Individual Scope</h4>
                  <p style={{ fontSize: '0.74rem', color: 'var(--aied-text-muted)', margin: 0, lineHeight: 1.4 }}>
                    Strict database multi-tenancy (<code>orgId</code>) for schools and universities, while supporting independent tuition students and verified freelance tutors.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--aied-cyan-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--aied-cyan)', flexShrink: 0, marginTop: '2px' }}>
                  <Check size={13} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', margin: '0 0 2px 0' }}>Dual-LLM Pedagogical Routing</h4>
                  <p style={{ fontSize: '0.74rem', color: 'var(--aied-text-muted)', margin: 0, lineHeight: 1.4 }}>
                    Students query Gemini 2.5 Flash on Vertex AI (1M+ token context in <code>asia-south1</code>), while faculty use OpenAI GPT-4o-mini for complex lesson construction.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--aied-purple-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--aied-purple)', flexShrink: 0, marginTop: '2px' }}>
                  <Check size={13} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', margin: '0 0 2px 0' }}>Bi-Directional Tally ERP Sync</h4>
                  <p style={{ fontSize: '0.74rem', color: 'var(--aied-text-muted)', margin: 0, lineHeight: 1.4 }}>
                    Native XML over HTTP bridge reconciling student fee ledgers, staff payroll, and operational cash registers with automated TallyTombstone handling.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Architecture Telemetry Board */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="aied-role-preview-box"
            style={{ padding: '20px', background: 'radial-gradient(circle at 100% 0%, #111a2b 0%, #080c12 100%)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--aied-border)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Server size={16} className="text-emerald-400" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.04em' }}>SYSTEM ARCHITECTURE OVERVIEW</span>
              </div>
              <span className="aied-badge" style={{ margin: 0, padding: '2px 7px', fontSize: '0.65rem' }}>
                Cloud Run · Serverless
              </span>
            </div>

            {/* Architecture Stack Tiers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Client Tier */}
              <div style={{ background: 'var(--aied-bg-card)', border: '1px solid var(--aied-border)', borderRadius: '8px', padding: '10px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--aied-emerald)', fontWeight: 700, fontFamily: 'var(--aied-font-mono)' }}>01 // CLIENT PRESENTATION TIER</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--aied-text-muted)' }}>Web &amp; Native Mobile</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="aied-badge" style={{ margin: 0, padding: '2px 6px', fontSize: '0.66rem', background: 'rgba(255,255,255,0.05)', color: '#ffffff', borderColor: 'var(--aied-border)' }}>
                    <Globe size={11} style={{ marginRight: 3 }} /> React 19 Web App
                  </span>
                  <span className="aied-badge" style={{ margin: 0, padding: '2px 6px', fontSize: '0.66rem', background: 'rgba(255,255,255,0.05)', color: '#ffffff', borderColor: 'var(--aied-border)' }}>
                    <Smartphone size={11} style={{ marginRight: 3 }} /> Expo SDK 56 (Android 15 / iOS)
                  </span>
                </div>
              </div>

              {/* Microservices Tier */}
              <div style={{ background: 'var(--aied-bg-card)', border: '1px solid var(--aied-border)', borderRadius: '8px', padding: '10px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--aied-cyan)', fontWeight: 700, fontFamily: 'var(--aied-font-mono)' }}>02 // MICROSERVICES API ROUTING</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--aied-text-muted)' }}>Port 8001 &amp; 8002</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="aied-badge" style={{ margin: 0, padding: '2px 6px', fontSize: '0.66rem', background: 'rgba(255,255,255,0.05)', color: '#ffffff', borderColor: 'var(--aied-border)' }}>
                    Node.js 20 Express (25 Controllers)
                  </span>
                  <span className="aied-badge" style={{ margin: 0, padding: '2px 6px', fontSize: '0.66rem', background: 'rgba(255,255,255,0.05)', color: '#ffffff', borderColor: 'var(--aied-border)' }}>
                    FastAPI LLM Bridge (Python 3.11)
                  </span>
                  <span className="aied-badge" style={{ margin: 0, padding: '2px 6px', fontSize: '0.66rem', background: 'rgba(255,255,255,0.05)', color: '#ffffff', borderColor: 'var(--aied-border)' }}>
                    Socket.IO 4.8 Realtime
                  </span>
                </div>
              </div>

              {/* Data Persistence Tier */}
              <div style={{ background: 'var(--aied-bg-card)', border: '1px solid var(--aied-border)', borderRadius: '8px', padding: '10px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--aied-purple)', fontWeight: 700, fontFamily: 'var(--aied-font-mono)' }}>03 // DATA &amp; STATE PERSISTENCE</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--aied-text-muted)' }}>
                    <CountUpNumber end={44} duration={1.2} /> Relational Entities
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="aied-badge" style={{ margin: 0, padding: '2px 6px', fontSize: '0.66rem', background: 'rgba(255,255,255,0.05)', color: '#ffffff', borderColor: 'var(--aied-border)' }}>
                    <Database size={11} style={{ marginRight: 3 }} /> PostgreSQL 15 (Prisma ORM)
                  </span>
                  <span className="aied-badge" style={{ margin: 0, padding: '2px 6px', fontSize: '0.66rem', background: 'rgba(255,255,255,0.05)', color: '#ffffff', borderColor: 'var(--aied-border)' }}>
                    Google Cloud Storage
                  </span>
                  <span className="aied-badge" style={{ margin: 0, padding: '2px 6px', fontSize: '0.66rem', background: 'rgba(255,255,255,0.05)', color: '#ffffff', borderColor: 'var(--aied-border)' }}>
                    Tally XML Protocol
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
