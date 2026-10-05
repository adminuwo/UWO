import React, { useEffect } from 'react';
import AiLegalHero from '../components/ailegal/AiLegalHero';
import ProductOverview from '../components/ailegal/ProductOverview';
import EcosystemSection from '../components/ailegal/EcosystemSection';
import RoleExplorer from '../components/ailegal/RoleExplorer';
import UseCaseSection from '../components/ailegal/UseCaseSection';
import WorkflowSection from '../components/ailegal/WorkflowSection';
import ProductShowcase from '../components/ailegal/ProductShowcase';
import DifferentiatorSection from '../components/ailegal/DifferentiatorSection';
import PlatformAvailability from '../components/ailegal/PlatformAvailability';
import TrustSection from '../components/ailegal/TrustSection';
import FinalCTA from '../components/ailegal/FinalCTA';
import { AI_LEGAL_META } from '../constants/aiLegalConstants';
import '../ai-legal.css';

export default function AiLegalPage() {
  // SEO, Title, Meta Tags & JSON-LD Structured Data
  useEffect(() => {
    document.title = AI_LEGAL_META.title;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = AI_LEGAL_META.description;

    // OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = AI_LEGAL_META.title;

    // OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = AI_LEGAL_META.description;

    // OpenGraph URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = AI_LEGAL_META.canonical;

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = AI_LEGAL_META.canonical;

    // JSON-LD Structured Data
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'AI LEGAL™',
      'operatingSystem': 'Web, Android, iOS',
      'applicationCategory': 'BusinessApplication, LegalSoftware',
      'description': AI_LEGAL_META.description,
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
      // Clean up injected structured data
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
    <div className="ai-legal-page">
      {/* Subtle Background Ambience */}
      <div className="ai-legal-ambient ambient-gold-1" aria-hidden="true"></div>
      <div className="ai-legal-ambient ambient-gold-2" aria-hidden="true"></div>
      <div className="ai-legal-ambient ambient-gold-3" aria-hidden="true"></div>

      {/* 1. Hero Section */}
      <AiLegalHero 
        onExploreClick={() => scrollToSection('ecosystem')} 
        onDownloadClick={() => scrollToSection('platforms')} 
      />

      {/* 2. Product Introduction (Meet AI Legal) */}
      <ProductOverview />

      {/* 3. One Platform. Complete Legal Intelligence. (Ecosystem) */}
      <EcosystemSection />

      {/* 4. Legal Professional Roles */}
      <RoleExplorer />

      {/* 5. Real-World Use Cases */}
      <UseCaseSection />

      {/* 6. How AI Legal Works (4-Step Workflow) */}
      <WorkflowSection />

      {/* 7. Product Experience (Multi-UI Showcase) */}
      <ProductShowcase />

      {/* 8. Differentiator Section ("More Than a Chatbot") */}
      <DifferentiatorSection />

      {/* 9. Web + Mobile Availability */}
      <PlatformAvailability />

      {/* 10. Trust / Security Section */}
      <TrustSection />

      {/* 11. Final CTA & Disclaimer */}
      <FinalCTA 
        onExploreClick={() => scrollToSection('ecosystem')} 
        onDownloadClick={() => scrollToSection('platforms')} 
      />
    </div>
  );
}
