import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawTarget = env.VITE_API_URL || env.VITE_PROXY_TARGET || 'http://127.0.0.1:8080';
  // Ensure IPv4 is used on Windows Node to avoid IPv6 ::1 ECONNREFUSED issues
  const proxyTarget = rawTarget.replace('://localhost:', '://127.0.0.1:');

  return {
    plugins: [react()],
    base: './',

    server: {
      port: 5174,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', (err, req, res) => {
              if (res && !res.headersSent && typeof res.writeHead === 'function') {
                if (req.url && req.url.includes('.js')) {
                  res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
                  res.end('/* [vite proxy] backend starting or offline - tracker script placeholder */');
                } else {
                  res.writeHead(503, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Backend server (port 8080) is starting or unreachable.', detail: err.message }));
                }
              }
            });
          },
        },
        '/r': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
        '/ref': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});

