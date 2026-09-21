(function () {
  var currentScript = document.currentScript;
  var baseUrl = 'http://localhost:8080';
  if (currentScript && currentScript.src) {
    try {
      var scriptUrl = new URL(currentScript.src);
      baseUrl = scriptUrl.origin;
    } catch (e) {
      console.warn('Could not parse script URL origin', e);
    }
  }

  // Inject CSS Styles for the popup
  var style = document.createElement('style');
  style.innerHTML = `
    .ref-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(4px);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      box-sizing: border-box;
      animation: refFadeIn 0.2s ease-out;
    }
    .ref-modal-card {
      background: #1e293b;
      color: #f8fafc;
      width: 100%;
      max-width: 440px;
      border-radius: 16px;
      border: 1px solid #334155;
      padding: 28px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      position: relative;
      box-sizing: border-box;
    }
    .ref-modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 20px;
      cursor: pointer;
      line-height: 1;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .ref-modal-close:hover {
      color: #ffffff;
      background: #334155;
    }
    .ref-header-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #818cf8;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .ref-title {
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 6px 0;
      color: #ffffff;
    }
    .ref-desc {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
      margin: 0 0 20px 0;
    }
    .ref-form-group {
      margin-bottom: 16px;
      text-align: left;
    }
    .ref-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #cbd5e1;
      margin-bottom: 6px;
    }
    .ref-input {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 14px;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 10px;
      color: #ffffff;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    .ref-input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
    .ref-submit-btn {
      width: 100%;
      box-sizing: border-box;
      padding: 12px 16px;
      background: #4f46e5;
      color: #ffffff;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 8px;
      transition: background 0.2s;
    }
    .ref-submit-btn:hover {
      background: #4338ca;
    }
    .ref-submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .ref-alert {
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 12px;
      margin-bottom: 14px;
      display: none;
    }
    .ref-alert-error {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
    }
    .ref-success-box {
      text-align: center;
      display: none;
    }
    .ref-success-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin: 0 auto 16px auto;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    @keyframes refFadeIn {
      from { opacity: 0; transform: scale(0.97); }
      to { opacity: 1; transform: scale(1); }
    }
    .ref-login-btn {
      display: inline-block;
      width: 100%;
      box-sizing: border-box;
      padding: 12px 16px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #ffffff;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 12px;
      text-decoration: none;
      text-align: center;
      transition: opacity 0.2s;
      letter-spacing: 0.3px;
    }
    .ref-login-btn:hover { opacity: 0.88; }
  `;
  document.head.appendChild(style);

  function openReferralModal() {
    if (document.getElementById('ref-modal-container')) return;

    var overlay = document.createElement('div');
    overlay.id = 'ref-modal-container';
    overlay.className = 'ref-modal-overlay';

    overlay.innerHTML = `
      <div class="ref-modal-card">
        <button class="ref-modal-close" id="ref-close-btn">&times;</button>
        
        <div id="ref-form-state">
          <div class="ref-header-badge">Referral Program</div>
          <h2 class="ref-title">Join & Start Earning Rewards 🎁</h2>
          <p class="ref-desc">Enter your name and email. We will instantly email your unique User ID and Password to log in and get your smart referral links.</p>

          <div id="ref-error-box" class="ref-alert ref-alert-error"></div>

          <form id="ref-popup-form">
            <div class="ref-form-group">
              <label class="ref-label">Your Full Name</label>
              <input type="text" id="ref-input-name" class="ref-input" placeholder="e.g. Alex Johnson" required />
            </div>

            <div class="ref-form-group">
              <label class="ref-label">Your Email Address</label>
              <input type="email" id="ref-input-email" class="ref-input" placeholder="e.g. alex@example.com" required />
            </div>

            <button type="submit" id="ref-submit-button" class="ref-submit-btn">
              Get Credentials & Login Link
            </button>
          </form>
        </div>

        <div id="ref-success-state" class="ref-success-box">
          <div class="ref-success-icon">✓</div>
          <h2 class="ref-title">You're All Set! 🎉</h2>
          <p class="ref-desc" id="ref-success-desc">
            Your User ID and Password have been emailed to you. Please check your inbox.
          </p>

          <div id="ref-dev-box" style="display:none; text-align:left; background:#0f172a; padding:12px; border-radius:8px; margin-bottom:16px; font-size:12px; font-family:monospace; border:1px solid #334155;">
            <div style="color:#818cf8; font-weight:bold; margin-bottom:4px;">Test Credentials:</div>
            <div>User ID: <span id="ref-dev-userid" style="color:#4ade80;"></span></div>
            <div>Password: <span id="ref-dev-pass" style="color:#4ade80;"></span></div>
          </div>

          <p style="font-size:12px; color:#94a3b8; margin-bottom:12px;">Use these credentials to log in on your referral dashboard.</p>
          <a id="ref-login-link" href="#" target="_blank" class="ref-login-btn">Open Referral Dashboard &rarr;</a>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    var closeBtn = document.getElementById('ref-close-btn');
    closeBtn.onclick = closeModal;

    overlay.onclick = function (e) {
      if (e.target === overlay) closeModal();
    };

    document.addEventListener('keydown', handleEsc);

    var form = document.getElementById('ref-popup-form');
    var submitBtn = document.getElementById('ref-submit-button');
    var errorBox = document.getElementById('ref-error-box');

    form.onsubmit = async function (e) {
      e.preventDefault();
      errorBox.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.innerText = 'Generating Credentials...';

      var name = document.getElementById('ref-input-name').value;
      var email = document.getElementById('ref-input-email').value;

      try {
        var response = await fetch(baseUrl + '/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name, email: email }),
        });

        var data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        document.getElementById('ref-form-state').style.display = 'none';
        var successState = document.getElementById('ref-success-state');
        successState.style.display = 'block';

        // Set dashboard login link dynamically from the response or derive from baseUrl
        var loginUrl = (data.credentials && data.credentials.loginUrl)
          ? data.credentials.loginUrl
          : 'https://uwo24.com/user';
        var loginLink = document.getElementById('ref-login-link');
        if (loginLink) loginLink.href = loginUrl;

        if (data.credentials) {
          var devBox = document.getElementById('ref-dev-box');
          devBox.style.display = 'block';
          document.getElementById('ref-dev-userid').innerText = data.credentials.userId;
          document.getElementById('ref-dev-pass').innerText = data.credentials.password;
        }
      } catch (err) {
        errorBox.innerText = err.message || 'An error occurred';
        errorBox.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerText = 'Get Credentials & Login Link';
      }
    };
  }

  function closeModal() {
    var overlay = document.getElementById('ref-modal-container');
    if (overlay) overlay.remove();
    document.removeEventListener('keydown', handleEsc);
  }

  function handleEsc(e) {
    if (e.key === 'Escape') closeModal();
  }

  function initTriggers() {
    document.addEventListener('click', function (e) {
      var target = e.target.closest('#referral-btn, #open-referral-modal, .referral-btn, [data-referral-trigger]');
      if (target) {
        e.preventDefault();
        openReferralModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTriggers);
  } else {
    initTriggers();
  }

  window.openReferralPopup = openReferralModal;
})();
