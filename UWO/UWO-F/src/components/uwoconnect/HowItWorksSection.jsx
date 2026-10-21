import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const steps = [
    {
      num: '01',
      title: 'Inbound Conversation',
      subtitle: 'Customer Reaches Out',
      desc: 'Inbound leads connect via WhatsApp, Instagram, Facebook, or Email.',
      icon: 'fa-solid fa-comments',
      channel: 'MESSAGES INBOX',
      channelColor: '#25D366',
      channelIcon: 'fa-brands fa-whatsapp',
      badge: 'Step 1: Multi-Channel',
      screenshot: '/images/uwoconnect/workflow_step1_messages.png',
      screenshotAlt: 'UWO Connect - Live Omnichannel Messages Inbox',
      caption: 'Unified inbox for WhatsApp, Instagram, and Facebook.',
    },
    {
      num: '02',
      title: 'AI Intent & Knowledge',
      subtitle: 'Autonomous Qualification',
      desc: 'AI answers customer queries instantly using your catalogs and docs.',
      icon: 'fa-solid fa-brain',
      channel: 'KNOWLEDGE BASE',
      channelColor: '#0B8F78',
      channelIcon: 'fa-solid fa-wand-magic-sparkles',
      badge: 'Step 2: AI Training',
      screenshot: '/images/uwoconnect/workflow_step2_knowledge.png',
      screenshotAlt: 'UWO Connect - Knowledge Base and Vector AI Training',
      caption: 'Trained on your business docs for accurate 24/7 replies.',
    },
    {
      num: '03',
      title: 'CRM Leads Pipeline',
      subtitle: 'Zero Manual Entry',
      desc: 'Auto-sorts prospects into Kanban stages with zero manual data entry.',
      icon: 'fa-solid fa-diagram-project',
      channel: 'LEADS (CRM)',
      channelColor: '#4285F4',
      channelIcon: 'fa-solid fa-users',
      badge: 'Step 3: Kanban Pipeline',
      screenshot: '/images/uwoconnect/workflow_step3_leads_crm.png',
      screenshotAlt: 'UWO Connect - Omni-Channel Leads CRM Pipeline',
      caption: 'Auto-captures contact details and updates deal stages.',
    },
    {
      num: '04',
      title: 'Quotations & Invoicing',
      subtitle: 'Instant Invoicing & Deals',
      desc: 'Instantly create GST quotations and send direct payment links.',
      icon: 'fa-solid fa-receipt',
      channel: 'QUOTATIONS',
      channelColor: '#10B981',
      channelIcon: 'fa-solid fa-file-invoice-dollar',
      badge: 'Step 4: Deals & Invoices',
      screenshot: '/images/uwoconnect/workflow_step4_quotations.png',
      screenshotAlt: 'UWO Connect - Quotations Management and Estimates',
      caption: 'Generate branded GST quotations and collect payments.',
    },
  ];

  // Auto-cycle active step every 5 seconds unless hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, steps.length]);

  const current = steps[activeStep];

  return (
    <section className="uwoc-section uwoc-workflow-section" id="workflow">
      <div className="uwoc-container">
        {/* Section Header */}
        <motion.div
          className="uwoc-section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className="uwoc-eyebrow">
            <span className="uwoc-pill-dot" />
            <span>How It Works</span>
          </div>

          <h2 className="uwoc-section-title">
            From First Message. <br />
            <span className="uwoc-highlight">To Closed Deal.</span>
          </h2>

          <p className="uwoc-section-subtitle">
            Four simple automated steps from initial inquiry to closed deal.
          </p>
        </motion.div>

        {/* Interactive 2-Column Workflow Showcase */}
        <div 
          className="uwoc-workflow-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Column: Interactive Stepper Navigation */}
          <div className="uwoc-workflow-steps">
            {steps.map((s, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={s.num}
                  className={`uwoc-workflow-step-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveStep(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') setActiveStep(idx); }}
                >
                  <div className="uwoc-step-rail">
                    <div className="uwoc-step-num-pill">
                      {s.num}
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="uwoc-step-connecting-line">
                        <motion.div 
                          className="uwoc-step-line-fill"
                          animate={{ height: isActive ? '100%' : '0%' }}
                          transition={{ duration: 5, ease: 'linear' }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="uwoc-step-nav-content">
                    <div className="uwoc-step-nav-header">
                      <h4>{s.title}</h4>
                      {isActive && (
                        <span className="uwoc-step-active-tag">Active View</span>
                      )}
                    </div>
                    <p>{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Real Production Screenshot Mockup */}
          <div className="uwoc-workflow-preview-panel">
            <div className="uwoc-preview-glow" aria-hidden="true" />

            <AnimatePresence mode="wait">
              <motion.div
                key={current.num}
                className="uwoc-workflow-screenshot-frame"
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Sleek App Top Bar */}
                <div className="uwoc-workflow-ss-topbar">
                  <div className="uwoc-window-dots">
                    <span className="uwoc-dot dot-red" />
                    <span className="uwoc-dot dot-yellow" />
                    <span className="uwoc-dot dot-green" />
                  </div>

                  <div className="uwoc-window-title">
                    <i className={current.channelIcon} style={{ color: current.channelColor }}></i>
                    <span>{current.channel} • Live Platform Workspace</span>
                  </div>

                  <span className="uwoc-window-badge">{current.badge}</span>
                </div>

                {/* Actual Real Screenshot */}
                <div className="uwoc-workflow-ss-viewport">
                  <img
                    src={current.screenshot}
                    alt={current.screenshotAlt}
                    className="uwoc-workflow-ss-img"
                    loading="lazy"
                  />
                </div>

                {/* Caption / Context Footer */}
                <div className="uwoc-workflow-ss-footer">
                  <div className="uwoc-ss-caption-left">
                    <span className="uwoc-pulse-indicator" />
                    <span>{current.caption}</span>
                  </div>

                  <span className="uwoc-auto-progress-hint">Auto-cycling</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
