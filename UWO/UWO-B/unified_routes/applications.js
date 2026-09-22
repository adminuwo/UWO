const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getUnifiedDb } = require('./db');

function hashApiKey(plainKey) {
  return crypto.createHash('sha256').update(plainKey).digest('hex');
}

// GET /api/applications/keys
router.get('/keys', async (req, res) => {
  try {
    const db = await getUnifiedDb();
    const keys = await db.collection('application_keys')
      .find({})
      .sort({ created_at: -1, createdAt: -1 })
      .toArray();

    return res.json(keys.map(k => ({
      id: String(k._id || k.id),
      _id: String(k._id || k.id),
      application_name: k.application_name || 'Ecosystem App',
      app_code: k.app_code || 'general',
      api_key_preview: k.api_key_preview || (k.api_key ? k.api_key.substring(0, 10) + '...' : 'key_••••••••'),
      status: k.status || 'active',
      created_at: k.created_at || k.createdAt || new Date().toISOString(),
      updated_at: k.updated_at || k.updatedAt || new Date().toISOString()
    })));
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/applications/keys
router.post('/keys', async (req, res) => {
  try {
    const db = await getUnifiedDb();
    const body = req.body || {};
    const appName = body.application_name || body.name || 'New Application';
    const appCode = body.app_code || appName.toLowerCase().replace(/[^a-z0-9]/g, '');

    const plaintextKey = `key_${crypto.randomBytes(24).toString('base64url')}`;
    const keyHash = hashApiKey(plaintextKey);
    const preview = `${plaintextKey.substring(0, 10)}...${plaintextKey.substring(plaintextKey.length - 4)}`;

    const now = new Date();
    const keyDoc = {
      application_name: appName,
      app_code: appCode,
      api_key_hash: keyHash,
      api_key_preview: preview,
      status: 'active',
      created_at: now,
      updated_at: now
    };

    const insertResult = await db.collection('application_keys').insertOne(keyDoc);
    const keyId = String(insertResult.insertedId);

    return res.status(201).json({
      id: keyId,
      _id: keyId,
      application_name: appName,
      app_code: appCode,
      api_key: plaintextKey,
      api_key_preview: preview,
      status: 'active',
      created_at: now.toISOString()
    });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// DELETE /api/applications/keys/:id
router.delete('/keys/:id', async (req, res) => {
  try {
    const db = await getUnifiedDb();
    const id = req.params.id;

    let query = { _id: id };
    try {
      const { ObjectId } = require('mongodb');
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
      }
    } catch (e) {}

    await db.collection('application_keys').updateOne(query, {
      $set: { status: 'revoked', updated_at: new Date() }
    });

    return res.json({ success: true, message: 'Application key revoked successfully.' });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
