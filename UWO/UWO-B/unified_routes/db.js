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
let connectingPromise = null;

function isTopologyOpen(mongoClient) {
  if (!mongoClient) return false;
  const top = mongoClient.topology;
  if (!top) return true; // Driver before topology initialization or active pool
  if (typeof top.isDestroyed === 'function' && top.isDestroyed()) return false;
  if (top.s && (top.s.state === 'closed' || top.s.state === 'closing')) return false;
  return true;
}

async function getUnifiedDb() {
  if (dbInstance && isTopologyOpen(client)) {
    return dbInstance;
  }

  // If cached instance exists but topology is closed, reset state and reconnect
  if (dbInstance && !isTopologyOpen(client)) {
    console.warn('[UnifiedDB] Detected closed topology on cached DB instance — reconnecting...');
    const staleClient = client;
    dbInstance = null;
    client = null;
    connectingPromise = null;
    if (staleClient) {
      staleClient.close().catch(() => {});
    }
  }

  if (connectingPromise) {
    return connectingPromise;
  }

  const isTest = process.env.NODE_ENV === 'test' || process.env.TEST_LOCAL_DB === 'true';
  const uri = isTest
    ? (process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/unified_test_db')
    : (process.env.UNIFIED_MONGODB_URI || process.env.MONGODB_URL || 'mongodb+srv://admin_db_user:uSYUbw06q4coR6Nv@unified-dashboard.wisisoq.mongodb.net/?appName=Unified-Dashboard');

  const defaultDbName = isTest ? 'unified_test_db' : (process.env.UNIFIED_MONGODB_DB_NAME || process.env.MONGODB_DB_NAME || 'unified_service_db');

  connectingPromise = (async () => {
    const newClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 20,
      retryWrites: true,
      retryReads: true,
    });

    newClient.on('topologyClosed', () => {
      if (client === newClient) {
        console.warn('[UnifiedDB] MongoClient topologyClosed event received — clearing cached instance.');
        dbInstance = null;
        client = null;
        connectingPromise = null;
      }
    });

    newClient.on('close', () => {
      if (client === newClient) {
        dbInstance = null;
        client = null;
        connectingPromise = null;
      }
    });

    try {
      await newClient.connect();
      client = newClient;
      dbInstance = newClient.db(defaultDbName);
      console.log(`[UnifiedDB] Connected successfully to database: ${defaultDbName} (isTest: ${isTest})`);
      return dbInstance;
    } catch (err) {
      connectingPromise = null;
      newClient.close().catch(() => {});
      throw err;
    }
  })();

  return connectingPromise;
}

function closeUnifiedDb() {
  connectingPromise = null;
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
