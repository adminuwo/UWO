const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getClientIp } = require('../utils/ip');
const PendingAttribution = require('../models/PendingAttribution');
const ReferralLink = require('../models/ReferralLink');
const ClickLog = require('../models/ClickLog');
const DownloadLog = require('../models/DownloadLog');

function generateFingerprint(ip, userAgent) {
  return crypto
    .createHash('sha256')
    .update(`${ip}_${userAgent || ''}`)
    .digest('hex');
}

// @route   POST /api/conversions/simulate-click
// @desc    Simulate a click from any device (Desktop, Android, iOS) without physical hardware
router.post('/simulate-click', async (req, res) => {
  try {
    const { code, deviceType } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Referral code is required' });
    }

    const link = await ReferralLink.findOne({ code }).populate('product');
    if (!link || !link.product) {
      return res.status(404).json({ error: `Referral link with code "${code}" not found` });
    }

    const ip = req.body.customIp || getClientIp(req);

    const fallbackUrl = link.product.webUrl || link.product.androidUrl || link.product.iosUrl;
    let targetUrl = fallbackUrl;
    let mockUserAgent = '';
    let pendingCreated = false;

    if (deviceType === 'android') {
      mockUserAgent = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36';
      targetUrl = link.product.androidUrl || fallbackUrl;

      if (targetUrl.includes('play.google.com/store/apps/details')) {
        try {
          const parsedUrl = new URL(targetUrl);
          const referrerParams = `utm_source=referral&utm_campaign=referral_program&ref=${encodeURIComponent(
            link.code
          )}&ref_by=${encodeURIComponent(link.userId)}`;
          parsedUrl.searchParams.set('referrer', referrerParams);
          targetUrl = parsedUrl.toString();
        } catch (e) {}
      }
    } else if (deviceType === 'ios') {
      mockUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1';
      targetUrl = link.product.iosUrl || fallbackUrl;

      const ttlHours = 3;
      const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
      const fingerprint = generateFingerprint(ip, mockUserAgent);

      await PendingAttribution.create({
        ip,
        fingerprint,
        referralLink: link._id,
        code: link.code,
        userId: link.userId,
        product: link.product._id,
        platform: 'ios',
        userAgent: mockUserAgent,
        converted: false,
        expiresAt,
      });
      pendingCreated = true;
    } else {
      // Desktop
      mockUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
      targetUrl = link.product.webUrl || fallbackUrl;

      try {
        if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
          const parsedUrl = new URL(targetUrl);
          parsedUrl.searchParams.set('ref', link.code);
          parsedUrl.searchParams.set('ref_by', link.userId);
          targetUrl = parsedUrl.toString();
        }
      } catch (e) {}
    }

    // Unique Click Tracking Logic: Check if this IP has previously clicked this specific link
    const alreadyClicked = await ClickLog.exists({ referralLink: link._id, ip });
    const isUnique = !alreadyClicked;

    const updateFields = { $inc: { clicks: 1 } };
    if (isUnique) {
      updateFields.$inc.uniqueClicks = 1;
    }

    await ReferralLink.findByIdAndUpdate(link._id, updateFields);
    await ClickLog.create({
      referralLink: link._id,
      code: link.code,
      user: link.user,
      product: link.product._id,
      deviceType: deviceType || 'desktop',
      targetUrl,
      userAgent: mockUserAgent,
      ip,
      isUnique,
    });

    res.json({
      success: true,
      deviceType: deviceType || 'desktop',
      targetUrl,
      ip,
      isUnique,
      pendingCreated,
      code: link.code,
      message: `Simulated [${(deviceType || 'desktop').toUpperCase()}] click successfully recorded! (${isUnique ? 'Unique click' : 'Repeat click'})`,
    });
  } catch (error) {
    console.error('Simulation click error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/conversions/ios-verify
// @desc    Called on first open by iOS app to check IP and attribute download
router.post('/ios-verify', async (req, res) => {
  try {
    const ip = req.body.customIp || getClientIp(req);

    const pending = await PendingAttribution.findOne({
      ip,
      converted: false,
      platform: 'ios',
    }).sort({ createdAt: -1 });

    if (!pending) {
      return res.json({
        success: true,
        attributed: false,
        message: 'No pending referral link click found for this IP within the 2-4 hour window.',
        ip,
      });
    }

    // Match found!
    pending.converted = true;
    await pending.save();

    const link = await ReferralLink.findById(pending.referralLink);
    if (link) {
      link.downloads = (link.downloads || 0) + 1;
      await link.save();
    }

    const downloadLog = await DownloadLog.create({
      referralLink: pending.referralLink,
      code: pending.code,
      user: link ? link.user : pending.referralLink,
      userId: pending.userId,
      product: pending.product,
      platform: 'ios',
      ip,
      fingerprint: pending.fingerprint,
      attributionMethod: 'ios_ip_fingerprint',
    });

    console.log(`✅ [iOS Download Attributed] Code: "${pending.code}" | Referrer: "${pending.userId}" | IP: ${ip}`);

    res.json({
      success: true,
      attributed: true,
      message: 'Download successfully credited to referrer via iOS IP matching!',
      attribution: {
        code: pending.code,
        referrerUserId: pending.userId,
        product: pending.product,
        downloadId: downloadLog._id,
      },
    });
  } catch (error) {
    console.error('Error verifying iOS download:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/conversions/android-install
// @desc    Called by Android app when launched via Google Play Install Referrer
router.post('/android-install', async (req, res) => {
  try {
    const { referralCode } = req.body;

    if (!referralCode) {
      return res.status(400).json({ error: 'referralCode is required' });
    }

    const cleanCode = referralCode.trim();

    const link = await ReferralLink.findOne({ code: cleanCode });
    if (!link) {
      return res.status(404).json({ error: `Referral link with code "${cleanCode}" not found` });
    }

    const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
    const ip = rawIp.replace('::ffff:', '').trim();

    await ReferralLink.findByIdAndUpdate(link._id, {
      $inc: { downloads: 1 },
    });

    const downloadLog = await DownloadLog.create({
      referralLink: link._id,
      code: link.code,
      user: link.user,
      userId: link.userId,
      product: link.product,
      platform: 'android',
      ip,
      attributionMethod: 'google_play_referrer',
    });

    console.log(`✅ [Android Download Attributed] Code: "${link.code}" | Referrer: "${link.userId}"`);

    res.json({
      success: true,
      attributed: true,
      message: 'Android download successfully recorded via Play Referrer!',
      attribution: {
        code: link.code,
        referrerUserId: link.userId,
        downloadId: downloadLog._id,
      },
    });
  } catch (error) {
    console.error('Error logging Android install:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/conversions/pending-ios
// @desc    View pending iOS clicks (for inspection / testing)
router.get('/pending-ios', async (req, res) => {
  try {
    const pending = await PendingAttribution.find({ platform: 'ios', converted: false })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, pending });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
