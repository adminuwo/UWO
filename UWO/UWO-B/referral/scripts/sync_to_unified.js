const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const { syncAllReferralDataToUnified } = require('../utils/marketingSync');

async function run() {
  console.log('🔄 Connecting to MongoDB (UWO-web)...');
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/uwo_database';
  
  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 20000,
    socketTimeoutMS: 45000,
  });
  console.log('✅ Connected to UWO-web MongoDB');

  const res = await syncAllReferralDataToUnified();
  console.log('🎉 Sync Result Summary:', JSON.stringify(res, null, 2));

  await mongoose.disconnect();
  console.log('✅ All done!');
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error executing sync:', err);
  process.exit(1);
});
