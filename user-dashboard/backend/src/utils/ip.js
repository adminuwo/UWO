/**
 * Bulletproof client IP extractor supporting:
 * - Cloudflare (cf-connecting-ip)
 * - Nginx / Reverse Proxies (x-real-ip, x-forwarded-for)
 * - Standard Node/Express sockets (req.ip, req.socket.remoteAddress)
 */
function getClientIp(req) {
  // 1. Cloudflare header
  if (req.headers['cf-connecting-ip']) {
    return req.headers['cf-connecting-ip'].trim();
  }

  // 2. Standard reverse proxy header
  if (req.headers['x-real-ip']) {
    return req.headers['x-real-ip'].trim();
  }

  // 3. X-Forwarded-For (comma-separated list, first element is client)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = forwarded.split(',').map((s) => s.trim());
    if (ips[0]) {
      return ips[0].replace('::ffff:', '');
    }
  }

  // 4. Express req.ip (when trust proxy is enabled) or raw socket
  const ip = req.ip || req.socket?.remoteAddress || '127.0.0.1';
  return ip.replace('::ffff:', '').trim();
}

module.exports = { getClientIp };
