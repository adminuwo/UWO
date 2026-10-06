import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ onOpenLegal, onOpenEarnRefer }) {
  const currentYear = new Date().getFullYear();

  const handleOpenEarn = () => {
    if (onOpenEarnRefer) {
      onOpenEarnRefer();
    } else if (typeof window.openEarnReferModal === 'function') {
      window.openEarnReferModal();
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* TOP MULTI-COLUMN GRID (SPREAD ACROSS FULL WIDTH) */}
        <div className="footer-grid">
          
          {/* COLUMN 1 (LEFT): BRAND IDENTITY & REGISTRATION */}
          <div className="footer-col footer-col-brand">
            <Link to="/" className="footer-brand-logo" title="UWO Home">
              <img 
                src="/images/uwo-logo-light.png" 
                alt="UWO™ Logo" 
                onError={(e) => { e.currentTarget.src = '/images/uwo-logo.png'; }} 
              />
            </Link>
            <p className="footer-tagline">
              Building intelligent digital platforms, enterprise intelligence frameworks, and next-generation scalable ecosystems.
            </p>
            
            <div className="footer-duns-wrapper">
              <img src="/images/duns-logo.png" alt="D-U-N-S® Registered™" className="footer-duns-seal" />
              <div className="footer-duns-info">
                <span className="duns-title">D-U-N-S&reg; Registered&trade;</span>
                <span className="duns-sub">Verified Enterprise</span>
              </div>
            </div>

            <div className="footer-direct-contact">
              <a href="mailto:admin@uwo24.com" className="footer-contact-link" title="Email UWO">
                <i className="fa-solid fa-envelope"></i>
                <span>admin@uwo24.com</span>
              </a>
              <a href="https://wa.me/918358990909" target="_blank" rel="noopener noreferrer" className="footer-contact-link" title="WhatsApp UWO">
                <i className="fa-brands fa-whatsapp"></i>
                <span>+91 8358990909</span>
              </a>
            </div>
          </div>

          {/* COLUMN 2 (CENTER): FLAGSHIP PLATFORMS & CLOUD PARTNERS */}
          <div className="footer-col footer-col-platforms">
            <h3 className="footer-section-title">Flagship Platforms</h3>
            <div className="footer-platforms-list">
              <Link to="/projects/uwo-connect" className="platform-tag">UWO Connect<sup>&trade;</sup></Link>
              <Link to="/ai-ads" className="platform-tag">AI ADS<sup>&trade;</sup></Link>
              <a href="/ai-legal" target="_blank" rel="noopener noreferrer" className="platform-tag">AI LEGAL<sup>&trade;</sup></a>
              <Link to="/aisa" className="platform-tag">AISA<sup>&trade;</sup></Link>
              <a href="https://aimall24.com/" target="_blank" rel="noopener noreferrer" className="platform-tag">AI Mall<sup>&trade;</sup></a>
              <Link to="/ai-education" className="platform-tag">AI Education<sup>&trade;</sup></Link>
              <Link to="/efv" className="platform-tag">EFV<sup>&trade;</sup></Link>
            </div>

            <div className="footer-partners-block">
              <h4 className="footer-partners-title">Supported By Global Startup &amp; Cloud Programs</h4>
              <div className="partner-logos-row">
                <div className="logo-item" title="Microsoft Azure"><img src="/images/azure.png" alt="Azure" /></div>
                <div className="logo-item" title="Amazon Web Services"><img src="/images/AWS.png" alt="AWS" /></div>
                <div className="logo-item" title="MongoDB"><img src="/images/mongodb.png" alt="MongoDB" /></div>
                <div className="logo-item" title="Notion"><img src="/images/notion copy.png" alt="Notion" /></div>
                <div className="logo-item" title="Google Cloud"><img src="/images/google_cloud_.webp" alt="Google Cloud" /></div>
                <div className="logo-item" title="DigitalOcean"><img src="/images/DigitalOcean.png" alt="DigitalOcean" /></div>
                <div className="logo-item" title="Tavily AI"><img src="/images/tavily.webp" alt="Tavily" /></div>
              </div>
            </div>
          </div>

          {/* COLUMN 3 (RIGHT): QUICK NAV, EARN & REFER, SOCIAL CHANNELS */}
          <div className="footer-col footer-col-links">
            <h3 className="footer-section-title">Explore &amp; Connect</h3>
            <nav className="footer-quick-nav">
              <Link to="/">Home</Link>
              <Link to="/about">About UWO</Link>
              <Link to="/our-team">Our Team</Link>
              <Link to="/blogs">Blogs</Link>
              <Link to="/contact">Contact</Link>
            </nav>

            <div className="footer-earn-box">
              <button type="button" className="footer-earn-btn" onClick={handleOpenEarn}>
                <i className="fa-solid fa-gift"></i>
                <span>Earn &amp; Refer Program</span>
              </button>
            </div>

            <h4 className="footer-social-title">Follow Our Community</h4>
            <div className="social-links">
              <a href="mailto:admin@uwo24.com" className="social-icon-wrapper" title="Email Us">
                <img src="/images/Gmail_Logo_512px-removebg-preview.png" alt="Email" />
              </a>
              <a href="https://wa.me/918358990909" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper" title="WhatsApp">
                <img src="/images/whatsapp.svg" alt="WhatsApp" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper" title="Facebook">
                <img src="/images/facebook..webp" alt="Facebook" />
              </a>
              <a href="https://www.instagram.com/uwo_business/" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper" title="Instagram">
                <img src="/images/instagram-logo-transparent-background-2..webp" alt="Instagram" />
              </a>
              <a href="https://www.linkedin.com/company/uwo-business/" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper" title="LinkedIn">
                <img src="/images/linkedin..webp" alt="LinkedIn" />
              </a>
              <a href="https://x.com/uwo_business" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper" title="Twitter">
                <img src="/images/twitter..webp" alt="Twitter" />
              </a>
              <a href="https://in.pinterest.com/UWO_Business/" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper" title="Pinterest">
                <i className="fa-brands fa-pinterest" style={{ color: '#E60023' }}></i>
              </a>
              <a href="https://www.reddit.com/user/AcanthisittaFront692/" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper" title="Reddit">
                <i className="fa-brands fa-reddit" style={{ color: '#FF4500' }}></i>
              </a>
              <a href="https://www.quora.com/profile/UWO-Business" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper" title="Quora">
                <i className="fa-brands fa-quora" style={{ color: '#B92B27' }}></i>
              </a>
              <a href="https://medium.com/@sreshthi.unifiedweboption" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper" title="Medium">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M25 25 L35 25 L45 65 L55 25 L65 25 L75 25 L75 75 L65 75 L65 35 L55 75 L45 75 L35 35 L35 75 L25 75 Z" fill="#ffffff" />
                </svg>
              </a>
              <a href="https://www.youtube.com/channel/UC_YQo0Y8bX54gsl8k4D9jvA" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper" title="YouTube">
                <img src="/images/youtube..webp" alt="YouTube" />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM DIVIDER & COPYRIGHT / LEGAL */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            UWO<sup>&trade;</sup> &mdash; Unified Web Options &amp; Services Pvt. Ltd. &copy; {currentYear}. All Rights Reserved.
          </p>
          <div className="footer-legal-links">
            <a 
              href="#terms" 
              className="legal-footer-link" 
              onClick={(e) => { e.preventDefault(); if (onOpenLegal) onOpenLegal('terms'); }}
            >
              Terms &amp; Conditions
            </a>
            <span className="footer-dot">&bull;</span>
            <a 
              href="#privacy" 
              className="legal-footer-link" 
              onClick={(e) => { e.preventDefault(); if (onOpenLegal) onOpenLegal('privacy'); }}
            >
              Privacy Policy
            </a>
            <span className="footer-dot">&bull;</span>
            <a 
              href="#cookies" 
              className="legal-footer-link"
              onClick={(e) => { e.preventDefault(); if (onOpenLegal) onOpenLegal('cookies'); }}
            >
              Cookies Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
