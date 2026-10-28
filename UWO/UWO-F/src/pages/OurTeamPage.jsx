import React, { useState, useEffect } from 'react';
import { API_URL, BACKEND_BASE } from '../services/api';

export default function OurTeamPage() {
  const [members, setMembers] = useState(getDefaultTeam());
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadTeam() {
      try {
        const res = await fetch(`${API_URL}/team-members/public`);
        if (!res.ok) throw new Error('Failed to fetch team');
        const data = await res.json();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          // Explicitly exclude Bhumika Patel, Sakshi Jain, Aman Patel, and Prateek Sharma
          const excludedNames = ['bhumika patel', 'sakshi jain', 'aman patel', 'prateek sharma', 'prateek'];
          let filtered = data.filter(m => {
            const n = (m.name || '').toLowerCase().trim();
            return !excludedNames.some(ex => n.includes(ex));
          });

          // Required members list to guarantee presence and clean photos
          const requiredMembers = [
            {
              _id: '6a55e1f67caa872f2ef0c81b',
              name: 'Ayush Dubey',
              designation: 'EFV Distribution & Marketplace Head',
              responsible_for: 'EFV Distribution Networks & Marketplace Operations',
              category: 'Business Development',
              is_leadership: false,
              image: 'images/ayush-dubey..webp',
              short_description: 'Leads distribution channels, partner networks, and marketplace sales operations for the EFV™ ecosystem.',
              full_biography: '<p>Ayush Dubey leads EFV™ Distribution and Marketplace operations at UWO™, orchestrating multi-channel distribution, strategic partner networks, and marketplace sales channels. He focuses on scaling the reach of the EFV™ framework across global platforms and driving commercial growth.</p>',
              skills: ['EFV Distribution', 'Marketplace Management', 'Channel Partnerships', 'Sales Network Scaling', 'Commercial Operations'],
              experience: ['Distribution & Marketplace Leadership', 'Channel Management'],
              achievements: []
            },
            {
              _id: '6a5e02f43a8cb2dea9839937',
              name: 'Sandeep Yadav',
              designation: 'Human Resources',
              responsible_for: 'People Operations & Talent Acquisition',
              category: 'Human Resources',
              is_leadership: false,
              image: 'images/sandeep-yadav..webp',
              short_description: 'Oversees talent acquisition, employee onboarding, HR operations, and workplace culture to support organizational growth.',
              full_biography: '<p>Sandeep Yadav manages Human Resources at UWO™, overseeing talent acquisition, employee onboarding, performance management, and workplace culture. He works to cultivate an engaging, productive, and supportive work environment while driving organizational development, policy compliance, and employee relations.</p>',
              skills: ['Human Resources', 'Talent Acquisition', 'Employee Relations', 'Onboarding', 'HR Operations', 'Workplace Culture'],
              experience: ['Human Resources Management', 'People Operations & Culture'],
              achievements: []
            },
            {
              _id: '6a5e0f0c806e7889e3ea1c1d',
              name: 'Sukhmani Kaur',
              designation: 'Marketing Designer',
              responsible_for: 'Visual Design & Brand Identity Assets',
              category: 'Design',
              is_leadership: false,
              image: 'images/sukhmani-kaur..webp',
              short_description: 'Creates impactful visual designs and marketing assets that strengthen brand identity, engage audiences, and support business growth.',
              full_biography: '<p>Sukhmani Kaur creates impactful visual designs and marketing assets that strengthen brand identity, engage audiences, and support business growth across UWO channels. She designs marketing collateral, product visuals, and digital campaign creative.</p>',
              skills: ['Visual Design', 'Brand Identity', 'Marketing Collateral', 'Digital Assets', 'Figma & Creative Suite'],
              experience: ['Brand Identity & Visual Communications', 'Marketing Creative & Digital Asset Design'],
              achievements: []
            },
            {
              _id: '6a5e0f46806e7889e3ea1c26',
              name: 'Aman Kharare',
              designation: 'Business Development Associate',
              responsible_for: 'Client Onboarding & Strategic Outreach',
              category: 'Business Development',
              is_leadership: false,
              image: 'images/aman-kharare..webp',
              short_description: 'Drives business growth by identifying new opportunities, building strong client relationships, and supporting strategic partnerships.',
              full_biography: '<p>Aman Kharare drives business growth by identifying new opportunities, building strong client relationships, and supporting strategic partnerships across UWO solutions. He conducts solution walkthroughs and coordinates onboarding for prospective enterprise partners.</p>',
              skills: ['Strategic Partnerships', 'Client Acquisition', 'Business Growth', 'Negotiations', 'Client Onboarding'],
              experience: ['Corporate Partnerships & Outreach', 'Client Onboarding & Solution Walkthroughs'],
              achievements: []
            },
            {
              _id: '6a5e0f50806e7889e3ea1c30',
              name: 'Sonali Gupta',
              designation: 'Junior AI Software Engineer',
              responsible_for: 'AI Model Integration & Backend Services',
              category: 'Technology',
              is_leadership: false,
              image: 'images/sonali-gupta.jpg',
              short_description: 'Develops AI-powered software applications, integrates intelligent models and APIs, and contributes to backend development and system optimization.',
              full_biography: '<p>Sonali Gupta develops AI-powered software applications, integrates intelligent models and APIs, and contributes to backend development and system optimization. She focuses on building reliable AI solutions, solving technical challenges, and improving application efficiency and user experience.</p>',
              skills: ['AI Application Development', 'Model & API Integration', 'Backend Development', 'System Optimization'],
              experience: ['AI Application Development', 'Intelligent Systems & API Integration'],
              achievements: []
            },
            {
              _id: '6a5e0f50806e7889e3ea1c31',
              name: 'Anupama Awadhiya',
              designation: 'Junior AI Software Engineer',
              responsible_for: 'AI Applications & Orchestration APIs',
              category: 'Technology',
              is_leadership: false,
              image: 'images/anupama-awadhiya.jpg',
              short_description: 'Develops AI-powered software applications, integrates intelligent models and APIs, and contributes to backend development and system optimization.',
              full_biography: '<p>Anupama Awadhiya develops AI-powered software applications, integrates intelligent models and APIs, and contributes to backend development and system optimization. She focuses on building reliable AI solutions, solving technical challenges, and improving application efficiency and user experience.</p>',
              skills: ['AI Application Development', 'Model & API Integration', 'Backend Development', 'System Optimization'],
              experience: ['AI Application Development', 'Intelligent Systems & API Integration'],
              achievements: []
            }
          ];

          requiredMembers.forEach(reqMem => {
            const idx = filtered.findIndex(m => (m.name || '').toLowerCase().includes(reqMem.name.toLowerCase()));
            if (idx === -1) {
              filtered.push(reqMem);
            } else {
              filtered[idx].image = reqMem.image;
              filtered[idx].name = reqMem.name; // normalize name (removes MR. prefix etc.)
              if (!filtered[idx].designation) filtered[idx].designation = reqMem.designation;
            }
          });

          // Also guarantee all standard team members (Leadership & Core Collective) are present
          const defaultTeam = getDefaultTeam();
          const defaultMap = new Map(defaultTeam.map(d => [(d.name || '').toLowerCase().trim(), d]));

          defaultTeam.forEach(defMem => {
            const idx = filtered.findIndex(m => (m.name || '').toLowerCase().includes(defMem.name.toLowerCase()));
            if (idx === -1) {
              filtered.push(defMem);
            }
          });

          // Guarantee clean portrait images, normalize names, and attach verified responsibilities & bios
          filtered = filtered.map(m => {
            const n = (m.name || '').toLowerCase().trim();
            let defMem = null;
            for (const [key, val] of defaultMap.entries()) {
              if (n.includes(key) || key.includes(n)) {
                defMem = val;
                break;
              }
            }

            let updated = { ...m };
            if (defMem) {
              if (!updated.responsible_for) updated.responsible_for = defMem.responsible_for;
              if (!updated.short_description) updated.short_description = defMem.short_description;
              if (!updated.full_biography || updated.full_biography.length < 30) updated.full_biography = defMem.full_biography;
              if (!updated.designation) updated.designation = defMem.designation;
              if (!updated.category) updated.category = defMem.category;
              if (!updated.skills || updated.skills.length === 0) updated.skills = defMem.skills;
              if (!updated.experience || updated.experience.length === 0) updated.experience = defMem.experience;
            }

            if (n.includes('ayush dubey')) {
              return { 
                ...updated, 
                image: 'images/ayush-dubey..webp', 
                designation: 'EFV Distribution & Marketplace Head', 
                responsible_for: 'EFV Distribution Networks & Marketplace Operations',
                short_description: 'Leads distribution channels, partner networks, and marketplace sales operations for the EFV™ ecosystem.',
                full_biography: '<p>Ayush Dubey leads EFV™ Distribution and Marketplace operations at UWO™, orchestrating multi-channel distribution, strategic partner networks, and marketplace sales channels. He focuses on scaling the reach of the EFV™ framework across global platforms and driving commercial growth.</p>',
                skills: ['EFV Distribution', 'Marketplace Management', 'Channel Partnerships', 'Sales Network Scaling', 'Commercial Operations'],
                experience: ['Distribution & Marketplace Leadership', 'Channel Management']
              };
            }
            if (n.includes('sandeep yadav')) {
              return { 
                ...updated, 
                image: 'images/sandeep-yadav..webp', 
                designation: 'Human Resources', 
                category: 'Human Resources',
                responsible_for: 'People Operations & Talent Acquisition',
                short_description: 'Oversees talent acquisition, employee onboarding, HR operations, and workplace culture to support organizational growth.',
                full_biography: '<p>Sandeep Yadav manages Human Resources at UWO™, overseeing talent acquisition, employee onboarding, performance management, and workplace culture. He works to cultivate an engaging, productive, and supportive work environment while driving organizational development, policy compliance, and employee relations.</p>',
                skills: ['Human Resources', 'Talent Acquisition', 'Employee Relations', 'Onboarding', 'HR Operations', 'Workplace Culture'],
                experience: ['Human Resources Management', 'People Operations & Culture']
              };
            }
            if (n.includes('sukhmani kaur')) {
              return { ...updated, image: 'images/sukhmani-kaur..webp', designation: 'Marketing Designer', responsible_for: 'Visual Design & Brand Identity Assets' };
            }
            if (n.includes('aman kharare')) {
              return { ...updated, image: 'images/aman-kharare..webp', designation: 'Business Development Associate', responsible_for: 'Client Onboarding & Strategic Outreach' };
            }
            if (n.includes('milind jha')) {
              return {
                ...updated,
                image: (m.image && !m.image.includes('lh3.googleusercontent.com'))
                  ? m.image
                  : 'images/milind-jha..webp',
                designation: 'Marketing Executive',
                responsible_for: 'Growth Campaigns & Content Distribution'
              };
            }
            if (n.includes('sonali gupta')) {
              return { ...updated, name: 'Sonali Gupta', image: 'images/sonali-gupta.jpg', designation: 'Junior AI Software Engineer', responsible_for: 'AI Model Integration & Backend Services' };
            }
            if (n.includes('anupama')) {
              return { ...updated, name: 'Anupama Awadhiya', image: 'images/anupama-awadhiya.jpg', designation: 'Junior AI Software Engineer', responsible_for: 'AI Applications & Orchestration APIs' };
            }
            if (n.includes('devansh')) {
              return { ...updated, name: 'Devansh Tantway', designation: 'Python Developer', responsible_for: 'UWO Connect™ Core Services & APIs' };
            }
            if (n.includes('abha')) {
              return { ...updated, name: 'Abha Jatav', designation: 'Software Engineer', responsible_for: 'UWO Connect™ Dashboards & Client UI' };
            }
            return updated;
          });

          // Categorization helper: Leadership -> Management -> Technology -> Marketing
          const getMemberSection = (m) => {
            if (m.is_leadership) return 'leadership';
            const cat = (m.category || '').toLowerCase();
            const des = (m.designation || '').toLowerCase();
            if (cat.includes('marketing') || cat.includes('design') || des.includes('marketing') || des.includes('designer')) {
              return 'marketing';
            }
            if (cat.includes('tech') || cat.includes('engineer') || des.includes('developer') || des.includes('engineer') || des.includes('software')) {
              return 'technology';
            }
            return 'management';
          };

          const leadership = filtered.filter(m => getMemberSection(m) === 'leadership');
          const management = filtered.filter(m => getMemberSection(m) === 'management');
          const technology = filtered.filter(m => getMemberSection(m) === 'technology');
          const marketing = filtered.filter(m => getMemberSection(m) === 'marketing');

          // Management ordering: managers, then associates
          management.sort((a, b) => (a.display_order || 99) - (b.display_order || 99));

          // Technology ordering
          technology.sort((a, b) => (a.display_order || 99) - (b.display_order || 99));

          // Marketing ordering: Sreshthi Sunpal, Milind Jha, Sukhmani Kaur
          marketing.sort((a, b) => {
            const na = (a.name || '').toLowerCase();
            const nb = (b.name || '').toLowerCase();
            if (na.includes('sreshthi')) return -1;
            if (nb.includes('sreshthi')) return 1;
            if (na.includes('milind')) return -1;
            if (nb.includes('milind')) return 1;
            return (a.display_order || 99) - (b.display_order || 99);
          });

          filtered = [...leadership, ...management, ...technology, ...marketing];

          setMembers(filtered);
        } else if (isMounted) {
          setMembers(getDefaultTeam());
        }
      } catch (err) {
        if (isMounted) setMembers(getDefaultTeam());
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadTeam();
    return () => { isMounted = false; };
  }, []);

  // Bidirectional Scroll Effect: Top to Bottom & Bottom to Top
  useEffect(() => {
    if (loading || members.length === 0) return;

    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;

    const checkElements = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const isScrollingDown = currentScrollY >= lastScrollY;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const triggerOffset = 40;

      const elements = document.querySelectorAll('.scroll-reveal');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < (viewportHeight - triggerOffset) && rect.bottom > triggerOffset;

        if (inView) {
          if (!el.classList.contains('is-visible')) {
            if (!el.classList.contains('from-bottom') && !el.classList.contains('from-top')) {
              el.classList.add(isScrollingDown ? 'from-bottom' : 'from-top');
            }
            requestAnimationFrame(() => {
              el.classList.add('is-visible');
            });
          }
        } else {
          // Off-screen: prepare for opposite entrance
          if (rect.top >= viewportHeight) {
            // Fully below the viewport: will enter from bottom when scrolling down
            el.classList.remove('is-visible', 'from-top');
            el.classList.add('from-bottom');
          } else if (rect.bottom <= 0) {
            // Fully above the viewport: will enter from top when scrolling up
            el.classList.remove('is-visible', 'from-bottom');
            el.classList.add('from-top');
          }
        }
      });

      lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkElements();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check on mount & after elements render
    checkElements();
    const timer1 = setTimeout(checkElements, 80);
    const timer2 = setTimeout(checkElements, 350);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [members, loading]);

  function getDefaultTeam() {
    return [
      {
        _id: '1',
        name: 'Gurumukh P. Ahuja',
        designation: 'Founder & Managing Director',
        responsible_for: 'Executive Strategy, AI Systems & Platform Architecture',
        category: 'Leadership',
        is_leadership: true,
        image: 'images/founder..webp',
        short_description: 'Leads executive strategy, technology architecture, and company building across UWO’s AI platforms.',
        full_biography: '<p>Gurumukh P. Ahuja is the Founder &amp; Managing Director of Unified Web Options &amp; Services Pvt. Ltd. (UWO&trade;). He architects the company’s long-term vision, systemic platform engineering, and enterprise AI ecosystems across digital workspaces, legal intelligence, automated marketing, and modern education. Author of the EFV&trade; (Exponential Financial Velocity) business methodology framework, he directs multidisciplinary engineering teams translating complex industry workflows into autonomous, scalable AI platforms.</p>',
        experience: [
          'Executive Leadership & Venture Building',
          'AI Systems & Platform Architecture',
          'Ecosystem Strategy & Framework Design'
        ],
        skills: ['AI Architecture', 'Product Strategy', 'System Design', 'Enterprise Technology', 'Executive Leadership']
      },
      {
        _id: '2',
        name: 'Anjali Ahuja',
        designation: 'Co-founder & Director',
        responsible_for: 'Corporate Governance, Operations & Strategic Alignment',
        category: 'Leadership',
        is_leadership: true,
        image: 'images/team-3..webp',
        short_description: 'Directs organizational operations, regulatory compliance, and cross-departmental alignment.',
        full_biography: '<p>Anjali Ahuja is the Co-founder &amp; Director of Unified Web Options &amp; Services Pvt. Ltd. (UWO&trade;). She steers executive governance, organizational operations, corporate regulatory compliance, and cross-functional alignment. Her leadership forms the operational pillar of UWO, ensuring structural agility, robust legal adherence, and synergy between technical and commercial divisions.</p>',
        experience: [
          'Corporate Governance & Operations',
          'Organizational Scaling & Compliance',
          'Executive Team Leadership'
        ],
        skills: ['Corporate Governance', 'Operational Strategy', 'Regulatory Compliance', 'Organizational Leadership', 'Cross-Functional Alignment']
      },
      {
        _id: '3',
        name: 'Sonali Jain',
        designation: 'Business Development Manager',
        responsible_for: 'Enterprise Partnerships & Strategic Client Growth',
        category: 'Business Development',
        is_leadership: false,
        image: 'images/team-7..webp',
        short_description: 'Drives enterprise client relationships, corporate partnerships, and market expansion across UWO platforms.',
        full_biography: '<p>Sonali Jain leads business development initiatives at UWO&trade;, identifying high-value commercial opportunities, forging strategic corporate partnerships, and accelerating revenue growth. She collaborates closely with enterprise stakeholders and sales teams to drive adoption of UWO\'s intelligent software solutions across target markets.</p>',
        experience: [
          'Enterprise Business Development',
          'Strategic Client Partnerships & Negotiations',
          'Market Expansion & Revenue Growth'
        ],
        skills: ['Enterprise Sales', 'Partnership Strategy', 'Key Account Management', 'Commercial Negotiations', 'Market Expansion']
      },
      {
        _id: '6',
        name: 'Ritesh Shrivastav',
        designation: 'Product Manager',
        responsible_for: 'Product Delivery, Agile Roadmaps & User Experience',
        category: 'Operations',
        is_leadership: false,
        image: 'images/team-4..webp',
        short_description: 'Coordinates sprint planning, user requirement translation, and agile delivery across UWO product lines.',
        full_biography: '<p>Ritesh Shrivastav manages sprint delivery, feature prioritization, and product lifecycle execution across UWO’s application suite. He translates business requirements into intuitive user workflows, coordinates agile engineering sprints, and ensures high usability and product reliability across platform releases.</p>',
        experience: [
          'Product Lifecycle Management',
          'Agile & Scrum Delivery Frameworks',
          'User Journey & Workflow Optimization'
        ],
        skills: ['Product Management', 'Sprint Planning', 'Roadmap Strategy', 'User Experience (UX)', 'Agile Methodologies']
      },
      {
        _id: '7',
        name: 'Vishal Vashani',
        designation: 'Accounts Executive',
        responsible_for: 'Financial Operations, Corporate Reporting & Compliance',
        category: 'Finance',
        is_leadership: false,
        image: 'images/team-2..webp',
        short_description: 'Manages corporate financial reporting, statutory filings, vendor reconciliations, and budgeting operations.',
        full_biography: '<p>Vishal Vashani manages corporate financial reporting, statutory filings, vendor reconciliations, and budgeting operations at UWO&trade;. He maintains precise financial governance, transparent auditing controls, and statutory adherence across all corporate and business entities.</p>',
        experience: [
          'Corporate Accounting & Financial Control',
          'Statutory Compliance & Auditing',
          'Budgeting & Treasury Operations'
        ],
        skills: ['Financial Reporting', 'Tax Compliance', 'Budget Management', 'Accounts Reconciliation', 'Corporate Finance']
      },
      {
        _id: '8',
        name: 'Sakshi Thakur',
        designation: 'Full Stack Developer',
        responsible_for: 'Web Platform Engineering, APIs & Database Systems',
        category: 'Technology',
        is_leadership: false,
        image: 'images/team-10..webp',
        short_description: 'Builds responsive full-stack features, authentication workflows, and database integrations across enterprise web platforms.',
        full_biography: '<p>Sakshi Thakur develops responsive full-stack features, authentication workflows, and robust database architectures across UWO’s web platforms. She specializes in crafting seamless front-to-back integration, ensuring high application security, scalability, and system performance.</p>',
        experience: [
          'Full Stack Web Application Development',
          'RESTful API Architecture & Authentication',
          'Database Modeling & State Management'
        ],
        skills: ['React.js', 'Node.js', 'MongoDB', 'REST APIs', 'Full Stack Architecture']
      },
      {
        _id: '9',
        name: 'Sanskar Sahu',
        designation: 'Mern Stack Developer',
        responsible_for: 'Realtime Web Interfaces & Client Portals',
        category: 'Technology',
        is_leadership: false,
        image: 'images/team-6..webp',
        short_description: 'Develops modern web components, API integrations, and real-time interface states for consumer and enterprise portals.',
        full_biography: '<p>Sanskar Sahu specializes in modern web development, state management, and real-time data connectivity across UWO portals. He engineers dynamic, high-responsiveness client interfaces and scalable backend services powering enterprise workflows.</p>',
        experience: [
          'MERN Stack Architecture & Development',
          'Realtime Systems & WebSocket Integrations',
          'Component-Driven Frontend Engineering'
        ],
        skills: ['React.js', 'Express.js', 'Node.js', 'MongoDB', 'Redux & State Architecture']
      },
      {
        _id: '10',
        name: 'Gauhar Iftekhar',
        designation: 'Web Developer',
        responsible_for: 'Frontend Design, UI Performance & Web Accessibility',
        category: 'Technology',
        is_leadership: false,
        image: 'images/team-5..webp',
        short_description: 'Implements high-performance web interfaces, accessibility compliance, and modern responsive layouts across UWO websites.',
        full_biography: '<p>Gauhar Iftekhar implements accessible, high-performance web interfaces and modern responsive layouts across UWO’s public web platforms and documentation portals. He focuses on CSS animation, cross-browser compatibility, and core web vitals optimization.</p>',
        experience: [
          'Responsive Web UI Development',
          'Frontend Performance Optimization',
          'Modern CSS & Motion Systems'
        ],
        skills: ['HTML5/CSS3', 'JavaScript (ES6+)', 'Responsive Design', 'Web Performance', 'UI Frameworks']
      },
      {
        _id: '11',
        name: 'Aditi Lakhera',
        designation: 'Software Developer',
        responsible_for: 'Frontend Components & Interactive User Journeys',
        category: 'Technology',
        is_leadership: false,
        image: 'images/aditi.jpeg',
        short_description: 'Builds modular frontend components, interface logic, and seamless platform workflows.',
        full_biography: '<p>Aditi Lakhera develops modular frontend components, interactive interface logic, and seamless platform workflows across UWO client applications. She prioritizes clean code structure, component reusability, and intuitive interactive user journeys.</p>',
        experience: [
          'Frontend Application Engineering',
          'Interactive Component Design',
          'Cross-Platform Testing & Integration'
        ],
        skills: ['JavaScript', 'React.js', 'Component Systems', 'UI/UX Integration', 'Web Standards']
      },
      {
        _id: '12',
        name: 'Abha Jatav',
        designation: 'Software Engineer',
        responsible_for: 'UWO Connect™ Dashboards & Client UI',
        category: 'Technology',
        is_leadership: false,
        image: 'images/team-13..webp',
        short_description: 'Develops responsive CRM interfaces, client dashboard modules, and interactive catalog workflows for UWO Connect™.',
        full_biography: '<p>Abha Jatav engineers responsive frontend dashboards, team collaboration views, and real-time conversation modules for UWO Connect&trade; enterprise users. She ensures data visualizations, client workspaces, and admin panels remain intuitive, responsive, and reliable.</p>',
        experience: [
          'Enterprise Dashboard Engineering',
          'Data Visualization & UI Architecture',
          'Client Portal Workflows'
        ],
        skills: ['React.js', 'UI/UX Architecture', 'Dashboard Engineering', 'API Integration', 'Frontend State']
      },
      {
        _id: '13',
        name: 'Devansh Tantway',
        designation: 'Python Developer',
        responsible_for: 'UWO Connect™ Core Services & APIs',
        category: 'Technology',
        is_leadership: false,
        image: 'images/team-14..webp',
        short_description: 'Builds backend microservices, WhatsApp Business API pipelines, and webhook event processing for UWO Connect™.',
        full_biography: '<p>Devansh Tantway develops scalable server-side microservices, WhatsApp Business API integrations, and webhook event-driven pipelines for UWO Connect&trade; and connected business automation platforms. He specializes in low-latency backend engineering and asynchronous task processing.</p>',
        experience: [
          'Python Backend Microservices',
          'Event-Driven Webhook Pipelines',
          'Third-Party API & Messaging Integrations'
        ],
        skills: ['Python', 'FastAPI / Flask', 'PostgreSQL', 'Webhook Processing', 'WhatsApp Cloud API']
      },
      {
        _id: '18',
        name: 'Sonali Gupta',
        designation: 'Junior AI Software Engineer',
        responsible_for: 'AI Model Integration & Backend Services',
        category: 'Technology',
        is_leadership: false,
        image: 'images/sonali-gupta.jpg',
        short_description: 'Develops AI-powered software applications, integrates intelligent models and APIs, and contributes to backend development and system optimization.',
        full_biography: '<p>Sonali Gupta develops AI-powered software applications, integrates intelligent models and APIs, and contributes to backend development and system optimization. She focuses on building reliable AI solutions, solving technical challenges, and improving application efficiency and user experience.</p>',
        experience: [
          'AI Application Development',
          'Intelligent Systems & API Integration'
        ],
        skills: ['AI Application Development', 'Model & API Integration', 'Backend Development', 'System Optimization']
      },
      {
        _id: '19',
        name: 'Anupama Awadhiya',
        designation: 'Junior AI Software Engineer',
        responsible_for: 'AI Applications & Orchestration APIs',
        category: 'Technology',
        is_leadership: false,
        image: 'images/anupama-awadhiya.jpg',
        short_description: 'Develops AI-powered software applications, integrates intelligent models and APIs, and contributes to backend development and system optimization.',
        full_biography: '<p>Anupama Awadhiya develops AI-powered software applications, integrates intelligent models and APIs, and contributes to backend development and system optimization. She focuses on building reliable AI solutions, solving technical challenges, and improving application efficiency and user experience.</p>',
        experience: [
          'AI Application Development',
          'Intelligent Systems & API Integration'
        ],
        skills: ['AI Application Development', 'Model & API Integration', 'Backend Development', 'System Optimization']
      },
      {
        _id: '14',
        name: 'Ayush Dubey',
        designation: 'EFV Distribution & Marketplace Head',
        responsible_for: 'EFV Distribution Networks & Marketplace Operations',
        category: 'Business Development',
        is_leadership: false,
        image: 'images/ayush-dubey..webp',
        short_description: 'Leads distribution channels, partner networks, and marketplace sales operations for the EFV™ ecosystem.',
        full_biography: '<p>Ayush Dubey leads EFV™ Distribution and Marketplace operations at UWO™, orchestrating multi-channel distribution, strategic partner networks, and marketplace sales channels. He focuses on scaling the reach of the EFV™ framework across global platforms and driving commercial growth.</p>',
        experience: [
          'Distribution & Marketplace Leadership',
          'Channel Management'
        ],
        skills: ['EFV Distribution', 'Marketplace Management', 'Channel Partnerships', 'Sales Network Scaling', 'Commercial Operations']
      },
      {
        _id: '15',
        name: 'Sandeep Yadav',
        designation: 'Human Resources',
        responsible_for: 'People Operations & Talent Acquisition',
        category: 'Human Resources',
        is_leadership: false,
        image: 'images/sandeep-yadav..webp',
        short_description: 'Oversees talent acquisition, employee onboarding, HR operations, and workplace culture to support organizational growth.',
        full_biography: '<p>Sandeep Yadav manages Human Resources at UWO™, overseeing talent acquisition, employee onboarding, performance management, and workplace culture. He works to cultivate an engaging, productive, and supportive work environment while driving organizational development, policy compliance, and employee relations.</p>',
        experience: [
          'Human Resources Management',
          'People Operations & Culture'
        ],
        skills: ['Human Resources', 'Talent Acquisition', 'Employee Relations', 'Onboarding', 'HR Operations', 'Workplace Culture']
      },
      {
        _id: '16',
        name: 'Sukhmani Kaur',
        designation: 'Marketing Designer',
        responsible_for: 'Visual Design & Brand Identity Assets',
        category: 'Design',
        is_leadership: false,
        image: 'images/sukhmani-kaur..webp',
        short_description: 'Creates impactful visual designs and marketing assets that strengthen brand identity, engage audiences, and support business growth.',
        full_biography: '<p>Sukhmani Kaur creates impactful visual designs and marketing assets that strengthen brand identity, engage audiences, and support business growth across UWO channels. She designs marketing collateral, product visuals, and digital campaign creative.</p>',
        experience: [
          'Brand Identity & Visual Communications',
          'Marketing Creative & Digital Asset Design'
        ],
        skills: ['Visual Design', 'Brand Identity', 'Marketing Collateral', 'Digital Assets', 'Figma & Creative Suite']
      },
      {
        _id: '17',
        name: 'Aman Kharare',
        designation: 'Business Development Associate',
        responsible_for: 'Client Onboarding & Strategic Outreach',
        category: 'Business Development',
        is_leadership: false,
        image: 'images/aman-kharare..webp',
        short_description: 'Facilitates customer consultations, prospective partner meetings, and smooth platform onboarding.',
        full_biography: '<p>Aman Kharare drives business growth by identifying new opportunities, building strong client relationships, and supporting strategic partnerships across UWO solutions. He conducts solution walkthroughs and coordinates onboarding for prospective enterprise partners.</p>',
        experience: [
          'Corporate Partnerships & Outreach',
          'Client Onboarding & Solution Walkthroughs'
        ],
        skills: ['Strategic Partnerships', 'Client Acquisition', 'Business Growth', 'Negotiations', 'Client Onboarding']
      },
      {
        _id: '5',
        name: 'Sreshthi Sunpal',
        designation: 'Marketing Manager',
        responsible_for: 'Brand Strategy & Growth Marketing',
        category: 'Marketing',
        is_leadership: false,
        image: 'images/team-8..webp',
        short_description: 'Oversees marketing communications, brand positioning, and digital campaign execution across products.',
        full_biography: '<p>Sreshthi Sunpal leads marketing communications, brand identity consistency, and multi-channel audience engagement across the UWO ecosystem. She oversees strategic campaign execution, performance analytics, and content strategy to accelerate user acquisition.</p>',
        experience: [
          'Growth Marketing & Campaign Strategy',
          'Brand Positioning & Multi-Channel Outreach',
          'Audience Analytics & Engagement'
        ],
        skills: ['Brand Strategy', 'Growth Marketing', 'Campaign Analytics', 'Content Strategy', 'Digital Marketing']
      },
      {
        _id: '18',
        name: 'Milind Jha',
        designation: 'Marketing Executive',
        responsible_for: 'Growth Campaigns & Content Distribution',
        category: 'Marketing',
        is_leadership: false,
        image: 'images/milind-jha..webp',
        short_description: 'Coordinates digital marketing campaigns, social media engagement, and community outreach.',
        full_biography: '<p>Milind Jha serves as a Marketing Executive at UWO, driving multi-channel marketing campaigns, user engagement strategies, and digital brand expansion across ecosystem platforms. He manages content syndication and social media distribution pipelines.</p>',
        experience: [
          'Digital Marketing & Social Campaigns',
          'Community Engagement & Content Syndication'
        ],
        skills: ['Digital Campaigns', 'Social Media Strategy', 'Community Outreach', 'Audience Engagement']
      }
    ];
  }

  const resolveImageUrl = (img) => {
    if (!img) return '/images/uwo-logo.png';
    if (img.includes('prateek-sharma')) return '/images/prateek-sharma..webp';
    if (img.includes('ayush-dubey')) return '/images/ayush-dubey..webp';
    if (img.includes('sandeep-yadav')) return '/images/sandeep-yadav..webp?v=2';
    if (img.includes('sukhmani-kaur')) return '/images/sukhmani-kaur..webp';
    if (img.includes('aman-kharare')) return '/images/aman-kharare..webp';
    if (img.includes('milind-jha')) return '/images/milind-jha..webp';
    if (img.includes('sonali-gupta') || img.includes('junior-ai-engineer')) return '/images/sonali-gupta.jpg';
    if (img.includes('anupama') || img.includes('anupama-awadhiya')) return '/images/anupama-awadhiya.jpg';
    if (img.includes('storage.googleapis.com/uwo-document/')) {
      const objectPath = img.split('storage.googleapis.com/uwo-document/')[1];
      return `${API_URL}/media/${objectPath}`;
    }
    if (img.includes('/api/media/')) {
      const mediaPath = img.split('/api/media/')[1];
      return `${API_URL}/media/${mediaPath}`;
    }
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/uploads/')) {
      return `${BACKEND_BASE}${img}`;
    }
    // Local assets from previous website: images/founder..webp etc.
    return `/${img.replace(/^\/+/, '')}`;
  };

  const getSectionKey = (m) => {
    if (m.is_leadership) return 'leadership';
    const cat = (m.category || '').toLowerCase();
    const des = (m.designation || '').toLowerCase();
    if (cat.includes('marketing') || cat.includes('design') || des.includes('marketing') || des.includes('designer')) {
      return 'marketing';
    }
    if (cat.includes('tech') || cat.includes('engineer') || des.includes('developer') || des.includes('engineer') || des.includes('software')) {
      return 'technology';
    }
    return 'management';
  };

  const leadership = members.filter(m => getSectionKey(m) === 'leadership');
  const management = members.filter(m => getSectionKey(m) === 'management');
  const technology = members.filter(m => getSectionKey(m) === 'technology');
  const marketing = members.filter(m => getSectionKey(m) === 'marketing');

  const renderMemberCard = (m, idx) => (
    <div 
      key={m._id || m.name || idx} 
      className="team-card scroll-reveal" 
      onClick={() => setSelectedMember(m)}
      style={{
        background: '#F0EAD8',
        border: '1px solid #DDD0B8',
        borderRadius: '20px',
        padding: '30px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
      }}
    >
      <div 
        style={{
          width: '130px',
          height: '130px',
          margin: '0 auto 20px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid #D6A559',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          background: 'rgba(214, 165, 89, 0.1)',
          transition: 'transform 0.4s ease'
        }}
      >
        <img 
          src={resolveImageUrl(m.image)} 
          alt={m.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          onError={(e) => { 
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/uwo-logo.png'; 
          }}
        />
      </div>
      <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#000', margin: '0 0 6px' }}>
        {m.name}
      </h3>
      <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem', fontWeight: 600, color: '#D6A559', margin: '0 0 6px' }}>
        {m.designation}
      </h4>
      {m.responsible_for && (
        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0', lineHeight: 1.4 }}>
          <strong style={{ color: '#475569' }}>Focus:</strong> {m.responsible_for}
        </p>
      )}
    </div>
  );

  return (
    <div className="our-team-page">
      <style>{`
        /* ================= BIDIRECTIONAL SCROLL ANIMATIONS ================= */
        .scroll-reveal {
          opacity: 0;
          transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }

        /* Approaching when scrolling DOWN (top to bottom) */
        .scroll-reveal.from-bottom:not(.is-visible) {
          opacity: 0;
          transform: translateY(45px) scale(0.97);
        }

        /* Approaching when scrolling UP (bottom to top) */
        .scroll-reveal.from-top:not(.is-visible) {
          opacity: 0;
          transform: translateY(-45px) scale(0.97);
        }

        /* Leadership Founder lateral glide */
        .leadership-profile:not(.alt-row).from-bottom:not(.is-visible) {
          opacity: 0;
          transform: translate(-30px, 40px) scale(0.98);
        }
        .leadership-profile:not(.alt-row).from-top:not(.is-visible) {
          opacity: 0;
          transform: translate(-30px, -40px) scale(0.98);
        }

        /* Leadership Co-founder lateral glide */
        .leadership-profile.alt-row.from-bottom:not(.is-visible) {
          opacity: 0;
          transform: translate(30px, 40px) scale(0.98);
        }
        .leadership-profile.alt-row.from-top:not(.is-visible) {
          opacity: 0;
          transform: translate(30px, -40px) scale(0.98);
        }

        /* Fully visible state */
        .scroll-reveal.is-visible {
          opacity: 1 !important;
          transform: translate(0, 0) scale(1) !important;
        }

        /* Staggered transition delays for grid cards */
        .dept-grid .team-card:nth-child(4n + 1) { transition-delay: 0.04s; }
        .dept-grid .team-card:nth-child(4n + 2) { transition-delay: 0.12s; }
        .dept-grid .team-card:nth-child(4n + 3) { transition-delay: 0.20s; }
        .dept-grid .team-card:nth-child(4n + 4) { transition-delay: 0.28s; }

        .team-card.is-visible:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 16px 36px rgba(214, 165, 89, 0.18) !important;
        }
      `}</style>

      {/* ================= HERO ================= */}
      <section 
        className="hero hero-centered" 
        style={{ 
          minHeight: '45vh', 
          backgroundImage: "url('/images/team-bg..webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '120px 20px 60px'
        }}
      >
        <div className="hero-content-centered scroll-reveal is-visible">
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#fff', marginBottom: '15px' }}>
            Our Team
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#cbd5e1', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            The minds behind the machines. A collective of engineers, researchers,
            and strategists building the future of intelligence.
          </p>
        </div>
      </section>

      {/* ================= DYNAMIC TEAM SECTION ================= */}
      <div id="dynamic-team-wrapper">
        {loading ? (
          <section className="section section-gold" style={{ padding: '80px 20px', textAlign: 'center' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '36px', color: '#D6A559' }}></i>
              <p style={{ marginTop: '16px', color: '#64748b', fontSize: '1.1rem' }}>Loading team profiles...</p>
            </div>
          </section>
        ) : (
          <>
            {/* Leadership Section */}
            {leadership.length > 0 && (
              <section className="section section-gold leadership-section" style={{ padding: '80px 20px', background: '#F5F1E8' }}>
                <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 
                      className="scroll-reveal"
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '2.8rem',
                        fontWeight: 800,
                        color: '#000000',
                        margin: 0,
                        position: 'relative',
                        display: 'inline-block'
                      }}
                    >
                      Leadership Team
                      <span 
                        style={{
                          display: 'block',
                          width: '60px',
                          height: '3px',
                          background: '#D6A559',
                          margin: '12px auto 0',
                          borderRadius: '2px'
                        }}
                      />
                    </h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '70px' }}>
                    {leadership.map((m, idx) => {
                      const isAlt = idx % 2 !== 0;
                      const bioHtml = m.full_biography || (m.short_description ? `<p>${m.short_description}</p>` : '') || '<p>Steering executive initiatives across the UWO ecosystem.</p>';
                      
                      return (
                        <div 
                          key={m._id || idx} 
                          className={`leadership-profile scroll-reveal ${isAlt ? 'alt-row' : ''}`}
                          style={{
                            display: 'flex',
                            gap: '50px',
                            alignItems: 'center',
                            flexDirection: isAlt ? 'row-reverse' : 'row',
                            flexWrap: 'wrap'
                          }}
                        >
                          <div 
                            className="leadership-photo-container" 
                            style={{ flexShrink: 0, margin: '0 auto' }}
                          >
                            <div 
                              className="leadership-photo"
                              style={{
                                width: '260px',
                                height: '260px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '4px solid #D6A559',
                                boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                                background: 'rgba(214, 165, 89, 0.08)',
                                transition: 'transform 0.4s ease'
                              }}
                            >
                              <img 
                                src={resolveImageUrl(m.image)} 
                                alt={m.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                                onError={(e) => { 
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = '/images/uwo-logo.png'; 
                                }}
                              />
                            </div>
                          </div>

                          <div className="leadership-content" style={{ flex: 1, minWidth: '300px', textAlign: 'left' }}>
                            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.2rem', fontWeight: 800, color: '#000', margin: '0 0 6px' }}>
                              {m.name}
                            </h3>
                            <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.15rem', color: '#D6A559', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 10px' }}>
                              {m.designation}
                            </h4>
                            {m.responsible_for && (
                              <p style={{ fontSize: '0.96rem', fontWeight: 600, color: '#475569', margin: '0 0 16px' }}>
                                <span style={{ color: '#D6A559' }}>Responsible for:</span> {m.responsible_for}
                              </p>
                            )}
                            <div 
                              className="leadership-bio"
                              style={{ color: '#334155', lineHeight: 1.75, fontSize: '1.05rem' }}
                              dangerouslySetInnerHTML={{ __html: bioHtml }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Management Section */}
            {management.length > 0 && (
              <section className="section dept-section" style={{ padding: '80px 20px', background: '#EDE5D4', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 
                      className="scroll-reveal"
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '2.6rem',
                        fontWeight: 800,
                        color: '#000000',
                        margin: 0,
                        position: 'relative',
                        display: 'inline-block'
                      }}
                    >
                      Management Team
                      <span 
                        style={{
                          display: 'block',
                          width: '60px',
                          height: '3px',
                          background: '#D6A559',
                          margin: '12px auto 0',
                          borderRadius: '2px'
                        }}
                      />
                    </h2>
                  </div>

                  <div 
                    className="dept-grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                      gap: '30px'
                    }}
                  >
                    {management.map(renderMemberCard)}
                  </div>
                </div>
              </section>
            )}

            {/* Technology & Engineering Section */}
            {technology.length > 0 && (
              <section className="section dept-section" style={{ padding: '80px 20px', background: '#F5F1E8', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 
                      className="scroll-reveal"
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '2.6rem',
                        fontWeight: 800,
                        color: '#000000',
                        margin: 0,
                        position: 'relative',
                        display: 'inline-block'
                      }}
                    >
                      Technology &amp; Engineering
                      <span 
                        style={{
                          display: 'block',
                          width: '60px',
                          height: '3px',
                          background: '#D6A559',
                          margin: '12px auto 0',
                          borderRadius: '2px'
                        }}
                      />
                    </h2>
                  </div>

                  <div 
                    className="dept-grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                      gap: '30px'
                    }}
                  >
                    {technology.map(renderMemberCard)}
                  </div>
                </div>
              </section>
            )}

            {/* Marketing Section */}
            {marketing.length > 0 && (
              <section className="section dept-section" style={{ padding: '80px 20px', background: '#EDE5D4', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 
                      className="scroll-reveal"
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '2.6rem',
                        fontWeight: 800,
                        color: '#000000',
                        margin: 0,
                        position: 'relative',
                        display: 'inline-block'
                      }}
                    >
                      Marketing Team
                      <span 
                        style={{
                          display: 'block',
                          width: '60px',
                          height: '3px',
                          background: '#D6A559',
                          margin: '12px auto 0',
                          borderRadius: '2px'
                        }}
                      />
                    </h2>
                  </div>

                  <div 
                    className="dept-grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                      gap: '30px'
                    }}
                  >
                    {marketing.map(renderMemberCard)}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Profile Detail Modal */}
      {selectedMember && (
        <div 
          className="profile-modal-overlay open"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="profile-modal-content" 
            style={{
              background: '#F5F1E8',
              borderRadius: '24px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '35px',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              color: '#1e293b'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              onClick={() => setSelectedMember(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              &times;
            </button>

            {/* Modal Header */}
            <div style={{ display: 'flex', gap: '25px', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap' }}>
              <div 
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid #D6A559',
                  flexShrink: 0,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                }}
              >
                <img 
                  src={resolveImageUrl(selectedMember.image)} 
                  alt={selectedMember.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { 
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/uwo-logo.png'; 
                  }}
                />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#000', margin: '0 0 6px' }}>
                  {selectedMember.name}
                </h3>
                <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', color: '#D6A559', fontWeight: 700, margin: '0 0 6px' }}>
                  {selectedMember.designation}
                </h4>
                {selectedMember.responsible_for && (
                  <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 8px', lineHeight: 1.4 }}>
                    <strong style={{ color: '#334155' }}>Responsible for:</strong> {selectedMember.responsible_for}
                  </p>
                )}
                {selectedMember.category && (
                  <span 
                    style={{
                      background: 'rgba(214, 165, 89, 0.15)',
                      color: '#B48E3D',
                      padding: '4px 12px',
                      borderRadius: '50px',
                      fontSize: '12px',
                      fontWeight: 700
                    }}
                  >
                    {selectedMember.category}
                  </span>
                )}
              </div>
            </div>

            {/* About / Biography */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#000', marginBottom: '10px' }}>
                About
              </h4>
              <div 
                style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' }}
                dangerouslySetInnerHTML={{
                  __html: selectedMember.full_biography || (selectedMember.short_description ? `<p>${selectedMember.short_description}</p>` : '') || '<p>No detailed biography provided.</p>'
                }}
              />
            </div>

            {/* Experience */}
            {selectedMember.experience && selectedMember.experience.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#000', marginBottom: '10px' }}>
                  Experience
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  {selectedMember.experience.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {selectedMember.skills && selectedMember.skills.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#000', marginBottom: '10px' }}>
                  Skills &amp; Expertise
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedMember.skills.map((skill, i) => (
                    <span 
                      key={i}
                      style={{
                        background: 'rgba(214, 165, 89, 0.15)',
                        color: '#B48E3D',
                        border: '1px solid rgba(214, 165, 89, 0.3)',
                        padding: '5px 12px',
                        borderRadius: '50px',
                        fontSize: '12px',
                        fontWeight: 700
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {selectedMember.achievements && selectedMember.achievements.length > 0 && (
              <div>
                <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#000', marginBottom: '10px' }}>
                  Achievements
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  {selectedMember.achievements.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
