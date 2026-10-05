import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  FileText, Copy, Check, ExternalLink, Globe, 
  ThumbsUp, MessageSquare, Repeat2, Send, 
  Heart, Bookmark, MoreHorizontal, Share2, 
  ShieldCheck, ArrowRight, Sparkles 
} from 'lucide-react';
import { CONTENT_STUDIO_PREVIEWS } from '../../constants/aiAdsConstants';

const PLATFORM_LIST = [
  { id: 'linkedin', label: 'LinkedIn', iconClass: 'fa-brands fa-linkedin-in', color: '#0077b5' },
  { id: 'instagram', label: 'Instagram', iconClass: 'fa-brands fa-instagram', color: '#e1306c' },
  { id: 'x', label: 'X (Twitter)', iconClass: 'fa-brands fa-x-twitter', color: '#000000' },
  { id: 'email', label: 'Email Newsletter', iconClass: 'fa-solid fa-envelope', color: '#7c3aed' }
];

export default function ContentStudio() {
  const shouldReduceMotion = useReducedMotion();
  const [activePlatform, setActivePlatform] = useState('linkedin');
  const [copied, setCopied] = useState(false);
  const activeContent = CONTENT_STUDIO_PREVIEWS[activePlatform];

  const handleCopy = () => {
    navigator.clipboard?.writeText(`${activeContent.headline}\n\n${activeContent.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="aiads-section" id="content-studio" style={{ background: '#ffffff' }}>
      <div className="aiads-container">
        <div className="aiads-section-header">
          <span className="aiads-badge aiads-badge-pink">
            <FileText size={14} />
            Multi-Channel Editorial Studio
          </span>
          <h2 className="aiads-section-title">
            One Idea. Every Channel, <br />
            <span className="aiads-gradient-title">Flawlessly Native.</span>
          </h2>
          <p className="aiads-section-subtitle">
            Repurposing content shouldn't mean copy-pasting the exact same generic text. 
            AI Ads automatically rewrites and formats your core message into native formats for every platform.
          </p>
        </div>

        {/* Platform Selector Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {PLATFORM_LIST.map((plat) => {
            const isActive = activePlatform === plat.id;
            return (
              <button
                key={plat.id}
                type="button"
                onClick={() => setActivePlatform(plat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '9999px',
                  border: `1px solid ${isActive ? plat.color : 'var(--aiads-border)'}`,
                  background: isActive ? `${plat.color}10` : '#ffffff',
                  color: isActive ? plat.color : 'var(--aiads-text-main)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: isActive ? `0 4px 14px ${plat.color}20` : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className={plat.iconClass} style={{ fontSize: '0.9rem' }}></i>
                <span>{plat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Content Studio Native Post Experience Frame */}
        <div style={{ maxWidth: activePlatform === 'instagram' ? '540px' : activePlatform === 'x' ? '640px' : '780px', margin: '0 auto', transition: 'max-width 0.3s ease' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePlatform}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {/* ========================================================
                  1. LINKEDIN NATIVE POST PREVIEW
                  ======================================================== */}
              {activePlatform === 'linkedin' && (
                <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                  {/* LinkedIn Top Header */}
                  <div style={{ padding: '16px 20px 12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(10,102,194,0.3)', flexShrink: 0 }}>
                        AJ
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#191919' }}>Alex Jenkins</span>
                          <span style={{ fontSize: '0.72rem', color: '#666666' }}>• 1st</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#575757', lineHeight: 1.3 }}>
                          Chief Marketing Officer @ HyperScale | Scaling Brand DNA with AI Ads™
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#8c8c8c', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <span>2h • Edited •</span>
                          <Globe size={11} style={{ color: '#666666' }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'transparent',
                          border: 'none',
                          color: '#0a66c2',
                          fontWeight: 700,
                          fontSize: '0.86rem',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span> Follow
                      </button>
                      <button
                        type="button"
                        onClick={handleCopy}
                        title="Copy Content"
                        style={{
                          background: '#f3f4f6',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: copied ? '#10b981' : '#374151'
                        }}
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* LinkedIn Post Text Body */}
                  <div style={{ padding: '0 20px 16px 20px' }}>
                    <p style={{ fontSize: '0.92rem', color: '#191919', fontWeight: 700, lineHeight: 1.5, marginBottom: '12px' }}>
                      Most enterprise AI marketing tools fail because they generate content without a memory.
                    </p>
                    <p style={{ fontSize: '0.88rem', color: '#262626', lineHeight: 1.6, marginBottom: '12px' }}>
                      They treat every single prompt like a blank slate. One day your brand sounds like a tech startup; the next, like an academic textbook.
                    </p>
                    <p style={{ fontSize: '0.88rem', color: '#262626', lineHeight: 1.6, marginBottom: '14px' }}>
                      AI Ads™ solves this at the architecture level. By anchoring every post, campaign, and ad creative to a centralized Brand DNA Engine, your voice, audience personas, and USPs remain 100% consistent.
                    </p>
                    <p style={{ fontSize: '0.88rem', color: '#262626', lineHeight: 1.6, marginBottom: '14px' }}>
                      Here are 3 ways autonomous marketing operating systems are replacing disconnected SaaS stacks ⬇️
                    </p>
                    <div style={{ fontSize: '0.82rem', color: '#0a66c2', fontWeight: 600, display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      <span>#AIMarketing</span>
                      <span>#EnterpriseGrowth</span>
                      <span>#BrandStrategy</span>
                      <span>#CMO</span>
                      <span>#Automation</span>
                    </div>

                    {/* LinkedIn Embedded Rich Media Attachment */}
                    <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc' }}>
                      <div style={{ height: '90px', background: 'linear-gradient(135deg, #0a66c2 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', padding: '16px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.9 }}>AI ADS™ STRATEGY BRIEF</div>
                          <div style={{ fontSize: '0.96rem', fontWeight: 800 }}>The Compounding Autonomous Marketing Loop</div>
                        </div>
                      </div>
                      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' }}>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: '#666666', textTransform: 'uppercase' }}>uwo.ai · 4 min read</div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#191919' }}>Read the complete strategy breakdown →</div>
                        </div>
                        <ExternalLink size={14} style={{ color: '#0a66c2' }} />
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn Social Reactions Count Bar */}
                  <div style={{ padding: '8px 20px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#666666' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#0a66c2', color: '#fff', fontSize: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>👍</span>
                        <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#057642', color: '#fff', fontSize: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-4px' }}>💡</span>
                        <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#df704d', color: '#fff', fontSize: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-4px' }}>❤️</span>
                      </span>
                      <span style={{ fontWeight: 600, marginLeft: '4px' }}>1,842</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span>236 comments</span>
                      <span>•</span>
                      <span>84 reposts</span>
                    </div>
                  </div>

                  {/* LinkedIn Interaction Actions Footer */}
                  <div style={{ padding: '4px 14px', borderTop: '1px solid #f0f0f0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                    <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 0', background: 'transparent', border: 'none', color: '#5e5e5e', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', borderRadius: '4px' }}>
                      <ThumbsUp size={16} />
                      <span>Like</span>
                    </button>
                    <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 0', background: 'transparent', border: 'none', color: '#5e5e5e', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', borderRadius: '4px' }}>
                      <MessageSquare size={16} />
                      <span>Comment</span>
                    </button>
                    <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 0', background: 'transparent', border: 'none', color: '#5e5e5e', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', borderRadius: '4px' }}>
                      <Repeat2 size={16} />
                      <span>Repost</span>
                    </button>
                    <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 0', background: 'transparent', border: 'none', color: '#5e5e5e', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', borderRadius: '4px' }}>
                      <Send size={16} />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================
                  2. INSTAGRAM NATIVE FEED POST PREVIEW
                  ======================================================== */}
              {activePlatform === 'instagram' && (
                <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #dbdbdb', boxShadow: '0 2px 14px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                  {/* Instagram Top Header */}
                  <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #efefef' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Story Gradient Ring */}
                      <div style={{ padding: '2px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
                        <div style={{ padding: '2px', background: '#ffffff', borderRadius: '50%' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800 }}>
                            AI
                          </div>
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#262626' }}>aiads.studio</span>
                          <span style={{ color: '#0095f6', fontSize: '10px' }}>●</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0095f6', cursor: 'pointer' }}>Follow</span>
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#8e8e8e' }}>Sponsored • Brand DNA Scoped</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={handleCopy}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: copied ? '#10b981' : '#374151'
                        }}
                      >
                        {copied ? <Check size={11} /> : <Copy size={11} />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                      <MoreHorizontal size={18} style={{ color: '#262626', cursor: 'pointer' }} />
                    </div>
                  </div>

                  {/* Instagram Visual Creative Preview */}
                  <div style={{ 
                    width: '100%', 
                    aspectRatio: '1 / 1', 
                    maxHeight: '340px',
                    background: 'linear-gradient(135deg, #18181b 0%, #2e1065 50%, #4c0519 100%)', 
                    position: 'relative', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    padding: '24px',
                    color: '#ffffff'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                        ✨ AUTONOMOUS MARKETING STUDIO
                      </span>
                      <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>1/4</span>
                    </div>

                    <div style={{ textAlign: 'center', maxWidth: '360px', margin: '0 auto' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, lineHeight: 1.25, marginBottom: '8px', color: '#ffffff' }}>
                        From Raw Idea to Commercial Ad in 60s.
                      </h3>
                      <p style={{ fontSize: '0.78rem', opacity: 0.85, lineHeight: 1.4 }}>
                        Stop juggling 7 different design tools and copywriting apps. Anchor everything to verified Brand DNA.
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }}></span>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }}></span>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }}></span>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }}></span>
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ec4899', background: '#ffffff', padding: '4px 10px', borderRadius: '6px' }}>
                        Try AI Ads™
                      </span>
                    </div>
                  </div>

                  {/* Instagram Action Icons Row */}
                  <div style={{ padding: '10px 16px 6px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <Heart size={22} style={{ color: '#ed4956', fill: '#ed4956', cursor: 'pointer' }} />
                      <MessageSquare size={21} style={{ color: '#262626', cursor: 'pointer' }} />
                      <Send size={20} style={{ color: '#262626', cursor: 'pointer' }} />
                    </div>
                    <Bookmark size={21} style={{ color: '#262626', cursor: 'pointer' }} />
                  </div>

                  {/* Instagram Likes & Caption */}
                  <div style={{ padding: '0 16px 14px 16px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#262626', marginBottom: '6px' }}>
                      4,289 likes
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#262626', lineHeight: 1.5, marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, marginRight: '6px' }}>aiads.studio</span>
                      Stop juggling 7 different design tools and copywriting apps. With AI Ads™:
                      <br /><br />
                      1️⃣ Ingest Brand DNA<br />
                      2️⃣ Generate 1:1, 16:9 &amp; 9:16 visual creatives<br />
                      3️⃣ Write platform-optimized captions<br />
                      4️⃣ Export directly to your campaign manager
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#00376b', display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                      <span>#CreativeAutomation</span>
                      <span>#AdCreatives</span>
                      <span>#GrowthMarketing</span>
                      <span>#BrandDesign</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#8e8e8e', cursor: 'pointer', marginBottom: '4px' }}>
                      View all 142 comments
                    </div>
                    <div style={{ fontSize: '0.64rem', color: '#8e8e8e', letterSpacing: '0.04em' }}>
                      2 HOURS AGO
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  3. X (TWITTER) NATIVE TWEET PREVIEW
                  ======================================================== */}
              {activePlatform === 'x' && (
                <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #eff3f4', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '20px 24px' }}>
                  {/* Tweet Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem', flexShrink: 0 }}>
                        𝕏
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f1419' }}>AI Ads™ Official</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', borderRadius: '50%', background: '#1d9bf0', color: '#ffffff', fontSize: '9px', fontWeight: 900 }}>✓</span>
                          <span style={{ fontSize: '0.82rem', color: '#536471' }}>@aiads_os · 3h</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#536471' }}>
                          Autonomous Marketing OS · Built by UWO™
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={handleCopy}
                        style={{
                          background: '#f7f9f9',
                          border: '1px solid #cfd9de',
                          borderRadius: '9999px',
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: copied ? '#10b981' : '#0f1419'
                        }}
                      >
                        {copied ? <Check size={11} /> : <Copy size={11} />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                      <MoreHorizontal size={17} style={{ color: '#536471', cursor: 'pointer' }} />
                    </div>
                  </div>

                  {/* Tweet Content */}
                  <div style={{ fontSize: '0.92rem', color: '#0f1419', lineHeight: 1.55, marginBottom: '14px' }}>
                    <p style={{ marginBottom: '10px' }}>
                      Traditional marketing workflow is broken:
                    </p>
                    <div style={{ paddingLeft: '12px', borderLeft: '2px solid #cfd9de', marginBottom: '12px', color: '#536471', fontSize: '0.86rem' }}>
                      <div>• Copywriter writes in Google Docs</div>
                      <div>• Designer builds in Figma</div>
                      <div>• SEO lead optimizes in Ahrefs</div>
                      <div>• Media buyer exports to Meta</div>
                    </div>
                    <p style={{ fontWeight: 700, marginBottom: '8px' }}>
                      Zero alignment. Days lost.
                    </p>
                    <p style={{ marginBottom: '10px' }}>
                      AI Ads™ replaces the fragmented 8-tool stack with one unified operating system: Strategy ➔ SEO ➔ Copy ➔ 8K Creatives ➔ Landing Pages in minutes 🧵
                    </p>
                    <div style={{ color: '#1d9bf0', display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.84rem' }}>
                      <span>#MarketingAI</span>
                      <span>#SaaS</span>
                      <span>#BuildInPublic</span>
                    </div>
                  </div>

                  {/* Tweet Timestamp & Analytics Bar */}
                  <div style={{ padding: '10px 0', borderTop: '1px solid #eff3f4', borderBottom: '1px solid #eff3f4', fontSize: '0.76rem', color: '#536471', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span>2:45 PM · Oct 2, 2026 · </span>
                      <span style={{ fontWeight: 800, color: '#0f1419' }}>148.5K</span> Views
                    </div>
                  </div>

                  {/* Tweet Actions (Reply, Repost, Like, Bookmark, Share) */}
                  <div style={{ padding: '10px 4px 2px 4px', display: 'flex', justifyContent: 'space-between', color: '#536471', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <MessageSquare size={16} />
                      <span>128</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <Repeat2 size={16} />
                      <span>432</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <Heart size={16} style={{ color: '#f91880' }} />
                      <span>2.4K</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <Bookmark size={16} />
                      <span>895</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <Share2 size={16} />
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  4. EMAIL NEWSLETTER INBOX CLIENT PREVIEW
                  ======================================================== */}
              {activePlatform === 'email' && (
                <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                  {/* macOS Window Title Bar */}
                  <div style={{ background: '#f8fafc', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }}></span>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }}></span>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }}></span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: '12px', fontFamily: 'var(--aiads-font-mono)' }}>
                        Mail › Inbox › AI Ads Strategic Dispatch
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopy}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: copied ? '#10b981' : '#374151'
                      }}
                    >
                      {copied ? <Check size={11} /> : <Copy size={11} />}
                      <span>{copied ? 'Copied' : 'Copy HTML'}</span>
                    </button>
                  </div>

                  {/* Email Client Header Metadata */}
                  <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        Issue #42: How AeroPulse unlocked 3.4x ad ROAS with zero agency overhead
                      </h3>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>9:00 AM (2h ago)</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#475569', lineHeight: 1.6 }}>
                      <div><strong>From:</strong> AI Ads Strategic Dispatch &lt;newsletter@uwo.ai&gt;</div>
                      <div><strong>To:</strong> Marketing Leadership Group (14,200 subscribers)</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.68rem', marginTop: '2px' }}>
                        <ShieldCheck size={12} />
                        <span>Verified TLS · Authenticated Brand DNA Pipeline</span>
                      </div>
                    </div>
                  </div>

                  {/* Email Body Newsletter Template */}
                  <div style={{ padding: '24px 28px', maxWidth: '640px', margin: '0 auto' }}>
                    {/* Editorial Issue Header Tag */}
                    <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px dashed #e2e8f0' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', color: '#7c3aed', textTransform: 'uppercase' }}>
                        AI ADS™ WEEKLY EXECUTIVE BRIEF · ISSUE #42
                      </span>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>October 2026 · Curated by AI Ads Strategic Intelligence</div>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, marginBottom: '14px' }}>
                      Hi Sarah,
                    </p>
                    <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, marginBottom: '14px' }}>
                      When we audited our Q3 campaigns, one glaring problem stood out: our ad creative copy didn’t match our landing page messaging.
                    </p>

                    {/* Highlight Blockquote */}
                    <div style={{ background: '#f5f3ff', borderLeft: '4px solid #7c3aed', padding: '12px 16px', borderRadius: '0 8px 8px 0', margin: '16px 0', fontSize: '0.84rem', color: '#4c1d95', fontStyle: 'italic', lineHeight: 1.5 }}>
                      "By unifying our editorial and creative pipeline through AI Ads™, every headline, visual banner, and email nurture sequence now draws from the exact same Brand DNA repository."
                    </div>

                    <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, marginBottom: '20px' }}>
                      Here is the exact 4-step framework we used to scale conversions:
                    </p>

                    {/* Newsletter CTA Button */}
                    <div style={{ textAlign: 'center', margin: '24px 0' }}>
                      <a
                        href="#modules"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: '#7c3aed',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          padding: '11px 24px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)'
                        }}
                      >
                        <span>Access the 30-Day Marketing Roadmap</span>
                        <ArrowRight size={15} />
                      </a>
                    </div>

                    {/* Email Telemetry Stats Badge */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-around', textAlign: 'center', margin: '20px 0' }}>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>44.8%</div>
                        <div style={{ fontSize: '0.66rem', color: '#64748b' }}>Open Rate</div>
                      </div>
                      <div style={{ borderLeft: '1px solid #e2e8f0' }}></div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>6.2%</div>
                        <div style={{ fontSize: '0.66rem', color: '#64748b' }}>CTR</div>
                      </div>
                      <div style={{ borderLeft: '1px solid #e2e8f0' }}></div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>3.4x</div>
                        <div style={{ fontSize: '0.66rem', color: '#64748b' }}>ROAS Lift</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{ textAlign: 'center', fontSize: '0.68rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '16px' }}>
                      <div>You received this because you are an AI Ads™ Enterprise Member.</div>
                      <div style={{ marginTop: '4px' }}>
                        <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Unsubscribe</span> · 
                        <span style={{ textDecoration: 'underline', cursor: 'pointer', margin: '0 4px' }}>Preferences</span> · 
                        <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>View in Browser</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
