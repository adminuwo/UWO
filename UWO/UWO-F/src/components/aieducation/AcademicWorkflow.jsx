import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { GitBranch, CheckCircle2, ArrowRight, Zap, Play, Pause, RotateCcw } from 'lucide-react';
import { ACADEMIC_WORKFLOWS } from '../../constants/aiEducationConstants';

export default function AcademicWorkflow() {
  const shouldReduceMotion = useReducedMotion();
  const [activeWorkflowId, setActiveWorkflowId] = useState('admissions');
  const activeWorkflow = ACADEMIC_WORKFLOWS.find(w => w.id === activeWorkflowId) || ACADEMIC_WORKFLOWS[0];

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    setActiveStepIndex(0);
  }, [activeWorkflowId]);

  useEffect(() => {
    if (shouldReduceMotion || !isPlaying) return;

    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < activeWorkflow.steps.length - 1) {
          return prev + 1;
        } else {
          return 0;
        }
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [shouldReduceMotion, isPlaying, activeWorkflow.steps.length]);

  const currentStep = activeWorkflow.steps[activeStepIndex] || activeWorkflow.steps[0];

  return (
    <section className="aied-section" id="academic-workflows">
      <div className="aied-container">
        <div className="aied-section-header">
          <span className="aied-badge">
            <GitBranch size={14} />
            Execution Conveyor
          </span>
          <h2 className="aied-section-title">
            Autonomous Campus <span className="aied-gradient-emerald">Pipelines.</span>
          </h2>
          <p className="aied-section-subtitle">
            Automating admissions, substitution proxying, and textbook grounded intelligence without manual paperwork.
          </p>
        </div>

        {/* Workflow Switcher Tabs */}
        <div className="aied-workflow-tabs">
          {ACADEMIC_WORKFLOWS.map((wf) => {
            const isActive = activeWorkflowId === wf.id;
            return (
              <button
                key={wf.id}
                type="button"
                className={`aied-workflow-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveWorkflowId(wf.id)}
              >
                <span>{wf.name}</span>
                {isActive && <span className="aied-wf-tab-glow"></span>}
              </button>
            );
          })}
        </div>

        {/* Continuous Pipeline Ribbon (Visual Object - NOT Cards) */}
        <div className="aied-pipeline-ribbon-stage">
          {/* Header Controls Bar */}
          <div className="aied-pipeline-ctrl-bar">
            <div className="aied-pipeline-telemetry">
              <span className="aied-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#00b87a', display: 'inline-block', boxShadow: '0 0 6px #00b87a' }}></span>
              <span className="aied-pipeline-wf-name">{activeWorkflow.name.toUpperCase()}</span>
              <span className="aied-pipeline-step-count">
                // STAGE {activeStepIndex + 1} OF {activeWorkflow.steps.length}
              </span>
            </div>

            <div className="aied-pipeline-controls">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="aied-pipeline-btn"
                title={isPlaying ? 'Pause pipeline' : 'Resume pipeline'}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                <span>{isPlaying ? 'Pause' : 'Resume'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStepIndex(0)}
                className="aied-pipeline-btn"
                title="Restart pipeline"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>

          {/* Connected Step Markers Ribbon */}
          <div className="aied-pipeline-conveyor">
            {/* Animated Laser Bus Line */}
            <div className="aied-conveyor-track-bg"></div>
            <motion.div
              className="aied-conveyor-track-progress"
              animate={{
                width: `${((activeStepIndex) / (activeWorkflow.steps.length - 1)) * 100}%`
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />

            {/* Step Nodes Row */}
            <div className="aied-conveyor-nodes">
              {activeWorkflow.steps.map((step, idx) => {
                const isPast = idx < activeStepIndex;
                const isCurrent = idx === activeStepIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`aied-conveyor-node ${isCurrent ? 'current' : isPast ? 'completed' : ''}`}
                    onClick={() => setActiveStepIndex(idx)}
                  >
                    <div className="aied-conveyor-node-disc">
                      {isPast ? (
                        <CheckCircle2 size={13} className="text-emerald-400" />
                      ) : (
                        <span>0{idx + 1}</span>
                      )}
                    </div>
                    <div className="aied-conveyor-node-label">
                      {step.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unified Dynamic Execution Terminal */}
          <div className="aied-pipeline-terminal">
            <div className="aied-pipeline-terminal-head">
              <div className="aied-terminal-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="aied-terminal-title">LIVE EVENT DISPATCH CONSOLE</span>
              <span className="aied-terminal-badge">Real-Time Ingress</span>
            </div>

            <div className="aied-pipeline-terminal-body">
              <div className="aied-terminal-row">
                <span className="aied-term-ts">[SYSTEM]:</span>
                <span className="aied-term-active-label">{currentStep.label}</span>
              </div>
              <div className="aied-terminal-detail-box">
                <Zap size={13} className="text-emerald-400 flex-shrink-0" />
                <span className="aied-term-detail-text">{currentStep.detail}</span>
              </div>
              <div className="aied-terminal-meta-row">
                <span className="aied-term-tag">Status: Verified</span>
                <span className="aied-term-tag">Latency: &lt;180ms</span>
                <span className="aied-term-tag">Audit: Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
