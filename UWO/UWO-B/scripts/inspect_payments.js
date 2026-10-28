require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { MongoClient } = require('mongodb');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const AISA_URI = process.env.AISA_MONGODB_URI || "";
const UNIFIED_URI = process.env.UNIFIED_MONGODB_URI || "";
const UWO_URI = process.env.MONGO_URI || "";

async function inspectDb(name, uri, defaultDbName) {
  console.log(`\n=================== INSPECTING: ${name} ===================`);
  let client;
  try {
    client = await MongoClient.connect(uri, { serverSelectionTimeoutMS: 10000 });
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    console.log('Available Databases:', dbs.databases.map(d => d.name));

    const db = client.db(defaultDbName);
    const collections = await db.listCollections().toArray();
    console.log(`Collections in ${db.databaseName}:`, collections.map(c => c.name));

    for (const c of collections) {
      const colName = c.name;
      if (/pay|order|sub|trans|rev|plan|money|bill|razor|cash|invoice|token|wallet/i.test(colName)) {
        const count = await db.collection(colName).countDocuments();
        console.log(`  ⭐ MATCHING COLLECTION: ${colName} (Count: ${count})`);
        if (count > 0) {
          const samples = await db.collection(colName).find({}).sort({ _id: -1 }).limit(3).toArray();
          console.log(`    Sample keys in ${colName}:`, Object.keys(samples[0]));
          console.log(`    Sample document:`, JSON.stringify(samples[0], null, 2));
        }
      }
    }
  } catch (err) {
    console.error(`Error inspecting ${name}:`, err.message);
  } finally {
    if (client) await client.close();
  }
}

async function main() {
  await inspectDb('AISA DB', AISA_URI, 'AISA');
  await inspectDb('Unified Dashboard DB', UNIFIED_URI, 'unified_service_db');
  await inspectDb('UWO-web DB', UWO_URI, 'UWO-web');
}

main();
