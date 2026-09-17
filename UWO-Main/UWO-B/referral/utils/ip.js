function getClientIp(req) {
  const cfConnectingIp = req.headers['cf-connecting-ip'];
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  const xRealIp = req.headers['x-real-ip'];
  if (xRealIp) {
    return xRealIp.trim();
  }

  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    const list = xForwardedFor.split(',');
    const clientIp = list[0].trim();
    if (clientIp) {
      return clientIp.replace(/^::ffff:/, '');
    }
  }

  let rawIp =
    req.ip ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress ||
    '127.0.0.1';

  if (rawIp.startsWith('::ffff:')) {
    rawIp = rawIp.replace('::ffff:', '');
  }

  if (rawIp === '::1') {
    rawIp = '127.0.0.1';
  }

  return rawIp;
}

module.exports = { getClientIp };
