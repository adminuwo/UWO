import React from 'react';
import { motion } from 'framer-motion';
import { BUSINESS_CONNECTORS } from '../../constants/uwoConnectConstants';
import { fadeUp, staggerContainer, EASE_PREMIUM } from './motionVariants';

export default function BusinessConnectors() {
  const steps = [
    {
      icon: 'fa-cloud',
      type: 'external',
      title: 'External Tool',
      desc: 'Sheets, Gmail, Outlook, Drive',
    },
    {
      icon: 'fa-network-wired',
      type: 'core',
      title: 'UWO Connect™',
      desc: 'Bi-directional Webhook Dispatch',
      isCenter: true,
    },
    {
      icon: 'fa-wand-magic-sparkles',
      type: 'auto',
      title: 'Intelligent Automation',
      desc: 'Conditional Workflow Logic',
    },
    {
      icon: 'fa-circle-check',
      type: 'action',
      title: 'Business Action',
      desc: 'Quote, Invoice, CRM Lead',
    },
  ];

  return (
    <section className="uwoc-section" id="connectors">
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
            <i className="fa-solid fa-plug-circle-bolt"></i>
            <span>NATIVE PRODUCTIVITY CONNECTORS</span>
          </div>

          <h2 className="uwoc-section-title">
            Your Business Tools. <span className="uwoc-gradient-gold">Connected.</span>
          </h2>

          <p className="uwoc-section-subtitle">
            Zero complex coding required. UWO Connect links directly with Google Workspace and Microsoft 365, turning everyday apps into an integrated enterprise automation engine.
          </p>
        </motion.div>

        {/* Animated Connector Flow Pipeline with Traveling Data Packet (identical to AI Legal Pipeline) */}
        <motion.div
          className="uwoc-connector-pipeline-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {/* Global Pipeline Traveling Pulse Beam */}
          <motion.div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '36px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#0B8F78',
              boxShadow: '0 0 16px 4px rgba(11, 143, 120, 0.75)',
              zIndex: 3,
              pointerEvents: 'none',
            }}
            animate={{
              left: ['8%', '36%', '64%', '92%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <motion.div 
                className={`uwoc-pipe-step ${step.isCenter ? 'center-core' : ''}`}
                whileHover={{ y: -4, transition: { duration: 0.25, ease: EASE_PREMIUM } }}
              >
                <div className={`uwoc-pipe-icon ${step.type}`}>
                  <i className={`fa-solid ${step.icon}`}></i>
                </div>
                <span className="uwoc-pipe-title">{step.title}</span>
                <span className="uwoc-pipe-desc">{step.desc}</span>
              </motion.div>

              {idx < steps.length - 1 && (
                <div className="uwoc-pipe-arrow">
                  <i className="fa-solid fa-arrow-right"></i>
                  <span className="pulse-line" />
                </div>
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* 8 Connector Cards Grid with Staggered Fade Up Entrance */}
        <motion.div
          className="uwoc-connectors-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.02 }}
          variants={staggerContainer(0.08, 0.05)}
        >
          {BUSINESS_CONNECTORS.map((connector, idx) => (
            <motion.div
              key={connector.name || idx}
              className="uwoc-connector-card"
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.32, ease: EASE_PREMIUM } }}
            >
              <div className="uwoc-connector-top">
                <div 
                  className="uwoc-connector-icon-wrap"
                  style={{ backgroundColor: `${connector.color}08`, borderColor: `${connector.color}25` }}
                >
                  {connector.imageSrc ? (
                    <img 
                      src={connector.imageSrc} 
                      alt={`${connector.name} logo`} 
                      className="uwoc-conn-brand-img"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : connector.isMicrosoft ? (
                    <svg width="24" height="24" viewBox="0 0 23 23" className="uwoc-conn-brand-img" aria-label="Microsoft">
                      <path fill="#f35325" d="M1 1h10v10H1z"/>
                      <path fill="#81bc06" d="M12 1h10v10H12z"/>
                      <path fill="#05a6f0" d="M12 12h10v10H12z"/>
                      <path fill="#ffba08" d="M1 12h10v10H1z"/>
                    </svg>
                  ) : (
                    <i className={connector.icon} style={{ color: connector.color }}></i>
                  )}
                </div>

                <span className="uwoc-connector-badge">
                  <span className="pulse-dot-green" />
                  <span>{connector.status || 'Active Sync'}</span>
                </span>
              </div>

              <div className="uwoc-connector-body">
                <div className="uwoc-connector-title-row">
                  <h3>{connector.name}</h3>
                  <span className="uwoc-connector-cat-pill">{connector.badge}</span>
                </div>
                <p>{connector.purpose || connector.desc}</p>
              </div>

              <div className="uwoc-connector-footer">
                <span className="uwoc-connector-trigger-tag">
                  <i className="fa-solid fa-bolt text-emerald"></i>
                  <span>{connector.trigger || 'Auto Trigger'}</span>
                </span>

                <span className="uwoc-connector-auth-badge">
                  <i className="fa-solid fa-circle-check text-emerald"></i>
                  <span>Native OAuth</span>
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
