// ==========================================
// 🎁 UWO™ DEDICATED EARN & REFER SCRIPT
// ==========================================

(function() {
  const BACKEND_API = (window.location.hostname === "localhost" && window.location.port === "3000")
    ? "http://localhost:8080/api"
    : "/api";

  // Dashboard login URL — dynamic per environment
  const DASHBOARD_LOGIN_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5173/user/"
    : "/user/";

  function injectEarnReferModal() {
    if (document.getElementById('earnReferOverlay')) return;

    const modalHTML = `
    <div id="earnReferOverlay" class="earn-refer-overlay" onclick="if(event.target === this) window.closeEarnReferModal()">
      <div class="earn-refer-card" role="dialog" aria-modal="true" aria-labelledby="earnReferTitle">
        <!-- Close Button -->
        <button type="button" class="earn-refer-close" onclick="window.closeEarnReferModal()" title="Close modal" aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <!-- Form View -->
        <div id="earnReferFormView">
          <div class="earn-badge">
            <i class="fa-solid fa-gift"></i> Earn &amp; Refer
          </div>
          <h2 class="earn-title" id="earnReferTitle">Join UWO™ Earn &amp; Refer</h2>
          <p class="earn-subtitle">Partner with us to refer revolutionary AI &amp; enterprise platforms and earn competitive commissions.</p>

          <form id="earnReferForm" onsubmit="window.handleEarnReferSubmit(event)">
            <!-- Name Field -->
            <div class="earn-form-group">
              <label for="earnName">Full Name <span class="req">*</span></label>
              <div class="earn-input-wrap">
                <input type="text" id="earnName" name="name" placeholder="e.g. Rahul Sharma" required autocomplete="name">
                <i class="fa-solid fa-user"></i>
              </div>
            </div>

            <!-- Email Field -->
            <div class="earn-form-group">
              <label for="earnEmail">Email Address <span class="req">*</span></label>
              <div class="earn-input-wrap">
                <input type="email" id="earnEmail" name="email" placeholder="rahul@example.com" required autocomplete="email">
                <i class="fa-solid fa-envelope"></i>
              </div>
            </div>

            <div id="earnErrorMessage" style="display:none; color:#ef4444; font-size:13px; font-weight:600; margin-top:10px; text-align:center;"></div>

            <button type="submit" class="earn-submit-btn" id="earnSubmitBtn">
              <span>Get My Referral Account</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>

            <div class="earn-already-account-wrap">
              <a href="${DASHBOARD_LOGIN_URL}" target="_blank" rel="noopener noreferrer" class="earn-already-account-btn" title="Already have account" id="alreadyHaveAccountBtn" onclick="window.closeEarnReferModal()">
                <i class="fa-solid fa-right-to-bracket"></i>
                <span>Already have account</span>
              </a>
            </div>
          </form>
        </div>

        <!-- Success View -->
        <div id="earnReferSuccessView" class="earn-success-view">
          <div class="earn-success-badge">
            <i class="fa-solid fa-check"></i>
          </div>
          <h2 class="earn-success-title">Welcome to UWO™ Earn &amp; Refer!</h2>
          <p class="earn-success-text" style="margin-bottom: 16px;">
            Your referral account has been generated for <strong id="earnSuccessEmail" style="color:#FABE56;"></strong>.
          </p>

          <!-- Instant Credentials Display Box -->
          <div style="background: rgba(214, 165, 89, 0.12); border: 1.5px solid #D6A559; border-radius: 14px; padding: 18px 20px; margin: 0 0 16px 0; text-align: left;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid rgba(214, 165, 89, 0.25); padding-bottom: 8px;">
              <span style="font-size: 12.5px; font-weight: 800; color: #FABE56; letter-spacing: 0.5px; text-transform: uppercase;">
                <i class="fa-solid fa-key" style="margin-right: 6px;"></i> Your Portal Login Credentials
              </span>
              <span style="font-size: 11px; background: #10b981; color: #022c22; font-weight: 800; padding: 3px 8px; border-radius: 6px;">ACTIVE</span>
            </div>
            
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed rgba(255,255,255,0.08); font-size: 13.5px;">
              <span style="color: #94a3b8; font-weight: 600;">User ID:</span>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span id="earnCredUserId" style="color: #FABE56; font-weight: 800; font-family: monospace; font-size: 15px;"></span>
                <button type="button" onclick="window.copyEarnCred('earnCredUserId', this)" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: #f1f5f9; border-radius: 6px; padding: 3px 9px; font-size: 11px; cursor: pointer;">Copy</button>
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed rgba(255,255,255,0.08); font-size: 13.5px;">
              <span style="color: #94a3b8; font-weight: 600;">Password:</span>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span id="earnCredPassword" style="color: #ffffff; font-weight: 800; font-family: monospace; font-size: 15px;"></span>
                <button type="button" onclick="window.copyEarnCred('earnCredPassword', this)" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: #f1f5f9; border-radius: 6px; padding: 3px 9px; font-size: 11px; cursor: pointer;">Copy</button>
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0; font-size: 13.5px;">
              <span style="color: #94a3b8; font-weight: 600;">Ref Code:</span>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span id="earnSuccessRefCode" style="color: #38bdf8; font-weight: 700; font-family: monospace; font-size: 14px;"></span>
                <button type="button" onclick="window.copyEarnCred('earnSuccessRefCode', this)" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: #f1f5f9; border-radius: 6px; padding: 3px 9px; font-size: 11px; cursor: pointer;">Copy</button>
              </div>
            </div>
          </div>

          <div id="earnEmailDeliveryStatus" style="font-size: 12.5px; color: #cbd5e1; margin-bottom: 20px; line-height: 1.5; background: rgba(15, 23, 42, 0.8); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); text-align: left;">
            <i class="fa-solid fa-circle-info" style="color: #FABE56; margin-right: 6px;"></i>
            <span>Please copy your User ID and password above to log in to your dashboard.</span>
          </div>

          <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <a id="earnDashboardLink" href="${DASHBOARD_LOGIN_URL}" target="_blank" class="earn-done-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:8px; background: linear-gradient(135deg, #D6A559 0%, #FABE56 100%) !important; color: #0b1120 !important; font-weight: 800 !important; border: none !important; box-shadow: 0 4px 15px rgba(214, 165, 89, 0.4) !important;">
              <span>Login to User Dashboard</span>
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            <button type="button" class="earn-done-btn" style="background:#1e293b; border:1px solid rgba(255,255,255,0.15);" onclick="window.closeEarnReferModal()">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') window.closeEarnReferModal();
    });
  }

  window.copyEarnCred = function(elemId, btn) {
    const el = document.getElementById(elemId);
    if (!el) return;
    const text = el.textContent.trim();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      btn.style.color = '#10b981';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.color = '#f1f5f9';
      }, 1500);
    });
  };

  window.openEarnReferModal = function() {
    injectEarnReferModal();
    const overlay = document.getElementById('earnReferOverlay');
    if (!overlay) return;

    const formView = document.getElementById('earnReferFormView');
    const successView = document.getElementById('earnReferSuccessView');
    const errorMsg = document.getElementById('earnErrorMessage');
    const submitBtn = document.getElementById('earnSubmitBtn');

    if (formView) formView.style.display = 'block';
    if (successView) successView.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Get My Referral Account</span> <i class="fa-solid fa-arrow-right"></i>';
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeEarnReferModal = function() {
    const overlay = document.getElementById('earnReferOverlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  window.handleEarnReferSubmit = async function(event) {
    if (event) event.preventDefault();
    const submitBtn = document.getElementById('earnSubmitBtn');
    const errorMsg = document.getElementById('earnErrorMessage');

    const nameEl = document.getElementById('earnName');
    const emailEl = document.getElementById('earnEmail');

    const name = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';

    if (!name || !email) {
      if (errorMsg) {
        errorMsg.textContent = 'Please enter your full name and email address.';
        errorMsg.style.display = 'block';
      }
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (errorMsg) {
        errorMsg.textContent = 'Please enter a valid email address.';
        errorMsg.style.display = 'block';
      }
      return;
    }

    if (errorMsg) errorMsg.style.display = 'none';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating Account...';
    }

    try {
      const affiliateCode = localStorage.getItem('uwo_affiliate_code') || '';
      const payload = {
        name,
        email,
        affiliateCode
      };

      const response = await fetch(`${BACKEND_API}/referrals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        const form = document.getElementById('earnReferForm');
        if (form) form.reset();

        const formView = document.getElementById('earnReferFormView');
        const successView = document.getElementById('earnReferSuccessView');
        const successEmail = document.getElementById('earnSuccessEmail');
        const successRefCode = document.getElementById('earnSuccessRefCode');
        const credUserId = document.getElementById('earnCredUserId');
        const credPass = document.getElementById('earnCredPassword');
        const statusEl = document.getElementById('earnEmailDeliveryStatus');
        const dashLink = document.getElementById('earnDashboardLink');

        if (successEmail) successEmail.textContent = email;
        if (successRefCode) successRefCode.textContent = data.referralCode || 'UWO-REF';

        if (data.credentials) {
          if (credUserId) credUserId.textContent = data.credentials.userId || data.userId;
          if (credPass) credPass.textContent = data.credentials.password || '';
          if (dashLink && data.credentials.loginUrl) dashLink.href = data.credentials.loginUrl;
        } else {
          if (credUserId) credUserId.textContent = data.userId || data.referralCode;
          if (credPass) credPass.textContent = 'Active in DB';
        }

        if (statusEl) {
          if (data.emailSent) {
            statusEl.innerHTML = `<i class="fa-solid fa-envelope-circle-check" style="color: #10b981; margin-right: 6px;"></i> A confirmation email was also sent to <strong>${email}</strong>.`;
          } else {
            statusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: #FABE56; margin-right: 6px;"></i> Email delivery is currently delayed. <strong>Please save your User ID and Password above</strong> to access your dashboard directly.`;
          }
        }

        if (formView) formView.style.display = 'none';
        if (successView) successView.style.display = 'block';

        if (typeof confetti === 'function') {
          try {
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
          } catch (cErr) {}
        }
      } else {
        if (errorMsg) {
          errorMsg.textContent = data.message || data.error || 'Something went wrong. Please try again.';
          errorMsg.style.display = 'block';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Get My Referral Account</span> <i class="fa-solid fa-arrow-right"></i>';
        }
      }
    } catch (err) {
      console.error('Error submitting Earn & Refer form:', err);
      if (errorMsg) {
        errorMsg.textContent = 'Network error connecting to backend. Please try again.';
        errorMsg.style.display = 'block';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Get My Referral Account</span> <i class="fa-solid fa-arrow-right"></i>';
      }
    }
  };

  // Delegated click listener — catches clicks on ANY element with .earn-refer-btn or child of it
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.earn-refer-btn, #earnReferNavbarBtn, .mobile-earn-refer-link, [data-action="open-earn-refer"]');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      window.openEarnReferModal();
    }
  });

  // Inject modal when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectEarnReferModal);
  } else {
    injectEarnReferModal();
  }
})();
