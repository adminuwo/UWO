import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Navbar({ onOpenEarnRefer, onToggleDrawer }) {
  const location = useLocation();
  const isBlogsPage = location.pathname.startsWith('/blogs') || location.pathname.startsWith('/blog-single');
  const isUwoConnect = location.pathname.startsWith('/projects/uwo-connect') || location.pathname.startsWith('/uwo-connect');
  const isAiEducation = location.pathname.startsWith('/ai-education') || location.pathname.startsWith('/projects/ai-education');
  const isAiAds = location.pathname.startsWith('/ai-ads') || location.pathname.startsWith('/projects/ai-ads');
  const isAiLegal = location.pathname.startsWith('/ai-legal');

  // Any page with a white/light surface requires dark typography, zero blur text-shadow, and the dark logo
  const isLightPage = isUwoConnect || isBlogsPage || isAiLegal || isAiAds;
  const logoSrc = isLightPage ? '/images/uwo-logo.png' : '/images/uwo-logo-light.png';

  const navbarClassNames = [
    'navbar',
    isLightPage ? 'navbar-light' : 'navbar-dark',
    isBlogsPage ? 'navbar-blogs' : '',
    isUwoConnect ? 'navbar-uwo-connect' : '',
    isAiEducation ? 'navbar-ai-education' : '',
    isAiAds ? 'navbar-ai-ads' : '',
    isAiLegal ? 'navbar-ai-legal' : ''
  ].filter(Boolean).join(' ');

  return (
    <header className={navbarClassNames}>
      <div className="nav-container">
        {/* LOGO */}
        <Link to="/" className="nav-logo" title="UWO Home">
          <img 
            src={logoSrc} 
            alt="UWO™ Logo" 
            onError={(e) => { e.currentTarget.src = '/images/uwo-logo.png'; }} 
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
            About UWO<sup>™</sup>
          </NavLink>

          {/* OUR PROJECTS DROPDOWN */}
          <div className="projects-dropdown">
            <span className="projects-link">Our Projects &#9662;</span>
            <div className="projects-menu">
              <Link to="/aisa">AISA<sup>™</sup></Link>
              <a href="https://aimall24.com/" target="_blank" rel="noopener noreferrer">AI Mall<sup>™</sup></a>
              <a href="/ai-legal" target="_blank" rel="noopener noreferrer">AI LEGAL<sup>™</sup></a>
              <a href="/projects/uwo-connect" target="_blank" rel="noopener noreferrer">UWO Connect<sup>™</sup></a>
              <Link to="/ai-ads">AI ADS<sup>™</sup></Link>
              <Link to="/ai-education">AI-Education<sup>™</sup></Link>
              <Link to="/efv">EFV<sup>™</sup></Link>
            </div>
          </div>

          <NavLink to="/our-team" className={({ isActive }) => isActive ? 'active' : ''}>
            Our Team
          </NavLink>
          <NavLink to="/blogs" className={({ isActive }) => isActive ? 'active' : ''}>
            Blogs
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
            Contact
          </NavLink>

          {/* EARN & REFER BUTTON */}
          <button 
            type="button" 
            id="earnReferNavbarBtn" 
            className="earn-refer-btn" 
            onClick={onOpenEarnRefer}
            title="Earn & Refer"
          >
            <i className="fa-solid fa-gift"></i>
            <span>Earn &amp; Refer</span>
          </button>
        </nav>

        {/* MOBILE HAMBURGER */}
        <div className="hamburger" onClick={onToggleDrawer} aria-label="Toggle navigation drawer">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </header>
  );
}
