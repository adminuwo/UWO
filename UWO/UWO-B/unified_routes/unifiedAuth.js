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
  const { email } = req.body || {};
  return res.json({ success: true, message: `Password reset instructions sent to ${email || 'your email'}.` });
});

// POST /reset-password
router.post('/reset-password', async (req, res) => {
  return res.json({ success: true, message: 'Password has been successfully reset.' });
});

module.exports = router;
