'use strict';

const { query } = require('../db/pool');
const { releaseHold, reconcileWalletBalances } = require('./walletService');
const { fulfillTopup } = require('./topupService');

/**
 * Reconcile active holds that have exceeded their TTL.
 * Automatically releases locked funds back to the user's available balance.
 */
async function reconcileExpiredHolds() {
  const { rows: expiredHolds } = await query(
    `
    SELECT hold_id, app_id, purchase_id, uwo_user_id, expires_at
    FROM wallet_holds
    WHERE status = 'ACTIVE' AND expires_at < NOW()
    ORDER BY expires_at ASC
    LIMIT 100;
    `
  );

  const results = [];
  for (const hold of expiredHolds) {
    try {
      const releaseResult = await releaseHold({
        holdId: hold.hold_id,
        appId: hold.app_id,
        purchaseId: hold.purchase_id,
        reason: 'EXPIRED_TTL_AUTO_RELEASE',
        traceId: `trc_recon_exp_${Date.now()}`,
      });
      results.push({ holdId: hold.hold_id, success: true, releaseResult });
    } catch (err) {
      results.push({ holdId: hold.hold_id, success: false, error: err.message });
    }
  }

  return {
    expired_count: expiredHolds.length,
    processed: results,
  };
}

/**
 * Reconcile pending top-up orders where webhook might have been dropped or delayed.
 */
async function reconcilePendingTopups() {
  const { rows: pendingOrders } = await query(
    `
    SELECT topup_order_id, gateway_order_id, expected_cash_amount_paise, uwo_user_id, app_id, created_at
    FROM topup_orders
    WHERE status = 'CREATED' AND created_at < NOW() - INTERVAL '5 minutes'
    ORDER BY created_at ASC
    LIMIT 50;
    `
  );

  return {
    pending_count: pendingOrders.length,
    orders: pendingOrders.map((o) => ({
      topup_order_id: o.topup_order_id,
      gateway_order_id: o.gateway_order_id,
      created_at: o.created_at,
    })),
  };
}

/**
 * Audit and reconcile all wallets against the immutable ledger.
 */
async function reconcileAllWallets() {
  const { rows: wallets } = await query('SELECT wallet_id FROM wallets;');
  const reports = [];
  let totalDiscrepancies = 0;

  for (const w of wallets) {
    const report = await reconcileWalletBalances(w.wallet_id);
    if (!report.is_reconciled) {
      totalDiscrepancies++;
    }
    reports.push(report);
  }

  return {
    total_wallets_checked: wallets.length,
    total_discrepancies: totalDiscrepancies,
    is_healthy: totalDiscrepancies === 0,
    wallets: reports,
  };
}

/**
 * Process pending transactional outbox events.
 */
async function processPendingOutbox() {
  const { rows: pendingEvents } = await query(
    `
    SELECT * FROM outbox_events
    WHERE status = 'PENDING'
    ORDER BY created_at ASC
    LIMIT 50
    FOR UPDATE SKIP LOCKED;
    `
  );

  const processed = [];
  for (const evt of pendingEvents) {
    // In production, publish to GCP Cloud Pub/Sub or Kafka.
    // In current environment, acknowledge event and mark published.
    await query(
      `
      UPDATE outbox_events
      SET status = 'PUBLISHED',
          processed_at = NOW()
      WHERE event_id = $1;
      `,
      [evt.event_id]
    );
    processed.push(evt.event_id);
  }

  return {
    published_count: processed.length,
    event_ids: processed,
  };
}

module.exports = {
  reconcileExpiredHolds,
  reconcilePendingTopups,
  reconcileAllWallets,
  processPendingOutbox,
};
