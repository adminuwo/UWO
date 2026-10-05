import React from 'react';
import { ROADMAP_ITEMS } from '../../constants/aiLegalConstants';

export default function RoadmapSection() {
  return (
    <section className="al-roadmap-section" id="roadmap">
      <div className="ai-legal-container">
        {/* Section Header */}
        <div className="al-section-header">
          <div className="al-eyebrow">
            <i className="fa-solid fa-compass-drafting"></i>
            <span>Product Evolution</span>
          </div>

          <h2 className="al-section-title">
            The Future of <span className="al-gold-text">Legal Intelligence</span>
          </h2>

          <p className="al-section-subtitle">
            A transparent view of our core production platform, near-term deployment roadmap, and long-range architectural vision.
          </p>
        </div>

        {/* 3 Tier Grid */}
        <div className="al-roadmap-grid">
          {ROADMAP_ITEMS.map((tier, idx) => (
            <div className={`al-roadmap-card ${tier.statusClass}`} key={idx}>
              <div className="al-roadmap-top">
                <span className="al-roadmap-badge">{tier.badge}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--al-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {idx === 0 ? 'Tier 1' : (idx === 1 ? 'Tier 2' : 'Tier 3')}
                </span>
              </div>

              <h3 className="al-roadmap-tier">{tier.tier}</h3>

              <ul className="al-roadmap-items">
                {tier.items.map((it, itemIdx) => (
                  <li key={itemIdx}>
                    <i className="fa-solid fa-check"></i>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
