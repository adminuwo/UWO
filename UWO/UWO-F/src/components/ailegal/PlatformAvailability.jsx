import React from 'react';
import { motion } from 'framer-motion';
import { 
  AI_LEGAL_WEB_URL, 
  AI_LEGAL_ANDROID_URL, 
  AI_LEGAL_IOS_URL 
} from '../../constants/aiLegalConstants';
import { fadeUp, btnMotion, EASE_PREMIUM } from './motionVariants';

// 1. Real Google Chrome / Web Browser Logo (Official Complete Multi-Color)
function WebBrowserRealIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google Chrome">
      <defs>
        <linearGradient id="chrome_grad_a" x1="3.2173" y1="15" x2="44.7812" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d93025" />
          <stop offset="1" stopColor="#ea4335" />
        </linearGradient>
        <linearGradient id="chrome_grad_b" x1="20.7219" y1="47.6791" x2="41.5039" y2="11.6837" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fcc934" />
          <stop offset="1" stopColor="#fbbc04" />
        </linearGradient>
        <linearGradient id="chrome_grad_c" x1="26.5981" y1="46.5015" x2="5.8161" y2="10.506" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1e8e3e" />
          <stop offset="1" stopColor="#34a853" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="23.9947" r="12" fill="#FFFFFF" />
      <path d="M3.2154,36A24,24,0,1,0,12,3.2154,24,24,0,0,0,3.2154,36ZM34.3923,18A12,12,0,1,1,18,13.6077,12,12,0,0,1,34.3923,18Z" fill="none" />
      <path d="M24,12H44.7812a23.9939,23.9939,0,0,0-41.5639.0029L13.6079,30l.0093-.0024A11.9852,11.9852,0,0,1,24,12Z" fill="url(#chrome_grad_a)" />
      <circle cx="24" cy="24" r="9.5" fill="#1A73E8" />
      <path d="M34.3913,30.0029,24.0007,48A23.994,23.994,0,0,0,44.78,12.0031H23.9989l-.0025.0093A11.985,11.985,0,0,1,34.3913,30.0029Z" fill="url(#chrome_grad_b)" />
      <path d="M13.6086,30.0031,3.218,12.006A23.994,23.994,0,0,0,24.0025,48L34.3931,30.0029l-.0067-.0068a11.9852,11.9852,0,0,1-20.7778.007Z" fill="url(#chrome_grad_c)" />
    </svg>
  );
}

// 2. Real Google Play Store Logo (Official 4-Color Triangle)
function GooglePlayRealIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google Play Store">
      <path
        d="M38.8 9.5C28.2 15.6 21.3 27 21.3 40.5v431c0 13.5 6.9 24.9 17.5 31L257.6 256 38.8 9.5z"
        fill="#00A0FF"
      />
      <path
        d="M331.4 182.2L257.6 256l73.8 73.8 84.7-48.7c16.2-9.3 26.2-26.6 26.2-45.1s-10-35.8-26.2-45.1l-84.7-48.7z"
        fill="#FFDA00"
      />
      <path
        d="M257.6 256L38.8 474.7c6.1 3.5 13.2 5.5 20.8 5.5 8.7 0 17.1-2.6 24.2-6.7l227.6-130.8L257.6 256z"
        fill="#FF3A44"
      />
      <path
        d="M311.4 168.3L83.8 37.5C76.7 33.4 68.3 30.8 59.6 30.8c-7.6 0-14.7 2-20.8 5.5L257.6 256l53.8-87.7z"
        fill="#00E676"
      />
    </svg>
  );
}

// 3. Real Apple Logo (Official Apple Bitten Logo)
function AppleRealIcon({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg" aria-label="Apple">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

export default function PlatformAvailability() {
  const platforms = [
    {
      id: 'web',
      renderIcon: () => <WebBrowserRealIcon size={40} />,
      title: 'Web Application',
      deviceType: 'Desktop Browser Frame',
      desc: 'Full-featured legal intelligence suite accessible directly from Chrome, Safari, Edge, or Firefox. Optimized for multi-monitor litigation setups and high-resolution briefing.',
      url: AI_LEGAL_WEB_URL,
      btnLabel: 'Open Web App',
      btnClass: 'al-btn-primary',
      btnIcon: 'fa-solid fa-arrow-up-right-from-square',
    },
    {
      id: 'android',
      renderIcon: () => <GooglePlayRealIcon size={36} />,
      title: 'Google Play',
      deviceType: 'Android APK / Play Store',
      desc: 'Native Android experience with biometric lock, instant document camera scanner, push notifications for hearing dockets, and offline reading on mobile handsets & tablets.',
      url: AI_LEGAL_ANDROID_URL,
      btnLabel: 'Google Play',
      btnClass: 'al-btn-secondary',
      btnIcon: 'fa-brands fa-google-play',
    },
    {
      id: 'ios',
      renderIcon: () => <AppleRealIcon size={38} />,
      title: 'Apple App Store',
      deviceType: 'iOS & iPadOS Native',
      desc: 'Tailored for iOS and iPadOS with Apple Pencil annotation support for exhibits, Face ID authentication, and split-screen document review inside courtroom corridors.',
      url: AI_LEGAL_IOS_URL,
      btnLabel: 'App Store',
      btnClass: 'al-btn-secondary',
      btnIcon: 'fa-brands fa-apple',
    },
  ];

  return (
    <section className="al-platform-section" id="platforms">
      <div className="ai-legal-container">
        {/* Section Header */}
        <motion.div
          className="al-section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="al-eyebrow">
            <i className="fa-solid fa-mobile-screen-button"></i>
            <span>Multi-Device Accessibility</span>
          </div>

          <h2 className="al-section-title">
            AI LEGAL™. <span className="al-gold-text">Wherever Legal Work Happens.</span>
          </h2>

          <p className="al-section-subtitle">
            Seamlessly transition between desktop chamber research, courtroom tablet argument outlines, and on-the-go mobile case telemetry.
          </p>
        </motion.div>

        {/* 3 Platform Cards with Staggered Entrance */}
        <motion.div
          className="al-platform-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.18, delayChildren: 0.15 },
            },
          }}
        >
          {platforms.map((plat) => (
            <motion.div
              className="al-platform-card"
              key={plat.id}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_PREMIUM } }}
            >
              <div className="al-platform-top-bar">
                <span className="al-plat-device-tag">{plat.deviceType}</span>
              </div>

              <div className="al-platform-icon-wrap">
                {plat.renderIcon()}
              </div>

              <h3>{plat.title}</h3>
              <p>{plat.desc}</p>

              <motion.a
                href={plat.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`al-btn ${plat.btnClass} al-platform-btn`}
                aria-label={`Launch AI Legal on ${plat.title}`}
                whileHover={btnMotion.hover}
                whileTap={btnMotion.tap}
              >
                <i className={plat.btnIcon}></i>
                <span>{plat.btnLabel}</span>
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
