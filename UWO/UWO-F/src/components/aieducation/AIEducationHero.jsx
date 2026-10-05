import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Building2, Users, GraduationCap, ShieldCheck, Cpu, 
  ExternalLink, ArrowRight, CheckCircle2, School, UserCircle, Key
} from 'lucide-react';
import { SEEDED_INSTITUTIONS } from '../../constants/aiEducationConstants';
import { fadeInUp, staggerContainer, CountUpNumber } from './motionVariants';

export default function AIEducationHero({ onExploreClick }) {
  const shouldReduceMotion = useReducedMotion();

  // Login Widget State (Interactive live recreation of the actual product login UI)
  const [scope, setScope] = useState('school'); // 'school' | 'individual'
  const [portal, setPortal] = useState('faculty'); // 'faculty' | 'student' | 'parent' | 'tutor'
  const [selectedInstIndex, setSelectedInstIndex] = useState(0);
  const activeInst = SEEDED_INSTITUTIONS[selectedInstIndex];

  // Pre-filled credentials based on active role
  const [emailInput, setEmailInput] = useState(activeInst.demoAccounts.faculty.email);
  const [passwordInput, setPasswordInput] = useState('Demo1234!');

  // Desktop subtle mouse parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fine = window.matchMedia('(pointer: fine)').matches;
      setIsFinePointer(fine);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!isFinePointer || shouldReduceMotion) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const normX = (clientX / innerWidth - 0.5) * 2; // -1 to 1
    const normY = (clientY / innerHeight - 0.5) * 2;
    setMousePos({ x: normX, y: normY });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handlePortalChange = (newPortal) => {
    setPortal(newPortal);
    if (newPortal === 'faculty') {
      setEmailInput(activeInst.demoAccounts.faculty.email);
    } else if (newPortal === 'student') {
      setEmailInput(activeInst.demoAccounts.student.id);
    } else if (newPortal === 'parent') {
      setEmailInput(activeInst.demoAccounts.parent.id);
    } else if (newPortal === 'tutor') {
      setEmailInput('tutor.sharma@gmail.com');
    }
    setPasswordInput('Demo1234!');
  };

  const cycleInstitution = () => {
    const nextIdx = (selectedInstIndex + 1) % SEEDED_INSTITUTIONS.length;
    setSelectedInstIndex(nextIdx);
    const nextInst = SEEDED_INSTITUTIONS[nextIdx];
    if (portal === 'faculty') setEmailInput(nextInst.demoAccounts.faculty.email);
    else if (portal === 'student') setEmailInput(nextInst.demoAccounts.student.id);
    else if (portal === 'parent') setEmailInput(nextInst.demoAccounts.parent.id);
  };

  return (
    <section 
      className="aied-hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aied-hero-bg-canvas"></div>
      <div className="aied-academic-grid"></div>

      {/* Subtle Ambient Academic Constellation Network */}
      <svg 
        className="aied-hero-ambient-svg" 
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.45
        }}
      >
        <defs>
          <linearGradient id="heroSignalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00b87a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#16b8e8" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Ambient constellation links */}
        <line x1="15%" y1="25%" x2="35%" y2="40%" stroke="rgba(0, 184, 122, 0.15)" strokeWidth="1" strokeDasharray="3 5" />
        <line x1="35%" y1="40%" x2="55%" y2="20%" stroke="rgba(22, 184, 232, 0.15)" strokeWidth="1" strokeDasharray="4 6" />
        <line x1="65%" y1="65%" x2="88%" y2="45%" stroke="rgba(0, 184, 122, 0.12)" strokeWidth="1" strokeDasharray="3 5" />
        <line x1="88%" y1="45%" x2="75%" y2="25%" stroke="rgba(139, 92, 246, 0.12)" strokeWidth="1" strokeDasharray="4 6" />

        {/* Subtle moving signal particles across ambient lines */}
        {!shouldReduceMotion && (
          <>
            <motion.circle
              r="2.5"
              fill="#00b87a"
              animate={{
                cx: ['15%', '35%'],
                cy: ['25%', '40%'],
                opacity: [0, 0.8, 0]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
            />
            <motion.circle
              r="2"
              fill="#16b8e8"
              animate={{
                cx: ['65%', '88%'],
                cy: ['65%', '45%'],
                opacity: [0, 0.85, 0]
              }}
              transition={{ duration: 9, delay: 2, repeat: Infinity, ease: 'linear' }}
            />
          </>
        )}

        {/* Faint ambient nodes */}
        <circle cx="15%" cy="25%" r="3" fill="#00b87a" opacity="0.3" />
        <circle cx="35%" cy="40%" r="2.5" fill="#16b8e8" opacity="0.25" />
        <circle cx="55%" cy="20%" r="3" fill="#00b87a" opacity="0.2" />
        <circle cx="65%" cy="65%" r="2.5" fill="#16b8e8" opacity="0.25" />
        <circle cx="88%" cy="45%" r="3" fill="#8b5cf6" opacity="0.3" />
        <circle cx="75%" cy="25%" r="2" fill="#00b87a" opacity="0.2" />
      </svg>

      <div className="aied-container">
        <div className="aied-hero-content">
          {/* LEFT: Hero Copy & Value Proposition */}
          <motion.div 
            className="aied-hero-text"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <span className="aied-badge">
                <span className="aied-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#00b87a', display: 'inline-block', boxShadow: '0 0 8px #00b87a' }}></span>
                <Cpu size={14} className="text-emerald-400" />
                AI EDUCATION™ v2.6 · OFFICIAL PRODUCT SHOWCASE
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp}>
              Intelligence for <br />
              <span className="aied-gradient-emerald">Modern Education.</span>
            </motion.h1>

            <motion.p className="aied-hero-desc" variants={fadeInUp}>
              An AI-powered academic operating platform connecting institutions, faculty, 
              students, parents, and administrators through one unified, intelligent ecosystem.
            </motion.p>

            <motion.div className="aied-hero-actions" variants={fadeInUp}>
              <button 
                type="button" 
                className="aied-btn-primary"
                onClick={onExploreClick}
              >
                <span>Explore AI Education</span>
                <ArrowRight size={18} />
              </button>

              <a 
                href="https://education.uwo24.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="aied-btn-secondary"
              >
                <span>Open Platform</span>
                <ExternalLink size={16} />
              </a>
            </motion.div>

            {/* Live Infrastructure Telemetry Strip with CountUp */}
            <motion.div className="aied-hero-telemetry-strip" variants={fadeInUp}>
              <div className="aied-telemetry-item">
                <span className="aied-telemetry-val">
                  <CountUpNumber end={11} duration={1.2} />
                </span>
                <span className="aied-telemetry-lbl">Institutional Roles</span>
              </div>
              <div className="aied-telemetry-item">
                <span className="aied-telemetry-val" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16b8e8', boxShadow: '0 0 6px #16b8e8' }}></span>
                  Dual-LLM
                </span>
                <span className="aied-telemetry-lbl">Vertex &amp; OpenAI</span>
              </div>
              <div className="aied-telemetry-item">
                <span className="aied-telemetry-val">
                  <CountUpNumber end={100} duration={1.4} suffix="%" /> Scoped
                </span>
                <span className="aied-telemetry-lbl">Textbook RAG</span>
              </div>
              <div className="aied-telemetry-item">
                <span className="aied-telemetry-val">CASA Tier-2</span>
                <span className="aied-telemetry-lbl">Zero-BOLA Tenancy</span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Authentic Interactive Login & Campus Portal UI */}
          <motion.div 
            className="aied-hero-visual-col"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Subtle Desktop Mouse Parallax Wrapper */}
            <motion.div
              style={{
                x: isFinePointer && !shouldReduceMotion ? mousePos.x * 6 : 0,
                y: isFinePointer && !shouldReduceMotion ? mousePos.y * 6 : 0,
                transition: 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)'
              }}
            >
              {/* Product Frame with subtle continuous floating motion */}
              <motion.div 
                className="aied-product-browser-frame"
                animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Browser Window Chrome */}
                <div className="aied-browser-chrome">
                  <div className="aied-browser-dots">
                    <div className="aied-browser-dot red"></div>
                    <div className="aied-browser-dot yellow"></div>
                    <div className="aied-browser-dot green"></div>
                  </div>
                  <div className="aied-browser-address">
                    <ShieldCheck size={11} className="text-emerald-400" />
                    <span>https://education.uwo24.com/login</span>
                  </div>
                  <div style={{ width: 28 }}></div>
                </div>

                {/* Real Login Widget Recreation */}
                <div className="aied-login-widget">
                  <div className="aied-login-header">
                    <div className="aied-login-brand">
                      <img 
                        src="/images/ai-education-logo.jpg" 
                        alt="AI Education Logo" 
                        className="aied-login-brand-logo" 
                      />
                      <div className="aied-login-brand-text">
                        <h3>AI Education<sup>™</sup></h3>
                        <p>Digital Campus Collaboration &amp; Academic Portal</p>
                      </div>
                    </div>
                    <span className="aied-badge" style={{ margin: 0, padding: '1px 6px', fontSize: '0.55rem' }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#00b87a', display: 'inline-block', boxShadow: '0 0 4px #00b87a' }}></span>
                      Live Portal
                    </span>
                  </div>

                  {/* Primary Scope Switcher: School vs Tuition */}
                  <div className="aied-scope-switcher">
                    <button 
                      type="button" 
                      className={`aied-scope-btn ${scope === 'school' ? 'active' : ''}`}
                      onClick={() => { setScope('school'); handlePortalChange('faculty'); }}
                    >
                      <Building2 size={11} />
                      <span>School / Institution</span>
                    </button>
                    <button 
                      type="button" 
                      className={`aied-scope-btn ${scope === 'individual' ? 'active' : ''}`}
                      onClick={() => { setScope('individual'); handlePortalChange('student'); }}
                    >
                      <UserCircle size={11} />
                      <span>Individual / Tuition</span>
                    </button>
                  </div>

                  {/* Sub-portal Selector */}
                  {scope === 'school' ? (
                    <div className="aied-portal-tabs">
                      <button 
                        type="button" 
                        className={`aied-portal-tab ${portal === 'faculty' ? 'active' : ''}`}
                        onClick={() => handlePortalChange('faculty')}
                      >
                        <School size={11} />
                        <span>Faculty &amp; Staff</span>
                      </button>
                      <button 
                        type="button" 
                        className={`aied-portal-tab ${portal === 'student' ? 'active' : ''}`}
                        onClick={() => handlePortalChange('student')}
                      >
                        <GraduationCap size={11} />
                        <span>Student Portal</span>
                      </button>
                      <button 
                        type="button" 
                        className={`aied-portal-tab ${portal === 'parent' ? 'active' : ''}`}
                        onClick={() => handlePortalChange('parent')}
                      >
                        <Users size={11} />
                        <span>Parent Portal</span>
                      </button>
                    </div>
                  ) : (
                    <div className="aied-portal-tabs">
                      <button 
                        type="button" 
                        className={`aied-portal-tab ${portal === 'student' ? 'active' : ''}`}
                        onClick={() => handlePortalChange('student')}
                      >
                        <GraduationCap size={11} />
                        <span>Tuition Student</span>
                      </button>
                      <button 
                        type="button" 
                        className={`aied-portal-tab ${portal === 'tutor' ? 'active' : ''}`}
                        onClick={() => handlePortalChange('tutor')}
                      >
                        <School size={11} />
                        <span>Private Tutor</span>
                      </button>
                    </div>
                  )}

                  {/* Institutional Workspace Strip (When in School mode) */}
                  {scope === 'school' && (
                    <div className="aied-workspace-strip">
                      <div className="aied-workspace-info">
                        <div className="aied-workspace-dot"></div>
                        <div>
                          <div className="aied-workspace-name">{activeInst.name}</div>
                          <div className="aied-workspace-slug">{activeInst.category} · {activeInst.domain}</div>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="aied-switch-inst-btn"
                        onClick={cycleInstitution}
                        title="Switch to another demo campus"
                      >
                        Switch Campus ⟳
                      </button>
                    </div>
                  )}

                  {/* Login Form Fields */}
                  <form onSubmit={(e) => { e.preventDefault(); window.open('https://education.uwo24.com', '_blank'); }}>
                    <div className="aied-form-group">
                      <label className="aied-form-label">
                        {portal === 'faculty' && 'Work Email or Faculty / Staff ID'}
                        {portal === 'student' && (scope === 'school' ? 'Student ID / Admission No' : 'Student Email Address')}
                        {portal === 'parent' && 'Parent ID / Guardian Mobile'}
                        {portal === 'tutor' && 'Tutor Email Address'}
                      </label>
                      <div className="aied-input-wrapper">
                        <i className="fa-solid fa-envelope"></i>
                        <input 
                          type="text" 
                          className="aied-input" 
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="Enter credentials"
                        />
                      </div>
                    </div>

                    <div className="aied-form-group">
                      <label className="aied-form-label">Password</label>
                      <div className="aied-input-wrapper">
                        <i className="fa-solid fa-lock"></i>
                        <input 
                          type="password" 
                          className="aied-input" 
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Seeded Quick Credentials Pill */}
                    <div className="aied-demo-presets">
                      <div className="aied-demo-presets-title">
                        <Key size={10} />
                        <span>Seeded Demo Account: {activeInst.shortName}</span>
                      </div>
                      <div className="aied-demo-pill-row">
                        <button 
                          type="button" 
                          className="aied-demo-pill"
                          onClick={() => handlePortalChange('faculty')}
                        >
                          Faculty: {activeInst.demoAccounts.faculty.name.split(' ')[1] || 'Staff'}
                        </button>
                        <button 
                          type="button" 
                          className="aied-demo-pill"
                          onClick={() => handlePortalChange('student')}
                        >
                          Student: {activeInst.demoAccounts.student.name.split(' ')[0]}
                        </button>
                        <button 
                          type="button" 
                          className="aied-demo-pill"
                          onClick={() => handlePortalChange('parent')}
                        >
                          Parent: {activeInst.demoAccounts.parent.name.split(' ')[0]}
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="aied-login-footer-notice" style={{ marginTop: '6px' }}>
                    Accounts provisioned by campus. Demo password: <code style={{ color: 'var(--aied-emerald)' }}>Demo1234!</code>
                  </div>
                </div>

                {/* Floating Telemetry Badges with Counter-Parallax and Pulse */}
                <motion.div 
                  className="aied-floating-pill pill-top-right"
                  style={{
                    x: isFinePointer && !shouldReduceMotion ? -mousePos.x * 4 : 0,
                    y: isFinePointer && !shouldReduceMotion ? -mousePos.y * 4 : 0
                  }}
                  animate={shouldReduceMotion ? {} : { y: [0, -3, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00b87a', boxShadow: '0 0 5px #00b87a' }}></span>
                  <CheckCircle2 size={10} className="text-emerald-400" />
                  <span>Dual-LLM: Vertex asia-south1</span>
                </motion.div>

                <motion.div 
                  className="aied-floating-pill pill-bottom-left"
                  style={{
                    x: isFinePointer && !shouldReduceMotion ? mousePos.x * 5 : 0,
                    y: isFinePointer && !shouldReduceMotion ? mousePos.y * 5 : 0
                  }}
                  animate={shouldReduceMotion ? {} : { y: [0, 3, 0] }}
                  transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#16b8e8', boxShadow: '0 0 5px #16b8e8' }}></span>
                  <ShieldCheck size={10} className="text-cyan-400" />
                  <span>Anti-BOLA Tenancy</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
