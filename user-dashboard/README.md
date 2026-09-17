# 🚀 Multi-Device Smart Referral & App Attribution System

A production-ready, distributed referral system designed to be hosted under a subdomain (e.g. `referrals.yourdomain.com`) and integrated into any existing website via a drop-in button and popup form.

It features **multi-device smart routing** (Desktop $\rightarrow$ Web, Android $\rightarrow$ Google Play Store, iOS $\rightarrow$ App Store), **Unique Click tracking**, and **verified app install attribution** (Google Play Referrer API + iOS IP matching with a 2–4 hour window).

---

## 🌟 Key Features

1. **Drop-in Website Button & Popup (`embed.js`)**:
   - Easily drop a button on your existing website (`<button id="referral-btn">Refer & Earn</button>`).
   - Clicking it triggers an elegant modal popup requesting **Full Name** and **Email**.
   - Auto-generates a unique **User ID** (e.g. `USR-82419`) and secure password, dispatched via email (Nodemailer).

2. **Decoupled Architecture**:
   - **`backend/`**: Node.js & Express API with MongoDB, JWT authentication, and redirection routing.
   - **`frontend/`**: React + Vite + Tailwind CSS referral dashboard.
   - **`embed/`**: Lightweight vanilla JS widget and integration demo for client websites.

3. **Smart Device Redirection Engine (`/r/:code`)**:
   - 💻 **Desktop / Laptop** $\rightarrow$ Redirects to Web URL with `?ref=CODE&ref_by=USER_ID`.
   - 🤖 **Android Mobile / Tablet** $\rightarrow$ Redirects to Google Play Store with Install Referrer tag.
   - 🍏 **iOS (iPhone / iPad)** $\rightarrow$ Captures IP + Fingerprint (3-hour TTL) and redirects to Apple App Store.

4. **App Install Attribution**:
   - **Android**: Verified downloads tracked via Google Play Install Referrer library.
   - **iOS**: Verified downloads attributed via IP & Fingerprint matching within a 2–4 hour TTL window on first app open.

5. **Advanced Analytics**:
   - **Total Clicks vs. Unique Clicks** per referral link (tracks distinct visitor IPs).
   - Real-time device breakdown: Desktop, Android Play Store, and iOS App Store.
   - Verified app downloads count.

6. **Project Management**:
   - Add, edit, and delete projects from the dashboard.
   - Configure optional Web, Play Store, and App Store URLs (with at least 1 mandatory).

---

## 📁 Repository Structure

```
├── backend/                  # Node.js & Express API (Port 5000)
│   ├── src/
│   │   ├── config/db.js      # MongoDB connection
│   │   ├── models/           # Mongoose models (User, Product, ReferralLink, ClickLog, etc.)
│   │   ├── routes/           # Express routes (auth, products, links, conversions, redirect)
│   │   ├── services/mailer.js# Nodemailer credential email service
│   │   ├── utils/ip.js       # Robust client IP detection (proxies, Cloudflare, etc.)
│   │   └── server.js         # Express app entry point
│   ├── scripts/
│   │   ├── seed.js           # Seed demo account & sample projects
│   │   └── simulate.js       # Automated tests for Desktop, Android, & iOS attribution
│   ├── public/embed.js       # Hosted drop-in widget
│   └── package.json
│
├── frontend/                 # React + Vite User Portal (Port 5173)
│   ├── src/
│   │   ├── pages/            # DashboardPage, LoginPage, HomePage
│   │   ├── services/api.js   # Centralized API service
│   │   └── App.jsx           # Main routing & state
│   └── package.json
│
├── embed/                    # Client Integration Assets
│   ├── embed.js              # Standalone drop-in widget
│   └── index.html            # Working demo simulating an existing website
│
├── INTEGRATION_GUIDE.md      # Detailed developer handoff & code snippets
├── SUBDOMAIN_SETUP.md        # DNS, reverse proxy & subdomain deployment instructions
└── package.json              # Root workspace convenience scripts
```

---

## ⚡ Quick Start

### 1. Install & Seed
```bash
# Seed demo account (USR-DEMO1 / Demo@12345) and sample projects
npm run seed
```

### 2. Start Development Servers
From the root directory:
```bash
# Terminal 1: Start Backend API (http://localhost:5000)
npm run dev:backend

# Terminal 2: Start Frontend Dashboard (http://localhost:5173)
npm run dev:frontend
```

### 3. Run Automated Tests
```bash
npm run simulate
```
Verifies Desktop redirection, Android Play Store referrer parameters, and iOS IP/fingerprint matching within seconds.

---

## 📘 Developer Integration

For full copy-paste code snippets for your website, Android app (Kotlin), and iOS app (Swift), please see:
👉 **[`INTEGRATION_GUIDE.md`](./INTEGRATION_GUIDE.md)**
