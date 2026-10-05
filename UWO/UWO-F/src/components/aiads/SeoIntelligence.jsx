import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ArrowRight, CheckCircle2, TrendingUp, Sparkles, 
  Layers, BarChart2, FileText, Zap, ChevronRight 
} from 'lucide-react';
import { SEO_SIMULATION_DATA } from '../../constants/aiAdsConstants';
import { fadeInUp, staggerContainer } from '../aieducation/motionVariants';

export default function SeoIntelligence() {
  const [selectedClusterIndex, setSelectedClusterIndex] = useState(0);
  const activeCluster = SEO_SIMULATION_DATA.clusters[selectedClusterIndex];

  return (
    <section className="aiads-section" id="seo-intelligence">
      <div className="aiads-container">
        <div className="aiads-section-header">
          <span className="aiads-badge aiads-badge-blue">
            <Search size={14} />
            Organic Search Dominance
          </span>
          <h2 className="aiads-section-title">
            Semantic SEO Intelligence, <br />
            <span className="aiads-gradient-title">From Intent to Editorial Brief.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Never write aimless articles. AI Ads maps high-intent search volumes, identifies competitor 
            SERP coverage gaps, and produces data-backed content outlines optimized to rank.
          </p>
        </div>

        {/* Interactive SEO Visual Pipeline */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'center' }}>
          {/* LEFT: Keyword Clusters & Intent Mapping */}
          <div style={{ background: '#ffffff', border: '1px solid var(--aiads-border)', borderRadius: '20px', padding: '24px', boxShadow: 'var(--aiads-shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--aiads-text-subtle)', fontFamily: 'var(--aiads-font-mono)' }}>PRIMARY TARGET QUERY</span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--aiads-text-main)', margin: '2px 0 0 0' }}>
                  "{SEO_SIMULATION_DATA.primaryKeyword}"
                </h4>
              </div>
              <span className="aiads-badge aiads-badge-blue" style={{ margin: 0, padding: '2px 8px', fontSize: '0.64rem' }}>
                {SEO_SIMULATION_DATA.searchIntent}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <div style={{ flex: 1, background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.66rem', color: 'var(--aiads-text-muted)' }}>Search Volume</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb', fontFamily: 'var(--aiads-font-mono)' }}>
                  {SEO_SIMULATION_DATA.volume}
                </div>
              </div>
              <div style={{ flex: 1, background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.66rem', color: 'var(--aiads-text-muted)' }}>Ranking Difficulty</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--aiads-font-mono)' }}>
                  {SEO_SIMULATION_DATA.difficulty}
                </div>
              </div>
            </div>

            {/* Keyword Clusters Selector */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--aiads-text-muted)', fontWeight: 700, marginBottom: '8px' }}>
                SEMANTIC CLUSTER VARIATIONS:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {SEO_SIMULATION_DATA.clusters.map((cluster, idx) => {
                  const isSelected = selectedClusterIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedClusterIndex(idx)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: `1px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                        background: isSelected ? 'rgba(37, 99, 235, 0.08)' : '#f8fafc',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isSelected ? '#1e40af' : '#1e293b' }}>
                          {cluster.keyword}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--aiads-text-muted)' }}>
                          Intent: {cluster.intent} · Est. CPC: {cluster.cpc}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isSelected ? '#2563eb' : 'var(--aiads-text-subtle)', fontFamily: 'var(--aiads-font-mono)' }}>
                        {cluster.volume}/mo
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', fontSize: '0.74rem', color: '#991b1b', lineHeight: 1.45 }}>
              <strong>SERP Content Gap:</strong> {SEO_SIMULATION_DATA.contentGap}
            </div>
          </div>

          {/* RIGHT: Automated AI Content Brief Generation */}
          <div style={{ background: '#ffffff', border: '1px solid var(--aiads-border)', borderRadius: '20px', padding: '24px', boxShadow: 'var(--aiads-shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--aiads-border-light)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} className="text-blue-600" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--aiads-text-main)', fontFamily: 'var(--aiads-font-mono)' }}>
                  AUTOMATED AI CONTENT BRIEF
                </span>
              </div>
              <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700, background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                SERP Optimized
              </span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--aiads-text-muted)', fontWeight: 600 }}>RECOMMENDED H1 TITLE:</div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--aiads-text-main)', margin: '4px 0 6px 0', lineHeight: 1.35 }}>
                {SEO_SIMULATION_DATA.aiBrief.targetTitle}
              </h4>
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.68rem', color: 'var(--aiads-text-muted)' }}>
                <span>Target Length: <strong>{SEO_SIMULATION_DATA.aiBrief.wordCount}</strong></span>
                <span>•</span>
                <span>Keyword Density: <strong>1.8%</strong></span>
              </div>
            </div>

            {/* Generated H2 Outlines */}
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--aiads-text-muted)', fontWeight: 600, marginBottom: '8px' }}>
                STRUCTURED EDITORIAL HEADINGS:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {SEO_SIMULATION_DATA.aiBrief.h2Outlines.map((h2, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.76rem', color: '#334155' }}>
                    <span style={{ color: '#2563eb', fontWeight: 800, fontSize: '0.7rem', fontFamily: 'var(--aiads-font-mono)' }}>H2.{idx + 1}</span>
                    <span style={{ fontWeight: 600 }}>{h2}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <a
                href="https://aiads.aisa24.com"
                target="_blank"
                rel="noopener noreferrer"
                className="aiads-btn-primary"
                style={{ padding: '7px 16px', fontSize: '0.78rem' }}
              >
                <span>Write Full Article with Brief</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
