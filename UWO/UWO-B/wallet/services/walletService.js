'use strict';

const crypto = require('crypto');
const { query, withTransaction } = require('../db/pool');
const { getValidQuote } = require('./catalogService');
const { checkIdempotency, recordIdempotency } = require('./idempotencyService');

function formatRupees(paise) {
  return (Number(paise) / 100).toFixed(2);
}

/**
 * Get or automatically initialize a central wallet for a canonical user.
 */
async function getOrCreateWallet(uwoUserId, client = null) {
  if (!uwoUserId) {
    throw new Error('MISSING_USER_ID: Cannot access wallet without canonical uwo_user_id.');
  }

  const runner = client ? client.query.bind(client) : query;

  // Try finding existing wallet
  const findSql = `SELECT * FROM wallets WHERE uwo_user_id = $1;`;
  const { rows } = await runner(findSql, [uwoUserId]);
  if (rows.length > 0) {
    return enrichWallet(rows[0]);
  }

  // Initialize fresh wallet with 0 balances
  const walletId = `wal_${crypto.randomBytes(16).toString('hex')}`;
  const insertSql = `
    INSERT INTO wallets (
      wallet_id, uwo_user_id, currency,
      cash_balance_paise, promo_balance_paise,
      locked_cash_paise, locked_promo_paise,
      status, version, created_at, updated_at
    ) VALUES ($1, $2, 'INR', 0, 0, 0, 0, 'ACTIVE', 1, NOW(), NOW())
    ON CONFLICT (uwo_user_id) DO UPDATE SET updated_at = NOW()
    RETURNING *;
  `;

  const insertResult = await runner(insertSql, [walletId, uwoUserId]);
  return enrichWallet(insertResult.rows[0]);
}

/**
 * Compute derived available & total balance fields.
 */
function enrichWallet(wallet) {
  const cash = BigInt(wallet.cash_balance_paise);
  const promo = BigInt(wallet.promo_balance_paise);
  const lockedCash = BigInt(wallet.locked_cash_paise);
  const lockedPromo = BigInt(wallet.locked_promo_paise);

  const availCash = cash - lockedCash;
  const availPromo = promo - lockedPromo;
  const totalBalance = cash + promo;
  const totalAvailable = availCash + availPromo;
  const totalLocked = lockedCash + lockedPromo;

  return {
    wallet_id: wallet.wallet_id,
    uwo_user_id: wallet.uwo_user_id,
    currency: wallet.currency,
    status: wallet.status,
    balances: {
      cash_paise: Number(cash),
      promo_paise: Number(promo),
      locked_cash_paise: Number(lockedCash),
      locked_promo_paise: Number(lockedPromo),
      available_cash_paise: Number(availCash),
      available_promo_paise: Number(availPromo),
      total_balance_paise: Number(totalBalance),
      total_available_paise: Number(totalAvailable),
      total_locked_paise: Number(totalLocked),
      // Formatted Rupees for display
      total_balance_inr: formatRupees(totalBalance),
      total_available_inr: formatRupees(totalAvailable),
      cash_balance_inr: formatRupees(cash),
      promo_balance_inr: formatRupees(promo),
      locked_inr: formatRupees(totalLocked),
    },
    version: wallet.version,
    created_at: wallet.created_at,
    updated_at: wallet.updated_at,
  };
}

/**
 * Lock wallet row for atomic update using SELECT ... FOR UPDATE.
 */
async function lockWalletForUpdate(walletId, client) {
  const { rows } = await client.query(
    'SELECT * FROM wallets WHERE wallet_id = $1 FOR UPDATE;',
    [walletId]
  );
  if (rows.length === 0) {
    const err = new Error(`WALLET_NOT_FOUND: Wallet ${walletId} not found.`);
    err.code = 'WALLET_NOT_FOUND';
    err.status = 404;
    throw err;
  }
  return rows[0];
}

/**
 * Get wallet summary for an authenticated user.
 */
async function getWalletSummary(uwoUserId) {
  const wallet = await getOrCreateWallet(uwoUserId);
  return wallet;
}

/**
 * Get paginated transaction history from the immutable ledger.
 */
async function getTransactionHistory(uwoUserId, { limit = 20, cursor = null, type = null } = {}) {
  const wallet = await getOrCreateWallet(uwoUserId);
  const take = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  const params = [wallet.wallet_id, take];
  let whereClauses = 'wallet_id = $1';

  if (cursor) {
    params.push(new Date(cursor));
    whereClauses += ` AND created_at < $${params.length}`;
  }

  if (type) {
    params.push(type.toUpperCase());
    whereClauses += ` AND type = $${params.length}`;
  }

  const sql = `
    SELECT * FROM wallet_ledger
    WHERE ${whereClauses}
    ORDER BY created_at DESC
    LIMIT $2;
  `;

  const { rows } = await query(sql, params);

  const items = rows.map((r) => ({
    ledger_id: r.ledger_id,
    direction: r.direction,
    type: r.type,
    amount_paise: Number(r.amount_paise),
    amount_inr: formatRupees(r.amount_paise),
    cash_amount_paise: Number(r.cash_amount_paise),
    promo_amount_paise: Number(r.promo_amount_paise),
    reference_type: r.reference_type,
    reference_id: r.reference_id,
    app_id: r.app_id,
    purchase_id: r.purchase_id,
    description: r.description,
    trace_id: r.trace_id,
    created_at: r.created_at,
  }));

  const nextCursor = items.length === take ? items[items.length - 1].created_at : null;

  return {
    wallet_id: wallet.wallet_id,
    items,
    pagination: {
      limit: take,
      next_cursor: nextCursor,
      has_more: Boolean(nextCursor),
    },
  };
}

/**
 * Reserve spendable funds by creating an atomic Hold (Saga Phase 1).
 * Allocation Rule: FIFO Promo-first spend, then cash.
 */
async function createHold({
  uwoUserId,
  appId,
  quoteId,
  purchaseId,
  idempotencyKey,
  traceId = `trc_${Date.now()}`,
  ttlSeconds = 900, // 15 mins
}) {
  const idempotencyScope = `hold:${uwoUserId}`;
  const payload = { appId, quoteId, purchaseId, idempotencyKey };

  const idemp = await checkIdempotency(idempotencyScope, idempotencyKey, payload);
  if (idemp.cached) {
    return idemp.responseBody;
  }

  const result = await withTransaction(async (client) => {
    // 1. Resolve quote
    const quote = await getValidQuote(quoteId, client);
    if (quote.uwo_user_id !== uwoUserId) {
      const err = new Error('FORBIDDEN_QUOTE: Quote was issued for a different user.');
      err.code = 'FORBIDDEN_QUOTE';
      err.status = 403;
      throw err;
    }

    const requiredPaise = BigInt(quote.amount_paise);
    if (requiredPaise <= 0n) {
      throw new Error('INVALID_AMOUNT: Hold amount must be greater than zero.');
    }

    // 2. Fetch & lock wallet
    const rawWallet = await getOrCreateWallet(uwoUserId, client);
    const lockedWallet = await lockWalletForUpdate(rawWallet.wallet_id, client);

    const cash = BigInt(lockedWallet.cash_balance_paise);
    const promo = BigInt(lockedWallet.promo_balance_paise);
    const lockedCash = BigInt(lockedWallet.locked_cash_paise);
    const lockedPromo = BigInt(lockedWallet.locked_promo_paise);

    const availPromo = promo - lockedPromo;
    const availCash = cash - lockedCash;
    const totalAvail = availPromo + availCash;

    if (totalAvail < requiredPaise) {
      const err = new Error(
        `INSUFFICIENT_BALANCE: Available balance ₹${formatRupees(totalAvail)} is less than required ₹${formatRupees(requiredPaise)}.`
      );
      err.code = 'INSUFFICIENT_BALANCE';
      err.status = 400;
      err.details = {
        required_paise: Number(requiredPaise),
        available_paise: Number(totalAvail),
      };
      throw err;
    }

    // 3. FIFO promo-first allocation
    const heldPromo = availPromo >= requiredPaise ? requiredPaise : availPromo;
    const heldCash = requiredPaise - heldPromo;

    // 4. Update locked amounts in wallet
    const newLockedPromo = lockedPromo + heldPromo;
    const newLockedCash = lockedCash + heldCash;

    await client.query(
      `
      UPDATE wallets
      SET locked_cash_paise = $1,
          locked_promo_paise = $2,
          version = version + 1,
          updated_at = NOW()
      WHERE wallet_id = $3;
      `,
      [newLockedCash.toString(), newLockedPromo.toString(), lockedWallet.wallet_id]
    );

    // 5. Insert hold record
    const holdId = `hld_${crypto.randomBytes(16).toString('hex')}`;
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    const insertHoldSql = `
      INSERT INTO wallet_holds (
        hold_id, wallet_id, uwo_user_id, app_id, quote_id,
        purchase_id, total_amount_paise, held_cash_paise, held_promo_paise,
        status, idempotency_key, expires_at, trace_id, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'ACTIVE', $10, $11, $12, NOW(), NOW())
      RETURNING *;
    `;

    const { rows: holdRows } = await client.query(insertHoldSql, [
      holdId,
      lockedWallet.wallet_id,
      uwoUserId,
      appId,
      quoteId,
      purchaseId,
      requiredPaise.toString(),
      heldCash.toString(),
      heldPromo.toString(),
      idempotencyKey,
      expiresAt,
      traceId,
    ]);

    const hold = holdRows[0];

    // 6. Transactional Outbox Event
    const eventId = `evt_${crypto.randomBytes(16).toString('hex')}`;
    await client.query(
      `
      INSERT INTO outbox_events (event_id, aggregate_id, aggregate_type, event_type, payload, status)
      VALUES ($1, $2, 'HOLD', 'WALLET_HOLD_CREATED', $3, 'PENDING');
      `,
      [eventId, holdId, JSON.stringify(hold)]
    );

    const responseBody = {
      hold_id: hold.hold_id,
      wallet_id: hold.wallet_id,
      uwo_user_id: hold.uwo_user_id,
      app_id: hold.app_id,
      purchase_id: hold.purchase_id,
      total_amount_paise: Number(hold.total_amount_paise),
      held_cash_paise: Number(hold.held_cash_paise),
      held_promo_paise: Number(hold.held_promo_paise),
      amount_inr: formatRupees(hold.total_amount_paise),
      status: hold.status,
      expires_at: hold.expires_at,
      trace_id: hold.trace_id,
    };

    await recordIdempotency(idempotencyScope, idempotencyKey, payload, 201, responseBody, client);
    return responseBody;
  });

  return result;
}

/**
 * Capture hold after downstream app successfully activates entitlement.
 */
async function captureHold({ holdId, appId, purchaseId, traceId = `trc_${Date.now()}` }) {
  const result = await withTransaction(async (client) => {
    // 1. Fetch hold with lock
    const { rows: holdRows } = await client.query(
      'SELECT * FROM wallet_holds WHERE hold_id = $1 FOR UPDATE;',
      [holdId]
    );

    if (holdRows.length === 0) {
      const err = new Error(`HOLD_NOT_FOUND: Hold ${holdId} does not exist.`);
      err.code = 'HOLD_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    const hold = holdRows[0];

    // Idempotency: if already captured, return success immediately
    if (hold.status === 'CAPTURED') {
      return {
        success: true,
        already_captured: true,
        hold_id: hold.hold_id,
        purchase_id: hold.purchase_id,
        status: 'CAPTURED',
      };
    }

    if (hold.status !== 'ACTIVE') {
      const err = new Error(`INVALID_HOLD_STATE: Hold ${holdId} cannot be captured because it is ${hold.status}.`);
      err.code = 'INVALID_HOLD_STATE';
      err.status = 400;
      throw err;
    }

    if (appId && hold.app_id !== appId) {
      const err = new Error(`APP_MISMATCH: Hold ${holdId} belongs to ${hold.app_id}, not ${appId}.`);
      err.code = 'APP_MISMATCH';
      err.status = 403;
      throw err;
    }

    if (purchaseId && hold.purchase_id !== purchaseId) {
      const err = new Error(`PURCHASE_MISMATCH: Hold ${holdId} is bound to purchase ${hold.purchase_id}.`);
      err.code = 'PURCHASE_MISMATCH';
      err.status = 400;
      throw err;
    }

    // 2. Lock and update wallet balance & locked amounts
    const lockedWallet = await lockWalletForUpdate(hold.wallet_id, client);

    const heldCash = BigInt(hold.held_cash_paise);
    const heldPromo = BigInt(hold.held_promo_paise);
    const totalHeld = BigInt(hold.total_amount_paise);

    const newCash = BigInt(lockedWallet.cash_balance_paise) - heldCash;
    const newPromo = BigInt(lockedWallet.promo_balance_paise) - heldPromo;
    const newLockedCash = BigInt(lockedWallet.locked_cash_paise) - heldCash;
    const newLockedPromo = BigInt(lockedWallet.locked_promo_paise) - heldPromo;

    await client.query(
      `
      UPDATE wallets
      SET cash_balance_paise = $1,
          promo_balance_paise = $2,
          locked_cash_paise = $3,
          locked_promo_paise = $4,
          version = version + 1,
          updated_at = NOW()
      WHERE wallet_id = $5;
      `,
      [newCash.toString(), newPromo.toString(), newLockedCash.toString(), newLockedPromo.toString(), lockedWallet.wallet_id]
    );

    // 3. Immutable financial ledger debit
    const ledgerId = `led_${crypto.randomBytes(16).toString('hex')}`;
    await client.query(
      `
      INSERT INTO wallet_ledger (
        ledger_id, wallet_id, uwo_user_id, direction, type,
        amount_paise, cash_amount_paise, promo_amount_paise,
        reference_type, reference_id, app_id, purchase_id,
        idempotency_key, trace_id, actor, description, created_at
      ) VALUES ($1, $2, $3, 'DEBIT', 'PURCHASE', $4, $5, $6, 'HOLD', $7, $8, $9, $10, $11, 'APP_SERVICE', $12, NOW());
      `,
      [
        ledgerId,
        lockedWallet.wallet_id,
        hold.uwo_user_id,
        totalHeld.toString(),
        heldCash.toString(),
        heldPromo.toString(),
        hold.hold_id,
        hold.app_id,
        hold.purchase_id,
        hold.idempotency_key,
        traceId,
        `Purchase capture for ${hold.app_id} (Purchase: ${hold.purchase_id})`,
      ]
    );

    // 4. Update hold status
    await client.query(
      `
      UPDATE wallet_holds
      SET status = 'CAPTURED',
          updated_at = NOW()
      WHERE hold_id = $1;
      `,
      [holdId]
    );

    // 5. Outbox Event
    const eventId = `evt_${crypto.randomBytes(16).toString('hex')}`;
    await client.query(
      `
      INSERT INTO outbox_events (event_id, aggregate_id, aggregate_type, event_type, payload, status)
      VALUES ($1, $2, 'HOLD', 'WALLET_HOLD_CAPTURED', $3, 'PENDING');
      `,
      [eventId, holdId, JSON.stringify({ holdId, ledgerId, purchaseId: hold.purchase_id })]
    );

    return {
      success: true,
      hold_id: hold.hold_id,
      ledger_id: ledgerId,
      purchase_id: hold.purchase_id,
      amount_captured_paise: Number(totalHeld),
      amount_captured_inr: formatRupees(totalHeld),
      status: 'CAPTURED',
    };
  });

  return result;
}

/**
 * Release hold on downstream activation failure (Saga Compensation).
 */
async function releaseHold({ holdId, appId, purchaseId, reason = 'ACTIVATION_FAILED', traceId = `trc_${Date.now()}` }) {
  const result = await withTransaction(async (client) => {
    const { rows: holdRows } = await client.query(
      'SELECT * FROM wallet_holds WHERE hold_id = $1 FOR UPDATE;',
      [holdId]
    );

    if (holdRows.length === 0) {
      const err = new Error(`HOLD_NOT_FOUND: Hold ${holdId} does not exist.`);
      err.code = 'HOLD_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    const hold = holdRows[0];

    if (hold.status === 'RELEASED') {
      return {
        success: true,
        already_released: true,
        hold_id: hold.hold_id,
        status: 'RELEASED',
      };
    }

    if (hold.status !== 'ACTIVE') {
      const err = new Error(`INVALID_HOLD_STATE: Hold ${holdId} is ${hold.status} and cannot be released.`);
      err.code = 'INVALID_HOLD_STATE';
      err.status = 400;
      throw err;
    }

    // Unlock locked funds in wallet
    const lockedWallet = await lockWalletForUpdate(hold.wallet_id, client);

    const heldCash = BigInt(hold.held_cash_paise);
    const heldPromo = BigInt(hold.held_promo_paise);

    const newLockedCash = BigInt(lockedWallet.locked_cash_paise) - heldCash;
    const newLockedPromo = BigInt(lockedWallet.locked_promo_paise) - heldPromo;

    await client.query(
      `
      UPDATE wallets
      SET locked_cash_paise = $1,
          locked_promo_paise = $2,
          version = version + 1,
          updated_at = NOW()
      WHERE wallet_id = $3;
      `,
      [newLockedCash.toString(), newLockedPromo.toString(), lockedWallet.wallet_id]
    );

    await client.query(
      `
      UPDATE wallet_holds
      SET status = 'RELEASED',
          updated_at = NOW()
      WHERE hold_id = $1;
      `,
      [holdId]
    );

    // Outbox Event
    const eventId = `evt_${crypto.randomBytes(16).toString('hex')}`;
    await client.query(
      `
      INSERT INTO outbox_events (event_id, aggregate_id, aggregate_type, event_type, payload, status)
      VALUES ($1, $2, 'HOLD', 'WALLET_HOLD_RELEASED', $3, 'PENDING');
      `,
      [eventId, holdId, JSON.stringify({ holdId, reason, traceId })]
    );

    return {
      success: true,
      hold_id: hold.hold_id,
      purchase_id: hold.purchase_id,
      released_amount_paise: Number(hold.total_amount_paise),
      status: 'RELEASED',
      reason,
    };
  });

  return result;
}

/**
 * Read hold state for safe recovery.
 */
async function getHold(holdId) {
  const { rows } = await query('SELECT * FROM wallet_holds WHERE hold_id = $1;', [holdId]);
  if (rows.length === 0) {
    const err = new Error(`HOLD_NOT_FOUND: Hold ${holdId} not found.`);
    err.code = 'HOLD_NOT_FOUND';
    err.status = 404;
    throw err;
  }
  const hold = rows[0];
  return {
    ...hold,
    amount_inr: formatRupees(hold.total_amount_paise),
  };
}

/**
 * Promotional Grant (restricted internal/policy use).
 */
async function grantPromo({ uwoUserId, amountPaise, reason = 'PROMO_WELCOME', idempotencyKey, traceId = `trc_${Date.now()}`, actor = 'SYSTEM' }) {
  if (amountPaise <= 0) {
    throw new Error('INVALID_AMOUNT: Promo grant must be positive.');
  }

  const result = await withTransaction(async (client) => {
    const rawWallet = await getOrCreateWallet(uwoUserId, client);
    const lockedWallet = await lockWalletForUpdate(rawWallet.wallet_id, client);

    const newPromo = BigInt(lockedWallet.promo_balance_paise) + BigInt(amountPaise);

    await client.query(
      `
      UPDATE wallets
      SET promo_balance_paise = $1,
          version = version + 1,
          updated_at = NOW()
      WHERE wallet_id = $2;
      `,
      [newPromo.toString(), lockedWallet.wallet_id]
    );

    const ledgerId = `led_${crypto.randomBytes(16).toString('hex')}`;
    await client.query(
      `
      INSERT INTO wallet_ledger (
        ledger_id, wallet_id, uwo_user_id, direction, type,
        amount_paise, cash_amount_paise, promo_amount_paise,
        reference_type, reference_id, app_id, idempotency_key, trace_id, actor, description, created_at
      ) VALUES ($1, $2, $3, 'CREDIT', 'PROMO_GRANT', $4, 0, $4, 'PROMO', $5, 'uwo', $6, $7, $8, $9, NOW());
      `,
      [ledgerId, lockedWallet.wallet_id, uwoUserId, amountPaise.toString(), ledgerId, idempotencyKey, traceId, actor, reason]
    );

    return {
      success: true,
      ledger_id: ledgerId,
      granted_promo_paise: amountPaise,
      granted_promo_inr: formatRupees(amountPaise),
    };
  });

  return result;
}

/**
 * Reconcile single wallet's balance against immutable ledger postings.
 * Ensures zero unexplained variance.
 */
async function reconcileWalletBalances(walletId) {
  const { rows: walletRows } = await query('SELECT * FROM wallets WHERE wallet_id = $1;', [walletId]);
  if (walletRows.length === 0) {
    throw new Error(`Wallet ${walletId} not found.`);
  }

  const wallet = walletRows[0];

  const { rows: ledgerSums } = await query(
    `
    SELECT
      COALESCE(SUM(CASE WHEN direction = 'CREDIT' THEN cash_amount_paise ELSE -cash_amount_paise END), 0) AS computed_cash,
      COALESCE(SUM(CASE WHEN direction = 'CREDIT' THEN promo_amount_paise ELSE -promo_amount_paise END), 0) AS computed_promo
    FROM wallet_ledger
    WHERE wallet_id = $1;
    `,
    [walletId]
  );

  const computedCash = BigInt(ledgerSums[0].computed_cash);
  const computedPromo = BigInt(ledgerSums[0].computed_promo);
  const actualCash = BigInt(wallet.cash_balance_paise);
  const actualPromo = BigInt(wallet.promo_balance_paise);

  const cashVariance = actualCash - computedCash;
  const promoVariance = actualPromo - computedPromo;

  const isReconciled = cashVariance === 0n && promoVariance === 0n;

  return {
    wallet_id: walletId,
    uwo_user_id: wallet.uwo_user_id,
    is_reconciled: isReconciled,
    actual_cash_paise: Number(actualCash),
    computed_cash_paise: Number(computedCash),
    cash_variance_paise: Number(cashVariance),
    actual_promo_paise: Number(actualPromo),
    computed_promo_paise: Number(computedPromo),
    promo_variance_paise: Number(promoVariance),
  };
}

module.exports = {
  getOrCreateWallet,
  getWalletSummary,
  getTransactionHistory,
  createHold,
  captureHold,
  releaseHold,
  getHold,
  grantPromo,
  reconcileWalletBalances,
  lockWalletForUpdate,
  formatRupees,
};
