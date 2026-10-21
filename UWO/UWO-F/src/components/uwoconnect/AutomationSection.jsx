import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Bot, 
  Layers, 
  FileText, 
  MessageSquare, 
  Database, 
  Users, 
  Receipt,
  ArrowRight
} from 'lucide-react';

export default function AutomationSection() {
  const tags = [
    'WORKFLOWS',
    'AI BOT',
    'CATALOG',
    'QUOTATIONS',
    'INVOICES',
    'ORDERS',
    'KNOWLEDGEBASE',
    'BROADCAST',
    'CRM',
  ];

  const floatingBadges = [
    {
      id: 'workflows',
      label: 'WORKFLOWS',
      icon: Zap,
      color: '#0B8F78',
      className: 'badge-workflows',
    },
    {
      id: 'aibot',
      label: 'AI BOT',
      icon: Bot,
      color: '#2563EB',
      className: 'badge-aibot',
    },
    {
      id: 'catalog',
      label: 'CATALOG',
      icon: Layers,
      color: '#D97706',
      className: 'badge-catalog',
    },
    {
      id: 'quotations',
      label: 'GST QUOTATIONS',
      icon: FileText,
      color: '#DB2777',
      className: 'badge-quotations',
    },
    {
      id: 'broadcast',
      label: 'BROADCAST',
      icon: MessageSquare,
      color: '#6366F1',
      className: 'badge-broadcast',
    },
    {
      id: 'crm',
      label: 'CRM PIPELINE',
      icon: Users,
      color: '#059669',
      className: 'badge-crm',
    },
    {
      id: 'knowledge',
      label: 'KNOWLEDGEBASE',
      icon: Database,
      color: '#7C3AED',
      className: 'badge-knowledge',
    },
    {
      id: 'payments',
      label: 'UPI PAYMENTS & TAX INVOICES',
      icon: Receipt,
      color: '#E11D48',
      className: 'badge-payments',
    },
  ];

  return (
    <section className="uwoc-section uwoc-automation-section" id="automation">
      <div className="uwoc-container">
        <div className="uwoc-automation-grid">
          {/* Left Column: Copy, Tag Cloud & CTA */}
          <motion.div 
            className="uwoc-automation-text-col"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <div className="uwoc-eyebrow">
              <span className="uwoc-pill-dot" />
              <span>Abha • Business Automation</span>
            </div>

            <h2 className="uwoc-automation-title">
              Let Work Flow. <br />
              <span className="uwoc-highlight">Completely Automatically.</span>
            </h2>

            <p className="uwoc-automation-desc">
              Abha powers your entire front office—from AI bot auto-replies to CRM deal creation, interactive product catalog, GST quotation dispatches, UPI payments, and official GST invoices.
            </p>

            {/* Capability Pills */}
            <div className="uwoc-automation-tags-wrap">
              {tags.map((tag) => (
                <span key={tag} className="uwoc-automation-tag-pill">
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href="https://uwoconnect.aisa24.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="uwoc-automation-cta-btn"
            >
              <span>Build Your Workflows</span>
              <ArrowRight size={17} strokeWidth={2.4} />
            </a>
          </motion.div>

          {/* Right Column: Abha with Floating Capability Badges */}
          <motion.div 
            className="uwoc-automation-visual-col"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            {/* Ambient Background Aura */}
            <div className="uwoc-abha-glow-aura" aria-hidden="true" />

            <div className="uwoc-abha-scene">
              {/* Abha Character */}
              <img
                src="/images/uwoconnect/Abha_transparent.png"
                alt="Abha - UWO Connect AI Business Automation Specialist"
                className="uwoc-abha-img"
                loading="lazy"
              />

              {/* Floating Capability Pills */}
              {floatingBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.id}
                    className={`uwoc-floating-badge ${badge.className}`}
                  >
                    <Icon size={15} strokeWidth={2.2} style={{ color: badge.color }} />
                    <span style={{ color: badge.color }}>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
