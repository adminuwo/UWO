import React, { useEffect } from 'react';
import AIEducationHero from '../components/aieducation/AIEducationHero';
import PlatformOverview from '../components/aieducation/PlatformOverview';
import AcademicOS from '../components/aieducation/AcademicOS';
import RoleExplorer from '../components/aieducation/RoleExplorer';
import ModuleExplorer from '../components/aieducation/ModuleExplorer';
import AcademicWorkflow from '../components/aieducation/AcademicWorkflow';
import TextbookAI from '../components/aieducation/TextbookAI';
import ProductShowcase from '../components/aieducation/ProductShowcase';
import InstitutionalEcosystem from '../components/aieducation/InstitutionalEcosystem';
import PlatformAvailability from '../components/aieducation/PlatformAvailability';
import TrustSection from '../components/aieducation/TrustSection';
import FinalCTA from '../components/aieducation/FinalCTA';
import { AI_EDUCATION_META } from '../constants/aiEducationConstants';
import '../ai-education.css';

export default function AiEducationPage() {
  // SEO, Document Meta Tags & JSON-LD Structured Data
  useEffect(() => {
    document.title = AI_EDUCATION_META.title;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = AI_EDUCATION_META.description;

    // OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = AI_EDUCATION_META.title;

    // OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = AI_EDUCATION_META.description;

    // OpenGraph URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = AI_EDUCATION_META.canonical;

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = AI_EDUCATION_META.canonical;

    // JSON-LD Structured Data
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'AI Education™',
      'operatingSystem': 'Web, Android, iOS',
      'applicationCategory': 'EducationalSoftware, BusinessApplication',
      'description': AI_EDUCATION_META.description,
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Unified Web Options & Services Pvt. Ltd. (UWO™)',
        'url': 'https://uwo24.com'
      }
    });
    document.head.appendChild(schemaScript);

    return () => {
      if (document.head.contains(schemaScript)) {
        document.head.removeChild(schemaScript);
      }
    };
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="aied-page-root">
      {/* 01 — HERO with Interactive Product UI Recreation */}
      <AIEducationHero onExploreClick={() => scrollToSection('platform-overview')} />

      {/* 02 — PLATFORM OVERVIEW (Architecture & Microservices) */}
      <PlatformOverview />

      {/* 03 — ACADEMIC OPERATING SYSTEM (Interconnected Layers) */}
      <AcademicOS />

      {/* 04 — ROLE EXPLORER (11 Institutional Personas) */}
      <RoleExplorer />

      {/* 05 — CORE MODULES (9 Verified Engines) */}
      <ModuleExplorer />

      {/* 06 — ACADEMIC WORKFLOWS (Admissions / Timetables / Pedagogy) */}
      <AcademicWorkflow />

      {/* 07 — TEXTBOOK AI / RAG SHOWCASE (Grounded Citations) */}
      <TextbookAI />

      {/* 09 — PRODUCT UI SHOWCASE (Live Screen Renderers) */}
      <ProductShowcase />

      {/* 10 — INSTITUTIONAL ECOSYSTEM (Stakeholder Matrix) */}
      <InstitutionalEcosystem />

      {/* 11 — WEB + MOBILE (React 19 & Expo SDK 56) */}
      <PlatformAvailability />

      {/* 12 — SECURITY & GOVERNANCE (CASA Tier-2) */}
      <TrustSection />

      {/* 13 — FINAL CALL TO ACTION */}
      <FinalCTA onExploreClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </div>
  );
}
