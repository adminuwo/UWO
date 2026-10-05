import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AI_LEGAL_WEB_URL } from '../../constants/aiLegalConstants';
import { fadeUp, scaleIn, btnMotion, EASE_PREMIUM } from './motionVariants';

export default function AiLegalHero({ onExploreClick, onDownloadClick }) {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const imageFrameRef = useRef(null);

  // 3D Tilt state for hero screenshot
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Mouse interaction for 3D tilt (smooth, dampened)
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

  // Upgraded Legal Neural Data-Stream Canvas with Relaxed, Slower Drift
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isVisible = true;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
        height = canvas.height = canvas.parentElement.clientHeight || 650;
      }
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for subtle particle reaction
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

    // IntersectionObserver to pause rendering when hero is offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    if (heroEl) observer.observe(heroEl);

    // Create particles with gentle, slow velocity
    const particles = [];
    const particleCount = 38;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22, // Slower gentle speed
        vy: (Math.random() - 0.5) * 0.22,
        baseRadius: Math.random() * 2 + 1,
        radius: Math.random() * 2 + 1,
        color:
          i % 3 === 0
            ? 'rgba(184, 142, 45, 0.55)'
            : i % 3 === 1
            ? 'rgba(200, 163, 77, 0.45)'
            : 'rgba(100, 116, 139, 0.35)',
      });
    }

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Connect nodes within threshold distance
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(184, 142, 45, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Connect particles to mouse cursor if near
        if (mouse.isHovering) {
          const mdx = particles[i].x - mouse.x;
          const mdy = particles[i].y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 110) {
            ctx.strokeStyle = `rgba(200, 163, 77, ${0.28 * (1 - mdist / 110)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

            // Subtle gentle repulsion from cursor
            const force = (110 - mdist) / 110;
            particles[i].x += (mdx / mdist) * force * 0.4;
            particles[i].y += (mdy / mdist) * force * 0.4;
          }
        }
      }

      // Render & update nodes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
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

  return (
    <section className="al-hero-section" id="hero" ref={heroRef}>
      <canvas ref={canvasRef} className="al-hero-canvas" aria-hidden="true" />

      <div className="ai-legal-container">
        <div className="al-hero-split-grid">
          {/* LEFT: Text & CTAs with Smooth Cinematic Entrance Sequence */}
          <div className="al-hero-left">
            <motion.div
              className="al-hero-badge"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_PREMIUM }}
            >
              <span className="al-uwo-tag">Built by UWO™</span>
              <span className="al-badge-dot"></span>
              <span>Enterprise Legal Intelligence Platform</span>
            </motion.div>

            <motion.h1
              className="al-hero-title"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.18, ease: EASE_PREMIUM }}
            >
              AI LEGAL<sup style={{ fontSize: '0.45em', top: '-0.8em', color: 'var(--al-gold)' }}>™</sup>
            </motion.h1>

            <motion.p
              className="al-hero-supporting"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.32, ease: EASE_PREMIUM }}
            >
              Intelligence for Modern Legal Practice.
            </motion.p>

            <motion.p
              className="al-hero-lead"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.46, ease: EASE_PREMIUM }}
            >
              An AI-powered legal intelligence platform built to help advocates research, analyze, draft, manage cases, and make better-informed legal decisions.
            </motion.p>

            <motion.div
              className="al-hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.6, ease: EASE_PREMIUM }}
            >
              <motion.button
                type="button"
                className="al-btn al-btn-primary"
                onClick={onExploreClick}
                aria-label="Explore AI Legal Features"
                whileHover={btnMotion.hover}
                whileTap={btnMotion.tap}
              >
                <motion.i
                  className="fa-solid fa-compass"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.4, ease: EASE_PREMIUM }}
                />
                <span>Explore AI LEGAL</span>
              </motion.button>

              <motion.a
                href={AI_LEGAL_WEB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="al-btn al-btn-secondary"
                aria-label="Open AI Legal Web Application"
                whileHover={btnMotion.hover}
                whileTap={btnMotion.tap}
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                <span>Open Web App</span>
              </motion.a>

              <motion.button
                type="button"
                className="al-btn al-btn-outline-gold"
                onClick={onDownloadClick}
                aria-label="Download AI Legal Mobile App"
                whileHover={btnMotion.hover}
                whileTap={btnMotion.tap}
              >
                <i className="fa-solid fa-mobile-screen"></i>
                <span>Download App</span>
              </motion.button>
            </motion.div>

            <motion.p
              className="al-hero-footer-note"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.82, ease: EASE_PREMIUM }}
            >
              AI-powered legal technology for the next generation of legal professionals.
            </motion.p>
          </div>

          {/* RIGHT: Real Hero Platform Preview Image with 3D Tilt & Gentle Floating Badges */}
          <div className="al-hero-right">
            <motion.div
              className="al-hero-image-frame"
              ref={imageFrameRef}
              initial={{ opacity: 0, x: 35, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1.15, delay: 0.35, ease: EASE_PREMIUM }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Floating Intelligence Badge 1: Top-Left (Gentle 7s cycle) */}
              <motion.div
                className="al-hero-float-badge badge-top-left"
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="al-float-dot"></span>
                <i className="fa-solid fa-brain" style={{ color: 'var(--al-gold)' }}></i>
                <span>Case Intelligence</span>
              </motion.div>

              {/* Floating Intelligence Badge 2: Bottom-Right (Gentle 7.5s cycle) */}
              <motion.div
                className="al-hero-float-badge badge-bottom-right"
                animate={{
                  y: [0, 6, 0],
                }}
                transition={{
                  duration: 7.5,
                  delay: 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="al-float-dot"></span>
                <i className="fa-solid fa-shield-halved" style={{ color: 'var(--al-gold)' }}></i>
                <span>Forensic Evidence Vault</span>
              </motion.div>

              {/* Floating Intelligence Badge 3: Bottom-Left (Gentle 8.5s cycle) */}
              <motion.div
                className="al-hero-float-badge badge-bottom-left"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 8.5,
                  delay: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="al-float-dot"></span>
                <i className="fa-solid fa-gavel" style={{ color: 'var(--al-gold)' }}></i>
                <span>Contextual Reasoning</span>
              </motion.div>

              <img
                src="/images/ai-legal-hero-real.png"
                alt="AI LEGAL™ - All Your Legal Work, One Powerful System"
                className="al-hero-real-img"
                loading="eager"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
