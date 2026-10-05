import React, { useState, useEffect, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { fetchProjects, API_URL } from '../services/api';

export default function HomePage() {
  const { openEarnRefer } = useOutletContext() || {};
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const trackRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadProjects() {
      try {
        const data = await fetchProjects();
        const defaultList = getDefaultProjects();
        // Filter out AISA Connect
        const validApiData = Array.isArray(data) 
          ? data.filter(p => !((p.name || '').toLowerCase().includes('aisa connect')))
          : [];

        if (isMounted && validApiData.length > 0) {
          // Merge API data with defaultList to guarantee all flagship projects are present
          const existingNames = new Set(validApiData.map(p => (p.name || '').toLowerCase().trim()));
          const missingProjects = defaultList.filter(dp => !existingNames.has(dp.name.toLowerCase().trim()));
          const combined = [...validApiData, ...missingProjects].map(p => {
            const nameLower = (p.name || '').toLowerCase();
            if (nameLower.includes('ads') || nameLower.includes('ai ads') || nameLower.includes('aiads')) {
              return { ...p, project_url: '/ai-ads' };
            }
            if (nameLower.includes('education') || nameLower.includes('aieducation')) {
              return { ...p, project_url: '/ai-education' };
            }
            if (nameLower.includes('legal')) {
              return { ...p, project_url: '/ai-legal' };
            }
            if (nameLower.includes('uwo connect') || nameLower.includes('uwoconnect')) {
              return { ...p, project_url: '/projects/uwo-connect' };
            }
            return p;
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
        short_description: "UWO™'s immersive AI Super Assistant designed to unify your entire digital world into a single cohesive, intelligent platform.",
        display_order: 1
      },
      {
        name: 'AI Mall',
        is_featured: true,
        project_url: 'https://aimall24.com/',
        logo: '/images/aimall-logo.webp',
        short_description: "UWO™'s flagship AI platform built to enable the deployment, orchestration, and global distribution of AI agents at scale. Launching with the first 100 AI applications as the foundation of its global ecosystem.",
        display_order: 2
      },
      {
        name: 'AI LEGAL',
        is_featured: true,
        project_url: '/ai-legal',
        logo: '/images/ailegallogo.png',
        short_description: 'Autonomous legal intelligence platform engineered for contract drafting, compliance auditing, litigation research, and automated risk analysis.',
        display_order: 3
      },
      {
        name: 'UWO Connect',
        is_featured: true,
        project_url: '/projects/uwo-connect',
        logo: '/images/uwoconnectlogo.png',
        short_description: 'Unified AI-powered enterprise communication & customer interaction platform connecting CRM, support, and omnichannel workflows.',
        display_order: 4
      },
      {
        name: 'AI ADS',
        is_featured: true,
        project_url: '/ai-ads',
        logo: '/images/aiads-logo.png',
        short_description: 'Autonomous Content Intelligence & 8K Creative Studio for brand-aligned ad creatives, automated multi-channel campaigns, and marketing ROI.',
        display_order: 5
      },
      {
        name: 'AI-Education',
        is_featured: true,
        project_url: '/ai-education',
        logo: '/images/ai-education-logo.jpg',
        short_description: 'Unified Enterprise Digital Campus & AI Collaboration Operating System tailored for K-12 Schools, Colleges, and Universities.',
        display_order: 6
      },
      {
        name: 'EFV',
        is_featured: true,
        project_url: '/efv',
        logo: '/images/efv-logo.png',
        short_description: 'Enterprise Functional Visualizer - high-performance real-time visual modeling and enterprise architecture engine.',
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
            Building <span className="text-gradient">Intelligent Digital Platforms</span> for a Connected World
          </h1>

          <p>
            UWO<sup>&trade;</sup> (Unified Web Options &amp; Services) designs AI-driven platforms, enterprise systems,
            and next-generation intelligence frameworks that scale across industries.
          </p>

          <div className="hero-cta-wrapper">
            <Link to="/about" className="btn btn-primary">
              Explore Our Platforms
            </Link>

            <Link to="/contact" className="btn btn-primary">
              Partner With Us
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

      {/* ================= FLAGSHIP PROJECTS (COMPACT CAROUSEL) ================= */}
      <section className="section flagship-white" id="projects" style={{ position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 32px auto' }}>
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
                    : { href: project.project_url, target: '_blank', rel: 'noopener noreferrer', className: 'project-carousel-card' };

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
