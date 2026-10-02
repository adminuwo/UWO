const { getUnifiedDb } = require('../unified_routes/db');

async function main() {
  const db = await getUnifiedDb();
  
  // Get all completed transactions grouped by customer for AISA
  const aisaCompleted = await db.collection('revenue_transactions').find({
    product_code: 'aisa',
    status: 'completed',
    customer_email: { $ne: null }
  }).sort({ transaction_date: -1 }).toArray();

  console.log('AISA completed txs with email:', aisaCompleted.length);
  const aisaUnique = {};
  for (const t of aisaCompleted) {
    if (!aisaUnique[t.customer_email]) {
      aisaUnique[t.customer_email] = t;
    }
  }
  console.log('AISA unique customers with completed txs:', Object.keys(aisaUnique).length);
  for (const [email, t] of Object.entries(aisaUnique)) {
    console.log(`AISA: ${email} | Amount: ${t.reporting_amount || t.gross_amount} | Date: ${t.transaction_date} | TxId: ${t.external_transaction_id}`);
  }

  // Get all completed transactions grouped by customer for EFV
  const efvCompleted = await db.collection('revenue_transactions').find({
    product_code: 'efvframework',
    status: 'completed',
    customer_email: { $ne: null }
  }).sort({ transaction_date: -1 }).toArray();

  console.log('\nEFV completed txs with email:', efvCompleted.length);
  const efvUnique = {};
  for (const t of efvCompleted) {
    if (!efvUnique[t.customer_email]) {
      efvUnique[t.customer_email] = t;
    }
  }
  console.log('EFV unique customers with completed txs:', Object.keys(efvUnique).length);
  for (const [email, t] of Object.entries(efvUnique)) {
    console.log(`EFV: ${email} | Amount: ${t.reporting_amount || t.gross_amount} | Date: ${t.transaction_date} | TxId: ${t.external_transaction_id}`);
  }

  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
