import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Overview } from './components/Overview';
import { OverlapAnalytics } from './components/OverlapAnalytics';
import { ApplicationKeys } from './components/ApplicationKeys';
import { UserDirectory } from './components/UserDirectory';
import { RevenuePlans } from './components/RevenuePlans';
import { CentralLogs } from './components/CentralLogs';
import { ApiSandbox } from './components/ApiSandbox';
import { ChatTrackingTab } from './components/ChatTrackingTab';
import { AppDownloadsTab } from './components/AppDownloadsTab';
import { UnifiedAnalytics } from './components/UnifiedAnalytics';
import { AuthTokenTester } from './components/AuthTokenTester';
import { MarketingCampaignsTab } from './components/MarketingCampaignsTab';

export function App() {
  const { token } = useAuth();
  const [currentTab, setTab] = useState('unified_analytics');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!token) {
    return <Login />;
  }

  const tabTitles = {
    unified_analytics: { title: 'Unified Analytics & Intelligence', subtitle: 'Centralized Multi-Platform Telemetry: GA4 Web, Google Play & GCP Monitoring' },
    overview: { title: 'Dashboard Overview', subtitle: 'Centralized platform analytics and activity monitoring' },
    marketing: { title: 'Marketing Campaigns & Referral Tracking', subtitle: 'Multi-platform UTM link generator, short URLs, QR codes & post reach telemetry across all products' },
    overlap: { title: 'Cross-App Analytics', subtitle: 'Analyze joint user downloads and engagement overlap between apps' },
    auth_tester: { title: 'Unified Auth Service Tester', subtitle: 'Test Central Registration, Login, Token Refresh Rotation & Token Validation' },
    applications: { title: 'Application API Keys', subtitle: 'Manage API credentials for connected standalone applications' },
    chat_tracking: { title: 'AI Chat & User Session Analytics', subtitle: 'Real-time AI prompt tracking, token consumption & user interaction history across Web & Mobile App' },
    app_downloads: { title: 'App Downloads & Installs', subtitle: 'Platform distribution across Android, iOS, Windows and Web PWA' },
    users: { title: 'Central User Directory', subtitle: 'View registered user identities across applications' },
    revenue: { title: 'Revenue & Subscriptions', subtitle: 'Payment transactions (₹ INR) and application subscriptions' },
    logs: { title: 'Central Application Logs', subtitle: 'Real-time security and audit logs from connected apps' },
    sandbox: { title: 'API Sandbox Tester', subtitle: 'Test Unified Backend REST endpoints interactively' },
  };

  const currentActiveTab = tabTitles[currentTab] ? currentTab : 'unified_analytics';
  const activeTabInfo = tabTitles[currentActiveTab];

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setMobileMenuOpen(false); // Close mobile drawer when user picks a tab
  };

  return (
    <div className="app-layout">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      <Sidebar
        currentTab={currentActiveTab}
        setTab={handleTabChange}
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="main-wrapper">
        <Header
          title={activeTabInfo.title}
          subtitle={activeTabInfo.subtitle}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
        />

        <main className="main-content">
          {currentActiveTab === 'unified_analytics' && <UnifiedAnalytics />}
          {currentActiveTab === 'overview' && <Overview />}
          {currentActiveTab === 'marketing' && <MarketingCampaignsTab />}
          {currentActiveTab === 'overlap' && <OverlapAnalytics />}
          {currentActiveTab === 'auth_tester' && <AuthTokenTester />}
          {currentActiveTab === 'applications' && <ApplicationKeys />}
          {currentActiveTab === 'chat_tracking' && <ChatTrackingTab />}
          {currentActiveTab === 'app_downloads' && <AppDownloadsTab />}
          {currentActiveTab === 'users' && <UserDirectory />}
          {currentActiveTab === 'revenue' && <RevenuePlans />}
          {currentActiveTab === 'logs' && <CentralLogs />}
          {currentActiveTab === 'sandbox' && <ApiSandbox />}
        </main>
      </div>
    </div>
  );
}

export default App;

