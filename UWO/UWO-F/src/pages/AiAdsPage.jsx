import React, { useEffect } from 'react';
import AiAdsHero from '../components/aiads/AiAdsHero';
import BrandDnaSection from '../components/aiads/BrandDnaSection';
import MarketingPipeline from '../components/aiads/MarketingPipeline';
import ModuleShowcase from '../components/aiads/ModuleShowcase';
import SeoIntelligence from '../components/aiads/SeoIntelligence';
import StrategyHub from '../components/aiads/StrategyHub';
import ContentStudio from '../components/aiads/ContentStudio';
import CreativeStudio from '../components/aiads/CreativeStudio';
import AssetLibrary from '../components/aiads/AssetLibrary';
import MarketingFlywheel from '../components/aiads/MarketingFlywheel';
import ConvergenceSection from '../components/aiads/ConvergenceSection';
import UseCasesSection from '../components/aiads/UseCasesSection';
import AiAdsFinalCTA from '../components/aiads/AiAdsFinalCTA';
import { AI_ADS_META } from '../constants/aiAdsConstants';
import '../ai-ads.css';

export default function AiAdsPage() {
  // Document SEO, Meta Tags, and Structured Data
  useEffect(() => {
    document.title = AI_ADS_META.title;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = AI_ADS_META.description;

    // OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = AI_ADS_META.title;

    // OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = AI_ADS_META.description;

    // JSON-LD Structured Data
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'AI Ads™',
      'operatingSystem': 'Cloud Web Platform',
      'applicationCategory': 'BusinessApplication, MarketingApplication',
      'description': AI_ADS_META.description,
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
    <div className="aiads-page-root">
      {/* 01. HERO with Marketing Command Center Visual */}
      <AiAdsHero onExploreClick={() => scrollToSection('brand-dna')} />

      {/* 02. BRAND DNA (Single Source of Truth) */}
      <BrandDnaSection />

      {/* 03. MARKETING PIPELINE (8-Stage Autonomous Flow) */}
      <MarketingPipeline />

      {/* 04. MODULE SHOWCASE (8 Enterprise Engines) */}
      <ModuleShowcase />

      {/* 05. SEO INTELLIGENCE (Keyword Clustering & SERP Gaps) */}
      <SeoIntelligence />

      {/* 06. STRATEGY HUB (30-Day Go-To-Market Roadmap) */}
      <StrategyHub />

      {/* 07. CONTENT STUDIO (Native Multi-Platform Copy) */}
      <ContentStudio />

      {/* 08. CREATIVE STUDIO (1:1, 16:9, 9:16 Ad Banners) */}
      <CreativeStudio />

      {/* 09. ASSET LIBRARY (Centralized Digital Vault) */}
      <AssetLibrary />

      {/* 10. MARKETING FLYWHEEL (Circular Growth Engine) */}
      <MarketingFlywheel />

      {/* 11. CONVERGENCE (One Workspace vs 8 Disconnected Tools) */}
      <ConvergenceSection />

      {/* 14. USE CASES (Startups, Agencies, Enterprises, Creators) */}
      <UseCasesSection />

      {/* 15. FINAL CALL TO ACTION */}
      <AiAdsFinalCTA onExploreClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </div>
  );
}
