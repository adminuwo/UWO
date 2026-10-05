import React from 'react';
import { motion } from 'framer-motion';
import { 
  UWO_CONNECT_WEB_URL, 
  UWO_CONNECT_IOS_URL, 
  UWO_CONNECT_ANDROID_URL 
} from '../../constants/uwoConnectConstants';
import { fadeUp, btnMotion, staggerContainer, EASE_PREMIUM } from './motionVariants';

// 1. Official Google Chrome / Web SVG
function ChromeIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="uwoc_ch_a" x1="3.2173" y1="15" x2="44.7812" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d93025" />
          <stop offset="1" stopColor="#ea4335" />
        </linearGradient>
        <linearGradient id="uwoc_ch_b" x1="20.7219" y1="47.6791" x2="41.5039" y2="11.6837" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fcc934" />
          <stop offset="1" stopColor="#fbbc04" />
        </linearGradient>
        <linearGradient id="uwoc_ch_c" x1="26.5981" y1="46.5015" x2="5.8161" y2="10.506" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1e8e3e" />
          <stop offset="1" stopColor="#34a853" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="23.9947" r="12" fill="#FFFFFF" />
      <path d="M3.2154,36A24,24,0,1,0,12,3.2154,24,24,0,0,0,3.2154,36ZM34.3923,18A12,12,0,1,1,18,13.6077,12,12,0,0,1,34.3923,18Z" fill="none" />
      <path d="M24,12H44.7812a23.9939,23.9939,0,0,0-41.5639.0029L13.6079,30l.0093-.0024A11.9852,11.9852,0,0,1,24,12Z" fill="url(#uwoc_ch_a)" />
      <circle cx="24" cy="24" r="9.5" fill="#1A73E8" />
      <path d="M34.3913,30.0029,24.0007,48A23.994,23.994,0,0,0,44.78,12.0031H23.9989l-.0025.0093A11.985,11.985,0,0,1,34.3913,30.0029Z" fill="url(#uwoc_ch_b)" />
      <path d="M13.6086,30.0031,3.218,12.006A23.994,23.994,0,0,0,24.0025,48L34.3931,30.0029l-.0067-.0068a11.9852,11.9852,0,0,1-20.7778.007Z" fill="url(#uwoc_ch_c)" />
    </svg>
  );
}

// 2. Official Google Play 4-Color Triangle SVG
function GooglePlayIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M38.8 9.5C28.2 15.6 21.3 27 21.3 40.5v431c0 13.5 6.9 24.9 17.5 31L257.6 256 38.8 9.5z" fill="#00A0FF" />
      <path d="M331.4 182.2L257.6 256l73.8 73.8 84.7-48.7c16.2-9.3 26.2-26.6 26.2-45.1s-10-35.8-26.2-45.1l-84.7-48.7z" fill="#FFDA00" />
      <path d="M257.6 256L38.8 474.7c6.1 3.5 13.2 5.5 20.8 5.5 8.7 0 17.1-2.6 24.2-6.7l227.6-130.8L257.6 256z" fill="#FF3A44" />
      <path d="M311.4 168.3L83.8 37.5C76.7 33.4 68.3 30.8 59.6 30.8c-7.6 0-14.7 2-20.8 5.5L257.6 256l53.8-87.7z" fill="#00E676" />
    </svg>
  );
}

// 3. Official Apple Bitten Logo SVG
function AppleIcon({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

export default function WebMobileAccess() {
  const platforms = [
    {
      id: 'web',
      icon: <ChromeIcon size={38} />,
      title: 'Web Application',
      deviceType: 'Browser Workspace',
      desc: 'Full-featured enterprise automation suite accessible directly from Chrome, Safari, Edge, or Firefox. Optimized for multi-monitor setups and high-speed team collaboration.',
      url: UWO_CONNECT_WEB_URL,
      btnLabel: 'Open Web App',
      btnClass: 'uwoc-btn-gold',
      btnIcon: 'fa-solid fa-arrow-up-right-from-square',
    },
    {
      id: 'android',
      icon: <GooglePlayIcon size={34} />,
      title: 'Google Play',
      deviceType: 'Android APK / Play Store',
      desc: 'Native Android mobile experience with biometric lock, push notifications for hot leads, offline reading, and field customer conversation management.',
      url: UWO_CONNECT_ANDROID_URL,
      btnLabel: 'Get on Google Play',
      btnClass: 'uwoc-btn-secondary',
      btnIcon: 'fa-brands fa-google-play',
    },
    {
      id: 'ios',
      icon: <AppleIcon size={34} />,
      title: 'Apple App Store',
      deviceType: 'iOS & iPadOS Native',
      badge: 'Coming Soon',
      desc: 'Engineered for iPhone and iPad with Face ID security, rich lock-screen lead banners, and split-screen document review. Currently in Apple review — launching soon.',
      url: '#',
      btnLabel: 'Coming Soon',
      btnClass: 'uwoc-btn-coming-soon',
      btnIcon: 'fa-brands fa-apple',
      isComingSoon: true,
    },
  ];

  return (
    <section className="uwoc-section uwoc-bg-contrast" id="platforms">
      <div className="uwoc-container">
        {/* Section Header */}
        <motion.div
          className="uwoc-section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="uwoc-eyebrow">
            <i className="fa-solid fa-laptop-mobile"></i>
            <span>MULTI-PLATFORM ACCESSIBILITY</span>
          </div>

          <h2 className="uwoc-section-title">
            Work From <span className="uwoc-gradient-gold">Anywhere.</span>
          </h2>

          <p className="uwoc-section-subtitle">
            Seamlessly transition between desktop executive control, office customer support dispatch, and on-the-go mobile deal negotiation.
          </p>
        </motion.div>

        {/* 3 Platform Cards with Staggered Entrance */}
        <motion.div 
          className="uwoc-platforms-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.02 }}
          variants={staggerContainer(0.18, 0.05)}
        >
          {platforms.map((plat) => (
            <motion.div
              key={plat.id}
              className={`uwoc-platform-card ${plat.isComingSoon ? 'is-coming-soon' : ''}`}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_PREMIUM } }}
            >
              <div className="uwoc-plat-top-bar">
                <span className="uwoc-plat-device-tag">{plat.deviceType}</span>
                {plat.badge && (
                  <span className="uwoc-plat-badge-pill">
                    <i className="fa-solid fa-hourglass-half"></i>
                    <span>{plat.badge}</span>
                  </span>
                )}
              </div>

              <div className="uwoc-platform-icon-wrap">
                {plat.icon}
              </div>

              <h3>{plat.title}</h3>
              <p>{plat.desc}</p>

              {plat.isComingSoon ? (
                <div
                  className="uwoc-btn uwoc-btn-coming-soon uwoc-plat-btn"
                  title="Coming Soon on the Apple App Store"
                >
                  <i className="fa-brands fa-apple"></i>
                  <span>Coming Soon</span>
                </div>
              ) : (
                <motion.a
                  href={plat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`uwoc-btn ${plat.btnClass} uwoc-plat-btn`}
                  whileHover={btnMotion.hover}
                  whileTap={btnMotion.tap}
                >
                  <i className={plat.btnIcon}></i>
                  <span>{plat.btnLabel}</span>
                </motion.a>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
