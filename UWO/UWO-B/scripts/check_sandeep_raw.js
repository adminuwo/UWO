const { MongoClient, ObjectId } = require('mongodb');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const AISA_URI = process.env.AISA_MONGODB_URI || 'mongodb+srv://admin_db_user:ailegal050804@cluster0.265idhx.mongodb.net/AISA?appName=Cluster0';

async function main() {
  const client = await MongoClient.connect(AISA_URI);
  const db = client.db('AISA');

  console.log('=== EXACT AISA SUBSCRIPTION DOC ===');
  const sub = await db.collection('subscriptions').findOne({ _id: new ObjectId('6a7b099b49c9c45d735fc3b6') });
  console.log(JSON.stringify(sub, null, 2));

  console.log('\n=== EXACT AISA USER DOC ===');
  const user = await db.collection('users').findOne({ _id: new ObjectId('6a6c363df39cea5b0a34f5dc') });
  console.log(JSON.stringify(user, null, 2));

  console.log('\n=== PAYMENTS FOR THIS USER OR ACCOUNT ===');
  const payments = await db.collection('payments').find({
    $or: [
      { userId: new ObjectId('6a6c363df39cea5b0a34f5dc') },
      { accountId: new ObjectId('6a6c363df39cea5b0a34f5dc') },
      { userId: '6a6c363df39cea5b0a34f5dc' },
      { accountId: '6a6c363df39cea5b0a34f5dc' },
      { subscriptionId: new ObjectId('6a7b099b49c9c45d735fc3b6') },
      { subscriptionId: '6a7b099b49c9c45d735fc3b6' }
    ]
  }).toArray();
  console.log('Payments count:', payments.length);
  console.log(JSON.stringify(payments, null, 2));

  console.log('\n=== CHECK ALL PAYMENTS IN AISA DB ===');
  const allPayments = await db.collection('payments').find({}).toArray();
  console.log('Total payments in AISA.payments:', allPayments.length);
  if (allPayments.length > 0) {
    console.log('Sample payment:', JSON.stringify(allPayments.slice(0, 3), null, 2));
  }

  await client.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
