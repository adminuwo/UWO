import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Building2, School, GraduationCap, Users, UserCircle, 
  CheckCircle2, ArrowRight, ShieldCheck, Zap, Activity, Clock, BookOpen, AlertCircle
} from 'lucide-react';
import { INSTITUTIONAL_ROLES } from '../../constants/aiEducationConstants';

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
  const CurrentIcon = ROLE_ICONS[currentRole.id] || Building2;

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
            Role-based operational interfaces with strict organizational isolation.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="aied-role-nav">
          {INSTITUTIONAL_ROLES.map((r, idx) => {
            const Icon = ROLE_ICONS[r.id] || Building2;
            const isActive = activeRoleIndex === idx;
            return (
              <button
                key={r.id}
                type="button"
                className={`aied-role-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveRoleIndex(idx)}
              >
                <Icon size={16} style={{ color: isActive ? r.accent : 'inherit' }} />
                <span>{r.name}</span>
                {isActive && (
                  <span className="aied-role-active-bar" style={{ background: r.accent }}></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Unified Role Operating Console (Visual Object - NOT Cards) */}
        <div className="aied-role-console-stage">
          {/* Top Status Bar */}
          <div className="aied-role-console-bar">
            <div className="aied-role-console-left">
              <span className="aied-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: currentRole.accent, display: 'inline-block', boxShadow: `0 0 6px ${currentRole.accent}` }}></span>
              <span className="aied-role-console-badge" style={{ color: currentRole.accent }}>{currentRole.badge}</span>
              <span className="aied-role-console-personas">// {currentRole.personas}</span>
            </div>
            <div className="aied-role-console-telemetry">
              <span className="aied-telemetry-tag">{currentRole.telemetry.label}:</span>
              <span className="aied-telemetry-highlight" style={{ color: currentRole.accent }}>{currentRole.telemetry.value}</span>
            </div>
          </div>

          <div className="aied-role-console-grid">
            {/* LEFT: Concise Capability Checklist */}
            <div className="aied-role-console-capabilities">
              <div className="aied-caps-header">
                <ShieldCheck size={14} style={{ color: currentRole.accent }} />
                <span>ENFORCED OPERATIONAL CAPABILITIES</span>
              </div>

              <div className="aied-caps-list">
                {currentRole.features.map((feat, fIdx) => (
                  <div key={fIdx} className="aied-cap-row">
                    <div className="aied-cap-bullet" style={{ background: `${currentRole.accent}20`, color: currentRole.accent }}>
                      <CheckCircle2 size={13} />
                    </div>
                    <div className="aied-cap-text">
                      <div className="aied-cap-title">{feat.title}</div>
                      <div className="aied-cap-desc">{feat.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Live Interactive Workspace Simulator Screen */}
            <div className="aied-role-console-preview">
              <div className="aied-preview-screen-head">
                <div className="aied-screen-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="aied-screen-title">ACTIVE WORKSPACE: {currentRole.name.toUpperCase()}</span>
                <span className="aied-screen-live" style={{ color: currentRole.accent }}>● Live Ingress</span>
              </div>

              <div className="aied-preview-screen-body">
                {currentRole.id === 'institution' && (
                  <div className="aied-sim-widget">
                    <div className="aied-sim-stat-row">
                      <div className="aied-sim-pill">
                        <span className="lbl">Multi-Tenancy</span>
                        <span className="val text-emerald-400">100% Org-Isolated</span>
                      </div>
                      <div className="aied-sim-pill">
                        <span className="lbl">Tally Sync</span>
                        <span className="val text-cyan-400">128 Vouchers Clean</span>
                      </div>
                    </div>
                    <div className="aied-sim-log">
                      <span className="text-emerald-400">[AUDIT_LOG]:</span> Database schema verified · Zero BOLA/IDOR violations recorded across 42 endpoints.
                    </div>
                  </div>
                )}

                {currentRole.id === 'faculty' && (
                  <div className="aied-sim-widget">
                    <div className="aied-sim-stat-row">
                      <div className="aied-sim-pill">
                        <span className="lbl">Timetable Solver</span>
                        <span className="val text-cyan-400">0 Clashes Detected</span>
                      </div>
                      <div className="aied-sim-pill">
                        <span className="lbl">Proxy Speed</span>
                        <span className="val text-emerald-400">&lt; 180ms WebSocket</span>
                      </div>
                    </div>
                    <div className="aied-sim-log">
                      <span className="text-amber-400">[PROXY_DISPATCH]:</span> Period 3 substitute assigned to Dr. Ashwini Bhat (Room 204).
                    </div>
                  </div>
                )}

                {currentRole.id === 'students' && (
                  <div className="aied-sim-widget">
                    <div className="aied-sim-stat-row">
                      <div className="aied-sim-pill">
                        <span className="lbl">Study Buddy</span>
                        <span className="val text-emerald-400">14-Day Streak 🔥</span>
                      </div>
                      <div className="aied-sim-pill">
                        <span className="lbl">Textbook RAG</span>
                        <span className="val text-cyan-400">NCERT Grounded</span>
                      </div>
                    </div>
                    <div className="aied-sim-log">
                      <span className="text-emerald-400">[AI_QUERY]:</span> Kepler's laws verified · Chapter 7, Page 168 cited with 94.2% confidence.
                    </div>
                  </div>
                )}

                {currentRole.id === 'parents' && (
                  <div className="aied-sim-widget">
                    <div className="aied-sim-stat-row">
                      <div className="aied-sim-pill">
                        <span className="lbl">Multi-Child</span>
                        <span className="val text-purple-400">2 Enrolled Students</span>
                      </div>
                      <div className="aied-sim-pill">
                        <span className="lbl">Attendance</span>
                        <span className="val text-emerald-400">96.8% Present</span>
                      </div>
                    </div>
                    <div className="aied-sim-log">
                      <span className="text-purple-400">[PARENT_FEED]:</span> Mid-term digital report card signed by Dean · Fee receipt #REC-2026-904 cleared.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
