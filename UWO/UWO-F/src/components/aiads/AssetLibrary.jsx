import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, HardDrive, Download, ExternalLink, Tag, Check, Radio } from 'lucide-react';

const ASSET_BAYS = [
  { bay: 'BAY-01', name: 'Brand_Primary_Vector_Master.svg', type: 'Logo', size: '24 KB', target: 'Brand Core', status: 'SYNCHRONIZED', color: '#7c3aed' },
  { bay: 'BAY-02', name: 'Meta_Retargeting_Feed_1x1.png', type: 'Creative', size: '2.4 MB', target: 'Meta Ads Manager', status: 'ACTIVE CDN', color: '#2563eb' },
  { bay: 'BAY-03', name: 'Google_Display_Banner_16x9.webp', type: 'Banner', size: '840 KB', target: 'Google Ads API', status: 'ACTIVE CDN', color: '#06b6d4' },
  { bay: 'BAY-04', name: 'LinkedIn_Executive_Slide_Deck.pdf', type: 'Social', size: '3.1 MB', target: 'LinkedIn Organic', status: 'READY', color: '#10b981' },
  { bay: 'BAY-05', name: 'Story_Motion_Video_9x16.mp4', type: 'Video', size: '5.8 MB', target: 'Reels / Shorts CDN', status: 'STREAMING', color: '#ec4899' },
  { bay: 'BAY-06', name: 'Landing_Hero_HighRes_Render.png', type: 'Web Asset', size: '1.2 MB', target: 'Fastly Edge CDN', status: 'OPTIMIZED', color: '#f97316' }
];

export default function AssetLibrary() {
  const [filterType, setFilterType] = useState('All');
  const [copiedBay, setCopiedBay] = useState(null);

  const filteredBays = filterType === 'All' 
    ? ASSET_BAYS 
    : ASSET_BAYS.filter(b => b.type.toLowerCase().includes(filterType.toLowerCase()));

  const handleCopyEndpoint = (bayId) => {
    setCopiedBay(bayId);
    setTimeout(() => setCopiedBay(null), 1500);
  };

  return (
    <section className="aiads-section" id="asset-library" style={{ background: '#f8fafc', overflow: 'hidden' }}>
      <div className="aiads-container">
        {/* Minimal Header */}
        <div className="aiads-section-header" style={{ marginBottom: '32px' }}>
          <span className="aiads-badge aiads-badge-blue">
            <Database size={13} />
            Centralized Media Vault
          </span>
          <h2 className="aiads-section-title">
            Digital Asset <span className="aiads-gradient-title">Storage Bay.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Autonomous metadata indexing with low-latency CDN endpoints ready for campaign deployment.
          </p>
        </div>

        {/* NON-CARD OBJECT: Storage Rack Console */}
        <div className="aiads-storage-rack-object">
          {/* Rack Console Toolbar */}
          <div className="aiads-rack-toolbar">
            <div className="aiads-rack-status">
              <span className="aiads-rack-led"></span>
              <span className="aiads-rack-title">MEDIA DECK RACK · 6 SLOTS ONLINE</span>
            </div>

            <div className="aiads-rack-filters">
              {['All', 'Logo', 'Creative', 'Banner', 'Social', 'Video'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  className={`aiads-rack-filter-btn ${filterType === type ? 'active' : ''}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Integrated Bay Slots List (NO REPETITIVE BOXED CARDS) */}
          <div className="aiads-rack-bays">
            {filteredBays.map((item) => (
              <div key={item.bay} className="aiads-bay-slot">
                <div className="aiads-bay-index">
                  <span className="bay-id">{item.bay}</span>
                  <span className="bay-led" style={{ background: item.color }}></span>
                </div>

                <div className="aiads-bay-info">
                  <span className="bay-filename">{item.name}</span>
                  <div className="bay-meta">
                    <span className="bay-pill">{item.type}</span>
                    <span className="bay-size">{item.size}</span>
                    <span className="bay-target">➔ {item.target}</span>
                  </div>
                </div>

                <div className="aiads-bay-actions">
                  <span className="bay-status-badge">{item.status}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyEndpoint(item.bay)}
                    className="aiads-bay-copy-btn"
                  >
                    {copiedBay === item.bay ? (
                      <>
                        <Check size={12} style={{ color: '#10b981' }} />
                        <span>Ready</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink size={12} />
                        <span>Deploy CDN</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
