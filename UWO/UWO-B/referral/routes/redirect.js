const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getClientIp } = require('../utils/ip');
const ReferralLink = require('../models/ReferralLink');
const ClickLog = require('../models/ClickLog');
const PendingAttribution = require('../models/PendingAttribution');
const { syncClickToMarketing } = require('../utils/marketingSync');

function generateFingerprint(ip, userAgent) {
  return crypto
    .createHash('sha256')
    .update(`${ip}_${userAgent || ''}`)
    .digest('hex');
}

// Enable CORS for universal client-side SDK & fetch usage
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Helper to determine if client wants JSON resolution
function wantsJson(req) {
  return (
    (req.headers.accept && req.headers.accept.includes('application/json')) ||
    req.query.format === 'json' ||
    req.path.startsWith('/resolve')
  );
}

// Core referral router logic
async function handleReferralRouting(req, res) {
  const isJson = wantsJson(req);
  try {
    const { code } = req.params;

    if (!code) {
      if (isJson) return res.status(400).json({ success: false, error: 'Invalid Referral Link' });
      return res.status(400).send('Invalid Referral Link');
    }

    const link = await ReferralLink.findOne({ code }).populate('product');
    let isMarketingLink = false;
    let marketingDoc = null;

    if (!link || !link.product) {
      try {
        const { getUnifiedDb } = require('../utils/marketingSync');
        const uDb = await getUnifiedDb();
        marketingDoc = await uDb.collection('marketing_links').findOne({ slug: code });
        if (marketingDoc) {
          isMarketingLink = true;
        }
      } catch (err) {
        console.warn('[Redirect] Check marketing_links fallback:', err.message);
      }
    }

    if (!link && !marketingDoc) {
      if (isJson) {
        return res.status(404).json({
          success: false,
          error: `The referral code "${code}" is invalid or expired.`,
          code
        });
      }
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

    if (isMarketingLink && marketingDoc) {
      const userAgent = req.headers['user-agent'] || '';
      const ip = getClientIp(req);
      let deviceType = 'desktop';
      if (/Android/i.test(userAgent)) deviceType = 'android';
      else if (/iPad|iPhone|iPod/i.test(userAgent)) deviceType = 'ios';

      let targetUrl = marketingDoc.full_destination_url || marketingDoc.target_url || marketingDoc.web_url;
      if (marketingDoc.is_smart_link) {
        if (deviceType === 'android' && marketingDoc.android_url) {
          targetUrl = marketingDoc.android_url;
        } else if (deviceType === 'ios' && marketingDoc.ios_url) {
          targetUrl = marketingDoc.ios_url;
        } else if (marketingDoc.web_url) {
          targetUrl = marketingDoc.web_url;
        }
      }

      if (targetUrl && targetUrl.includes('play.google.com/store/apps/details') && !targetUrl.includes('referrer=')) {
        try {
          const sep = targetUrl.includes('?') ? '&' : '?';
          targetUrl = `${targetUrl}${sep}referrer=utm_source%3D${encodeURIComponent(marketingDoc.platform || 'referral')}%26ref%3D${encodeURIComponent(code)}`;
        } catch (e) {}
      }

      (async () => {
        try {
          const { getUnifiedDb } = require('../utils/marketingSync');
          const uDb = await getUnifiedDb();
          await uDb.collection('marketing_links').updateOne(
            { _id: marketingDoc._id },
            { $inc: { total_clicks: 1, unique_clicks: 1 }, $set: { last_clicked_at: new Date() } }
          );
        } catch (e) {}
      })();

      if (isJson) {
        return res.json({
          success: true,
          code,
          deviceType,
          targetUrl,
          isSmartLink: Boolean(marketingDoc.is_smart_link)
        });
      }
      return res.redirect(302, targetUrl);
    }

    const userAgent = req.headers['user-agent'] || '';
    const ip = getClientIp(req);
    const fingerprint = generateFingerprint(ip, userAgent);

    // Fallback if platform-specific URL is omitted
    const fallbackUrl = link.product.webUrl || link.product.androidUrl || link.product.iosUrl;

    if (!fallbackUrl) {
      if (isJson) return res.status(404).json({ success: false, error: 'No destination URL configured for this project.', code });
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

        // Sync click in real-time to Unified Dashboard (marketing_links & marketing_clicks)
        syncClickToMarketing({
          code: link.code,
          linkId: link._id,
          userId: link.userId,
          deviceType,
          targetUrl,
          userAgent,
          ip,
          isUnique,
          referrer: req.headers['referer'] || req.headers['referrer'] || '',
        }).catch((err) =>
          console.warn('[Redirect] Click sync to Unified error:', err.message)
        );
      } catch (err) {
        console.error('Error logging click analytics:', err);
      }
    })();

    if (isJson) {
      return res.json({
        success: true,
        code: link.code,
        deviceType,
        targetUrl
      });
    }

    console.log(`🔀 Redirecting [${deviceType.toUpperCase()}] to: ${targetUrl}`);
    return res.redirect(302, targetUrl);
  } catch (error) {
    console.error('Redirection error:', error);
    if (isJson) {
      return res.status(500).json({ success: false, error: 'Redirection error', message: error.message });
    }
    res.status(500).send('Redirection error');
  }
}

// Mount referral routing on both explicit JSON resolve endpoint and standard smart link
router.get('/resolve/:code', (req, res) => {
  req.query.format = 'json';
  return handleReferralRouting(req, res);
});
router.get('/:code', handleReferralRouting);

module.exports = router;
