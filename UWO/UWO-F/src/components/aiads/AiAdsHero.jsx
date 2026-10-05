import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Sparkles, ArrowRight, ExternalLink, Dna, Search, 
  Compass, FileText, Palette, Globe, Layers, BarChart3, Zap, CheckCircle2 
} from 'lucide-react';
import { AI_ADS_META, AI_ADS_TELEMETRY } from '../../constants/aiAdsConstants';
import { fadeInUp, staggerContainer, CountUpNumber } from '../aieducation/motionVariants';

const ORBIT_CARDS = [
  { id: 'dna', label: 'Brand DNA Engine', icon: Dna, color: '#7c3aed', top: '8%', left: '15%', delay: 0 },
  { id: 'seo', label: 'SEO Intelligence', icon: Search, color: '#2563eb', top: '12%', right: '12%', delay: 0.2 },
  { id: 'strategy', label: '30-Day Strategy', icon: Compass, color: '#f97316', bottom: '28%', left: '8%', delay: 0.4 },
  { id: 'content', label: 'Editorial Studio', icon: FileText, color: '#06b6d4', bottom: '10%', left: '38%', delay: 0.6 },
  { id: 'creative', label: 'Creative Studio', icon: Palette, color: '#10b981', bottom: '26%', right: '10%', delay: 0.8 },
  { id: 'website', label: 'AI Web Builder', icon: Globe, color: '#f59e0b', top: '50%', right: '4%', delay: 1.0 }
];

export default function AiAdsHero({ onExploreClick }) {
  const shouldReduceMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsFinePointer(window.matchMedia('(pointer: fine)').matches);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!isFinePointer || shouldReduceMotion) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 2,
      y: (clientY / innerHeight - 0.5) * 2
    });
  };

  return (
    <section 
      className="aiads-hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
    >
      <div className="aiads-container">
        <div className="aiads-hero-content">
          {/* LEFT: Headline & Value Proposition */}
          <motion.div 
            className="aiads-hero-text"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <span className="aiads-badge">
                <Sparkles size={14} className="text-purple-600" />
                AI ADS™ · AUTONOMOUS MARKETING OPERATING SYSTEM
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp}>
              AI-Powered Marketing <br />
              <span className="aiads-gradient-title">Operating System.</span>
            </motion.h1>

            <motion.p className="aiads-hero-desc" variants={fadeInUp}>
              From brand intelligence to strategy, content, creative and websites — 
              one unified, intelligent marketing workspace built for high-growth enterprises.
            </motion.p>

            <motion.div className="aiads-hero-actions" variants={fadeInUp}>
              <a 
                href={AI_ADS_META.productUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="aiads-btn-primary"
              >
                <span>Visit AI Ads Platform</span>
                <ExternalLink size={16} />
              </a>
            </motion.div>

            {/* Telemetry Strip with CountUp */}
            <motion.div className="aiads-hero-stats" variants={fadeInUp}>
              {AI_ADS_TELEMETRY.map((stat, idx) => (
                <div key={idx} className="aiads-stat-item">
                  <span className="aiads-stat-val">
                    <CountUpNumber end={stat.value} duration={1.3} suffix={stat.suffix.split(' ')[0]} />
                  </span>
                  <span className="aiads-stat-lbl">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT: Marketing Command Center Composition */}
          <motion.div 
            className="aiads-hero-visual-col"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="aiads-command-center">
              {/* Background Animated SVG Connector Lines */}
              <svg 
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}
              >
                <defs>
                  <linearGradient id="orbitLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#2563eb" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {/* Concentric ambient orbital rings */}
                <circle cx="50%" cy="50%" r="120" fill="none" stroke="rgba(124, 58, 237, 0.12)" strokeWidth="1" strokeDasharray="4 6" />
                <circle cx="50%" cy="50%" r="185" fill="none" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="1" strokeDasharray="6 8" />

                {/* Animated connecting beams */}
                {!shouldReduceMotion && (
                  <>
                    <motion.circle
                      r="3"
                      fill="#7c3aed"
                      animate={{
                        cx: ['50%', '25%'],
                        cy: ['50%', '20%'],
                        opacity: [0, 0.8, 0]
                      }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.circle
                      r="3"
                      fill="#2563eb"
                      animate={{
                        cx: ['50%', '82%'],
                        cy: ['50%', '22%'],
                        opacity: [0, 0.85, 0]
                      }}
                      transition={{ duration: 5, delay: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  </>
                )}
              </svg>

              {/* Central Core Engine Node */}
              <motion.div 
                className="aiads-core-engine-node"
                animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img 
                  src="/images/aiads-logo.png" 
                  alt="AI Ads Logo" 
                  style={{ width: '42px', height: '42px', objectFit: 'contain', marginBottom: '4px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div style={{ fontSize: '0.86rem', fontWeight: 900, letterSpacing: '-0.01em' }}>
                  AI ADS<sup>™</sup>
                </div>
                <div style={{ fontSize: '0.62rem', opacity: 0.9, fontFamily: 'var(--aiads-font-mono)' }}>
                  Core Engine
                </div>
              </motion.div>

              {/* Orbiting Satellite Cards with Independent Motion & Parallax */}
              {ORBIT_CARDS.map((card) => {
                const CardIcon = card.icon;
                const parallaxX = isFinePointer && !shouldReduceMotion ? mousePos.x * 6 : 0;
                const parallaxY = isFinePointer && !shouldReduceMotion ? mousePos.y * 6 : 0;

                return (
                  <motion.div
                    key={card.id}
                    className="aiads-orbit-card"
                    style={{
                      top: card.top,
                      bottom: card.bottom,
                      left: card.left,
                      right: card.right,
                      borderColor: `${card.color}35`
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: parallaxX,
                      y: parallaxY
                    }}
                    transition={{ duration: 0.5, delay: card.delay }}
                    whileHover={{ scale: 1.06, borderColor: card.color, boxShadow: `0 8px 24px ${card.color}30` }}
                  >
                    <div style={{ 
                      width: '26px', 
                      height: '26px', 
                      borderRadius: '8px', 
                      background: `${card.color}15`, 
                      color: card.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CardIcon size={14} />
                    </div>
                    <span>{card.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
