import React, { useEffect } from 'react';
import UwoConnectHero from '../components/uwoconnect/UwoConnectHero';
import ChannelEcosystem from '../components/uwoconnect/ChannelEcosystem';
import ConnectorsSection from '../components/uwoconnect/ConnectorsSection';
import AutomationSection from '../components/uwoconnect/AutomationSection';
import HowItWorksSection from '../components/uwoconnect/HowItWorksSection';
import KeyFeaturesSection from '../components/uwoconnect/KeyFeaturesSection';
import FinalCtaSection from '../components/uwoconnect/FinalCtaSection';
import { UWO_CONNECT_META, UWO_CONNECT_WEB_URL } from '../constants/uwoConnectConstants';
import '../uwo-connect.css';

export default function UwoConnectPage() {
  // SEO, Document Meta Tags & JSON-LD Structured Data
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.title = UWO_CONNECT_META.title;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = UWO_CONNECT_META.description;

    // OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = UWO_CONNECT_META.title;

    // OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = UWO_CONNECT_META.description;

    // OpenGraph URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = UWO_CONNECT_META.canonical;

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = UWO_CONNECT_META.canonical;

    // JSON-LD Structured Data for SoftwareApplication
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'uwo-connect-schema';
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          'name': 'UWO Connect™',
          'operatingSystem': 'Web, Android, iOS',
          'applicationCategory': 'BusinessApplication, CommunicationSoftware, CRMSoftware',
          'softwareVersion': '2.0.0',
          'url': UWO_CONNECT_WEB_URL,
          'description': UWO_CONNECT_META.description,
          'publisher': {
            '@type': 'Organization',
            'name': 'Unified Web Options & Services Pvt. Ltd. (UWO™)',
            'url': 'https://uwo24.com',
          },
        },
      ],
    });
    document.head.appendChild(schemaScript);

    return () => {
      if (document.head.contains(schemaScript)) {
        document.head.removeChild(schemaScript);
      }
    };
  }, []);

  return (
    <div className="uwo-connect-page-wrapper">
      {/* 1. Hero Section */}
      <UwoConnectHero />

      {/* 2. Multi-Channel Unified Inbox Ecosystem */}
      <ChannelEcosystem />

      {/* 4. Native Connectors Radar (Dev) */}
      <ConnectorsSection />

      {/* 5. Business Automation Workflow (Abha) */}
      <AutomationSection />

      {/* 6. How It Works (4-Step Execution Pipeline) */}
      <HowItWorksSection />

      {/* 7. Key Features (Single-Row Carousel Slider) */}
      <KeyFeaturesSection />

      {/* 8. Final CTA */}
      <FinalCtaSection />
    </div>
  );
}
