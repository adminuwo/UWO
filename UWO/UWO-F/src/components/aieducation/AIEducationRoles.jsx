import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, School, Users, Building2, BookOpen, 
  Target, Calendar, Sparkles, ArrowRight, CheckCircle2,
  FileText, Clock, Bell, Award, CreditCard, ShieldCheck,
  Layers, ChevronRight
} from 'lucide-react';

const AUDIENCE_TABS = [
  { id: 'students', label: 'Students', icon: GraduationCap },
  { id: 'faculty', label: 'Faculty', icon: School },
  { id: 'parents', label: 'Parents', icon: Users },
  { id: 'admin', label: 'Administration', icon: Building2 }
];

const AUDIENCE_CONTENT = {
  students: {
    eyebrow: 'MADE FOR STUDENTS',
    heading: 'Everything you need to learn better.',
    subtext: 'Study smarter, stay organized, and clear your doubts faster.',
    features: [
      {
        icon: BookOpen,
        title: 'AI Textbook Tutor',
        desc: 'Instant answers with verified page and chapter citations.'
      },
      {
        icon: Target,
        title: 'Smart Practice',
        desc: 'Adaptive micro-quizzes matched to your curriculum pace.'
      },
      {
        icon: Calendar,
        title: 'Attendance & Schedule',
        desc: 'Live timetable, class check-ins, and dynamic QR passes.'
      }
    ],
    preview: {
      header: 'My Learning',
      status: 'AI Tutor Ready',
      chapterTag: 'Physics · NCERT Part 1',
      chapterTitle: 'Chapter 07 · Rotational Motion',
      chapterCitation: 'Page 168 · §7.12 Theorem 7.4',
      streak: '5-Day Study Streak 🔥',
      ctaText: 'Continue Learning',
      floatingBadge: 'Concept Mastered ✓',
      image: '/images/aieducation/role-students.jpg',
      imageAlt: 'Students learning and collaborating together in campus library'
    }
  },
  faculty: {
    eyebrow: 'MADE FOR FACULTY',
    heading: 'Less administration, more impactful teaching.',
    subtext: 'Prepare lessons in minutes, automate grading, and keep classes on track.',
    features: [
      {
        icon: FileText,
        title: 'AI Lesson Planner',
        desc: 'Curriculum-aligned lesson plans, homework tasks, and rubrics in seconds.'
      },
      {
        icon: Calendar,
        title: 'Clash-Free Timetables',
        desc: 'Automated 8-period smart schedules with instant substitute proxy alerts.'
      },
      {
        icon: CheckCircle2,
        title: 'Rubric Auto-Grading',
        desc: 'Objective, constructive paper evaluations with personalized student notes.'
      }
    ],
    preview: {
      header: 'Teacher Workspace',
      status: 'Schedule Active',
      chapterTag: 'Mathematics & Physics',
      chapterTitle: 'Period 3 · Room 204 Lecture',
      chapterCitation: 'Lesson Plan & Quiz Ready',
      streak: 'All 42 Papers Graded ✓',
      ctaText: 'Open Lesson Planner',
      floatingBadge: 'Proxy Safe · 0 Conflicts',
      image: '/images/aieducation/role-faculty-group.jpg',
      imageAlt: 'Faculty and professors group collaborating on academic curriculum'
    }
  },
  parents: {
    eyebrow: 'MADE FOR PARENTS',
    heading: "Stay connected with your child's growth.",
    subtext: 'Real-time attendance, academic milestones, and transparent fees.',
    features: [
      {
        icon: Bell,
        title: 'Live Attendance Alerts',
        desc: 'Instant push & WhatsApp notifications for daily period check-ins.'
      },
      {
        icon: Award,
        title: 'Certified Term Progress',
        desc: 'Digitally signed report cards with verified marks and principal seal.'
      },
      {
        icon: CreditCard,
        title: 'One-Tap Fee Receipts',
        desc: 'Transparent fee dues settlement with instant downloadable tax receipts.'
      }
    ],
    preview: {
      header: 'Parent Portal',
      status: 'Live Feed Synced',
      chapterTag: 'Class 11 · Section A',
      chapterTitle: 'Term 1 Attendance: 98.2%',
      chapterCitation: 'Mid-Term Report Card Available',
      streak: 'Tuition Fees Cleared ✓',
      ctaText: 'View Report Card',
      floatingBadge: 'Top 5% Cohort Rank',
      image: '/images/aieducation/role-parents.jpg',
      imageAlt: 'Parents actively tracking student attendance and report card'
    }
  },
  admin: {
    eyebrow: 'MADE FOR ADMINISTRATION',
    heading: 'Total institutional control in one single ERP.',
    subtext: 'Automate operations, roster allocation, and accounting compliance.',
    features: [
      {
        icon: Layers,
        title: 'Tally ERP 9 / Prime Sync',
        desc: 'Automated 2-way XML synchronization for fee vouchers and payroll.'
      },
      {
        icon: Building2,
        title: 'Admissions & Rosters',
        desc: 'Dynamic entrance exams, applicant ranking, and multi-branch rosters.'
      },
      {
        icon: ShieldCheck,
        title: 'Curriculum Guardrails',
        desc: 'Strict institution-isolated tenancy locking AI strictly to syllabus.'
      }
    ],
    preview: {
      header: 'Campus ERP',
      status: 'Systems 99.98% SLA',
      chapterTag: 'Institutional Dashboard',
      chapterTitle: '1,840 Active Students Enrolled',
      chapterCitation: 'Tally Prime Vouchers Synced',
      streak: 'CASA Tier-2 Certified 🛡️',
      ctaText: 'Open Executive Console',
      floatingBadge: 'Audit Compliant',
      image: '/images/aieducation/role-admin.jpg',
      imageAlt: 'University administration and campus ERP management leadership'
    }
  }
};

export default function AIEducationRoles() {
  const [activeTab, setActiveTab] = useState('students');
  const current = AUDIENCE_CONTENT[activeTab];

  return (
    <section className="aied-section-roles-redesign" id="campus-ecosystem">
      <div className="aied-campus-container">

        {/* Section Header */}
        <div className="aied-campus-header">
          <h2 className="aied-campus-title">
            Built for the <span className="aied-accent-purple">Entire Campus.</span>
          </h2>

          <p className="aied-campus-subtitle">
            One connected experience for the whole campus.
          </p>
        </div>

        {/* Segmented Control Audience Tabs */}
        <div className="aied-segmented-tabs-wrapper">
          <div className="aied-segmented-tabs" role="tablist">
            {AUDIENCE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`aied-segmented-tab-btn ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={16} className="tab-btn-icon" />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activePillIndicator" 
                      className="aied-segmented-pill-highlight" 
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetrical 2-Column Main Content Area */}
        <div className="aied-campus-main-grid">
          
          {/* LEFT SIDE: Concise Text & Exactly 3 Features */}
          <div className="aied-campus-content-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 14 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="aied-content-stack"
              >
                {/* Centered Eyebrow & Heading Block */}
                <div className="aied-audience-header-block">
                  <span className="aied-audience-eyebrow">
                    {current.eyebrow}
                  </span>

                  <h3 className="aied-audience-heading">
                    {current.heading}
                  </h3>

                  <p className="aied-audience-desc">
                    {current.subtext}
                  </p>
                </div>

                {/* Exactly 3 Concise Feature Highlights */}
                <div className="aied-audience-features-list">
                  {current.features.map((feat, idx) => {
                    const FeatIcon = feat.icon;
                    return (
                      <div key={idx} className="aied-audience-feature-row">
                        <div className="aied-feature-icon-pill">
                          <FeatIcon size={16} />
                        </div>
                        <div className="aied-feature-text-block">
                          <h4 className="aied-feature-title">{feat.title}</h4>
                          <p className="aied-feature-desc">{feat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT SIDE: Floating Educational Product Preview */}
          <div className="aied-campus-preview-col">
            <div className="aied-educational-preview-stage">
              
              {/* Subtle Ambient Lavender Glow Backdrop */}
              <div className="aied-preview-ambient-glow" aria-hidden="true" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.3 }}
                  className="aied-preview-glass-card"
                >
                  {/* Top Header Strip: 'My Learning' + 'AI Tutor Ready' */}
                  <div className="aied-preview-top-strip">
                    <div className="aied-preview-meta-title">
                      <BookOpen size={14} className="text-purple-600" />
                      <span>{current.preview.header}</span>
                    </div>

                    <div className="aied-preview-status-beacon">
                      <span className="beacon-pulse-dot" />
                      <span>{current.preview.status}</span>
                    </div>
                  </div>

                  {/* Refined Role Illustration Centerpiece */}
                  <div className="aied-preview-artwork-frame">
                    <motion.div
                      className="aied-preview-artwork-inner"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <img 
                        src={current.preview.image} 
                        alt={current.preview.imageAlt || current.preview.chapterTitle}
                        className="aied-preview-role-img"
                        loading="eager"
                      />
                      <div className="aied-preview-artwork-overlay" aria-hidden="true" />
                    </motion.div>

                    {/* Floating Top Badge */}
                    <div className="aied-float-concept-badge">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      <span>{current.preview.floatingBadge}</span>
                    </div>
                  </div>

                  {/* Highlighted Chapter Box */}
                  <div className="aied-preview-chapter-box">
                    <div className="chapter-box-left">
                      <span className="chapter-tag">{current.preview.chapterTag}</span>
                      <h5 className="chapter-name">{current.preview.chapterTitle}</h5>
                      <span className="chapter-citation">{current.preview.chapterCitation}</span>
                    </div>
                  </div>

                  {/* Weekly Progress Line / Study Streak */}
                  <div className="aied-preview-progress-row">
                    <span className="progress-streak-label">{current.preview.streak}</span>
                    <div className="progress-dots-track" aria-hidden="true">
                      <span className="day-dot active" title="Mon" />
                      <span className="day-dot active" title="Tue" />
                      <span className="day-dot active" title="Wed" />
                      <span className="day-dot active" title="Thu" />
                      <span className="day-dot active" title="Fri" />
                    </div>
                  </div>

                  {/* Compact CTA: 'Continue Learning' */}
                  <div className="aied-preview-cta-row">
                    <button type="button" className="aied-preview-continue-btn">
                      <span>{current.preview.ctaText}</span>
                      <ArrowRight size={14} className="arrow-shift" />
                    </button>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
