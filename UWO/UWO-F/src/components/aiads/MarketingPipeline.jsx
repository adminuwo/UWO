import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Dna, Search, Compass, FileText, Palette, Layers, Globe, Send,
  Zap, Play, Pause, RotateCcw, CheckCircle2 
} from 'lucide-react';
import { MARKETING_PIPELINE_STEPS } from '../../constants/aiAdsConstants';

const PIPELINE_ICONS = {
  Dna,
  Search,
  Compass,
  FileText,
  Palette,
  Layers,
  Globe,
  Send
};

export default function MarketingPipeline() {
  const shouldReduceMotion = useReducedMotion();
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (shouldReduceMotion || !isPlaying) return;

    const timer = setInterval(() => {
      setActiveStepIdx((prev) => (prev < MARKETING_PIPELINE_STEPS.length - 1 ? prev + 1 : 0));
    }, 2400);

    return () => clearInterval(timer);
  }, [shouldReduceMotion, isPlaying]);

  const activeStep = MARKETING_PIPELINE_STEPS[activeStepIdx] || MARKETING_PIPELINE_STEPS[0];
  const StepIcon = PIPELINE_ICONS[activeStep.icon] || Zap;

  return (
    <section className="aiads-section" id="marketing-pipeline">
      <div className="aiads-container">
        <div className="aiads-section-header">
          <span className="aiads-badge aiads-badge-blue">
            <Zap size={14} />
            Autonomous Pipeline
          </span>
          <h2 className="aiads-section-title">
            The End-to-End <span className="aiads-gradient-title">Marketing Conveyor.</span>
          </h2>
          <p className="aiads-section-subtitle">
            From raw brand intelligence to multi-format creative production and automated launch.
          </p>
        </div>

        {/* 8-Stage Conveyor Ribbon (Visual Object - ZERO CARDS) */}
        <div className="aiads-pipeline-conveyor-stage">
          {/* Top Control Bar */}
          <div className="aiads-pipeline-ctrl-head">
            <div className="aiads-pipeline-stage-tag">
              <span className="aiads-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: activeStep.color, display: 'inline-block', boxShadow: `0 0 6px ${activeStep.color}` }}></span>
              <span className="aiads-pipeline-stage-num">STAGE 0{activeStep.step}:</span>
              <span className="aiads-pipeline-stage-title" style={{ color: activeStep.color }}>{activeStep.name.toUpperCase()}</span>
            </div>

            <div className="aiads-pipeline-ctrl-actions">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="aiads-pipeline-icon-btn"
                title={isPlaying ? 'Pause pipeline' : 'Play pipeline'}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                <span>{isPlaying ? 'Pause' : 'Resume'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStepIdx(0)}
                className="aiads-pipeline-icon-btn"
                title="Restart"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>

          {/* Connected Laser Track & Milestone Discs */}
          <div className="aiads-conveyor-track-wrap">
            <div className="aiads-conveyor-track-line"></div>
            <motion.div
              className="aiads-conveyor-track-progress"
              animate={{
                width: `${(activeStepIdx / (MARKETING_PIPELINE_STEPS.length - 1)) * 100}%`
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />

            <div className="aiads-conveyor-milestones">
              {MARKETING_PIPELINE_STEPS.map((step, idx) => {
                const Icon = PIPELINE_ICONS[step.icon] || Zap;
                const isPast = idx < activeStepIdx;
                const isCurrent = idx === activeStepIdx;

                return (
                  <button
                    key={step.id}
                    type="button"
                    className={`aiads-conveyor-node ${isCurrent ? 'current' : isPast ? 'passed' : ''}`}
                    onClick={() => setActiveStepIdx(idx)}
                  >
                    <div 
                      className="aiads-conveyor-disc"
                      style={{
                        borderColor: isCurrent ? step.color : undefined,
                        color: isCurrent ? '#ffffff' : undefined,
                        background: isCurrent ? step.color : undefined
                      }}
                    >
                      {isPast ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Icon size={13} />}
                    </div>
                    <span className="aiads-conveyor-name">{step.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unified Execution Terminal (HUD Readout) */}
          <div className="aiads-pipeline-hud">
            <div className="aiads-hud-stage-info">
              <div className="aiads-hud-icon-box" style={{ background: `${activeStep.color}15`, color: activeStep.color }}>
                <StepIcon size={18} />
              </div>
              <div>
                <div className="aiads-hud-headline">{activeStep.headline}</div>
                <div className="aiads-hud-sub">{activeStep.detail}</div>
              </div>
            </div>
            <div className="aiads-hud-telemetry">
              <span className="aiads-hud-badge">Engine: Autonomous</span>
              <span className="aiads-hud-badge" style={{ color: activeStep.color }}>Sync: Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
