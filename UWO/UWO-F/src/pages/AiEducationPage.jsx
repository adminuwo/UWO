import React, { useEffect } from 'react';
import AIEducationHero from '../components/aieducation/AIEducationHero';
import AIEducationLearning from '../components/aieducation/AIEducationLearning';
import AIEducationRoles from '../components/aieducation/AIEducationRoles';
import AIEducationModules from '../components/aieducation/AIEducationModules';
import AIEducationDevices from '../components/aieducation/AIEducationDevices';
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
      {/* 01 — FULLSCREEN TEXT-DRIVEN HERO SECTION */}
      <AIEducationHero onExploreClick={() => scrollToSection('learning-section')} />

      {/* 02 — LEARNING: 3D Textbook AI & Student Study Buddy */}
      <AIEducationLearning />

      {/* 03 — ROLES: Real Web & App Functionality for Students, Faculty, Parents, and Admin */}
      <AIEducationRoles />

      {/* 04 — MODULES: 6 Core Functionalities Inside the Platform */}
      <AIEducationModules />

      {/* 05 — PLATFORM: Cross-Device Availability (Web, Android, iOS) */}
      <AIEducationDevices />
    </div>
  );
}
