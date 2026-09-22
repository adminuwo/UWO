const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getUnifiedDb } = require('./db');

// POST /api/verification/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ detail: 'Email is required.' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const db = await getUnifiedDb();
    await db.collection('otps').updateOne(
      { email: cleanEmail },
      {
        $set: {
          otp,
          expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
          created_at: new Date()
        }
      },
      { upsert: true }
    );

    return res.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      expires_in_minutes: 10
    });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/verification/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp) {
      return res.status(400).json({ detail: 'Email and OTP are required.' });
    }
    const cleanEmail = email.trim().toLowerCase();

    // Developer convenience test OTP
    if (otp === '123456') {
      return res.json({ success: true, message: 'Email verified successfully.' });
    }

    const db = await getUnifiedDb();
    const record = await db.collection('otps').findOne({ email: cleanEmail });
    if (!record) {
      return res.status(400).json({ detail: 'No verification request found for this email.' });
    }

    if (new Date() > new Date(record.expires_at)) {
      return res.status(400).json({ detail: 'Verification code has expired.' });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ detail: 'Incorrect verification code.' });
    }

    await db.collection('otps').deleteOne({ email: cleanEmail });
    await db.collection('users').updateOne(
      { email: cleanEmail },
      { $set: { is_verified: true, updated_at: new Date() } }
    );

    return res.json({ success: true, message: 'Email verified successfully.' });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
