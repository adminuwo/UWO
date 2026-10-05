import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Globe, Sparkles, CheckCircle2, ArrowRight, Laptop, Smartphone, ExternalLink, Code } from 'lucide-react';
import { fadeInUp } from '../aieducation/motionVariants';

export default function WebsiteBuilderDemo() {
  const shouldReduceMotion = useReducedMotion();
  const [deviceMode, setDeviceMode] = useState('desktop');

  return (
    <section className="aiads-section" id="website-builder" style={{ background: '#f8fafc' }}>
      <div className="aiads-container">
        <div className="aiads-section-header">
          <span className="aiads-badge aiads-badge-coral">
            <Globe size={14} />
            Autonomous Landing Page Synthesis
          </span>
          <h2 className="aiads-section-title">
            From Marketing Brief to <br />
            <span className="aiads-gradient-title">High-Converting Landing Page.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Need a dedicated conversion page for your new product campaign? AI Ads synthesizes complete 
            responsive landing pages with integrated Brand DNA copy, ad imagery, and lead capture forms.
          </p>
        </div>

        {/* Browser Frame Preview */}
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ background: '#ffffff', border: '1px solid var(--aiads-border)', borderRadius: '18px', boxShadow: 'var(--aiads-shadow-lg)', overflow: 'hidden' }}>
            {/* Browser Chrome Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '3px 12px', fontSize: '0.72rem', color: '#475569', minWidth: '240px', justifyContent: 'center' }}>
                <Globe size={11} className="text-purple-600" />
                <span>https://aeropulse.io/campaign/autonomous-flight</span>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setDeviceMode('desktop')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: deviceMode === 'desktop' ? '#2563eb' : '#94a3b8' }}
                  title="Desktop View"
                >
                  <Laptop size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode('mobile')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: deviceMode === 'mobile' ? '#2563eb' : '#94a3b8' }}
                  title="Mobile View"
                >
                  <Smartphone size={14} />
                </button>
              </div>
            </div>

            {/* Inner Live Rendered Web Page Mockup */}
            <div style={{ 
              maxWidth: deviceMode === 'mobile' ? '380px' : '100%', 
              margin: '0 auto', 
              padding: '36px 32px', 
              background: 'radial-gradient(circle at 50% 0%, #faf5ff 0%, #ffffff 80%)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ textAlign: 'center', maxWidth: '580px', margin: '0 auto' }}>
                <span style={{ fontSize: '0.66rem', fontWeight: 800, padding: '3px 10px', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '9999px', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Next-Gen Urban Air Mobility
                </span>
                <h3 style={{ fontSize: deviceMode === 'mobile' ? '1.4rem' : '1.95rem', fontWeight: 900, color: '#0f172a', margin: '12px 0 10px 0', lineHeight: 1.2 }}>
                  Zero-Emission Regional Flights at the Tap of an App.
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.55, marginBottom: '20px' }}>
                  AeroPulse connects regional economic centers through autonomous vertiport routing, 
                  cutting 2-hour highway commutes to 14 minutes.
                </p>

                {/* Lead Capture Simulation */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
                  <input 
                    type="email" 
                    placeholder="Enter business email for early flight access"
                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', width: deviceMode === 'mobile' ? '100%' : '280px', outline: 'none' }}
                    readOnly
                    value="director.logistics@metropolis.com"
                  />
                  <button 
                    type="button"
                    style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <span>Request Pass</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 3-Column Feature Blocks in Mockup */}
                <div style={{ display: 'grid', gridTemplateColumns: deviceMode === 'mobile' ? '1fr' : 'repeat(3, 1fr)', gap: '12px', textAlign: 'left' }}>
                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#7c3aed', marginBottom: '2px' }}>14-Min Flight</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Point-to-point urban vertiports</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#2563eb', marginBottom: '2px' }}>Zero Carbon</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>100% Electric regional transport</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#10b981', marginBottom: '2px' }}>FAA Certified</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Triple-redundant avionics safety</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
