import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { GitBranch, CheckCircle2, ArrowRight, Zap, Play, Pause, RotateCcw } from 'lucide-react';
import { ACADEMIC_WORKFLOWS } from '../../constants/aiEducationConstants';
import { fadeInUp, staggerContainer } from './motionVariants';

export default function AcademicWorkflow() {
  const shouldReduceMotion = useReducedMotion();
  const [activeWorkflowId, setActiveWorkflowId] = useState('admissions');
  const activeWorkflow = ACADEMIC_WORKFLOWS.find(w => w.id === activeWorkflowId) || ACADEMIC_WORKFLOWS[0];

  // Pipeline execution sequence state
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Reset step index when changing workflow
  useEffect(() => {
    setActiveStepIndex(0);
  }, [activeWorkflowId]);

  // Automated pipeline sequencer
  useEffect(() => {
    if (shouldReduceMotion || !isPlaying) return;

    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < activeWorkflow.steps.length - 1) {
          return prev + 1;
        } else {
          // Pause at the end for 2.5s before restarting
          return 0;
        }
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [shouldReduceMotion, isPlaying, activeWorkflow.steps.length]);

  return (
    <section className="aied-section" id="academic-workflows">
      <div className="aied-container">
        <div className="aied-section-header">
          <span className="aied-badge">
            <GitBranch size={14} />
            Autonomous Campus Pipelines
          </span>
          <h2 className="aied-section-title">
            Engineered Real-World <br />
            <span className="aied-gradient-emerald">Academic Workflows.</span>
          </h2>
          <p className="aied-section-subtitle">
            See how AI Education automates daily operational lifecycles — from entrance admissions 
            and proxy teacher substitutions to curriculum-grounded textbook intelligence.
          </p>
        </div>

        {/* Workflow Switcher Tabs with layoutId active highlight */}
        <div className="aied-workflow-tabs" style={{ position: 'relative' }}>
          {ACADEMIC_WORKFLOWS.map((wf) => {
            const isActive = activeWorkflowId === wf.id;
            return (
              <button
                key={wf.id}
                type="button"
                className={`aied-workflow-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveWorkflowId(wf.id)}
                style={{ position: 'relative' }}
              >
                {isActive && !shouldReduceMotion && (
                  <motion.div
                    layoutId="activeWfGlow"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '8px',
                      background: 'rgba(0, 184, 122, 0.15)',
                      border: '1px solid var(--aied-emerald)',
                      zIndex: -1
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span>{wf.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Workflow Progression Track */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWorkflow.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header info & Pipeline Telemetry Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <p style={{ color: 'var(--aied-text-muted)', fontSize: '0.84rem', maxWidth: '620px', margin: 0, lineHeight: 1.5 }}>
                {activeWorkflow.description}
              </p>

              {/* Pipeline Playback Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--aied-bg-card)', border: '1px solid var(--aied-border)', padding: '4px 10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--aied-font-mono)', color: 'var(--aied-emerald)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Zap size={11} />
                  Pipeline: Step 0{activeStepIndex + 1}/{activeWorkflow.steps.length}
                </span>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center' }}
                  title={isPlaying ? 'Pause pipeline' : 'Resume pipeline'}
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStepIndex(0)}
                  style={{ background: 'none', border: 'none', color: 'var(--aied-text-muted)', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center' }}
                  title="Reset pipeline"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </div>

            {/* Connecting Progress Line (Desktop) */}
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <div 
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '4%',
                  right: '4%',
                  height: '2px',
                  background: 'var(--aied-border)',
                  zIndex: 0
                }}
              />
              <motion.div 
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '4%',
                  height: '2px',
                  background: 'linear-gradient(90deg, #00b87a, #16b8e8)',
                  boxShadow: '0 0 8px rgba(0, 184, 122, 0.6)',
                  zIndex: 1
                }}
                animate={{
                  width: `${(activeStepIndex / (activeWorkflow.steps.length - 1)) * 92}%`
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>

            {/* Step Cards Grid */}
            <div className="aied-workflow-track" style={{ position: 'relative', zIndex: 2 }}>
              {activeWorkflow.steps.map((step, idx) => {
                const isPast = idx < activeStepIndex;
                const isCurrent = idx === activeStepIndex;
                return (
                  <motion.div 
                    key={idx}
                    className="aied-workflow-step"
                    whileHover={{ y: -3 }}
                    onClick={() => setActiveStepIndex(idx)}
                    style={{
                      cursor: 'pointer',
                      borderColor: isCurrent 
                        ? 'var(--aied-emerald)' 
                        : isPast 
                          ? 'rgba(0, 184, 122, 0.4)' 
                          : 'var(--aied-border)',
                      boxShadow: isCurrent 
                        ? '0 0 16px rgba(0, 184, 122, 0.25)' 
                        : 'none',
                      background: isCurrent 
                        ? 'linear-gradient(180deg, rgba(0, 184, 122, 0.08) 0%, var(--aied-bg-card) 100%)' 
                        : 'var(--aied-bg-card)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div className="aied-workflow-step-num" style={{ color: isCurrent ? 'var(--aied-emerald)' : isPast ? 'var(--aied-cyan)' : 'var(--aied-text-subtle)' }}>
                        STEP 0{idx + 1}
                      </div>
                      {isPast ? (
                        <CheckCircle2 size={13} style={{ color: 'var(--aied-emerald)' }} />
                      ) : isCurrent ? (
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00b87a', boxShadow: '0 0 8px #00b87a', display: 'inline-block' }}></span>
                      ) : (
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                      )}
                    </div>
                    <div className="aied-workflow-step-title" style={{ color: isCurrent ? '#ffffff' : 'var(--aied-text-main)' }}>
                      {step.label}
                    </div>
                    <div className="aied-workflow-step-desc">
                      {step.detail}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
