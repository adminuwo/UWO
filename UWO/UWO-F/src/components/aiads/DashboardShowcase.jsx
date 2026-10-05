import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  LayoutDashboard, Dna, Search, Compass, Calendar, 
  FileText, Palette, Layers, Globe, Sparkles, TrendingUp, ArrowUpRight, CheckCircle2, Zap 
} from 'lucide-react';
import { CountUpNumber } from '../aieducation/motionVariants';

export default function DashboardShowcase() {
  const shouldReduceMotion = useReducedMotion();
  const [activeQuickAction, setActiveQuickAction] = useState(null);

  return (
    <section className="aiads-section" id="dashboard-showcase" style={{ background: '#f8fafc' }}>
      <div className="aiads-container">
        <div className="aiads-section-header">
          <span className="aiads-badge aiads-badge-purple">
            <LayoutDashboard size={14} />
            Authentic Product Interface
          </span>
          <h2 className="aiads-section-title">
            The AI Ads™ Command Center, <br />
            <span className="aiads-gradient-title">Designed for Marketing Velocity.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Inspect the actual workspace interface used by growth teams worldwide. Clean, information-dense, 
            and organized around daily creative execution.
          </p>
        </div>

        {/* Dashboard Frame Recreation */}
        <div style={{ maxWidth: '1040px', margin: '0 auto', background: '#ffffff', border: '1px solid var(--aiads-border)', borderRadius: '24px', boxShadow: 'var(--aiads-shadow-lg)', overflow: 'hidden' }}>
          {/* Top Window Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--aiads-font-mono)' }}>
              https://aiads.aisa24.com/dashboard
            </div>
            <span style={{ fontSize: '0.66rem', color: '#10b981', fontWeight: 700, background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
              ● Live Studio Connected
            </span>
          </div>

          <div style={{ padding: '28px' }}>
            {/* Top Greeting & Quick Action Pills */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 850, color: 'var(--aiads-text-main)', margin: '0 0 4px 0' }}>
                  Welcome to AI Ads™ Studio ✨
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--aiads-text-muted)' }}>
                  Workspace: <strong>AeroPulse Global</strong> · 10 Active Modules Ready
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['+ New Ad Creative', '+ Generate Article', '+ 30-Day Plan'].map((act, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveQuickAction(act)}
                    style={{
                      padding: '7px 14px',
                      background: activeQuickAction === act ? 'var(--aiads-purple)' : '#f8fafc',
                      color: activeQuickAction === act ? '#ffffff' : 'var(--aiads-text-main)',
                      border: `1px solid ${activeQuickAction === act ? 'var(--aiads-purple)' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Metric Cards Strip with CountUp */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '14px', padding: '16px' }}>
                <div style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 700 }}>SYNTHESIZED CREATIVES</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#6b21a8', margin: '4px 0', fontFamily: 'var(--aiads-font-mono)' }}>
                  <CountUpNumber end={148} duration={1.2} suffix=" Assets" />
                </div>
                <div style={{ fontSize: '0.68rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <TrendingUp size={11} /> +32 this week (1:1, 16:9, 9:16)
                </div>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '16px' }}>
                <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 700 }}>SEO SEARCH VISIBILITY</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1e40af', margin: '4px 0', fontFamily: 'var(--aiads-font-mono)' }}>
                  <CountUpNumber end={92.4} decimals={1} duration={1.2} suffix="%" />
                </div>
                <div style={{ fontSize: '0.68rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <TrendingUp size={11} /> +18.2% Organic SERP uplift
                </div>
              </div>

              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '14px', padding: '16px' }}>
                <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>BRAND CONSISTENCY SCORE</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#065f46', margin: '4px 0', fontFamily: 'var(--aiads-font-mono)' }}>
                  <CountUpNumber end={99.8} decimals={1} duration={1.4} suffix="%" />
                </div>
                <div style={{ fontSize: '0.68rem', color: '#047857' }}>
                  ✓ 100% Brand DNA alignment enforced
                </div>
              </div>
            </div>

            {/* Active Content Pipeline Stream */}
            <div style={{ background: '#f8fafc', border: '1px solid var(--aiads-border)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--aiads-text-main)' }}>
                  ACTIVE EDITORIAL &amp; CAMPAIGN QUEUE
                </span>
                <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600 }}>View Full Calendar →</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#dbeafe', color: '#1e40af', fontSize: '0.66rem', fontWeight: 700 }}>LinkedIn</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--aiads-text-main)' }}>Autonomous Flight Economics Carousel</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>Ready for Approval</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#fce7f3', color: '#9d174d', fontSize: '0.66rem', fontWeight: 700 }}>Instagram</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--aiads-text-main)' }}>9:16 Vertiport Acoustic Motion Story</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 700 }}>Rendering 8K Visuals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
