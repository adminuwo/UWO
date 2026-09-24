const { MongoClient } = require('mongodb');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const AISA_URI = 'mongodb+srv://admin_db_user:ailegal050804@cluster0.265idhx.mongodb.net/AISA?appName=Cluster0';

async function main() {
  const client = await MongoClient.connect(AISA_URI, { serverSelectionTimeoutMS: 10000 });
  const db = client.db('AISA');

  const targets = ['payments', 'paymenthistories', 'subscriptions', 'plans', 'planusages', 'subscriptionitems', 'creditpackages', 'creditlogs'];

  for (const t of targets) {
    const count = await db.collection(t).countDocuments();
    console.log(`\n================ Collection: ${t} (Count: ${count}) ================`);
    if (count > 0) {
      const docs = await db.collection(t).find({}).sort({ _id: -1 }).limit(5).toArray();
      console.log('Sample docs:', JSON.stringify(docs, null, 2));
    }
  }

  await client.close();
}

main().catch(console.error);
