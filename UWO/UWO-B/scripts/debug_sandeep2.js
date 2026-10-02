const { MongoClient, ObjectId } = require('mongodb');
const AISA_URI = 'mongodb+srv://admin_db_user:ailegal050804@cluster0.265idhx.mongodb.net/AISA?appName=Cluster0';

async function main() {
  const client = await MongoClient.connect(AISA_URI);
  const aisaDb = client.db('AISA');

  const rawSub = await aisaDb.collection('subscriptions').findOne({ _id: new ObjectId('6a7b099b49c9c45d735fc3b6') });
  console.log('=== RAW SUB ===\n', JSON.stringify(rawSub, null, 2));

  const accId = rawSub.accountId || rawSub.userId;
  const user = await aisaDb.collection('users').findOne({ _id: new ObjectId(String(accId)) });
  console.log('\n=== USER SUBSCRIPTION FIELD ===\n', JSON.stringify(user?.subscription, null, 2));
  console.log('\n=== USER EMAIL & NAME ===\n', user?.email, user?.name, user?.fullName);

  const paymentHistories = await aisaDb.collection('paymenthistories').find({
    $or: [
      { userId: user?._id },
      { accountId: user?._id },
      { user_id: user?._id },
      { email: user?.email },
      { customer_email: user?.email }
    ]
  }).toArray();
  console.log('\n=== PAYMENT HISTORIES ===\n', JSON.stringify(paymentHistories, null, 2));

  // Check subscriptionitems
  const subItems = await aisaDb.collection('subscriptionitems').find({
    $or: [
      { subscriptionId: rawSub._id },
      { subscriptionId: String(rawSub._id) }
    ]
  }).toArray();
  console.log('\n=== SUB ITEMS ===\n', JSON.stringify(subItems, null, 2));

  await client.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
