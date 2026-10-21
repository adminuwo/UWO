import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MobileDrawer({ isOpen, onClose, onOpenEarnRefer }) {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const location = useLocation();

  // Prevent background scrolling when mobile drawer is open (crucial for iOS Safari / Chrome)
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
  };

  const handleEarnReferClick = () => {
    onClose();
    onOpenEarnRefer();
  };

  return (
    <>
      {/* OVERLAY */}
      <div 
        className={`drawer-overlay ${isOpen ? 'active' : ''}`} 
        id="drawerOverlay" 
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* DRAWER */}
      <div 
        id="mobileDrawer" 
        className={`mobile-drawer ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
      >
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-logo">
            <img src="/images/uwo-logo.png" alt="UWO Logo" onError={(e) => { e.currentTarget.src = '/images/logo..webp'; }} />
            <span>UWO™</span>
          </div>
          <button type="button" className="mobile-drawer-close" onClick={onClose} aria-label="Close navigation">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="mobile-drawer-body">
          <Link to="/" onClick={handleLinkClick}>Home</Link>
          <Link to="/about" onClick={handleLinkClick}>About UWO<sup>™</sup></Link>

          {/* PROJECTS ACCORDION */}
          <div 
            className={`mobile-projects-toggle ${projectsOpen ? 'active' : ''}`}
            onClick={() => setProjectsOpen(!projectsOpen)}
            role="button"
            tabIndex={0}
            aria-expanded={projectsOpen}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setProjectsOpen(!projectsOpen); } }}
          >
            <span>Our Projects</span>
            <i className={`fa-solid fa-chevron-${projectsOpen ? 'up' : 'down'}`}></i>
          </div>

          <div className={`mobile-projects ${projectsOpen ? 'open' : ''}`}>
            <Link to="/aisa" onClick={handleLinkClick}>AISA<sup>™</sup></Link>
            <a href="https://aimall24.com/" onClick={handleLinkClick}>AI Mall<sup>™</sup></a>
            <Link to="/ai-legal" onClick={handleLinkClick}>AI LEGAL<sup>™</sup></Link>
            <Link to="/ai-education" onClick={handleLinkClick}>AI Education Ecosystem<sup>™</sup></Link>
            <Link to="/projects/uwo-connect" onClick={handleLinkClick}>UWO Connect<sup>™</sup></Link>
            <Link to="/efv" onClick={handleLinkClick}>EFV<sup>™</sup></Link>
          </div>

          <Link to="/our-team" onClick={handleLinkClick}>Our Team</Link>
          <Link to="/blogs" onClick={handleLinkClick}>Blogs</Link>
          <Link to="/contact" onClick={handleLinkClick}>Contact</Link>

          <a 
            href="#earn-refer" 
            onClick={(e) => { e.preventDefault(); handleEarnReferClick(); }} 
            className="mobile-earn-refer-link"
          >
            <i className="fa-solid fa-gift"></i>
            <span>Earn &amp; Refer</span>
          </a>
        </div>
      </div>
    </>
  );
}
