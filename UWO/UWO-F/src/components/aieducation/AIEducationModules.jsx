import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, FileCheck2, UserCheck, MessageSquare, 
  Receipt, ShieldCheck,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const ROTATING_WORDS = [
  'Functionalities.',
  'Capabilities.',
  'Operations.',
  'Workflows.'
];

const MODULES_DATA = [
  {
    id: 'timetable',
    code: 'MOD-01',
    title: 'Smart Timetable & Proxy',
    desc: 'Automated 8-period schedules with instant substitute proxy.',
    icon: Calendar,
    color: '#4F46E5',
    bg: '#EEF2FF',
    image: '/images/aieducation/mod-timetable-3d.png'
  },
  {
    id: 'exams',
    code: 'MOD-02',
    title: 'Exams & Digital Cards',
    desc: 'Paperless exams, dynamic QR hall tickets, and auto-grading.',
    icon: FileCheck2,
    color: '#0EA5E9',
    bg: '#E0F2FE',
    image: '/images/aieducation/mod-exams-3d.png'
  },
  {
    id: 'admissions',
    code: 'MOD-03',
    title: 'Admissions & Student IDs',
    desc: 'Online applicant workflows, merit rosters, and NFC digital IDs.',
    icon: UserCheck,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    image: '/images/aieducation/mod-admissions-3d.png'
  },
  {
    id: 'communication',
    code: 'MOD-04',
    title: 'Campus Chat & Alerts',
    desc: 'Official circulars, homework broadcasts, and WhatsApp alerts.',
    icon: MessageSquare,
    color: '#10B981',
    bg: '#ECFDF5',
    image: '/images/aieducation/ai-tutor-robot.png'
  },
  {
    id: 'finance',
    code: 'MOD-05',
    title: 'Fee Collection & Tally',
    desc: 'Online fee gateway with auto-sync to Tally ERP 9 / Prime.',
    icon: Receipt,
    color: '#F59E0B',
    bg: '#FEF3C7',
    image: '/images/aieducation/math-matrix-geometry-nobg.png'
  },
  {
    id: 'guardrails',
    code: 'MOD-06',
    title: 'Syllabus AI Guardrails',
    desc: 'Strict textbook-grounded answers with zero hallucination.',
    icon: ShieldCheck,
    color: '#EC4899',
    bg: '#FDF2F8',
    image: '/images/aieducation/law-justice-cyber-nobg.png'
  }
];

export default function AIEducationModules() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  // Rotating keyword timer (matching hero section animation cadence)
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Find closest card to viewport left edge
      const containerLeft = scrollRef.current.getBoundingClientRect().left;
      const cards = Array.from(scrollRef.current.children);
      
      let closestIdx = 0;
      let minDistance = Infinity;
      
      cards.forEach((card, idx) => {
        const cardLeft = card.getBoundingClientRect().left;
        const dist = Math.abs(cardLeft - containerLeft);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });
      
      setActiveIndex(closestIdx);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const targetCard = scrollRef.current.children[index];
      if (targetCard) {
        targetCard.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start'
        });
      }
    }
  };

  const handleScroll = (direction) => {
    const nextIndex = direction === 'left' 
      ? Math.max(activeIndex - 1, 0)
      : Math.min(activeIndex + 1, MODULES_DATA.length - 1);
    scrollToIndex(nextIndex);
  };

  return (
    <section className="aied-section-modules" id="modules-section">
      <div className="aied-container">
        
        {/* Centered Section Header with Rotating Text Animation */}
        <div className="aied-modules-header-centered">
          <h2 className="aied-section-title">
            Core Web & App{' '}
            <span className="aied-rotating-wrapper">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  className="aied-hero-accent"
                  initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -22, filter: 'blur(8px)' }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h2>
          <p className="aied-section-subtitle">
            Everything your campus needs in one unified, high-performance platform.
          </p>
        </div>

        {/* Contained Horizontal Row Track / Carousel Container */}
        <div className="aied-carousel-contained-wrapper">
          <div 
            className="aied-modules-row-track" 
            ref={scrollRef}
          >
            {MODULES_DATA.map((module) => {
              const Icon = module.icon;
              return (
                <div 
                  key={module.id} 
                  className="aied-module-row-card"
                  style={{ '--module-accent': module.color }}
                >
                  {/* Visual 3D Artwork Frame */}
                  <div 
                    className="aied-card-artwork-frame"
                    style={{ background: `linear-gradient(150deg, #FFFFFF 0%, ${module.bg} 100%)` }}
                  >
                    <img 
                      src={module.image} 
                      alt={module.title}
                      className="aied-card-3d-visual"
                      loading="lazy"
                    />

                    {/* Top Row: Icon Wrap + Code */}
                    <div className="aied-card-artwork-top">
                      <div 
                        className="aied-module-icon-wrap"
                        style={{ background: 'rgba(255, 255, 255, 0.95)', color: module.color }}
                      >
                        <Icon size={18} />
                      </div>
                      <span className="aied-module-code">{module.code}</span>
                    </div>
                  </div>

                  {/* Minimal Card Body: Title + 1-Line Subtitle Only */}
                  <div className="aied-card-body-content">
                    <h3 className="aied-module-title">{module.title}</h3>
                    <p className="aied-module-desc">{module.desc}</p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Interactive Nav Controls: Numbers Centered Between Left & Right Arrows */}
        <div className="aied-modules-bottom-controls">
          <button 
            type="button"
            className={`aied-carousel-nav-btn ${!canScrollLeft ? 'is-disabled' : ''}`}
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="aied-modules-counter">
            <span className="counter-current">0{activeIndex + 1}</span>
            <span className="counter-sep">/</span>
            <span className="counter-total">0{MODULES_DATA.length}</span>
          </div>

          <button 
            type="button"
            className={`aied-carousel-nav-btn ${!canScrollRight ? 'is-disabled' : ''}`}
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Bottom Pagination Dots */}
        <div className="aied-carousel-dots">
          {MODULES_DATA.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`aied-carousel-dot ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to module ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
