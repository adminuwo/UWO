import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Dna, Search, Compass, Calendar, FileText, 
  Palette, Layers, Globe, ArrowRight, CheckCircle2, LayoutDashboard, Zap
} from 'lucide-react';
import { AI_ADS_MODULES } from '../../constants/aiAdsConstants';

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
            Enterprise Marketing Engines, <span className="aiads-gradient-title">Unified.</span>
          </h2>
          <p className="aiads-section-subtitle">
            8 autonomous marketing specialists synchronized to central Brand DNA.
          </p>
        </div>

        {/* Module Selector Pill Navigation */}
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
                    fontWeight: isActive ? 700 : 500
                  }}
                >
                  <IconComp size={14} style={{ color: isActive ? mod.accent : 'var(--aiads-text-muted)' }} />
                  <span>{mod.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Module Visual Console (Non-Card Layout) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="aiads-module-console-stage"
            style={{ borderColor: `${activeModule.accent}30` }}
          >
            <div className="aiads-module-console-head">
              <div className="aiads-console-head-left">
                <div className="aiads-console-icon" style={{ background: `${activeModule.accent}15`, color: activeModule.accent }}>
                  <ActiveIcon size={18} />
                </div>
                <div>
                  <h3 className="aiads-console-title">{activeModule.name}</h3>
                  <span className="aiads-console-category">ENGINE 0{activeModule.num} · {activeModule.category.toUpperCase()}</span>
                </div>
              </div>
              <span className="aiads-badge" style={{ margin: 0, borderColor: `${activeModule.accent}40`, color: activeModule.accent, background: `${activeModule.accent}10` }}>
                {activeModule.tag}
              </span>
            </div>

            <div className="aiads-console-summary-bar">
              <Zap size={14} style={{ color: activeModule.accent, flexShrink: 0 }} />
              <span className="aiads-console-summary-text">{activeModule.summary}</span>
            </div>

            <div className="aiads-console-features-row">
              {activeModule.features.map((feat, i) => (
                <div key={i} className="aiads-console-feat-chip">
                  <CheckCircle2 size={13} style={{ color: activeModule.accent }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
