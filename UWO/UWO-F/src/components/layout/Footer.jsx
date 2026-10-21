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
        {/* TOP 3-COLUMN BALANCED & SYSTEMATIC GRID */}
        <div className="footer-grid">
          
          {/* COLUMN 1 (LEFT): EXPLORE & COMPANY (2 BALANCED SUB-COLUMNS) */}
          <div className="footer-col footer-col-explore">
            <div className="footer-explore-inner">
              <div className="footer-heading-wrap">
                <h3 className="footer-section-title">Explore &amp; Company</h3>
                <div className="footer-title-bar"></div>
              </div>
              
              <div className="footer-links-two-col">
                <div className="footer-links-subcol">
                  <Link to="/about">About UWO</Link>
                  <Link to="/our-team">Our Team</Link>
                  <Link to="/blogs">Blogs</Link>
                  <a href="https://uwo24.com/partner-portal" target="_blank" rel="noopener noreferrer" className="partner-highlight">Partner Portal</a>
                </div>

                <div className="footer-links-subcol">
                  <Link to="/contact">Contact</Link>
                  <Link to="/terms-and-conditions" onClick={() => { if (onOpenLegal) onOpenLegal('terms'); }}>Terms &amp; Conditions</Link>
                  <Link to="/privacy-policy" onClick={() => { if (onOpenLegal) onOpenLegal('privacy'); }}>Privacy Policy</Link>
                  <Link to="/cookies-policy" onClick={() => { if (onOpenLegal) onOpenLegal('cookies'); }}>Cookies Policy</Link>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2 (CENTER): BRAND IDENTITY & RECOGNITION */}
          <div className="footer-col footer-col-brand">
            <Link to="/" className="footer-brand-logo" title="UWO Home">
              <img 
                src="/images/uwo-logo-cropped.png" 
                alt="UWO™ Logo" 
                onError={(e) => { e.currentTarget.src = '/images/uwo-logo.png'; }} 
              />
            </Link>

            <div className="footer-direct-contact">
              <a href="mailto:admin@uwo24.com" className="footer-contact-link" title="Email UWO">
                <i className="fa-solid fa-envelope"></i>
                <span>admin@uwo24.com</span>
              </a>
              <span className="footer-contact-dot">&bull;</span>
              <a href="https://wa.me/918358990909" target="_blank" rel="noopener noreferrer" className="footer-contact-link" title="WhatsApp UWO">
                <i className="fa-brands fa-whatsapp"></i>
                <span>+91 8358990909</span>
              </a>
            </div>
          </div>

          {/* COLUMN 3 (RIGHT): CONNECT & COMMUNITY (NEAT UNWRAPPED ROW + EARN BUTTON) */}
          <div className="footer-col footer-col-connect">
            <div className="footer-heading-wrap">
              <h3 className="footer-section-title">Connect With Us</h3>
              <div className="footer-title-bar"></div>
            </div>

            <div className="footer-social-row">
              <a href="https://www.facebook.com/uwo_business/" target="_blank" rel="noopener noreferrer" className="social-circle-btn social-fb" title="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/uwo_business/" target="_blank" rel="noopener noreferrer" className="social-circle-btn social-insta" title="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/company/uwo-business/" target="_blank" rel="noopener noreferrer" className="social-circle-btn social-linkedin" title="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="https://www.threads.net/@uwo_business" target="_blank" rel="noopener noreferrer" className="social-circle-btn social-threads" title="Threads">
                <svg viewBox="0 0 192 192" width="14" height="14" fill="currentColor">
                  <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.587 60.5305 122.246 44.0538 96.6579 44.0538C75.2854 44.0538 58.7493 57.0624 53.6493 78.4754L69.8335 82.5298C73.3421 68.3298 83.1878 60.0538 96.6579 60.0538C110.155 60.0538 120.375 69.1862 122.569 84.8197C114.582 85.9406 106.182 87.7289 97.478 90.2289C76.2872 96.3155 64.0628 107.592 64.0628 122.753C64.0628 139.638 78.0776 150.946 95.3999 150.946C112.515 150.946 126.852 141.979 134.409 127.842C139.914 137.777 148.657 143.208 160.003 143.208C176.711 143.208 188.063 129.569 188.063 108.572C188.063 76.623 162.296 40 96.6579 40C52.2872 40 20 72.8224 20 120.893C20 168.963 52.2872 201.786 96.6579 201.786C127.359 201.786 153.256 186.299 164.887 159.208L149.887 151.208C140.71 172.569 120.155 184.786 96.6579 184.786C61.3421 184.786 36.6579 157.963 36.6579 120.893C36.6579 83.8224 61.3421 57 96.6579 57C149.256 57 171.396 87.572 171.396 108.572C171.396 121.569 164.582 129.208 155.003 129.208C147.155 129.208 141.914 124.623 138.342 116.893C140.658 107.822 141.829 98.4754 141.537 88.9883ZM122.569 101.475C122.569 104.208 122.246 106.893 121.658 109.529C116.914 125.753 107.03 134.946 95.3999 134.946C86.7107 134.946 79.7289 129.569 79.7289 121.753C79.7289 110.822 89.1549 102.529 105.155 97.9406C110.914 96.2934 116.711 95.132 122.569 94.4754V101.475Z"/>
                </svg>
              </a>
              <a href="https://x.com/uwo_business" target="_blank" rel="noopener noreferrer" className="social-circle-btn social-x" title="X (Twitter)">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/channel/UC_YQo0Y8bX54gsl8k4D9jvA" target="_blank" rel="noopener noreferrer" className="social-circle-btn social-yt" title="YouTube">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="https://in.pinterest.com/UWO_Business/" target="_blank" rel="noopener noreferrer" className="social-circle-btn social-pin" title="Pinterest">
                <i className="fa-brands fa-pinterest-p"></i>
              </a>
              <a href="https://wa.me/918358990909" target="_blank" rel="noopener noreferrer" className="social-circle-btn social-wa" title="WhatsApp">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
              <a href="https://www.reddit.com/user/AcanthisittaFront692/" target="_blank" rel="noopener noreferrer" className="social-circle-btn social-reddit" title="Reddit">
                <i className="fa-brands fa-reddit-alien"></i>
              </a>
              <a href="mailto:admin@uwo24.com" className="social-circle-btn social-gmail" title="Email Us">
                <img src="/images/Gmail_Logo_512px-removebg-preview.png" alt="Email" />
              </a>
              <a href="https://medium.com/@sreshthi.unifiedweboption" target="_blank" rel="noopener noreferrer" className="social-circle-btn social-medium" title="Medium">
                <svg viewBox="0 0 1043.63 592.71" width="14" height="14" fill="currentColor">
                  <path d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460.03 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 279-147.17 279s-147.18-124.94-147.18-279 65.88-279 147.16-279 147.17 124.9 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94s-51.75-111.91-51.75-249.94 23.17-249.94 51.75-249.94 51.76 111.9 51.76 249.94"/>
                </svg>
              </a>
            </div>

            <div className="footer-earn-box">
              <button type="button" className="footer-earn-btn" onClick={handleOpenEarn}>
                <i className="fa-solid fa-gift"></i>
                <span>Earn &amp; Refer Program</span>
              </button>
            </div>
          </div>

        </div>

        {/* CLOUD & STARTUP PARTNERS STRIP */}
        <div className="footer-partners-bar">
          <span className="footer-partners-heading">Supported By Global Startup &amp; Cloud Partners</span>
          <div className="partner-logos-row">
            <div className="logo-item" title="Microsoft Azure"><img src="/images/azure.png" alt="Azure" /></div>
            <div className="logo-item" title="Amazon Web Services"><img src="/images/AWS.png" alt="AWS" /></div>
            <div className="logo-item" title="MongoDB"><img src="/images/mongo.png" alt="MongoDB" /></div>
            <div className="logo-item" title="Notion"><img src="/images/notion copy.png" alt="Notion" /></div>
            <div className="logo-item" title="Google Cloud"><img src="/images/google_cloud_.webp" alt="Google Cloud" /></div>
            <div className="logo-item" title="DigitalOcean"><img src="/images/digital.png" alt="DigitalOcean" /></div>
            <div className="logo-item" title="Tavily AI"><img src="/images/tavily-transparent.png" alt="Tavily" /></div>
            <div className="logo-item" title="Ethereum Devcon – Community Partner"><img src="/images/devcon.png" alt="Ethereum Devcon" /></div>
          </div>
        </div>

        {/* BOTTOM DIVIDER & COPYRIGHT / LEGAL */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            UWO<sup>&trade;</sup> &mdash; Unified Web Options &amp; Services Pvt. Ltd. &copy; {currentYear}. All Rights Reserved.
          </p>
          <div className="footer-legal-links">
            <Link 
              to="/terms-and-conditions" 
              className="legal-footer-link" 
              onClick={() => { if (onOpenLegal) onOpenLegal('terms'); }}
            >
              Terms &amp; Conditions
            </Link>
            <span className="footer-dot">&bull;</span>
            <Link 
              to="/privacy-policy" 
              className="legal-footer-link" 
              onClick={() => { if (onOpenLegal) onOpenLegal('privacy'); }}
            >
              Privacy Policy
            </Link>
            <span className="footer-dot">&bull;</span>
            <Link 
              to="/cookies-policy" 
              className="legal-footer-link"
              onClick={() => { if (onOpenLegal) onOpenLegal('cookies'); }}
            >
              Cookies Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
