import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp } from './motionVariants';

export default function InteractiveDemoWalkthrough() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const demoSteps = [
    {
      title: 'Step 1: Multi-Channel Customer Inbound',
      tag: 'WhatsApp Business API',
      icon: 'fa-brands fa-whatsapp',
      color: '#25D366',
      headline: 'Aarav reaches out requesting enterprise pricing for 50 licenses.',
      detail: 'The inquiry hits UWO Connect via Meta Cloud API socket within 20 milliseconds. The shared team inbox alerts online agents while the AI Copilot prepares a contextual response.',
      visualBadge: 'Inbound Socket: Active',
      visualText: 'Customer: "Can you send me the pricing for our retail chain?"',
    },
    {
      title: 'Step 2: AI Copilot Contextual Auto-Reply',
      tag: 'RAG Knowledge Training',
      icon: 'fa-solid fa-wand-magic-sparkles',
      color: '#D4AF37',
      headline: 'AI parses intent and references uploaded company PDFs in <0.8s.',
      detail: 'Using proprietary document embeddings, the AI generates a factual, branded response and delivers the 2026 Enterprise Suite catalog directly inside WhatsApp.',
      visualBadge: 'AI Response: 0.8s Latency',
      visualText: 'AI Copilot: "Hello Aarav! Here is our 2026 Enterprise Suite catalog along with multi-store implementation milestones."',
    },
    {
      title: 'Step 3: CRM Pipeline Auto-Creation & Scoring',
      tag: 'Industrial CRM',
      icon: 'fa-solid fa-chart-pie',
      color: '#0284C7',
      headline: 'Lead profile created with ₹1,80,000 value and 96/100 score.',
      detail: 'Without any human manual data entry, the contact is registered in the CRM pipeline, moved to "Qualified Lead", and assigned to account executive Neha Sharma.',
      visualBadge: 'CRM Status: Lead #4912 Created',
      visualText: 'Pipeline Stage: Qualified Opportunity • Assigned: Neha Sharma',
    },
    {
      title: 'Step 4: Dynamic Quotation & Instant UPI Link',
      tag: 'Commercial Sales',
      icon: 'fa-solid fa-file-invoice-dollar',
      color: '#059669',
      headline: 'Branded PDF proposal generated with 1-click Razorpay payment.',
      detail: 'UWO Connect dynamically compiles Quotation #QUO-8920 with SKU line items, discount tiers, and an embedded UPI QR code delivered straight to the customer.',
      visualBadge: 'Quotation: #QUO-8920 Attached',
      visualText: 'Proposal Sent • Total: ₹1,80,000 • 1-Click Razorpay UPI Active',
    },
    {
      title: 'Step 5: Webhook Confirmation & GST Invoicing',
      tag: 'Finance & Compliance',
      icon: 'fa-solid fa-circle-check',
      color: '#22C55E',
      headline: 'Payment verified, deal marked "Won", compliant GST invoice issued.',
      detail: 'The payment gateway triggers an instant webhook. UWO Connect produces GST Tax Invoice #INV-2026-081, updates the accounting ledger, and alerts fulfillment.',
      visualBadge: 'Deal Won: ₹1,80,000 Recorded',
      visualText: 'GST Tax Invoice Auto-Dispatched • Deal Closed Successfully! 🎉',
    },
  ];

  // Auto-play interval
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % demoSteps.length);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, demoSteps.length]);

  const active = demoSteps[currentStep];

  return (
    <section className="uwoc-section" id="interactive-demo">
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
            <i className="fa-solid fa-play"></i>
            <span>INTERACTIVE PRODUCT WALKTHROUGH</span>
          </div>

          <h2 className="uwoc-section-title">
            See UWO Connect <span className="uwoc-gradient-gold">in Action.</span>
          </h2>

          <p className="uwoc-section-subtitle">
            Walk through a live simulated lifecycle from incoming inquiry to closed transaction without leaving this page.
          </p>
        </motion.div>

        {/* DEMO STAGE FRAME */}
        <div className="uwoc-walkthrough-stage">
          {/* Controls Bar */}
          <div className="uwoc-wt-controls-bar">
            <div className="uwoc-wt-step-indicators">
              {demoSteps.map((step, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`uwoc-step-pill-btn ${currentStep === idx ? 'active' : ''} ${currentStep > idx ? 'completed' : ''}`}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStep(idx);
                  }}
                >
                  <span className="dot" />
                  <span>Step {idx + 1}</span>
                </button>
              ))}
            </div>

            <div className="uwoc-wt-playback-actions">
              <button
                type="button"
                className="uwoc-wt-action-btn"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep((prev) => (prev > 0 ? prev - 1 : demoSteps.length - 1));
                }}
                title="Previous step"
              >
                <i className="fa-solid fa-backward-step"></i>
              </button>

              <button
                type="button"
                className="uwoc-wt-action-btn play-pause"
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? 'Pause' : 'Auto Play'}
              >
                <i className={isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'}></i>
                <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>

              <button
                type="button"
                className="uwoc-wt-action-btn"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep((prev) => (prev + 1) % demoSteps.length);
                }}
                title="Next step"
              >
                <i className="fa-solid fa-forward-step"></i>
              </button>

              <button
                type="button"
                className="uwoc-wt-action-btn"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(0);
                }}
                title="Replay from beginning"
              >
                <i className="fa-solid fa-rotate-left"></i>
              </button>
            </div>
          </div>

          {/* ACTIVE STEP STAGE DISPLAY */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="uwoc-wt-screen-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="uwoc-wt-screen-grid">
                {/* Left Step Details */}
                <div className="uwoc-wt-details">
                  <div className="uwoc-wt-tag-row">
                    <span className="uwoc-wt-channel-tag" style={{ backgroundColor: `${active.color}15`, color: active.color }}>
                      <i className={active.icon}></i>
                      {active.tag}
                    </span>
                    <span className="uwoc-wt-counter">Step {currentStep + 1} of 5</span>
                  </div>

                  <h3>{active.title}</h3>
                  <p className="headline">{active.headline}</p>
                  <p className="detail">{active.detail}</p>
                </div>

                {/* Right Visual Simulation Display */}
                <div className="uwoc-wt-visual">
                  <div className="uwoc-visual-monitor">
                    <div className="monitor-top">
                      <span className="dot dot-red" />
                      <span className="dot dot-yellow" />
                      <span className="dot dot-green" />
                      <span className="badge">{active.visualBadge}</span>
                    </div>

                    <div className="monitor-content">
                      <div className="visual-icon-circle" style={{ backgroundColor: `${active.color}20`, color: active.color }}>
                        <i className={active.icon}></i>
                      </div>
                      <div className="visual-text-bubble">
                        <i className="fa-solid fa-quote-left"></i>
                        <p>{active.visualText}</p>
                      </div>
                    </div>

                    <div className="monitor-footer">
                      <span className="live-indicator"><span className="pulse-dot" /> Autonomous Telemetry Stream</span>
                      <span className="status-ok">Verified Zero-Latency</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
