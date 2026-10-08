import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEOHead Component
 * Dynamically enforces Canonical URLs and Robot indexation policies across all React SPA routes.
 * Prevents Google Search Console "Duplicate without user-selected canonical" issues.
 */
export default function SEOHead() {
  const location = useLocation();

  useEffect(() => {
    try {
      // 1. Strip query strings, trailing slashes, and legacy .html extensions
      let cleanPath = location.pathname.replace(/\.html$/i, '');
      if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
        cleanPath = cleanPath.slice(0, -1);
      }
      if (!cleanPath || cleanPath === '/index') {
        cleanPath = '';
      }

      const canonicalUrl = `https://uwo24.com${cleanPath || '/'}`;

      // 2. Locate or create <link rel="canonical"> in document head
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);

      // 3. Locate or create <meta name="robots"> tag
      let robotsMeta = document.querySelector('meta[name="robots"]');
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }

      // 4. Block search engines on private admin & partner portals; allow indexing on all public pages
      const isPrivatePortal = 
        cleanPath.startsWith('/admin') || 
        cleanPath.startsWith('/partner-dashboard') || 
        cleanPath.startsWith('/partner-login');

      if (isPrivatePortal) {
        robotsMeta.setAttribute('content', 'noindex, nofollow, noarchive');
      } else {
        robotsMeta.setAttribute('content', 'index, follow, max-image-preview:large');
      }
    } catch (err) {
      console.warn('[SEOHead] Notice updating canonical meta tags:', err);
    }
  }, [location.pathname, location.search]);

  return null;
}
