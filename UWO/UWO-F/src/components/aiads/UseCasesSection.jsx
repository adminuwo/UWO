import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CheckCircle2, ArrowRight, Zap, Target, Shield, Rocket } from 'lucide-react';
import { AI_ADS_USE_CASES } from '../../constants/aiAdsConstants';

const PERSONA_METRICS = {
  startups: { stat: '10x Speed', metric: 'Go-to-market acceleration with zero agency overhead' },
  agencies: { stat: '50+ Workspaces', metric: 'Multi-tenant brand DNA segregation with shared asset vaults' },
  enterprises: { stat: '100% Guardrails', metric: 'SOC-2 compliant brand safety, RBAC, and approval pipelines' },
  creators: { stat: 'Zero-Prompt', metric: 'Instant multi-ratio repurposing from longform video to reels' }
};

export default function UseCasesSection() {
  const [activePersonaId, setActivePersonaId] = useState('startups');
  const activeUseCase = AI_ADS_USE_CASES.find(u => u.id === activePersonaId) || AI_ADS_USE_CASES[0];
  const personaMetric = PERSONA_METRICS[activePersonaId] || PERSONA_METRICS.startups;

  return (
    <section className="aiads-section" id="use-cases" style={{ background: '#ffffff', overflow: 'hidden' }}>
      <div className="aiads-container">
        {/* Minimal Header */}
        <div className="aiads-section-header" style={{ marginBottom: '28px' }}>
          <span className="aiads-badge aiads-badge-blue">
            <Users size={13} />
            Adaptive Operational Scale
          </span>
          <h2 className="aiads-section-title">
            Engineered for <span className="aiads-gradient-title">Every Growth Stage.</span>
          </h2>
          <p className="aiads-section-subtitle">
            From single-founder launches to multi-brand enterprise divisions with strict governance.
          </p>
        </div>

        {/* NON-CARD OBJECT: Interactive Persona Cockpit */}
        <div className="aiads-persona-cockpit-object">
          {/* Persona Selector Tabs */}
          <div className="aiads-persona-nav">
            {AI_ADS_USE_CASES.map((uc) => {
              const isActive = activePersonaId === uc.id;
              return (
                <button
                  key={uc.id}
                  type="button"
                  onClick={() => setActivePersonaId(uc.id)}
                  className={`aiads-persona-tab ${isActive ? 'active' : ''}`}
                  style={{ '--tab-accent': uc.accent }}
                >
                  <span className="persona-tab-dot"></span>
                  <span className="persona-tab-title">{uc.title}</span>
                </button>
              );
            })}
          </div>

          {/* Unified Persona Console (NO MULTIPLE BOXED CARDS) */}
          <div className="aiads-persona-console">
            <div className="aiads-persona-main">
              <div className="aiads-persona-header">
                <span className="aiads-persona-kicker" style={{ color: activeUseCase.accent }}>
                  {activeUseCase.title.toUpperCase()} ARCHITECTURE
                </span>
                <h3 className="aiads-persona-headline">{activeUseCase.subtitle}</h3>
              </div>

              {/* 3 Tactical Chips */}
              <div className="aiads-persona-chips">
                {activeUseCase.benefits.map((b, bIdx) => (
                  <div key={bIdx} className="aiads-persona-chip">
                    <CheckCircle2 size={13} style={{ color: activeUseCase.accent, flexShrink: 0 }} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Gauge Deck */}
            <div className="aiads-persona-metric-deck" style={{ '--accent-glow': activeUseCase.accent }}>
              <span className="deck-label">PRIMARY OUTCOME</span>
              <div className="deck-stat" style={{ color: activeUseCase.accent }}>
                {personaMetric.stat}
              </div>
              <p className="deck-desc">{personaMetric.metric}</p>

              <a
                href="https://aiads.aisa24.com"
                target="_blank"
                rel="noopener noreferrer"
                className="aiads-persona-link"
                style={{ color: activeUseCase.accent }}
              >
                <span>Launch {activeUseCase.title} Workspace</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
