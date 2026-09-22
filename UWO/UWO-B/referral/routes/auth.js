const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/RefUser');
const { protect, generateUserId, generatePassword, JWT_SECRET } = require('../middleware/auth');
const { sendCredentialsEmail } = require('../services/mailer');
const { syncUserToUnified } = require('../utils/marketingSync');

// @route   POST /api/auth/register
// @desc    Register user from main website popup & email credentials
router.post('/register', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    const frontendUrl = process.env.REFERRAL_FRONTEND_URL || process.env.FRONTEND_URL || 'https://uwo24.com/user';
    const loginUrl = frontendUrl.includes('localhost') ? `${frontendUrl}/login` : frontendUrl;

    let existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      // Regenerate password and send updated credentials
      const newPassword = generatePassword();
      const salt = await bcrypt.genSalt(10);
      existingUser.password = await bcrypt.hash(newPassword, salt);
      existingUser.name = cleanName;
      await existingUser.save();

      // Sync updated user to Unified Central Users
      syncUserToUnified(existingUser).catch((err) =>
        console.warn('[Auth] Sync user error:', err.message)
      );

      await sendCredentialsEmail({
        to: cleanEmail,
        name: existingUser.name,
        userId: existingUser.userId,
        password: newPassword,
        loginUrl,
      });

      return res.json({
        success: true,
        message: 'Account already exists! Your updated password and User ID have been emailed to you.',
        userId: existingUser.userId,
        isExisting: true,
        credentials: {
          userId: existingUser.userId,
          password: newPassword,
          email: cleanEmail,
          loginUrl,
        },
      });
    }

    // Generate unique User ID
    let userId = generateUserId();
    while (await User.findOne({ userId })) {
      userId = generateUserId();
    }

    const plainPassword = generatePassword();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const newUser = await User.create({
      userId,
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
    });

    // Automatically sync new user to Unified Central Users
    syncUserToUnified(newUser).catch((err) =>
      console.warn('[Auth] Sync user error:', err.message)
    );

    // Send email with credentials
    await sendCredentialsEmail({
      to: cleanEmail,
      name: cleanName,
      userId,
      password: plainPassword,
      loginUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your User ID and password have been sent to your email.',
      userId: newUser.userId,
      isExisting: false,
      credentials: {
        userId,
        password: plainPassword,
        email: cleanEmail,
        loginUrl,
      },
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// @route   POST /api/auth/login
// @desc    Log in with User ID or Email + Password
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'User ID or Email, and Password are required' });
    }

    const cleanIdentifier = identifier.trim();

    const user = await User.findOne({
      $or: [
        { userId: cleanIdentifier },
        { email: cleanIdentifier.toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid User ID/Email or Password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid User ID/Email or Password' });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        userId: user.userId,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        userId: user.userId,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      authenticated: true,
      user: {
        id: user._id.toString(),
        userId: user.userId,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
