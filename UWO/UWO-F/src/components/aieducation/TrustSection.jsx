import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Lock, KeyRound, Server, EyeOff, FileCode, CheckCircle2, Zap } from 'lucide-react';

const SECURITY_METRICS = [
  { id: 'casa', label: 'CASA Tier-2 Standard', icon: ShieldCheck, code: 'SEC-01', status: 'VERIFIED', detail: 'Cloud Application Security Assessment Tier-2 authorized with rigorous multi-tenant data boundary verification.' },
  { id: 'iso', label: 'Multi-Tenant Isolation', icon: Lock, code: 'SEC-02', status: 'ENFORCED', detail: 'Strict database-level org_id schema partitioning guaranteeing zero cross-institution data leakage.' },
  { id: 'bola', label: 'Zero BOLA / BFLA', icon: KeyRound, code: 'SEC-03', status: 'PROTECTED', detail: 'Every API endpoint enforces compound actor verification preventing unauthorized IDOR object tampering.' },
  { id: 'rate', label: 'Compound Rate Limiter', icon: Server, code: 'SEC-04', status: 'ACTIVE', detail: 'Adaptive classroom burst-tolerant rate limiting per client IP, user session, and institutional domain.' },
  { id: 'pii', label: 'Sanitized Audit Stream', icon: EyeOff, code: 'SEC-05', status: 'COMPLIANT', detail: 'Real-time hashing and obfuscation of all student credentials, exam logs, and payment voucher records.' },
  { id: 'llm', label: 'Zero LLM Training Retention', icon: FileCode, code: 'SEC-06', status: 'ENCRYPTED', detail: 'Enterprise Vertex AI & OpenAI API agreements ensuring zero institutional data retention or model training.' }
];

export default function TrustSection() {
  const shouldReduceMotion = useReducedMotion();
  const [activeMetricId, setActiveMetricId] = useState('casa');
  const activeMetric = SECURITY_METRICS.find(m => m.id === activeMetricId) || SECURITY_METRICS[0];

  return (
    <section className="aied-section" id="security-governance">
      <div className="aied-container">
        <div className="aied-section-header">
          <span className="aied-badge">
            <ShieldCheck size={14} />
            Institutional Governance &amp; Security
          </span>
          <h2 className="aied-section-title">
            Enterprise Security &amp; <span className="aied-gradient-emerald">CASA Tier-2 Compliance.</span>
          </h2>
          <p className="aied-section-subtitle">
            Zero compromises on data privacy. Hardened for national universities, engineering institutes, and K-12 systems.
          </p>
        </div>

        {/* Unified Security Vault Console (Visual Object - NOT Cards) */}
        <div className="aied-vault-console">
          {/* Top Verification Shield Ribbon */}
          <div className="aied-vault-shield-strip">
            <div className="aied-vault-shield-left">
              <div className="aied-vault-shield-emblem">
                <ShieldCheck size={28} className="text-emerald-400" />
              </div>
              <div>
                <div className="aied-vault-shield-title">ENTERPRISE SECURITY VAULT</div>
                <div className="aied-vault-shield-sub">CASA Tier-2 Authorized · OWASP Top 10 Hardened · End-to-End TLS 1.3</div>
              </div>
            </div>
            <div className="aied-vault-shield-badges">
              <span className="aied-vault-verified-pill">
                <CheckCircle2 size={12} />
                <span>100% AUDIT PASS</span>
              </span>
              <span className="aied-vault-verified-pill" style={{ borderColor: 'rgba(22, 184, 232, 0.4)', color: '#16b8e8' }}>
                <Zap size={12} />
                <span>ZERO PII RETENTION</span>
              </span>
            </div>
          </div>

          {/* Interactive Security Spec Bar (Clean Horizontal Segment Rack) */}
          <div className="aied-vault-specs-rack">
            {SECURITY_METRICS.map((metric) => {
              const MetricIcon = metric.icon;
              const isSelected = activeMetricId === metric.id;
              return (
                <button
                  key={metric.id}
                  type="button"
                  className={`aied-vault-spec-slot ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveMetricId(metric.id)}
                >
                  <div className="aied-vault-slot-header">
                    <span className="aied-vault-slot-code">{metric.code}</span>
                    <span className="aied-vault-slot-led" style={{ background: isSelected ? '#00b87a' : 'rgba(255,255,255,0.2)' }}></span>
                  </div>
                  <div className="aied-vault-slot-title">
                    <MetricIcon size={14} className={isSelected ? 'text-emerald-400' : 'text-slate-400'} />
                    <span>{metric.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Real-time Detail & Verification Readout */}
          <div className="aied-vault-readout">
            <div className="aied-vault-readout-header">
              <span className="aied-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#00b87a', display: 'inline-block', boxShadow: '0 0 6px #00b87a' }}></span>
              <span className="aied-vault-readout-code">SECURITY SPECIFICATION: {activeMetric.code}</span>
              <span className="aied-vault-readout-title">· {activeMetric.label}</span>
              <span className="aied-vault-readout-status">[{activeMetric.status}]</span>
            </div>
            <p className="aied-vault-readout-detail">
              {activeMetric.detail}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
