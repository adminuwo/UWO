import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DASHBOARD_TABS } from '../../constants/uwoConnectConstants';
import { fadeUp } from './motionVariants';

export default function DashboardShowcase() {
  const [selectedTabId, setSelectedTabId] = useState('overview');
  const activeTab = DASHBOARD_TABS.find((t) => t.id === selectedTabId) || DASHBOARD_TABS[0];

  return (
    <section className="uwoc-section" id="dashboard-showcase">
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
            <i className="fa-solid fa-desktop"></i>
            <span>PRODUCT INTERFACE TOUR</span>
          </div>

          <h2 className="uwoc-section-title">
            Inside <span className="uwoc-gradient-gold">UWO Connect.</span>
          </h2>

          <p className="uwoc-section-subtitle">
            A state-of-the-art interface tailored for high throughput, sub-second responses, and intuitive drag-and-drop management.
          </p>
        </motion.div>

        {/* TABS SELECTOR */}
        <div className="uwoc-dash-tabs-nav">
          {DASHBOARD_TABS.map((tab) => {
            const isActive = tab.id === selectedTabId;
            return (
              <button
                key={tab.id}
                type="button"
                className={`uwoc-dtab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedTabId(tab.id)}
              >
                <i className={tab.icon}></i>
                <span>{tab.label}</span>
                {isActive && <motion.span layoutId="tabHighlight" className="uwoc-dtab-active-dot" />}
              </button>
            );
          })}
        </div>

        {/* ACTIVE MOCKUP SCREEN */}
        <div className="uwoc-mockup-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              className="uwoc-mockup-frame"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {/* Mockup Top Browser / SaaS Titlebar */}
              <div className="uwoc-mock-titlebar">
                <div className="uwoc-titlebar-left">
                  <div className="uwoc-mac-dots">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <div className="uwoc-mock-url-badge">
                    <i className="fa-solid fa-lock text-green"></i>
                    <span>https://connect.uwo.in/app/{activeTab.id}</span>
                  </div>
                </div>

                <div className="uwoc-titlebar-center">
                  <h3>{activeTab.title}</h3>
                </div>

                <div className="uwoc-titlebar-right">
                  <div className="uwoc-mock-status-pill">
                    <span className="pulse-dot" />
                    <span>Node: 100% Operational • 99.99% SLA</span>
                  </div>
                </div>
              </div>

              {/* Sub-header info bar */}
              <div className="uwoc-mock-subnav">
                <p className="uwoc-mock-subnav-desc">
                  <i className="fa-solid fa-circle-info text-teal"></i> {activeTab.subtitle}
                </p>
                <div className="uwoc-mock-subnav-actions">
                  <span className="subnav-badge"><i className="fa-solid fa-clock"></i> Live Feed</span>
                  <span className="subnav-badge"><i className="fa-solid fa-shield-halved"></i> 256-Bit Encrypted</span>
                </div>
              </div>

              {/* SCREEN CONTENT BASED ON TAB */}
              <div className="uwoc-mock-canvas">
                {/* 1. EXECUTIVE OVERVIEW */}
                {activeTab.id === 'overview' && (
                  <div className="uwoc-screen-overview">
                    {/* Top 4 Metrics Cards */}
                    <div className="uwoc-stats-grid">
                      <div className="uwoc-stat-box">
                        <div className="stat-top">
                          <span className="lbl">Active Conversations</span>
                          <div className="stat-icon-wrap teal">
                            <i className="fa-solid fa-comments"></i>
                          </div>
                        </div>
                        <strong className="num">1,428</strong>
                        <div className="stat-bottom">
                          <span className="growth-pill green">
                            <i className="fa-solid fa-arrow-trend-up"></i> +24% this week
                          </span>
                          <span className="sub-stat">across 4 channels</span>
                        </div>
                      </div>

                      <div className="uwoc-stat-box">
                        <div className="stat-top">
                          <span className="lbl">AI Auto-Resolved</span>
                          <div className="stat-icon-wrap purple">
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                          </div>
                        </div>
                        <strong className="num">82.4%</strong>
                        <div className="stat-bottom">
                          <span className="growth-pill green">
                            <i className="fa-solid fa-bolt"></i> 1,176 instant
                          </span>
                          <span className="sub-stat">0 human latency</span>
                        </div>
                      </div>

                      <div className="uwoc-stat-box">
                        <div className="stat-top">
                          <span className="lbl">Pipeline Value</span>
                          <div className="stat-icon-wrap gold">
                            <i className="fa-solid fa-indian-rupee-sign"></i>
                          </div>
                        </div>
                        <strong className="num">₹28,45,000</strong>
                        <div className="stat-bottom">
                          <span className="growth-pill gold">
                            <i className="fa-solid fa-circle-check"></i> 42 active deals
                          </span>
                          <span className="sub-stat">+18% closing rate</span>
                        </div>
                      </div>

                      <div className="uwoc-stat-box">
                        <div className="stat-top">
                          <span className="lbl">Avg Response Time</span>
                          <div className="stat-icon-wrap green">
                            <i className="fa-solid fa-stopwatch"></i>
                          </div>
                        </div>
                        <strong className="num">&lt;0.8s</strong>
                        <div className="stat-bottom">
                          <span className="growth-pill green">
                            <i className="fa-solid fa-shield-halved"></i> SLA Met
                          </span>
                          <span className="sub-stat">99.98% within 2s</span>
                        </div>
                      </div>
                    </div>

                    {/* Hourly Telemetry Visual Bar Chart */}
                    <div className="uwoc-analytics-chart-mock">
                      <div className="chart-header">
                        <div className="chart-title-area">
                          <h4>
                            <i className="fa-solid fa-chart-column text-teal"></i> Hourly Ingestion &amp; Conversation Velocity
                          </h4>
                          <p>Live telemetry stream from Meta WhatsApp Cloud API, Instagram Graph &amp; Webhooks</p>
                        </div>
                        <div className="chart-meta-tags">
                          <span className="chart-live-badge">
                            <span className="live-dot-ping"></span>
                            Live Socket Stream
                          </span>
                          <span className="chart-peak-badge">
                            <i className="fa-solid fa-fire"></i> Peak: 120 msgs @ 17:00
                          </span>
                        </div>
                      </div>

                      {/* Chart Body with Gridlines & Animated Bars */}
                      <div className="chart-body-wrapper">
                        <div className="chart-gridlines">
                          <div className="gridline"><span>120</span></div>
                          <div className="gridline"><span>90</span></div>
                          <div className="gridline"><span>60</span></div>
                          <div className="gridline"><span>30</span></div>
                          <div className="gridline"><span>0</span></div>
                        </div>

                        <div className="chart-bars">
                          {[
                            { time: '08:00', msgs: 45, conv: 12 },
                            { time: '09:00', msgs: 62, conv: 18 },
                            { time: '10:00', msgs: 78, conv: 24 },
                            { time: '11:00', msgs: 54, conv: 15 },
                            { time: '12:00', msgs: 88, conv: 29 },
                            { time: '13:00', msgs: 95, conv: 31 },
                            { time: '14:00', msgs: 110, conv: 38 },
                            { time: '15:00', msgs: 85, conv: 26 },
                            { time: '16:00', msgs: 92, conv: 30 },
                            { time: '17:00', msgs: 120, conv: 44, isPeak: true },
                            { time: '18:00', msgs: 105, conv: 36 },
                            { time: '19:00', msgs: 98, conv: 32 }
                          ].map((item, idx) => (
                            <div key={idx} className={`bar-col ${item.isPeak ? 'peak-col' : ''}`}>
                              <div className="bar-track">
                                <motion.div
                                  className={`bar-fill ${item.isPeak ? 'peak-bar' : ''}`}
                                  initial={{ height: 0 }}
                                  animate={{ height: `${(item.msgs / 120) * 100}%` }}
                                  transition={{ duration: 0.8, delay: idx * 0.04, ease: 'easeOut' }}
                                >
                                  {item.isPeak && <span className="bar-peak-tag">PEAK</span>}
                                  <div className="bar-tooltip">
                                    <strong className="tooltip-msgs">{item.msgs} msgs/hr</strong>
                                    <span className="tooltip-sub">{item.conv} leads converted</span>
                                  </div>
                                </motion.div>
                              </div>
                              <span className="bar-label">{item.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Chart Footer Live Telemetry Strip */}
                      <div className="chart-footer-metrics">
                        <div className="cfm-item">
                          <i className="fa-solid fa-circle-nodes text-teal"></i>
                          <span>Active Sockets: <strong>14 Nodes (Meta API)</strong></span>
                        </div>
                        <div className="cfm-item">
                          <i className="fa-solid fa-gauge-high text-green"></i>
                          <span>Avg Ingestion: <strong>87.5 msgs/hr</strong></span>
                        </div>
                        <div className="cfm-item">
                          <i className="fa-solid fa-server text-blue"></i>
                          <span>Edge Latency: <strong>48ms (Mumbai ap-south-1)</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. UNIFIED INBOX */}
                {activeTab.id === 'inbox' && (
                  <div className="uwoc-screen-inbox-mock">
                    <div className="mock-chat-list">
                      <div className="mock-chat-search">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="Search conversations or tags..." readOnly value="Aarav Malhotra" />
                        <span className="filter-pill active">All (18)</span>
                      </div>

                      <div className="chat-item active">
                        <div className="avatar whatsapp-av">
                          <span>AM</span>
                          <span className="channel-badge wa"><i className="fa-brands fa-whatsapp"></i></span>
                        </div>
                        <div className="info">
                          <div className="top">
                            <strong>Aarav Malhotra</strong>
                            <span className="time">10:44 AM</span>
                          </div>
                          <span className="preview">I have reviewed your proposal #QUO-8920...</span>
                          <div className="tags">
                            <span className="chat-tag gold">High Intent</span>
                            <span className="chat-tag">Enterprise Tier</span>
                          </div>
                        </div>
                      </div>

                      <div className="chat-item">
                        <div className="avatar insta-av">
                          <span>KR</span>
                          <span className="channel-badge ig"><i className="fa-brands fa-instagram"></i></span>
                        </div>
                        <div className="info">
                          <div className="top">
                            <strong>Kritika Roy</strong>
                            <span className="time">11:15 AM</span>
                          </div>
                          <span className="preview">Loved your new automation showcase! White-label...</span>
                          <div className="tags">
                            <span className="chat-tag">Agency</span>
                          </div>
                        </div>
                      </div>

                      <div className="chat-item">
                        <div className="avatar fb-av">
                          <span>SV</span>
                          <span className="channel-badge fb"><i className="fa-brands fa-facebook-messenger"></i></span>
                        </div>
                        <div className="info">
                          <div className="top">
                            <strong>Sunil Verma</strong>
                            <span className="time">01:05 PM</span>
                          </div>
                          <span className="preview">Does it integrate with Google Sheets and Outlook?</span>
                          <div className="tags">
                            <span className="chat-tag">Logistics</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mock-active-conversation">
                      <div className="conv-head">
                        <div className="conv-contact-info">
                          <div className="avatar-sm">AM</div>
                          <div>
                            <div className="name-row">
                              <strong>Aarav Malhotra</strong>
                              <span className="verified-check"><i className="fa-solid fa-circle-check"></i> Verified</span>
                            </div>
                            <span className="handle">+91 98101 • WhatsApp Business API</span>
                          </div>
                        </div>
                        <div className="conv-deal-badge">
                          <i className="fa-solid fa-chart-line"></i> Pipeline: <strong>₹1,80,000</strong>
                        </div>
                      </div>

                      <div className="conv-bubbles">
                        <div className="b-in">
                          <p>Hi team, what are the setup requirements for our retail branches?</p>
                          <span className="bubble-meta">10:42 AM</span>
                        </div>
                        <div className="b-ai">
                          <div className="ai-pill"><i className="fa-solid fa-wand-magic-sparkles"></i> AI Copilot Auto-Response</div>
                          <p>Hello Aarav! Zero local software installation required. We provision your cloud numbers directly via Meta Cloud API with instant 2-way CRM sync.</p>
                          <span className="bubble-meta">10:42 AM • Instant (0.4s)</span>
                        </div>
                        <div className="b-out">
                          <p>I have attached our tailored proposal #QUO-8920 with full enterprise onboarding details.</p>
                          <span className="bubble-meta">10:44 AM • Read <i className="fa-solid fa-check-double text-blue"></i></span>
                        </div>
                      </div>

                      <div className="conv-ai-suggest-bar">
                        <div className="suggest-info">
                          <i className="fa-solid fa-brain text-purple"></i>
                          <span>Suggested Next Step: <strong>Dispatch Razorpay UPI Link for 10% Advance Token</strong></span>
                        </div>
                        <button type="button" className="btn-send-suggest">
                          <i className="fa-solid fa-bolt"></i> Send AI Action
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. CRM PIPELINE */}
                {activeTab.id === 'crm' && (
                  <div className="uwoc-screen-kanban-mock">
                    <div className="kanban-col">
                      <div className="col-head blue">
                        <span><i className="fa-solid fa-sparkles"></i> New Leads (18)</span>
                        <strong>₹4.2L</strong>
                      </div>
                      <div className="k-cards-stack">
                        <div className="k-card">
                          <div className="k-card-top">
                            <span className="k-source wa"><i className="fa-brands fa-whatsapp"></i> WhatsApp</span>
                            <span className="k-time">12m ago</span>
                          </div>
                          <strong>Dr. Sameer Khan</strong>
                          <span className="k-desc">Clinic WhatsApp Inbound • Multi-Doctor</span>
                          <div className="card-foot">
                            <span className="tag">MedTech</span>
                            <span className="k-deal">₹45,000</span>
                          </div>
                        </div>

                        <div className="k-card">
                          <div className="k-card-top">
                            <span className="k-source ig"><i className="fa-brands fa-instagram"></i> Instagram</span>
                            <span className="k-time">1h ago</span>
                          </div>
                          <strong>Pooja Singhal</strong>
                          <span className="k-desc">Instagram DM Inquiry • Catalog Sync</span>
                          <div className="card-foot">
                            <span className="tag">Retail</span>
                            <span className="k-deal">₹60,000</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="kanban-col">
                      <div className="col-head teal">
                        <span><i className="fa-solid fa-filter"></i> Qualified (12)</span>
                        <strong>₹8.5L</strong>
                      </div>
                      <div className="k-cards-stack">
                        <div className="k-card highlighted">
                          <div className="k-card-top">
                            <span className="k-source wa"><i className="fa-brands fa-whatsapp"></i> WhatsApp</span>
                            <span className="k-badge-gold">🔥 Hot Lead</span>
                          </div>
                          <strong>Aarav Malhotra</strong>
                          <span className="k-desc">Retail Chain Automation • 12 Outlets</span>
                          <div className="card-foot">
                            <span className="tag gold">High Intent</span>
                            <span className="k-deal text-gold">₹1,80,000</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="kanban-col">
                      <div className="col-head purple">
                        <span><i className="fa-solid fa-file-invoice"></i> Proposal Sent (7)</span>
                        <strong>₹6.9L</strong>
                      </div>
                      <div className="k-cards-stack">
                        <div className="k-card">
                          <div className="k-card-top">
                            <span className="k-source fb"><i className="fa-brands fa-facebook-messenger"></i> Facebook</span>
                            <span className="k-time">Yesterday</span>
                          </div>
                          <strong>Apex Logistics Pvt. Ltd.</strong>
                          <span className="k-desc">Fleet Dispatch Automation &amp; Sheets Sync</span>
                          <div className="card-foot">
                            <span className="tag">Logistics</span>
                            <span className="k-deal">₹2,40,000</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="kanban-col">
                      <div className="col-head green">
                        <span><i className="fa-solid fa-circle-check"></i> Won &amp; Invoiced (24)</span>
                        <strong>₹16.8L</strong>
                      </div>
                      <div className="k-cards-stack">
                        <div className="k-card won">
                          <div className="k-card-top">
                            <span className="k-source wa"><i className="fa-brands fa-whatsapp"></i> WhatsApp</span>
                            <span className="k-badge-green">✓ Paid UPI</span>
                          </div>
                          <strong>Kritika Designs Agency</strong>
                          <span className="k-desc">White-Label Enterprise Partner Portal</span>
                          <div className="card-foot">
                            <span className="tag green">Annual Sub</span>
                            <span className="k-deal text-green">₹75,000/mo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. WORKFLOW CANVAS */}
                {activeTab.id === 'automation' && (
                  <div className="uwoc-screen-workflow-mock">
                    <div className="canvas-header-strip">
                      <div className="canvas-title">
                        <i className="fa-solid fa-diagram-project text-teal"></i>
                        <span>Active Flow: <strong>Instant Lead Ingestion &amp; PDF Quote Dispatch</strong></span>
                      </div>
                      <div className="canvas-controls">
                        <span className="status-live-flow"><span className="pulse-dot"></span> Live Trigger</span>
                        <span className="zoom-pill">100% Zoom</span>
                      </div>
                    </div>

                    <div className="canvas-nodes-container">
                      <div className="c-node trigger">
                        <div className="n-badge trigger-bg">TRIGGER #1</div>
                        <div className="n-icon"><i className="fa-brands fa-whatsapp"></i></div>
                        <strong>Inbound WhatsApp Message</strong>
                        <span className="sub">Keyword Condition: <code>regex('PRICING|QUOTE')</code></span>
                      </div>

                      <div className="c-connector-line">
                        <div className="connector-wire"></div>
                        <span className="pill">Rule: Match Verified</span>
                      </div>

                      <div className="c-node ai">
                        <div className="n-badge ai-bg">AI COPILOT</div>
                        <div className="n-icon"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
                        <strong>Extract Intent &amp; Scope</strong>
                        <span className="sub">Knowledge Base: <code>Enterprise_Catalog_2026.pdf</code></span>
                      </div>

                      <div className="c-connector-line">
                        <div className="connector-wire"></div>
                        <span className="pill">Branch: Auto-Generate</span>
                      </div>

                      <div className="c-node action">
                        <div className="n-badge action-bg">ACTION #1</div>
                        <div className="n-icon"><i className="fa-solid fa-file-invoice-dollar"></i></div>
                        <strong>Compile &amp; Send PDF Quote</strong>
                        <span className="sub">Embed Razorpay Dynamic UPI QR Link</span>
                      </div>

                      <div className="c-connector-line">
                        <div className="connector-wire"></div>
                        <span className="pill">Post-Action Sync</span>
                      </div>

                      <div className="c-node finish">
                        <div className="n-badge finish-bg">CRM SYNC</div>
                        <div className="n-icon"><i className="fa-solid fa-check"></i></div>
                        <strong>Update Pipeline &amp; Notify</strong>
                        <span className="sub">Move Stage: "Proposal Sent" • Slack Alert</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. SALES & QUOTES */}
                {activeTab.id === 'sales' && (
                  <div className="uwoc-screen-quotes-mock">
                    <div className="quote-preview-box">
                      <div className="qp-top">
                        <div className="qp-brand">
                          <div className="qp-logo-pill">
                            <i className="fa-solid fa-paper-plane text-teal"></i>
                            <strong>UWO Connect™ Commercial Proposal</strong>
                          </div>
                          <span className="ref-text">Ref ID: #QUO-8920 • Issued: October 2026 • Valid for 15 Days</span>
                        </div>
                        <div className="qp-status-pill approved">
                          <i className="fa-solid fa-circle-check"></i> APPROVED BY CLIENT
                        </div>
                      </div>

                      <div className="qp-client-row">
                        <div>
                          <span className="sub-lbl">Billed To:</span>
                          <strong>Malhotra Retail Solutions Pvt. Ltd.</strong>
                          <span className="client-contact">Connaught Place, New Delhi • GSTIN: 07AABCM8920F1ZX</span>
                        </div>
                        <div className="text-right">
                          <span className="sub-lbl">Account Executive:</span>
                          <strong>Vikram Joshi</strong>
                          <span className="client-contact">Enterprise Solutions Lead</span>
                        </div>
                      </div>

                      <div className="qp-table">
                        <div className="qp-row header">
                          <span className="col-desc">Solution &amp; Scope Description</span>
                          <span className="col-qty">Qty</span>
                          <span className="col-rate">Unit Price</span>
                          <span className="col-total">Total (INR)</span>
                        </div>
                        <div className="qp-row">
                          <span className="col-desc">
                            <strong>UWO Connect™ Enterprise Platform (Annual License)</strong>
                            <small>Includes WhatsApp Cloud API, Instagram Graph &amp; CRM Sync</small>
                          </span>
                          <span className="col-qty">1</span>
                          <span className="col-rate">₹1,50,000</span>
                          <span className="col-total">₹1,50,000</span>
                        </div>
                        <div className="qp-row">
                          <span className="col-desc">
                            <strong>Meta WhatsApp Cloud API Dedicated Onboarding &amp; Green Tick Assist</strong>
                            <small>Direct Meta Cloud setup with zero markups</small>
                          </span>
                          <span className="col-qty">1</span>
                          <span className="col-rate">₹30,000</span>
                          <span className="col-total">₹30,000</span>
                        </div>
                      </div>

                      <div className="qp-footer-summary">
                        <div className="qp-terms">
                          <span>✓ Includes 24/7 Priority SLA Guarantee &amp; Dedicated WhatsApp Support Group</span>
                          <span>✓ Instant Activation within 4 Business Hours</span>
                        </div>
                        <div className="qp-total-card">
                          <div className="t-line"><span>Net Subtotal:</span> <strong>₹1,80,000</strong></div>
                          <div className="t-line"><span>GST (18% Applicable):</span> <strong>₹32,400</strong></div>
                          <div className="t-line grand"><span>Total Payable:</span> <strong>₹2,12,400</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. GST INVOICING */}
                {activeTab.id === 'finance' && (
                  <div className="uwoc-screen-finance-mock">
                    <div className="gst-invoice-card">
                      <div className="gi-head">
                        <div>
                          <div className="gi-title-row">
                            <i className="fa-solid fa-file-invoice-dollar text-teal"></i>
                            <strong>TAX INVOICE — GST COMPLIANT</strong>
                          </div>
                          <span>UWO Services Pvt. Ltd. • GSTIN: 07AABCU9603R1ZM • SAC: 998314</span>
                        </div>
                        <span className="gst-tag">
                          <i className="fa-solid fa-stamp"></i> Official Tax Copy (Recipient)
                        </span>
                      </div>

                      <div className="gi-meta-grid">
                        <div className="gi-meta-item">
                          <span>Invoice Number:</span>
                          <strong>INV-2026-081</strong>
                        </div>
                        <div className="gi-meta-item">
                          <span>Invoice Date:</span>
                          <strong>01-Oct-2026</strong>
                        </div>
                        <div className="gi-meta-item">
                          <span>Payment Mode:</span>
                          <strong className="text-teal"><i className="fa-solid fa-bolt"></i> Razorpay UPI Instant</strong>
                        </div>
                        <div className="gi-meta-item">
                          <span>IRN Status:</span>
                          <strong className="text-green"><i className="fa-solid fa-circle-check"></i> PAID &amp; RECORDED</strong>
                        </div>
                      </div>

                      <div className="gi-tax-breakup">
                        <div className="t-row">
                          <span>Taxable Value of Software Supply (SAC 998314):</span>
                          <span>₹1,80,000.00</span>
                        </div>
                        <div className="t-row">
                          <span>Central GST (CGST @ 9.0%):</span>
                          <span>₹16,200.00</span>
                        </div>
                        <div className="t-row">
                          <span>State GST (SGST @ 9.0%):</span>
                          <span>₹16,200.00</span>
                        </div>
                        <div className="t-row total">
                          <span>Total Invoiced Amount (INR):</span>
                          <strong className="text-teal">₹2,12,400.00</strong>
                        </div>
                      </div>

                      <div className="gi-auth-strip">
                        <div className="irn-hash">
                          <i className="fa-solid fa-fingerprint"></i>
                          <span>IRN Hash: <code>7c29e4b108...d89a20fe</code> (Govt Portal Validated)</span>
                        </div>
                        <span className="digital-sign"><i className="fa-solid fa-shield-check text-green"></i> Digitally Signed via UWO Cloud HSM</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
