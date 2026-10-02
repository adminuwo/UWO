const { getUnifiedDb } = require('../unified_routes/db');
const { MongoClient } = require('mongodb');

const AISA_URI = process.env.AISA_MONGODB_URI || 'mongodb+srv://admin_db_user:ailegal050804@cluster0.265idhx.mongodb.net/AISA?appName=Cluster0';

async function main() {
  const db = await getUnifiedDb();
  const sub = await db.collection('subscriptions').findOne({ customer_email: /sandeep/i });
  console.log('=== UNIFIED SERVICE DB SUBSCRIPTION ===');
  console.log(JSON.stringify(sub, null, 2));

  if (sub) {
    const txs = await db.collection('revenue_transactions').find({
      customer_email: sub.customer_email
    }).toArray();
    console.log('=== UNIFIED REVENUE TRANSACTIONS ===');
    console.log('Count:', txs.length);
    console.log(JSON.stringify(txs, null, 2));
  }

  // Connect to AISA Atlas DB to check raw records
  console.log('\n=== AISA ATLAS DB CHECKS ===');
  const client = await MongoClient.connect(AISA_URI);
  const aisaDb = client.db('AISA');

  const user = await aisaDb.collection('users').findOne({ email: /sandeep/i });
  console.log('AISA User:', JSON.stringify(user, null, 2));

  if (user) {
    const aisaSubs = await aisaDb.collection('subscriptions').find({
      $or: [
        { userId: user._id },
        { accountId: user._id },
        { userId: String(user._id) },
        { accountId: String(user._id) },
        { customer_email: user.email }
      ]
    }).toArray();
    console.log('AISA Subscriptions for user:', JSON.stringify(aisaSubs, null, 2));

    const aisaPayments = await aisaDb.collection('payments').find({
      $or: [
        { userId: user._id },
        { accountId: user._id },
        { email: user.email }
      ]
    }).toArray();
    console.log('AISA Payments for user:', JSON.stringify(aisaPayments, null, 2));
  }

  await client.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
