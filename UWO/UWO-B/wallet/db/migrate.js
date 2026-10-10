'use strict';

const fs = require('fs');
const path = require('path');
const { pool, withTransaction } = require('./pool');

const MIGRATIONS_DIR = path.resolve(__dirname, 'migrations');

async function runMigrations(direction = 'up') {
  console.log(`[UWO-B Wallet Migration] Running migrations: ${direction.toUpperCase()}...`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  if (direction === 'up') {
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql') && !f.endsWith('.down.sql'))
      .sort();

    for (const file of files) {
      const { rows } = await pool.query(
        'SELECT 1 FROM schema_migrations WHERE name = $1',
        [file]
      );
      if (rows.length > 0) {
        console.log(`  [SKIP] Migration already applied: ${file}`);
        continue;
      }

      console.log(`  [APPLYING] Migration: ${file}`);
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

      await withTransaction(async (client) => {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
      });
      console.log(`  [APPLIED] Migration successfully applied: ${file}`);
    }
  } else if (direction === 'down') {
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.down.sql'))
      .sort()
      .reverse();

    for (const file of files) {
      const upFile = file.replace('.down.sql', '.sql');
      console.log(`  [ROLLING BACK] Migration: ${upFile} using ${file}`);
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

      await withTransaction(async (client) => {
        await client.query(sql);
        await client.query('DELETE FROM schema_migrations WHERE name = $1', [upFile]);
      });
      console.log(`  [ROLLED BACK] Migration successfully rolled back: ${upFile}`);
    }
  }
  console.log('[UWO-B Wallet Migration] Finished.');
}

if (require.main === module) {
  const direction = process.argv[2] === 'down' ? 'down' : 'up';
  runMigrations(direction)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[UWO-B Wallet Migration Error]', err);
      process.exit(1);
    });
}

module.exports = {
  runMigrations,
};
