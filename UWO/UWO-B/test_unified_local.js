/**
 * Automated Test Suite for Unified Node.js Backend
 * STRICTLY ISOLATED TO LOCAL MONGODB (mongodb://localhost:27017)
 * NEVER TOUCHES OR MODIFIES LIVE PRODUCTION ATLAS CLUSTERS
 */

process.env.NODE_ENV = 'test';
process.env.TEST_LOCAL_DB = 'true';
process.env.PORT = '8089';
process.env.MONGO_URI = 'mongodb://localhost:27017/uwo_test_db';
process.env.UNIFIED_MONGODB_URI = 'mongodb://localhost:27017/unified_test_db';
process.env.UNIFIED_MONGODB_DB_NAME = 'unified_test_db';
process.env.MONGODB_URL = 'mongodb://localhost:27017/unified_test_db';
process.env.MONGODB_DB_NAME = 'unified_test_db';
process.env.TEST_MONGODB_URI = 'mongodb://localhost:27017/unified_test_db';
process.env.JWT_SECRET = 'test_jwt_secret_key_12345678901234';

const { MongoClient, ObjectId } = require('mongodb');
const http = require('http');

let serverInstance = null;
let client = null;
let testUnifiedDb = null;
let testUwoDb = null;

const BASE_URL = 'http://127.0.0.1:8089';

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json !== null ? json : data
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      const bodyStr = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      if (!options.headers || !options.headers['Content-Type']) {
        req.setHeader('Content-Type', 'application/json');
      }
      req.write(bodyStr);
    }
    req.end();
  });
}

const CAMPAIGN_SLUGS = [
  'ai-legal9',
  'ai-legal8',
  'ai-legal7',
  'ai-legal',
  'ailegall5',
  'ailegall4',
  'ailegall',
  'ailegal_',
  'ailegal'
];

async function seedLocalTestData() {
  console.log('🌱 Seeding local test data in mongodb://localhost:27017/unified_test_db...');
  client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  testUnifiedDb = client.db('unified_test_db');
  testUwoDb = client.db('uwo_test_db');

  // Clean test databases first
  await testUnifiedDb.dropDatabase().catch(() => {});
  await testUwoDb.dropDatabase().catch(() => {});

  // Seed the 9 AI Legal Campaigns
  const now = new Date();
  const campaignDocs = CAMPAIGN_SLUGS.map(slug => ({
    slug,
    campaign_name: `AI-Legal Campaign (${slug})`,
    product_code: 'ailegal',
    platform: 'other',
    target_url: 'https://ailegal.aisa24.com',
    web_url: 'https://ailegal.aisa24.com',
    android_url: 'https://play.google.com/store/apps/details?id=com.uwo.ailegal',
    ios_url: 'https://apps.apple.com/app/id6797449251',
    full_destination_url: 'https://ailegal.aisa24.com',
    short_url: `https://admin.uwo24.com/r/${slug}`,
    status: 'active',
    is_smart_link: true,
    clicks_count: 5,
    installs_count: 2,
    conversions_count: 1,
    created_at: now,
    updated_at: now
  }));
  await testUnifiedDb.collection('marketing_links').insertMany(campaignDocs);

  // Seed test revenue transactions
  await testUnifiedDb.collection('revenue_transactions').insertMany([
    {
      transaction_id: 'tx_local_1',
      provider: 'razorpay',
      product_code: 'ailegal',
      gross_amount: 1499,
      reporting_amount: 1499,
      net_amount: 1469,
      currency: 'INR',
      status: 'completed',
      transaction_date: now
    },
    {
      transaction_id: 'tx_local_2',
      provider: 'cashfree',
      product_code: 'aisa',
      gross_amount: 999,
      reporting_amount: 999,
      net_amount: 979,
      currency: 'INR',
      status: 'completed',
      transaction_date: now
    }
  ]);

  // Seed test marketing clicks & installs
  await testUnifiedDb.collection('marketing_clicks').insertMany([
    {
      slug: 'ai-legal9',
      platform: 'instagram',
      product_id: 'ailegal',
      ip_hash: 'hash_test_1',
      device_type: 'Desktop',
      timestamp: now
    },
    {
      slug: 'ai-legal8',
      platform: 'linkedin',
      product_id: 'ailegal',
      ip_hash: 'hash_test_2',
      device_type: 'Mobile',
      timestamp: now
    }
  ]);

  await testUnifiedDb.collection('marketing_installs').insertMany([
    {
      slug: 'ai-legal9',
      platform: 'android',
      product_id: 'ailegal',
      is_unique: true,
      timestamp: now
    },
    {
      slug: 'ai-legal8',
      platform: 'ios',
      product_id: 'ailegal',
      is_unique: true,
      timestamp: now
    }
  ]);

  // Seed test chat tracking
  await testUnifiedDb.collection('chat_tracking').insertMany([
    {
      session_id: 'sess_test_1',
      app_code: 'ailegal',
      model_name: 'gpt-4o',
      prompt_tokens: 45,
      completion_tokens: 120,
      total_tokens: 165,
      latency_ms: 320,
      user_id: 'user_advocate_1',
      metadata: {
        user_name: 'Adv. Test Counsel',
        user_email: 'counsel@ailegal.app',
        chat_type: 'Cheque Bounce & Financial Debt (Sec 138)',
        case_title: 'Notice for Sec 138 Dishonour',
        client_name: 'Test Client Ltd',
        case_summary: 'Legal drafting for cheque dishonour statutory notice'
      },
      created_at: now
    }
  ]);

  // Seed test Google Play metrics & App Store metrics
  await testUnifiedDb.collection('play_install_metrics').insertOne({
    metric_date: '2026-08-29',
    app_code: 'ailegal',
    dimension_type: 'overview',
    daily_device_installs: 15,
    daily_user_uninstalls: 1,
    installs_on_active_devices: 140,
    total_user_installs: 320
  });

  await testUnifiedDb.collection('app_store_metrics').insertOne({
    metric_date: '2026-08-29',
    app_code: 'ailegal',
    total_downloads: 45,
    first_time_downloads: 40,
    redownloads: 5,
    page_views: 120,
    impressions: 400
  });

  await testUnifiedDb.collection('app_downloads').insertOne({
    app_code: 'ailegal',
    platform: 'android',
    version: '1.0.0',
    created_at: now
  });

  await testUnifiedDb.collection('logs').insertOne({
    level: 'INFO',
    application_id: 'system',
    event: 'store_analytics_sync_started',
    message: 'Store analytics sync started for AISA & AI Legal packages',
    created_at: now
  });

  // Seed test user referral link in uwo_test_db
  const dummyProdId = new ObjectId();
  await testUwoDb.collection('ref_products').insertOne({
    _id: dummyProdId,
    name: 'AI Legal Pro',
    slug: 'ai-legal-pro',
    webUrl: 'https://ailegal.aisa24.com',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.uwo.ailegal',
    iosUrl: 'https://apps.apple.com/app/id6797449251',
    active: true
  });

  const dummyUserId = new ObjectId();
  await testUwoDb.collection('ref_links').insertOne({
    code: 'REF-LOCAL123',
    userId: 'user_test_999',
    user: dummyUserId,
    product: dummyProdId,
    clicks: 10,
    installs: 3,
    conversions: 1
  });

  console.log('✅ Local test data seeded successfully.');
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING UNIFIED NODE.JS BACKEND INTEGRATION TESTS');
  console.log('🔒 Target Database: mongodb://localhost:27017 (ISOLATED)');
  console.log('======================================================\n');

  await seedLocalTestData();

  // Require server after setting env vars
  console.log('🚀 Starting Express server on port 8089...');
  // Ensure server.js exports or starts on process.env.PORT
  require('./server');

  // Wait 1.5s for server to bind
  await new Promise(r => setTimeout(r, 1500));

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Admin Login & Stats
    console.log('\n[1] Testing Admin Subsystem (/api/admin)...');
    const loginRes = await request('/api/admin/login', {
      method: 'POST',
      body: { username: 'admin@uwo.com', password: 'uwo@1234' }
    });
    assert(loginRes.status === 200, `Admin Login HTTP 200 (Got ${loginRes.status})`);
    assert(loginRes.data && loginRes.data.access_token, 'Admin Login returned JWT access_token');
    const adminToken = loginRes.data ? loginRes.data.access_token : '';

    const statsRes = await request('/api/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(statsRes.status === 200, `Admin Stats HTTP 200 (Got ${statsRes.status})`);
    assert(statsRes.data && statsRes.data.currency === 'INR', 'Admin Stats returned currency INR');
    assert(statsRes.data && typeof statsRes.data.total_revenue === 'number', `Admin Stats revenue computed: ₹${statsRes.data?.total_revenue}`);

    // 2. Marketing Config & Links
    console.log('\n[2] Testing Marketing Campaigns Subsystem (/api/marketing)...');
    const configRes = await request('/api/marketing/config');
    assert(configRes.status === 200, `Marketing Config HTTP 200 (Got ${configRes.status})`);
    assert(configRes.data && configRes.data.products && configRes.data.products.ailegal, 'Marketing Config has AI-Legal product catalog');

    const linksRes = await request('/api/marketing/links');
    assert(linksRes.status === 200, `Marketing Links HTTP 200 (Got ${linksRes.status})`);
    assert(Array.isArray(linksRes.data) && linksRes.data.length >= 9, `Marketing Links returned ${linksRes.data?.length} campaign links`);
    const aiLegal9Link = linksRes.data.find(l => l.slug === 'ai-legal9');
    assert(aiLegal9Link && aiLegal9Link.is_active === true, 'Marketing Link ai-legal9 has is_active: true');
    assert(aiLegal9Link && aiLegal9Link.status === 'active', 'Marketing Link ai-legal9 has status: active');
    assert(aiLegal9Link && aiLegal9Link.clicks_count === 5, `Marketing Link ai-legal9 clicks_count is 5 (Got ${aiLegal9Link?.clicks_count})`);

    const summaryRes = await request('/api/marketing/analytics/summary');
    assert(summaryRes.status === 200, `Marketing Analytics Summary HTTP 200 (Got ${summaryRes.status})`);
    assert(summaryRes.data && typeof summaryRes.data.total_clicks === 'number', `Marketing Summary clicks: ${summaryRes.data?.total_clicks}`);
    assert(summaryRes.data && summaryRes.data.unique_reach >= 1, `Marketing Summary unique_reach: ${summaryRes.data?.unique_reach}`);
    assert(summaryRes.data && summaryRes.data.total_downloads >= 1, `Marketing Summary total_downloads: ${summaryRes.data?.total_downloads}`);
    assert(summaryRes.data && summaryRes.data.top_channel, `Marketing Summary top_channel: ${summaryRes.data?.top_channel}`);
    assert(summaryRes.data && summaryRes.data.best_post, `Marketing Summary best_post: ${summaryRes.data?.best_post}`);

    const userRefSummaryRes = await request('/api/marketing/user-referrals/summary');
    assert(userRefSummaryRes.status === 200, `User Referrals Summary HTTP 200 (Got ${userRefSummaryRes.status})`);
    assert(userRefSummaryRes.data && userRefSummaryRes.data.total_links >= 1, `User Referrals Summary total_links: ${userRefSummaryRes.data?.total_links}`);

    const userRefLinksRes = await request('/api/marketing/user-referrals/links');
    assert(userRefLinksRes.status === 200, `User Referrals Links HTTP 200 (Got ${userRefLinksRes.status})`);
    assert(Array.isArray(userRefLinksRes.data) && userRefLinksRes.data.length >= 1, `User Referrals Links list length: ${userRefLinksRes.data?.length}`);
    const localUserLink = userRefLinksRes.data.find(l => l.code === 'REF-LOCAL123');
    assert(localUserLink && localUserLink.product && localUserLink.product.name === 'AI Legal Pro', 'User Referral Link has populated product name "AI Legal Pro"');

    // 2.1 Unified Analytics Subsystem
    console.log('\n[2.1] Testing Unified Analytics Subsystem (/api/admin/unified-analytics)...');
    const uOverviewRes = await request('/api/admin/unified-analytics/overview', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(uOverviewRes.status === 200, `Unified Analytics Overview HTTP 200 (Got ${uOverviewRes.status})`);
    assert(uOverviewRes.data && uOverviewRes.data.total_active_users >= 1, `Overview total_active_users: ${uOverviewRes.data?.total_active_users}`);
    assert(uOverviewRes.data && uOverviewRes.data.total_web_pageviews >= 1, `Overview total_web_pageviews: ${uOverviewRes.data?.total_web_pageviews}`);
    assert(uOverviewRes.data && Array.isArray(uOverviewRes.data.daily_timeline) && uOverviewRes.data.daily_timeline.length === 30, 'Overview daily_timeline has 30 data points');

    const uWebRes = await request('/api/admin/unified-analytics/web', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(uWebRes.status === 200, `Unified Analytics Web HTTP 200 (Got ${uWebRes.status})`);
    assert(uWebRes.data && uWebRes.data.total_pageviews >= 1, `Web Analytics total_pageviews: ${uWebRes.data?.total_pageviews}`);

    const uGcpRes = await request('/api/admin/unified-analytics/backend-monitoring', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(uGcpRes.status === 200, `Unified Analytics GCP Monitoring HTTP 200 (Got ${uGcpRes.status})`);
    assert(uGcpRes.data && uGcpRes.data.status === 'healthy', 'GCP Monitoring status is "healthy"');

    // 2.2 Google Play & App Downloads Subsystem (/api/admin/analytics/google-play)
    console.log('\n[2.2] Testing Google Play & App Store Downloads Subsystem (/api/admin/analytics/google-play)...');
    const gpOverviewRes = await request('/api/admin/analytics/google-play/overview?app_codes=ailegal', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(gpOverviewRes.status === 200, `Google Play Overview HTTP 200 (Got ${gpOverviewRes.status})`);
    assert(gpOverviewRes.data && gpOverviewRes.data.data && gpOverviewRes.data.data.combined && gpOverviewRes.data.data.combined.total_user_installs_latest >= 1, 'Google Play combined total installs >= 1');
    assert(gpOverviewRes.data && gpOverviewRes.data.data && gpOverviewRes.data.data.apps && gpOverviewRes.data.data.apps.length >= 1, 'Google Play returned app data for AI Legal');

    const gpTsRes = await request('/api/admin/analytics/google-play/timeseries?app_codes=ailegal&metric=total_installs', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(gpTsRes.status === 200, `Google Play Timeseries HTTP 200 (Got ${gpTsRes.status})`);
    assert(gpTsRes.data && gpTsRes.data.data && Array.isArray(gpTsRes.data.data.android) && gpTsRes.data.data.android.length >= 1, 'Google Play Android timeseries array populated');

    // 2.3 Central Logs Subsystem (/api/admin/logs)
    console.log('\n[2.3] Testing Central Logs Subsystem (/api/admin/logs)...');
    const adminLogsRes = await request('/api/admin/logs?level=INFO', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(adminLogsRes.status === 200, `Central Admin Logs HTTP 200 (Got ${adminLogsRes.status})`);
    assert(Array.isArray(adminLogsRes.data) && adminLogsRes.data.length >= 1, `Central Admin Logs count >= 1 (Got ${adminLogsRes.data?.length})`);

    // 3. Revenue Overview & All Sub-routes
    console.log('\n[3] Testing Revenue Subsystem (/api/admin/revenue & /api/revenue)...');
    const adminRevRes = await request('/api/admin/revenue/overview?period=30d', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(adminRevRes.status === 200, `Admin Revenue Overview HTTP 200 (Got ${adminRevRes.status})`);
    assert(adminRevRes.data && adminRevRes.data.gross_revenue >= 2498, `Admin Revenue Overview GMV: ₹${adminRevRes.data?.gross_revenue}`);
    assert(adminRevRes.data && typeof adminRevRes.data.growth_pct === 'number', 'Admin Revenue Overview has growth_pct');

    const revProductsRes = await request('/api/admin/revenue/products?period=30d', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(revProductsRes.status === 200, `Admin Revenue Products HTTP 200 (Got ${revProductsRes.status})`);
    assert(revProductsRes.data && Array.isArray(revProductsRes.data.products) && revProductsRes.data.products.length >= 1, 'Revenue products breakdown populated');

    const revProvidersRes = await request('/api/admin/revenue/providers?period=30d', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(revProvidersRes.status === 200, `Admin Revenue Providers HTTP 200 (Got ${revProvidersRes.status})`);
    assert(revProvidersRes.data && Array.isArray(revProvidersRes.data.providers), 'Revenue providers breakdown populated');

    const revPlatformsRes = await request('/api/admin/revenue/platforms?period=30d', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(revPlatformsRes.status === 200, `Admin Revenue Platforms HTTP 200 (Got ${revPlatformsRes.status})`);
    assert(revPlatformsRes.data && Array.isArray(revPlatformsRes.data.platforms), 'Revenue platforms breakdown populated');

    const revTrendRes = await request('/api/admin/revenue/trend?period=30d', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(revTrendRes.status === 200, `Admin Revenue Trend HTTP 200 (Got ${revTrendRes.status})`);
    assert(revTrendRes.data && Array.isArray(revTrendRes.data.data), 'Revenue trend data points populated');

    const revTxRes = await request('/api/admin/revenue/transactions?page=1&page_size=25', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(revTxRes.status === 200, `Admin Revenue Transactions HTTP 200 (Got ${revTxRes.status})`);
    assert(revTxRes.data && revTxRes.data.total_count >= 2, `Admin Revenue total_count: ${revTxRes.data?.total_count}`);

    const revHealthRes = await request('/api/admin/revenue/health', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(revHealthRes.status === 200, `Admin Revenue Health HTTP 200 (Got ${revHealthRes.status})`);
    assert(revHealthRes.data && Array.isArray(revHealthRes.data.providers), 'Revenue health providers populated');

    const revReconRes = await request('/api/admin/revenue/reconciliation', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(revReconRes.status === 200, `Admin Revenue Reconciliation HTTP 200 (Got ${revReconRes.status})`);
    assert(revReconRes.data && Array.isArray(revReconRes.data.items), 'Revenue reconciliation items populated');

    const revSyncRes = await request('/api/admin/revenue/sync', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { provider: 'all', product_code: 'all' }
    });
    assert(revSyncRes.status === 200, `Admin Revenue Sync HTTP 200 (Got ${revSyncRes.status})`);
    assert(revSyncRes.data && revSyncRes.data.success === true, 'Revenue Sync returned success: true');

    // 4. Applications Keys
    console.log('\n[4] Testing Applications Subsystem (/api/applications)...');
    const createKeyRes = await request('/api/applications/keys', {
      method: 'POST',
      body: { application_name: 'AI Legal Child App', app_code: 'ailegal' }
    });
    assert(createKeyRes.status === 201, `Create Application Key HTTP 201 (Got ${createKeyRes.status})`);
    assert(createKeyRes.data && createKeyRes.data.api_key && createKeyRes.data.api_key.startsWith('key_'), 'Generated secure key_ prefix API key');

    const listKeysRes = await request('/api/applications/keys');
    assert(listKeysRes.status === 200, `List Application Keys HTTP 200 (Got ${listKeysRes.status})`);

    // 5. Telemetry & AI Chat Tracking
    console.log('\n[5] Testing Telemetry & AI Chat Tracking Subsystem (/api/telemetry)...');
    const telRes = await request('/api/telemetry/overview?app_code=ailegal');
    assert(telRes.status === 200, `Telemetry Overview HTTP 200 (Got ${telRes.status})`);
    assert(telRes.data && telRes.data.total_prompts >= 1, `Telemetry total_prompts: ${telRes.data?.total_prompts}`);
    assert(telRes.data && telRes.data.total_tokens >= 1, `Telemetry total_tokens: ${telRes.data?.total_tokens}`);
    assert(telRes.data && Array.isArray(telRes.data.users_tracking) && telRes.data.users_tracking.length >= 1, 'Telemetry users_tracking list populated');
    assert(telRes.data && Array.isArray(telRes.data.timeline) && telRes.data.timeline.length >= 1, 'Telemetry timeline data points populated');
    assert(telRes.data && Array.isArray(telRes.data.recent_sessions), 'Telemetry recent_sessions populated');

    const telSyncRes = await request('/api/telemetry/sync', { method: 'POST' });
    assert(telSyncRes.status === 200, `Telemetry Sync HTTP 200 (Got ${telSyncRes.status})`);
    assert(telSyncRes.data && telSyncRes.data.success === true, 'Telemetry Sync returned success: true');

    const logRes = await request('/api/logs', {
      method: 'POST',
      body: { level: 'INFO', event: 'TEST_EVENT', message: 'Local test log event' }
    });
    assert(logRes.status === 201, `Ingest Log HTTP 201 (Got ${logRes.status})`);

    const payRes = await request('/api/payment/create', {
      method: 'POST',
      body: { amount: 499, currency: 'INR', plan_id: 'pro' }
    });
    assert(payRes.status === 201, `Payment Create HTTP 201 (Got ${payRes.status})`);
    assert(payRes.data && payRes.data.order_id, `Created order: ${payRes.data?.order_id}`);

    // 6. VERIFY ALL 9 CAMPAIGN REDIRECTION URLS (CRITICAL REQUIREMENT)
    console.log('\n[6] Testing ALL 9 Campaign URLs (/r/:slug) & User Referrals...');
    for (const slug of CAMPAIGN_SLUGS) {
      // Test Desktop Redirection (Expect 302 to https://ailegal.aisa24.com)
      const resDesktop = await request(`/r/${slug}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      assert(
        resDesktop.status === 302 && resDesktop.headers.location === 'https://ailegal.aisa24.com',
        `Campaign /r/${slug} (Desktop) -> HTTP 302 to https://ailegal.aisa24.com`
      );

      // Test Android Redirection (Expect 302 to Google Play with referrer)
      const resAndroid = await request(`/r/${slug}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7)' }
      });
      assert(
        resAndroid.status === 302 && resAndroid.headers.location.includes('play.google.com/store/apps/details?id=com.uwo.ailegal'),
        `Campaign /r/${slug} (Android) -> HTTP 302 to Google Play Store`
      );

      // Test iOS Redirection (Expect 302 to Apple App Store)
      const resIos = await request(`/r/${slug}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)' }
      });
      assert(
        resIos.status === 302 && resIos.headers.location.includes('apps.apple.com/app/id6797449251'),
        `Campaign /r/${slug} (iOS) -> HTTP 302 to Apple App Store 6797449251`
      );

      // Test JSON resolution
      const resJson = await request(`/r/${slug}?format=json`);
      assert(
        resJson.status === 200 && resJson.data && resJson.data.success === true,
        `Campaign /r/${slug} (?format=json) -> HTTP 200 valid JSON resolution`
      );
    }

    // 7. Test User Referral Code resolution
    const refJson = await request('/r/REF-LOCAL123?format=json');
    assert(
      refJson.status === 200 && refJson.data && refJson.data.code === 'REF-LOCAL123',
      'User Referral Code /r/REF-LOCAL123 resolved successfully with format=json'
    );

    // 8. Clean up local test databases
    console.log('\n🧹 Cleaning up local test databases...');
    await testUnifiedDb.dropDatabase().catch(() => {});
    await testUwoDb.dropDatabase().catch(() => {});
    if (client) await client.close();

    console.log('\n======================================================');
    console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('🔒 Zero modifications were made to live production databases.');
    console.log('======================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('💥 Test execution error:', err);
    if (client) await client.close().catch(() => {});
    process.exit(1);
  }
}

runTests();
