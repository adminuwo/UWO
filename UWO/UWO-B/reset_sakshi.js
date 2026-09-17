const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setPassword() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const tempPassword = 'UwoSakshi@2026';
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(tempPassword, salt);
  
  await db.collection('ref_users').updateOne(
    { email: 'sakshi@uwo24.com' },
    { $set: { password: hashed, updatedAt: new Date() } }
  );

  const user = await db.collection('ref_users').findOne({ email: 'sakshi@uwo24.com' });
  console.log('✅ Sakshi password updated successfully!');
  console.log('User ID:', user.userId);
  console.log('Email:', user.email);
  console.log('Password:', tempPassword);

  await mongoose.disconnect();
}

setPassword().catch(console.error);
