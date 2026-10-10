'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-this-in-production-32-bytes';
const WALLET_SERVICE_SECRET = process.env.WALLET_SERVICE_SECRET || 'uwo_internal_wallet_service_secret_2026';

/**
 * Registered app backends in the UWO ecosystem.
 */
const REGISTERED_APPS = new Set([
  'aisa',
  'ai_legal',
  'ai_ads',
  'efv',
  'ai_mall',
  'uwoconnect',
  'yugamc',
  'studio',
  'flowai',
  'unified_dashboard',
]);

/**
 * Middleware: Verify end-user Bearer token.
 * Extracts canonical uwo_user_id.
 */
function requireUserAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Bearer authentication token is required.',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.sub || decoded.id || decoded.userId;
    if (!userId) {
      return res.status(401).json({
        error: 'INVALID_TOKEN_PAYLOAD',
        message: 'Token does not contain a canonical user identifier.',
      });
    }

    req.uwo_user_id = String(userId);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'INVALID_OR_EXPIRED_TOKEN',
      message: err.message,
    });
  }
}

/**
 * Middleware: Verify trusted server-to-server service requests from downstream app backends.
 * Enforces registered app scope and valid service key.
 */
function requireServiceAuth(req, res, next) {
  const serviceKey = req.headers['x-service-key'];
  const appId = req.headers['x-app-id'];

  if (!serviceKey || serviceKey !== WALLET_SERVICE_SECRET) {
    return res.status(403).json({
      error: 'INVALID_SERVICE_KEY',
      message: 'Trusted server-to-server credentials are required.',
    });
  }

  if (appId && !REGISTERED_APPS.has(appId)) {
    return res.status(403).json({
      error: 'UNREGISTERED_APP',
      message: `App ID "${appId}" is not registered in the UWO wallet ecosystem.`,
    });
  }

  req.app_id = appId || 'uwo_system';
  next();
}

/**
 * Middleware: Authenticates either User Auth or Service Auth with user delegation (X-User-Id).
 */
function requireUserOrDelegatedServiceAuth(req, res, next) {
  const serviceKey = req.headers['x-service-key'];
  const authHeader = req.headers.authorization;

  // Case 1: Service auth with delegated user context
  if (serviceKey && serviceKey === WALLET_SERVICE_SECRET) {
    const delegatedUserId = req.headers['x-user-id'] || req.body?.uwo_user_id;
    if (!delegatedUserId) {
      return res.status(400).json({
        error: 'MISSING_USER_CONTEXT',
        message: 'Delegated server-to-server request must specify X-User-Id header.',
      });
    }
    req.uwo_user_id = String(delegatedUserId);
    req.app_id = req.headers['x-app-id'] || 'service';
    return next();
  }

  // Case 2: Direct user bearer token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return requireUserAuth(req, res, next);
  }

  return res.status(401).json({
    error: 'UNAUTHORIZED',
    message: 'Either valid Bearer token or trusted Service credentials required.',
  });
}

module.exports = {
  REGISTERED_APPS,
  requireUserAuth,
  requireServiceAuth,
  requireUserOrDelegatedServiceAuth,
};
