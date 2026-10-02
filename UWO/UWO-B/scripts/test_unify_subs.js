const { getUnifiedDb } = require('../unified_routes/db');

async function testSync() {
  const db = await getUnifiedDb();

  // 1. Check existing AI Legal subscriptions
  const legalSubs = await db.collection('subscriptions').find({ product_code: 'ailegal' }).toArray();
  console.log('Existing AI Legal subs:', legalSubs.length);

  // 2. Fetch completed AISA transactions with emails
  const aisaTxs = await db.collection('revenue_transactions').find({
    product_code: 'aisa',
    status: 'completed',
    customer_email: { $ne: null }
  }).sort({ transaction_date: -1 }).toArray();

  const aisaMap = {};
  for (const t of aisaTxs) {
    if (!aisaMap[t.customer_email]) aisaMap[t.customer_email] = t;
  }
  console.log('AISA unique customer txs:', Object.keys(aisaMap).length);

  // 3. Fetch completed EFV transactions with emails
  const efvTxs = await db.collection('revenue_transactions').find({
    product_code: 'efvframework',
    status: 'completed',
    customer_email: { $ne: null }
  }).sort({ transaction_date: -1 }).toArray();

  const efvMap = {};
  for (const t of efvTxs) {
    if (!efvMap[t.customer_email]) efvMap[t.customer_email] = t;
  }
  console.log('EFV unique customer txs:', Object.keys(efvMap).length);
}

testSync().catch(console.error);
