import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Dna, Search, Compass, FileText, Palette, Layers, Globe, Send,
  Zap, Play, Pause, RotateCcw, CheckCircle2 
} from 'lucide-react';
import { MARKETING_PIPELINE_STEPS } from '../../constants/aiAdsConstants';
import { fadeInUp, staggerContainer } from '../aieducation/motionVariants';

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

  // Automated sequencer cycling through the 8 stages
  useEffect(() => {
    if (shouldReduceMotion || !isPlaying) return;

    const timer = setInterval(() => {
      setActiveStepIdx((prev) => (prev < MARKETING_PIPELINE_STEPS.length - 1 ? prev + 1 : 0));
    }, 2200);

    return () => clearInterval(timer);
  }, [shouldReduceMotion, isPlaying]);

  return (
    <section className="aiads-section" id="marketing-pipeline">
      <div className="aiads-container">
        <div className="aiads-section-header">
          <span className="aiads-badge aiads-badge-blue">
            <Zap size={14} />
            Autonomous Execution Architecture
          </span>
          <h2 className="aiads-section-title">
            The End-to-End <br />
            <span className="aiads-gradient-title">Marketing Pipeline.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Experience the complete journey from raw brand intelligence to multi-format creative production 
            and global campaign launch in one continuous, autonomous flow.
          </p>
        </div>

        {/* Live Controller Strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: MARKETING_PIPELINE_STEPS[activeStepIdx].color, boxShadow: `0 0 8px ${MARKETING_PIPELINE_STEPS[activeStepIdx].color}` }}></span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--aiads-text-main)', fontFamily: 'var(--aiads-font-mono)' }}>
              STAGE {MARKETING_PIPELINE_STEPS[activeStepIdx].step}: {MARKETING_PIPELINE_STEPS[activeStepIdx].name.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1px solid var(--aiads-border)', borderRadius: '9999px', padding: '4px 12px', boxShadow: 'var(--aiads-shadow-sm)' }}>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              style={{ background: 'none', border: 'none', color: 'var(--aiads-text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px 4px' }}
              title={isPlaying ? 'Pause pipeline' : 'Play pipeline'}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            </button>
            <span style={{ color: 'var(--aiads-border)' }}>|</span>
            <button
              type="button"
              onClick={() => setActiveStepIdx(0)}
              style={{ background: 'none', border: 'none', color: 'var(--aiads-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px 4px' }}
              title="Reset pipeline"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* 8-Stage Pipeline Grid */}
        <div className="aiads-pipeline-grid">
          {MARKETING_PIPELINE_STEPS.map((step, idx) => {
            const IconComp = PIPELINE_ICONS[step.icon] || Zap;
            const isPast = idx < activeStepIdx;
            const isCurrent = idx === activeStepIdx;

            return (
              <motion.div
                key={step.id}
                className="aiads-pipeline-step-card"
                onClick={() => setActiveStepIdx(idx)}
                whileHover={{ y: -3 }}
                style={{
                  cursor: 'pointer',
                  borderColor: isCurrent 
                    ? step.color 
                    : isPast 
                      ? 'rgba(124, 58, 237, 0.25)' 
                      : 'var(--aiads-border)',
                  boxShadow: isCurrent 
                    ? `0 8px 24px ${step.color}25` 
                    : 'var(--aiads-shadow-sm)',
                  background: isCurrent 
                    ? `linear-gradient(180deg, ${step.color}08 0%, #ffffff 100%)` 
                    : '#ffffff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '10px', 
                    background: `${step.color}15`, 
                    color: step.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComp size={16} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isPast && <CheckCircle2 size={13} style={{ color: '#10b981' }} />}
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--aiads-font-mono)', fontWeight: 800, color: isCurrent ? step.color : 'var(--aiads-text-subtle)' }}>
                      STEP {step.step}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--aiads-text-main)', marginBottom: '4px' }}>
                  {step.name}
                </div>

                <p style={{ fontSize: '0.76rem', color: 'var(--aiads-text-muted)', lineHeight: 1.45, margin: 0 }}>
                  {step.desc}
                </p>

                {/* Animated status bar under active card */}
                {isCurrent && !shouldReduceMotion && (
                  <motion.div
                    layoutId="pipelineActiveGlow"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: step.color,
                      borderRadius: '0 0 14px 14px'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
