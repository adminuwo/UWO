import React from 'react';
import { GLOBAL_CAPABILITIES } from '../../constants/projectsData';

export default function GlobalScaleSection() {
  return (
    <section className="uwo-global-section" id="global-scale">
      {/* Subtle world/network visual in the background */}
      <div className="global-network-bg" aria-hidden="true">
        <svg className="global-world-mesh" viewBox="0 0 1000 450" preserveAspectRatio="none">
          {/* Latitude / Longitude Curvature Lines */}
          <path d="M 0,225 Q 500,60 1000,225" fill="none" stroke="rgba(214, 165, 89, 0.12)" strokeWidth="1" />
          <path d="M 0,225 Q 500,390 1000,225" fill="none" stroke="rgba(214, 165, 89, 0.12)" strokeWidth="1" />
          <line x1="0" y1="225" x2="1000" y2="225" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" strokeDasharray="6, 6" />
          
          <path d="M 150,0 Q 250,225 150,450" fill="none" stroke="rgba(214, 165, 89, 0.08)" strokeWidth="1" />
          <path d="M 350,0 Q 420,225 350,450" fill="none" stroke="rgba(214, 165, 89, 0.08)" strokeWidth="1" />
          <path d="M 500,0 L 500,450" fill="none" stroke="rgba(214, 165, 89, 0.1)" strokeWidth="1" strokeDasharray="4, 4" />
          <path d="M 650,0 Q 580,225 650,450" fill="none" stroke="rgba(214, 165, 89, 0.08)" strokeWidth="1" />
          <path d="M 850,0 Q 750,225 850,450" fill="none" stroke="rgba(214, 165, 89, 0.08)" strokeWidth="1" />
          
          {/* Glowing Global Coordinate Nodes */}
          <circle cx="220" cy="180" r="4" fill="#D6A559" className="pulse-coordinate-node" />
          <circle cx="380" cy="150" r="3.5" fill="#38BDF8" className="pulse-coordinate-node" />
          <circle cx="500" cy="225" r="5" fill="#FABE56" className="pulse-coordinate-node center-hub" />
          <circle cx="680" cy="190" r="4" fill="#00D2FF" className="pulse-coordinate-node" />
          <circle cx="820" cy="240" r="3" fill="#D6A559" className="pulse-coordinate-node" />

          {/* Arcs between global hubs */}
          <path d="M 220,180 Q 350,110 500,225" fill="none" stroke="rgba(214, 165, 89, 0.28)" strokeWidth="1.2" strokeDasharray="3, 3" />
          <path d="M 500,225 Q 600,140 680,190" fill="none" stroke="rgba(56, 189, 248, 0.28)" strokeWidth="1.2" strokeDasharray="3, 3" />
          <path d="M 680,190 Q 750,180 820,240" fill="none" stroke="rgba(214, 165, 89, 0.28)" strokeWidth="1.2" strokeDasharray="3, 3" />
        </svg>
      </div>

      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="section-eyebrow-pill">
            <i className="fa-solid fa-earth-americas"></i>
            <span>Global Infrastructure</span>
          </div>
          <h2 className="uwo-section-heading">
            Built for <span className="uwo-gold-text">Global Scale</span>
          </h2>
          <p className="uwo-section-lead">
            Designed with security, extensibility and long-term adaptability in mind across all distributed enterprise deployments.
          </p>
        </div>

        {/* 6 Animated Capability Chips */}
        <div className="global-chips-grid">
          {GLOBAL_CAPABILITIES.map((cap, index) => (
            <div key={index} className="global-cap-chip">
              <span className="chip-sparkle">✦</span>
              <i className={cap.icon}></i>
              <span className="chip-label">{cap.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}