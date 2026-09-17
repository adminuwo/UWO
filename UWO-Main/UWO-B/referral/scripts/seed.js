const bcrypt = require('bcryptjs');
const User = require('../models/RefUser');
const Product = require('../models/RefProduct');
const ReferralLink = require('../models/ReferralLink');
const ClickLog = require('../models/ClickLog');

async function seedReferralSystem() {
  try {
    console.log('🔄 Checking & seeding Referral Portal data...');

    // 1. Create / Ensure Demo User
    const demoEmail = 'demo@example.com';
    const demoPasswordPlain = 'Demo@12345';
    const demoUserId = 'USR-DEMO1';

    let demoUser = await User.findOne({ email: demoEmail });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(demoPasswordPlain, salt);

    if (!demoUser) {
      demoUser = await User.create({
        userId: demoUserId,
        name: 'Demo User',
        email: demoEmail,
        password: hashedPassword,
      });
      console.log(` Created Referral Demo User: ${demoUser.name} (${demoUser.userId})`);
    }

    // 2. Ensure Official Ecosystem Products exist in RefProduct
    const uwoProducts = [
      {
        name: 'AISA™',
        slug: 'aisa',
        description: 'Next-Gen Enterprise AI Models & Assistant Platform',
        webUrl: 'https://aisa24.com',
        androidUrl: 'https://play.google.com/store/apps/details?id=com.uwo.aisa',
        iosUrl: 'https://apps.apple.com/app/aisa/id6779135418',
        active: true,
      },
      {
        name: 'AI Legal™',
        slug: 'ailegal',
        description: 'AI Legal Assistant & Advocates Practice Suite',
        webUrl: 'https://ailegal.aisa24.com',
        androidUrl: 'https://play.google.com/store/apps/details?id=com.uwo.ailegal&pcampaignid=web_share',
        iosUrl: 'https://apps.apple.com/in/app/ai-legal/id6797449251',
        active: true,
      },
      {
        name: 'AI Ads™',
        slug: 'aiads',
        description: 'AI-Powered Multi-Channel Advertising & Campaign Optimization',
        webUrl: 'https://ads.aisa24.com',
        androidUrl: '',
        iosUrl: '',
        active: true,
      },
      {
        name: 'AI CashFlow™',
        slug: 'aicashflow',
        description: 'Intelligent Financial Forecasting, Accounting & Cash Flow Automation',
        webUrl: 'https://cashflow.uwo24.com',
        androidUrl: '',
        iosUrl: '',
        active: true,
      },
      {
        name: 'AI Mall™',
        slug: 'aimall',
        description: 'Multi-Agent AI Marketplace & Productivity Tools',
        webUrl: 'https://aimall24.com',
        androidUrl: 'https://play.google.com/store/apps/details?id=com.uwo.aimall',
        iosUrl: '',
        active: true,
      },
      {
        name: 'AISA Connect™',
        slug: 'aisaconnect',
        description: 'Central Identity, SSO & Business Networking Platform',
        webUrl: 'https://connect.uwo24.com',
        androidUrl: '',
        iosUrl: '',
        active: true,
      },
      {
        name: 'EFV™',
        slug: 'efv',
        description: 'Energy & Financial Verification Franchise Portal',
        webUrl: 'https://efv.uwo24.com',
        androidUrl: '',
        iosUrl: '',
        active: true,
      },
      {
        name: 'UWO Corporate™',
        slug: 'uwo',
        description: 'Unified Web Options Corporate Portal & Ecosystem Gateway',
        webUrl: 'https://uwo24.com',
        androidUrl: '',
        iosUrl: '',
        active: true,
      },
    ];

    const createdProducts = [];
    for (const p of uwoProducts) {
      let product = await Product.findOne({ slug: p.slug });
      if (!product) {
        product = await Product.create(p);
        console.log(` Created Referral Product: ${product.name} (${product.slug})`);
      }
      createdProducts.push(product);
    }

    // 3. Pre-generate Demo Links for Demo User if none exist
    const existingLinksCount = await ReferralLink.countDocuments({ user: demoUser._id });
    if (existingLinksCount === 0) {
      for (const product of createdProducts) {
        const code = `demo-${product.slug.slice(0, 8)}`;
        const link = await ReferralLink.create({
          code,
          user: demoUser._id,
          userId: demoUser.userId,
          product: product._id,
          clicks: 3,
        });

        const fallbackUrl = product.webUrl || product.androidUrl || product.iosUrl || 'https://uwo24.com';
        await ClickLog.create([
          {
            referralLink: link._id,
            code: link.code,
            user: demoUser._id,
            product: product._id,
            deviceType: 'desktop',
            targetUrl: product.webUrl || fallbackUrl,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            ip: '127.0.0.1',
            isUnique: true,
          },
          {
            referralLink: link._id,
            code: link.code,
            user: demoUser._id,
            product: product._id,
            deviceType: 'android',
            targetUrl: product.androidUrl || fallbackUrl,
            userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7)',
            ip: '127.0.0.2',
            isUnique: true,
          },
          {
            referralLink: link._id,
            code: link.code,
            user: demoUser._id,
            product: product._id,
            deviceType: 'ios',
            targetUrl: product.iosUrl || fallbackUrl,
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X)',
            ip: '127.0.0.3',
            isUnique: true,
          },
        ]);
      }
      console.log(' Pre-generated demo referral links with click analytics');
    }

    console.log('✅ Referral System seeding completed successfully');
  } catch (err) {
    console.error('❌ Error seeding Referral System:', err.message);
  }
}

module.exports = { seedReferralSystem };
