import React from 'react';
import { ArrowRight, ExternalLink, ShieldCheck, Lock, Smartphone, CheckCircle2 } from 'lucide-react';

export default function AIEducationCTA() {
  return (
    <section className="aied-section-cta">
      <div className="aied-container">
        <div className="aied-cta-card">
          <div className="aied-section-eyebrow" style={{ marginBottom: '1.25rem' }}>
            <ShieldCheck size={13} />
            <span>Institutional Deployment</span>
          </div>

          <h2 className="aied-cta-title">
            Transform Your <br />
            <span style={{ color: '#4F46E5' }}>Campus Today.</span>
          </h2>

          <p className="aied-cta-desc">
            Schedule a personalized demonstration or explore the live education platform.
          </p>

          <div className="aied-cta-actions">
            <a
              href="/contact"
              className="aied-btn-primary"
              title="Book an Institutional Demo"
            >
              <span>Book an Institutional Demo</span>
              <ArrowRight size={16} />
            </a>

            <a
              href="https://education.uwo24.com"
              target="_blank"
              rel="noopener noreferrer"
              className="aied-btn-secondary"
              title="Explore Live Web Application"
            >
              <span>Explore Live Platform</span>
              <ExternalLink size={15} />
            </a>
          </div>

          {/* Institutional Trust Badges */}
          <div className="aied-trust-badges-grid">
            <div className="aied-badge-item">
              <ShieldCheck size={16} />
              <span>CASA Tier-2 Certified</span>
            </div>
            <div className="aied-badge-item">
              <Lock size={16} />
              <span>Zero Student PII Retention</span>
            </div>
            <div className="aied-badge-item">
              <Smartphone size={16} />
              <span>Web, iOS & Android</span>
            </div>
            <div className="aied-badge-item">
              <CheckCircle2 size={16} />
              <span>99.98% High-Availability SLA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
