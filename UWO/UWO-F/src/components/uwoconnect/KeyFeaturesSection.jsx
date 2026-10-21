import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Bot, 
  Workflow, 
  GitFork, 
  Kanban, 
  ReceiptText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function KeyFeaturesSection() {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const features = [
    {
      icon: MessageSquare,
      accent: '#0B8F78',
      bgLight: 'rgba(11, 143, 120, 0.08)',
      badge: 'Official Meta API',
      title: 'Multi-Channel Inbox',
      desc: 'Unify WhatsApp Business, Instagram DM, and Facebook Messenger into one synchronized team workspace with smart agent routing.',
      tags: ['WhatsApp', 'Instagram', 'Messenger'],
    },
    {
      icon: Bot,
      accent: '#059669',
      bgLight: 'rgba(5, 150, 105, 0.08)',
      badge: 'Vector AI Engine',
      title: 'Autonomous AI Copilots',
      desc: 'Train intelligent AI assistants on your business PDFs, catalogs, and FAQs to answer queries and qualify leads 24/7 with zero delay.',
      tags: ['Catalog RAG', '24/7 Qualified', 'Auto-Reply'],
    },
    {
      icon: Workflow,
      accent: '#0284C7',
      bgLight: 'rgba(2, 132, 199, 0.08)',
      badge: 'Zero-Code Sync',
      title: 'Native Connectors',
      desc: 'Instantly connect Gmail, Microsoft 365, Zoho CRM, Google Sheets, and Maps to automatically sync leads without writing any code.',
      tags: ['Google Sheets', 'Gmail', 'Zoho CRM'],
    },
    {
      icon: GitFork,
      accent: '#D97706',
      bgLight: 'rgba(217, 119, 6, 0.08)',
      badge: 'Visual Builder',
      title: 'Workflow Automation',
      desc: 'Construct drag-and-drop trigger-to-action paths to route customer chats, send reminders, and trigger webhooks autonomously.',
      tags: ['Drag-and-Drop', 'Webhooks', 'Triggers'],
    },
    {
      icon: Kanban,
      accent: '#6366F1',
      bgLight: 'rgba(99, 102, 241, 0.08)',
      badge: 'Pipeline Sync',
      title: 'Industrial CRM Pipeline',
      desc: 'Visually organize leads across structured Kanban stages with automated lead scoring, activity histories, and conversion tracking.',
      tags: ['Kanban Board', 'Lead Scoring', 'Auto-Stages'],
    },
    {
      icon: ReceiptText,
      accent: '#0B8F78',
      bgLight: 'rgba(11, 143, 120, 0.08)',
      badge: 'Instant Checkout',
      title: 'GST Quotations & UPI',
      desc: 'Auto-generate branded GST estimates and dispatch instant PhonePe / Razorpay UPI payment links directly inside the chat window.',
      tags: ['GST Invoicing', 'UPI Payments', 'Pay Links'],
    },
  ];

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const card = carouselRef.current.querySelector('.uwoc-feature-card');
      const cardWidth = card ? card.offsetWidth : 380;
      const gap = 24;
      const scrollOffset = (cardWidth + gap) * (direction === 'left' ? -1 : 1);

      carouselRef.current.scrollBy({
        left: scrollOffset,
        behavior: 'smooth',
      });

      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section className="uwoc-section uwoc-features-section" id="features">
      {/* Subtle ambient background glow */}
      <div className="uwoc-features-ambient-glow" aria-hidden="true" />

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
            <span>Platform Capabilities</span>
          </div>

          <h2 className="uwoc-section-title">
            Enterprise Capabilities. <br />
            <span className="uwoc-highlight">Engineered For Scale.</span>
          </h2>

          <p className="uwoc-section-subtitle">
            Enterprise communication, AI intelligence, and workflow execution combined into one intuitive system.
          </p>
        </motion.div>

        {/* Single-Row Carousel with Left & Right Arrows */}
        <div className="uwoc-features-carousel-wrapper">
          {/* Left Arrow Button */}
          <button
            type="button"
            className={`uwoc-carousel-nav-btn prev-btn ${!canScrollLeft ? 'is-disabled' : ''}`}
            onClick={() => handleScroll('left')}
            aria-label="Previous Features"
            disabled={!canScrollLeft}
          >
            <ChevronLeft size={22} strokeWidth={2.4} />
          </button>

          {/* Single Row Horizontal Cards Track */}
          <div 
            className="uwoc-features-carousel-track"
            ref={carouselRef}
            onScroll={checkScroll}
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="uwoc-feature-card"
                >
                  {/* Top Row: Icon + Badge */}
                  <div className="uwoc-feat-card-top">
                    <div 
                      className="uwoc-feat-icon-box"
                      style={{ 
                        backgroundColor: feature.bgLight,
                        color: feature.accent 
                      }}
                    >
                      <Icon size={24} strokeWidth={2.2} />
                    </div>

                    <span 
                      className="uwoc-feat-badge"
                      style={{ 
                        color: feature.accent,
                        borderColor: `color-mix(in srgb, ${feature.accent} 25%, transparent)`,
                        backgroundColor: feature.bgLight 
                      }}
                    >
                      {feature.badge}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="uwoc-feat-card-body">
                    <h3 className="uwoc-feat-title">{feature.title}</h3>
                    <p className="uwoc-feat-desc">{feature.desc}</p>
                  </div>

                  {/* Tags Footer */}
                  <div className="uwoc-feat-tags-row">
                    {feature.tags.map((t) => (
                      <span key={t} className="uwoc-feat-tag-pill">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Corner accent glow line */}
                  <div 
                    className="uwoc-card-accent-line" 
                    style={{ background: feature.accent }}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            className={`uwoc-carousel-nav-btn next-btn ${!canScrollRight ? 'is-disabled' : ''}`}
            onClick={() => handleScroll('right')}
            aria-label="Next Features"
            disabled={!canScrollRight}
          >
            <ChevronRight size={22} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </section>
  );
}
