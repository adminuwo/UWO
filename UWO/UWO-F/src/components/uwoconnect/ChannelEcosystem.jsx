import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChannelEcosystem() {
  const [activeTab, setActiveTab] = useState('whatsapp');

  const channels = {
    whatsapp: {
      id: 'whatsapp',
      tabName: 'WhatsApp',
      iconType: 'whatsapp',
      badge: 'Official API',
      title: 'WhatsApp',
      headline: 'Automated WhatsApp Business Messaging',
      desc: 'Engage customers through automated catalog sharing, quick-replies, and official verified business messaging with zero delay.',
      customerName: 'Rohan Sharma (+91 98200-XXXX)',
      customerTime: 'Just now',
      customerMessage: '“Hi! Can you share the pricing catalog for enterprise CRM?”',
      aiReply: '“Hello Rohan! Here is the latest 2026 catalog and GST quotation PDF.”',
      btnText: 'Connect WhatsApp',
      image: '/images/uwoconnect/inbox_preview_live.png',
      imageAlt: 'WhatsApp Unified Inbox View',
      feedStatus: 'WhatsApp Feed Active',
    },
    instagram: {
      id: 'instagram',
      tabName: 'Instagram',
      iconType: 'instagram',
      badge: 'Meta Graph API',
      title: 'Instagram',
      headline: 'Instagram DM & Story Automation',
      desc: 'Turn followers into qualified pipeline leads. Automatically reply to reel comments, story mentions, and direct messages with zero delay.',
      customerName: 'Priya Verma (@priya.designs)',
      customerTime: '2m ago',
      customerMessage: '“Loved your latest AI reel! Where can I sign up for the platform demo?”',
      aiReply: '“Thanks Priya! Here is the link to book your 1-on-1 walkthrough with our specialist.”',
      btnText: 'Connect Instagram',
      image: '/images/uwoconnect/workflow_step1_messages.png',
      imageAlt: 'Instagram Direct Unified Inbox View',
      feedStatus: 'Instagram Feed Active',
    },
    facebook: {
      id: 'facebook',
      tabName: 'Facebook',
      iconType: 'facebook',
      badge: 'Meta Business Suite',
      title: 'Facebook',
      headline: 'High-Converting Messenger Ad Funnels',
      desc: 'Capture and qualify prospects directly from Click-to-Messenger ad funnels with zero drop-offs in real time.',
      customerName: 'Vikram Mehta (Ad Lead)',
      customerTime: '5m ago',
      customerMessage: '“Interested in your agency white-label communication solution.”',
      aiReply: '“Welcome Vikram! How many client portals are you planning to manage this quarter?”',
      btnText: 'Connect Facebook',
      image: '/images/uwoconnect/inbox_preview_live.png',
      imageAlt: 'Facebook Messenger Unified Inbox View',
      feedStatus: 'Facebook Feed Active',
    },
    youtube: {
      id: 'youtube',
      tabName: 'YouTube',
      isSoon: true,
      iconType: 'youtube',
      badge: 'Google Data API',
      title: 'YouTube',
      headline: 'Automate Comment-to-Lead Workflows',
      desc: 'Convert engaged video viewers and comments into inbound customer leads automatically with verified link routing.',
      customerName: 'Ananya Rao',
      customerTime: '10m ago',
      customerMessage: '“Great video breakdown! Where can I download the workflow template?”',
      aiReply: '“Hi Ananya! We have dispatched the workflow guide and template link to your inbox.”',
      btnText: 'Explore YouTube',
      image: '/images/uwoconnect/inbox_preview_live.png',
      imageAlt: 'YouTube Inquiries Feed View',
      feedStatus: 'YouTube Feed Sync',
    },
  };

  const current = channels[activeTab];

  return (
    <section className="uwoc-section uwoc-replica-channels-section" id="channels">
      <div className="uwoc-container">
        {/* Section Header (Exact replica of Reference Website) */}
        <motion.div
          className="uwoc-section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className="uwoc-eyebrow">
            <span className="uwoc-pill-dot" />
            <span>Multi-Channel Unified Inbox</span>
          </div>

          <h2 className="uwoc-section-title">
            Meet Your Customers. <br />
            <span className="uwoc-highlight">Where They Already Are.</span>
          </h2>

          <p className="uwoc-section-subtitle">
            Manage conversations across your most important communication channels from one unified platform.
          </p>
        </motion.div>

        {/* Channel Selector Pills Row */}
        <div className="uwoc-ref-tabs-row">
          {/* WhatsApp Tab */}
          <button
            type="button"
            className={`uwoc-ref-tab-btn ${activeTab === 'whatsapp' ? 'active-whatsapp' : ''}`}
            onClick={() => setActiveTab('whatsapp')}
          >
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none" className="shrink-0">
              <circle cx="24" cy="24" r="24" fill="#25D366"></circle>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M35.2 12.8C32.3 9.9 28.3 8.3 24.1 8.3C15.4 8.3 8.4 15.3 8.4 24C8.4 26.8 9.1 29.5 10.5 31.9L8.4 39.6L16.3 37.5C18.6 38.8 21.3 39.5 24.1 39.5C32.8 39.5 39.8 32.5 39.8 23.8C39.8 19.6 38.1 15.6 35.2 12.8ZM24.1 36.8C21.7 36.8 19.4 36.1 17.4 35L16.9 34.7L12.2 35.9L13.5 31.3L13.2 30.8C12 28.7 11.3 26.4 11.3 24C11.3 17 17 11.3 24.1 11.3C27.5 11.3 30.7 12.6 33.1 15C35.5 17.4 36.8 20.6 36.8 24C36.8 31 31.1 36.8 24.1 36.8ZM31 27.2C30.6 27 28.7 26.1 28.4 26C28 25.8 27.8 25.7 27.5 26.1C27.2 26.5 26.5 27.4 26.3 27.6C26.1 27.9 25.8 27.9 25.4 27.7C25 27.5 23.7 27.1 22.2 25.7C21 24.7 20.2 23.4 20 23C19.8 22.6 20 22.4 20.8 21.5C21 21.3 21.1 21.1 21.2 20.9C21.3 20.7 21.3 20.5 21.2 20.3C21.1 20.1 20.3 18.2 20 17.4C19.7 16.6 19.4 16.7 19.1 16.7H18.4C18.1 16.7 17.7 16.8 17.3 17.2C16.9 17.6 16 18.5 16 20.3C16 22.1 17.3 23.9 17.5 24.1C17.7 24.3 20.1 28 23.7 29.6C24.6 30 25.2 30.2 25.8 30.4C26.7 30.7 27.5 30.6 28.2 30.5C28.9 30.4 30.5 29.5 30.8 28.6C31.1 27.8 31.1 27.1 31 27.2Z"
                fill="white"
              ></path>
            </svg>
            <span>WhatsApp</span>
          </button>

          {/* Instagram Tab */}
          <button
            type="button"
            className={`uwoc-ref-tab-btn ${activeTab === 'instagram' ? 'active-instagram' : ''}`}
            onClick={() => setActiveTab('instagram')}
          >
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none" className="shrink-0">
              <defs>
                <linearGradient id="igGradLandingTab" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFD600"></stop>
                  <stop offset="25%" stopColor="#FF7A00"></stop>
                  <stop offset="50%" stopColor="#FF0069"></stop>
                  <stop offset="75%" stopColor="#D300C5"></stop>
                  <stop offset="100%" stopColor="#7638FA"></stop>
                </linearGradient>
              </defs>
              <rect width="48" height="48" rx="12" fill="url(#igGradLandingTab)"></rect>
              <rect x="11" y="11" width="26" height="26" rx="7" stroke="white" strokeWidth="3" fill="none"></rect>
              <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="3" fill="none"></circle>
              <circle cx="31.5" cy="16.5" r="1.75" fill="white"></circle>
            </svg>
            <span>Instagram</span>
          </button>

          {/* Facebook Tab */}
          <button
            type="button"
            className={`uwoc-ref-tab-btn ${activeTab === 'facebook' ? 'active-facebook' : ''}`}
            onClick={() => setActiveTab('facebook')}
          >
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none" className="shrink-0">
              <circle cx="24" cy="24" r="24" fill="#1877F2"></circle>
              <path
                d="M29.5 25.1L30.3 19.9H25.3V16.5C25.3 15.1 26 13.7 28.2 13.7H30.5V9.3C30.5 9.3 28.4 9 26.4 9C22.3 9 19.6 11.5 19.6 16V19.9H15V25.1H19.6V37.7C20.5 37.9 21.5 38 22.5 38C23.5 38 24.4 37.9 25.3 37.7V25.1H29.5Z"
                fill="white"
              ></path>
            </svg>
            <span>Facebook</span>
          </button>

          {/* YouTube Tab */}
          <button
            type="button"
            className={`uwoc-ref-tab-btn ${activeTab === 'youtube' ? 'active-youtube' : ''}`}
            onClick={() => setActiveTab('youtube')}
          >
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none" className="shrink-0">
              <rect width="48" height="48" rx="12" fill="#FF0000"></rect>
              <path
                d="M33.2 24.1L19.5 16.2C19.2 16 18.8 16.2 18.8 16.6V32.4C18.8 32.8 19.2 33 19.5 32.8L33.2 24.9C33.5 24.7 33.5 24.3 33.2 24.1Z"
                fill="white"
              ></path>
            </svg>
            <span>YouTube</span>
            <span className="uwoc-soon-pill">SOON</span>
          </button>
        </div>

        {/* Big Showcase Box (Exact replica: 5 cols left, 7 cols right) */}
        <div className="uwoc-ref-showcase-box">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className="uwoc-ref-grid"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {/* Left Column (5 Cols): Channel Info, Chat Simulation & Connect CTA */}
              <div className="uwoc-ref-left-col">
                <div className="uwoc-ref-left-content">
                  {/* Channel Header (Icon + Official Tag + Name) */}
                  <div className="uwoc-ref-brand-row">
                    <div className="uwoc-ref-icon-box">
                      {current.id === 'whatsapp' && (
                        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" className="shrink-0">
                          <circle cx="24" cy="24" r="24" fill="#25D366"></circle>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M35.2 12.8C32.3 9.9 28.3 8.3 24.1 8.3C15.4 8.3 8.4 15.3 8.4 24C8.4 26.8 9.1 29.5 10.5 31.9L8.4 39.6L16.3 37.5C18.6 38.8 21.3 39.5 24.1 39.5C32.8 39.5 39.8 32.5 39.8 23.8C39.8 19.6 38.1 15.6 35.2 12.8ZM24.1 36.8C21.7 36.8 19.4 36.1 17.4 35L16.9 34.7L12.2 35.9L13.5 31.3L13.2 30.8C12 28.7 11.3 26.4 11.3 24C11.3 17 17 11.3 24.1 11.3C27.5 11.3 30.7 12.6 33.1 15C35.5 17.4 36.8 20.6 36.8 24C36.8 31 31.1 36.8 24.1 36.8ZM31 27.2C30.6 27 28.7 26.1 28.4 26C28 25.8 27.8 25.7 27.5 26.1C27.2 26.5 26.5 27.4 26.3 27.6C26.1 27.9 25.8 27.9 25.4 27.7C25 27.5 23.7 27.1 22.2 25.7C21 24.7 20.2 23.4 20 23C19.8 22.6 20 22.4 20.8 21.5C21 21.3 21.1 21.1 21.2 20.9C21.3 20.7 21.3 20.5 21.2 20.3C21.1 20.1 20.3 18.2 20 17.4C19.7 16.6 19.4 16.7 19.1 16.7H18.4C18.1 16.7 17.7 16.8 17.3 17.2C16.9 17.6 16 18.5 16 20.3C16 22.1 17.3 23.9 17.5 24.1C17.7 24.3 20.1 28 23.7 29.6C24.6 30 25.2 30.2 25.8 30.4C26.7 30.7 27.5 30.6 28.2 30.5C28.9 30.4 30.5 29.5 30.8 28.6C31.1 27.8 31.1 27.1 31 27.2Z"
                            fill="white"
                          ></path>
                        </svg>
                      )}
                      {current.id === 'instagram' && (
                        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" className="shrink-0">
                          <rect width="48" height="48" rx="12" fill="url(#igGradLandingTab)"></rect>
                          <rect x="11" y="11" width="26" height="26" rx="7" stroke="white" strokeWidth="3" fill="none"></rect>
                          <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="3" fill="none"></circle>
                          <circle cx="31.5" cy="16.5" r="1.75" fill="white"></circle>
                        </svg>
                      )}
                      {current.id === 'facebook' && (
                        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" className="shrink-0">
                          <circle cx="24" cy="24" r="24" fill="#1877F2"></circle>
                          <path
                            d="M29.5 25.1L30.3 19.9H25.3V16.5C25.3 15.1 26 13.7 28.2 13.7H30.5V9.3C30.5 9.3 28.4 9 26.4 9C22.3 9 19.6 11.5 19.6 16V19.9H15V25.1H19.6V37.7C20.5 37.9 21.5 38 22.5 38C23.5 38 24.4 37.9 25.3 37.7V25.1H29.5Z"
                            fill="white"
                          ></path>
                        </svg>
                      )}
                      {current.id === 'youtube' && (
                        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" className="shrink-0">
                          <rect width="48" height="48" rx="12" fill="#FF0000"></rect>
                          <path
                            d="M33.2 24.1L19.5 16.2C19.2 16 18.8 16.2 18.8 16.6V32.4C18.8 32.8 19.2 33 19.5 32.8L33.2 24.9C33.5 24.7 33.5 24.3 33.2 24.1Z"
                            fill="white"
                          ></path>
                        </svg>
                      )}
                    </div>

                    <div>
                      <span className="uwoc-ref-tag">{current.badge}</span>
                      <h3 className="uwoc-ref-channel-name">{current.title}</h3>
                    </div>
                  </div>

                  {/* Headline & Description */}
                  <h4 className="uwoc-ref-headline">{current.headline}</h4>
                  <p className="uwoc-ref-desc">{current.desc}</p>

                  {/* Message Simulation Box */}
                  <div className="uwoc-ref-sim-box">
                    <div className="uwoc-ref-sim-top">
                      <span className="uwoc-ref-sim-user">{current.customerName}</span>
                      <span className="uwoc-ref-sim-time">{current.customerTime}</span>
                    </div>

                    <p className="uwoc-ref-sim-bubble">{current.customerMessage}</p>

                    <div className="uwoc-ref-sim-reply">
                      ⚡ AI Automated Response: {current.aiReply}
                    </div>
                  </div>
                </div>

                {/* Connect CTA Button */}
                <a
                  href="https://uwoconnect.aisa24.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="uwoc-ref-connect-btn"
                >
                  <span>{current.btnText}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
              </div>

              {/* Right Column (7 Cols): Mockup Preview */}
              <div className="uwoc-ref-right-col">
                <div className="uwoc-ref-mockup-frame">
                  <div className="uwoc-ref-mockup-topbar">
                    <span className="uwoc-ref-live-dot" />
                    <span>Unified Inbox View • {current.feedStatus}</span>
                  </div>

                  <div className="uwoc-ref-img-wrap">
                    <img
                      src={current.image}
                      alt={current.imageAlt}
                      className="uwoc-ref-screenshot"
                      loading="lazy"
                    />
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
