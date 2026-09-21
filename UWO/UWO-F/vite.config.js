import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// List of static asset filenames/prefixes served from UWO-F project root
const STATIC_ROOT_FILES = [
  'style.css', 'earn-refer.css', 'chatbot.css', 'aisa.css',
  'sitemap.xml', 'robots.txt', '_redirects',
  'google27f774e9585475b4.html',
];
const STATIC_ROOT_DIRS = ['images', 'uploads', 'aisa-connect'];

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-static-root',
      configureServer(server) {
        const projectRoot = path.resolve(__dirname);

        // Serve static assets from UWO-F root (CSS, images, etc.)
        // WITHOUT exposing src/ or node_modules/ as raw files
        server.middlewares.use((req, res, next) => {
          const urlPath = (req.url || '').split('?')[0].replace(/^\//, '');
          const topSegment = urlPath.split('/')[0];

          const isStaticFile = STATIC_ROOT_FILES.includes(urlPath);
          const isStaticDir = STATIC_ROOT_DIRS.includes(topSegment);

          if (isStaticFile || isStaticDir) {
            const filePath = path.join(projectRoot, urlPath);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath).toLowerCase();
              const mimeTypes = {
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.webp': 'image/webp',
                '.svg': 'image/svg+xml',
                '.gif': 'image/gif',
                '.ico': 'image/x-icon',
                '.xml': 'application/xml',
                '.html': 'text/html',
              };
              res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
              res.setHeader('Cache-Control', 'no-cache');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          }
          next();
        });

        // SPA fallback — serve index.html for all React routes
        server.middlewares.use((req, res, next) => {
          const spaRoutes = [
            '/our-team', '/our-team.html',
            '/about', '/about.html',
            '/blogs', '/blogs.html',
            '/contact', '/contact.html',
            '/aisa', '/aisa.html',
            '/efv', '/efv.html',
            '/blog-single', '/blog-single.html',
            '/partner-login', '/partner-login.html',
            '/partner-dashboard', '/partner-dashboard.html',
          ];
          const urlPath = req.url ? req.url.split('?')[0] : '';
          if (spaRoutes.includes(urlPath) || urlPath.startsWith('/blogs/')) {
            req.url = '/index.html' + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 3000,
    host: true,
    strictPort: false,
  },
});

