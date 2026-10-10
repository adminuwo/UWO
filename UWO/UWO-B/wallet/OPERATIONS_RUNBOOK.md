# UWO UNIFIED WALLET — PRODUCTION OPERATIONS RUNBOOK & ARCHITECTURE GUIDE

**Version 1.0 | October 2026 | Financial Source of Truth**

---

## 1. Architectural Principles

1. **UWO-B is the Only Financial Source of Truth:**
   Backed strictly by PostgreSQL. No downstream application (AISA, AI Legal, AI Ads, EFV, etc.) ever maintains authoritative rupee balances or local financial ledgers.
2. **Centralized Razorpay Ownership:**
   All Razorpay wallet top-up orders, HMAC-SHA256 webhook processing, payment-to-order verification, and refunds are centralized exclusively within UWO-B. Downstream apps never hold Razorpay secret keys or create independent top-up pipelines.
3. **Single Canonical Identity (`uwo_user_id`):**
   One user maps to one central wallet. All ecosystem apps resolve and authenticate the canonical `uwo_user_id` from the existing Unified Auth JWT token (`decoded.sub` or `decoded.id`).
4. **Separation of Concerns:**
   Wallet owns money, balances, holds, and ledger postings. Applications own their business entitlements (subscriptions, model quotas, visual credits, legal packs).
5. **Two-Phase Reservation Saga:**
   Apps quote authoritative prices -> reserve spendable funds via Hold -> activate local entitlements -> capture hold in UWO-B. On activation failure, holds are immediately released.

---

## 2. Database & Migration Management

### 2.1 Schema Entities
- `wallets`: Master wallet record per canonical user, tracking `cash_balance_paise`, `promo_balance_paise`, `locked_cash_paise`, `locked_promo_paise`.
- `wallet_ledger`: Immutable append-only financial ledger.
- `topup_orders`: Central Razorpay top-up order tracking and fulfillment state.
- `wallet_quotes`: Authoritative server-resolved quotes with TTL expiration.
- `wallet_holds`: Spend reservation holds with status lifecycle (`ACTIVE`, `CAPTURED`, `RELEASED`, `EXPIRED`).
- `payment_webhook_events`: Webhook deduplication and processing inbox.
- `outbox_events`: Transactional outbox for guaranteed event publishing.
- `idempotency_records`: Replay cache for zero-duplicate mutations.
- `refund_records`: Audit trail for gateway refunds.

### 2.2 Running Database Migrations
Migrations are managed in `UWO/UWO/UWO-B/wallet/db/migrations/` and executed via `wallet/db/migrate.js`:

```bash
# Apply pending UP migrations
node wallet/db/migrate.js up

# Rollback migrations (DOWN)
node wallet/db/migrate.js down
```

---

## 3. Central Razorpay Configuration

### 3.1 Environment Secrets
Set in `UWO/UWO/UWO-B/.env` or Google Secret Manager:
- `RAZORPAY_KEY_ID`: Public key identifier (safe to share with frontend checkout).
- `RAZORPAY_KEY_SECRET`: Server-only secret key (strictly isolated to UWO-B).
- `RAZORPAY_WEBHOOK_SECRET`: HMAC-SHA256 secret configured in Razorpay Dashboard.

### 3.2 Canonical Webhook Configuration
- **Webhook URL:** `https://<uwo-api-domain>/api/v1/payments/razorpay/webhook`
- **Events to Subscribe:**
  - `payment.captured`
  - `order.paid`
  - `refund.processed`
- **Security:** Signature is verified using raw binary request body (`req.rawBody`) with `crypto.timingSafeEqual`.

---

## 4. Operational Recovery & Automated Reconciliation

### 4.1 Automated CLI Commands
Run reconciliation routines:

```bash
# Audit all wallet balances against immutable ledger postings (checks for ₹0.00 variance):
node -e "require('./wallet/services/reconciliationService').reconcileAllWallets().then(console.log)"

# Auto-release expired holds past TTL:
node -e "require('./wallet/services/reconciliationService').reconcileExpiredHolds().then(console.log)"

# Process pending transactional outbox events:
node -e "require('./wallet/services/reconciliationService').processPendingOutbox().then(console.log)"
```

### 4.2 Administrative API Endpoint
Authorized service calls can trigger full system reconciliation:
`POST /api/v1/wallet/reconcile` (Requires `X-Service-Key`).

---

## 5. App-by-App Onboarding Status

| App ID | Status | Central Balance Read | Spend / Entitlement Saga | Local Razorpay Deprecated |
|---|---|---|---|---|
| **AISA** | ✅ INTEGRATED | Yes (`/api/wallet/me`) | Yes (`/api/wallet/purchase-plan`) | Centralized in UWO-B |
| **AI Legal** | ✅ INTEGRATED | Yes (`/api/wallet/me`) | Yes (`/api/wallet/purchase`) | Centralized in UWO-B |
| **AI Ads** | ✅ INTEGRATED | Yes (`/api/wallet/me`) | Yes (`/api/wallet/purchase`) | Centralized in UWO-B |
| **EFV** | 📋 Staged | Ready for SDK mount | Ready for SDK mount | Ready |
| **AI Mall** | 📋 Staged | Ready for SDK mount | Ready for SDK mount | Ready |
| **UWO Connect**| 📋 Staged | Ready for SDK mount | Ready for SDK mount | Ready |

---

## 6. Disaster Recovery & Rollback Plan

1. **Database Rollback:**
   Execute `node wallet/db/migrate.js down`. This safely drops financial tables using the down script without affecting MongoDB or existing unified platform data.
2. **Point-In-Time Recovery (PITR):**
   In Cloud SQL, PITR is enabled with 7-day retention. If corruption occurs, restore to timestamp `T - 1 min` using `gcloud sql instances clone`.
3. **Fail-Closed Guarantee:**
   If PostgreSQL or UWO-B is temporarily unreachable, all balance debits and purchases fail cleanly with `WALLET_UNAVAILABLE`. Under no circumstances will apps fall back to a local balance or grant entitlements without central financial confirmation.
