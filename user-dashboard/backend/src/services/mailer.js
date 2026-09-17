const nodemailer = require('nodemailer');

async function sendCredentialsEmail({ to, name, userId, password, loginUrl }) {
  const isSmtpEnabled = process.env.SMTP_ENABLE === 'true';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1120; margin: 0; padding: 24px 12px; color: #f8fafc; }
          .card { max-width: 580px; margin: 0 auto; background: #0e172a; border-radius: 16px; overflow: hidden; border: 1.5px solid rgba(214, 165, 89, 0.4); box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
          .header { background: linear-gradient(135deg, #162377 0%, #0b1120 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #D6A559; }
          .title { color: #D6A559; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: 0.5px; }
          .subtitle { color: #cbd5e1; font-size: 13px; margin-top: 6px; text-transform: uppercase; letter-spacing: 2px; }
          .body { padding: 30px 26px; }
          .greeting { color: #ffffff; font-size: 19px; font-weight: 700; margin: 0 0 12px; }
          .desc { color: #cbd5e1; font-size: 14.5px; line-height: 1.6; margin: 0 0 20px; }
          .credentials-box { background: rgba(214, 165, 89, 0.08); border: 1px solid rgba(214, 165, 89, 0.35); border-radius: 12px; padding: 20px; margin: 24px 0; }
          .box-title { color: #FABE56; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }
          .cred-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 14px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .cred-row:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
          .cred-label { color: #94a3b8; font-weight: 500; }
          .cred-value { color: #ffffff; font-weight: 700; font-family: 'Courier New', monospace; background: #1e293b; padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(214, 165, 89, 0.3); font-size: 14px; }
          .products-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 18px 0 24px; font-size: 12px; }
          .prod-item { background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 8px; border-left: 3px solid #D6A559; color: #e2e8f0; }
          .btn-container { text-align: center; margin: 28px 0 16px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #D6A559 0%, #FABE56 100%); color: #0b1120 !important; text-decoration: none; font-weight: 700; padding: 14px 34px; border-radius: 10px; font-size: 15px; box-shadow: 0 4px 14px rgba(214, 165, 89, 0.4); }
          .footer { background: #050811; padding: 20px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid rgba(255,255,255,0.06); }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 class="title">UWO™ REFERRAL PORTAL</h1>
            <p class="subtitle">Official Referral &amp; Growth Partner Program</p>
          </div>
          
          <div class="body">
            <h2 class="greeting">Hi ${name}, welcome aboard! 👋</h2>
            <p class="desc">
              Your referral user account has been successfully created. You can now access your personalized <strong>User Referral Dashboard</strong> to generate unique tracking links, track live clicks, monitor verified Android &amp; iOS app installs, and view your referral activity.
            </p>

            <div class="credentials-box">
              <div class="box-title">🔐 Your Dashboard Access Credentials</div>
              <div class="cred-row">
                <span class="cred-label">User ID:</span>
                <span class="cred-value" style="color: #FABE56;">${userId}</span>
              </div>
              <div class="cred-row">
                <span class="cred-label">Registered Email:</span>
                <span class="cred-value">${to}</span>
              </div>
              <div class="cred-row">
                <span class="cred-label">Password:</span>
                <span class="cred-value">${password}</span>
              </div>
            </div>

            <div class="btn-container">
              <a href="${loginUrl}" class="btn" target="_blank">Access Your Referral Dashboard →</a>
            </div>

            <p style="color: #94a3b8; font-size: 13px; margin: 24px 0 8px; font-weight: 600;">Products Available for Referral:</p>
            <div class="products-grid">
              <div class="prod-item">⚡ AISA™ (Enterprise AI)</div>
              <div class="prod-item">⚖️ AI Legal™ (Legal Practice)</div>
              <div class="prod-item">📢 AI Ads™ (Multi-Channel)</div>
              <div class="prod-item">💳 AI CashFlow™ (Fintech)</div>
              <div class="prod-item">🛒 AI Mall™ (AI Marketplace)</div>
              <div class="prod-item">🔗 AISA Connect™ (Identity &amp; SSO)</div>
              <div class="prod-item">🏢 EFV™ (Franchise Portal)</div>
              <div class="prod-item">🌐 UWO™ Corporate Portal</div>
            </div>

            <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin-top: 20px;">
              You can sign in using either your User ID (<strong>${userId}</strong>) or your Email (<strong>${to}</strong>) with the generated password above.
            </p>
          </div>

          <div class="footer">
            <p style="margin: 0 0 6px;">UWO™ - Unified Web Options &amp; Services Pvt. Ltd. &copy; 2026</p>
            <p style="margin: 0;">Building Intelligent Digital Platforms for a Connected World</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Send via Resend / EmailService
  try {
    const { sendEmail } = require('./emailService');
    const result = await sendEmail({
      to,
      subject: `Your Referral Dashboard Credentials (User ID: ${userId})`,
      html: htmlContent
    });
    console.log(`✉️ Referral credentials email sent to ${to}:`, result);
    return { success: true, mode: result.provider, messageId: result.id };
  } catch (err) {
    console.error('⚠️ Error sending referral email:', err.message);
    return { success: false, mode: 'error', error: err.message };
  }
}

module.exports = { sendCredentialsEmail };
