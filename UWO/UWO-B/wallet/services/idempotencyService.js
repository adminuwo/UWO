'use strict';

const crypto = require('crypto');
const { query } = require('../db/pool');

/**
 * Hash a request body/params to detect conflicting payloads for the same idempotency key.
 */
function hashRequest(data) {
  const serialized = typeof data === 'string' ? data : JSON.stringify(data || {});
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

/**
 * Check if an idempotency key was previously processed.
 * Returns { cached: true, statusCode, responseBody } if cached.
 * Returns { cached: false } if new.
 * Throws IDEMPOTENCY_CONFLICT if key exists but payload hash doesn't match.
 */
async function checkIdempotency(scope, key, requestPayload, client = null) {
  if (!key) return { cached: false };

  const requestHash = hashRequest(requestPayload);
  const sql = `
    SELECT request_hash, status_code, response_body, expires_at
    FROM idempotency_records
    WHERE scope = $1 AND idempotency_key = $2;
  `;
  const runner = client ? client.query.bind(client) : query;
  const { rows } = await runner(sql, [scope, key]);

  if (rows.length === 0) {
    return { cached: false, requestHash };
  }

  const record = rows[0];
  if (record.request_hash !== requestHash) {
    const err = new Error(
      `IDEMPOTENCY_CONFLICT: Idempotency key "${key}" was already used with different request parameters.`
    );
    err.code = 'IDEMPOTENCY_CONFLICT';
    err.status = 409;
    throw err;
  }

  return {
    cached: true,
    statusCode: record.status_code,
    responseBody: record.response_body,
  };
}

/**
 * Record an idempotent response.
 */
async function recordIdempotency(scope, key, requestPayload, statusCode, responseBody, client = null, ttlHours = 24) {
  if (!key) return;

  const requestHash = hashRequest(requestPayload);
  const expiresAt = new Date(Date.now() + ttlHours * 3600 * 1000);

  const sql = `
    INSERT INTO idempotency_records (scope, idempotency_key, request_hash, status_code, response_body, expires_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (scope, idempotency_key) DO UPDATE
    SET status_code = EXCLUDED.status_code,
        response_body = EXCLUDED.response_body,
        expires_at = EXCLUDED.expires_at;
  `;
  const runner = client ? client.query.bind(client) : query;
  await runner(sql, [scope, key, requestHash, statusCode, JSON.stringify(responseBody), expiresAt]);
}

module.exports = {
  hashRequest,
  checkIdempotency,
  recordIdempotency,
};
