# 🌐 Subdomain Setup & Deployment Guide

This guide walks you through deploying this referral system live and linking it under your custom subdomain (e.g. `referrals.yourdomain.com`).

---

## 1. Hosting Options

### Option A: Deploy on Vercel (Recommended - Free & Fast)
1. Push this project to your GitHub account (`git init`, `git add .`, `git commit -m "initial"`, `git push`).
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Under **Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection URI (e.g., `mongodb+srv://<user>:<password>@cluster.mongodb.net/referral_db?retryWrites=true&w=majority`)
   - `JWT_SECRET`: Any 32+ character random string
   - `NEXT_PUBLIC_APP_URL`: `https://referrals.yourdomain.com`
   - `SMTP_ENABLE`: `true`
   - `SMTP_HOST`: e.g. `smtp.gmail.com`
   - `SMTP_PORT`: `587`
   - `SMTP_USER`: your sending email
   - `SMTP_PASS`: your email app password
   - `SMTP_FROM`: `"Referral Portal" <noreply@yourdomain.com>`
5. Click **Deploy**.

### Option B: Deploy on VPS or Cloud Server (Node.js + PM2 / Docker)
1. Clone the repository onto your server.
2. Run `npm install` and `npm run build`.
3. Start the process with PM2:
   ```bash
   pm2 start npm --name "referral-portal" -- start
   ```
4. Set up Nginx as a reverse proxy forwarding port 3000 to your subdomain `referrals.yourdomain.com`.

---

## 2. Pointing Your Subdomain in DNS

Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, Hostinger, AWS Route53, etc.):

1. Open your domain's **DNS Management** settings.
2. Add a new **CNAME** record:
   - **Type**: `CNAME`
   - **Name / Host**: `referrals` (or whatever subdomain you want, e.g. `rewards`)
   - **Value / Target**:
     - For Vercel: `cname.vercel-dns.com`
     - For Render / Custom VPS: your server IP (`A` record) or provider target
   - **TTL**: `Automatic` or `300`
3. If using Vercel, go to **Settings -> Domains** in your Vercel project, enter `referrals.yourdomain.com`, and Vercel will automatically provision a free SSL certificate (HTTPS) for you.

---

## 3. Integrating with Your Existing Website's Button

Once your subdomain is live (e.g., `https://referrals.yourdomain.com`), open your main website's HTML / code:

### Step 1: Add the Button
Place a button wherever you want on your page (Navbar, Footer, Hero):
```html
<button id="referral-btn" class="referral-btn">
  Refer & Earn 🎁
</button>
```

### Step 2: Add the Embed Script
Place this script before your closing `</body>` tag:
```html
<script src="https://referrals.yourdomain.com/embed.js"></script>
```

### What happens next?
* When someone clicks the button on your main site, the popup modal appears instantly.
* They enter their Name and Email.
* Their unique **User ID** and **Password** are emailed to them.
* They log into `https://referrals.yourdomain.com/login` and generate links that smartly route:
  - 💻 Desktops to your Web URL
  - 🤖 Android phones to your Play Store URL
  - 🍏 iPhones to your App Store URL
