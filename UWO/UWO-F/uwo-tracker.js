/**
 * ============================================================================
 * 🔀 UWO™ Universal Client SDK & Attribution Tracker
 * ============================================================================
 * Handles both:
 *  1. Smart Link Device Routing (/r/:code & /ref/:code)
 *  2. Cross-domain Web Attribution & Conversion Tracking (?ref=code)
 *
 * Size: ~3.5KB | Zero External Dependencies | Vanilla JS
 * Compatible with React, Vue, Angular, Next.js, Vite, and Static HTML
 * ============================================================================
 */

(function (window, document) {
  'use strict';

  // 1. Detect Base Engine URL (auto-detect from script tag or fallback to uwo24.com)
  var baseUrl = window.UWO_CORE_URL || 'https://uwo24.com';
  if (document.currentScript && document.currentScript.src) {
    try {
      var sUrl = new URL(document.currentScript.src);
      baseUrl = sUrl.origin;
    } catch (e) {}
  }

  // 2. Cookie Helpers with Top-Level Subdomain Support
  function getRootDomain() {
    try {
      var hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') return '';
      var parts = hostname.split('.');
      if (parts.length >= 2) {
        return '.' + parts.slice(-2).join('.');
      }
    } catch (e) {}
    return '';
  }

  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + (days || 30) * 864e5).toUTCString();
    var isSecure = window.location.protocol === 'https:';
    var rootDomain = getRootDomain();
    var domainAttr = rootDomain ? '; domain=' + rootDomain : '';
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/' + domainAttr + (isSecure ? '; SameSite=None; Secure' : '; SameSite=Lax');
  }

  function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? decodeURIComponent(v[2]) : '';
  }

  // 3. Persistent Visitor & Session Identifiers
  function getOrCreateVisitorId() {
    var vid = localStorage.getItem('uwo_vid') || getCookie('uwo_vid');
    if (!vid) {
      vid = 'vid_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem('uwo_vid', vid);
    }
    setCookie('uwo_vid', vid, 365);
    return vid;
  }

  function getOrCreateSessionId() {
    var sid = sessionStorage.getItem('uwo_sid');
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      sessionStorage.setItem('uwo_sid', sid);
    }
    return sid;
  }

  // 4. Product Slug Detection
  function detectProductSlug() {
    var host = (window.location.hostname || '').toLowerCase();
    if (host.includes('efv')) return 'efv';
    if (host.includes('aisa')) return 'aisa';
    if (host.includes('ailegal') || host.includes('legal')) return 'ailegal';
    if (host.includes('connect')) return 'aiconnect';

    var path = (window.location.pathname || '').toLowerCase();
    if (path.includes('efv')) return 'efv';
    if (path.includes('aisa')) return 'aisa';
    if (path.includes('legal')) return 'ailegal';
    return 'general';
  }

  // ==========================================================================
  // ⚡ FEATURE A: SMART VANITY REDIRECT ROUTER (/r/:code or /ref/:code)
  // ==========================================================================
  var pathSegments = (window.location.pathname || '').split('/').filter(Boolean);
  var isSmartRedirect = pathSegments.length >= 2 && (pathSegments[0] === 'r' || pathSegments[0] === 'ref');

  if (isSmartRedirect) {
    var referralCode = pathSegments[1];

    // Render an instantaneous, branded dark-mode redirect screen to eliminate white flash
    var injectLoader = function () {
      if (document.getElementById('uwo-redirect-overlay')) return;

      var overlay = document.createElement('div');
      overlay.id = 'uwo-redirect-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#0B0F19;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#F8FAFC;padding:24px;text-align:center;box-sizing:border-box;';
      overlay.innerHTML = 
        '<div style="width:42px;height:42px;border:3px solid rgba(255,255,255,0.12);border-top:3px solid #38BDF8;border-radius:50%;animation:uwo-spin 0.75s linear infinite;margin-bottom:18px;"></div>' +
        '<div style="font-size:16px;font-weight:600;color:#F1F5F9;margin-bottom:6px;letter-spacing:-0.01em;">Redirecting to destination...</div>' +
        '<div style="font-size:13px;color:#94A3B8;max-width:320px;line-height:1.4;">Connecting through UWO™ Smart Router (' + referralCode + ')</div>' +
        '<style>@keyframes uwo-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>';

      if (document.body) {
        document.body.appendChild(overlay);
      } else {
        document.documentElement.appendChild(overlay);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectLoader);
    } else {
      injectLoader();
    }

    // Fast-path resolution via JSON
    var resolveUrl = baseUrl + '/r/' + encodeURIComponent(referralCode);
    var directFallbackUrl = baseUrl + '/r/' + encodeURIComponent(referralCode);

    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timeoutTimer = controller ? setTimeout(function () { controller.abort(); }, 3500) : null;

    fetch(resolveUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        if (timeoutTimer) clearTimeout(timeoutTimer);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data && data.targetUrl) {
          window.location.replace(data.targetUrl);
        } else {
          window.location.replace(directFallbackUrl);
        }
      })
      .catch(function (err) {
        console.warn('[UWO Tracker] Client resolution fallback to direct engine:', err.message);
        window.location.replace(directFallbackUrl);
      });

    // Halt further tracking logic on redirect route
    return;
  }

  // ==========================================================================
  // 🎯 FEATURE B: WEB ATTRIBUTION & FORM AUTO-BINDING (?ref=code)
  // ==========================================================================
  function initAttribution() {
    var urlParams = new URLSearchParams(window.location.search);
    var refCode = urlParams.get('ref') || urlParams.get('referral') || urlParams.get('aff') || urlParams.get('affiliate') || urlParams.get('ref_code');

    var visitorId = getOrCreateVisitorId();
    var sessionId = getOrCreateSessionId();

    if (refCode) {
      localStorage.setItem('uwo_ref_code', refCode);
      localStorage.setItem('uwo_ref_time', Date.now().toString());
      setCookie('uwo_ref_code', refCode, 30);
      setCookie('affiliate_code', refCode, 30);

      var product = detectProductSlug();

      // Log immediate view asynchronously (non-blocking)
      try {
        var payload = JSON.stringify({
          affiliateCode: refCode,
          product: product,
          productSlug: product,
          page: window.location.pathname,
          referrer: document.referrer || '',
          userAgent: navigator.userAgent,
          visitorId: visitorId,
          sessionId: sessionId,
          timestamp: Date.now()
        });

        if (navigator.sendBeacon) {
          navigator.sendBeacon(baseUrl + '/api/affiliate/track-view', new Blob([payload], { type: 'application/json' }));
        } else {
          fetch(baseUrl + '/api/affiliate/track-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true
          }).catch(function () {});
        }
      } catch (e) {}
    }

    autoFillInputs();
  }

  function autoFillInputs() {
    var savedCode = localStorage.getItem('uwo_ref_code') || getCookie('uwo_ref_code') || '';
    if (!savedCode) return;

    var selectors = [
      'input[name="referralCode"]', 'input[name="referral_code"]',
      'input[name="refCode"]', 'input[name="ref"]',
      'input[name="affiliateCode"]', 'input[name="affiliate_code"]',
      '#referralCode', '#ref_code'
    ];

    function fill() {
      selectors.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (inp) {
          if (!inp.value) {
            inp.value = savedCode;
            inp.dispatchEvent(new Event('input', { bubbles: true }));
            inp.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      });
    }

    fill();
    if (typeof MutationObserver !== 'undefined' && document.body) {
      var observer = new MutationObserver(fill);
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  // ==========================================================================
  // 🌐 FEATURE C: GLOBAL SDK API (window.UWO)
  // ==========================================================================
  window.UWO = {
    version: '1.0.0',
    getBaseUrl: function () { return baseUrl; },
    getReferralCode: function () {
      return localStorage.getItem('uwo_ref_code') || getCookie('uwo_ref_code') || '';
    },
    getVisitorId: function () {
      return getOrCreateVisitorId();
    },
    getSessionId: function () {
      return getOrCreateSessionId();
    },
    getContext: function () {
      return {
        referralCode: localStorage.getItem('uwo_ref_code') || getCookie('uwo_ref_code') || '',
        visitorId: getOrCreateVisitorId(),
        sessionId: getOrCreateSessionId(),
        product: detectProductSlug()
      };
    },
    trackConversion: async function (details) {
      details = details || {};
      var code = details.code || details.referralCode || details.affiliateCode || window.UWO.getReferralCode();
      if (!code) return null;

      var payload = {
        affiliateCode: code,
        visitorId: details.visitorId || getOrCreateVisitorId(),
        sessionId: details.sessionId || getOrCreateSessionId(),
        eventType: details.eventType || details.event || 'signup',
        amount: Number(details.amount) || 0,
        currency: details.currency || 'INR',
        orderId: details.orderId || details.order_id || ('ord_' + Date.now()),
        customerEmail: details.email || details.customerEmail || '',
        customerName: details.name || details.customerName || '',
        product: details.product || detectProductSlug(),
        productSlug: details.product || detectProductSlug(),
        paymentStatus: details.paymentStatus || 'paid',
        paymentGateway: details.paymentGateway || details.gateway || 'Razorpay',
        metadata: details.metadata || {}
      };

      try {
        var res = await fetch(baseUrl + '/api/affiliate/track-sale', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('[UWO Tracker] trackConversion failed:', err);
      }
    },
    trackSale: function (details) {
      return window.UWO.trackConversion(details);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAttribution);
  } else {
    initAttribution();
  }

})(window, document);
