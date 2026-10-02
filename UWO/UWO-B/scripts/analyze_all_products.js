const { getUnifiedDb } = require('../unified_routes/db');

async function main() {
  const db = await getUnifiedDb();
  const prods = ['aisa', 'efvframework', 'ailegal', 'other'];

  for (const p of prods) {
    const total = await db.collection('revenue_transactions').countDocuments({ product_code: p });
    const completed = await db.collection('revenue_transactions').countDocuments({ product_code: p, status: 'completed' });
    const distinctEmails = await db.collection('revenue_transactions').distinct('customer_email', { product_code: p });
    const validEmails = distinctEmails.filter(Boolean);

    console.log(`Product: ${p} | Total Tx: ${total} | Completed: ${completed} | Unique Customers: ${validEmails.length}`);
    
    // Check amounts and dates of completed
    const completedDocs = await db.collection('revenue_transactions')
      .find({ product_code: p, status: 'completed' })
      .sort({ transaction_date: -1 })
      .limit(5)
      .toArray();

    console.log(`  Recent completed for ${p}:`, completedDocs.map(d => ({
      email: d.customer_email,
      amount: d.reporting_amount || d.gross_amount,
      date: d.transaction_date,
      txId: d.external_transaction_id,
      platform: d.platform,
      provider: d.provider
    })));
  }

  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
