import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Search, Filter, Image, FileText, Download, ExternalLink, Tag } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../aieducation/motionVariants';

const SAMPLE_ASSETS = [
  { id: 1, name: 'Brand_Primary_Logo_Vector.svg', type: 'Logo', size: '24 KB', tag: 'Brand Identity', color: '#7c3aed' },
  { id: 2, name: 'Meta_Retargeting_Feed_1x1.png', type: 'Banner', size: '2.4 MB', tag: 'Ad Creative', color: '#2563eb' },
  { id: 3, name: 'Google_Display_Banner_16x9.webp', type: 'Banner', size: '840 KB', tag: 'Web Display', color: '#06b6d4' },
  { id: 4, name: 'LinkedIn_Executive_Carousel_Slide.pdf', type: 'Social', size: '3.1 MB', tag: 'Thought Leadership', color: '#10b981' },
  { id: 5, name: 'Instagram_Story_Motion_9x16.mp4', type: 'Video', size: '5.8 MB', tag: 'Stories & Reels', color: '#ec4899' },
  { id: 6, name: 'Landing_Page_Hero_Illustration.png', type: 'Vector', size: '1.2 MB', tag: 'Web Asset', color: '#f97316' }
];

export default function AssetLibrary() {
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = SAMPLE_ASSETS.filter(item => {
    const matchesFilter = filterType === 'All' || item.type === filterType;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section className="aiads-section" id="asset-library" style={{ background: '#ffffff' }}>
      <div className="aiads-container">
        <div className="aiads-section-header">
          <span className="aiads-badge aiads-badge-blue">
            <Layers size={14} />
            Centralized Media Repository
          </span>
          <h2 className="aiads-section-title">
            Digital Asset Vault, <br />
            <span className="aiads-gradient-title">Indexed for Instant Deployment.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Every logo, ad graphic, copy snippet, and video banner is automatically indexed with semantic 
            metadata tags. Secure CDN endpoints allow 1-click export directly to ad managers.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ maxWidth: '840px', margin: '0 auto 28px auto', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid var(--aiads-border)', borderRadius: '10px', padding: '8px 14px', flex: '1 1 240px' }}>
            <Search size={14} style={{ color: 'var(--aiads-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search assets by name or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.8rem', color: 'var(--aiads-text-main)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['All', 'Logo', 'Banner', 'Social', 'Video'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: `1px solid ${filterType === type ? '#2563eb' : '#e2e8f0'}`,
                  background: filterType === type ? 'rgba(37, 99, 235, 0.08)' : '#f8fafc',
                  color: filterType === type ? '#2563eb' : 'var(--aiads-text-muted)'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Asset Cards Grid - Exactly 3 per Row */}
        <div className="aiads-assets-grid">
          {filtered.map((asset) => (
            <motion.div
              key={asset.id}
              className="aiads-card"
              whileHover={{ y: -3 }}
              style={{
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#ffffff',
                border: '1px solid var(--aiads-border)',
                borderRadius: '14px',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${asset.color}15`, color: asset.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Image size={18} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--aiads-text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {asset.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--aiads-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{asset.type}</span>
                    <span>•</span>
                    <span>{asset.size}</span>
                  </div>
                </div>
              </div>

              <span style={{ fontSize: '0.66rem', padding: '3px 9px', borderRadius: '6px', background: `${asset.color}12`, color: asset.color, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                {asset.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
