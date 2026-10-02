const { getUnifiedDb } = require('../unified_routes/db');

function formatNameFromEmail(email) {
  if (!email) return 'Subscriber';
  const prefix = email.split('@')[0];
  const cleaned = prefix.replace(/[._0-9-]/g, ' ').trim();
  if (!cleaned) return prefix;
  return cleaned.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function determineTier(amount, productCode) {
  const amt = Number(amount) || 0;
  if (productCode === 'efvframework') {
    if (amt >= 1200) return 'ENTERPRISE';
    if (amt >= 800) return 'PROFESSIONAL';
    if (amt >= 400) return 'BASIC';
    return 'STARTER';
  }
  if (amt >= 2000) return 'ENTERPRISE';
  if (amt >= 800) return 'PROFESSIONAL';
  if (amt >= 400) return 'BASIC';
  return 'STARTER';
}

async function run() {
  const db = await getUnifiedDb();
  console.log('Connecting to Unified DB...');

  // 1. Process AISA completed transactions
  const aisaTxs = await db.collection('revenue_transactions').find({
    product_code: 'aisa',
    status: 'completed',
    customer_email: { $ne: null }
  }).sort({ transaction_date: -1 }).toArray();

  const aisaMap = {};
  for (const t of aisaTxs) {
    if (!aisaMap[t.customer_email]) aisaMap[t.customer_email] = t;
  }

  const aisaOps = [];
  for (const [email, t] of Object.entries(aisaMap)) {
    const amt = Number(t.reporting_amount || t.gross_amount) || 499;
    const tier = determineTier(amt, 'aisa');
    const txDate = t.transaction_date ? new Date(t.transaction_date) : new Date();
    const expiry = new Date(txDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const sid = `aisa_sub_${t.external_transaction_id}`;

    const subDoc = {
      _id: sid,
      subscription_id: sid,
      source: 'aisa_payments',
      product_code: 'aisa',
      product_name: 'AISA Assistant',
      customer_id: t.customer_id || null,
      customer_email: email,
      customer_name: formatNameFromEmail(email),
      customer_phone: t.metadata?.vpa || '',
      workspace: 'default',
      tier: tier,
      plan_name: `AISA Assistant ${tier.charAt(0) + tier.slice(1).toLowerCase()} Plan`,
      billing_cycle: 'monthly',
      billing_type: 'individual',
      amount: amt,
      currency: t.currency || 'INR',
      status: 'active', // dynamically evaluated on read
      platform: t.platform || 'web',
      provider: t.provider || 'razorpay',
      transaction_id: t.external_transaction_id,
      order_id: t.external_order_id || '',
      invoice_id: '',
      start_date: txDate,
      expiry_date: expiry,
      auto_renew: false,
      created_at: txDate,
      updated_at: new Date()
    };

    aisaOps.push({
      replaceOne: {
        filter: {
          $or: [
            { _id: sid },
            { transaction_id: t.external_transaction_id },
            { customer_email: email, product_code: 'aisa' }
          ]
        },
        replacement: subDoc,
        upsert: true
      }
    });
  }

  // 2. Process EFV completed transactions
  const efvTxs = await db.collection('revenue_transactions').find({
    product_code: 'efvframework',
    status: 'completed',
    customer_email: { $ne: null }
  }).sort({ transaction_date: -1 }).toArray();

  const efvMap = {};
  for (const t of efvTxs) {
    if (!efvMap[t.customer_email]) efvMap[t.customer_email] = t;
  }

  const efvOps = [];
  for (const [email, t] of Object.entries(efvMap)) {
    const amt = Number(t.reporting_amount || t.gross_amount) || 499;
    const tier = determineTier(amt, 'efvframework');
    const txDate = t.transaction_date ? new Date(t.transaction_date) : new Date();
    const expiry = new Date(txDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const sid = `efv_sub_${t.external_transaction_id}`;

    const subDoc = {
      _id: sid,
      subscription_id: sid,
      source: 'efv_payments',
      product_code: 'efvframework',
      product_name: 'EFV Framework',
      customer_id: t.customer_id || null,
      customer_email: email,
      customer_name: formatNameFromEmail(email),
      customer_phone: t.metadata?.vpa || '',
      workspace: 'efv',
      tier: tier,
      plan_name: `EFV Framework ${tier.charAt(0) + tier.slice(1).toLowerCase()} Subscription`,
      billing_cycle: 'monthly',
      billing_type: 'individual',
      amount: amt,
      currency: t.currency || 'INR',
      status: 'active', // dynamically evaluated on read
      platform: t.platform || 'web',
      provider: t.provider || 'razorpay_efv',
      transaction_id: t.external_transaction_id,
      order_id: t.external_order_id || '',
      invoice_id: '',
      start_date: txDate,
      expiry_date: expiry,
      auto_renew: false,
      created_at: txDate,
      updated_at: new Date()
    };

    efvOps.push({
      replaceOne: {
        filter: {
          $or: [
            { _id: sid },
            { transaction_id: t.external_transaction_id },
            { customer_email: email, product_code: 'efvframework' }
          ]
        },
        replacement: subDoc,
        upsert: true
      }
    });
  }

  console.log(`Executing ${aisaOps.length} AISA subscription upserts...`);
  if (aisaOps.length > 0) {
    const r1 = await db.collection('subscriptions').bulkWrite(aisaOps, { ordered: false });
    console.log('AISA result:', { upserted: r1.upsertedCount, modified: r1.modifiedCount });
  }

  console.log(`Executing ${efvOps.length} EFV subscription upserts...`);
  if (efvOps.length > 0) {
    const r2 = await db.collection('subscriptions').bulkWrite(efvOps, { ordered: false });
    console.log('EFV result:', { upserted: r2.upsertedCount, modified: r2.modifiedCount });
  }

  // Count by product
  const counts = await db.collection('subscriptions').aggregate([
    { $group: { _id: '$product_code', count: { $sum: 1 } } }
  ]).toArray();
  console.log('Final subscriptions count by product in DB:', counts);

  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
