import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Building2, School, GraduationCap, Users, UserCircle, 
  CheckCircle2, ArrowRight, ShieldCheck, Zap, Activity, Clock, BookOpen, AlertCircle
} from 'lucide-react';
import { INSTITUTIONAL_ROLES } from '../../constants/aiEducationConstants';
import { fadeInUp, staggerContainer } from './motionVariants';

const ROLE_ICONS = {
  institution: Building2,
  faculty: School,
  students: GraduationCap,
  parents: Users,
  individual: UserCircle
};

export default function RoleExplorer() {
  const shouldReduceMotion = useReducedMotion();
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const currentRole = INSTITUTIONAL_ROLES[activeRoleIndex];

  return (
    <section className="aied-section" id="role-explorer">
      <div className="aied-container">
        <div className="aied-section-header">
          <span className="aied-badge">
            <Users size={14} />
            Institutional RBAC Matrix
          </span>
          <h2 className="aied-section-title">
            Tailored Experiences for <br />
            <span className="aied-gradient-emerald">Every Campus Stakeholder.</span>
          </h2>
          <p className="aied-section-subtitle">
            Convee Education enforces strict organizational isolation across 11 institutional roles, 
            delivering bespoke operational toolsets whether you are a university Dean, classroom teacher, 
            undergraduate student, or parent.
          </p>
        </div>

        {/* Role Selector Tabs with animated layoutId indicator */}
        <div className="aied-role-nav" style={{ position: 'relative' }}>
          {INSTITUTIONAL_ROLES.map((r, idx) => {
            const Icon = ROLE_ICONS[r.id] || Building2;
            const isActive = activeRoleIndex === idx;
            return (
              <button
                key={r.id}
                type="button"
                className={`aied-role-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveRoleIndex(idx)}
                style={{ position: 'relative' }}
              >
                {isActive && !shouldReduceMotion && (
                  <motion.div
                    layoutId="activeRoleTabGlow"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '8px',
                      background: `${r.accent}18`,
                      border: `1px solid ${r.accent}`,
                      zIndex: -1
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={18} style={{ color: isActive ? r.accent : 'inherit' }} />
                <span>{r.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Role Content Card with contextual OS workspace transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRole.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="aied-role-card"
          >
            {/* Left: Role Details & Functional Capabilities */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span className="aied-badge" style={{ margin: 0, background: `${currentRole.accent}15`, borderColor: `${currentRole.accent}35`, color: currentRole.accent }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: currentRole.accent, display: 'inline-block', boxShadow: `0 0 5px ${currentRole.accent}` }}></span>
                  {currentRole.badge}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--aied-text-subtle)', fontFamily: 'var(--aied-font-mono)' }}>
                  {currentRole.personas}
                </span>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                {currentRole.name}
              </h3>

              <p style={{ fontSize: '0.84rem', color: 'var(--aied-text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                {currentRole.tagline}
              </p>

              {/* Feature Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentRole.features.map((feat, fIdx) => (
                  <motion.div 
                    key={fIdx} 
                    className="aied-role-feature-item" 
                    style={{ marginBottom: 0 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: fIdx * 0.08, duration: 0.3 }}
                  >
                    <div className="aied-role-feature-icon" style={{ color: currentRole.accent, background: `${currentRole.accent}15` }}>
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', margin: '0 0 2px 0' }}>
                        {feat.title}
                      </h4>
                      <p style={{ fontSize: '0.74rem', color: 'var(--aied-text-muted)', margin: 0, lineHeight: 1.4 }}>
                        {feat.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Live Interactive Role Workspace Preview */}
            <div className="aied-role-preview-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--aied-border)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={15} style={{ color: currentRole.accent }} />
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--aied-font-mono)' }}>
                    ACTIVE WORKSPACE: {currentRole.name.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '0.66rem', color: currentRole.accent, fontFamily: 'var(--aied-font-mono)' }}>Live Session</span>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: currentRole.accent, boxShadow: `0 0 8px ${currentRole.accent}` }}></div>
                </div>
              </div>

              {/* Telemetry Metric Tile */}
              <div style={{ background: 'var(--aied-bg-surface)', border: '1px solid var(--aied-border)', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--aied-text-subtle)', textTransform: 'uppercase', marginBottom: '3px' }}>
                  {currentRole.telemetry.label}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: currentRole.accent, fontFamily: 'var(--aied-font-mono)' }}>
                  {currentRole.telemetry.value}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--aied-text-muted)', marginTop: '3px' }}>
                  {currentRole.telemetry.sub}
                </div>
              </div>

              {/* Context-Specific Live Workspace Widget */}
              {currentRole.id === 'institution' && (
                <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--aied-border)', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '0.72rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--aied-text-muted)' }}>
                    <span>Tenancy State</span>
                    <span style={{ color: 'var(--aied-emerald)', fontWeight: 700 }}>ORGASM_ISOLATED</span>
                  </div>
                  <div style={{ color: '#ffffff', fontFamily: 'var(--aied-font-mono)', fontSize: '0.68rem', lineHeight: 1.4 }}>
                    <span style={{ color: 'var(--aied-cyan)' }}>[AUDIT_LOG]:</span> Tally XML sync synced 128 vouchers · Zero BOLA violations recorded
                  </div>
                </div>
              )}

              {currentRole.id === 'faculty' && (
                <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--aied-border)', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '0.72rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--aied-text-muted)' }}>
                    <span>Active Timetable Status</span>
                    <span style={{ color: 'var(--aied-cyan)', fontWeight: 700 }}>Room 204 Assigned</span>
                  </div>
                  <div style={{ color: '#ffffff', fontFamily: 'var(--aied-font-mono)', fontSize: '0.68rem', lineHeight: 1.4 }}>
                    <span style={{ color: '#f59e0b' }}>[PROXY_ALERT]:</span> Period 3 automated substitute assigned to Dr. Ashwini Bhat (Physics)
                  </div>
                </div>
              )}

              {currentRole.id === 'students' && (
                <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--aied-border)', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '0.72rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--aied-text-muted)' }}>
                    <span>Pedagogical Context</span>
                    <span style={{ color: 'var(--aied-emerald)', fontWeight: 700 }}>NCERT Class 11 Physics</span>
                  </div>
                  <div style={{ color: '#ffffff', fontFamily: 'var(--aied-font-mono)', fontSize: '0.68rem', lineHeight: 1.4 }}>
                    <span style={{ color: 'var(--aied-emerald)' }}>[STUDY_BUDDY]:</span> 14-day study streak active · Kepler's Laws chapter indexed
                  </div>
                </div>
              )}

              {currentRole.id === 'parents' && (
                <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--aied-border)', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '0.72rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--aied-text-muted)' }}>
                    <span>Guardian Oversight</span>
                    <span style={{ color: 'var(--aied-purple)', fontWeight: 700 }}>Aarush Mehra (Enrolled)</span>
                  </div>
                  <div style={{ color: '#ffffff', fontFamily: 'var(--aied-font-mono)', fontSize: '0.68rem', lineHeight: 1.4 }}>
                    <span style={{ color: 'var(--aied-cyan)' }}>[ATTENDANCE]:</span> 96.4% sessions attended · 1 pending homework assignment
                  </div>
                </div>
              )}

              {currentRole.id === 'individual' && (
                <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--aied-border)', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '0.72rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--aied-text-muted)' }}>
                    <span>Direct Learner Tier</span>
                    <span style={{ color: 'var(--aied-emerald)', fontWeight: 700 }}>Freelance &amp; Tuition</span>
                  </div>
                  <div style={{ color: '#ffffff', fontFamily: 'var(--aied-font-mono)', fontSize: '0.68rem', lineHeight: 1.4 }}>
                    <span style={{ color: 'var(--aied-emerald)' }}>[PORTAL]:</span> Independent batch billing &amp; verified tutor credentials active
                  </div>
                </div>
              )}

              {/* Mock Security Constraint Token */}
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--aied-border)', borderRadius: '8px', padding: '10px 12px', fontSize: '0.68rem', fontFamily: 'var(--aied-font-mono)' }}>
                <div style={{ color: 'var(--aied-text-subtle)', marginBottom: '4px' }}>// Verified Security Constraint</div>
                <div style={{ color: '#ffffff', lineHeight: 1.45 }}>
                  <span style={{ color: 'var(--aied-cyan)' }}>authScope</span>: <span style={{ color: 'var(--aied-emerald)' }}>"{currentRole.id.toUpperCase()}"</span><br />
                  <span style={{ color: 'var(--aied-cyan)' }}>multiTenancy</span>: <span style={{ color: 'var(--aied-emerald)' }}>"org_isolated"</span><br />
                  <span style={{ color: 'var(--aied-cyan)' }}>permissions</span>: <span style={{ color: '#f59e0b' }}>[ "read:curriculum", "exec:audit" ]</span>
                </div>
              </div>

              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <a 
                  href="https://education.uwo24.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="aied-btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', padding: '7px 14px', fontSize: '0.78rem' }}
                >
                  <span>Launch {currentRole.name} View</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
