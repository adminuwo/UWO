import React, { useState } from 'react';
import { ALL_FEATURES } from '../../constants/aiLegalConstants';

// Filter down strictly to the 5 core features requested by the user:
// AI Legal Assistant, My Cases, AI Draft Maker, Legal Precedent, AI Mock Courtroom
const CORE_FEATURE_IDS = ['ai-assistant', 'my-cases', 'draft-maker', 'legal-precedent', 'mock-courtroom'];
const FILTERED_FEATURES = ALL_FEATURES.filter(f => CORE_FEATURE_IDS.includes(f.id));

export default function FeatureExplorer() {
  const [selectedFeature, setSelectedFeature] = useState(FILTERED_FEATURES[0]);

  // Dynamic simulation content based on previewType
  const renderSimulationPreview = () => {
    switch (selectedFeature.previewType) {
      case 'assistant':
        return (
          <div className="al-sim-content">
            <p style={{ color: 'var(--al-gold)', marginBottom: '6px', fontWeight: '700', fontSize: '0.82rem' }}>
              <i className="fa-solid fa-message" style={{ marginRight: '6px' }}></i>
              Advocate Query: "What are the essential elements for anticipatory bail under Section 438 CrPC / BNSS in an alleged commercial dispute?"
            </p>
            <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid var(--al-gold)' }}>
              <span style={{ color: '#059669', fontSize: '0.72rem', fontWeight: '700' }}>AI LEGAL REASONING SYNTHESIS</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--al-text-main)', margin: '4px 0 0', lineHeight: '1.45' }}>
                1. <strong>Pre-Arrest Apprehension:</strong> Tangible apprehension of arrest based on specific accusations.<br />
                2. <strong>Commercial Character:</strong> Establish dispute arises from civil performance rather than criminal intent.<br />
                3. <strong>Cooperation Undertaking:</strong> Affirm unconditional readiness to join procedural investigation.
              </p>
            </div>
          </div>
        );
      case 'cases':
        return (
          <div className="al-sim-content">
            <p style={{ color: 'var(--al-gold)', marginBottom: '6px', fontWeight: '700', fontSize: '0.82rem' }}>
              <i className="fa-solid fa-folder-tree" style={{ marginRight: '6px' }}></i>
              Case Docket: State v. Rajan Enterprises (Ref: #CIV-2026-098)
            </p>
            <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid #3b82f6' }}>
              <span style={{ color: '#2563eb', fontSize: '0.72rem', fontWeight: '700' }}>CENTRALIZED DOCKET STATUS</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--al-text-main)', margin: '4px 0 0', lineHeight: '1.45' }}>
                • <strong>Next Hearing:</strong> 14 Oct 2026 (Hon. Division Bench 3)<br />
                • <strong>Pleadings Filed:</strong> 4 Petitions | 2 Interim Applications | 12 Exhibits<br />
                • <strong>Compliance Alert:</strong> Rejoinder due within 7 days.
              </p>
            </div>
          </div>
        );
      case 'draft':
        return (
          <div className="al-sim-content">
            <p style={{ color: 'var(--al-gold)', marginBottom: '6px', fontWeight: '700', fontSize: '0.82rem' }}>
              <i className="fa-solid fa-pen-nib" style={{ marginRight: '6px' }}></i>
              Template Active: Commercial Agreement — Section 8.2 (Indemnity & Liability)
            </p>
            <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid #059669' }}>
              <span style={{ color: '#059669', fontSize: '0.72rem', fontWeight: '700' }}>AI CLAUSE SUGGESTION INSERTED</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--al-text-main)', margin: '4px 0 0', lineHeight: '1.45' }}>
                "Neither party shall be liable for indirect, consequential, or punitive damages. Total aggregate liability under this Instrument shall strictly be capped at fees paid in the immediately preceding 12 months."
              </p>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                <span style={{ fontSize: '0.68rem', background: '#C8A34D', color: '#FFFFFF', padding: '2px 6px', borderRadius: '3px', fontWeight: '700' }}>PDF</span>
                <span style={{ fontSize: '0.68rem', background: '#3b82f6', color: '#FFFFFF', padding: '2px 6px', borderRadius: '3px', fontWeight: '700' }}>DOCX</span>
                <span style={{ fontSize: '0.68rem', background: '#64748b', color: '#FFFFFF', padding: '2px 6px', borderRadius: '3px', fontWeight: '700' }}>TXT</span>
              </div>
            </div>
          </div>
        );
      case 'precedent':
        return (
          <div className="al-sim-content">
            <p style={{ color: 'var(--al-gold)', marginBottom: '6px', fontWeight: '700', fontSize: '0.82rem' }}>
              <i className="fa-solid fa-scale-balanced" style={{ marginRight: '6px' }}></i>
              Precedent Analysis: Gurbaksh Singh Sibbia v. State of Punjab
            </p>
            <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid #8b5cf6' }}>
              <span style={{ color: '#7c3aed', fontSize: '0.72rem', fontWeight: '700' }}>BINDING SUPREME COURT AUTHORITY (CONSTITUTION BENCH)</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--al-text-main)', margin: '4px 0 0', lineHeight: '1.45' }}>
                • <strong>Citation:</strong> (1980) 2 SCC 565<br />
                • <strong>Ratio Decidendi:</strong> Judicial discretion under anticipatory bail cannot be curtailed by reading limitations not expressed by the legislature.<br />
                • <strong>Current Status:</strong> Reaffirmed and binding across all High Courts.
              </p>
            </div>
          </div>
        );
      case 'courtroom':
        return (
          <div className="al-sim-content">
            <p style={{ color: 'var(--al-gold)', marginBottom: '6px', fontWeight: '700', fontSize: '0.82rem' }}>
              <i className="fa-solid fa-gavel" style={{ marginRight: '6px' }}></i>
              Active Simulation: Oral Submissions — Hon. Bench Interrogation
            </p>
            <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid var(--al-gold)' }}>
              <span style={{ color: 'var(--al-gold)', fontSize: '0.72rem', fontWeight: '700' }}>BENCH INTERVENTION (VOICE & TEXT)</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--al-text-main)', margin: '4px 0 0', lineHeight: '1.45' }}>
                "Counsel, how do you address the limitation bar under Article 54? The notice was served sixteen months past the prescribed termination trigger."
              </p>
              <div style={{ marginTop: '6px', fontSize: '0.72rem', color: 'var(--al-text-sub)' }}>
                Real-time Judicial Clarity Score: <strong style={{ color: '#059669' }}>84/100 (Strong Argument Foundation)</strong>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="al-sim-content">
            <p style={{ color: 'var(--al-gold)', marginBottom: '6px', fontWeight: '700', fontSize: '0.82rem' }}>
              {selectedFeature.title} Active Context
            </p>
            <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid var(--al-gold)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--al-text-main)', margin: 0 }}>
                {selectedFeature.summary}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <section className="al-features-section" id="features">
      <div className="ai-legal-container">
        {/* Section Header */}
        <div className="al-section-header">
          <div className="al-eyebrow">
            <i className="fa-solid fa-layer-group"></i>
            <span>Core Intelligence Modules</span>
          </div>

          <h2 className="al-section-title">
            Powerful Intelligence. <span className="al-gold-text">Built for Legal Work.</span>
          </h2>

          <p className="al-section-subtitle">
            Explore the core intelligence modules engineered specifically for the precision, security, and procedural standards required by legal professionals.
          </p>
        </div>

        {/* Feature Explorer Interactive Container */}
        <div className="al-feature-explorer-container">
          {/* Left Column: Vertical Nav List (Strictly 5 Features) */}
          <div className="al-feature-nav-col" role="tablist" aria-label="AI Legal Core Modules">
            {FILTERED_FEATURES.map((feature) => {
              const isSelected = selectedFeature.id === feature.id;
              return (
                <button
                  key={feature.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`al-feat-nav-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedFeature(feature)}
                >
                  <div className="al-feat-nav-icon">
                    <i className={`fa-solid ${feature.icon}`}></i>
                  </div>
                  <div className="al-feat-nav-info">
                    <span className="al-feat-nav-name">{feature.title}</span>
                    <span className="al-feat-nav-sub">{feature.tagline.split(' ')[0]} Module</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Live Dynamic Preview */}
          <div className="al-feature-preview-col" role="tabpanel">
            <div>
              <div className="al-feat-header">
                <span className="al-feat-header-badge">MODULE PREVIEW</span>
                <h3 className="al-feat-title">{selectedFeature.title}</h3>
                <p className="al-feat-desc">{selectedFeature.summary}</p>
              </div>

              {/* Highlights 2-Col Grid */}
              <div className="al-feat-highlights-grid">
                {selectedFeature.highlights.map((item, idx) => (
                  <div className="al-feat-highlight-item" key={idx}>
                    <i className="fa-solid fa-check"></i>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Operational Preview Card (No Simulator CTA Button) */}
            <div className="al-feat-live-sim">
              <div className="al-sim-header">
                <div className="al-sim-tag">
                  <i className="fa-solid fa-terminal"></i>
                  <span>Live Operational Preview</span>
                </div>
                <div className="al-sim-status">
                  Active
                </div>
              </div>

              {renderSimulationPreview()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
