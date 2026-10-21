import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Compass, CheckCircle2, Calendar, Target, Layers, ArrowRight, Zap } from 'lucide-react';
import { STRATEGY_ROADMAP_WEEKS } from '../../constants/aiAdsConstants';

export default function StrategyHub() {
  const shouldReduceMotion = useReducedMotion();
  const [activeWeekIdx, setActiveWeekIdx] = useState(0);
  const activeWeek = STRATEGY_ROADMAP_WEEKS[activeWeekIdx];

  return (
    <section className="aiads-section" id="strategy-hub" style={{ background: '#f8fafc', overflow: 'hidden' }}>
      <div className="aiads-container">
        {/* Minimal Header */}
        <div className="aiads-section-header" style={{ marginBottom: '32px' }}>
          <span className="aiads-badge aiads-badge-coral">
            <Compass size={13} />
            30-Day Autonomous Trajectory
          </span>
          <h2 className="aiads-section-title">
            Pre-Orchestrated <span className="aiads-gradient-title">GTM Flight Plan.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Autonomous 4-week multi-channel allocation, eliminating reactive marketing scrambles.
          </p>
        </div>

        {/* NON-CARD OBJECT: Horizontal Trajectory Ribbon with Docking Nodes */}
        <div className="aiads-flightplan-object">
          {/* Timeline Ribbon Rail */}
          <div className="aiads-flightplan-rail">
            <div className="aiads-rail-line">
              <div 
                className="aiads-rail-progress" 
                style={{ width: `${(activeWeekIdx / (STRATEGY_ROADMAP_WEEKS.length - 1)) * 100}%` }}
              ></div>
            </div>

            {STRATEGY_ROADMAP_WEEKS.map((week, idx) => {
              const isSelected = activeWeekIdx === idx;
              const isPast = activeWeekIdx >= idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveWeekIdx(idx)}
                  className={`aiads-flightplan-node ${isSelected ? 'active' : ''} ${isPast ? 'reached' : ''}`}
                  style={{ '--node-color': week.color }}
                >
                  <div className="aiads-node-ring">
                    <span className="aiads-node-dot"></span>
                  </div>
                  <span className="aiads-node-week">{week.week}</span>
                  <span className="aiads-node-badge">{week.badge}</span>
                </button>
              );
            })}
          </div>

          {/* Single Consolidated Mission Control Deck (NO MULTIPLE BOXED CARDS) */}
          <div className="aiads-flightplan-cockpit">
            <div className="aiads-cockpit-bar">
              <div className="aiads-cockpit-title-group">
                <span className="aiads-cockpit-label">PHASE {activeWeekIdx + 1} FOCUS</span>
                <h3 className="aiads-cockpit-title" style={{ color: activeWeek.color }}>
                  {activeWeek.theme}
                </h3>
              </div>
              <span className="aiads-cockpit-status-tag" style={{ background: `${activeWeek.color}15`, color: activeWeek.color }}>
                {activeWeek.badge}
              </span>
            </div>

            {/* Micro Deliverable Tags */}
            <div className="aiads-cockpit-deliverables">
              {activeWeek.deliverables.map((item, dIdx) => (
                <div key={dIdx} className="aiads-cockpit-chip">
                  <CheckCircle2 size={13} style={{ color: activeWeek.color, flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Omnichannel Allocation Bar */}
            <div className="aiads-cockpit-channels">
              <span className="aiads-channel-label">CROSS-CHANNEL ALLOCATION:</span>
              <div className="aiads-channel-meter">
                <div className="meter-seg seg-meta" style={{ width: '40%' }} title="Meta Ads (40%)">Meta 40%</div>
                <div className="meter-seg seg-linkedin" style={{ width: '30%' }} title="LinkedIn (30%)">LinkedIn 30%</div>
                <div className="meter-seg seg-google" style={{ width: '20%' }} title="Google SERP (20%)">Search 20%</div>
                <div className="meter-seg seg-email" style={{ width: '10%' }} title="Direct Email (10%)">Email 10%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
