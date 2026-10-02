const { getUnifiedDb } = require('../unified_routes/db');

async function cleanup() {
  const db = await getUnifiedDb();
  const delRes = await db.collection('subscriptions').deleteMany({
    product_code: { $in: ['efvframework', 'aimall', 'uwo', 'uwoconnect'] }
  });
  console.log('Deleted non-subscription records from subscriptions collection:', delRes.deletedCount);

  const remaining = await db.collection('subscriptions').find({}).toArray();
  const byProd = {};
  remaining.forEach(s => {
    byProd[s.product_code] = (byProd[s.product_code] || 0) + 1;
  });
  console.log('Remaining subscriptions count:', remaining.length);
  console.log('Remaining by product_code:', byProd);
  process.exit(0);
}

cleanup().catch(err => {
  console.error(err);
  process.exit(1);
});
