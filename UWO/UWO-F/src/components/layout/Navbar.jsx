import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Navbar({ onOpenEarnRefer, onToggleDrawer }) {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  // Close dropdown on route change
  React.useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleOptionClick = () => {
    setDropdownOpen(false);
  };

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
          <div 
            className={`projects-dropdown ${dropdownOpen ? 'is-open' : ''}`}
            ref={dropdownRef}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <span 
              className="projects-link"
              onClick={() => setDropdownOpen((prev) => !prev)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setDropdownOpen((prev) => !prev); } }}
            >
              Our Projects &#9662;
            </span>
            <div className={`projects-menu ${dropdownOpen ? 'open' : ''}`}>
              <Link to="/aisa" onClick={handleOptionClick}>AISA<sup>™</sup></Link>
              <a href="https://aimall24.com/" onClick={handleOptionClick}>AI Mall<sup>™</sup></a>
              <Link to="/ai-legal" onClick={handleOptionClick}>AI LEGAL<sup>™</sup></Link>
              <Link to="/projects/uwo-connect" onClick={handleOptionClick}>UWO Connect<sup>™</sup></Link>
              <Link to="/ai-ads" onClick={handleOptionClick}>AI ADS<sup>™</sup></Link>
              <Link to="/ai-education" onClick={handleOptionClick}>AI-Education<sup>™</sup></Link>
              <Link to="/efv" onClick={handleOptionClick}>EFV<sup>™</sup></Link>
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
