import React from 'react';
import { motion } from 'framer-motion';
import { 
  UWO_CONNECT_IOS_URL, 
  UWO_CONNECT_ANDROID_URL 
} from '../../constants/uwoConnectConstants';
import { fadeUp, btnMotion } from './motionVariants';

export default function AppDownloadSection() {
  return (
    <section className="uwoc-section" id="app-download">
      <div className="uwoc-container">
        <div className="uwoc-app-banner">
          <div className="uwoc-app-content">
            <div className="uwoc-eyebrow">
              <i className="fa-solid fa-mobile-screen-button"></i>
              <span>FIELD MOBILITY</span>
            </div>

            <h2 className="uwoc-app-title">
              Your business doesn't stop <br />
              <span className="uwoc-gradient-gold">when you leave your desk.</span>
            </h2>

            <p className="uwoc-app-desc">
              Whether meeting clients on-site or reviewing team operations during transit, the UWO Connect mobile app gives you real-time customer channels, CRM pipelines, and instant payment dispatch right in your pocket.
            </p>

            {/* Store Download Buttons */}
            <div className="uwoc-store-buttons">
              <div
                className="uwoc-store-btn"
                style={{ opacity: 0.75, cursor: 'not-allowed' }}
                title="Coming Soon on Apple App Store"
              >
                <i className="fa-brands fa-apple"></i>
                <div>
                  <span className="small">Coming Soon on</span>
                  <strong>Apple App Store</strong>
                </div>
              </div>

              <motion.a
                href={UWO_CONNECT_ANDROID_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="uwoc-store-btn"
                whileHover={btnMotion.hover}
                whileTap={btnMotion.tap}
              >
                <i className="fa-brands fa-google-play"></i>
                <div>
                  <span className="small">GET IT ON</span>
                  <strong>Google Play Store</strong>
                </div>
              </motion.a>
            </div>

            {/* Instant QR Code Box */}
            <div className="uwoc-qr-box">
              <div className="uwoc-qr-graphic">
                {/* Clean SVG QR code representation */}
                <svg width="84" height="84" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" fill="#FFFFFF" rx="8" />
                  <rect x="10" y="10" width="26" height="26" rx="4" fill="#000000" />
                  <rect x="15" y="15" width="16" height="16" rx="2" fill="#FFFFFF" />
                  <rect x="19" y="19" width="8" height="8" fill="#000000" />
                  
                  <rect x="64" y="10" width="26" height="26" rx="4" fill="#000000" />
                  <rect x="69" y="15" width="16" height="16" rx="2" fill="#FFFFFF" />
                  <rect x="73" y="19" width="8" height="8" fill="#000000" />
                  
                  <rect x="10" y="64" width="26" height="26" rx="4" fill="#000000" />
                  <rect x="15" y="69" width="16" height="16" rx="2" fill="#FFFFFF" />
                  <rect x="19" y="73" width="8" height="8" fill="#000000" />

                  <rect x="42" y="10" width="14" height="6" fill="#000000" />
                  <rect x="42" y="22" width="14" height="6" fill="#000000" />
                  <rect x="10" y="42" width="6" height="14" fill="#000000" />
                  <rect x="22" y="42" width="6" height="14" fill="#000000" />
                  <rect x="44" y="44" width="12" height="12" fill="#D4AF37" />
                  <rect x="64" y="42" width="26" height="6" fill="#000000" />
                  <rect x="70" y="54" width="20" height="6" fill="#000000" />
                  <rect x="42" y="64" width="6" height="26" fill="#000000" />
                  <rect x="54" y="70" width="6" height="20" fill="#000000" />
                  <rect x="66" y="66" width="24" height="24" rx="3" fill="#000000" />
                </svg>
              </div>
              <div className="uwoc-qr-info">
                <strong>Scan with Smartphone</strong>
                <span>Instant setup for your sales &amp; support team.</span>
              </div>
            </div>
          </div>

          {/* RIGHT: SMARTPHONE MOCKUP */}
          <div className="uwoc-app-phone-wrap">
            <div className="uwoc-phone-mockup">
              <div className="uwoc-phone-notch" />
              <div className="uwoc-phone-screen">
                <div className="phone-top-bar">
                  <span className="phone-time">9:41</span>
                  <div className="phone-icons">
                    <i className="fa-solid fa-signal"></i>
                    <i className="fa-solid fa-wifi"></i>
                    <i className="fa-solid fa-battery-full"></i>
                  </div>
                </div>

                <div className="phone-header">
                  <div className="p-brand">
                    <i className="fa-solid fa-network-wired"></i>
                    <span>UWO Connect</span>
                  </div>
                  <span className="p-badge">Live</span>
                </div>

                {/* Notifications on phone */}
                <div className="phone-notifications">
                  <div className="phone-notif-card hot">
                    <div className="notif-head">
                      <i className="fa-brands fa-whatsapp"></i>
                      <span>WhatsApp Cloud</span>
                      <span className="time">Just now</span>
                    </div>
                    <strong>New Qualified Lead: Aarav M.</strong>
                    <p>Catalog downloaded • Quoted ₹1.8L</p>
                  </div>

                  <div className="phone-notif-card ai">
                    <div className="notif-head">
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                      <span>AI Copilot</span>
                      <span className="time">1m ago</span>
                    </div>
                    <strong>Resolved 18 Support Inquiries</strong>
                    <p>Average response time: 0.8s</p>
                  </div>

                  <div className="phone-notif-card pay">
                    <div className="notif-head">
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Payment Verified</span>
                      <span className="time">5m ago</span>
                    </div>
                    <strong>₹45,000 Received via UPI</strong>
                    <p>GST Invoice #INV-081 auto-dispatched</p>
                  </div>
                </div>

                <div className="phone-bottom-nav">
                  <i className="fa-solid fa-inbox active"></i>
                  <i className="fa-solid fa-chart-pie"></i>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  <i className="fa-solid fa-gear"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
