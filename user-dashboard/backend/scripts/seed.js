const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/User');
const Product = require('../src/models/Product');
const ReferralLink = require('../src/models/ReferralLink');
const ClickLog = require('../src/models/ClickLog');

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/referral_db';
  console.log('🔄 Connecting to MongoDB at:', uri);

  try {
    await mongoose.connect(uri);
    console.log(' Connected to MongoDB.');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }

  // 1. Create Demo User
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
    console.log(` Created Demo User: ${demoUser.name} (${demoUser.userId})`);
  } else {
    demoUser.password = hashedPassword;
    demoUser.userId = demoUserId;
    // Remove role if it exists on existing document
    demoUser.set('role', undefined, { strict: false });
    await demoUser.save();
    console.log(` Updated Demo User: ${demoUser.email}`);
  }

  // 2. Remove legacy demo dummy products if present
  await Product.deleteMany({ slug: { $in: ['saas-platform', 'crypto-wallet', 'fitness-tracker'] } });

  // 3. Create Official UWO Ecosystem Products
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
      androidUrl: 'https://play.google.com/store/apps/details?id=com.uwo.ailegal',
      iosUrl: 'https://apps.apple.com/app/ai-legal/id6797449251',
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
      console.log(` Created Product: ${product.name} (${product.slug})`);
    } else {
      product.name = p.name;
      product.description = p.description;
      product.webUrl = p.webUrl;
      product.androidUrl = p.androidUrl;
      product.iosUrl = p.iosUrl;
      product.active = true;
      await product.save();
      console.log(`ℹ️ Updated Product: ${product.name} (${product.slug})`);
    }
    createdProducts.push(product);
  }

  // 3. Pre-generate Referral Links for Demo User
  for (const product of createdProducts) {
    let link = await ReferralLink.findOne({ user: demoUser._id, product: product._id });
    const code = `demo-${product.slug.slice(0, 8)}`;
    if (!link) {
      link = await ReferralLink.create({
        code,
        user: demoUser._id,
        userId: demoUser.userId,
        product: product._id,
        clicks: 3,
      });
      console.log(` Generated Referral Link: Code "${code}"`);

      // Add sample click analytics
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
  }

  // Clean any remaining role fields in MongoDB users collection
  await mongoose.connection.collection('users').updateMany({}, { $unset: { role: '' } });

  console.log('\n====================================================');
  console.log('🎉 SEEDING COMPLETED (NO ROLES)');
  console.log('====================================================');
  console.log('📋 DEMO LOGIN CREDENTIALS:');
  console.log(`   User ID:   ${demoUserId}`);
  console.log(`   Email:     ${demoEmail}`);
  console.log(`   Password:  ${demoPasswordPlain}`);
  console.log('====================================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed();
