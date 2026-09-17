const nodemailer = require('nodemailer');

/**
 * Universal Email Sender for UWO Ecosystem.
 * Prioritizes Resend API (super-fast, reliable deliverability),
 * with automatic fallback to Nodemailer SMTP.
 */
async function sendEmail({ to, subject, html, text, from }) {
  const recipients = Array.isArray(to) ? to : [to];
  const cleanTo = recipients.map(e => (e || '').trim()).filter(Boolean);
  
  if (!cleanTo.length) {
    throw new Error('No recipient email address specified');
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const defaultFrom = process.env.RESEND_FROM || process.env.SMTP_FROM || `"UWO™ Referral Ecosystem" <admin@ai-mall.in>`;
  const sender = from || defaultFrom;

  // 1. Try Resend API first
  if (resendApiKey) {
    try {
      console.log(`📡 [EmailService] Sending via Resend to ${cleanTo.join(', ')}...`);
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: sender,
          to: cleanTo,
          subject,
          html,
          text: text || undefined
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.id) {
        console.log(`✅ [Resend] Email delivered successfully! ID: ${data.id} -> ${cleanTo.join(', ')}`);
        return { success: true, provider: 'resend', id: data.id };
      }

      console.warn(`⚠️ [Resend Warning] Status ${response.status}:`, data.message || JSON.stringify(data));
      // If error was validation or forbidden, fallback to Nodemailer
    } catch (resendErr) {
      console.error('⚠️ [Resend Network Error]:', resendErr.message);
    }
  }

  // 2. Fallback to Nodemailer SMTP
  console.log(`📡 [EmailService] Falling back to Nodemailer SMTP...`);
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER || process.env.SMTP_USER,
        pass: process.env.EMAIL_PASS || process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
    });

    const info = await transporter.sendMail({
      from: sender,
      to: cleanTo.join(', '),
      subject,
      html,
      text
    });

    console.log(`✅ [Nodemailer] Email sent: ${info.messageId}`);
    return { success: true, provider: 'nodemailer', id: info.messageId };
  } catch (smtpErr) {
    console.error('❌ [Nodemailer Error]:', smtpErr.message);
    return { success: false, error: smtpErr.message };
  }
}

module.exports = { sendEmail };
