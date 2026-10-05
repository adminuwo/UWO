import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Dna, Search, Compass, Calendar, FileText, 
  Palette, Layers, Globe, ArrowRight, CheckCircle2, LayoutDashboard, Zap
} from 'lucide-react';
import { AI_ADS_MODULES } from '../../constants/aiAdsConstants';
import { fadeInUp } from '../aieducation/motionVariants';

const MODULE_ICONS = {
  'brand-dna': Dna,
  'seo-intel': Search,
  'strategy-hub': Compass,
  'content-calendar': Calendar,
  'content-studio': FileText,
  'creative-studio': Palette,
  'asset-library': Layers,
  'website-builder': Globe
};

export default function ModuleShowcase() {
  const shouldReduceMotion = useReducedMotion();
  const [activeModuleId, setActiveModuleId] = useState('brand-dna');
  const activeModule = AI_ADS_MODULES.find(m => m.id === activeModuleId) || AI_ADS_MODULES[0];
  const ActiveIcon = MODULE_ICONS[activeModule.id] || Dna;

  return (
    <section className="aiads-section" id="modules" style={{ background: '#ffffff' }}>
      <div className="aiads-container">
        <div className="aiads-section-header">
          <span className="aiads-badge aiads-badge-emerald">
            <LayoutDashboard size={14} />
            Modular Functional Architecture
          </span>
          <h2 className="aiads-section-title">
            Enterprise Marketing Engines, <br />
            <span className="aiads-gradient-title">Unified in One OS.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Explore the 8 verified core modules powering AI Ads™. Each module functions as an autonomous 
            specialist while maintaining continuous synchronization through the central Brand DNA repository.
          </p>
        </div>

        {/* Module Selector Pill Navigation - Single Horizon Row */}
        <div className="aiads-module-pills-bar-wrapper">
          <div className="aiads-module-pills-bar">
            {AI_ADS_MODULES.map((mod) => {
              const IconComp = MODULE_ICONS[mod.id] || Dna;
              const isActive = activeModuleId === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setActiveModuleId(mod.id)}
                  className={`aiads-module-pill-btn ${isActive ? 'active' : ''}`}
                  style={{
                    borderColor: isActive ? mod.accent : 'var(--aiads-border)',
                    background: isActive ? `${mod.accent}12` : '#ffffff',
                    color: isActive ? mod.accent : 'var(--aiads-text-main)',
                    fontWeight: isActive ? 700 : 500,
                    boxShadow: isActive ? `0 4px 14px ${mod.accent}20` : 'none'
                  }}
                >
                  <IconComp size={14} style={{ color: isActive ? mod.accent : 'var(--aiads-text-muted)' }} />
                  <span>{mod.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Module Detailed Showcase Frame */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3 }}
            style={{
              background: '#f8fafc',
              border: `1px solid ${activeModule.accent}30`,
              borderRadius: '24px',
              padding: '32px',
              boxShadow: 'var(--aiads-shadow-md)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              alignItems: 'center'
            }}
          >
            {/* Left: Module Details & Functional Capabilities */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: activeModule.accent, fontFamily: 'var(--aiads-font-mono)', background: `${activeModule.accent}15`, padding: '3px 10px', borderRadius: '9999px' }}>
                  MODULE {activeModule.num} · {activeModule.category.toUpperCase()}
                </span>
                <span className="aiads-badge" style={{ margin: 0, padding: '2px 8px', fontSize: '0.66rem' }}>
                  {activeModule.tag}
                </span>
              </div>

              <h3 style={{ fontSize: '1.65rem', fontWeight: 850, color: 'var(--aiads-text-main)', marginBottom: '8px' }}>
                {activeModule.name}
              </h3>

              <p style={{ fontSize: '0.92rem', color: 'var(--aiads-text-muted)', lineHeight: 1.6, marginBottom: '16px', fontWeight: 500 }}>
                {activeModule.summary}
              </p>

              <p style={{ fontSize: '0.82rem', color: 'var(--aiads-text-subtle)', lineHeight: 1.5, marginBottom: '20px' }}>
                {activeModule.details}
              </p>

              {/* Feature Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                {activeModule.features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: 'var(--aiads-text-main)' }}>
                    <CheckCircle2 size={16} style={{ color: activeModule.accent, flexShrink: 0 }} />
                    <span style={{ fontWeight: 600 }}>{feat}</span>
                  </div>
                ))}
              </div>

              <a
                href="https://aiads.aisa24.com"
                target="_blank"
                rel="noopener noreferrer"
                className="aiads-btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.82rem' }}
              >
                <span>Launch {activeModule.name}</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Right: Simulated Real Module Workflow Window */}
            <div style={{ background: '#ffffff', border: '1px solid var(--aiads-border)', borderRadius: '16px', padding: '20px', boxShadow: 'var(--aiads-shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--aiads-border-light)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${activeModule.accent}15`, color: activeModule.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ActiveIcon size={15} />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--aiads-text-main)', fontFamily: 'var(--aiads-font-mono)' }}>
                    LIVE PREVIEW: {activeModule.name.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: activeModule.accent, boxShadow: `0 0 6px ${activeModule.accent}` }}></span>
                  <span style={{ fontSize: '0.66rem', color: 'var(--aiads-text-muted)', fontFamily: 'var(--aiads-font-mono)' }}>Verified Engine</span>
                </div>
              </div>

              {/* Module-Specific Interactive UI Frame */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px solid var(--aiads-border)' }}>
                {activeModule.id === 'brand-dna' && (
                  <div style={{ fontSize: '0.76rem', color: 'var(--aiads-text-main)', lineHeight: 1.5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700 }}>Brand Voice Guardrail:</span>
                      <span style={{ color: activeModule.accent, fontWeight: 700 }}>Active (Strict)</span>
                    </div>
                    <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '8px', fontFamily: 'var(--aiads-font-mono)', fontSize: '0.7rem' }}>
                      {"{ tone: 'Visionary', persona: 'Enterprise Buyer', prohibitedTerms: ['cheap', 'basic'] }"}
                    </div>
                    <div style={{ color: 'var(--aiads-text-muted)', fontSize: '0.72rem' }}>
                      ✓ Applied to 12 planned campaigns and 48 editorial drafts.
                    </div>
                  </div>
                )}

                {activeModule.id === 'seo-intel' && (
                  <div style={{ fontSize: '0.76rem' }}>
                    <div style={{ fontWeight: 700, marginBottom: '6px' }}>Top Search Intent Cluster:</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '6px' }}>
                      <span>"autonomous marketing operating system"</span>
                      <span style={{ color: '#2563eb', fontWeight: 700 }}>Vol: 18.4K · Commercial</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>
                      ✓ Content Brief Synthesized with 4 H2 Outlines ready.
                    </div>
                  </div>
                )}

                {activeModule.id === 'strategy-hub' && (
                  <div style={{ fontSize: '0.76rem' }}>
                    <div style={{ fontWeight: 700, marginBottom: '6px' }}>Current Sprint Allocation:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center' }}>
                      <div style={{ background: '#ffffff', padding: '8px 4px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.66rem', color: 'var(--aiads-text-muted)' }}>TOFU (Awareness)</div>
                        <div style={{ fontWeight: 800, color: '#f97316' }}>40%</div>
                      </div>
                      <div style={{ background: '#ffffff', padding: '8px 4px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.66rem', color: 'var(--aiads-text-muted)' }}>MOFU (Evaluation)</div>
                        <div style={{ fontWeight: 800, color: '#2563eb' }}>35%</div>
                      </div>
                      <div style={{ background: '#ffffff', padding: '8px 4px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.66rem', color: 'var(--aiads-text-muted)' }}>BOFU (Conversion)</div>
                        <div style={{ fontWeight: 800, color: '#10b981' }}>25%</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeModule.id === 'content-calendar' && (
                  <div style={{ fontSize: '0.76rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 700 }}>
                      <span>Weekly Schedule: Oct 12 – 18</span>
                      <span style={{ color: '#ec4899' }}>6 Drops Planned</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <span>Mon · LinkedIn Carousel</span>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>Approved</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <span>Wed · Technical SEO Article</span>
                        <span style={{ color: '#2563eb', fontWeight: 700 }}>Review</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <span>Fri · Multi-Ratio Ad Banner Set</span>
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>Draft</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeModule.id === 'content-studio' && (
                  <div style={{ fontSize: '0.76rem' }}>
                    <div style={{ fontWeight: 700, marginBottom: '6px', color: '#06b6d4' }}>Active Draft: Executive LinkedIn Post</div>
                    <p style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '0 0 6px 0', fontSize: '0.74rem', color: '#334155', fontStyle: 'italic' }}>
                      "Most enterprise AI marketing tools fail because they generate content without a persistent brand memory..."
                    </p>
                    <div style={{ fontSize: '0.68rem', color: 'var(--aiads-text-muted)' }}>
                      Tone Match: 98% · Est. Read Time: 45s · Word Count: 142
                    </div>
                  </div>
                )}

                {activeModule.id === 'creative-studio' && (
                  <div style={{ fontSize: '0.76rem' }}>
                    <div style={{ fontWeight: 700, marginBottom: '8px' }}>Batch Multi-Ratio Synthesis:</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ width: '45px', height: '45px', borderRadius: '6px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 700 }}>
                        1:1
                      </div>
                      <div style={{ width: '70px', height: '45px', borderRadius: '6px', background: 'linear-gradient(135deg, #06b6d4, #10b981)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 700 }}>
                        16:9
                      </div>
                      <div style={{ width: '30px', height: '45px', borderRadius: '6px', background: 'linear-gradient(135deg, #ec4899, #f97316)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 700 }}>
                        9:16
                      </div>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '8px', fontWeight: 600 }}>
                      ✓ Generated in 8K resolution with verified brand hex tokens.
                    </div>
                  </div>
                )}

                {activeModule.id === 'asset-library' && (
                  <div style={{ fontSize: '0.76rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 700 }}>
                      <span>Asset Vault: 124 Assets</span>
                      <span style={{ color: '#8b5cf6' }}>CDN Synchronized</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '3px 8px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.68rem' }}>Logos (6)</span>
                      <span style={{ padding: '3px 8px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.68rem' }}>Banners (48)</span>
                      <span style={{ padding: '3px 8px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.68rem' }}>Vectors (32)</span>
                    </div>
                  </div>
                )}

                {activeModule.id === 'website-builder' && (
                  <div style={{ fontSize: '0.76rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 700 }}>
                      <span>Landing Page: /campaign-aero</span>
                      <span style={{ color: '#f59e0b' }}>Live Preview Ready</span>
                    </div>
                    <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: 800, color: 'var(--aiads-text-main)', fontSize: '0.78rem' }}>AeroPulse Mobility</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--aiads-text-muted)' }}>Responsive Hero + 3 Feature Blocks + Lead Capture Form</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
