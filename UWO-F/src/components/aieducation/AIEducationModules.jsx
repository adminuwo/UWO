import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, FileText, QrCode, MessageSquare, DollarSign, 
  ShieldCheck, ArrowRight, CheckCircle2, Layers
} from 'lucide-react';

const APP_MODULES = [
  {
    id: 'timetable',
    code: 'MOD-01',
    name: 'Smart Timetable & Proxy',
    category: 'Operations',
    icon: Calendar,
    accent: '#4F46E5',
    headline: '8-period conflict-free scheduling with instant substitute teacher proxy dispatch.',
    points: ['Clash-free room & teacher mapping', '< 200ms WebSocket substitute alert', 'Mobile app period push notifications']
  },
  {
    id: 'exams',
    code: 'MOD-02',
    name: 'Examinations & Report Cards',
    category: 'Assessment',
    icon: FileText,
    accent: '#0EA5E9',
    headline: 'Full exam lifecycle from question drafting to digitally signed report cards.',
    points: ['Theory vs practical weighting', 'Automated constructive feedback', 'Digitally sealed official transcripts']
  },
  {
    id: 'admissions',
    code: 'MOD-03',
    name: 'Admissions & QR Hall Tickets',
    category: 'Admissions',
    icon: QrCode,
    accent: '#10B981',
    headline: 'Candidate testing environment with tamper-evident QR code entrance admit passes.',
    points: ['Anti-tab switching exam portal', 'Printable dynamic QR admit cards', 'Automated merit list generation']
  },
  {
    id: 'communication',
    code: 'MOD-04',
    name: 'Campus Chat & AI Summaries',
    category: 'Collaboration',
    icon: MessageSquare,
    accent: '#8B5CF6',
    headline: 'Real-time class channels with an AI assistant that summarizes missed discussions.',
    points: ['Isolated class & department rooms', '1-click summary of 100+ messages', 'Emergency circular broadcast alerts']
  },
  {
    id: 'tally',
    code: 'MOD-05',
    name: 'Tally ERP 9 / Prime Sync',
    category: 'Finance',
    icon: DollarSign,
    accent: '#F59E0B',
    headline: 'Bi-directional financial reconciliation for student fees, ledgers, and staff payroll.',
    points: ['Direct XML sync to localhost:9000', 'Automated fee receipts generation', 'Zero-discrepancy tombstone protocol']
  },
  {
    id: 'guardrails',
    code: 'MOD-06',
    name: 'Syllabus AI Guardrails',
    category: 'Security',
    icon: ShieldCheck,
    accent: '#EC4899',
    headline: 'Strict safety filters locking AI responses strictly to authorized coursebooks.',
    points: ['Zero hallucination guarantee', 'Aadhaar & phone PII masking', '24/7 student crisis helpline bypass']
  }
];

export default function AIEducationModules() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section className="aied-section-modules" id="modules-section">
      <div className="aied-container">
        
        {/* Short, Punchy Section Header */}
        <div className="aied-section-header">
          <div className="aied-section-eyebrow">
            <Layers size={13} />
            <span>Core Modules</span>
          </div>
          <h2 className="aied-section-title">
            Core Web & App <span className="accent">Functionalities.</span>
          </h2>
          <p className="aied-section-subtitle">
            Everything your institution needs, unified into a single digital platform.
          </p>
        </div>

        {/* 6 Modular Grid Tiles with Minimal Text & Rich Visuals */}
        <div className="aied-modules-grid">
          {APP_MODULES.map((mod, idx) => {
            const Icon = mod.icon;
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={mod.id}
                className="aied-module-card"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="aied-module-top">
                  <div 
                    className="aied-module-icon-wrap"
                    style={{ 
                      background: `${mod.accent}14`,
                      color: mod.accent,
                      borderColor: `${mod.accent}25`
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="aied-module-code">{mod.code}</span>
                </div>

                <div className="aied-module-cat">{mod.category}</div>
                <h3 className="aied-module-title">{mod.name}</h3>
                <p className="aied-module-headline">{mod.headline}</p>

                <div className="aied-module-bullets">
                  {mod.points.map((pt, pIdx) => (
                    <div key={pIdx} className="aied-module-bullet">
                      <CheckCircle2 size={13} style={{ color: mod.accent, flexShrink: 0 }} />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
