const { MongoClient } = require('mongodb');
const dns = require('dns');

// Fix ISP DNS resolution for MongoDB Atlas SRV locally on Windows if needed
if (!process.env.K_SERVICE && process.env.NODE_ENV !== 'test') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {}
}

let client = null;
let dbInstance = null;

async function getUnifiedDb() {
  if (dbInstance) {
    return dbInstance;
  }

  const isTest = process.env.NODE_ENV === 'test' || process.env.TEST_LOCAL_DB === 'true';
  const uri = isTest
    ? (process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/unified_test_db')
    : (process.env.UNIFIED_MONGODB_URI || process.env.MONGODB_URL || 'mongodb+srv://admin_db_user:uSYUbw06q4coR6Nv@unified-dashboard.wisisoq.mongodb.net/?appName=Unified-Dashboard');

  const defaultDbName = isTest ? 'unified_test_db' : (process.env.UNIFIED_MONGODB_DB_NAME || process.env.MONGODB_DB_NAME || 'unified_service_db');

  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    retryWrites: true,
  });

  await client.connect();
  dbInstance = client.db(defaultDbName);
  console.log(`[UnifiedDB] Connected successfully to database: ${defaultDbName} (isTest: ${isTest})`);
  return dbInstance;
}

function closeUnifiedDb() {
  if (client) {
    const c = client;
    client = null;
    dbInstance = null;
    return c.close();
  }
  return Promise.resolve();
}

module.exports = {
  getUnifiedDb,
  closeUnifiedDb,
};
