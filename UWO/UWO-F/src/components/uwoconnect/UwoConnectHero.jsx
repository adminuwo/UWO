import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UWO_CONNECT_WEB_URL 
} from '../../constants/uwoConnectConstants';
import { fadeUp, btnMotion, EASE_PREMIUM } from './motionVariants';

export default function UwoConnectHero() {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const imageFrameRef = useRef(null);

  // 3D Tilt state for hero dashboard screenshot (identical to AI Legal Hero)
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!imageFrameRef.current) return;
    if (window.innerWidth < 992) return; // Disable on tablet/mobile

    const rect = imageFrameRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((mouseY - centerY) / centerY) * -3.5; // Max -3.5 to +3.5 deg
    const rotateY = ((mouseX - centerX) / centerX) * 3.5;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // UWO Connect Emerald & Cyan Neural Data-Stream Canvas with Gentle, Slow Drift
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isVisible = true;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 750);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
        height = canvas.height = canvas.parentElement.clientHeight || 750;
      }
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: -9999, y: -9999, isHovering: false };
    const isPointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const handleCanvasMouseMove = (e) => {
      if (!isPointerFine) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isHovering = true;
    };

    const handleCanvasMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.isHovering = false;
    };

    const heroEl = heroRef.current;
    if (heroEl && isPointerFine) {
      heroEl.addEventListener('mousemove', handleCanvasMouseMove);
      heroEl.addEventListener('mouseleave', handleCanvasMouseLeave);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    if (heroEl) observer.observe(heroEl);

    // Particle nodes for omnichannel data mesh (emerald, teal, soft blue)
    const particles = [];
    const particleCount = 36;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        baseRadius: Math.random() * 2 + 1,
        radius: Math.random() * 2 + 1,
        color: i % 3 === 0 ? 'rgba(11, 143, 120, ' : i % 3 === 1 ? 'rgba(37, 99, 235, ' : 'rgba(16, 185, 129, ',
        baseAlpha: Math.random() * 0.35 + 0.15,
      });
    }

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting network laser lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(11, 143, 120, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle mouse repulsion
        if (mouse.isHovering) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110 && dist > 0) {
            const force = (110 - dist) / 110;
            p.x -= (dx / dist) * force * 1.2;
            p.y -= (dy / dist) * force * 1.2;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.baseAlpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (heroEl && isPointerFine) {
        heroEl.removeEventListener('mousemove', handleCanvasMouseMove);
        heroEl.removeEventListener('mouseleave', handleCanvasMouseLeave);
      }
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="uwoc-hero-section" id="hero" ref={heroRef} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Interactive Neural Data-Stream Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.85,
        }}
      />

      {/* Decorative Radial Ambient Glows */}
      <div className="uwoc-hero-glow-emerald" aria-hidden="true" />
      <div className="uwoc-hero-glow-blue" aria-hidden="true" />
      <div className="uwoc-hero-grid-dots" aria-hidden="true" />

      <div className="uwoc-container" style={{ position: 'relative', zIndex: 2 }}>
        {/* HERO HEADER - COMPACT & CLEAN */}
        <motion.div
          className="uwoc-hero-header"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {/* Eyebrow Pill */}
          <div className="uwoc-eyebrow">
            <span className="uwoc-eyebrow-dot" />
            <span>Unified Communication &amp; Business Automation</span>
          </div>

          {/* Main Heading */}
          <h1 className="uwoc-hero-title">
            <span>Connect Everything. </span>
            <span className="uwoc-gradient-emerald">Automate Anything.</span>
          </h1>

          {/* Supporting Subtitle */}
          <p className="uwoc-hero-subtitle">
            UWO Connect brings your communication channels, business tools, and automation into one intelligent workspace.
          </p>

          {/* Clean 2-Button SaaS Action Bar */}
          <div className="uwoc-hero-actions">
            <motion.a
              href={UWO_CONNECT_WEB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="uwoc-btn uwoc-btn-emerald"
              whileHover={btnMotion.hover}
              whileTap={btnMotion.tap}
            >
              <span>Start Free</span>
              <i className="fa-solid fa-arrow-right"></i>
            </motion.a>

            <motion.button
              type="button"
              className="uwoc-btn uwoc-btn-secondary"
              onClick={() => scrollToSection('platforms')}
              whileHover={btnMotion.hover}
              whileTap={btnMotion.tap}
            >
              <span>Explore Platform</span>
              <i className="fa-solid fa-chevron-down"></i>
            </motion.button>
          </div>
        </motion.div>

        {/* 3-COLUMN HERO VISUAL STAGE: DEV (LEFT) + 3D TILT DASHBOARD (CENTER) + ABHA (RIGHT) */}
        <div className="uwoc-hero-stage">
          {/* LEFT CHARACTER: DEV • CONNECTORS WITH FLOATING BOB */}
          <motion.div 
            className="uwoc-char-col uwoc-char-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: EASE_PREMIUM }}
          >
            <motion.div 
              className="uwoc-char-card"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="uwoc-char-glow-blue" aria-hidden="true" />
              <img 
                src="/images/uwoconnect/Dev_transparent.png" 
                alt="Dev - UWO Connect Connector Intelligence" 
                className="uwoc-char-img"
              />
            </motion.div>
            <div className="uwoc-char-info">
              <span className="uwoc-char-tag tag-blue">DEV • CONNECTORS</span>
            </div>
          </motion.div>

          {/* CENTER: UNCLUTTERED CLEAN SAAS DASHBOARD WITH INTERACTIVE 3D TILT */}
          <motion.div
            className="uwoc-hero-dashboard-col"
            ref={imageFrameRef}
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.05, delay: 0.08, ease: EASE_PREMIUM }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              perspective: 1200,
            }}
          >
            <div 
              className="uwoc-dash-frame"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.1s ease-out',
                willChange: 'transform',
              }}
            >
              {/* Window Titlebar */}
              <div className="uwoc-dash-titlebar">
                <div className="uwoc-dash-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <div className="uwoc-dash-address">
                  <i className="fa-solid fa-lock text-emerald"></i>
                  <span>app.uwoconnect.com/workspace</span>
                </div>
                <div className="uwoc-dash-status-pill">
                  <span className="pulse-dot-green" />
                  <span>LIVE SYNC</span>
                </div>
              </div>

              {/* Main Client Dashboard Graphic */}
              <div className="uwoc-dash-img-wrap">
                <img 
                  src="/images/uwoconnect/uwo_client_dashboard.png" 
                  alt="UWO Connect Unified Platform Workspace" 
                  className="uwoc-dash-img"
                  onError={(e) => {
                    e.currentTarget.src = '/images/uwoconnect/dashboard_main.png';
                  }}
                />

                {/* Floating Bottom Telemetry Bar */}
                <div className="uwoc-dash-telemetry-strip">
                  <div className="uwoc-telemetry-item">
                    <span className="pulse-wave-icon">
                      <i className="fa-solid fa-wave-square"></i>
                    </span>
                    <span>Automation Engine: <strong className="text-emerald">Active</strong></span>
                  </div>
                  <div className="uwoc-telemetry-item text-slate-500">
                    <span>Response Time: <strong className="text-slate-800">0.2s</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT CHARACTER: ABHA • AUTOMATION WITH STAGGERED FLOATING BOB */}
          <motion.div 
            className="uwoc-char-col uwoc-char-right"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE_PREMIUM }}
          >
            <motion.div 
              className="uwoc-char-card"
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 5.6, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="uwoc-char-glow-emerald" aria-hidden="true" />
              <img 
                src="/images/uwoconnect/Abha_transparent.png" 
                alt="Abha - UWO Connect Automation Intelligence" 
                className="uwoc-char-img"
              />
            </motion.div>
            <div className="uwoc-char-info">
              <span className="uwoc-char-tag tag-emerald">ABHA • AUTOMATION</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
