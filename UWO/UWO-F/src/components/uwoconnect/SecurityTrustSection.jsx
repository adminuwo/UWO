import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, EASE_PREMIUM } from './motionVariants';

export default function SecurityTrustSection() {
  const securityPillars = [
    {
      icon: 'fa-solid fa-lock',
      title: 'Secure Authentication & RBAC',
      desc: 'Enforce granular role-based permissions across Executives, Sales Managers, Support Agents, and Accounting Auditors with session timeouts.',
    },
    {
      icon: 'fa-solid fa-cloud-arrow-up',
      title: 'Official Meta Cloud API Verified',
      desc: 'Direct integration with official Meta WhatsApp Business Cloud infrastructure ensuring full compliance, high delivery SLAs, and green-tick readiness.',
    },
    {
      icon: 'fa-solid fa-building-shield',
      title: 'Multi-Tenant Workspace Isolation',
      desc: 'Each company, subsidiary, or agency client operates in an isolated logical workspace with dedicated database schemas and segregated access tokens.',
    },
    {
      icon: 'fa-solid fa-key',
      title: 'HMAC-Signed Webhooks & REST Security',
      desc: 'Every webhook event dispatched to external ERPs or internal databases is signed with cryptographic HMAC headers and protected by rate-limiting.',
    },
    {
      icon: 'fa-solid fa-shield-halved',
      title: 'Encrypted Document & Media Archival',
      desc: 'All customer catalogs, PDF quotations, and GST tax invoices are encrypted at rest using AES-256 and transmitted exclusively via TLS 1.3 encryption.',
    },
    {
      icon: 'fa-solid fa-clipboard-check',
      title: 'Comprehensive Audit & Activity Logging',
      desc: 'Complete immutable audit trails logging which agent accessed which conversation, generated quotations, or exported CRM customer records.',
    },
  ];

  return (
    <section className="uwoc-section uwoc-bg-contrast" id="security">
      <div className="uwoc-container">
        {/* Section Header */}
        <motion.div
          className="uwoc-section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="uwoc-eyebrow">
            <i className="fa-solid fa-shield-halved"></i>
            <span>ENTERPRISE GOVERNANCE &amp; TRUST</span>
          </div>

          <h2 className="uwoc-section-title">
            Engineered for <span className="uwoc-gradient-gold">Enterprise Security.</span>
          </h2>

          <p className="uwoc-section-subtitle">
            Reliable infrastructure, official API partnerships, and rigorous data protection protocols designed to keep your business communication confidential.
          </p>
        </motion.div>

        {/* 6 Security Pillars with Staggered Entrance */}
        <motion.div 
          className="uwoc-security-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.02 }}
          variants={staggerContainer(0.1, 0.05)}
        >
          {securityPillars.map((pillar, i) => (
            <motion.div
              key={i}
              className="uwoc-security-card"
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_PREMIUM } }}
            >
              <div className="uwoc-sec-icon">
                <i className={pillar.icon}></i>
              </div>
              <h3>{pillar.title}</h3>
              <p>{pillar.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
