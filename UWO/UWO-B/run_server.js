const { spawn } = require('child_process');
const path = require('path');

console.log('🛡️ [Supervised Runner] Initializing persistent backend supervisor...');

function start() {
  const serverPath = path.resolve(__dirname, 'server.js');
  const child = spawn(process.execPath, ['--max-old-space-size=4096', serverPath], {
    cwd: __dirname,
    stdio: 'inherit',
    env: process.env
  });

  child.on('exit', (code, signal) => {
    console.warn(`⚠️ [Supervised Runner] Server exited with code: ${code}, signal: ${signal}. Auto-restarting in 2 seconds...`);
    setTimeout(start, 2000);
  });

  child.on('error', (err) => {
    console.error('❌ [Supervised Runner] Failed to spawn server process:', err);
    setTimeout(start, 2000);
  });
}

start();
