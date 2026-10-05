import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHANNELS_DATA } from '../../constants/uwoConnectConstants';
import { fadeUp, staggerContainer, EASE_PREMIUM } from './motionVariants';

export default function OmnichannelInbox() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const selectedChannel = CHANNELS_DATA[currentIndex] || CHANNELS_DATA[0];

  // Auto-cycle through the channels every 5 seconds, synchronized with right-side animation
  useEffect(() => {
    if (isPaused) return;

    const duration = 5200;
    const intervalTime = 50;
    const stepIncrement = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % CHANNELS_DATA.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, currentIndex]);

  const handleSelectChannel = (index) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  return (
    <section className="uwoc-section uwoc-bg-contrast" id="omnichannel">
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
            <i className="fa-solid fa-comments"></i>
            <span>OMNICHANNEL UNIFIED INBOX</span>
          </div>

          <h2 className="uwoc-section-title">
            Every Conversation. <span className="uwoc-gradient-gold">One Inbox.</span>
          </h2>

          <p className="uwoc-section-subtitle">
            Never lose a lead between switching apps. Unify WhatsApp Business, Instagram Direct, Facebook Messenger, and YouTube comments into one collaborative multi-agent workspace.
          </p>
        </motion.div>

        {/* 2-Column Interactive Workspace */}
        <div 
          className="uwoc-inbox-interactive-grid"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* LEFT: COMPACT CHANNEL SELECTOR CARDS WITH STAGGERED ENTRANCE */}
          <motion.div 
            className="uwoc-channels-list"
            variants={staggerContainer(0.1, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <div className="uwoc-channels-header-hint">
              <span>ACTIVE CHANNELS</span>
              <span className="uwoc-sync-live-pill">
                <span className="pulse-dot-green" /> Auto-Sync Active
              </span>
            </div>

            {CHANNELS_DATA.map((channel, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <motion.div
                  key={channel.id}
                  className={`uwoc-channel-card ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectChannel(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectChannel(idx); }}
                  variants={fadeUp}
                  whileHover={{ x: 5, transition: { duration: 0.25, ease: EASE_PREMIUM } }}
                >
                  <div 
                    className="uwoc-channel-icon-pill" 
                    style={{ backgroundColor: `${channel.color}15`, color: channel.color }}
                  >
                    <i className={channel.icon}></i>
                  </div>

                  <div className="uwoc-channel-meta">
                    <div className="uwoc-channel-meta-top">
                      <h3>{channel.name}</h3>
                      <span className="uwoc-pill-label">{channel.badge}</span>
                    </div>
                    <div className="uwoc-channel-meta-bottom">
                      <span className="uwoc-channel-tag">{channel.tag}</span>
                      <span className="uwoc-dot-sep">•</span>
                      <span className="uwoc-status-text" style={{ color: channel.color }}>
                        <span className="dot" style={{ backgroundColor: channel.color }} />
                        {channel.status}
                      </span>
                    </div>
                  </div>

                  <div className="uwoc-channel-arrow">
                    <i className={`fa-solid ${isSelected ? 'fa-circle-check text-emerald' : 'fa-chevron-right'}`}></i>
                  </div>

                  {/* Active Auto-cycle Progress Line */}
                  {isSelected && (
                    <div 
                      className="uwoc-channel-progress-bar"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* RIGHT: LIVE INTERACTIVE INBOX PREVIEW (SYNCHRONIZED WITH LEFT) */}
          <div className="uwoc-inbox-preview-wrap">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedChannel.id}
                className="uwoc-inbox-screen"
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE_PREMIUM }}
              >
                {/* Inbox Top Bar */}
                <div className="uwoc-inbox-head">
                  <div className="uwoc-customer-meta">
                    <div 
                      className="uwoc-avatar" 
                      style={{ 
                        border: `2px solid ${selectedChannel.color}`,
                        backgroundColor: `${selectedChannel.color}15`,
                        color: selectedChannel.color 
                      }}
                    >
                      {selectedChannel.conversation.customerAvatar}
                    </div>
                    <div>
                      <div className="uwoc-customer-title">
                        <strong>{selectedChannel.conversation.customerName}</strong>
                        <span className="uwoc-source-chip">
                          <i className={selectedChannel.icon} style={{ color: selectedChannel.color }}></i>
                          {selectedChannel.conversation.source}
                        </span>
                      </div>
                      <span className="uwoc-handle-sub">{selectedChannel.conversation.customerHandle}</span>
                    </div>
                  </div>

                  <div className="uwoc-inbox-actions-top">
                    <span className="uwoc-crm-stage-chip">
                      <i className="fa-solid fa-chart-pie"></i>
                      {selectedChannel.conversation.leadStage}
                    </span>
                    <motion.span 
                      className="uwoc-val-badge"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.5, ease: EASE_PREMIUM }}
                    >
                      {selectedChannel.conversation.dealValue}
                    </motion.span>
                  </div>
                </div>

                {/* Message Stream with Animated Sequential Stagger */}
                <div className="uwoc-inbox-messages">
                  {selectedChannel.conversation.messages.map((msg, i) => {
                    if (msg.sender === 'system') {
                      return (
                        <motion.div 
                          key={i} 
                          className="uwoc-inbox-sys-msg"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.32 + i * 0.15, duration: 0.4, ease: EASE_PREMIUM }}
                        >
                          <i className="fa-solid fa-bolt"></i>
                          <span>{msg.text}</span>
                          <span className="sys-time">{msg.time}</span>
                        </motion.div>
                      );
                    }

                    const isAi = msg.isAi;
                    const isCustomer = msg.sender === 'customer';

                    return (
                      <motion.div
                        key={i}
                        className={`uwoc-inbox-bubble ${isCustomer ? 'incoming' : 'outgoing'} ${isAi ? 'ai-bubble' : ''}`}
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.12 + i * 0.18, duration: 0.45, ease: EASE_PREMIUM }}
                      >
                        {isAi && (
                          <div className="uwoc-ai-copilot-badge">
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                            <span>AI Copilot Auto-Reply (RAG Document Trained)</span>
                          </div>
                        )}
                        <p>{msg.text}</p>
                        <span className="bubble-time">{msg.time}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
