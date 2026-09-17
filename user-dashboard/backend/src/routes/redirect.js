const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getClientIp } = require('../utils/ip');
const ReferralLink = require('../models/ReferralLink');
const ClickLog = require('../models/ClickLog');
const PendingAttribution = require('../models/PendingAttribution');

function generateFingerprint(ip, userAgent) {
  return crypto
    .createHash('sha256')
    .update(`${ip}_${userAgent || ''}`)
    .digest('hex');
}

// @route   GET /r/:code
// @desc    Smart device router with Unique Click tracking, Play Referrer & iOS IP Matching
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).send('Invalid Referral Link');
    }

    const link = await ReferralLink.findOne({ code }).populate('product');

    if (!link || !link.product) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Link Not Found</title></head>
          <body style="font-family:sans-serif; text-align:center; padding: 50px;">
            <h2>Referral Link Not Found or Expired</h2>
            <p>The code "${code}" is invalid or the project was deleted.</p>
          </body>
        </html>
      `);
    }

    const userAgent = req.headers['user-agent'] || '';
    const ip = getClientIp(req);
    const fingerprint = generateFingerprint(ip, userAgent);

    // Fallback if platform-specific URL is omitted
    const fallbackUrl = link.product.webUrl || link.product.androidUrl || link.product.iosUrl;

    if (!fallbackUrl) {
      return res.status(404).send('No destination URL configured for this project.');
    }

    let deviceType = 'desktop';
    let targetUrl = fallbackUrl;

    if (/Android/i.test(userAgent)) {
      deviceType = 'android';
      targetUrl = link.product.androidUrl || fallbackUrl;

      // Google Play Store Referrer Integration
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
    } else if (/iPad|iPhone|iPod/i.test(userAgent)) {
      deviceType = 'ios';
      targetUrl = link.product.iosUrl || fallbackUrl;

      // iOS IP & Fingerprint Attribution (3 hours TTL)
      const ttlHours = 3;
      const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

      PendingAttribution.create({
        ip,
        fingerprint,
        referralLink: link._id,
        code: link.code,
        userId: link.userId,
        product: link.product._id,
        platform: 'ios',
        userAgent,
        converted: false,
        expiresAt,
      }).catch((err) => console.error('Error saving iOS pending attribution:', err.message));

      console.log(`📱 [iOS Click Captured] IP: ${ip} | Code: ${link.code} | TTL: ${ttlHours}h`);
    } else {
      deviceType = 'desktop';
      targetUrl = link.product.webUrl || fallbackUrl;

      // Append query parameters to standard web destination
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
    (async () => {
      try {
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
          deviceType,
          targetUrl,
          userAgent,
          ip,
          isUnique,
        });

        console.log(`🔀 [Click Logged] Code: ${link.code} | IP: ${ip} | Unique: ${isUnique} | Device: ${deviceType}`);
      } catch (err) {
        console.error('Error logging click analytics:', err);
      }
    })();

    console.log(`🔀 Redirecting [${deviceType.toUpperCase()}] to: ${targetUrl}`);
    return res.redirect(302, targetUrl);
  } catch (error) {
    console.error('Redirection error:', error);
    res.status(500).send('Redirection error');
  }
});

module.exports = router;
