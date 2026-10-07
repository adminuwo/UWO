// UWO Connect™ — Official Flagship Product Constants & Structured Data

export const UWO_CONNECT_WEB_URL = 'http://uwoconnect.aisa24.com/';
export const UWO_CONNECT_IOS_URL = 'https://apps.apple.com/app/uwo-connect/id6470000000';
export const UWO_CONNECT_ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.uwo.uwoconnect&pcampaignid=web_share';
export const UWO_CONNECT_DEMO_URL = '/contact';

export const UWO_CONNECT_META = {
  title: 'UWO Connect™ | Unified Communication & Business Automation Platform',
  description: 'UWO Connect brings communication, CRM, AI automation and business workflows together in one intelligent workspace. Official flagship enterprise platform by UWO™.',
  canonical: 'https://uwo24.com/projects/uwo-connect',
};

// 1. PRODUCT VALUE METRICS
export const VALUE_METRICS = [
  {
    num: '4+',
    label: 'Communication Channels',
    sub: 'WhatsApp, Instagram, Facebook & YouTube',
    icon: 'fa-solid fa-comments',
  },
  {
    num: '8+',
    label: 'Business Connectors',
    sub: 'Gmail, Outlook, Sheets, Docs, Drive & more',
    icon: 'fa-solid fa-plug-circle-bolt',
  },
  {
    num: 'AI-Powered',
    label: 'Autonomous Workflow Engine',
    sub: 'Custom RAG document training & auto-replies',
    icon: 'fa-solid fa-wand-magic-sparkles',
  },
  {
    num: 'Unified',
    label: 'Industrial CRM Pipeline',
    sub: 'Real-time stages, deal tracking & task assignment',
    icon: 'fa-solid fa-chart-pie',
  },
  {
    num: '24/7',
    label: 'Instant Automation',
    sub: 'Zero-latency response, quotation & payment dispatch',
    icon: 'fa-solid fa-bolt',
  },
];

// 2. OMNICHANNEL CHANNELS & CONVERSATION SAMPLES
export const CHANNELS_DATA = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    tag: 'Official Meta Cloud API',
    icon: 'fa-brands fa-whatsapp',
    color: '#25D366',
    status: 'Connected & Verified',
    desc: 'Official WhatsApp Business Cloud integration with verified green tick support, automated broadcast campaigns, interactive catalog sharing, and multi-agent routing.',
    badge: 'Primary Channel',
    conversation: {
      customerName: 'Aarav Malhotra',
      customerAvatar: 'AM',
      customerHandle: '+91 98201 44520',
      source: 'WhatsApp Cloud API',
      messages: [
        { sender: 'customer', text: 'Hi UWO team, can you share the pricing catalog and implementation timeline for our retail chain?', time: '10:42 AM' },
        { sender: 'ai', text: 'Hello Aarav! Absolutely. Here is our 2026 Enterprise Suite catalog along with multi-store implementation milestones.', time: '10:42 AM', isAi: true },
        { sender: 'system', text: 'CRM Pipeline Updated: Stage moved to "Qualified Lead" (Est. Value: ₹1,80,000)', time: '10:43 AM' },
        { sender: 'agent', text: 'I have attached our tailored proposal #QUO-8920 with a 1-click Razorpay payment link. Would you like a brief demo call at 3 PM?', time: '10:44 AM' },
      ],
      leadStage: 'Qualified Lead',
      dealValue: '₹1,80,000',
      assignedTo: 'Neha Sharma (Enterprise Lead)',
    },
  },
  {
    id: 'instagram',
    name: 'Instagram Direct',
    tag: 'Meta Graph API',
    icon: 'fa-brands fa-instagram',
    color: '#E4405F',
    status: 'Active Sync',
    desc: 'Automate Instagram DMs, story mentions, reel comments, and influencer inquiries. Instantly capture customer details and pass qualified prospects into your sales pipeline.',
    badge: 'High Engagement',
    conversation: {
      customerName: 'Kritika Roy',
      customerAvatar: 'KR',
      customerHandle: '@kritika_designs',
      source: 'Instagram DM (via Story Mention)',
      messages: [
        { sender: 'customer', text: 'Loved your new automation showcase! Do you offer white-label licenses for creative agencies?', time: '11:15 AM' },
        { sender: 'ai', text: 'Hi Kritika! Yes, our Agency Tier provides 100% white-labeled client portals with custom branding, domains, and multi-tenant workspaces.', time: '11:15 AM', isAi: true },
        { sender: 'system', text: 'Tag Added: #Agency #WhiteLabel • Lead Score: 94/100', time: '11:16 AM' },
        { sender: 'agent', text: 'Here is our Agency Overview deck. Would you prefer a Zoom walkthrough tomorrow?', time: '11:18 AM' },
      ],
      leadStage: 'Negotiation',
      dealValue: '₹75,000/mo',
      assignedTo: 'Vikram Joshi (Partner Ops)',
    },
  },
  {
    id: 'facebook',
    name: 'Facebook Messenger',
    tag: 'Meta Business Suite',
    icon: 'fa-brands fa-facebook-messenger',
    color: '#0084FF',
    status: 'Live Webhook',
    desc: 'Centralize Facebook business page messages, ad lead campaign inquiries, and post comments into a single collaborative inbox with automated intent detection.',
    badge: 'Ad Funnels',
    conversation: {
      customerName: 'Sunil Verma',
      customerAvatar: 'SV',
      customerHandle: 'Sunil Logistics Pvt. Ltd.',
      source: 'Facebook Click-to-WhatsApp Ad',
      messages: [
        { sender: 'customer', text: 'We saw your fleet dispatch automation ad. Does it integrate with Google Sheets and Outlook?', time: '01:05 PM' },
        { sender: 'ai', text: 'Greetings Sunil! Yes, UWO Connect features native 2-way sync with Google Sheets and Microsoft Outlook with zero coding required.', time: '01:05 PM', isAi: true },
        { sender: 'system', text: 'External Connector Triggered: Google Sheets Row #1042 Created', time: '01:06 PM' },
      ],
      leadStage: 'Demo Booked',
      dealValue: '₹3,20,000',
      assignedTo: 'Aditya Verma (Solutions)',
    },
  },
  {
    id: 'youtube',
    name: 'YouTube Inquiries',
    tag: 'Google Data API',
    icon: 'fa-brands fa-youtube',
    color: '#FF0000',
    status: 'Connected Feed',
    desc: 'Monitor comments across your video tutorials and product releases. Transform technical queries and buying intent into addressable support tickets and CRM leads.',
    badge: 'Content Funnel',
    conversation: {
      customerName: 'DevTech Academy',
      customerAvatar: 'DT',
      customerHandle: 'devtech_admin',
      source: 'YouTube Video #42 ("CRM Architecture")',
      messages: [
        { sender: 'customer', text: 'Can this platform trigger webhook alerts when an order invoice is marked paid via UPI?', time: '03:30 PM' },
        { sender: 'ai', text: 'Yes! Instant webhook dispatch fires on payment confirmation, updating your ERP and sending a GST invoice directly to the customer.', time: '03:30 PM', isAi: true },
        { sender: 'system', text: 'Auto-ticket #YT-481 opened • Priority: High', time: '03:31 PM' },
      ],
      leadStage: 'New Lead',
      dealValue: '₹95,000',
      assignedTo: 'Dev Support Desk',
    },
  },
];

// 3. BUSINESS CONNECTORS DATA
export const BUSINESS_CONNECTORS = [
  {
    name: 'Gmail',
    icon: 'fa-solid fa-envelope',
    imageSrc: '/images/uwoconnect/Gmail.png',
    color: '#EA4335',
    purpose: 'Bi-directional email threads, customer communication sync, and auto-lead logging.',
    status: 'Real-Time Sync',
    badge: 'Google Workspace',
    trigger: 'Email Influx Sync',
  },
  {
    name: 'Zoho CRM',
    icon: 'fa-solid fa-database',
    imageSrc: '/images/uwoconnect/Zoho CRM.png',
    color: '#F0483E',
    purpose: 'Enterprise CRM lead sync, deal conversion tracking, and sales pipeline synchronization.',
    status: 'Native Integration',
    badge: 'Enterprise CRM',
    trigger: 'Pipeline Webhook',
  },
  {
    name: 'Google Sheets',
    icon: 'fa-solid fa-table-cells',
    imageSrc: '/images/uwoconnect/Google Sheet.png',
    color: '#0F9D58',
    purpose: 'Live 2-way lead export, inventory tracking, order logging, and custom reporting.',
    status: 'Instant Webhook',
    badge: 'Data Sync',
    trigger: 'Row Append & Update',
  },
  {
    name: 'Google Docs',
    icon: 'fa-solid fa-file-lines',
    imageSrc: '/images/uwoconnect/Google Docs.png',
    color: '#4285F4',
    purpose: 'Dynamic proposal assembly, contract template generation, and NDA drafting.',
    status: 'Template Active',
    badge: 'Documentation',
    trigger: 'Auto-Generate Docs',
  },
  {
    name: 'Google Maps',
    icon: 'fa-solid fa-location-dot',
    imageSrc: '/images/uwoconnect/Google Maps.png',
    color: '#34A853',
    purpose: 'Location-based sales routing, local branch lookup, and delivery address verification.',
    status: 'Live API',
    badge: 'Geo Services',
    trigger: 'Address Geo-Lookup',
  },
  {
    name: 'Google Slides',
    icon: 'fa-solid fa-file-powerpoint',
    imageSrc: '/images/uwoconnect/Google Slides.png',
    color: '#FBBC04',
    purpose: 'Automated sales pitch decks personalized with client logo and requirements.',
    status: 'Deck Engine',
    badge: 'Sales Collateral',
    trigger: 'Dynamic Deck Export',
  },
  {
    name: 'Google News',
    icon: 'fa-solid fa-newspaper',
    imageSrc: '/images/uwoconnect/Google News.png',
    color: '#4285F4',
    purpose: 'Market intelligence tracking, client news monitoring, and industry alerts.',
    status: 'Live Feed',
    badge: 'Intelligence',
    trigger: 'Keyword Alerts Stream',
  },
  {
    name: 'Microsoft 365 & Outlook',
    icon: 'fa-solid fa-paper-plane',
    isMicrosoft: true,
    color: '#0078D4',
    purpose: 'Enterprise Exchange integration, team calendar scheduling, and meeting dockets.',
    status: 'Connected',
    badge: 'Microsoft 365',
    trigger: 'Calendar & Mail Webhook',
  },
];

// 4. 8-STEP AI + AUTOMATION WORKFLOW
export const AUTOMATION_WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Customer Message',
    badge: 'Omnichannel Influx',
    icon: 'fa-solid fa-message',
    desc: 'Customer reaches out on WhatsApp, Instagram, FB, or Web Chat with an inquiry.',
    liveDetail: 'Aarav: "Need pricing for 50 licenses"',
  },
  {
    step: '02',
    title: 'AI Understands',
    badge: 'Natural Language NLU',
    icon: 'fa-solid fa-brain',
    desc: 'Intent engine extracts product name, quantity, customer budget, and buying timeframe.',
    liveDetail: 'Intent: Purchase • Sentiment: 0.96 High',
  },
  {
    step: '03',
    title: 'CRM Lead Created',
    badge: 'Instant CRM Capture',
    icon: 'fa-solid fa-address-card',
    desc: 'New lead profile automatically created with contact details, tags, and pipeline stage.',
    liveDetail: 'Lead #4912 created • Stage: Qualified',
  },
  {
    step: '04',
    title: 'Automated Reply',
    badge: '<0.8s Sub-Second',
    icon: 'fa-solid fa-robot',
    desc: 'AI replies instantly with contextual product information, FAQ answers, and catalogs.',
    liveDetail: 'Catalog link & specs dispatched',
  },
  {
    step: '05',
    title: 'Quotation / Proposal',
    badge: 'Dynamic Generation',
    icon: 'fa-solid fa-file-invoice-dollar',
    desc: 'System dynamically generates a custom branded PDF quotation with SKU line items.',
    liveDetail: 'Quotation #QUO-8920 generated (₹1.8L)',
  },
  {
    step: '06',
    title: 'Payment Link Sent',
    badge: 'UPI & Gateway',
    icon: 'fa-solid fa-credit-card',
    desc: 'Integrated Razorpay / PhonePe UPI QR code & payment link dispatched in conversation.',
    liveDetail: 'Payment link active: UPI / Netbanking',
  },
  {
    step: '07',
    title: 'GST Invoice Produced',
    badge: 'Tax Compliant',
    icon: 'fa-solid fa-receipt',
    desc: 'Payment webhook triggers automated GST-compliant tax invoice generation & PDF delivery.',
    liveDetail: 'GST Invoice #INV-2026-081 ready',
  },
  {
    step: '08',
    title: 'Workflow Completed',
    badge: 'End-to-End Success',
    icon: 'fa-solid fa-circle-check',
    desc: 'Deal marked "Won" in CRM, team alerted on internal channels, delivery auto-scheduled.',
    liveDetail: 'Pipeline Updated: Revenue Logged',
  },
];

// 5. FEATURE ECOSYSTEM (16 CAPABILITIES)
export const FEATURE_ECOSYSTEM = [
  {
    id: 1,
    name: 'Unified Shared Inbox',
    category: 'Communication',
    icon: 'fa-solid fa-inbox',
    desc: 'Consolidate WhatsApp, Instagram, Facebook, and Web conversations into a single collaborative workspace with agent assignments and private internal notes.',
    highlight: 'Multi-Agent Routing',
  },
  {
    id: 2,
    name: 'Visual CRM Pipeline',
    category: 'Sales & CRM',
    icon: 'fa-solid fa-table-columns',
    desc: 'Track deals across customizable visual Kanban stages (New, Contacted, Qualified, Negotiation, Won) with scheduled follow-ups and revenue forecasts.',
    highlight: 'Drag-and-Drop Stages',
  },
  {
    id: 3,
    name: 'AI Copilot & Doc Training',
    category: 'AI & Automation',
    icon: 'fa-solid fa-brain',
    desc: 'Upload your company PDFs, product sheets, and policies. The AI Copilot trains on your knowledge base to provide accurate 24/7 autonomous support.',
    highlight: 'RAG Knowledge Base',
  },
  {
    id: 4,
    name: 'Visual Workflow Builder',
    category: 'AI & Automation',
    icon: 'fa-solid fa-diagram-project',
    desc: 'Create branching multi-condition automations with zero coding. Trigger actions based on customer keywords, time delays, tags, and webhook events.',
    highlight: 'No-Code Canvas',
  },
  {
    id: 5,
    name: 'Multi-Channel Broadcasts',
    category: 'Communication',
    icon: 'fa-solid fa-bullhorn',
    desc: 'Dispatch high-converting opt-in broadcast campaigns across WhatsApp and social channels with audience segmentation and real-time delivery analytics.',
    highlight: 'High Open Rates',
  },
  {
    id: 6,
    name: 'Quotation & Proposal Maker',
    category: 'Sales & CRM',
    icon: 'fa-solid fa-file-contract',
    desc: 'Generate professional, branded quotations and commercial proposals in seconds with automated pricing calculation and 1-click customer delivery.',
    highlight: 'Branded PDF Output',
  },
  {
    id: 7,
    name: 'Automated GST Invoicing',
    category: 'Sales & CRM',
    icon: 'fa-solid fa-file-invoice',
    desc: 'Produce 100% tax-compliant GST invoices with automatic CGST, SGST, IGST calculations, HSN codes, and automatic ledger synchronization.',
    highlight: 'GST Compliant',
  },
  {
    id: 8,
    name: 'Digital Product Catalogs',
    category: 'Sales & CRM',
    icon: 'fa-solid fa-boxes-stacked',
    desc: 'Showcase interactive product catalogs directly inside customer chat windows with high-res photos, specifications, inventory counts, and instant ordering.',
    highlight: 'In-Chat Shopping',
  },
  {
    id: 9,
    name: 'Instant Payment Gateway',
    category: 'Sales & CRM',
    icon: 'fa-solid fa-credit-card',
    desc: 'Accept payments via UPI, QR codes, credit cards, debit cards, and net banking with seamless Razorpay and PhonePe automated payment link dispatch.',
    highlight: 'Zero Friction Checkout',
  },
  {
    id: 10,
    name: 'Team Dashboard & Allocation',
    category: 'Management',
    icon: 'fa-solid fa-users-gear',
    desc: 'Empower managers with real-time agent presence, response SLA monitoring, conversation workload rebalancing, and granular department permissions.',
    highlight: 'Role-Based Access',
  },
  {
    id: 11,
    name: 'WebRTC Voice & Video Calling',
    category: 'Communication',
    icon: 'fa-solid fa-video',
    desc: 'Launch HD voice and video briefing calls directly inside the browser with zero software downloads, screen sharing, and automated call notes.',
    highlight: 'In-Browser Calling',
  },
  {
    id: 12,
    name: 'Real-Time Analytics & ROI',
    category: 'Management',
    icon: 'fa-solid fa-chart-line',
    desc: 'Monitor conversation volume, lead conversion rates, agent resolution time, revenue generated, and campaign performance via visual executive dashboards.',
    highlight: 'Custom Reports',
  },
];

// 6. ROLES SECTION
export const ROLES_DATA = [
  {
    id: 'owner',
    title: 'Business Owner',
    subtitle: 'Visibility, control & revenue acceleration',
    icon: 'fa-solid fa-crown',
    needs: 'Complete high-altitude operational visibility, automated revenue capture, zero missed customer inquiries, and reduced software overhead.',
    howHelps: 'Consolidates 6 disconnected software subscriptions into one intelligent workspace. Provides live revenue dashboards, automated customer follow-ups, and 24/7 lead capture.',
    keyFeatures: ['Executive Revenue Dashboard', 'Unified Team Performance', 'Automated Lead Retention', 'Single Software Bill'],
    workflow: 'Lead Inquiry → Auto AI Qualification → Instant Quote → Payment Confirmed → Revenue Logged',
  },
  {
    id: 'sales',
    title: 'Sales Team',
    subtitle: 'Shorter deal cycles & automated follow-ups',
    icon: 'fa-solid fa-handshake',
    needs: 'Instant lead alerts, pre-qualified customer inquiries, dynamic quotation generation, and automated follow-ups without manual spreadsheets.',
    howHelps: 'AI engages incoming prospects within 0.8 seconds, qualifies their budget, creates a CRM deal card, and generates quotations with embedded payment links.',
    keyFeatures: ['Instant Lead Capture', 'Interactive Digital Catalogs', '1-Click Quotation Generator', 'Automated WhatsApp Follow-ups'],
    workflow: 'New Lead → AI Scores 95/100 → Catalog Shared → Rep Sends Quote → Deal Closed',
  },
  {
    id: 'marketing',
    title: 'Marketing Team',
    subtitle: 'Higher conversions & targeted broadcasts',
    icon: 'fa-solid fa-bullseye',
    needs: 'High open-rate communication channels, opt-in WhatsApp campaign broadcasts, click-to-WhatsApp ad tracking, and conversion analytics.',
    howHelps: 'Execute segmented promotional broadcasts with rich media and interactive quick-reply buttons. Track campaign revenue attribution down to the exact message.',
    keyFeatures: ['Targeted WhatsApp Broadcasts', 'Click-to-Chat Ad Tracking', 'Audience Segmentation', 'Real-time ROI Telemetry'],
    workflow: 'Segment Audience → Trigger Broadcast → 98% Delivery → Instant In-Chat Purchases',
  },
  {
    id: 'support',
    title: 'Customer Support',
    subtitle: '24/7 SLA resolution & shared team inbox',
    icon: 'fa-solid fa-headset',
    needs: 'Rapid ticket resolution, shared multi-agent inbox, collision prevention (avoiding two agents replying to the same customer), and AI assistance.',
    howHelps: 'Automate 80% of repetitive Tier-1 inquiries with RAG AI trained on company PDFs. Escalate complex tickets to human agents with full conversation context.',
    keyFeatures: ['Shared Multi-Agent Inbox', 'Collision Detection', 'AI Copilot Suggestions', 'Custom SLA Response Timers'],
    workflow: 'Query Influx → AI Resolves 80% → Complex Issue Tagged → Human Agent Steps In',
  },
  {
    id: 'admin',
    title: 'Admin & IT Team',
    subtitle: 'Enterprise security, RBAC & API compliance',
    icon: 'fa-solid fa-shield-halved',
    needs: 'Granular role-based access, data encryption, webhook reliability, API documentation, and isolated user workspaces.',
    howHelps: 'Strict multi-tier permission matrix (Admin, Manager, Agent, Observer), enterprise end-to-end encryption, and robust developer webhooks with audit logging.',
    keyFeatures: ['Role-Based Access Control', 'Encrypted Credentials', 'RESTful API & Webhooks', 'Audit & Access Logs'],
    workflow: 'Admin Invites Team → Assigns Specific Departments → Configures Webhooks → Audits Logs',
  },
  {
    id: 'enterprise',
    title: 'Enterprise Team',
    subtitle: 'High-throughput scaling & custom workflows',
    icon: 'fa-solid fa-building-columns',
    needs: 'High volume message throughput, customized integration with existing ERP/SAP systems, dedicated cloud hosting, and SLA guarantees.',
    howHelps: 'Engineered for high concurrent load with dedicated socket clusters, custom ERP connectors, and enterprise security frameworks.',
    keyFeatures: ['High-Throughput Clusters', 'Custom ERP Integrations', 'Dedicated Account Manager', 'Enterprise SLA Guarantees'],
    workflow: 'Enterprise Volume → Socket Load Balancing → High-Speed Processing → ERP Sync',
  },
];

// 7. USE CASES DATA
export const USE_CASES_DATA = [
  {
    title: 'High-Intent Lead Generation',
    tag: 'Sales Acceleration',
    icon: 'fa-solid fa-bolt',
    headline: 'Capture Every Prospect the Exact Second They Show Interest',
    steps: ['Click-to-WhatsApp Ad', 'Instant AI Greeting & Needs Check', 'Contact Logged to CRM', 'Meeting Booked / Quoted'],
    desc: 'Eliminate 24-hour lead response delays. Convert cold traffic into qualified opportunities with instant interactive chat qualification and automated scheduling.',
  },
  {
    title: '24/7 Autonomous Customer Support',
    tag: 'Customer Care',
    icon: 'fa-solid fa-clock-rotate-left',
    headline: 'Zero Queue Times, Round-the-Clock Accurate Answers',
    steps: ['Customer Query Influx', 'AI Reads Knowledge PDFs', 'Instant Factual Response', 'Escalation When Required'],
    desc: 'Train AI Copilots on your product manuals, refund policies, and pricing sheets. Resolve over 80% of customer tickets instantly without hiring extra shifts.',
  },
  {
    title: 'WhatsApp Commerce & Instant Checkout',
    tag: 'Direct Sales',
    icon: 'fa-solid fa-bag-shopping',
    headline: 'Sell Products & Services Inside the World’s Favorite Chat App',
    steps: ['Customer Browses Catalog', 'Selects Items in Chat', 'Dynamic Invoice Generated', 'UPI / Card Payment Link Sent'],
    desc: 'Turn conversations into transactions. Share interactive digital catalogs with dynamic SKU pricing, generate quotes on the fly, and collect UPI payments in seconds.',
  },
  {
    title: 'High-Conversion Promotional Broadcasts',
    tag: 'Marketing Campaigns',
    icon: 'fa-solid fa-paper-plane',
    headline: 'Achieve 98% Open Rates & 5x Higher Click-Through Rates',
    steps: ['Filter Audience Segments', 'Compose Rich Media Message', 'Meta Cloud API Dispatch', 'Live Revenue Tracking'],
    desc: 'Reach thousands of verified opt-in customers with personalized holiday promotions, event alerts, and VIP offers that actually get opened and read.',
  },
  {
    title: 'Automated Quotation & GST Invoicing',
    tag: 'Finance & Operations',
    icon: 'fa-solid fa-receipt',
    headline: 'From Agreement to Tax-Compliant Invoice in 1 Click',
    steps: ['Custom Scope Confirmed', 'PDF Quotation Generated', 'Client Approves & Pays', 'GST Invoice Auto-Dispatched'],
    desc: 'Eliminate tedious manual accounting data entry. Generate professional GST-compliant invoices with automated tax calculations, HSN codes, and instant PDF delivery.',
  },
  {
    title: 'Multi-Agent Field & Office Collaboration',
    tag: 'Team Operations',
    icon: 'fa-solid fa-people-arrows',
    headline: 'Equip Your Entire Organization With One Shared Operational Inbox',
    steps: ['Incoming Conversation', 'Smart Department Routing', 'Agent Assignment & Tagging', 'Internal Team Note Chat'],
    desc: 'Empower sales reps, support engineers, and billing specialists to work collaboratively without sharing phone devices or losing message history.',
  },
];

// 8. BEFORE VS AFTER COMPARISON
export const BEFORE_AFTER_DATA = [
  {
    category: 'Customer Response Time',
    before: '4 to 24 hours delayed response; prospects cool off and switch to competitors.',
    after: 'Sub-second (<0.8s) instant AI response 24/7/365 across all channels.',
  },
  {
    category: 'Inbox & Communication',
    before: 'Juggling 5 disconnected apps: WhatsApp Web on phones, Instagram app, Gmail, and FB pages.',
    after: 'One unified multi-agent collaborative inbox with shared access and zero device dependency.',
  },
  {
    category: 'Lead Capture & CRM',
    before: 'Copy-pasting phone numbers manually into Excel spreadsheets; 30% of leads lost.',
    after: 'Automatic CRM contact creation, lead stage tracking, and automated task reminders.',
  },
  {
    category: 'Sales Quotations',
    before: 'Hours spent drafting Word documents, converting to PDF, and re-attaching to emails.',
    after: '1-click dynamic quotation generator producing branded PDFs delivered in chat.',
  },
  {
    category: 'Payment Collection',
    before: 'Sharing bank account numbers manually; chasing payments via awkward reminder calls.',
    after: 'Integrated UPI QR codes and Razorpay links sent directly in conversation with auto-receipts.',
  },
  {
    category: 'Invoicing & GST',
    before: 'Manual double-entry into separate billing software days after the transaction.',
    after: 'Instant automated GST tax invoice generation triggered on payment webhook confirmation.',
  },
  {
    category: 'Team Visibility',
    before: 'No idea who spoke to which customer, what was promised, or where deals are stuck.',
    after: 'Complete audit trail, agent workload rebalancing, and executive revenue telemetry.',
  },
  {
    category: 'Software Overhead',
    before: 'Paying 6 different SaaS subscriptions for Chatbot, CRM, Invoicing, Calling, and Connectors.',
    after: 'Single unified platform with integrated communication, CRM, automation, and finance.',
  },
];

// 9. DASHBOARD SHOWCASE TABS
export const DASHBOARD_TABS = [
  {
    id: 'overview',
    label: 'Executive Overview',
    icon: 'fa-solid fa-chart-pie',
    title: 'Real-Time Operational Intelligence',
    subtitle: 'Unified telemetry across your communication channels, conversion rates, and revenue pipeline.',
  },
  {
    id: 'inbox',
    label: 'Unified Inbox',
    icon: 'fa-solid fa-inbox',
    title: 'Collaborative Multi-Agent Workspace',
    subtitle: 'Manage WhatsApp, Instagram, Facebook, and Web chats with private internal notes and collision alerts.',
  },
  {
    id: 'crm',
    label: 'CRM Pipeline',
    icon: 'fa-solid fa-chart-kanban',
    title: 'Visual Deal & Stage Management',
    subtitle: 'Move prospects seamlessly from New Lead to Qualified, Proposal Sent, and Won with automated triggers.',
  },
  {
    id: 'automation',
    label: 'Workflow Canvas',
    icon: 'fa-solid fa-diagram-project',
    title: 'Visual Drag-and-Drop Automations',
    subtitle: 'Build complex if/then conditional journeys, keyword auto-replies, and third-party webhook dispatches.',
  },
  {
    id: 'sales',
    label: 'Sales & Quotes',
    icon: 'fa-solid fa-file-contract',
    title: 'Product Catalogs & Quotations',
    subtitle: 'Select items from your digital catalog and generate branded proposals delivered in-chat in seconds.',
  },
  {
    id: 'finance',
    label: 'GST Invoicing',
    icon: 'fa-solid fa-file-invoice-dollar',
    title: 'Compliant Tax Invoices & UPI Links',
    subtitle: 'Automate tax compliance with auto-calculated GST invoices and integrated payment confirmation.',
  },
];

// 10. FAQS (12 COMPREHENSIVE PRODUCT TRUTHS)
export const FAQS_DATA = [
  {
    q: 'What is UWO Connect™?',
    a: 'UWO Connect is UWO’s flagship unified business communication and automation platform. It brings customer conversations from WhatsApp Business API, Instagram, Facebook, and Web together with an industrial CRM, visual workflow automations, digital product catalogs, and GST invoicing into one intelligent workspace.',
  },
  {
    q: 'Who is UWO Connect built for?',
    a: 'UWO Connect is engineered for business owners, sales teams, digital marketing agencies, e-commerce brands, healthcare clinics, educational institutes, and enterprise organizations who want to eliminate tool fragmentation, accelerate lead conversion, and automate daily customer operations.',
  },
  {
    q: 'Which communication channels can I connect?',
    a: 'UWO Connect connects official Meta WhatsApp Business Cloud API, Instagram Direct DMs, Facebook Messenger, YouTube comments, and business email via Gmail and Microsoft Outlook. All channels stream into one shared team inbox.',
  },
  {
    q: 'Does UWO Connect include a built-in CRM?',
    a: 'Yes. UWO Connect features an industrial visual Kanban CRM pipeline with customizable deal stages (New Lead, Qualified, Hot Lead, Negotiation, Won), contact scoring, scheduled follow-up tasks, and customer activity history.',
  },
  {
    q: 'How does AI automation work in UWO Connect?',
    a: 'You can upload your company brochures, pricing PDFs, FAQs, and service guidelines. UWO Connect’s RAG AI engine trains on your proprietary knowledge base to deliver contextual, accurate answers to customer questions 24/7 without hallucinating.',
  },
  {
    q: 'Which business tools and connectors are supported?',
    a: 'UWO Connect natively integrates with Google Workspace (Gmail, Google Sheets, Google Docs, Google Maps, Google Slides, Google News) and Microsoft 365 (Outlook, OneDrive). Custom internal software can also connect via REST APIs and Webhooks.',
  },
  {
    q: 'Can I generate branded quotations and GST tax invoices?',
    a: 'Yes. You can select products from your digital catalog, generate professional PDF quotations with dynamic line items, and automatically issue GST-compliant tax invoices upon payment confirmation.',
  },
  {
    q: 'Can I accept payments directly inside the platform?',
    a: 'Yes. UWO Connect integrates with leading payment gateways including Razorpay and PhonePe UPI. Customers receive payment links and QR codes in-chat, and payment webhooks automatically trigger invoice generation and CRM deal updates.',
  },
  {
    q: 'Is UWO Connect available on mobile devices?',
    a: 'Yes. In addition to our full-featured desktop web application, UWO Connect is available on iOS and Android devices, allowing field sales reps and executives to respond to leads and review pipelines on the go.',
  },
  {
    q: 'Does it support multi-agent team management?',
    a: 'Yes. You can invite unlimited team members, assign specific departments (Sales, Support, Billing), configure collision prevention so two agents never type to the same client at once, and set role-based access permissions.',
  },
  {
    q: 'Is an agency white-label solution available?',
    a: 'Yes. For marketing and digital agencies, UWO Connect offers a multi-tenant white-label tier. Agencies can deploy custom branded client portals with their own logo, custom domain, and isolated client workspaces.',
  },
  {
    q: 'How do I get started with UWO Connect?',
    a: 'You can launch the web application directly at uwoconnect.aisa24.com, book a personalized enterprise demo with our solutions architects, or contact our sales desk to configure your WhatsApp Business API and connector suite.',
  },
];
