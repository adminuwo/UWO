const express = require('express');
const router = express.Router();
const { getUnifiedDb } = require('./db');

// POST /api/logs
router.post('/', async (req, res) => {
  try {
    const db = await getUnifiedDb();
    const body = req.body || {};

    const logEntry = {
      application_id: body.application_id || req.headers['x-application-key'] || 'client_app',
      level: (body.level || 'INFO').toUpperCase(),
      event: body.event || 'GENERAL_EVENT',
      message: body.message || '',
      metadata: body.metadata || null,
      user_id: body.user_id || null,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      created_at: new Date()
    };

    await db.collection('logs').insertOne(logEntry);
    return res.status(201).json({ success: true, message: 'Log recorded.' });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/logs
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 500);
    const db = await getUnifiedDb();
    const logs = await db.collection('logs')
      .find({})
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();

    return res.json(logs.map(l => ({
      id: String(l._id || l.id),
      application_id: l.application_id || '',
      level: l.level || 'INFO',
      event: l.event || '',
      message: l.message || '',
      metadata: l.metadata || null,
      created_at: l.created_at || null
    })));
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

module.exports = router;
