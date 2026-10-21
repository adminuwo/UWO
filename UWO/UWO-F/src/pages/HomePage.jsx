import React, { useState, useEffect, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { fetchProjects, API_URL } from '../services/api';

export default function HomePage() {
  const { openEarnRefer } = useOutletContext() || {};
  const [projects, setProjects] = useState(getDefaultProjects());
  const [loadingProjects, setLoadingProjects] = useState(false);
  const trackRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadProjects() {
      try {
        const data = await fetchProjects();
        const defaultList = getDefaultProjects();

        // Helper to normalize project names for collision-free deduplication
        const normalizeKey = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
        const defaultMap = new Map(defaultList.map(d => [normalizeKey(d.name), d]));

        // Filter out AISA Connect and invalid entries
        const validApiData = Array.isArray(data)
          ? data.filter(p => !((p.name || '').toLowerCase().includes('aisa connect')))
          : [];

        if (isMounted && validApiData.length > 0) {
          // Deduplicate API data itself by normalized key
          const seenKeys = new Set();
          const uniqueApiData = [];
          for (const p of validApiData) {
            const k = normalizeKey(p.name);
            if (k && !seenKeys.has(k)) {
              seenKeys.add(k);
              uniqueApiData.push(p);
            }
          }

          // Merge API data with defaultList without duplicating any existing projects
          const missingProjects = defaultList.filter(dp => !seenKeys.has(normalizeKey(dp.name)));
          const combined = [...uniqueApiData, ...missingProjects].map(p => {
            const key = normalizeKey(p.name);
            const defItem = defaultMap.get(key) || {};

            let targetUrl = p.project_url || defItem.project_url;
            if (key.includes('ads')) {
              targetUrl = '/ai-ads';
            } else if (key.includes('education')) {
              targetUrl = '/ai-education';
            } else if (key.includes('legal')) {
              targetUrl = '/ai-legal';
            } else if (key.includes('uwoconnect') || (p.name || '').toLowerCase().includes('connect')) {
              targetUrl = '/projects/uwo-connect';
            }

            // Standardize canonical title (e.g., 'AI Education' rather than 'AI-Education')
            const canonicalName = defItem.name || p.name;

            return {
              ...defItem,
              ...p,
              name: canonicalName,
              project_url: targetUrl,
              target_audience: defItem.target_audience || p.target_audience || 'Enterprise',
              status: 'Live',
              short_description: defItem.short_description || p.short_description,
              display_order: p.display_order ?? defItem.display_order ?? 99
            };
          }).sort((a, b) => (a.display_order || 99) - (b.display_order || 99));

          setProjects(combined);
        } else if (isMounted) {
          setProjects(defaultList);
        }
      } catch (err) {
        if (isMounted) {
          setProjects(getDefaultProjects());
        }
      } finally {
        if (isMounted) setLoadingProjects(false);
      }
    }
    loadProjects();
    return () => { isMounted = false; };
  }, []);

  function getDefaultProjects() {
    return [
      {
        name: 'AISA',
        is_featured: true,
        project_url: '/aisa',
        logo: '/images/aisa-logo.svg',
        target_audience: 'Individuals & Professionals',
        status: 'Live',
        short_description: 'AI assistance for everyday questions, content creation, and personal productivity.',
        display_order: 1
      },
      {
        name: 'AI Mall',
        is_featured: true,
        project_url: 'https://aimall24.com/',
        logo: '/images/aimall-logo.webp',
        target_audience: 'Developers & Enterprises',
        status: 'Live',
        short_description: 'Global ecosystem for deploying, discovering, and orchestrating intelligent AI agents at scale.',
        display_order: 2
      },
      {
        name: 'AI LEGAL',
        is_featured: true,
        project_url: '/ai-legal',
        logo: '/images/ailegallogo.png',
        target_audience: 'Advocates, Law Firms & Legal Teams',
        status: 'Live',
        short_description: 'AI-assisted research, contract drafting, document analysis, and matter workflows.',
        display_order: 3
      },
      {
        name: 'UWO Connect',
        is_featured: true,
        project_url: '/projects/uwo-connect',
        logo: '/images/uwoconnectlogo.png',
        target_audience: 'SMEs, Sales Teams & Agencies',
        status: 'Live',
        short_description: 'Bring customer conversations, leads, team follow-ups, and business workflows into one workspace.',
        display_order: 4
      },
      {
        name: 'AI ADS',
        is_featured: true,
        project_url: '/ai-ads',
        logo: '/images/aiads-logo.png',
        target_audience: 'Marketing Teams & Brand Managers',
        status: 'Live',
        short_description: 'Plan, create, and organise brand-aligned campaign assets, ad copy, and creative strategies with AI.',
        display_order: 5
      },
      {
        name: 'AI Education',
        is_featured: true,
        project_url: '/ai-education',
        logo: '/images/ai-education-logo.jpg',
        target_audience: 'Universities & Schools',
        status: 'Live',
        short_description: 'Unified Enterprise Digital Campus & AI Collaboration Operating System tailored for K-12 Schools, Colleges, and Universities.',
        display_order: 6
      },
      {
        name: 'EFV',
        is_featured: true,
        project_url: '/efv',
        logo: '/images/efv-logo.png',
        target_audience: 'Enterprise Architects & Leaders',
        status: 'Live',
        short_description: 'Discover foundational enterprise frameworks, published research volumes, and strategic methodologies.',
        display_order: 7
      }
    ];
  }

  const getLogoUrl = (logo, projectName = '') => {
    const nameLower = (projectName || '').toLowerCase();
    if (nameLower.includes('aimall') || nameLower.includes('ai mall')) {
      return '/images/aimall-logo.webp';
    }
    if (nameLower.includes('aisa connect')) {
      return '/images/aisa-connect-logo.png';
    }
    if (nameLower.includes('education') || nameLower.includes('convee')) {
      return '/images/ai-education-logo.jpg';
    }
    if (nameLower.includes('legal')) {
      return '/images/ailegallogo.png';
    }
    if (nameLower.includes('uwo connect') || nameLower.includes('uwoconnect')) {
      return '/images/uwoconnectlogo.png';
    }
    if (nameLower.includes('ads') || nameLower.includes('ai ads') || nameLower.includes('aiads')) {
      return '/images/aiads-logo.png';
    }
    if (nameLower.includes('aisa')) {
      return '/images/aisa-logo.svg';
    }
    if (nameLower.includes('efv')) {
      return '/images/efv-logo.png';
    }

    if (!logo) return '/images/uwo-logo.png';
    const cloudRunBase = 'https://uwo24.com';
    if (logo.includes('storage.googleapis.com/uwo-document/')) {
      const objectPath = logo.split('storage.googleapis.com/uwo-document/')[1];
      return `${cloudRunBase}/api/media/${objectPath.replace(/^\/+/, '')}`;
    }
    if (logo.includes('/api/media/')) {
      const mediaPath = logo.split('/api/media/')[1];
      return `${cloudRunBase}/api/media/${mediaPath.replace(/^\/+/, '')}`;
    }
    return logo.startsWith('http') || logo.startsWith('/') ? logo : `${API_URL}/${logo}`;
  };

  const scrollCarousel = (direction) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const card = track.querySelector('.project-carousel-card');
    const scrollAmount = card ? (card.offsetWidth + 20) : 320;

    if (direction === 'next') {
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 15) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    } else {
      if (track.scrollLeft <= 15) {
        track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const scrollToSlide = (index) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const cards = track.querySelectorAll('.project-carousel-card');
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  };

  const handleTrackScroll = () => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const card = track.querySelector('.project-carousel-card');
    if (card) {
      const cardWidth = card.offsetWidth + 20;
      const newIndex = Math.min(
        projects.length - 1,
        Math.max(0, Math.round(track.scrollLeft / cardWidth))
      );
      setActiveDot(newIndex);
    }
  };

  // Auto-play carousel every 4 seconds when user is not hovering
  useEffect(() => {
    if (loadingProjects || projects.length === 0 || isHovered) return;
    const interval = setInterval(() => {
      scrollCarousel('next');
    }, 4000);
    return () => clearInterval(interval);
  }, [loadingProjects, projects.length, isHovered]);

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <video autoPlay muted loop playsInline className="hero-video">
          <source src="/images/WhatsApp Video 2026-01-02 at 5.19.31 PM.mp4" type="video/mp4" />
        </video>
        <div className="hero-content">
          <h1>
            Building <span className="text-gradient">Connected AI Platforms</span> for Work, Business and Education
          </h1>

          <p>
            UWO<sup>&trade;</sup> builds AI assistants, business automation platforms and education ecosystems that
            help people and organisations simplify everyday work.
          </p>

          <div className="hero-cta-wrapper">
            <a
              href="#projects"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Our Platforms
            </a>

            <Link to="/contact" className="btn btn-primary">
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHAT WE BUILD ================= */}
      <section className="section section-gold">
        <div className="container">
          <h2 className="section-title">Technology That Scales With Intelligence</h2>
          <p className="section-subtitle">
            We build platforms where intelligence is embedded at the system level &mdash; enabling scalability, adaptability, and long-term relevance.
          </p>

          <div className="features-grid">
            {/* CARD 1 */}
            <div className="feature-card">
              <h3>AI Platforms &amp; Ecosystems</h3>
              <h4>Multi-Agent Intelligence</h4>
              <p>
                UWO<sup>&trade;</sup> designs AI-native platforms powered by adaptive intelligence models.
                Seamless interaction between users, vendors, and AI systems.
              </p>
              <ul>
                <li>Multi-agent system design</li>
                <li>AI orchestration layers</li>
                <li>Platform-level intelligence</li>
              </ul>
            </div>

            {/* CARD 2 */}
            <div className="feature-card">
              <h3>Enterprise Digital Solutions</h3>
              <h4>Intelligent Automation</h4>
              <p>
                We build enterprise-grade digital solutions combining automation,
                analytics, and system integration for real-world impact.
              </p>
              <ul>
                <li>Workflow automation</li>
                <li>Intelligent analytics</li>
                <li>Secure enterprise systems</li>
              </ul>
            </div>

            {/* CARD 3 */}
            <div className="feature-card">
              <h3>Research-Driven Incubation</h3>
              <h4>AI &mdash; Human Interaction</h4>
              <p>
                Investigating proprietary research frameworks that explore intelligence,
                cognition, and human-system interaction.
              </p>
              <ul>
                <li>Cognitive intelligence research</li>
                <li>Experimental frameworks</li>
                <li>Long-horizon product vision</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FLAGSHIP PROJECTS (EXPANDED FULL-SCREEN CAROUSEL) ================= */}
      <section className="section flagship-white" id="projects" style={{ position: 'relative' }}>
        <div className="flagship-full-container">
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 36px auto' }}>
            <h2 className="section-title">Our Flagship Projects</h2>
            <p className="section-subtitle">
              Pioneering the future of digital commerce, enterprise intelligence, and cognitive modeling.
            </p>
          </div>

          <div
            className="projects-carousel-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Left Nav Arrow Button */}
            <button
              type="button"
              className="projects-carousel-arrow prev"
              onClick={() => scrollCarousel('prev')}
              aria-label="Previous Projects"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Scrollable Track */}
            <div
              ref={trackRef}
              className="projects-carousel-track"
              id="dynamic-project-cards"
              onScroll={handleTrackScroll}
            >
              {loadingProjects ? (
                <div style={{ textAlign: 'center', width: '100%', padding: '40px', color: '#94a3b8' }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#D6A559' }}></i>
                  <p style={{ marginTop: '15px', fontWeight: 600 }}>Loading Flagship Projects...</p>
                </div>
              ) : projects.length === 0 ? (
                <p style={{ textAlign: 'center', width: '100%', color: '#94a3b8' }}>New projects coming soon...</p>
              ) : (
                projects.map((project, index) => {
                  const isSpaRoute = project.project_url && project.project_url.startsWith('/') && !project.project_url.includes('aisa-connect');
                  const CardTag = isSpaRoute ? Link : 'a';
                  const linkAttributes = isSpaRoute
                    ? { to: project.project_url, className: 'project-carousel-card' }
                    : { href: project.project_url, className: 'project-carousel-card' };

                  return (
                    <CardTag key={index} {...linkAttributes}>
                      <img
                        src={getLogoUrl(project.logo, project.name)}
                        alt={project.name}
                        className="project-icon-compact"
                        onError={(e) => {
                          const nameLower = (project.name || '').toLowerCase();
                          if (nameLower.includes('aimall') || nameLower.includes('ai mall')) {
                            e.currentTarget.src = '/images/aimall-logo.webp';
                          } else if (nameLower.includes('aisa connect')) {
                            e.currentTarget.src = '/images/aisa-connect-logo.png';
                          } else if (nameLower.includes('legal')) {
                            e.currentTarget.src = '/images/ailegallogo.png';
                          } else if (nameLower.includes('uwo connect') || nameLower.includes('uwoconnect')) {
                            e.currentTarget.src = '/images/uwoconnectlogo.png';
                          } else if (nameLower.includes('ads') || nameLower.includes('ai ads') || nameLower.includes('aiads')) {
                            e.currentTarget.src = '/images/aiads-logo.png';
                          } else if (nameLower.includes('education') || nameLower.includes('convee')) {
                            e.currentTarget.src = '/images/ai-education-logo.jpg';
                          } else if (nameLower.includes('aisa')) {
                            e.currentTarget.src = '/images/aisa-logo.svg';
                          } else if (nameLower.includes('efv')) {
                            e.currentTarget.src = '/images/efv-logo.png';
                          } else {
                            e.currentTarget.src = '/images/uwo-logo.png';
                          }
                        }}
                      />
                      <h3 className="project-card-title">
                        {project.name}
                        {project.is_featured && <sup>&trade;</sup>}
                      </h3>

                      {/* Audience Pill shifted below logo and name */}
                      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '14px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 650, color: '#475569', background: '#f1f5f9', padding: '4px 14px', borderRadius: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '260px' }}>
                          {project.target_audience || 'Enterprise'}
                        </span>
                      </div>

                      <p className="project-card-desc">{project.short_description}</p>
                      <div className="project-card-cta">
                        <span>Explore Platform</span>
                        <ArrowRight size={13} />
                      </div>
                    </CardTag>
                  );
                })
              )}
            </div>

            {/* Right Nav Arrow Button */}
            <button
              type="button"
              className="projects-carousel-arrow next"
              onClick={() => scrollCarousel('next')}
              aria-label="Next Projects"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Dots Indicator */}
          {!loadingProjects && projects.length > 0 && (
            <div className="projects-carousel-dots">
              {projects.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`projects-carousel-dot ${activeDot === idx ? 'active' : ''}`}
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= CREDENTIALS & INSTITUTIONAL ECOSYSTEM ================= */}
      <section className="section section-gold" style={{ background: '#FAF7F0', borderTop: '1px solid #E8DFCE', borderBottom: '1px solid #E8DFCE' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 36px auto' }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.88rem', fontWeight: 700, color: '#D6A559', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Credibility &amp; Ecosystem
            </span>
            <h2 className="section-title" style={{ marginTop: '8px', marginBottom: '12px' }}>Company Credentials &amp; Recognition</h2>
            <p className="section-subtitle">
              Engineered with institutional backing, verifiable startup recognition, and strict enterprise compliance.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* DPIIT Recognition */}
            <div style={{ background: '#F0EAD8', border: '1px solid #DDD0B8', borderRadius: '18px', padding: '28px 24px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <img
                  src="/images/startup-india-logo.png"
                  alt="DPIIT Recognised"
                  style={{ maxHeight: '54px', maxWidth: '160px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'inline-block';
                  }}
                />
                <i className="fa-solid fa-award" style={{ display: 'none', color: '#B48E3D', fontSize: '32px' }}></i>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#000', margin: '0 0 8px' }}>DPIIT Recognised</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                Recognised startup under the Startup India initiative by the Department for Promotion of Industry and Internal Trade (DPIIT), Government of India.
              </p>
            </div>

            {/* IIT Ropar TBIF */}
            <div style={{ background: '#F0EAD8', border: '1px solid #DDD0B8', borderRadius: '18px', padding: '28px 24px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <img
                  src="/images/tbif-logo.png"
                  alt="IIT Ropar – TBIF Incubated"
                  style={{ maxHeight: '54px', maxWidth: '160px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'inline-block';
                  }}
                />
                <i className="fa-solid fa-graduation-cap" style={{ display: 'none', color: '#B48E3D', fontSize: '32px' }}></i>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#000', margin: '0 0 8px' }}>IIT Ropar &ndash; TBIF Incubated</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                Incubated at IIT Ropar &ndash; Technology Business Incubator Foundation, receiving ecosystem mentorship and technology infrastructure support.
              </p>
            </div>

            {/* D-U-N-S Registered */}
            <div style={{ background: '#F0EAD8', border: '1px solid #DDD0B8', borderRadius: '18px', padding: '28px 24px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <img
                  src="/images/duns-logo.png"
                  alt="D-U-N-S® Registered"
                  style={{ maxHeight: '54px', maxWidth: '110px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'inline-block';
                  }}
                />
                <i className="fa-solid fa-shield" style={{ display: 'none', color: '#B48E3D', fontSize: '32px' }}></i>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#000', margin: '0 0 8px' }}>D-U-N-S&reg; Registered</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                Globally verified commercial identity registered with Dun &amp; Bradstreet, providing standard international enterprise verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GLOBAL TRUST ================= */}
      <section className="section trust-section">
        <div className="container">
          <h2 className="section-title">Built for Global Scale</h2>
          <p className="section-subtitle">
            Designed with security, extensibility, and compliance in mind.
          </p>

          <div className="trust-grid">
            <div className="trust-item"><span>✦</span> Cloud-native Architecture</div>
            <div className="trust-item"><span>✦</span> Enterprise Security</div>
            <div className="trust-item"><span>✦</span> API-first Design</div>
            <div className="trust-item"><span>✦</span> Modular Scalability</div>
          </div>
        </div>
      </section>
    </>
  );
}
