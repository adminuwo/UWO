const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const { getClientIp } = require('./utils/ip');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const linkRoutes = require('./routes/links');
const redirectRoutes = require('./routes/redirect');
const conversionRoutes = require('./routes/conversions');

const app = express();

// Trust reverse proxies (Cloudflare, Nginx, Vercel, Heroku, AWS ELB, tunnels)
app.set('trust proxy', true);

// Connect to MongoDB
connectDB();

// CORS configuration (allow requests from frontend, mobile apps, and client websites)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Serve static assets (such as embed.js)
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/conversions', conversionRoutes);

// Redirection Engine
app.use('/r', redirectRoutes);

// IP Inspector Endpoint (lets you see your detected IP live from any phone/browser)
app.get('/my-ip', (req, res) => {
  const detectedIp = getClientIp(req);
  res.json({
    success: true,
    detectedIp,
    remoteAddress: req.socket?.remoteAddress,
    xForwardedFor: req.headers['x-forwarded-for'] || null,
    cfConnectingIp: req.headers['cf-connecting-ip'] || null,
    userAgent: req.headers['user-agent'],
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Referral System Backend API', time: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Referral Backend running on port ${PORT}`);
  console.log(` Redirection Engine active at http://localhost:${PORT}/r/:code`);
});
