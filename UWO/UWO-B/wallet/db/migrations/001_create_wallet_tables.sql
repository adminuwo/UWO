-- Migration 001: Create UWO Central Wallet Foundation Tables
-- UP Migration

CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1. Central Wallets table
CREATE TABLE IF NOT EXISTS wallets (
    wallet_id VARCHAR(64) PRIMARY KEY,
    uwo_user_id VARCHAR(128) NOT NULL UNIQUE,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    cash_balance_paise BIGINT NOT NULL DEFAULT 0 CHECK (cash_balance_paise >= 0),
    promo_balance_paise BIGINT NOT NULL DEFAULT 0 CHECK (promo_balance_paise >= 0),
    locked_cash_paise BIGINT NOT NULL DEFAULT 0 CHECK (locked_cash_paise >= 0),
    locked_promo_paise BIGINT NOT NULL DEFAULT 0 CHECK (locked_promo_paise >= 0),
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_cash_locked CHECK (locked_cash_paise <= cash_balance_paise),
    CONSTRAINT chk_promo_locked CHECK (locked_promo_paise <= promo_balance_paise)
);

CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets(uwo_user_id);

-- 2. Immutable Ledger table
CREATE TABLE IF NOT EXISTS wallet_ledger (
    ledger_id VARCHAR(64) PRIMARY KEY,
    wallet_id VARCHAR(64) NOT NULL REFERENCES wallets(wallet_id),
    uwo_user_id VARCHAR(128) NOT NULL,
    direction VARCHAR(16) NOT NULL, -- CREDIT, DEBIT
    type VARCHAR(32) NOT NULL,      -- TOPUP, PURCHASE, REFUND, PROMO_GRANT, HOLD_CAPTURE, ADJUSTMENT
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    cash_amount_paise BIGINT NOT NULL DEFAULT 0 CHECK (cash_amount_paise >= 0),
    promo_amount_paise BIGINT NOT NULL DEFAULT 0 CHECK (promo_amount_paise >= 0),
    reference_type VARCHAR(64) NOT NULL, -- TOPUP_ORDER, HOLD, REFUND, MANUAL
    reference_id VARCHAR(128) NOT NULL,
    app_id VARCHAR(64) NOT NULL,
    purchase_id VARCHAR(128),
    idempotency_key VARCHAR(128),
    trace_id VARCHAR(128) NOT NULL,
    actor VARCHAR(128) NOT NULL,    -- SYSTEM, USER, ADMIN, GATEWAY
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ledger_wallet_date ON wallet_ledger(wallet_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ledger_user_date ON wallet_ledger(uwo_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ledger_ref ON wallet_ledger(reference_type, reference_id);

-- 3. Top-up Orders table
CREATE TABLE IF NOT EXISTS topup_orders (
    topup_order_id VARCHAR(64) PRIMARY KEY,
    wallet_id VARCHAR(64) NOT NULL REFERENCES wallets(wallet_id),
    uwo_user_id VARCHAR(128) NOT NULL,
    app_id VARCHAR(64) NOT NULL,
    gateway_order_id VARCHAR(128) UNIQUE,
    gateway_payment_id VARCHAR(128) UNIQUE,
    expected_cash_amount_paise BIGINT NOT NULL CHECK (expected_cash_amount_paise > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    status VARCHAR(32) NOT NULL DEFAULT 'CREATED', -- CREATED, PAID, FULFILLED, FAILED, EXPIRED
    idempotency_key VARCHAR(128) NOT NULL,
    fulfillment_source VARCHAR(32), -- WEBHOOK, RECONCILIATION, VERIFY_FALLBACK
    trace_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_topup_wallet_status ON topup_orders(wallet_id, status);
CREATE INDEX IF NOT EXISTS idx_topup_gateway_order ON topup_orders(gateway_order_id);
CREATE INDEX IF NOT EXISTS idx_topup_idempotency ON topup_orders(uwo_user_id, idempotency_key);

-- 4. Authoritative Quotes table
CREATE TABLE IF NOT EXISTS wallet_quotes (
    quote_id VARCHAR(64) PRIMARY KEY,
    uwo_user_id VARCHAR(128) NOT NULL,
    app_id VARCHAR(64) NOT NULL,
    product_id VARCHAR(64) NOT NULL,
    plan_id VARCHAR(64) NOT NULL,
    billing_cycle VARCHAR(32) NOT NULL DEFAULT 'monthly',
    quantity INTEGER NOT NULL DEFAULT 1,
    amount_paise BIGINT NOT NULL CHECK (amount_paise >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    catalog_version VARCHAR(32) NOT NULL DEFAULT 'v1',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotes_user_app ON wallet_quotes(uwo_user_id, app_id);

-- 5. Wallet Holds table (Saga funds reservation)
CREATE TABLE IF NOT EXISTS wallet_holds (
    hold_id VARCHAR(64) PRIMARY KEY,
    wallet_id VARCHAR(64) NOT NULL REFERENCES wallets(wallet_id),
    uwo_user_id VARCHAR(128) NOT NULL,
    app_id VARCHAR(64) NOT NULL,
    quote_id VARCHAR(64) REFERENCES wallet_quotes(quote_id),
    purchase_id VARCHAR(128) NOT NULL,
    total_amount_paise BIGINT NOT NULL CHECK (total_amount_paise > 0),
    held_cash_paise BIGINT NOT NULL DEFAULT 0 CHECK (held_cash_paise >= 0),
    held_promo_paise BIGINT NOT NULL DEFAULT 0 CHECK (held_promo_paise >= 0),
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, CAPTURED, RELEASED, EXPIRED
    idempotency_key VARCHAR(128) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    trace_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_hold_purchase UNIQUE (purchase_id)
);

CREATE INDEX IF NOT EXISTS idx_holds_wallet_status ON wallet_holds(wallet_id, status);
CREATE INDEX IF NOT EXISTS idx_holds_expires ON wallet_holds(expires_at) WHERE status = 'ACTIVE';

-- 6. Payment Webhook Events table (Inbox for Razorpay webhooks)
CREATE TABLE IF NOT EXISTS payment_webhook_events (
    webhook_event_id VARCHAR(64) PRIMARY KEY,
    gateway VARCHAR(32) NOT NULL DEFAULT 'RAZORPAY',
    event_id VARCHAR(128) NOT NULL UNIQUE,
    event_type VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(32) NOT NULL DEFAULT 'RECEIVED', -- RECEIVED, PROCESSED, DUPLICATE, FAILED
    retry_count INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhooks_status ON payment_webhook_events(status);

-- 7. Transactional Outbox table
CREATE TABLE IF NOT EXISTS outbox_events (
    event_id VARCHAR(64) PRIMARY KEY,
    aggregate_id VARCHAR(128) NOT NULL,
    aggregate_type VARCHAR(64) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- PENDING, PUBLISHED, FAILED
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_outbox_pending ON outbox_events(status, created_at) WHERE status = 'PENDING';

-- 8. Idempotency Records table
CREATE TABLE IF NOT EXISTS idempotency_records (
    scope VARCHAR(64) NOT NULL,
    idempotency_key VARCHAR(128) NOT NULL,
    request_hash VARCHAR(64) NOT NULL,
    status_code INTEGER NOT NULL,
    response_body JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (scope, idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_idempotency_expires ON idempotency_records(expires_at);

-- 9. Refund Records table
CREATE TABLE IF NOT EXISTS refund_records (
    refund_id VARCHAR(64) PRIMARY KEY,
    topup_order_id VARCHAR(64) NOT NULL REFERENCES topup_orders(topup_order_id),
    gateway_refund_id VARCHAR(128) UNIQUE,
    original_payment_id VARCHAR(128) NOT NULL,
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSED, FAILED
    reason TEXT,
    idempotency_key VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refunds_topup ON refund_records(topup_order_id);
