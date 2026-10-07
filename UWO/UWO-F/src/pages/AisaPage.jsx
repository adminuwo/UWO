import React, { useState, useEffect, useRef } from 'react';
import { getApiUrl } from '../services/api';

export const AISA_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.uwo.aisa&pcampaignid=web_share';
export const AISA_IOS_URL = 'https://apps.apple.com/us/app/aisa/id6779135418';
export const AISA_WEB_URL = 'https://aisa24.com';

// 1. Real Google Chrome / Web Browser Logo (Multi-Color)
function WebBrowserRealIcon({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google Chrome">
      <defs>
        <linearGradient id="aisa_chrome_grad_a" x1="3.2173" y1="15" x2="44.7812" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d93025" />
          <stop offset="1" stopColor="#ea4335" />
        </linearGradient>
        <linearGradient id="aisa_chrome_grad_b" x1="20.7219" y1="47.6791" x2="41.5039" y2="11.6837" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fcc934" />
          <stop offset="1" stopColor="#fbbc04" />
        </linearGradient>
        <linearGradient id="aisa_chrome_grad_c" x1="26.5981" y1="46.5015" x2="5.8161" y2="10.506" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1e8e3e" />
          <stop offset="1" stopColor="#34a853" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="23.9947" r="12" fill="#FFFFFF" />
      <path d="M3.2154,36A24,24,0,1,0,12,3.2154,24,24,0,0,0,3.2154,36ZM34.3923,18A12,12,0,1,1,18,13.6077,12,12,0,0,1,34.3923,18Z" fill="none" />
      <path d="M24,12H44.7812a23.9939,23.9939,0,0,0-41.5639.0029L13.6079,30l.0093-.0024A11.9852,11.9852,0,0,1,24,12Z" fill="url(#aisa_chrome_grad_a)" />
      <circle cx="24" cy="24" r="9.5" fill="#1A73E8" />
      <path d="M34.3913,30.0029,24.0007,48A23.994,23.994,0,0,0,44.78,12.0031H23.9989l-.0025.0093A11.985,11.985,0,0,1,34.3913,30.0029Z" fill="url(#aisa_chrome_grad_b)" />
      <path d="M13.6086,30.0031,3.218,12.006A23.994,23.994,0,0,0,24.0025,48L34.3931,30.0029l-.0067-.0068a11.9852,11.9852,0,0,1-20.7778.007Z" fill="url(#aisa_chrome_grad_c)" />
    </svg>
  );
}

// 2. Real Google Play Store Logo (Official 4-Color Triangle)
function GooglePlayRealIcon({ size = 34 }) {
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
function AppleRealIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" aria-label="Apple">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

export default function AisaPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const canvasRef = useRef(null);

  // Canvas particle neural animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight || 700);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
        height = canvas.height = canvas.parentElement.clientHeight || 700;
      }
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        color: i % 2 === 0 ? 'rgba(96, 165, 250, 0.6)' : 'rgba(168, 85, 247, 0.6)'
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(147, 197, 253, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
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
    };
  }, []);

  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setDemoSubmitting(true);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `[AISA Demo Request - ${formData.company || 'Individual'}] ${formData.message}`,
          subject: 'AISA Demo Request'
        })
      });

      if (res.ok) {
        setDemoSuccess(true);
        setTimeout(() => {
          setDemoModalOpen(false);
          setDemoSuccess(false);
          setFormData({ name: '', email: '', phone: '', company: '', message: '' });
        }, 2500);
      } else {
        alert('Could not submit demo request right now. Please try again.');
      }
    } catch (err) {
      console.error('Demo request error:', err);
      // Fallback optimistic message
      setDemoSuccess(true);
      setTimeout(() => {
        setDemoModalOpen(false);
        setDemoSuccess(false);
      }, 2500);
    } finally {
      setDemoSubmitting(false);
    }
  };

  return (
    <div className="aisa-page" style={{ background: '#020617', color: '#fff', overflow: 'hidden' }}>
      {/* HERO SECTION */}
      <section
        className="aisa-hero"
        style={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '120px 20px 60px'
        }}
      >
        {/* Immersive Glowing Lights */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              top: '5%',
              left: '10%',
              width: '45vw',
              height: '45vw',
              background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 75%)',
              filter: 'blur(80px)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '5%',
              right: '10%',
              width: '50vw',
              height: '50vw',
              background: 'radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 75%)',
              filter: 'blur(100px)'
            }}
          />
        </div>

        {/* 3D Neural Canvas */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          />
        </div>

        {/* Foreground Content */}
        <div
          className="aisa-hero-content"
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            maxWidth: '1000px',
            margin: '0 auto'
          }}
        >
          <div
            className="hero-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 22px',
              borderRadius: '999px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              color: '#a5b4fc',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '2rem',
              letterSpacing: '0.1em'
            }}
          >
            <i className="fa-solid fa-sparkles" style={{ color: '#818cf8' }}></i> Powered by UWO™
          </div>

          <h1
            className="hero-heading"
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 5rem)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '1.8rem'
            }}
          >
            Meet AISA™ <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #e879f9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              your AI Super Assistant
            </span>
          </h1>

          <p
            className="subtitle"
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
              color: 'rgba(203, 213, 225, 0.85)',
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.7
            }}
          >
            The AI Super Assistant that unifies your entire digital world into one intelligent platform.
          </p>

          <div
            className="aisa-cta-group"
            style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}
          >
            <a
              href="https://aisa24.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '16px 38px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '1.05rem',
                cursor: 'pointer',
                boxShadow: '0 20px 50px rgba(99, 102, 241, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none'
              }}
            >
              Get Early Access <i className="fa-solid fa-arrow-right"></i>
            </a>

            <button
              type="button"
              onClick={() => scrollToSection('platforms')}
              aria-label="Download AISA Mobile & Tablet App"
              style={{
                padding: '16px 36px',
                borderRadius: '16px',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(96, 165, 250, 0.4)',
                color: '#93c5fd',
                fontWeight: 800,
                fontSize: '1.05rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.22)';
                e.currentTarget.style.borderColor = '#60a5fa';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.4)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <i className="fa-solid fa-mobile-screen" style={{ color: '#60a5fa', fontSize: '1.25rem' }}></i>
              <span>Download App</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoModalOpen(true)}
              style={{
                padding: '16px 36px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '1.05rem',
                cursor: 'pointer',
                backdropFilter: 'blur(20px)'
              }}
            >
              Request Demo
            </button>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section style={{ background: '#010d1a', position: 'relative', padding: '100px 20px' }}>
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800 }}>
              Unlock <span style={{ color: '#D6A559' }}>Unprecedented</span>
              <br />
              Efficiency &amp; Creativity.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px',
              maxWidth: '1200px',
              margin: '0 auto'
            }}
          >
            <div
              className="problem-card"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '40px 30px',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="fa-solid fa-clock" style={{ fontSize: '36px', color: '#D6A559', marginBottom: '20px' }}></i>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>Reclaim Your Time</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Cut hours from your workday. AISA™ handles the heavy lifting, giving you back precious time for what truly
                matters.
              </p>
            </div>

            <div
              className="problem-card"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '40px 30px',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <i
                className="fa-solid fa-rocket"
                style={{ fontSize: '36px', color: '#60a5fa', marginBottom: '20px' }}
              ></i>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>Amplify Your Productivity</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Boost your output and achieve more with less effort, every single day, across every complex task.
              </p>
            </div>

            <div
              className="problem-card"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '40px 30px',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <i
                className="fa-solid fa-wand-magic-sparkles"
                style={{ fontSize: '36px', color: '#c084fc', marginBottom: '20px' }}
              ></i>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>Simplify Your Digital Life</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                One intuitive interface for every AI need means less fragmentation, zero complexity, and elevated clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MULTI-DEVICE PLATFORM AVAILABILITY SECTION */}
      <section
        id="platforms"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.15) 0%, rgba(2, 6, 23, 1) 75%)',
          position: 'relative',
          padding: '100px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                borderRadius: '50px',
                padding: '6px 20px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#a5b4fc',
                marginBottom: '16px',
                letterSpacing: '0.08em'
              }}
            >
              <i className="fa-solid fa-mobile-screen-button"></i>
              <span>MULTI-DEVICE ACCESSIBILITY</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: '16px',
                color: '#fff'
              }}
            >
              AISA™. <span style={{ background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #e879f9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Wherever You Work &amp; Create.</span>
            </h2>

            <p
              style={{
                color: 'rgba(203, 213, 225, 0.85)',
                fontSize: '1.05rem',
                maxWidth: '720px',
                margin: '0 auto',
                lineHeight: 1.7
              }}
            >
              Seamlessly transition between desktop browser multitasking, native Android mobility, and iOS Apple ecosystem with real-time synchronized AI reasoning.
            </p>
          </div>

          {/* 3 Platform Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}
          >
            {/* Card 1: Web Application */}
            <div
              style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#60a5fa';
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(59, 130, 246, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#93c5fd',
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '4px 14px',
                  borderRadius: '999px',
                  marginBottom: '20px'
                }}
              >
                Desktop &amp; Mobile Web
              </span>

              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '18px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px'
                }}
              >
                <WebBrowserRealIcon size={38} />
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
                Web Application
              </h3>

              <p style={{ fontSize: '0.9rem', color: 'rgba(203, 213, 225, 0.8)', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>
                Full-featured AI Super Assistant accessible directly from Chrome, Safari, Edge, or Firefox. Optimized for multi-monitor setups and large-screen productivity.
              </p>

              <a
                href={AISA_WEB_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 10px 25px rgba(99, 102, 241, 0.35)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 14px 30px rgba(99, 102, 241, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(99, 102, 241, 0.35)';
                }}
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                <span>Open Web App</span>
              </a>
            </div>

            {/* Card 2: Google Play Store */}
            <div
              style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#34d399';
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(52, 211, 153, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#6ee7b7',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '4px 14px',
                  borderRadius: '999px',
                  marginBottom: '20px'
                }}
              >
                Android APK / Play Store
              </span>

              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '18px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px'
                }}
              >
                <GooglePlayRealIcon size={34} />
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
                Google Play Store
              </h3>

              <p style={{ fontSize: '0.9rem', color: 'rgba(203, 213, 225, 0.8)', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>
                Native Android experience with voice AI intelligence, camera document scanner, instant push notifications, and biometric authentication for phones &amp; tablets.
              </p>

              <a
                href={AISA_PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download AISA on Google Play Store"
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.borderColor = '#60a5fa';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <i className="fa-brands fa-google-play" style={{ color: '#60a5fa' }}></i>
                <span>Google Play</span>
              </a>
            </div>

            {/* Card 3: Apple App Store */}
            <div
              style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#a78bfa';
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(167, 139, 250, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#e9d5ff',
                  background: 'rgba(168, 85, 247, 0.14)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  padding: '4px 14px',
                  borderRadius: '999px',
                  marginBottom: '20px'
                }}
              >
                iOS &amp; iPadOS Native
              </span>

              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '18px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px'
                }}
              >
                <AppleRealIcon size={34} />
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
                Apple App Store
              </h3>

              <p style={{ fontSize: '0.9rem', color: 'rgba(203, 213, 225, 0.8)', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>
                Tailored for iPhone and iPad with fluid Apple ergonomics, Face ID biometric protection, Siri shortcut integrations, and instant cross-device iCloud synchronization.
              </p>

              <a
                href={AISA_IOS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download AISA on Apple App Store"
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.borderColor = '#c084fc';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <i className="fa-brands fa-apple" style={{ fontSize: '1.15rem' }}></i>
                <span>App Store</span>
              </a>
            </div>
          </div>

          {/* Official Verification & App Metadata Strip */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '18px',
              padding: '18px 24px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              color: '#94a3b8',
              fontSize: '0.86rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: '1.1rem' }}></i>
              <span>Official UWO™ Apps: <strong>com.uwo.aisa</strong> (Google Play) &amp; <strong>ID: 6779135418</strong> (Apple App Store)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#F59E0B' }}>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </span>
              <span style={{ color: '#fff', fontWeight: 700 }}>5.0 Rating</span>
              <span>• Multilingual AI Reasoning &amp; Instant Sync</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section style={{ background: '#020617', position: 'relative', overflow: 'hidden', padding: '100px 20px' }}>
        <div className="container" style={{ position: 'relative', zIndex: 5, textAlign: 'center', maxWidth: '850px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(214,165,89,0.1)',
              border: '1px solid rgba(214,165,89,0.3)',
              borderRadius: '50px',
              padding: '10px 24px',
              marginBottom: '30px'
            }}
          >
            <i className="fa-solid fa-shield-halved" style={{ color: '#D6A559' }}></i>
            <span style={{ color: '#D6A559', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '1px' }}>
              TRUSTED INNOVATION
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', lineHeight: 1.2, marginBottom: '25px', fontWeight: 800 }}>
            Innovation You Can Trust,
            <br />
            <span style={{ color: '#D6A559' }}>Backed by Proven Expertise.</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}>
            AISA™ is the flagship AI innovation from <strong style={{ color: '#fff' }}>UWO™ (Unified Web Options &amp; Services Pvt. Ltd.)</strong>,
            an IT-registered technology company founded in 2020 in Jabalpur, India. As pioneers in AI solutions and business automation, we’re
            building a future where AI empowers everyone, simply and securely.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        style={{
          textAlign: 'center',
          background: 'linear-gradient(180deg, #020617 0%, #080e22 100%)',
          padding: '100px 20px',
          position: 'relative'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 5 }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, fontWeight: 900, marginBottom: '20px' }}>
            Your Future of Productivity
            <br />
            <span style={{ color: '#D6A559' }}>Starts Now.</span>
          </h2>
          <p
            style={{
              fontSize: '1.15rem',
              color: 'rgba(255,255,255,0.7)',
              margin: '0 auto 40px',
              maxWidth: '640px',
              lineHeight: 1.7
            }}
          >
            Ready to experience the future of work? Unify your potential, eliminate complexity, and redefine what's
            possible with AISA™.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="https://aisa24.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 36px',
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #D6A559, #FABE56)',
                color: '#000',
                fontWeight: 800,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 10px 30px rgba(214, 165, 89, 0.3)'
              }}
            >
              Get Early Access <i className="fa-solid fa-arrow-right"></i>
            </a>

            <button
              type="button"
              onClick={() => scrollToSection('platforms')}
              aria-label="Download AISA Applications"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 34px',
                borderRadius: '50px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
                e.currentTarget.style.borderColor = '#60a5fa';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fa-solid fa-mobile-screen" style={{ color: '#60a5fa' }}></i>
              <span>Download the App</span>
            </button>
          </div>
        </div>
      </section>

      {/* DEMO MODAL */}
      {demoModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setDemoModalOpen(false)}
        >
          <div
            style={{
              background: '#0B1120',
              border: '1.5px solid rgba(214, 165, 89, 0.3)',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '540px',
              width: '100%',
              position: 'relative',
              boxShadow: '0 25px 80px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDemoModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>

            {demoSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <i
                  className="fa-solid fa-check"
                  style={{
                    fontSize: '40px',
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '20px',
                    borderRadius: '50%',
                    marginBottom: '20px'
                  }}
                ></i>
                <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '10px' }}>Request Received!</h3>
                <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                  Thank you! Our team will contact you shortly to schedule your personalized AISA™ walkthrough.
                </p>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                  Request a Demo
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '25px' }}>
                  Experience the future of AI firsthand. Our specialists will guide you through the AISA™ ecosystem.
                </p>

                <form onSubmit={handleDemoSubmit}>
                  <div style={{ marginBottom: '16px' }}>
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 18px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        color: '#fff',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 18px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        color: '#fff',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 18px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        color: '#fff',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 18px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        color: '#fff',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '22px' }}>
                    <textarea
                      rows={3}
                      placeholder="How can we help? *"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 18px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        color: '#fff',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={demoSubmitting}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '1rem',
                      cursor: demoSubmitting ? 'wait' : 'pointer'
                    }}
                  >
                    {demoSubmitting ? 'Submitting...' : 'Send Request'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
