const { MongoClient, ObjectId } = require('mongodb');
const { getUnifiedDb } = require('../unified_routes/db');

const AISA_URI = 'mongodb+srv://admin_db_user:ailegal050804@cluster0.265idhx.mongodb.net/AISA?appName=Cluster0';

async function main() {
  const unifiedDb = await getUnifiedDb();
  const subUnified = await unifiedDb.collection('subscriptions').findOne({ customer_email: /sandeep/i });
  console.log('=== UNIFIED SUBSCRIPTION ===\n', JSON.stringify(subUnified, null, 2));

  const client = await MongoClient.connect(AISA_URI);
  const aisaDb = client.db('AISA');

  console.log('\n=== AISA SUBSCRIPTIONS COLLECTION ===');
  let rawSub = null;
  try {
    rawSub = await aisaDb.collection('subscriptions').findOne({ _id: new ObjectId('6a7b099b49c9c45d735fc3b6') });
  } catch (e) {
    rawSub = await aisaDb.collection('subscriptions').findOne({ _id: '6a7b099b49c9c45d735fc3b6' });
  }
  console.log('Raw Sub Doc:', JSON.stringify(rawSub, null, 2));

  if (rawSub) {
    const accId = rawSub.accountId || rawSub.userId;
    console.log('\nAccount ID:', accId);

    let user = null;
    try {
      user = await aisaDb.collection('users').findOne({ _id: new ObjectId(String(accId)) });
    } catch (e) {}
    if (!user) {
      user = await aisaDb.collection('users').findOne({ _id: String(accId) });
    }
    console.log('\n=== AISA USER ===\n', JSON.stringify(user, null, 2));

    const payments = await aisaDb.collection('payments').find({
      $or: [
        { subscriptionId: rawSub._id },
        { subscriptionId: String(rawSub._id) },
        { accountId: accId },
        { userId: accId },
        { email: user?.email }
      ]
    }).toArray();
    console.log('\n=== AISA PAYMENTS ===\n', JSON.stringify(payments, null, 2));
  }

  // Check all collections in AISA related to apple / storekit / webhook
  const collections = await aisaDb.listCollections().toArray();
  console.log('\n=== AISA COLLECTIONS ===', collections.map(c => c.name));

  for (const c of collections) {
    if (/apple|storekit|webhook|receipt|notif|order|inapp/i.test(c.name)) {
      const docs = await aisaDb.collection(c.name).find({}).limit(5).toArray();
      console.log(`\nSample docs from ${c.name}:`, JSON.stringify(docs, null, 2));
    }
  }

  await client.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
