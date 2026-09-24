const { MongoClient } = require('mongodb');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const UNIFIED_URI = 'mongodb+srv://admin_db_user:uSYUbw06q4coR6Nv@unified-dashboard.wisisoq.mongodb.net/?appName=Unified-Dashboard';

async function main() {
  const client = await MongoClient.connect(UNIFIED_URI, { serverSelectionTimeoutMS: 10000 });
  const db = client.db('unified_service_db');

  const byProd = await db.collection('revenue_transactions').aggregate([
    { $group: { _id: '$product_code', count: { $sum: 1 }, total_amount: { $sum: '$gross_amount' } } }
  ]).toArray();
  console.log('=== By Product ===\n', byProd);

  const byStatus = await db.collection('revenue_transactions').aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]).toArray();
  console.log('=== By Status ===\n', byStatus);

  const succ = await db.collection('revenue_transactions').find({
    status: { $in: ['completed', 'captured', 'paid', 'success', 'succeeded'] }
  }).toArray();
  console.log(`=== Successful Transactions (${succ.length}) ===\n`, JSON.stringify(succ, null, 2));

  await client.close();
}

main().catch(console.error);
