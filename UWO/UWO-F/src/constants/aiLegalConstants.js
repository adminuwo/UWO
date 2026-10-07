// AI LEGAL™ Verified Platform Constants & Structured Architecture
// Derived from UWO production configuration

export const AI_LEGAL_WEB_URL = 'https://ailegal.aisa24.com';
export const AI_LEGAL_ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.uwo.ailegal&pcampaignid=web_share';
export const AI_LEGAL_IOS_URL = 'https://apps.apple.com/app/id6797449251';

export const AI_LEGAL_META = {
  title: 'AI LEGAL™ | AI-Powered Legal Intelligence Platform | UWO™',
  description: 'AI LEGAL™ is an AI-powered legal intelligence platform for legal research, case management, drafting, evidence analysis, document intelligence and modern legal workflows.',
  canonical: 'https://uwo24.com/ai-legal',
  brand: 'UWO™',
  productName: 'AI LEGAL™',
  tagline: 'Intelligence for Modern Legal Practice.'
};

export const ECOSYSTEM_NODES = [
  {
    id: 'assistant',
    title: 'AI Legal Assistant',
    category: 'Reasoning & Intelligence',
    description: 'Context-aware global legal reasoning assistant trained on statutory provisions, case law precedents, and procedural codes.',
    icon: 'fa-brain-circuit',
    badge: 'Core Engine'
  },
  {
    id: 'cases',
    title: 'My Cases',
    category: 'Practice Management',
    description: 'Centralized registry to manage active case dockets, parties, court hearings, procedural filings, and client records.',
    icon: 'fa-briefcase',
    badge: 'Management'
  },
  {
    id: 'workspace',
    title: 'Case Workspace',
    category: 'Contextual AI',
    description: 'Isolated case-specific AI environment that digests case pleadings, petitions, and evidence for contextual interrogation.',
    icon: 'fa-folder-open',
    badge: 'Deep Context'
  },
  {
    id: 'tools',
    title: 'AI Tools',
    category: 'Utility Suite',
    description: 'Specialized legal utilities including date reckoning, limitation calculators, legal notice builders, and court fee estimators.',
    icon: 'fa-screwdriver-wrench',
    badge: 'Utilities'
  },
  {
    id: 'evidence',
    title: 'Evidence Vault',
    category: 'Secure Repository',
    description: 'Encrypted document repository supporting automated OCR, multi-format forensic indexing, and bilingual transcript generation.',
    icon: 'fa-shield-halved',
    badge: 'Vault'
  },
  {
    id: 'knowledge',
    title: 'Legal Knowledge Hub',
    category: 'Precedent & Doctrine',
    description: 'Intelligent search across Supreme Court, High Court precedents, constitutional authorities, and statutory regulations.',
    icon: 'fa-scale-balanced',
    badge: 'Authorities'
  },
  {
    id: 'courtroom',
    title: 'AI Mock Courtroom',
    category: 'Hearing Simulation',
    description: 'Interactive simulated courtroom hearings supporting voice or text interrogation with procedural objections and judicial critique.',
    icon: 'fa-gavel',
    badge: 'Simulation'
  },
  {
    id: 'clients',
    title: 'AI Client Connect',
    category: 'Client Collaboration',
    description: 'Client relationship bridge facilitating verified case status broadcasts and templated WhatsApp communications.',
    icon: 'fa-comments',
    badge: 'Communication'
  }
];

export const ALL_FEATURES = [
  {
    id: 'ai-assistant',
    title: 'AI Legal Assistant',
    tagline: 'Global Legal Reasoning & Workflow Co-Pilot',
    summary: 'Global AI assistant for legal queries, legal reasoning support, document understanding, and legal workflows.',
    icon: 'fa-brain',
    highlights: [
      'Comprehensive statutory cross-referencing',
      'Complex procedural question decomposition',
      'Multi-jurisdictional legal interpretation',
      'Real-time query explanation with legal citations'
    ],
    previewType: 'assistant',
    actionLabel: 'Try Query Simulation'
  },
  {
    id: 'my-cases',
    title: 'My Cases',
    tagline: 'Centralized Case Docket Management',
    summary: 'Centralized case management system where advocates can manage cases, documents, notes, tasks and case-specific information.',
    icon: 'fa-folder-tree',
    highlights: [
      'Structured case docket organization by jurisdiction',
      'Hearing calendar with automatic procedural reminders',
      'Secure document binding per matter',
      'Matter-level task & note collaboration'
    ],
    previewType: 'cases',
    actionLabel: 'View Docket Structure'
  },
  {
    id: 'case-workspace',
    title: 'Case Workspace',
    tagline: 'Context-Aware Case Intelligence Environment',
    summary: 'Dedicated AI workspace for each case. The AI understands the context of the specific case and helps users interact with case documents and information.',
    icon: 'fa-layer-group',
    highlights: [
      'Complete matter memory across petitions, replies, and exhibits',
      'Instant extraction of contradictions and factual anomalies',
      'Cross-examination question formulation from opposing pleadings',
      'Chronological fact matrix generation'
    ],
    previewType: 'workspace',
    actionLabel: 'Inspect Matter Memory'
  },
  {
    id: 'draft-maker',
    title: 'AI Draft Maker',
    tagline: 'Structured Template & Intelligent Drafting Suite',
    summary: 'Generate legal drafts using structured templates and AI assistance with complete editing, saving, and multi-format exports.',
    icon: 'fa-file-lines',
    highlights: [
      'Extensive template repository (Bail, Writs, Petitions, Contracts)',
      'Real-time dynamic clause suggestions and legal language refinement',
      'Multi-format export: PDF, DOCX, and TXT',
      'Version history and clause repository'
    ],
    previewType: 'draft',
    actionLabel: 'Preview Drafting Canvas'
  },
  {
    id: 'legal-research',
    title: 'Legal Research',
    tagline: 'Semantic Judicial Authority Exploration',
    summary: 'AI-assisted legal research to help users explore laws, judgments, precedents, and legal concepts with contextual nuance.',
    icon: 'fa-magnifying-glass',
    highlights: [
      'Natural language query matching beyond simple keyword search',
      'Key ratio decidendi extraction from landmark decisions',
      'Statutory amendment tracking and judicial overrides',
      'Contextualized precedent relevance scores'
    ],
    previewType: 'research',
    actionLabel: 'Explore Research Index'
  },
  {
    id: 'legal-precedent',
    title: 'Legal Precedent',
    tagline: 'Authority Analyzer & Ratio Decidendi Extraction',
    summary: 'Analyze relevant precedents and identify useful legal authorities to bolster court pleadings and submissions.',
    icon: 'fa-scale-balanced',
    highlights: [
      'Identification of binding versus persuasive precedents',
      'Bench strength & subsequent judicial treatment mapping',
      'Distinction between obiter dicta and ratio decidendi',
      'Quick case citation verification'
    ],
    previewType: 'precedent',
    actionLabel: 'Analyze Precedent Treatment'
  },
  {
    id: 'evidence-analyst',
    title: 'Evidence Analyst',
    tagline: 'Multi-Modal Forensic Document & Exhibit Processing',
    summary: 'Upload evidence and documents for OCR, extraction, analysis, evidence organization, AI-generated reports, and bilingual output.',
    icon: 'fa-file-shield',
    highlights: [
      'High-precision OCR for scanned petitions and police records',
      'Bilingual synthesis and translation into court-admissible formats',
      'Automated extraction of dates, financial amounts, and actors',
      'Forensic contradiction and anomaly reporting'
    ],
    previewType: 'evidence',
    actionLabel: 'View Forensic Extraction'
  },
  {
    id: 'contract-analyzer',
    title: 'Contract Analyzer',
    tagline: 'Comprehensive Clause & Liability Risk Auditing',
    summary: 'Analyze contracts and identify important clauses, potential risks, missing clauses, key obligations, and contract insights.',
    icon: 'fa-file-signature',
    highlights: [
      'Identification of critical indemnity, termination, and liability caps',
      'Risk scoring and warning on ambiguous covenants',
      'Missing protective clause alerts tailored to commercial practices',
      'Clause-by-clause redline suggestions'
    ],
    previewType: 'contract',
    actionLabel: 'Review Clause Audit'
  },
  {
    id: 'argument-builder',
    title: 'Argument Builder',
    tagline: 'Logical Argument Structuring from Facts to Doctrine',
    summary: 'Help structure legal arguments based on case facts, issues, and supporting legal material.',
    icon: 'fa-diagram-project',
    highlights: [
      'IRAC (Issue, Rule, Application, Conclusion) structured syllogisms',
      'Opposing argument anticipation and rebuttal structuring',
      'Direct factual exhibit anchoring to statutory elements',
      'Oral submission outlines for court presentation'
    ],
    previewType: 'argument',
    actionLabel: 'Construct Legal Syllogism'
  },
  {
    id: 'case-predictor',
    title: 'Case Predictor',
    tagline: 'Pattern Recognition & Consideration Mapping',
    summary: 'AI-assisted analysis of case information to identify patterns, judicial factors, and possible case considerations. (Provides analytical considerations, not guaranteed outcomes.)',
    icon: 'fa-chart-pie',
    highlights: [
      'Empirical consideration analysis across similar matter profiles',
      'Identification of procedural delay factors and filing bottlenecks',
      'Strengths and vulnerability matrices across pleadings',
      'Explicit non-guarantee ethical compliance safeguard'
    ],
    previewType: 'predictor',
    actionLabel: 'Inspect Analytical Factors'
  },
  {
    id: 'strategy-engine',
    title: 'Strategy Engine',
    tagline: 'Procedural Roadmap & Tactical Case Planning',
    summary: 'Help organize legal strategies based on available case information and procedural milestones.',
    icon: 'fa-chess',
    highlights: [
      'Interlocutory relief prioritization and timeline staging',
      'Jurisdictional forum evaluation and procedural prerequisites',
      'Alternative dispute resolution (ADR) viability assessment',
      'Actionable milestone checklists for litigation teams'
    ],
    previewType: 'strategy',
    actionLabel: 'Plan Procedural Sequence'
  },
  {
    id: 'evidence-vault',
    title: 'Evidence Vault',
    tagline: 'Tamper-Evident Centralized Document Safe',
    summary: 'Secure centralized location for case-related evidence, forensic records, and sensitive client documents.',
    icon: 'fa-vault',
    highlights: [
      'Controlled matter-level role permissions and access logging',
      'Immutable cryptographic hash audit trails for exhibits',
      'Encrypted cloud storage with regional residency compliance',
      'Instant search across thousands of indexed matter pages'
    ],
    previewType: 'vault',
    actionLabel: 'Inspect Vault Architecture'
  },
  {
    id: 'mock-courtroom',
    title: 'AI Mock Courtroom',
    tagline: 'Simulated Court Hearing & Oral Argument Rehearsal',
    summary: 'Interactive simulated courtroom experience supporting Voice Hearing and Text Hearing modes with judicial scoring.',
    icon: 'fa-microphone-lines',
    highlights: [
      'Dual modes: Real-time Voice Interrogation and Interactive Text Hearing',
      'Simulation of judicial temperament, procedural objections, and bench questions',
      'Objective feedback on argument coherence, authority reliance, and clarity',
      'Adversarial opposing counsel simulation for rigorous preparation'
    ],
    previewType: 'courtroom',
    actionLabel: 'Launch Hearing Simulation'
  },
  {
    id: 'client-connect',
    title: 'AI Client Connect',
    tagline: 'Professional Automated Client Communication Workflows',
    summary: 'Help advocates communicate with clients using structured workflows and WhatsApp-based templated communication.',
    icon: 'fa-comments-dollar',
    highlights: [
      'Standardized hearing date and order update templates',
      'Direct WhatsApp workflow integration for timely updates',
      'Plain-language legal explanation generator for clients',
      'Complete communication audit trail tied directly to matter files'
    ],
    previewType: 'connect',
    actionLabel: 'Preview Client Template'
  }
];

export const LEGAL_ROLES = [
  {
    id: 'advocates',
    title: 'Advocates & Counsel',
    badge: 'Solo & Independent Practice',
    icon: 'fa-user-tie',
    summary: 'Empowering independent litigators to manage heavy dockets, draft complex pleadings in minutes, and conduct deep research with speed.',
    problems: [
      'Hours spent cross-referencing multi-volume law reports and statute updates',
      'Repetitive manual drafting of routine notices, petitions, and applications',
      'Fragmented evidence files stored across paper bundles, email threads, and phone galleries',
      'Frequent client queries demanding status updates while preparing for hearings'
    ],
    solution: 'AI LEGAL serves as a 24/7 senior legal associate that organizes matter files, drafts petitions from verified templates, extracts contradictions from evidence, and keeps clients informed.',
    modules: ['Case Workspace', 'AI Draft Maker', 'Evidence Analyst', 'AI Mock Courtroom', 'AI Client Connect'],
    workflow: [
      { step: '01', title: 'Matter Ingestion', desc: 'Create matter file and drop in pleadings, FIRs, or contracts.' },
      { step: '02', title: 'Contextual Research', desc: 'Query case precedents specific to the judge and bench citations.' },
      { step: '03', title: 'Rapid Drafting', desc: 'Generate petition draft in minutes; refine and export to DOCX/PDF.' },
      { step: '04', title: 'Courtroom Rehearsal', desc: 'Run a mock hearing with AI judge to pressure-test oral arguments.' }
    ]
  },
  {
    id: 'law-firms',
    title: 'Law Firms & Chambers',
    badge: 'Multi-Attorney Practice',
    icon: 'fa-building-columns',
    summary: 'Equipping legal chambers and boutique law firms with centralized case workspaces, team collaboration, and standardized work products.',
    problems: [
      'Inconsistent drafting quality and citation styles across associates and interns',
      'Knowledge leakage when team members transition off active matters',
      'Lack of centralized visibility over matter progress and upcoming deadlines',
      'Labor-intensive contract audits during commercial due diligence'
    ],
    solution: 'A unified legal operating system providing shared matter workspaces, firm-wide citation and drafting standards, and instant contract risk scoring.',
    modules: ['My Cases', 'Contract Analyzer', 'Evidence Vault', 'Strategy Engine', 'Case Workspace'],
    workflow: [
      { step: '01', title: 'Chamber Matter Setup', desc: 'Assign senior partner, associates, and researchers to matters.' },
      { step: '02', title: 'Due Diligence & Audit', desc: 'Batch-analyze agreements for compliance risks and missing clauses.' },
      { step: '03', title: 'Collaborative Briefs', desc: 'Collaborate in real time on arguments anchored to the Evidence Vault.' },
      { step: '04', title: 'Review & Approval', desc: 'Senior counsel reviews AI-synthesized brief before filing.' }
    ]
  },
  {
    id: 'law-students',
    title: 'Law Students & Scholars',
    badge: 'Legal Education & Moot Court',
    icon: 'fa-graduation-cap',
    summary: 'Accelerating legal comprehension, moot court preparation, drafting mastery, and doctrine analysis.',
    problems: [
      'Steep learning curve transitioning from theoretical doctrine to procedural filings',
      'Difficulty deconstructing lengthy 100+ page landmark judicial judgments',
      'Limited opportunities for realistic oral advocacy practice before moot competitions',
      'Lack of immediate feedback on drafted legal instruments'
    ],
    solution: 'Interactive pedagogical environment to rehearse moot court arguments with voice AI, learn procedural drafting step-by-step, and grasp complex judicial ratios.',
    modules: ['AI Mock Courtroom', 'Legal Research', 'Argument Builder', 'Legal Precedent'],
    workflow: [
      { step: '01', title: 'Judgment Decomposition', desc: 'Feed landmark cases to extract ratio decidendi and obiter dicta.' },
      { step: '02', title: 'Moot Problem Analysis', desc: 'Structure arguments for petitioner and respondent using Argument Builder.' },
      { step: '03', title: 'Voice Mock Hearing', desc: 'Argue orally before the AI Bench and receive real-time procedural critiques.' },
      { step: '04', title: 'Submission Polish', desc: 'Refine written memorials according to structured citation standards.' }
    ]
  }
];

export const USE_CASES = [
  {
    id: 'case-research',
    number: '01',
    title: 'Case Research',
    subtitle: 'From Complex Legal Question to High-Authority Precedents',
    steps: [
      { step: '1', title: 'Enter Legal Query', desc: 'User enters a nuanced factual or legal inquiry in plain language.' },
      { step: '2', title: 'AI Searches Knowledge', desc: 'Engine scans statutes, recent bench rulings, and landmark ratios.' },
      { step: '3', title: 'Authorities Organized', desc: 'Binding authorities, persuasive precedents, and contrary rulings are categorized.' },
      { step: '4', title: 'Review & Citation', desc: 'Advocate reviews extracted paragraphs, ready for court submission insertion.' }
    ]
  },
  {
    id: 'document-analysis',
    number: '02',
    title: 'Document Analysis',
    subtitle: 'Extracting Actionable Intelligence from Hundreds of Matter Pages',
    steps: [
      { step: '1', title: 'Upload Document', desc: 'Advocate uploads scanned briefs, affidavits, FIR copies, or commercial deeds.' },
      { step: '2', title: 'OCR & Extraction', desc: 'High-accuracy OCR extracts raw text, preserving tables and formatting.' },
      { step: '3', title: 'AI Deep Analysis', desc: 'AI identifies dates, key obligations, inconsistencies, and relevant legal issues.' },
      { step: '4', title: 'Structured Report', desc: 'Comprehensive executive summary generated with citations and risk flags.' }
    ]
  },
  {
    id: 'legal-drafting',
    number: '03',
    title: 'Legal Drafting',
    subtitle: 'Creating Court-Ready Instruments in Minutes, Not Hours',
    steps: [
      { step: '1', title: 'Select Template', desc: 'Choose from verified court pleadings, notices, or transactional templates.' },
      { step: '2', title: 'Provide Case Context', desc: 'Bind matter facts, party names, and relevant statutory provisions.' },
      { step: '3', title: 'AI Generates Draft', desc: 'Synthesizes clean legal prose adhering to procedural formalities.' },
      { step: '4', title: 'Edit & Export', desc: 'Live in-line editing with instant export to PDF, DOCX, or TXT.' }
    ]
  },
  {
    id: 'case-workspace',
    number: '04',
    title: 'Case Workspace',
    subtitle: 'A Context-Aware Intelligence Nerve Center for Every Matter',
    steps: [
      { step: '1', title: 'Create Case File', desc: 'Instantiate an isolated matter workspace with court docket details.' },
      { step: '2', title: 'Upload Pleadings', desc: 'Deposit all exhibits, rejoinders, orders, and transcripts.' },
      { step: '3', title: 'AI Ingests Context', desc: 'Engine builds an indexed neural context map of the entire dispute.' },
      { step: '4', title: 'Generate Insights', desc: 'Ask specific factual queries and receive verified answers with page citations.' }
    ]
  },
  {
    id: 'mock-courtroom',
    number: '05',
    title: 'Mock Courtroom',
    subtitle: 'Oral Advocacy Simulation & Judicial Pressure-Testing',
    steps: [
      { step: '1', title: 'Select Hearing Mode', desc: 'Choose between real-time Voice Hearing or structured Text Hearing.' },
      { step: '2', title: 'Present Arguments', desc: 'Advocate opens submissions, framing statutory basis and case facts.' },
      { step: '3', title: 'Courtroom Interaction', desc: 'Simulated bench asks probing questions and raises procedural objections.' },
      { step: '4', title: 'Scoring & Feedback', desc: 'Receive structured scoring on clarity, legal doctrine, and rebuttal agility.' }
    ]
  },
  {
    id: 'client-connect',
    number: '06',
    title: 'Client Communication',
    subtitle: 'Automated, Respectful, and Templated Client Updates',
    steps: [
      { step: '1', title: 'Select Client & Matter', desc: 'Pick client from case docket with instant access to communication history.' },
      { step: '2', title: 'Choose Approved Template', desc: 'Select hearing adjournment, order update, or document request template.' },
      { step: '3', title: 'Customize & Review', desc: 'AI tailors technical court language into easily comprehensible updates.' },
      { step: '4', title: 'Send via WhatsApp', desc: 'Dispatches instantly through secure WhatsApp integration with logged audit trail.' }
    ]
  }
];

export const WORKFLOW_STEPS = [
  {
    number: '01',
    phase: 'INPUT',
    title: 'Multi-Modal Data Ingestion',
    summary: 'Cases, Documents, Questions, Evidence',
    description: 'Ingest raw briefs, court filings, contracts, witness depositions, and factual inquiries into a secure, isolated workspace.',
    icon: 'fa-arrow-down-to-bracket',
    tags: ['PDF / DOCX', 'Scanned OCR', 'Case Pleadings', 'Audio Transcripts']
  },
  {
    number: '02',
    phase: 'UNDERSTAND',
    title: 'Contextual Legal Processing',
    summary: 'AI processes context and legal information',
    description: 'Our proprietary legal language models analyze jurisdictional nuances, procedural timelines, statutory cross-references, and factual relationships.',
    icon: 'fa-microchip',
    tags: ['Jurisdiction Engine', 'Doctrine Mapping', 'Timeline Extraction', 'Entity Graph']
  },
  {
    number: '03',
    phase: 'ANALYZE',
    title: 'Precedent & Pattern Synthesis',
    summary: 'AI identifies relevant information, relationships and patterns',
    description: 'Identifies binding authorities, ratio decidendi, contradictory witness statements, missing contractual safeguards, and logical vulnerabilities.',
    icon: 'fa-chart-network',
    tags: ['Precedent Match', 'Contradiction Detector', 'Risk Scoring', 'IRAC Logic']
  },
  {
    number: '04',
    phase: 'ASSIST',
    title: 'Actionable Legal Outputs',
    summary: 'Generate research support, drafts, summaries, insights and workflow assistance',
    description: 'Delivers court-ready draft instruments, structured research briefs, forensic evidence reports, and client communication workflows.',
    icon: 'fa-wand-magic-sparkles',
    tags: ['Multi-format Export', 'Verified Citations', 'Hearing Readiness', 'Audit Logs']
  }
];

export const COMPARISON_POINTS = [
  {
    dimension: 'Case Understanding',
    genericAi: 'Operates in isolated, short-term prompt windows with no retention of case documents or court history.',
    aiLegal: 'Dedicated Case Workspace maintaining persistent memory of all pleadings, orders, exhibits, and notes.'
  },
  {
    dimension: 'Legal Research & Citations',
    genericAi: 'Prone to generating hallucinated case citations, non-existent bench rulings, and outdated statutes.',
    aiLegal: 'Rigorous authority anchoring cross-referencing actual high court & supreme court registries with verified ratios.'
  },
  {
    dimension: 'Drafting Workflows',
    genericAi: 'Outputs generic essays lacking jurisdictional court formatting, statutory affirmations, and prayer clauses.',
    aiLegal: 'Procedurally structured drafts built on verified legal templates with direct export to PDF, DOCX, and TXT.'
  },
  {
    dimension: 'Evidence Forensics',
    genericAi: 'Cannot perform forensic OCR on watermarked court bundles or cross-reference opposing exhibits.',
    aiLegal: 'Built-in Evidence Vault with bilingual OCR, date anomaly detection, and automated evidentiary matrix generation.'
  },
  {
    dimension: 'Courtroom Preparation',
    genericAi: 'Static chat queries without simulated judicial temperament or oral argument feedback.',
    aiLegal: 'Interactive AI Mock Courtroom with real-time voice and text interrogation, objection simulation, and judicial scoring.'
  },
  {
    dimension: 'Practice Management',
    genericAi: 'Completely disconnected from client updates, hearing calendars, and team collaboration.',
    aiLegal: 'Integrated legal operating system with WhatsApp client communication, docket timelines, and team access controls.'
  }
];

export const ROADMAP_ITEMS = [
  {
    tier: 'Available Now',
    badge: 'Production Ready',
    statusClass: 'status-now',
    items: [
      'Global AI Legal Assistant & Context Reasoning Engine',
      'Centralized "My Cases" Docket & Matter Repository',
      'Dedicated Case Workspaces with Document Ingestion',
      'AI Draft Maker with Multi-format Export (PDF, DOCX, TXT)',
      'High-Precision Evidence Vault & Document OCR Analysis',
      'Interactive AI Mock Courtroom (Voice & Text Hearing)',
      'Contract Risk & Missing Clause Auditing',
      'AI Client Connect with Templated WhatsApp Workflows'
    ]
  },
  {
    tier: 'Coming Next',
    badge: 'Under Active Rollout',
    statusClass: 'status-next',
    items: [
      'Bilingual Vernacular Court Drafting (Hindi, Regional Indian Languages)',
      'Automated Cause-List Sync with E-Courts and State Tribunals',
      'Direct Voice Dictation & Courtroom Oral Note Transcription',
      'Multi-Party Redline Negotiation Sandbox for Commercial Teams'
    ]
  },
  {
    tier: 'Future Vision',
    badge: 'Architectural Frontier',
    statusClass: 'status-future',
    items: [
      'Global Cross-Border Statutory Harmonization Engine',
      'Zero-Knowledge Proof Document Verification Architecture',
      'Predictive Judicial Precedent Graphs across International Courts',
      'Autonomous Enterprise Compliance Drift Surveillance'
    ]
  }
];

export const TRUST_PILLARS = [
  {
    title: 'Matter-Isolated Context',
    description: 'Each legal matter resides in a cryptographically isolated workspace. Document embeddings and context never bleed across client files.',
    icon: 'fa-lock'
  },
  {
    title: 'Controlled Access & Permissions',
    description: 'Granular role-based access management enables chambers and firms to dictate precise viewing, editing, and export rights.',
    icon: 'fa-user-shield'
  },
  {
    title: 'Structured Procedural Guardrails',
    description: 'Engineered specifically for legal workflows with explicit disclaimers and non-guarantee principles to preserve professional ethics.',
    icon: 'fa-scale-balanced'
  },
  {
    title: 'Data Privacy Architecture',
    description: 'Client files and proprietary briefs are processed with high-security transport encryption and strict tenant privacy boundaries.',
    icon: 'fa-file-shield'
  },
  {
    title: 'Forensic Audit Trails',
    description: 'Comprehensive immutable activity logs document every generated draft, evidence query, and client communication dispatch.',
    icon: 'fa-list-check'
  },
  {
    title: 'Professional-Grade Reliability',
    description: 'Architected on enterprise cloud infrastructure with high uptime and regional redundancy for mission-critical court deadlines.',
    icon: 'fa-server'
  }
];
