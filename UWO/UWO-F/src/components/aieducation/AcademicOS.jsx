import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Building2, School, GraduationCap, Users, QrCode, 
  Calendar, Award, BookOpen, MessageSquare, DollarSign, Cpu, Zap
} from 'lucide-react';
import { fadeInUp, staggerContainer } from './motionVariants';

const OS_NODES = [
  { id: 'inst', label: 'Institution', role: 'Multi-Tenant Root', icon: Building2, color: '#00B87A', desc: 'Central governance & branch tenancy', target: 'faculty' },
  { id: 'faculty', label: 'Faculty', role: 'Curriculum & Proxy', icon: School, color: '#16B8E8', desc: 'Timetables, roll calls & grading', target: 'students' },
  { id: 'students', label: 'Students', role: 'Personalized Learning', icon: GraduationCap, color: '#00B87A', desc: 'Textbook RAG, quizzes & hall tickets', target: 'parents' },
  { id: 'parents', label: 'Parents', role: 'Guardian Oversight', icon: Users, color: '#8B5CF6', desc: 'Multi-child tracking & fee receipts', target: 'inst' },
  { id: 'admissions', label: 'Admissions', role: 'Entrance Exam Suite', icon: QrCode, color: '#00B87A', desc: 'QR hall tickets & AI auto-grading', target: 'inst' },
  { id: 'academics', label: 'Academics', role: 'Timetable Operations', icon: Calendar, color: '#16B8E8', desc: '8-period conflict-free scheduling', target: 'faculty' },
  { id: 'assessment', label: 'Assessment', role: 'Report Card Pipeline', icon: Award, color: '#00B87A', desc: '3-tier digital signatures & seals', target: 'parents' },
  { id: 'learning', label: 'Learning', role: 'Class Textbook RAG', icon: BookOpen, color: '#2997FF', desc: 'Curriculum citations & adaptive streak', target: 'students' },
  { id: 'comm', label: 'Communication', role: 'Real-Time Channels', icon: MessageSquare, color: '#16B8E8', desc: 'Threaded discussions & AI summarizer', target: 'faculty' },
  { id: 'finance', label: 'Finance', role: 'Tally ERP 9 / Prime', icon: DollarSign, color: '#00B87A', desc: 'XML fee ledger & payroll sync', target: 'inst' }
];

export default function AcademicOS() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <section className="aied-section" id="academic-os">
      <div className="aied-container">
        <div className="aied-section-header">
          <span className="aied-badge">
            <Cpu size={14} />
            Institutional Architecture
          </span>
          <h2 className="aied-section-title">
            An Operating System for <br />
            <span className="aied-gradient-emerald">Modern Academic Institutions.</span>
          </h2>
          <p className="aied-section-subtitle">
            AI Education functions as the central neural operating layer, binding every campus department, 
            stakeholder role, and pedagogical process into an interconnected, real-time network.
          </p>
        </div>

        {/* Central Ecosystem Canvas & Connected Nodes */}
        <div className="aied-os-diagram">
          {/* Animated SVG Connections Overlay */}
          <svg 
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
          >
            <defs>
              <linearGradient id="emeraldGradientLine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00b87a" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#16b8e8" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Ambient decorative orbital rings with slow rotation */}
            <circle cx="50%" cy="130" r="180" fill="none" stroke="rgba(0, 184, 122, 0.14)" strokeWidth="1" strokeDasharray="4 6" />
            <circle cx="50%" cy="130" r="280" fill="none" stroke="rgba(22, 184, 232, 0.1)" strokeWidth="1" strokeDasharray="6 8" />

            {/* Animated signal beams from center kernel to perimeter */}
            {!shouldReduceMotion && (
              <>
                <motion.line
                  x1="50%" y1="130" x2="25%" y2="280"
                  stroke="url(#emeraldGradientLine)"
                  strokeWidth="1.5"
                  strokeDasharray="6 8"
                  initial={{ strokeDashoffset: 40 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
                <motion.line
                  x1="50%" y1="130" x2="75%" y2="280"
                  stroke="url(#emeraldGradientLine)"
                  strokeWidth="1.5"
                  strokeDasharray="6 8"
                  initial={{ strokeDashoffset: 40 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
                />
              </>
            )}
          </svg>

          {/* Central AI EDUCATION Node with breathing glow & pulse ring */}
          <motion.div 
            className="aied-os-center"
            initial={{ scale: 0.88, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', zIndex: 3 }}
          >
            {/* Ambient breathing aura behind the center logo */}
            <motion.div
              style={{
                position: 'absolute',
                inset: -12,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0, 184, 122, 0.25) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: -1
              }}
              animate={shouldReduceMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            <img 
              src="/images/ai-education-logo.jpg" 
              alt="AI Education Logo" 
              className="aied-os-center-logo" 
            />
            <div className="aied-os-center-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <span>AI EDUCATION<sup>™</sup></span>
            </div>
            <div className="aied-os-center-sub" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00b87a', boxShadow: '0 0 5px #00b87a' }}></span>
              Central Operating Kernel
            </div>
          </motion.div>

          {/* 10 Surrounding Connected Stakeholders & Operational Nodes */}
          <motion.div 
            className="aied-os-nodes-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            variants={staggerContainer}
            style={{ position: 'relative', zIndex: 2 }}
          >
            {OS_NODES.map((node, i) => {
              const IconComp = node.icon;
              const isSelected = selectedNode === node.id;
              return (
                <motion.div 
                  key={node.id} 
                  className="aied-os-node-card"
                  variants={fadeInUp}
                  whileHover={{ y: -4, borderColor: node.color }}
                  onClick={() => setSelectedNode(isSelected ? null : node.id)}
                  style={{
                    cursor: 'pointer',
                    borderColor: isSelected ? node.color : undefined,
                    boxShadow: isSelected ? `0 0 16px ${node.color}35` : undefined,
                    transition: 'border-color 0.25s ease, box-shadow 0.25s ease'
                  }}
                >
                  <div className="aied-os-node-icon" style={{ color: node.color, background: `${node.color}15` }}>
                    <IconComp size={20} />
                  </div>
                  <div className="aied-os-node-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{node.label}</span>
                    {isSelected && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: node.color, boxShadow: `0 0 6px ${node.color}` }}></span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: node.color, fontFamily: 'var(--aied-font-mono)', fontWeight: 600, marginBottom: '6px' }}>
                    {node.role}
                  </div>
                  <div className="aied-os-node-desc">{node.desc}</div>

                  {/* Connected Signal Target indicator */}
                  <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.66rem', color: 'var(--aied-text-subtle)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={10} style={{ color: node.color }} />
                    <span>Signals to: <strong>{OS_NODES.find(n => n.id === node.target)?.label || 'Kernel'}</strong></span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
