const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.REFERRAL_JWT_SECRET || process.env.JWT_SECRET || 'supersecret_referral_jwt_key_982341';

function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
}

function generateUserId() {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `USR-${randomNum}`;
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let pass = '';
  for (let i = 0; i < 8; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const suffix = Math.floor(10 + Math.random() * 89);
  return `${pass}${suffix}`;
}

module.exports = {
  protect,
  generateUserId,
  generatePassword,
  JWT_SECRET,
};
