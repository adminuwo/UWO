import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Layers, Database, Cpu, ShieldCheck, Check, Server, Smartphone, Globe, 
  User, ArrowRight, Zap, Cloud, Network, RefreshCw
} from 'lucide-react';

const ARCH_BUS_STAGES = [
  { 
    id: 'client', 
    label: 'Client Tier', 
    sub: 'React 19 & Expo SDK 56', 
    icon: Smartphone, 
    color: '#00b87a',
    telemetry: { protocol: 'HTTP/3 + WebSockets', latency: '< 15ms', isolation: 'Client Context Isolation' }
  },
  { 
    id: 'gateway', 
    label: 'API Gateway', 
    sub: 'Cloud Run Reverse Proxy', 
    icon: Server, 
    color: '#16b8e8',
    telemetry: { protocol: 'Reverse Proxy SSL', latency: '< 20ms', isolation: 'Compound Rate Limiter' }
  },
  { 
    id: 'services', 
    label: 'Academic Microservices', 
    sub: 'Timetables, Roll Calls, Exams', 
    icon: Layers, 
    color: '#8b5cf6',
    telemetry: { protocol: 'gRPC Internal Mesh', latency: '< 12ms', isolation: 'Role-Based Enclave' }
  },
  { 
    id: 'ai', 
    label: 'Dual-LLM Routing', 
    sub: 'Vertex AI & OpenAI RAG', 
    icon: Cpu, 
    color: '#00b87a',
    telemetry: { protocol: 'REST + Streaming', latency: '< 180ms TTFT', isolation: 'Zero Data Retention' }
  },
  { 
    id: 'db', 
    label: 'PostgreSQL & Tally', 
    sub: 'pgvector & ERP Bridge', 
    icon: Database, 
    color: '#16b8e8',
    telemetry: { protocol: 'TLS Native / XML Sync', latency: '< 8ms', isolation: 'Strict org_id Schemas' }
  }
];

export default function PlatformOverview() {
  const shouldReduceMotion = useReducedMotion();
  const [activeStageId, setActiveStageId] = useState('services');
  const activeStage = ARCH_BUS_STAGES.find(s => s.id === activeStageId) || ARCH_BUS_STAGES[2];

  return (
    <section className="aied-section" id="platform-overview">
      <div className="aied-container">
        <div className="aied-section-header">
          <span className="aied-badge aied-badge-cyan">
            <Layers size={14} />
            System Architecture
          </span>
          <h2 className="aied-section-title">
            One Connected <br />
            <span className="aied-gradient-emerald">Academic Ecosystem.</span>
          </h2>
          <p className="aied-section-subtitle">
            Unified real-time microservices connecting students, faculty, resources, and governance.
          </p>
        </div>

        {/* Cohesive Architectural Data Bus (Visual Object - NOT Cards) */}
        <div className="aied-arch-bus-stage">
          {/* Top Bus Ribbon */}
          <div className="aied-arch-bus-strip">
            <div className="aied-arch-bus-header">
              <span className="aied-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#00b87a', display: 'inline-block', boxShadow: '0 0 6px #00b87a' }}></span>
              <span className="aied-arch-bus-lbl">DATA BUS INFRASTRUCTURE PIPELINE</span>
              <span className="aied-arch-bus-tag">Live Ingress: 99.98% SLA</span>
            </div>

            {/* Horizontal Nodes Ribbon */}
            <div className="aied-arch-bus-nodes">
              {ARCH_BUS_STAGES.map((stage, idx) => {
                const StageIcon = stage.icon;
                const isSelected = activeStageId === stage.id;
                return (
                  <React.Fragment key={stage.id}>
                    <button
                      type="button"
                      className={`aied-bus-node ${isSelected ? 'active' : ''}`}
                      onClick={() => setActiveStageId(stage.id)}
                      style={{
                        borderColor: isSelected ? stage.color : undefined,
                        boxShadow: isSelected ? `0 0 18px ${stage.color}40` : undefined
                      }}
                    >
                      <div className="aied-bus-node-icon" style={{ color: stage.color, background: `${stage.color}15` }}>
                        <StageIcon size={16} />
                      </div>
                      <div className="aied-bus-node-meta">
                        <span className="aied-bus-node-title">{stage.label}</span>
                        <span className="aied-bus-node-sub">{stage.sub}</span>
                      </div>
                      {isSelected && (
                        <span className="aied-bus-node-dot" style={{ background: stage.color }}></span>
                      )}
                    </button>

                    {idx < ARCH_BUS_STAGES.length - 1 && (
                      <div className="aied-bus-link">
                        <div className="aied-bus-link-line"></div>
                        <ArrowRight size={10} className="aied-bus-arrow" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Interactive Inspection Console (Visual Terminal Readout) */}
          <div className="aied-arch-console">
            <div className="aied-console-bar">
              <div className="aied-console-left">
                <Zap size={13} style={{ color: activeStage.color }} />
                <span className="aied-console-title">INSPECTION NODE: {activeStage.label.toUpperCase()}</span>
              </div>
              <span className="aied-badge" style={{ margin: 0, padding: '2px 8px', fontSize: '0.64rem' }}>
                <ShieldCheck size={11} style={{ marginRight: 4, color: '#00b87a' }} />
                CASA Tier-2 Standard
              </span>
            </div>

            <div className="aied-console-grid">
              <div className="aied-console-metric-tile">
                <span className="aied-metric-lbl">Transfer Protocol</span>
                <span className="aied-metric-val" style={{ color: activeStage.color }}>{activeStage.telemetry.protocol}</span>
              </div>
              <div className="aied-console-metric-tile">
                <span className="aied-metric-lbl">Telemetry Latency</span>
                <span className="aied-metric-val" style={{ color: '#00b87a' }}>{activeStage.telemetry.latency}</span>
              </div>
              <div className="aied-console-metric-tile">
                <span className="aied-metric-lbl">Tenancy Guardrail</span>
                <span className="aied-metric-val" style={{ color: '#16b8e8' }}>{activeStage.telemetry.isolation}</span>
              </div>
            </div>

            {/* Quick Architecture Feature Badges */}
            <div className="aied-console-chips-row">
              <span className="aied-chip-pill">
                <Check size={11} className="text-emerald-400" />
                <span>Strict Database Multi-Tenancy (org_id)</span>
              </span>
              <span className="aied-chip-pill">
                <Check size={11} className="text-emerald-400" />
                <span>Dual-LLM Pedagogical Routing (Gemini 2.5 + GPT-4o-mini)</span>
              </span>
              <span className="aied-chip-pill">
                <Check size={11} className="text-emerald-400" />
                <span>Native XML over HTTP Tally ERP Sync</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
