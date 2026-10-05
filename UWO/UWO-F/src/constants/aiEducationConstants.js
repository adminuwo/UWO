// ========================================================
// 🎓 AI EDUCATION™ — OFFICIAL PRODUCT SHOWCASE CONSTANTS
// Source of Truth: Convee Master Enterprise Architecture & Docs
// ========================================================

export const AI_EDUCATION_META = {
  title: 'AI Education™ | AI-Powered Academic Operating Platform | UWO™',
  description: 'AI Education™ is an intelligent academic platform connecting institutions, faculty, students and parents through modern academic operations, learning and AI-powered workflows.',
  canonical: 'https://uwo24.com/ai-education',
  livePortalUrl: 'https://education.uwo24.com'
};

// 🏛️ Verified Pre-Configured Seeded Institutions (from 11_INSTITUTIONS_AND_CREDENTIALS.md)
export const SEEDED_INSTITUTIONS = [
  {
    id: 'chanakya-national-law',
    name: 'Chanakya National Law University',
    shortName: 'CNLU New Delhi',
    domain: '@cnlu.ac.in',
    category: 'National Law University',
    accentColor: '#16B8E8',
    stats: { members: 42, departments: 4, classes: 12 },
    leadership: 'Prof. Dr. Vikramaditya Sharma (Vice Chancellor)',
    demoAccounts: {
      faculty: { name: 'Adv. Meenakshi Sundaram', email: 'faculty.meenakshi@cnlu.ac.in', role: 'Teacher · Cyber Laws' },
      student: { name: 'Aarav Deshmukh', id: 'CNLU/2026/CYBER/01', email: 'aarav.deshmukh@cnlu.ac.in' },
      parent: { name: 'Suresh Deshmukh', id: 'PAR-2026-0001', email: 'parent.aarav@cnlu.ac.in' }
    }
  },
  {
    id: 'aryabhata-engineering',
    name: 'Aryabhata Institute of Engineering & Technology',
    shortName: 'AIET Bengaluru',
    domain: '@aryabhata.edu.in',
    category: 'Autonomous Engineering College',
    accentColor: '#00B87A',
    stats: { members: 43, departments: 6, classes: 18 },
    leadership: 'Dr. K. Radhakrishnan Nair (Director & CAO)',
    demoAccounts: {
      faculty: { name: 'Dr. Ashwini Bhat', email: 'faculty.ashwini@aryabhata.edu.in', role: 'HOD · Artificial Intelligence' },
      student: { name: 'Kunal Sharma', id: 'AIET/2026/CSE/101', email: 'kunal.sharma@aryabhata.edu.in' },
      parent: { name: 'Mahesh Sharma', id: 'PAR-2026-0001', email: 'parent.kunal@aryabhata.edu.in' }
    }
  },
  {
    id: 'tagore-international-school',
    name: 'Tagore International Senior Secondary School',
    shortName: 'TIS New Delhi',
    domain: '@tis.edu.in',
    category: 'K-12 Senior Secondary (CBSE)',
    accentColor: '#8B5CF6',
    stats: { members: 43, departments: 3, classes: 24 },
    leadership: 'Dr. Shalini Sharma (Principal & Head of School)',
    demoAccounts: {
      faculty: { name: 'Mr. Rajesh Kumar Verma', email: 'faculty.rajesh@tis.edu.in', role: 'PGT Physics' },
      student: { name: 'Aarush Mehra', id: 'TIS/2026/11SCI/01', email: 'aarush.mehra@tis.edu.in' },
      parent: { name: 'Deepak Mehra', id: 'PAR-2026-0001', email: 'parent.aarush@tis.edu.in' }
    }
  }
];

// 👥 Institutional RBAC Personas (from 02_CAMPUS_HIERARCHY_AND_RBAC.md)
export const INSTITUTIONAL_ROLES = [
  {
    id: 'institution',
    name: 'Institution & Leadership',
    badge: 'Campus Governance',
    personas: 'Director · Principal · Dean · Registrar · Accountant',
    tagline: 'Centralized governance, audit compliance, financial oversight, and campus telemetry.',
    features: [
      { title: 'Campus-Wide Governance', desc: 'Manage multi-department curricula, academic promotion mapping, and institutional rosters with strict multi-tenancy.' },
      { title: 'Tally ERP 9 / Prime Sync', desc: 'Bi-directional financial reconciliation for student fees, staff payroll, and ledger vouchers with TallyTombstone protection.' },
      { title: 'CASA Tier-2 Security', desc: 'Hardened anti-BOLA/IDOR authorization, classroom-friendly compound rate limiting, and sanitized audit logging.' }
    ],
    telemetry: { label: 'Active Tenancy', value: '100% Org-Isolated', sub: 'PostgreSQL 44 Entities' },
    accent: '#00B87A'
  },
  {
    id: 'faculty',
    name: 'Faculty & Department HODs',
    badge: 'Academic Instruction',
    personas: 'Professors · HODs · PGT/TGT Teachers · Evaluators',
    tagline: 'Timetable slot management, automated proxy allocation, rubric grading, and lesson planning.',
    features: [
      { title: '8-Period Conflict-Free Timetable', desc: 'Automated clash detection across teachers and rooms, with 1-click substitute proxy assignment for planned leaves.' },
      { title: 'Rubric-Based Exam & Homework Grading', desc: 'Numerical and letter grade sessions supporting theory vs practical weighting with automated qualitative feedback.' },
      { title: 'AI Academic Assistant (GPT-4o-mini)', desc: 'Dedicated administrative AI copilot for lesson plans, exam question drafting, and formal parental notices.' }
    ],
    telemetry: { label: 'Proxy Dispatch', value: '< 200ms', sub: 'Real-time WebSocket alerts' },
    accent: '#16B8E8'
  },
  {
    id: 'students',
    name: 'Students & Aspirants',
    badge: 'Pedagogical Learning',
    personas: 'Enrolled Pupils · College Undergrads · Competitive Aspirants',
    tagline: 'Personalized study buddy, class textbook RAG citations, and verified hall tickets.',
    features: [
      { title: 'Class Textbook RAG Citations', desc: 'AI queries indexed directly to authorized course textbooks with chapter, section, and page source badges.' },
      { title: 'Daily Adaptive Quizzes', desc: '5-question micro-assessments dynamically shifting across 4 skill tiers (Beginner, Intermediate, Advanced, Mastery).' },
      { title: 'Dynamic QR Hall Tickets', desc: 'Tamper-evident entrance admit cards with dynamic QR verification, photo, seat allocation, and proctor instructions.' }
    ],
    telemetry: { label: 'Curriculum Grounding', value: '100% Source-Cited', sub: 'Vertex AI Gemini 2.5 Flash' },
    accent: '#00B87A'
  },
  {
    id: 'parents',
    name: 'Parents & Guardians',
    badge: 'Guardian Oversight',
    personas: 'Fathers · Mothers · Authorized Legal Guardians',
    tagline: 'Multi-child switcher, live attendance tracking, fee balances, and digitally signed report cards.',
    features: [
      { title: 'Multi-Child Switcher', desc: 'Toggle instantly between siblings across different grades or classes in a single unified dashboard view.' },
      { title: 'Daily Attendance Telemetry', desc: 'Real-time notification of period check-ins, medical leaves, and historical monthly presence percentages.' },
      { title: 'Digitally Certified Report Cards', desc: 'Official transcripts synthesized with teacher observations, AI qualitative remarks, and multi-tier institutional signatures.' }
    ],
    telemetry: { label: 'Signature Integrity', value: '3-Tier Signed', sub: 'Teacher · HOD · Principal' },
    accent: '#8B5CF6'
  },
  {
    id: 'individual',
    name: 'Individual & Private Tuition',
    badge: 'Independent Scope',
    personas: 'Independent Learners · Freelance Educators · Coaching Hubs',
    tagline: 'Tuition scope for private learners and tutors without mandatory university affiliation.',
    features: [
      { title: 'Tutor Marketplace & Monthly Booking', desc: 'Verified tutor profiles with hourly rates, subject specialization, and recurring monthly 1-on-1 bookings.' },
      { title: 'Local Study Assets (Zero-Cloud OPFS)', desc: 'Discover and index syllabi, textbooks, and past-year papers from NCERT, CBSE, and NPTEL cached locally on device.' },
      { title: 'Competitive Exam Blueprints', desc: 'Dedicated prep tracks for JEE Main/Advanced, NEET, UPSC CSE, GATE, and Judicial Services examinations.' }
    ],
    telemetry: { label: 'Device Storage', value: 'Zero-Cloud OPFS', sub: 'Private device sandbox' },
    accent: '#2997FF'
  }
];

// 📦 Core Verified Functional Modules (from 03_FUNCTIONAL_MODULES_AND_WORKFLOWS.md)
export const CORE_MODULES = [
  {
    id: 'timetable',
    code: 'MOD-01',
    name: 'Academic Timetables & Proxy Allocation',
    category: 'Operations',
    tag: '8-Period Slot Grid',
    summary: 'Conflict-free weekly schedule matrix with automated substitute teacher assignment.',
    details: 'Configurable Monday through Saturday 8-period slot grid. Detects teacher leaves (TeacherAbsence) and computes free-slot faculty for instant HOD proxy assignment with real-time WebSocket dispatch.',
    entities: ['TimetableSlot', 'TeacherAbsence', 'ProxyAssignment'],
    icon: 'Calendar',
    accent: '#00B87A'
  },
  {
    id: 'exams',
    code: 'MOD-02',
    name: 'Examinations & Certified Report Cards',
    category: 'Assessment',
    tag: '3-Tier Digital Signatures',
    summary: 'Full exam lifecycle from scheduling to automated, seal-embedded report cards.',
    details: 'Draft ➔ Open for Grading ➔ Published. Supports numerical (0–100) or letter grading (A+ to F) with theory vs practical weighting. Synthesizes marks, attendance statistics, AI remarks, and seals.',
    entities: ['Exam', 'ExamSubject', 'StudentScore', 'ReportCard'],
    icon: 'Award',
    accent: '#16B8E8'
  },
  {
    id: 'admissions',
    code: 'MOD-03',
    name: 'Admission & Entrance Exam Suite',
    category: 'Admissions',
    tag: 'QR Hall Tickets & AI Scoring',
    summary: 'Question paper builder, candidate testing portal, and tamper-evident QR admit cards.',
    details: 'Interactive QuestionPaperBuilder supporting 4 question types (Single MCQ, Multi MCQ, Fill-in-Blank, Subjective Essay). Subjective answers evaluated by AI against model rubrics. Generates printable QR-verified Hall Tickets.',
    entities: ['AdmissionExam', 'CandidateApplication', 'AdmitPass', 'ExamSubmission'],
    icon: 'QrCode',
    accent: '#00B87A'
  },
  {
    id: 'textbook-rag',
    code: 'MOD-04',
    name: 'Class Textbook RAG & Study Buddy',
    category: 'Pedagogy',
    tag: 'Inline Source Citations',
    summary: 'Curriculum-scoped AI assistant citing exact chapter and page numbers from uploaded textbooks.',
    details: 'Ingests syllabus assets into a scoped RAG vector pipeline. When students query topics, the AI retrieves verified textbook passages and formats answers with inline markdown source badges ([NCERT Physics Class 11, Ch. 5, p. 94]).',
    entities: ['FileAsset', 'SyllabusTopic', 'AITokenUsageLog'],
    icon: 'FileText',
    accent: '#00B87A'
  },
  {
    id: 'communication',
    code: 'MOD-05',
    name: 'Real-Time Campus Communication',
    category: 'Collaboration',
    tag: '7 Channel Types · AI Summarizer',
    summary: 'WebSocket chat rooms, threaded discussions, read receipts, and AI channel summaries.',
    details: 'Socket.IO 4.8 rooms partitioned by institution and class. Features emoji reactions, threaded replies, unread badge counters, and an AI Summarizer condensing 100 missed messages into key decisions.',
    entities: ['Channel', 'Message', 'MessageRead', 'ChannelMember'],
    icon: 'MessageSquare',
    accent: '#16B8E8'
  },
  {
    id: 'tally-sync',
    code: 'MOD-06',
    name: 'Institutional Finance & Tally ERP Sync',
    category: 'Finance',
    tag: 'Bi-Directional XML Protocol',
    summary: 'Automated synchronization with Tally ERP 9 / Prime for fee ledgers, payroll, and cash desks.',
    details: 'Maps student fees to Sundry Debtors and staff payroll to Sundry Creditors. Emits XML request envelopes to localhost:9000 with TallyTombstone soft-delete protocol for zero-data discrepancy.',
    entities: ['StudentFee', 'FeeReceipt', 'SalaryPayroll', 'TallySyncLog', 'TallyTombstone'],
    icon: 'DollarSign',
    accent: '#00B87A'
  }
];

// 🔄 Real Academic Workflows (from 03_FUNCTIONAL_MODULES_AND_WORKFLOWS.md)
export const ACADEMIC_WORKFLOWS = [
  {
    id: 'admissions',
    name: 'Admissions & Entrance Exam Lifecycle',
    description: 'End-to-end automated admissions pipeline from application to tamper-evident QR hall ticket and AI scoring.',
    steps: [
      { label: 'Application Submitted', detail: 'Candidate applies online with academic records and photo ID verification.' },
      { label: 'Eligibility Screening', detail: 'Automated administrative verification of prerequisites and fee clearance.' },
      { label: 'QR Hall Ticket Generated', detail: 'admitPassGenerator creates printable pass with dynamic encrypted QR seal.' },
      { label: 'Entrance Examination', detail: 'Candidate testing environment with anti-tab switching lock and proctor telemetry.' },
      { label: 'AI Subjective Auto-Scoring', detail: 'AI evaluates long essay responses against model keys and grading rubrics.' },
      { label: 'Institutional Enrollment', detail: 'Merit list published and candidate converted to active Student in Class roster.' }
    ]
  },
  {
    id: 'operations',
    name: 'Academic Schedule & Proxy Assignment',
    description: 'Dynamic daily timetable management ensuring continuous classroom instructional coverage.',
    steps: [
      { label: '8-Period Grid Configured', detail: 'Weekly timetable slots mapped per class section and teacher with zero double-booking.' },
      { label: 'Teacher Absence Logged', detail: 'Faculty records planned or medical leave in the portal (TeacherAbsence).' },
      { label: 'Proxy Availability Scanned', detail: 'System queries /timetable/proxies/available to find faculty with free periods.' },
      { label: 'HOD Allocates Substitute', detail: 'Department head assigns substitute teacher with one click (ProxyAssignment).' },
      { label: 'Instant WebSocket Dispatch', detail: 'Substitute teacher receives instant mobile/web push alert with syllabus notes.' },
      { label: 'Attendance & Class Logged', detail: 'Substitute takes digital roll call and records class coverage in academic ledger.' }
    ]
  },
  {
    id: 'pedagogy',
    name: 'Curriculum-Grounded Textbook RAG',
    description: 'Pedagogical AI retrieval pipeline strictly scoped to authorized institutional syllabus materials.',
    steps: [
      { label: 'Authorized Textbook Ingested', detail: 'Faculty uploads official school board or university textbook (FileAsset).' },
      { label: 'Chunking & Metadata Tagging', detail: 'Engine indexes chapters, theorem numbers, and page coordinates.' },
      { label: 'Student Syllabus Query', detail: 'Student asks concept question in AI Study Buddy on web or mobile app.' },
      { label: 'Institutional RAG Retrieval', detail: 'Context is strictly isolated to the student\'s enrolled grade textbook corpus.' },
      { label: 'Inline Citation Generated', detail: 'LLM generates explanation featuring formatted source badges ([NCERT Ch. 7, p. 168]).' },
      { label: 'Adaptive Daily Quiz', detail: 'System generates 5-question micro-quiz adapting to the student\'s current skill tier.' }
    ]
  }
];

// 🤖 Dual-LLM Routing & AI Safety (from 04_AI_ARCHITECTURE_AND_GUARDRAILS.md)
export const AI_ROUTING_SPEC = {
  gemini: {
    provider: 'Google Cloud Vertex AI',
    model: 'Gemini 2.5 Flash',
    region: 'asia-south1 (Mumbai)',
    targetUsers: 'Students · Parents · Alumni',
    advantages: '1M+ token context window for textbooks · Low latency in India · Efficient inference economics',
    auth: 'Application Default Credentials (ADC Service Account)'
  },
  openai: {
    provider: 'OpenAI Cloud',
    model: 'GPT-4o-mini',
    region: 'Global API Endpoint',
    targetUsers: 'Faculty · Department HODs · Deans · Accountants',
    advantages: 'Superior reasoning for lesson plans · Complex rubric construction · Financial report analysis',
    auth: 'Bearer API Key with secret manager rotation'
  },
  guardrails: [
    {
      title: 'Crisis Intervention Shield',
      priority: 'Top Priority · LLM Bypass',
      desc: 'Immediate emergency bypass for crisis signals, displaying direct 24/7 helplines (Tele-MANAS 14416 and Childline 1098).'
    },
    {
      title: 'Actionable Danger Blocking',
      priority: 'Enforced at Ingress',
      desc: 'Scans and immediately rejects requests for weapon synthesis, hazardous chemistry, or malicious cyber intrusion.'
    },
    {
      title: 'Academic Dual-Use Whitelist',
      priority: 'Context-Aware',
      desc: 'Whitelists legitimate academic topics (biological reproduction, chemical combustion, World War II history) avoiding false positives.'
    },
    {
      title: 'Student PII Masking',
      priority: 'Privacy Hardening',
      desc: 'Automatically strips Aadhaar numbers, PAN cards, phone numbers, and home addresses before prompts reach external models.'
    },
    {
      title: 'Exam Integrity Guardrails',
      priority: 'Assessment Shield',
      desc: 'Detects active examination prompt patterns, reframing responses to teach underlying concepts rather than direct answer cheating.'
    }
  ],
  telemetry: {
    loggedEntity: 'AITokenUsageLog',
    trackedMetrics: ['promptTokens', 'completionTokens', 'totalTokens', 'provider', 'model', 'estimatedCostUSD', 'feature', 'guardrailStatus']
  }
};

// 🔒 Trust & CASA Compliance (from 07_SECURITY_PRIVACY_AND_CASA.md)
export const SECURITY_STANDARDS = [
  {
    title: 'CASA Tier-2 Security Standard',
    desc: 'Engineered in accordance with Cloud Application Security Assessment Tier-2 guidelines and OWASP Top 10 web standards.'
  },
  {
    title: 'Anti-BOLA & Anti-IDOR Tenancy',
    desc: 'Every database query validates target entity against active institutional orgId, strictly preventing cross-tenant leakage.'
  },
  {
    title: 'Classroom Compound Rate Limiting',
    desc: 'Dual-key rate limiter (${ip}:${email}) prevents entire school computer labs sharing a single public NAT IP from lockout.'
  },
  {
    title: 'Anti-Caching Header Enforcement',
    desc: 'Public laboratory computer protection via strict Cache-Control: no-store, no-cache, must-revalidate headers.'
  },
  {
    title: 'HMAC Signed Private Storage',
    desc: 'Student homework uploads, fee receipts, and faculty payslips stored in Google Cloud Storage with expiring signed URLs.'
  },
  {
    title: 'Sanitized Structured Audit Logging',
    desc: 'logsCreator middleware records full audit trails while stripping passwords, bearer tokens, Aadhaar, and PII strings.'
  }
];

// 📱 Multi-Platform Availability
export const PLATFORM_SPECS = [
  {
    platform: 'Web Application',
    tech: 'React 19 · Tailwind CSS · Vite',
    status: 'Production Live',
    specs: 'Desktop workstations, interactive smart boards, laboratory terminals, and laptop browsers.',
    url: 'https://education.uwo24.com'
  },
  {
    platform: 'Android Mobile App',
    tech: 'React Native · Expo SDK 56',
    status: 'Aligned Android 15 (16KB Page-Size)',
    specs: 'Bilingual (English & Hindi Devanagari), low-bandwidth offline caching, real-time push notifications.',
    url: 'https://education.uwo24.com'
  },
  {
    platform: 'iOS Mobile App',
    tech: 'React Native · Swift 6 / Xcode 16',
    status: 'iOS 16.4+ Compatible',
    specs: 'Optimized for iPhone & iPad with native biometric FaceID authentication and Apple Push Notifications.',
    url: 'https://education.uwo24.com'
  }
];
