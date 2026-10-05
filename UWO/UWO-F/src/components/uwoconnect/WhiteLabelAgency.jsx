import React from 'react';
import { motion } from 'framer-motion';
import { UWO_CONNECT_DEMO_URL } from '../../constants/uwoConnectConstants';
import { fadeUp, btnMotion } from './motionVariants';

export default function WhiteLabelAgency() {
  const steps = [
    { num: '01', title: 'Your Custom Brand', sub: 'Your Logo, Colors & Styling' },
    { num: '02', title: 'Your Custom Domain', sub: 'portal.youragency.com' },
    { num: '03', title: 'Client Workspaces', sub: 'Multi-Tenant Partitioning' },
    { num: '04', title: 'Your Agency', sub: 'Centralized Master Console' },
    { num: '05', title: 'Your End Clients', sub: 'Seamless Daily Operations' },
  ];

  return (
    <section className="uwoc-section uwoc-white-label-section" id="white-label">
      <div className="uwoc-container">
        <motion.div
          className="uwoc-wl-box"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="uwoc-eyebrow dark">
            <i className="fa-solid fa-building-user"></i>
            <span>AGENCY &amp; ENTERPRISE WHITE-LABEL</span>
          </div>

          <h2 className="uwoc-wl-title">
            Turn UWO Connect Into <br />
            <span className="uwoc-gradient-gold">Your Own Branded Platform.</span>
          </h2>

          <p className="uwoc-wl-desc">
            Empower your marketing agency, consultancy, or IT firm to provision fully white-labeled multi-channel automation portals for your clients. Keep 100% of your recurring software margins.
          </p>

          {/* Step Flow */}
          <div className="uwoc-wl-steps-row">
            {steps.map((st, i) => (
              <React.Fragment key={i}>
                <div className="uwoc-wl-step">
                  <div className="step-num">{st.num}</div>
                  <strong>{st.title}</strong>
                  <span>{st.sub}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="uwoc-wl-sep">
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Feature Highlights Grid */}
          <div className="uwoc-wl-grid">
            <div className="uwoc-wl-card">
              <i className="fa-solid fa-globe"></i>
              <h4>Custom CNAME Domain</h4>
              <p>Host the entire platform under your agency’s custom domain with automatic SSL certificate provisioning.</p>
            </div>
            <div className="uwoc-wl-card">
              <i className="fa-solid fa-palette"></i>
              <h4>100% White-Label Branding</h4>
              <p>Replace all platform branding with your logo, favicon, color themes, and custom company email notifications.</p>
            </div>
            <div className="uwoc-wl-card">
              <i className="fa-solid fa-layer-group"></i>
              <h4>Multi-Tenant Client Portals</h4>
              <p>Spin up dedicated, isolated client workspaces in 1 click with customized permissions and user allocations.</p>
            </div>
            <div className="uwoc-wl-card">
              <i className="fa-solid fa-coins"></i>
              <h4>Recurring Margin Retainment</h4>
              <p>Bundle UWO Connect with your retainer packages or resell licenses directly to generate monthly recurring revenue.</p>
            </div>
          </div>

          {/* Action CTA */}
          <div className="uwoc-wl-cta-wrap">
            <motion.a
              href={UWO_CONNECT_DEMO_URL}
              className="uwoc-btn uwoc-btn-gold"
              whileHover={btnMotion.hover}
              whileTap={btnMotion.tap}
            >
              <i className="fa-solid fa-handshake"></i>
              <span>Explore Agency &amp; White-Label Solutions</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
