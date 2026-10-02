const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}
const { MongoClient } = require('mongodb');
const { getUnifiedDb } = require('../unified_routes/db');

const MONGO_URI = 'mongodb+srv://uwo_admin:uwo%4012345@cluster0.selr4is.mongodb.net/UWO-web?retryWrites=true&w=majority';
const AISA_URI = 'mongodb+srv://admin_db_user:ailegal050804@cluster0.265idhx.mongodb.net/AISA?appName=Cluster0';

async function main() {
  console.log('================ 1. UNIFIED SERVICE DB ================');
  const uDb = await getUnifiedDb();
  
  // Distinct product codes in revenue_transactions
  const revProds = await uDb.collection('revenue_transactions').aggregate([
    { $group: { _id: '$product_code', count: { $sum: 1 }, total_amount: { $sum: '$reporting_amount' } } }
  ]).toArray();
  console.log('revenue_transactions by product_code:', revProds);

  // Sample transactions of each product
  for (const p of revProds) {
    const sample = await uDb.collection('revenue_transactions').find({ product_code: p._id }).limit(2).toArray();
    console.log(`Sample tx for ${p._id}:`, JSON.stringify(sample, null, 2));
  }

  // Subscriptions by product_code
  const subProds = await uDb.collection('subscriptions').aggregate([
    { $group: { _id: '$product_code', count: { $sum: 1 }, active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } } } }
  ]).toArray();
  console.log('subscriptions by product_code in Unified DB:', subProds);

  console.log('\n================ 2. UWO-WEB DATABASE ================');
  try {
    const uwoClient = await MongoClient.connect(MONGO_URI);
    const uwoDb = uwoClient.db('UWO-web');
    const uwoCollections = await uwoDb.listCollections().toArray();
    console.log('UWO-web collections:', uwoCollections.map(c => c.name));

    for (const col of uwoCollections) {
      if (/order|payment|sub|efv|trans|rev/i.test(col.name)) {
        const count = await uwoDb.collection(col.name).countDocuments();
        const sample = await uwoDb.collection(col.name).find({}).limit(2).toArray();
        console.log(`UWO-web.${col.name} (count: ${count}):`, JSON.stringify(sample, null, 2));
      }
    }
    await uwoClient.close();
  } catch (err) {
    console.error('UWO-web error:', err.message);
  }

  console.log('\n================ 3. AISA DATABASE ================');
  try {
    const aisaClient = await MongoClient.connect(AISA_URI);
    const aisaDb = aisaClient.db('AISA');

    const aisaSubs = await aisaDb.collection('subscriptions').find({}).toArray();
    console.log('AISA subscriptions count:', aisaSubs.length);
    console.log('All AISA subscriptions:', JSON.stringify(aisaSubs, null, 2));

    const aisaPayments = await aisaDb.collection('payments').find({}).toArray();
    console.log('AISA payments count:', aisaPayments.length);
    console.log('All AISA payments:', JSON.stringify(aisaPayments, null, 2));

    await aisaClient.close();
  } catch (err) {
    console.error('AISA error:', err.message);
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
