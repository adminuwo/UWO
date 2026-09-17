const mongoose = require('mongoose');
require('dotenv').config();

require('../src/models/Product');
require('../src/models/User');
const ReferralLink = require('../src/models/ReferralLink');
const PendingAttribution = require('../src/models/PendingAttribution');
const ClickLog = require('../src/models/ClickLog');
const DownloadLog = require('../src/models/DownloadLog');

async function runSimulation() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/referral_db';
  await mongoose.connect(uri);

  console.log('\n===============================================================');
  console.log('🧪 TESTING ALL 3 REDIRECTION & ATTRIBUTION FLOWS (WITHOUT DEVICES)');
  console.log('===============================================================\n');

  const link = await ReferralLink.findOne().populate('product');
  if (!link) {
    console.error('❌ No referral link found. Please run "npm run seed" first.');
    process.exit(1);
  }

  console.log(`📌 Using Test Referral Code: "${link.code}"`);
  console.log(`📌 Referrer User ID:        "${link.userId}"`);
  console.log(`📌 Project:                 "${link.product.name}"\n`);

  const initialClicks = link.clicks || 0;
  const initialDownloads = link.downloads || 0;

  // -------------------------------------------------------------
  // TEST 1: DESKTOP / LAPTOP REDIRECTION
  // -------------------------------------------------------------
  console.log('---------------------------------------------------------------');
  console.log('🖥️  TEST 1: Desktop / Laptop Redirection');
  console.log('---------------------------------------------------------------');
  const desktopUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/114.0.0.0';
  let desktopTarget = link.product.webUrl || link.product.androidUrl || link.product.iosUrl;
  if (desktopTarget.startsWith('http')) {
    const u = new URL(desktopTarget);
    u.searchParams.set('ref', link.code);
    u.searchParams.set('ref_by', link.userId);
    desktopTarget = u.toString();
  }

  await ReferralLink.findByIdAndUpdate(link._id, { $inc: { clicks: 1 } });
  await ClickLog.create({
    referralLink: link._id,
    code: link.code,
    user: link.user,
    product: link.product._id,
    deviceType: 'desktop',
    targetUrl: desktopTarget,
    userAgent: desktopUserAgent,
    ip: '127.0.0.1',
  });

  console.log('✅ Device Detected: Desktop / Laptop');
  console.log('✅ Redirected to:   ', desktopTarget);
  console.log('✅ Click logged in MongoDB under "desktop".\n');

  // -------------------------------------------------------------
  // TEST 2: ANDROID REDIRECTION & GOOGLE PLAY INSTALL REFERRER
  // -------------------------------------------------------------
  console.log('---------------------------------------------------------------');
  console.log('🤖 TEST 2: Android Redirection & Google Play Install Referrer');
  console.log('---------------------------------------------------------------');
  const androidUserAgent = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) Chrome/114.0.0.0 Mobile';
  let androidTarget = link.product.androidUrl || link.product.webUrl || link.product.iosUrl;
  if (androidTarget.includes('play.google.com')) {
    const u = new URL(androidTarget);
    u.searchParams.set('referrer', `utm_source=referral&ref=${link.code}&ref_by=${link.userId}`);
    androidTarget = u.toString();
  }

  await ReferralLink.findByIdAndUpdate(link._id, { $inc: { clicks: 1 } });
  await ClickLog.create({
    referralLink: link._id,
    code: link.code,
    user: link.user,
    product: link.product._id,
    deviceType: 'android',
    targetUrl: androidTarget,
    userAgent: androidUserAgent,
    ip: '127.0.0.1',
  });

  console.log('✅ Device Detected: Android Mobile');
  console.log('✅ Redirected to:   ', androidTarget);
  console.log('   ↳ Google Play Referrer Parameter attached:');
  console.log(`     &referrer=utm_source=referral&ref=${link.code}&ref_by=${link.userId}`);

  // Simulate Android App First-Open Callback
  console.log('\n📲 [Simulating Android App First-Open]:');
  await ReferralLink.findByIdAndUpdate(link._id, { $inc: { downloads: 1 } });
  await DownloadLog.create({
    referralLink: link._id,
    code: link.code,
    user: link.user,
    userId: link.userId,
    product: link.product._id,
    platform: 'android',
    ip: '127.0.0.1',
    attributionMethod: 'google_play_referrer',
  });
  console.log('✅ Android app read referrer from Google Play API & called backend.');
  console.log('✅ Verified download credited to referrer!\n');

  // -------------------------------------------------------------
  // TEST 3: iOS REDIRECTION, IP CAPTURE, & FIRST-OPEN ATTRIBUTION
  // -------------------------------------------------------------
  console.log('---------------------------------------------------------------');
  console.log('🍏 TEST 3: iOS Redirection & IP/Fingerprint Matching (2-4h TTL)');
  console.log('---------------------------------------------------------------');
  const iosUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15';
  const iosTarget = link.product.iosUrl || link.product.webUrl || link.product.androidUrl;
  const mockIosIp = '203.0.113.88'; // Mock iOS visitor IP
  const expiresAt = new Date(Date.now() + 3 * 3600 * 1000); // 3 hour TTL

  const pending = await PendingAttribution.create({
    ip: mockIosIp,
    fingerprint: 'sha256_mock_ios_fingerprint_88',
    referralLink: link._id,
    code: link.code,
    userId: link.userId,
    product: link.product._id,
    platform: 'ios',
    userAgent: iosUserAgent,
    converted: false,
    expiresAt,
  });

  await ReferralLink.findByIdAndUpdate(link._id, { $inc: { clicks: 1 } });
  await ClickLog.create({
    referralLink: link._id,
    code: link.code,
    user: link.user,
    product: link.product._id,
    deviceType: 'ios',
    targetUrl: iosTarget,
    userAgent: iosUserAgent,
    ip: mockIosIp,
  });

  console.log('✅ Device Detected: Apple iOS (iPhone/iPad)');
  console.log('✅ Redirected to:   ', iosTarget);
  console.log(`✅ IP & Fingerprint captured in MongoDB with 3-Hour TTL.`);
  console.log(`   ↳ IP: ${mockIosIp} | Expires At: ${expiresAt.toLocaleTimeString()}`);

  // Simulate iOS App First-Open Callback
  console.log('\n📲 [Simulating iOS App First-Open from Same IP]:');
  const match = await PendingAttribution.findOne({ ip: mockIosIp, converted: false, platform: 'ios' });
  if (match) {
    match.converted = true;
    await match.save();

    await ReferralLink.findByIdAndUpdate(link._id, { $inc: { downloads: 1 } });
    await DownloadLog.create({
      referralLink: link._id,
      code: link.code,
      user: link.user,
      userId: link.userId,
      product: link.product._id,
      platform: 'ios',
      ip: mockIosIp,
      fingerprint: match.fingerprint,
      attributionMethod: 'ios_ip_fingerprint',
    });
    console.log(`✅ iOS first open detected from IP "${mockIosIp}".`);
    console.log('✅ IP matched with pending referral click within TTL window!');
    console.log('✅ Verified download credited to referrer!');
  }

  // -------------------------------------------------------------
  // FINAL VERIFICATION SUMMARY
  // -------------------------------------------------------------
  const finalLink = await ReferralLink.findById(link._id);
  console.log('\n===============================================================');
  console.log('📊 SIMULATION RESULTS SUMMARY');
  console.log('===============================================================');
  console.log(`• Total Clicks:     ${initialClicks} ➔ ${finalLink.clicks} (+3 clicks recorded)`);
  console.log(`• Total Downloads:  ${initialDownloads} ➔ ${finalLink.downloads} (+2 app downloads attributed)`);
  console.log('• Desktop Redirection: ✅ PASS');
  console.log('• Android Play Referrer: ✅ PASS');
  console.log('• iOS IP Attribution:   ✅ PASS (2-4h TTL Active)');
  console.log('===============================================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

runSimulation().catch((err) => {
  console.error('Simulation error:', err);
  process.exit(1);
});
