import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Building2, School, GraduationCap, Users, ArrowUpDown, Network, Zap } from 'lucide-react';
import { fadeInUp, staggerContainer } from './motionVariants';

const STAKEHOLDERS = [
  {
    id: 'inst',
    title: 'Institution & Deans',
    role: 'Central Governance',
    icon: Building2,
    color: '#00B87A',
    flowTo: 'Faculty & Teachers',
    flowLabel: 'Curriculum & Rules',
    desc: 'Broadcasts academic calendars, enforces timetable conflict resolution, audits fee ledgers with Tally, and signs final report cards.'
  },
  {
    id: 'faculty',
    title: 'Faculty & Teachers',
    role: 'Instruction & Evaluation',
    icon: School,
    color: '#16B8E8',
    flowTo: 'Enrolled Students',
    flowLabel: 'Assignments & Roll Call',
    desc: 'Receives instant substitute proxy notifications, executes rubric-based grading, logs roll calls, and publishes curriculum assignments.'
  },
  {
    id: 'student',
    title: 'Enrolled Students',
    role: 'Pedagogical Learning',
    icon: GraduationCap,
    color: '#00B87A',
    flowTo: 'Parents & Guardians',
    flowLabel: 'Progress & Hall Tickets',
    desc: 'Interacts with the AI Study Buddy citing authorized textbooks, completes daily 5-question adaptive quizzes, and downloads QR hall tickets.'
  },
  {
    id: 'parent',
    title: 'Parents & Guardians',
    role: 'Family Oversight',
    icon: Users,
    color: '#8B5CF6',
    flowTo: 'Institution & Deans',
    flowLabel: 'Fee Ledgers & Approvals',
    desc: 'Switches seamlessly between multiple enrolled children, tracks monthly attendance statistics, monitors homework deadlines, and inspects seals.'
  }
];

export default function InstitutionalEcosystem() {
  const shouldReduceMotion = useReducedMotion();
  const [activeStakeholder, setActiveStakeholder] = useState(null);

  return (
    <section className="aied-section" id="connected-ecosystem">
      <div className="aied-container">
        <div className="aied-section-header">
          <span className="aied-badge">
            <Network size={14} />
            Holistic Campus Connectivity
          </span>
          <h2 className="aied-section-title">
            One Academic Ecosystem. <br />
            <span className="aied-gradient-emerald">Every Stakeholder Connected.</span>
          </h2>
          <p className="aied-section-subtitle">
            Eliminate silos between campus leadership, classroom instructors, enrolled pupils, and guardians. 
            Information flows seamlessly through automated permissions, notifications, and shared ledgers.
          </p>
        </div>

        {/* 4-Stakeholder Connectivity Matrix with interactive flow states */}
        <motion.div 
          className="aied-trust-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', position: 'relative' }}
        >
          {STAKEHOLDERS.map((stk, i) => {
            const Icon = stk.icon;
            const isHovered = activeStakeholder === stk.id;
            return (
              <motion.div 
                key={stk.id}
                className="aied-trust-card"
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                onMouseEnter={() => setActiveStakeholder(stk.id)}
                onMouseLeave={() => setActiveStakeholder(null)}
                style={{
                  borderColor: isHovered ? stk.color : 'var(--aied-border)',
                  boxShadow: isHovered ? `0 0 20px ${stk.color}30` : 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div className="aied-trust-icon" style={{ color: stk.color, background: `${stk.color}15`, marginBottom: 0 }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: stk.color, boxShadow: `0 0 6px ${stk.color}` }}></span>
                    <span style={{ fontSize: '0.66rem', color: stk.color, fontFamily: 'var(--aied-font-mono)', fontWeight: 600 }}>
                      0{i + 1}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.68rem', color: stk.color, fontFamily: 'var(--aied-font-mono)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>
                  {stk.role}
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                  {stk.title}
                </h4>

                <p style={{ fontSize: '0.76rem', color: 'var(--aied-text-muted)', lineHeight: 1.45, margin: '0 0 12px 0' }}>
                  {stk.desc}
                </p>

                {/* Animated Flow Connector Arrow */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', fontSize: '0.68rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--aied-text-subtle)' }}>Data sync:</span>
                  <span style={{ color: stk.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Zap size={10} />
                    {stk.flowLabel} ➔
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
