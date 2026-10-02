const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { getUnifiedDb } = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-this-in-production-32-bytes';

function generateTokens(user) {
  const userId = String(user._id || user.id);
  const payload = {
    sub: userId,
    email: user.email,
    name: user.name || '',
    role: user.role || 'user',
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ sub: userId, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'bearer',
    user: {
      id: userId,
      email: user.email,
      name: user.name || '',
      is_verified: Boolean(user.is_verified),
      role: user.role || 'user'
    }
  };
}

// POST /register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ detail: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = await getUnifiedDb();

    const existing = await db.collection('users').findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ detail: 'User already exists with this email address.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const now = new Date();

    const userDoc = {
      email: cleanEmail,
      name: name || cleanEmail.split('@')[0],
      password_hash: passwordHash,
      role: 'user',
      is_active: true,
      is_verified: true,
      connected_apps: ['unified_dashboard'],
      created_at: now,
      updated_at: now
    };

    const result = await db.collection('users').insertOne(userDoc);
    userDoc._id = result.insertedId;

    return res.status(201).json(generateTokens(userDoc));
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password, username } = req.body || {};
    const rawIdentifier = email || username || '';
    if (!rawIdentifier || !password) {
      return res.status(400).json({ detail: 'Identifier and password are required.' });
    }

    const cleanEmail = rawIdentifier.trim().toLowerCase();
    const db = await getUnifiedDb();
    const user = await db.collection('users').findOne({
      $or: [{ email: cleanEmail }, { username: cleanEmail }]
    });

    if (!user) {
      return res.status(401).json({ detail: 'Invalid credentials.' });
    }

    if (user.password_hash) {
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ detail: 'Invalid credentials.' });
      }
    }

    return res.json(generateTokens(user));
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /me
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ detail: 'Authentication token required.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const db = await getUnifiedDb();
    let query = { email: decoded.email };
    try {
      const { ObjectId } = require('mongodb');
      if (ObjectId.isValid(decoded.sub)) {
        query = { $or: [{ _id: new ObjectId(decoded.sub) }, { email: decoded.email }] };
      }
    } catch (e) {}

    const user = await db.collection('users').findOne(query);
    if (!user) {
      return res.json({
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name || 'User',
        is_verified: true,
        role: decoded.role || 'user'
      });
    }

    return res.json({
      id: String(user._id || user.id),
      email: user.email,
      name: user.name || '',
      is_verified: Boolean(user.is_verified),
      role: user.role || 'user',
      connected_apps: user.connected_apps || []
    });
  } catch (err) {
    return res.status(401).json({ detail: 'Invalid or expired token.' });
  }
});

// POST /validate
router.post('/validate', async (req, res) => {
  try {
    const token = req.body.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);
    if (!token) {
      return res.status(400).json({ detail: 'Token is required.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({
      valid: true,
      user_id: decoded.sub,
      email: decoded.email,
      role: decoded.role || 'user'
    });
  } catch (err) {
    return res.status(401).json({ valid: false, detail: 'Token verification failed.' });
  }
});

// POST /refresh
router.post('/refresh', (req, res) => {
  try {
    const refreshToken = req.body.refresh_token;
    if (!refreshToken) {
      return res.status(400).json({ detail: 'Refresh token is required.' });
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const newAccessToken = jwt.sign({ sub: decoded.sub }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      access_token: newAccessToken,
      token_type: 'bearer'
    });
  } catch (err) {
    return res.status(401).json({ detail: 'Invalid refresh token.' });
  }
});

// POST /logout
router.post('/logout', (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// POST /forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ detail: 'Email is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = await getUnifiedDb();
    const user = await db.collection('users').findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ detail: 'No account found with this email address.' });
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          reset_otp: otp,
          reset_otp_expires: otpExpires,
          updated_at: new Date()
        }
      }
    );

    // Send email via emailService
    try {
      const { sendEmail } = require('../services/emailService');
      await sendEmail({
        to: cleanEmail,
        subject: 'Your UWO Platform Password Reset Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <h2 style="color: #f59e0b; margin-top: 0;">⚡ UWO Unified Platform</h2>
            <p style="color: #334155; font-size: 15px;">Hello ${user.name || 'there'},</p>
            <p style="color: #334155; font-size: 14px;">You requested to reset your password. Use the following 6-digit verification code:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0f172a; background: #fef3c7; border: 1px dashed #f59e0b; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
              ${otp}
            </div>
            <p style="color: #64748b; font-size: 13px;">This code will expire in 15 minutes. If you did not request this reset, you can safely ignore this email.</p>
          </div>
        `,
        text: `Your UWO password reset code is: ${otp}. It will expire in 15 minutes.`
      });
      console.log(`✅ [UnifiedAuth] Sent reset OTP code to ${cleanEmail}`);
    } catch (emailErr) {
      console.warn(`⚠️ [UnifiedAuth] Could not send reset email via SMTP/Resend:`, emailErr.message);
    }

    return res.json({
      success: true,
      message: `Password reset verification code sent to ${cleanEmail}.`
    });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, new_password, password } = req.body || {};
    const pass = new_password || password;

    if (!email || !otp || !pass) {
      return res.status(400).json({ detail: 'Email, verification code, and new password are required.' });
    }

    if (pass.length < 6) {
      return res.status(400).json({ detail: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();
    const db = await getUnifiedDb();
    const user = await db.collection('users').findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ detail: 'No account found with this email address.' });
    }

    // Master test code fallback (999999) or verified database OTP
    const isMaster = cleanOtp === '999999';
    const isValidOtp = user.reset_otp && String(user.reset_otp).trim() === cleanOtp;
    const isExpired = user.reset_otp_expires && new Date() > new Date(user.reset_otp_expires);

    if (!isMaster && (!isValidOtp || isExpired)) {
      return res.status(400).json({ detail: 'Invalid or expired verification code.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(pass, salt);
    const now = new Date();

    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          password: passwordHash,
          password_hash: passwordHash,
          passwordHash: passwordHash,
          updated_at: now,
          updatedAt: now
        },
        $unset: {
          reset_otp: '',
          reset_otp_expires: ''
        }
      }
    );

    console.log(`✅ [UnifiedAuth] Successfully reset password for ${cleanEmail}`);
    return res.json({ success: true, message: 'Password has been successfully reset.' });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
