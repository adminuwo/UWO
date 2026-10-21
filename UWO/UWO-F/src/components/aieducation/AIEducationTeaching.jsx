import React, { useState } from 'react';
import { School, Layers, CheckCircle2, ArrowRight, Zap, FileText } from 'lucide-react';

const TEACHING_STAGES = [
  {
    step: '01',
    title: 'Curriculum Ingestion',
    icon: FileText,
    desc: 'Authorized textbook PDFs and university syllabi are ingested and indexed into grounded vector embeddings.',
    metaLabel: 'Indexed Sources',
    metaValue: 'NCERT / CBSE / University Syllabi'
  },
  {
    step: '02',
    title: 'Adaptive Lesson Engine',
    icon: Zap,
    desc: 'Generates aligned lesson summaries, formative quizzes, and calibrated practice sets tailored to student pace.',
    metaLabel: 'Pedagogy Calibration',
    metaValue: 'Zero-Hallucination Guardrails'
  },
  {
    step: '03',
    title: 'Synchronized Classroom',
    icon: School,
    desc: 'Delivers dynamic rubrics, instant grading, and automated substitute teacher proxies with preserved syllabus continuity.',
    metaLabel: 'Faculty Continuity',
    metaValue: '< 200ms Substitute Handshake'
  }
];

export default function AIEducationTeaching() {
  const [activeStepIdx, setActiveStepIdx] = useState(1);

  return (
    <section className="aied-section-teaching" id="teaching-section">
      <div className="aied-container">
        {/* Minimal Section Header */}
        <div className="aied-section-header">
          <div className="aied-section-eyebrow">
            <School size={13} />
            <span>02 / Teaching</span>
          </div>
          <h2 className="aied-section-title">
            From Syllabus to <span className="accent">Classroom Delivery.</span>
          </h2>
          <p className="aied-section-subtitle">
            A continuous automated relationship connecting institutional learning materials directly to daily academic instruction.
          </p>
        </div>

        {/* 3-Stage Visual Pipeline */}
        <div className="aied-teaching-pipeline">
          {TEACHING_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStepIdx === idx;
            return (
              <div
                key={stage.step}
                className={`aied-pipeline-step ${isActive ? 'active' : ''}`}
                onClick={() => setActiveStepIdx(idx)}
              >
                <div className="aied-step-indicator">
                  <div className="aied-step-icon-lens">
                    <Icon size={20} />
                  </div>
                  <span className="aied-step-num">{stage.step}</span>
                </div>

                <h3 className="aied-step-title">{stage.title}</h3>
                <p className="aied-step-desc">{stage.desc}</p>

                <div className="aied-step-visual">
                  <div className="aied-step-metrics-row">
                    <span>{stage.metaLabel}</span>
                    <span className="aied-step-metrics-val">{stage.metaValue}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
