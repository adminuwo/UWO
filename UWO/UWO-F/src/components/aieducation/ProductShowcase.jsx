import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Building2, School, QrCode, GraduationCap, Users, 
  CheckCircle2, Clock, Calendar, Award, ExternalLink, Zap, Check, AlertCircle, ShieldCheck
} from 'lucide-react';
import { fadeInUp, CountUpNumber } from './motionVariants';

const SHOWCASE_TABS = [
  {
    id: 'operations',
    name: 'Academic Operations & Timetables',
    role: 'Dean / HOD View',
    icon: Calendar,
    accent: '#00B87A'
  },
  {
    id: 'admissions',
    name: 'Admission Exam Suite & QR Hall Ticket',
    role: 'Registrar / Proctors',
    icon: QrCode,
    accent: '#16B8E8'
  },
  {
    id: 'study-buddy',
    name: 'AI Study Buddy & Adaptive Quizzes',
    role: 'Student Portal',
    icon: GraduationCap,
    accent: '#00B87A'
  },
  {
    id: 'parent',
    name: 'Guardian Oversight & Certified Reports',
    role: 'Parent Portal',
    icon: Users,
    accent: '#8B5CF6'
  }
];

export default function ProductShowcase() {
  const shouldReduceMotion = useReducedMotion();
  const [activeTabId, setActiveTabId] = useState('operations');
  const activeTab = SHOWCASE_TABS.find(t => t.id === activeTabId) || SHOWCASE_TABS[0];

  // Interactive Timetable state
  const [selectedPeriod, setSelectedPeriod] = useState(1);

  // Interactive Quiz state
  const [quizSelection, setQuizSelection] = useState('B'); // Default 'B'
  const [quizSubmitted, setQuizSubmitted] = useState(true);

  // Interactive Parent student toggle
  const [selectedChild, setSelectedChild] = useState('aarush');

  return (
    <section className="aied-section" id="product-showcase">
      <div className="aied-container">
        <div className="aied-section-header">
          <span className="aied-badge">
            <School size={14} />
            Live Platform Showcase
          </span>
          <h2 className="aied-section-title">
            Authentic Product Interfaces. <br />
            <span className="aied-gradient-emerald">Built for Real Campus Workflows.</span>
          </h2>
          <p className="aied-section-subtitle">
            Inspect real operational interfaces from the AI Education platform — designed with high information 
            density, instant responsiveness, and enterprise clarity.
          </p>
        </div>

        {/* Tab Controls with layoutId indicator */}
        <div className="aied-role-nav" style={{ position: 'relative' }}>
          {SHOWCASE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`aied-role-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTabId(tab.id)}
                style={{ position: 'relative' }}
              >
                {isActive && !shouldReduceMotion && (
                  <motion.div
                    layoutId="activeShowcaseTabGlow"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '8px',
                      background: `${tab.accent}15`,
                      border: `1px solid ${tab.accent}`,
                      zIndex: -1
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={13} style={{ color: isActive ? tab.accent : 'inherit' }} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Showcase Browser Frame */}
        <div className="aied-product-browser-frame aied-showcase-browser-frame" style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div className="aied-browser-chrome">
            <div className="aied-browser-dots">
              <div className="aied-browser-dot red"></div>
              <div className="aied-browser-dot yellow"></div>
              <div className="aied-browser-dot green"></div>
            </div>
            <div className="aied-browser-address">
              <ShieldCheck size={11} className="text-emerald-400" />
              <span>https://education.uwo24.com/dashboard/{activeTab.id}</span>
            </div>
            <a 
              href="https://education.uwo24.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ fontSize: '0.75rem', color: 'var(--aied-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Live Site</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div style={{ padding: '24px 28px', background: 'radial-gradient(circle at 50% 0%, #111a2b 0%, #080c12 100%)', minHeight: '300px' }}>
            <AnimatePresence mode="wait">
              {/* TAB 1: ACADEMIC OPERATIONS & TIMETABLES */}
              {activeTabId === 'operations' && (
                <motion.div
                  key="operations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--aied-border)', paddingBottom: '10px', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                        Weekly Timetable Grid · Class 10-A (Secondary Wing)
                      </h4>
                      <div style={{ fontSize: '0.72rem', color: 'var(--aied-text-muted)' }}>
                        Conflict Detection: 0 Overlaps · Active Substitute Proxy Engine
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className="aied-badge" style={{ margin: 0, padding: '3px 8px', fontSize: '0.64rem', background: 'rgba(0,184,122,0.1)', borderColor: 'var(--aied-emerald)', color: 'var(--aied-emerald)' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00b87a', display: 'inline-block', boxShadow: '0 0 5px #00b87a' }}></span>
                        Live Period Active
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--aied-text-subtle)', fontFamily: 'var(--aied-font-mono)' }}>8 Periods · Mon-Sat</span>
                    </div>
                  </div>

                  {/* 4-Period Interactive Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                    <div 
                      onClick={() => setSelectedPeriod(1)}
                      style={{ 
                        background: selectedPeriod === 1 ? 'rgba(0, 184, 122, 0.12)' : 'var(--aied-bg-card)', 
                        border: `1px solid ${selectedPeriod === 1 ? 'var(--aied-emerald)' : 'var(--aied-border)'}`, 
                        borderRadius: '8px', 
                        padding: '12px 14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.66rem', color: 'var(--aied-text-subtle)' }}>
                        <span>09:00 - 09:45 AM</span>
                        <span style={{ color: 'var(--aied-emerald)', fontWeight: 700 }}>Period 1</span>
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', margin: '4px 0' }}>Advanced Mathematics</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--aied-text-muted)' }}>Prof. B. N. Chandrashekar</div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--aied-emerald)', marginTop: '6px' }}>Room 204 · Completed</div>
                    </div>

                    <div 
                      onClick={() => setSelectedPeriod(2)}
                      style={{ 
                        background: selectedPeriod === 2 ? 'rgba(22, 184, 232, 0.12)' : 'var(--aied-bg-card)', 
                        border: `1px solid ${selectedPeriod === 2 ? 'var(--aied-cyan)' : 'var(--aied-cyan)'}`, 
                        borderRadius: '8px', 
                        padding: '12px 14px',
                        cursor: 'pointer',
                        position: 'relative',
                        boxShadow: '0 0 12px rgba(22, 184, 232, 0.2)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.66rem' }}>
                        <span style={{ color: 'var(--aied-cyan)', fontWeight: 700 }}>09:45 - 10:30 AM (NOW)</span>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16b8e8', boxShadow: '0 0 6px #16b8e8' }}></span>
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', margin: '4px 0' }}>Physics Mechanics</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--aied-text-muted)' }}>Mr. Rajesh Kumar Verma</div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--aied-cyan)', marginTop: '6px', fontWeight: 700 }}>Lab 2 · In Progress</div>
                    </div>

                    <div 
                      onClick={() => setSelectedPeriod(3)}
                      style={{ 
                        background: 'rgba(239, 68, 68, 0.08)', 
                        border: '1px solid rgba(239, 68, 68, 0.3)', 
                        borderRadius: '8px', 
                        padding: '12px 14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.66rem', color: '#ef4444' }}>10:45 - 11:30 AM (Leave)</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', margin: '4px 0' }}>Chemistry Lab</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--aied-text-muted)' }}>Leave: Dr. Sneha Kulkarni</div>
                      <div style={{ fontSize: '0.66rem', color: '#f59e0b', marginTop: '6px', fontWeight: 700 }}>
                        ➔ Proxy: Dr. Ashwini Bhat
                      </div>
                    </div>

                    <div 
                      onClick={() => setSelectedPeriod(4)}
                      style={{ 
                        background: selectedPeriod === 4 ? 'rgba(0, 184, 122, 0.12)' : 'var(--aied-bg-card)', 
                        border: `1px solid ${selectedPeriod === 4 ? 'var(--aied-emerald)' : 'var(--aied-border)'}`, 
                        borderRadius: '8px', 
                        padding: '12px 14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.66rem', color: 'var(--aied-text-subtle)' }}>11:30 - 12:15 PM</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', margin: '4px 0' }}>Computer Science / AI</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--aied-text-muted)' }}>Dr. Ashwini Bhat</div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--aied-emerald)', marginTop: '6px' }}>Computer Lab 1 · Scheduled</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--aied-border)', borderRadius: '6px', padding: '8px 12px', fontSize: '0.72rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--aied-text-muted)' }}>
                      Selected Period {selectedPeriod} Telemetry: <strong>Class 10-A Roster Verified (38 Students Present)</strong>
                    </span>
                    <span style={{ color: 'var(--aied-emerald)', fontFamily: 'var(--aied-font-mono)' }}>Proxy Alert Engine 0ms latency</span>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: ADMISSION EXAM SUITE & QR HALL TICKET */}
              {activeTabId === 'admissions' && (
                <motion.div
                  key="admissions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div style={{ background: '#ffffff', color: '#05080d', borderRadius: '10px', padding: '18px 24px', maxWidth: '560px', margin: '0 auto', boxShadow: '0 12px 36px rgba(0,0,0,0.6)', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #05080d', paddingBottom: '8px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 900, letterSpacing: '-0.01em' }}>CHANAKYA NATIONAL LAW UNIVERSITY</div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#555' }}>All India National Entrance Examination · Admit Card 2026</div>
                      </div>
                      <div style={{ padding: '3px 8px', background: '#05080d', color: '#ffffff', fontSize: '0.62rem', fontWeight: 700, borderRadius: '4px' }}>
                        OFFICIAL PASS
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '16px', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.78rem', lineHeight: 1.55 }}>
                        <div><strong>Candidate:</strong> Aarav Deshmukh</div>
                        <div><strong>Roll No:</strong> CNLU/2026/CYBER/01</div>
                        <div><strong>Center:</strong> New Delhi Campus · Main Auditorium</div>
                        <div><strong>Exam Date:</strong> Sunday, 15 October 2026 · 10:00 AM</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#008a5b', fontWeight: 700, marginTop: 4 }}>
                          <CheckCircle2 size={13} />
                          <span>Proctor Status: Verified &amp; Biometric Enrolled</span>
                        </div>
                      </div>

                      {/* Interactive Animated QR Code with Laser Scan Line */}
                      <div style={{ textAlign: 'center', background: '#f5f5f5', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ 
                          width: '74px', 
                          height: '74px', 
                          margin: '0 auto 6px auto', 
                          background: '#000000', 
                          position: 'relative',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: '#ffffff', 
                          fontSize: '0.6rem',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <span>[ QR CODE ]</span>

                          {/* Animated Laser Scanning Line */}
                          {!shouldReduceMotion && (
                            <motion.div
                              style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                height: '2px',
                                background: '#00b87a',
                                boxShadow: '0 0 8px #00b87a, 0 0 14px #00b87a'
                              }}
                              animate={{
                                top: ['0%', '100%', '0%']
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: 'easeInOut'
                              }}
                            />
                          )}
                        </div>
                        <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#05080d' }}>Dynamic QR Seal</div>
                        <div style={{ fontSize: '0.55rem', color: '#666' }}>RSA-2048 Signed</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: AI STUDY BUDDY & ADAPTIVE QUIZZES */}
              {activeTabId === 'study-buddy' && (
                <motion.div
                  key="study-buddy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <div style={{ background: 'var(--aied-bg-card)', border: '1px solid var(--aied-border)', borderRadius: '10px', padding: '16px 18px' }}>
                      <div style={{ fontSize: '0.68rem', color: 'var(--aied-text-subtle)', marginBottom: '6px' }}>DAILY STREAK</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--aied-emerald)' }}>
                        🔥 <CountUpNumber end={14} duration={1.2} suffix=" Days" />
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--aied-text-muted)', margin: '4px 0 10px 0' }}>Proficiency: Advanced Tier</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--aied-cyan)' }}>Syllabus: NCERT Class 11</div>
                    </div>

                    <div style={{ background: 'var(--aied-bg-card)', border: '1px solid var(--aied-border)', borderRadius: '10px', padding: '16px 18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                          Daily Adaptive Micro-Quiz · Question 3 of 5
                        </div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--aied-cyan)', fontFamily: 'var(--aied-font-mono)' }}>+10 XP</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--aied-text-muted)', marginBottom: '10px' }}>
                        Which of the following physical quantities is conserved when net external torque on a system is zero?
                      </p>

                      {/* Interactive Option Selectors */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.74rem' }}>
                        <button
                          type="button"
                          onClick={() => { setQuizSelection('A'); setQuizSubmitted(true); }}
                          style={{
                            textAlign: 'left',
                            padding: '8px 12px',
                            background: quizSelection === 'A' ? 'rgba(239, 68, 68, 0.12)' : 'var(--aied-bg-panel)',
                            borderRadius: '4px',
                            border: `1px solid ${quizSelection === 'A' ? '#ef4444' : 'var(--aied-border)'}`,
                            color: quizSelection === 'A' ? '#ef4444' : '#ffffff',
                            cursor: 'pointer'
                          }}
                        >
                          A. Linear Momentum {quizSelection === 'A' && '✗ (Conserved under zero external force, not torque)'}
                        </button>

                        <button
                          type="button"
                          onClick={() => { setQuizSelection('B'); setQuizSubmitted(true); }}
                          style={{
                            textAlign: 'left',
                            padding: '8px 12px',
                            background: quizSelection === 'B' ? 'var(--aied-emerald-surface)' : 'var(--aied-bg-panel)',
                            borderRadius: '4px',
                            border: `1px solid ${quizSelection === 'B' ? 'var(--aied-emerald-border)' : 'var(--aied-border)'}`,
                            color: quizSelection === 'B' ? 'var(--aied-emerald)' : '#ffffff',
                            fontWeight: quizSelection === 'B' ? 700 : 'normal',
                            cursor: 'pointer'
                          }}
                        >
                          ✓ B. Angular Momentum (Correct · NCERT Theorem 7.4)
                        </button>

                        <button
                          type="button"
                          onClick={() => { setQuizSelection('C'); setQuizSubmitted(true); }}
                          style={{
                            textAlign: 'left',
                            padding: '8px 12px',
                            background: quizSelection === 'C' ? 'rgba(239, 68, 68, 0.12)' : 'var(--aied-bg-panel)',
                            borderRadius: '4px',
                            border: `1px solid ${quizSelection === 'C' ? '#ef4444' : 'var(--aied-border)'}`,
                            color: quizSelection === 'C' ? '#ef4444' : '#ffffff',
                            cursor: 'pointer'
                          }}
                        >
                          C. Kinetic Energy {quizSelection === 'C' && '✗ (Not necessarily conserved in inelastic rotation)'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: GUARDIAN OVERSIGHT & CERTIFIED REPORTS */}
              {activeTabId === 'parent' && (
                <motion.div
                  key="parent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div style={{ background: 'var(--aied-bg-card)', border: '1px solid var(--aied-border)', borderRadius: '10px', padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#ffffff' }}>Parent Portal · Guardian Overview</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--aied-text-muted)' }}>Logged in as: Suresh Deshmukh (Parent ID: PAR-2026-0001)</div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => setSelectedChild('aarush')}
                          style={{
                            padding: '3px 8px',
                            fontSize: '0.64rem',
                            borderRadius: '4px',
                            border: `1px solid ${selectedChild === 'aarush' ? 'var(--aied-purple)' : 'var(--aied-border)'}`,
                            background: selectedChild === 'aarush' ? 'var(--aied-purple-surface)' : 'transparent',
                            color: selectedChild === 'aarush' ? 'var(--aied-purple)' : 'var(--aied-text-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          Aarav (Class 11)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedChild('ananya')}
                          style={{
                            padding: '3px 8px',
                            fontSize: '0.64rem',
                            borderRadius: '4px',
                            border: `1px solid ${selectedChild === 'ananya' ? 'var(--aied-purple)' : 'var(--aied-border)'}`,
                            background: selectedChild === 'ananya' ? 'var(--aied-purple-surface)' : 'transparent',
                            color: selectedChild === 'ananya' ? 'var(--aied-purple)' : 'var(--aied-text-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          Ananya (Class 8)
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                      <div style={{ background: 'var(--aied-bg-panel)', padding: '14px 16px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--aied-text-subtle)' }}>MONTHLY ATTENDANCE</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--aied-emerald)', margin: '3px 0' }}>
                          <CountUpNumber end={selectedChild === 'aarush' ? 96.4 : 98.2} decimals={1} suffix="%" duration={1.2} />
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--aied-text-muted)' }}>
                          {selectedChild === 'aarush' ? '78 / 81 Sessions Present' : '80 / 81 Sessions Present'}
                        </div>
                      </div>

                      <div style={{ background: 'var(--aied-bg-panel)', padding: '14px 16px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--aied-text-subtle)' }}>PENDING HOMEWORK</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--aied-cyan)', margin: '3px 0' }}>
                          {selectedChild === 'aarush' ? '1 Due' : 'All Clear ✓'}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--aied-text-muted)' }}>
                          {selectedChild === 'aarush' ? 'Cyber Evidence Briefing' : 'No overdue assignments'}
                        </div>
                      </div>

                      <div style={{ background: 'var(--aied-bg-panel)', padding: '14px 16px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--aied-text-subtle)' }}>REPORT CARD</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '3px 0' }}>
                          {selectedChild === 'aarush' ? 'Grade A+' : 'Grade O'}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--aied-emerald)' }}>3 Signatures Verified ✓</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
