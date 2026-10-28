import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import SEOHead from './components/common/SEOHead';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import OurTeamPage from './pages/OurTeamPage';
import BlogsPage from './pages/BlogsPage';
import BlogSinglePage from './pages/BlogSinglePage';
import ContactPage from './pages/ContactPage';
import AisaPage from './pages/AisaPage';
import EfvPage from './pages/EfvPage';
import AiLegalPage from './pages/AiLegalPage';
import UwoConnectPage from './pages/UwoConnectPage';
import AiEducationPage from './pages/AiEducationPage';
import AiAdsPage from './pages/AiAdsPage';
import PartnerLoginPage from './pages/PartnerLoginPage';
import PartnerDashboardPage from './pages/PartnerDashboardPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

// Auto-scroll to top on route change (except when opening legal modal overlay)
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const decoded = decodeURIComponent(pathname).toLowerCase();
    const isLegalPath = [
      '/terms-and-conditions', '/terms', '/terms-conditions', '/terms & conditions', '/terms%20&%20conditions',
      '/privacy-policy', '/privacy',
      '/cookies-policy', '/cookie-policy', '/cookies'
    ].includes(decoded);

    if (!isLegalPath) {
      window.scrollTo(0, 0);
    }
  }, [pathname, search]);

  return null;
}

export default function App() {
  return (
    <>
      <SEOHead />
      <ScrollToTop />
      <Routes>
        {/* Public routes wrapped with master Layout (Navbar, Footer, 2-Field Modal, Chatbot) */}
        <Route element={<Layout />}>
          {/* Authoritative Canonical Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/our-team" element={<OurTeamPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:slug" element={<BlogSinglePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/aisa" element={<AisaPage />} />
          <Route path="/efv" element={<EfvPage />} />
          <Route path="/ai-legal" element={<AiLegalPage />} />
          <Route path="/projects/uwo-connect" element={<UwoConnectPage />} />
          <Route path="/ai-education" element={<AiEducationPage />} />
          <Route path="/ai-ads" element={<AiAdsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login.html" element={<LoginPage />} />
          <Route path="/partner-login" element={<PartnerLoginPage />} />
          <Route path="/partner-dashboard" element={<PartnerDashboardPage />} />

          {/* Canonical Policy & Legal Routes (Modal view over Home) */}
          <Route path="/terms-and-conditions" element={<HomePage />} />
          <Route path="/terms" element={<HomePage />} />
          <Route path="/terms-conditions" element={<HomePage />} />
          <Route path="/Terms & Conditions" element={<HomePage />} />
          <Route path="/privacy-policy" element={<HomePage />} />
          <Route path="/privacy" element={<HomePage />} />
          <Route path="/cookies-policy" element={<HomePage />} />
          <Route path="/cookie-policy" element={<HomePage />} />
          <Route path="/cookies" element={<HomePage />} />

          {/* Legacy & .html Aliases -> 301-equivalent Clean Canonical Redirects */}
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="/about.html" element={<Navigate to="/about" replace />} />
          <Route path="/our-team.html" element={<Navigate to="/our-team" replace />} />
          <Route path="/blogs.html" element={<Navigate to="/blogs" replace />} />
          <Route path="/blog-single.html" element={<Navigate to="/blogs" replace />} />
          <Route path="/contact.html" element={<Navigate to="/contact" replace />} />
          <Route path="/aisa.html" element={<Navigate to="/aisa" replace />} />
          <Route path="/efv.html" element={<Navigate to="/efv" replace />} />
          <Route path="/ai-legal.html" element={<Navigate to="/ai-legal" replace />} />
          <Route path="/uwo-connect" element={<Navigate to="/projects/uwo-connect" replace />} />
          <Route path="/uwo-connect.html" element={<Navigate to="/projects/uwo-connect" replace />} />
          <Route path="/projects/ai-education" element={<Navigate to="/ai-education" replace />} />
          <Route path="/ai-education.html" element={<Navigate to="/ai-education" replace />} />
          <Route path="/projects/ai-ads" element={<Navigate to="/ai-ads" replace />} />
          <Route path="/ai-ads.html" element={<Navigate to="/ai-ads" replace />} />
          <Route path="/partner-login.html" element={<Navigate to="/partner-login" replace />} />
          <Route path="/partner-dashboard.html" element={<Navigate to="/partner-dashboard" replace />} />
          <Route path="/terms.html" element={<Navigate to="/terms-and-conditions" replace />} />
          <Route path="/terms-and-conditions.html" element={<Navigate to="/terms-and-conditions" replace />} />
          <Route path="/privacy.html" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="/privacy-policy.html" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="/cookies.html" element={<Navigate to="/cookies-policy" replace />} />
          <Route path="/cookies-policy.html" element={<Navigate to="/cookies-policy" replace />} />
          <Route path="/cookie-policy.html" element={<Navigate to="/cookies-policy" replace />} />
        </Route>

        {/* Dedicated Admin Portal Route */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
