const { renderWelcomeEmail, renderWelcomeEmailText } = require('../templates/welcomeEmail');
const { sendEmail } = require('../../services/emailService');

async function sendCredentialsEmail({ to, name, userId, password, loginUrl }) {
  const fallbackLoginUrl = loginUrl || process.env.REFERRAL_FRONTEND_URL || process.env.FRONTEND_URL || 'https://uwo24.com/user';
  const cleanLoginUrl = fallbackLoginUrl.includes('localhost') ? `${fallbackLoginUrl}/login` : fallbackLoginUrl;

  const htmlContent = renderWelcomeEmail({
    name,
    email: to,
    userDashboardUserId: userId,
    userDashboardPassword: password,
    userDashboardLoginUrl: cleanLoginUrl
  });

  const textContent = renderWelcomeEmailText({
    name,
    email: to,
    userDashboardUserId: userId,
    userDashboardPassword: password,
    userDashboardLoginUrl: cleanLoginUrl
  });

  // Send via Resend / EmailService
  try {
    const result = await sendEmail({
      to,
      subject: `🎉 Welcome to UWO™ Earn & Refer Program - Your Credentials (User ID: ${userId})`,
      html: htmlContent,
      text: textContent
    });
    console.log(`✉️ Referral credentials email sent to ${to}:`, result);
    return { success: result.success, mode: result.provider, messageId: result.id };
  } catch (err) {
    console.error('⚠️ Error sending referral email:', err.message);
    return { success: false, mode: 'error', error: err.message };
  }
}

module.exports = { sendCredentialsEmail };
