import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ConnectorsSection() {
  const tools = [
    {
      id: 'gmail',
      name: 'Gmail',
      iconSrc: '/images/uwoconnect/Gmail.png',
      className: 'orbit-gmail',
    },
    {
      id: 'slides',
      name: 'Google Slides',
      iconSrc: '/images/uwoconnect/Google Slides.png',
      className: 'orbit-slides',
    },
    {
      id: 'outlook',
      name: 'Outlook',
      svgType: 'outlook',
      className: 'orbit-outlook',
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      svgType: 'onedrive',
      className: 'orbit-onedrive',
    },
    {
      id: 'sheets',
      name: 'Google Sheets',
      iconSrc: '/images/uwoconnect/Google Sheet.png',
      className: 'orbit-sheets',
    },
    {
      id: 'docs',
      name: 'Google Docs',
      iconSrc: '/images/uwoconnect/Google Docs.png',
      className: 'orbit-docs',
    },
    {
      id: 'maps',
      name: 'Google Maps',
      iconSrc: '/images/uwoconnect/Google Maps.png',
      className: 'orbit-maps',
    },
    {
      id: 'news',
      name: 'Google News Feed',
      iconSrc: '/images/uwoconnect/Google News.png',
      className: 'orbit-news',
    },
  ];

  const highlights = [
    'Zero-code setup: 1-click authorization for Google & Microsoft suites.',
    'Bi-directional sync between spreadsheets, cloud storage, and CRM.',
    'Auto-dispatch lead data and updates directly into active team chats.',
  ];

  return (
    <section className="uwoc-section uwoc-connectors-section" id="connectors">
      <div className="uwoc-container">
        <div className="uwoc-connectors-grid">
          {/* Left Column: Dev Character with Orbital Tools */}
          <motion.div 
            className="uwoc-connectors-visual-col"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <div className="uwoc-connectors-stage">
              {/* Circular Orbital Radar Grid */}
              <div className="uwoc-orbit-radar" aria-hidden="true">
                <div className="uwoc-radar-ring ring-outer" />
                <div className="uwoc-radar-ring ring-inner" />
                <div className="uwoc-radar-spoke spoke-diag-1" />
                <div className="uwoc-radar-spoke spoke-diag-2" />
                <div className="uwoc-radar-core-glow" />
              </div>

              {/* Dev Character in Center */}
              <div className="uwoc-dev-center-wrapper">
                <img
                  src="/images/uwoconnect/Dev_transparent.png"
                  alt="Dev - UWO Connect Native Productivity Integrations Specialist"
                  className="uwoc-dev-img"
                  loading="lazy"
                />
              </div>

              {/* Orbiting Tool Pill Nodes */}
              {tools.map((tool) => (
                <motion.div
                  key={tool.id}
                  className={`uwoc-tool-pill ${tool.className}`}
                  whileHover={{ scale: 1.08, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="uwoc-tool-icon-wrap">
                    {tool.iconSrc ? (
                      <img
                        src={tool.iconSrc}
                        alt={tool.name}
                        className="uwoc-tool-img"
                      />
                    ) : tool.svgType === 'outlook' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect width="24" height="24" rx="4" fill="#0078D4"/>
                        <path d="M14 6H7C6.44772 6 6 6.44772 6 7V17C6 17.5523 6.44772 18 7 18H14M14 6L20 9.5V14.5L14 18M14 6V18" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04Z" fill="#0078D4"/>
                      </svg>
                    )}
                  </div>
                  <span className="uwoc-tool-name">{tool.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Title, Subtitle, Highlights & Action */}
          <motion.div 
            className="uwoc-connectors-text-col"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <div className="uwoc-eyebrow">
              <span className="uwoc-pill-dot" />
              <span>Dev • Native Integrations</span>
            </div>

            <h2 className="uwoc-connectors-title">
              Connect The Tools. <br />
              <span className="uwoc-highlight">You Already Use.</span>
            </h2>

            <p className="uwoc-connectors-desc">
              Dev seamlessly links your email, spreadsheets, cloud docs, maps, and news feeds directly into UWO Connect without writing a single line of code.
            </p>

            {/* Bullet Highlights */}
            <div className="uwoc-connectors-highlights">
              {highlights.map((h, i) => (
                <div key={i} className="uwoc-highlight-item">
                  <CheckCircle2 size={18} className="uwoc-highlight-icon" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href="https://uwoconnect.aisa24.com/connectors"
              target="_blank"
              rel="noopener noreferrer"
              className="uwoc-connectors-cta-btn"
            >
              <span>Explore Connectors</span>
              <ArrowRight size={17} strokeWidth={2.4} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
