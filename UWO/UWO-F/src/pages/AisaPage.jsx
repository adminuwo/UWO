import React, { useState, useEffect, useRef } from 'react';
import { getApiUrl } from '../services/api';

export const AISA_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.uwo.aisa&pcampaignid=web_share';
export const AISA_WEB_URL = 'https://aisa24.com';

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

            <a
              href={AISA_PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download AISA on Google Play Store"
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
                textDecoration: 'none',
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
              <i className="fa-brands fa-google-play" style={{ color: '#60a5fa', fontSize: '1.25rem' }}></i>
              <span>Google Play</span>
            </a>

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

      {/* MOBILE APP SHOWCASE SECTION */}
      <section
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.15) 0%, rgba(2, 6, 23, 1) 75%)',
          position: 'relative',
          padding: '90px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: '28px',
              padding: 'clamp(36px, 5vw, 60px)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
              alignItems: 'center',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  borderRadius: '50px',
                  padding: '6px 18px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#93c5fd',
                  marginBottom: '20px',
                  letterSpacing: '0.05em'
                }}
              >
                <i className="fa-brands fa-android" style={{ color: '#34d399' }}></i>
                <span>NOW AVAILABLE ON ANDROID</span>
              </div>

              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '18px', color: '#fff' }}>
                Take AISA™ Everywhere. <br />
                <span style={{ background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Productivity on the Go.
                </span>
              </h2>

              <p style={{ color: 'rgba(203, 213, 225, 0.85)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '28px' }}>
                Download the official AISA app from the Google Play Store. Carry the power of your AI Super Assistant with voice intelligence, instant reasoning, multimodal document analysis, and 24/7 cross-device synchronization right in your pocket.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <a
                  href={AISA_PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get AISA on Google Play Store"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 32px',
                    borderRadius: '14px',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    fontWeight: 800,
                    fontSize: '1rem',
                    textDecoration: 'none',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 16px 36px rgba(96, 165, 250, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.35)';
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M38.8 9.5C28.2 15.6 21.3 27 21.3 40.5v431c0 13.5 6.9 24.9 17.5 31L257.6 256 38.8 9.5z" fill="#00A0FF" />
                    <path d="M331.4 182.2L257.6 256l73.8 73.8 84.7-48.7c16.2-9.3 26.2-26.6 26.2-45.1s-10-35.8-26.2-45.1l-84.7-48.7z" fill="#FFDA00" />
                    <path d="M257.6 256L38.8 474.7c6.1 3.5 13.2 5.5 20.8 5.5 8.7 0 17.1-2.6 24.2-6.7l227.6-130.8L257.6 256z" fill="#FF3A44" />
                    <path d="M311.4 168.3L83.8 37.5C76.7 33.4 68.3 30.8 59.6 30.8c-7.6 0-14.7 2-20.8 5.5L257.6 256l53.8-87.7z" fill="#00E676" />
                  </svg>
                  <span>GET IT ON Google Play</span>
                </a>

                <a
                  href={AISA_WEB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 26px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textDecoration: 'none'
                  }}
                >
                  <i className="fa-solid fa-globe"></i>
                  <span>Launch Web App</span>
                </a>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '30px 24px',
                  display: 'inline-block',
                  maxWidth: '360px',
                  width: '100%'
                }}
              >
                <div style={{ width: '64px', height: '64px', margin: '0 auto 16px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-robot" style={{ fontSize: '32px', color: '#fff' }}></i>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px', color: '#fff' }}>AISA™ App</h3>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '14px' }}>com.uwo.aisa • Android</span>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', color: '#F59E0B', fontSize: '0.85rem', marginBottom: '14px' }}>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <span style={{ color: '#fff', marginLeft: '6px', fontWeight: 700 }}>Official App</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                  Instant setup • Cloud intelligence • Multilingual AI reasoning
                </p>
              </div>
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

            <a
              href={AISA_PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download AISA on Google Play"
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
                textDecoration: 'none',
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
              <i className="fa-brands fa-google-play" style={{ color: '#60a5fa' }}></i>
              <span>Get on Google Play</span>
            </a>
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
