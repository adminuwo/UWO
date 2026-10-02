const { getUnifiedDb } = require('../unified_routes/db');

async function main() {
  const db = await getUnifiedDb();
  
  console.log('=== EFV TRANSACTIONS IN REVENUE_TRANSACTIONS ===');
  const efvTxs = await db.collection('revenue_transactions').find({ product_code: 'efvframework' }).toArray();
  console.log('EFV tx count:', efvTxs.length);
  const efvStatus = {};
  const efvCustomers = {};
  for (const t of efvTxs) {
    efvStatus[t.status] = (efvStatus[t.status] || 0) + 1;
    if (t.customer_email) {
      efvCustomers[t.customer_email] = (efvCustomers[t.customer_email] || 0) + 1;
    }
  }
  console.log('EFV status breakdown:', efvStatus);
  console.log('EFV customer emails count:', Object.keys(efvCustomers).length);
  console.log('EFV sample customer emails:', Object.keys(efvCustomers).slice(0, 10));

  console.log('\n=== AISA TRANSACTIONS IN REVENUE_TRANSACTIONS ===');
  const aisaTxs = await db.collection('revenue_transactions').find({ product_code: 'aisa' }).toArray();
  console.log('AISA tx count:', aisaTxs.length);
  const aisaStatus = {};
  const aisaCustomers = {};
  for (const t of aisaTxs) {
    aisaStatus[t.status] = (aisaStatus[t.status] || 0) + 1;
    if (t.customer_email) {
      aisaCustomers[t.customer_email] = (aisaCustomers[t.customer_email] || 0) + 1;
    }
  }
  console.log('AISA status breakdown:', aisaStatus);
  console.log('AISA customer emails count:', Object.keys(aisaCustomers).length);
  console.log('AISA sample customer emails:', Object.keys(aisaCustomers).slice(0, 10));

  // Check UWO-web payments collection
  const { MongoClient } = require('mongodb');
  const MONGO_URI = 'mongodb+srv://uwo_admin:uwo%4012345@cluster0.selr4is.mongodb.net/UWO-web?retryWrites=true&w=majority';
  const uClient = await MongoClient.connect(MONGO_URI);
  const uDb = uClient.db('UWO-web');
  const uPayments = await uDb.collection('payments').find({}).toArray();
  console.log('\n=== UWO-WEB PAYMENTS === count:', uPayments.length);
  if (uPayments.length > 0) {
    console.log(JSON.stringify(uPayments.slice(0, 3), null, 2));
  }
  await uClient.close();
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
