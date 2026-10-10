-- Migration 001 Rollback: Drop UWO Central Wallet Foundation Tables
-- DOWN Migration

DROP TABLE IF EXISTS refund_records CASCADE;
DROP TABLE IF EXISTS idempotency_records CASCADE;
DROP TABLE IF EXISTS outbox_events CASCADE;
DROP TABLE IF EXISTS payment_webhook_events CASCADE;
DROP TABLE IF EXISTS wallet_holds CASCADE;
DROP TABLE IF EXISTS wallet_quotes CASCADE;
DROP TABLE IF EXISTS topup_orders CASCADE;
DROP TABLE IF EXISTS wallet_ledger CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DELETE FROM schema_migrations WHERE name = '001_create_wallet_tables.sql';
