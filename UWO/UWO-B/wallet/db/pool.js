'use strict';

const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const connectionString =
  process.env.NODE_ENV === 'test' && process.env.DATABASE_TEST_URL
    ? process.env.DATABASE_TEST_URL
    : process.env.DATABASE_URL || 'postgresql://postgres@127.0.0.1:5433/uwo_wallet';

const { parse } = require('pg-connection-string');
const dbConfig = parse(connectionString);
const isCloudDb = connectionString.includes('sslmode=') || connectionString.includes('neon.tech') || process.env.NODE_ENV === 'production';

const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port ? parseInt(dbConfig.port, 10) : 5432,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password,
  ssl: isCloudDb ? { rejectUnauthorized: false } : undefined,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('[UWO-B PostgreSQL Pool Error]', err.message);
});

/**
 * Execute a callback inside an atomic transaction.
 * Automatically performs BEGIN, COMMIT, or ROLLBACK.
 *
 * @param {Function} callback - async (client) => Promise<any>
 * @returns {Promise<any>}
 */
async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rbErr) {
      console.error('[UWO-B DB] Rollback error:', rbErr.message);
    }
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Execute a single query against the pool.
 */
async function query(text, params) {
  return pool.query(text, params);
}

module.exports = {
  pool,
  query,
  withTransaction,
  connectionString,
};
