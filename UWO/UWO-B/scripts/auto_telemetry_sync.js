/**
 * Standalone Automated Telemetry Sync Daemon
 * 
 * Runs continuously in the background to automatically synchronize
 * chat telemetry from AISA MongoDB Atlas into Unified Dashboard.
 */

const { startAutoSyncWorker, getSyncStatus } = require('../unified_routes/telemetrySyncService');
const { startRevenueAutoSync, getRevenueSyncStatus } = require('../unified_routes/revenueSyncService');

console.log('====================================================');
console.log(' 🚀 UWO AUTOMATED UNIFIED SYNC DAEMON ACTIVE');
console.log(' (Telemetry & Real-Time Revenue Synchronization)');
console.log('====================================================');

const intervalMinutes = parseInt(process.env.SYNC_INTERVAL_MINUTES || '5', 10);
startAutoSyncWorker(intervalMinutes);
startRevenueAutoSync(intervalMinutes);

// Keep process running and log heartbeat every 2 minutes
setInterval(() => {
  const tStatus = getSyncStatus();
  const rStatus = getRevenueSyncStatus();
  console.log(`[Daemon Heartbeat] ${new Date().toLocaleTimeString()} - Chat Records: ${tStatus.total_records_in_db} | Revenue Txs: ${rStatus.total_transactions_in_db} | Subscriptions: ${rStatus.total_subscriptions_in_db}`);
}, 120000);

process.on('SIGINT', () => {
  console.log('\n[Daemon] Gracefully shutting down...');
  process.exit(0);
});
