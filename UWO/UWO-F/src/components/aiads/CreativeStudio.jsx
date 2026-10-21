import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Maximize2, Sparkles, Sliders, Check, ArrowRight } from 'lucide-react';
import { CREATIVE_VARIATIONS } from '../../constants/aiAdsConstants';

const RATIO_SPECS = {
  '1:1': { label: 'Square (Feed)', res: '1080 × 1080 px', width: 440, height: 440 },
  '16:9': { label: 'Cinema (Display)', res: '1920 × 1080 px', width: 620, height: 350 },
  '9:16': { label: 'Vertical (Stories & Reels)', res: '1080 × 1920 px', width: 320, height: 500 }
};

export default function CreativeStudio() {
  const [activeRatio, setActiveRatio] = useState('1:1');
  const [activePaletteIdx, setActivePaletteIdx] = useState(0);

  const activeCreative = CREATIVE_VARIATIONS.find(c => c.ratio === activeRatio) || CREATIVE_VARIATIONS[0];
  const spec = RATIO_SPECS[activeRatio];

  return (
    <section className="aiads-section" id="creative-studio" style={{ background: '#ffffff', overflow: 'hidden' }}>
      <div className="aiads-container">
        {/* Minimal Header */}
        <div className="aiads-section-header" style={{ marginBottom: '32px' }}>
          <span className="aiads-badge aiads-badge-emerald">
            <Palette size={13} />
            Autonomous Ad Visual Synthesis
          </span>
          <h2 className="aiads-section-title">
            Dynamic Ad Canvas, <span className="aiads-gradient-title">Every Commercial Ratio.</span>
          </h2>
          <p className="aiads-section-subtitle">
            One creative intent synthesized into pixel-perfect ratios with enforced typography and brand color rules.
          </p>
        </div>

        {/* NON-CARD OBJECT: Interactive Studio Canvas Stage */}
        <div className="aiads-studio-stage">
          {/* Top Control Bar: Ratio Selector & Canvas Specs */}
          <div className="aiads-studio-toolbar">
            <div className="aiads-ratio-pills">
              {Object.keys(RATIO_SPECS).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setActiveRatio(r)}
                  className={`aiads-ratio-btn ${activeRatio === r ? 'active' : ''}`}
                >
                  <span className="ratio-badge">{r}</span>
                  <span className="ratio-title">{RATIO_SPECS[r].label}</span>
                </button>
              ))}
            </div>

            <div className="aiads-canvas-specs">
              <span className="spec-dot"></span>
              <span className="spec-text">{spec.res} · 300 DPI · Brand Guard Active</span>
            </div>
          </div>

          {/* Dynamic Interactive Viewport Canvas */}
          <div className="aiads-viewport-container">
            <motion.div 
              className="aiads-viewport-canvas"
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{
                maxWidth: `${spec.width}px`,
                minHeight: `${spec.height}px`,
                background: activeCreative.gradient
              }}
            >
              {/* Studio Grid Overlay / Alignment Lines */}
              <div className="aiads-canvas-crosshairs">
                <div className="crosshair ch-tl"></div>
                <div className="crosshair ch-tr"></div>
                <div className="crosshair ch-bl"></div>
                <div className="crosshair ch-br"></div>
              </div>

              {/* Top Banner Bar */}
              <div className="aiads-canvas-meta">
                <span className="aiads-canvas-pill">{spec.label}</span>
                <span className="aiads-canvas-tag">{activeCreative.tag}</span>
              </div>

              {/* Main Visual Headline */}
              <div className="aiads-canvas-body">
                <span className="aiads-canvas-kicker">UWO™ AI ADS ENGINE</span>
                <h3 className="aiads-canvas-heading">{activeCreative.title}</h3>
                <p className="aiads-canvas-sub">{activeCreative.subtitle}</p>
              </div>

              {/* Bottom Canvas CTA Pill */}
              <div className="aiads-canvas-footer">
                <span className="aiads-canvas-cta">
                  <span>Explore Workflow</span>
                  <ArrowRight size={12} />
                </span>
                <span className="aiads-canvas-verified">
                  <Check size={11} /> 100% Brand Safe
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
