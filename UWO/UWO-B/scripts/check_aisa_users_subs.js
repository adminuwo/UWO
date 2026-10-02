const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}
const { MongoClient } = require('mongodb');
const AISA_URI = 'mongodb+srv://admin_db_user:ailegal050804@cluster0.265idhx.mongodb.net/AISA?appName=Cluster0';

async function main() {
  const client = await MongoClient.connect(AISA_URI);
  const db = client.db('AISA');

  console.log('=== CHECK USERS WITH SUBSCRIPTIONS IN AISA.users ===');
  const usersWithSub = await db.collection('users').find({
    subscription: { $exists: true, $ne: null }
  }).toArray();
  console.log('Total users with subscription object:', usersWithSub.length);

  const planTypes = {};
  const statusTypes = {};
  const paidUsers = [];

  for (const u of usersWithSub) {
    const s = u.subscription;
    const plan = s.plan || 'NONE';
    const status = s.status || 'NONE';
    planTypes[plan] = (planTypes[plan] || 0) + 1;
    statusTypes[status] = (statusTypes[status] || 0) + 1;

    if (plan !== 'FREE' || Number(s.amount) > 0 || s.paymentId || s.orderId) {
      paidUsers.push({
        id: u._id,
        email: u.email,
        name: u.fullName || u.name,
        phone: u.phone,
        subscription: s
      });
    }
  }

  console.log('Plan types in AISA.users:', planTypes);
  console.log('Status types in AISA.users:', statusTypes);
  console.log('Paid / Special users count:', paidUsers.length);
  console.log('Paid / Special users:', JSON.stringify(paidUsers, null, 2));

  // Check plans collection in AISA
  const plans = await db.collection('plans').find({}).toArray();
  console.log('\n=== AISA PLANS COLLECTION === count:', plans.length);
  console.log(JSON.stringify(plans, null, 2));

  await client.close();
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
