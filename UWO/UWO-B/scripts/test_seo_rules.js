const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🔍 RUNNING COMPREHENSIVE SEO & DUPLICATE URL AUDIT');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

function check(testName, condition, detail = '') {
  if (condition) {
    console.log(`✅ PASS: ${testName} ${detail ? '(' + detail + ')' : ''}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName} ${detail ? '(' + detail + ')' : ''}`);
    failed++;
  }
}

// 1. Audit Sitemap XML
const sitemapPath = path.resolve(__dirname, '../../UWO-F/sitemap.xml');
const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const hasHtmlInSitemap = /\.html</.test(sitemap);
check('Sitemap Clean URLs', !hasHtmlInSitemap, 'Zero .html references in sitemap');

const hasOurTeam = sitemap.includes('<loc>https://uwo24.com/our-team</loc>');
check('Sitemap Canonical /our-team', hasOurTeam, 'https://uwo24.com/our-team');

const hasAisa = sitemap.includes('<loc>https://uwo24.com/aisa</loc>');
check('Sitemap Canonical /aisa', hasAisa, 'https://uwo24.com/aisa');

const hasBlogArticle = sitemap.includes('how-to-delete-your-aisa-account');
check('Sitemap Blog Articles Ingested', hasBlogArticle, 'Blog slugs included in sitemap');

// 2. Audit Robots.txt
const robotsPath = path.resolve(__dirname, '../../UWO-F/robots.txt');
const robots = fs.readFileSync(robotsPath, 'utf8');
check('Robots Allows Public Crawling', robots.includes('Allow: /'));
check('Robots Blocks Admin Portal', robots.includes('Disallow: /admin'));
check('Robots Declares Sitemap', robots.includes('Sitemap: https://uwo24.com/sitemap.xml'));

// 3. Audit Admin Portal Disallow
const adminRobotsPath = path.resolve(__dirname, '../../../Unified-Dashboard/frontend/public/robots.txt');
const adminRobots = fs.readFileSync(adminRobotsPath, 'utf8');
check('Admin Subdomain Blocks All Crawlers', adminRobots.includes('Disallow: /'));

const adminIndexHtml = fs.readFileSync(path.resolve(__dirname, '../../../Unified-Dashboard/frontend/index.html'), 'utf8');
check('Admin Index.html contains Noindex Meta Tag', adminIndexHtml.includes('noindex, nofollow, noarchive'));

// 4. Audit React SPA App.jsx
const appJsxPath = path.resolve(__dirname, '../../UWO-F/src/App.jsx');
const appJsx = fs.readFileSync(appJsxPath, 'utf8');
check('App.jsx embeds SEOHead', appJsx.includes('<SEOHead />'));
check('App.jsx redirects /our-team.html', appJsx.includes('path="/our-team.html"') && appJsx.includes('Navigate to="/our-team" replace'));
check('App.jsx redirects /about.html', appJsx.includes('path="/about.html"') && appJsx.includes('Navigate to="/about" replace'));
check('App.jsx redirects /aisa.html', appJsx.includes('path="/aisa.html"') && appJsx.includes('Navigate to="/aisa" replace'));

// 5. Audit Server.js 301 Redirect Logic
const serverPath = path.resolve(__dirname, '../server.js');
const serverContent = fs.readFileSync(serverPath, 'utf8');
check('Server.js has 301 Permanent Redirect for .html paths', serverContent.includes('res.redirect(301,'));

// 6. Audit Static Distribution (dist/)
const distSitemap = fs.existsSync(path.resolve(__dirname, '../../UWO-F/dist/sitemap.xml'));
const distRobots = fs.existsSync(path.resolve(__dirname, '../../UWO-F/dist/robots.txt'));
check('Vite dist/ bundle contains sitemap.xml', distSitemap);
check('Vite dist/ bundle contains robots.txt', distRobots);

console.log('\n====================================================');
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('====================================================');

if (failed > 0) process.exit(1);
