const Product = require('../models/RefProduct');

async function seedReferralSystem() {
  try {
    console.log('🔄 Checking & seeding Referral Portal data...');

    // 1. Ensure Official Ecosystem Products exist in RefProduct
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
      {
        name: 'AI-Education™',
        slug: 'aieducation',
        description: 'Unified Enterprise Digital Campus & AI Collaboration Operating System',
        webUrl: 'https://education.uwo24.com',
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

    console.log('✅ Referral System ecosystem products verified successfully');
  } catch (err) {
    console.error('❌ Error seeding Referral System:', err.message);
  }
}

module.exports = { seedReferralSystem };
