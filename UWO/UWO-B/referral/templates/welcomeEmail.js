/**
 * Premium Responsive HTML & Plaintext Email Templates for UWO™ Earn & Refer Program.
 * Fully compatible with Gmail, Apple Mail, Outlook, iOS Mail, and Android.
 */

function renderWelcomeEmail({
  name = 'Partner',
  email = '',
  userDashboardUserId = '',
  userDashboardPassword = '',
  userDashboardLoginUrl = 'https://uwo24.com/user',
  referralCode = '',
  phone = '',
  preferredProgram = '',
  upiId = ''
}) {
  const cleanName = (name || 'Partner').trim();
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanLoginUrl = (userDashboardLoginUrl || 'https://uwo24.com/user').trim();

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Welcome to UWO™ Earn &amp; Refer Program</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
      .mobile-padding { padding: 24px 16px !important; }
      .mobile-stack { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      .cred-val { font-size: 14px !important; word-break: break-all !important; }
      .btn-primary { width: 100% !important; text-align: center !important; box-sizing: border-box !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 0; background-color: #060913; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #f8fafc;">

  <!-- Preheader text (hidden in inbox preview) -->
  <div style="display: none; font-size: 1px; color: #060913; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Your UWO™ Referral Dashboard access credentials and login link are inside.
  </div>

  <!-- Outer Wrapper Table -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #060913; width: 100%; margin: 0; padding: 12px 0;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #0e172a; border-radius: 18px; overflow: hidden; border: 1.5px solid rgba(214, 165, 89, 0.4); box-shadow: 0 20px 50px rgba(0,0,0,0.85);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #162377 0%, #0b1120 100%); padding: 36px 28px 28px; text-align: center; border-bottom: 2px solid #D6A559;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 5px 16px; background: rgba(214, 165, 89, 0.15); border: 1px solid rgba(214, 165, 89, 0.4); border-radius: 20px; font-size: 11px; font-weight: 700; color: #FABE56; letter-spacing: 1.8px; text-transform: uppercase; margin-bottom: 12px;">
                      PARTNER &amp; REFERRAL NETWORK
                    </div>
                    <h1 style="margin: 0; color: #D6A559; font-size: 26px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
                      UWO™ EARN &amp; REFER
                    </h1>
                    <p style="margin: 8px 0 0; color: #cbd5e1; font-size: 13.5px; letter-spacing: 0.5px;">
                      Unified Web Options &amp; Services • Ecosystem Growth Platform
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td class="mobile-padding" style="padding: 34px 30px; background-color: #0e172a;">
              <h2 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0 0 12px;">
                Hi ${cleanName}, welcome aboard! 👋
              </h2>
              <p style="color: #cbd5e1; font-size: 14.5px; line-height: 1.65; margin: 0 0 22px;">
                Thank you for applying to the <strong>UWO™ Earn &amp; Refer Program</strong>. Your personal Referral User account has been successfully provisioned. You can now access your dashboard, generate custom tracking links for all 8+ UWO ecosystem platforms, track real-time clicks, and monitor verified mobile app installs.
              </p>

              <!-- Credentials Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: rgba(214, 165, 89, 0.08); border: 1.5px solid #D6A559; border-radius: 14px; margin: 22px 0 26px; overflow: hidden;">
                <tr>
                  <td style="padding: 16px 22px; background: rgba(214, 165, 89, 0.14); border-bottom: 1px solid rgba(214, 165, 89, 0.25);">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="color: #FABE56; font-size: 13.5px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
                          🔐 YOUR REFERRAL DASHBOARD CREDENTIALS
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 22px 22px 24px;">
                    <p style="margin: 0 0 16px; color: #cbd5e1; font-size: 13px; line-height: 1.5;">
                      Use these credentials to sign in to your personal Referral Dashboard:
                    </p>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 14px;">
                      <tr>
                        <td style="padding: 7px 0; color: #94a3b8; width: 36%; font-weight: 600; vertical-align: middle;">
                          User ID:
                        </td>
                        <td style="padding: 7px 0; vertical-align: middle;">
                          <span class="cred-val" style="display: inline-block; background: #0b1120; color: #FABE56; font-weight: 800; font-family: 'Courier New', Courier, monospace; font-size: 15px; padding: 6px 14px; border-radius: 6px; border: 1px solid rgba(214, 165, 89, 0.45); letter-spacing: 0.5px;">
                            ${userDashboardUserId || 'Generated on Sign-in'}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 7px 0; color: #94a3b8; font-weight: 600; vertical-align: middle;">
                          Registered Email:
                        </td>
                        <td style="padding: 7px 0; vertical-align: middle;">
                          <span class="cred-val" style="display: inline-block; background: #0b1120; color: #ffffff; font-family: 'Courier New', Courier, monospace; font-size: 14px; padding: 6px 14px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.15);">
                            ${cleanEmail}
                          </span>
                        </td>
                      </tr>
                      ${userDashboardPassword ? `
                      <tr>
                        <td style="padding: 7px 0; color: #94a3b8; font-weight: 600; vertical-align: middle;">
                          Password:
                        </td>
                        <td style="padding: 7px 0; vertical-align: middle;">
                          <span class="cred-val" style="display: inline-block; background: #0b1120; color: #38bdf8; font-weight: 800; font-family: 'Courier New', Courier, monospace; font-size: 15px; padding: 6px 14px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.45); letter-spacing: 0.5px;">
                            ${userDashboardPassword}
                          </span>
                        </td>
                      </tr>
                      ` : ''}
                      ${referralCode ? `
                      <tr>
                        <td style="padding: 7px 0; color: #94a3b8; font-weight: 600; vertical-align: middle;">
                          Application ID:
                        </td>
                        <td style="padding: 7px 0; color: #FABE56; font-weight: 700; font-family: 'Courier New', Courier, monospace; font-size: 13.5px; vertical-align: middle;">
                          ${referralCode}
                        </td>
                      </tr>
                      ` : ''}
                    </table>

                    <!-- Primary CTA Button -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
                      <tr>
                        <td align="center">
                          <a href="${cleanLoginUrl}" class="btn-primary" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #D6A559 0%, #FABE56 100%); color: #0b1120 !important; font-weight: 800; font-size: 15px; padding: 14px 34px; border-radius: 8px; text-decoration: none; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(214, 165, 89, 0.4); text-align: center;">
                            Access User Referral Dashboard &rarr;
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-top: 10px;">
                          <span style="color: #64748b; font-size: 12px;">
                            Direct URL: <a href="${cleanLoginUrl}" target="_blank" style="color: #D6A559; text-decoration: underline;">${cleanLoginUrl}</a>
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Application Details Box (if extra info provided) -->
              ${(phone || preferredProgram || upiId) ? `
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; margin: 0 0 24px; padding: 16px 20px;">
                <tr>
                  <td style="color: #D6A559; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">
                    Application Summary
                  </td>
                </tr>
                ${preferredProgram ? `
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #94a3b8;">
                    Preferred Program: <strong style="color: #f1f5f9;">${preferredProgram}</strong>
                  </td>
                </tr>
                ` : ''}
                ${phone ? `
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #94a3b8;">
                    Phone: <strong style="color: #f1f5f9;">${phone}</strong>
                  </td>
                </tr>
                ` : ''}
                ${upiId ? `
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #94a3b8;">
                    Payout UPI / Info: <strong style="color: #f1f5f9;">${upiId}</strong>
                  </td>
                </tr>
                ` : ''}
              </table>
              ` : ''}

              <!-- How It Works (3 Steps) -->
              <h3 style="color: #D6A559; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 26px 0 14px;">
                🚀 Quick Start: How to Earn in 3 Steps
              </h3>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 16px; background: rgba(255,255,255,0.03); border-radius: 10px; border-left: 3px solid #D6A559;">
                    <strong style="color: #ffffff; font-size: 14px;">1. Log In to Your Dashboard</strong>
                    <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px; line-height: 1.45;">
                      Navigate to <a href="${cleanLoginUrl}" target="_blank" style="color: #FABE56; text-decoration: none;">${cleanLoginUrl}</a> and sign in with your User ID (<strong>${userDashboardUserId || cleanEmail}</strong>) or Email and password.
                    </p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 12px 16px; background: rgba(255,255,255,0.03); border-radius: 10px; border-left: 3px solid #D6A559;">
                    <strong style="color: #ffffff; font-size: 14px;">2. Generate Instant Tracking Links</strong>
                    <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px; line-height: 1.45;">
                      Select any of our 8+ products and create your unique referral link with one click (e.g. <code>https://uwo24.com/r/XXXXX</code>).
                    </p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 12px 16px; background: rgba(255,255,255,0.03); border-radius: 10px; border-left: 3px solid #D6A559;">
                    <strong style="color: #ffffff; font-size: 14px;">3. Share, Track &amp; Earn</strong>
                    <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px; line-height: 1.45;">
                      Share links across your channels. Our analytics engine records real-time clicks and verified mobile app installs with full attribution.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Supported Products Grid -->
              <h3 style="color: #D6A559; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 26px 0 14px;">
                🌐 Products Available in Your Referral Dashboard
              </h3>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 12.5px;">
                <tr>
                  <td width="50%" style="vertical-align: top; padding-right: 6px;">
                    <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; border-left: 3px solid #D6A559; color: #e2e8f0;">
                      <strong style="color: #ffffff;">⚡ AISA™</strong><br />
                      <span style="color: #94a3b8; font-size: 11.5px;">Enterprise Autonomous AI</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; border-left: 3px solid #D6A559; color: #e2e8f0;">
                      <strong style="color: #ffffff;">⚖️ AI Legal™</strong><br />
                      <span style="color: #94a3b8; font-size: 11.5px;">AI Legal Practice &amp; Drafting</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; border-left: 3px solid #D6A559; color: #e2e8f0;">
                      <strong style="color: #ffffff;">📢 AI Ads™</strong><br />
                      <span style="color: #94a3b8; font-size: 11.5px;">Multi-Channel Ad Automation</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; border-left: 3px solid #D6A559; color: #e2e8f0;">
                      <strong style="color: #ffffff;">💳 AI CashFlow™</strong><br />
                      <span style="color: #94a3b8; font-size: 11.5px;">Invoicing &amp; Cashflow Engine</span>
                    </div>
                  </td>
                  <td width="50%" style="vertical-align: top; padding-left: 6px;">
                    <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; border-left: 3px solid #FABE56; color: #e2e8f0;">
                      <strong style="color: #ffffff;">🛒 AI Mall™</strong><br />
                      <span style="color: #94a3b8; font-size: 11.5px;">Intelligent B2B Marketplace</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; border-left: 3px solid #FABE56; color: #e2e8f0;">
                      <strong style="color: #ffffff;">🔗 AISA Connect™</strong><br />
                      <span style="color: #94a3b8; font-size: 11.5px;">SSO &amp; Universal Identity</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; border-left: 3px solid #FABE56; color: #e2e8f0;">
                      <strong style="color: #ffffff;">🏢 EFV™</strong><br />
                      <span style="color: #94a3b8; font-size: 11.5px;">Enterprise Franchise Network</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; border-left: 3px solid #FABE56; color: #e2e8f0;">
                      <strong style="color: #ffffff;">🌐 UWO™ Corporate</strong><br />
                      <span style="color: #94a3b8; font-size: 11.5px;">Web &amp; Digital Solutions</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px; background: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 8px; padding: 12px 14px;">
                <tr>
                  <td style="color: #cbd5e1; font-size: 12.5px; line-height: 1.5;">
                    🔒 <strong>Security Tip:</strong> You can sign in using either your <strong>User ID (${userDashboardUserId || cleanEmail})</strong> or your <strong>Registered Email</strong>. Keep your credentials secure. You can update your password at any time inside your Dashboard.
                  </td>
                </tr>
              </table>

              <!-- Support Note -->
              <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 24px 0 0;">
                If you have questions or need assistance, reply directly to this email or write to <a href="mailto:admin@uwo24.com" style="color: #D6A559; text-decoration: underline;">admin@uwo24.com</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #050811; padding: 26px 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #64748b; line-height: 1.6;">
              <p style="margin: 0 0 6px; font-weight: 600; color: #94a3b8;">
                UWO™ - Unified Web Options &amp; Services Pvt. Ltd. &copy; 2026
              </p>
              <p style="margin: 0 0 8px;">
                Building Intelligent Digital Platforms for a Connected World
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                Mumbai, India &bull; <a href="https://uwo24.com" target="_blank" style="color: #64748b; text-decoration: underline;">uwo24.com</a> &bull; Support: <a href="mailto:admin@uwo24.com" style="color: #64748b; text-decoration: underline;">admin@uwo24.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderWelcomeEmailText({
  name = 'Partner',
  email = '',
  userDashboardUserId = '',
  userDashboardPassword = '',
  userDashboardLoginUrl = 'https://uwo24.com/user',
  referralCode = '',
  preferredProgram = ''
}) {
  return `
UWO™ EARN & REFER PROGRAM - WELCOME ABOARD!

Hi ${name},

Thank you for applying to the UWO™ Earn & Refer Program. Your personal Referral User account has been successfully provisioned.

--------------------------------------------------
YOUR REFERRAL DASHBOARD CREDENTIALS
--------------------------------------------------
User ID:          ${userDashboardUserId || 'Generated on Sign-in'}
Registered Email: ${email}
${userDashboardPassword ? `Password:         ${userDashboardPassword}\n` : ''}${referralCode ? `Application Ref:  ${referralCode}\n` : ''}${preferredProgram ? `Program:          ${preferredProgram}\n` : ''}
Portal Login:     ${userDashboardLoginUrl}
--------------------------------------------------

HOW TO GET STARTED:
1. Go to ${userDashboardLoginUrl}
2. Sign in with your User ID (${userDashboardUserId || email}) or Email and your password.
3. Select any of the 8+ UWO ecosystem platforms (AISA, AI Legal, AI Ads, AI CashFlow, AI Mall, AISA Connect, EFV, or UWO) and generate your instant tracking link.
4. Share your links and track real-time clicks and verified mobile app installs!

SUPPORT:
If you need any assistance, reply directly to this email or contact us at admin@uwo24.com.

© 2026 UWO™ - Unified Web Options & Services Pvt. Ltd.
Building Intelligent Digital Platforms for a Connected World
https://uwo24.com
`.trim();
}

module.exports = {
  renderWelcomeEmail,
  renderWelcomeEmailText
};
