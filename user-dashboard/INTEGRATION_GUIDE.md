# 📘 Developer Integration Guide: Smart Referral System

Welcome! This guide is written for developers integrating this referral system into an existing website, web app, Android app, or iOS app.

---

## 🏗️ Architecture Overview

The system is split into three decoupled components:

1. **`backend/` (Node.js & Express API — Port 5000)**:
   - MongoDB database (Users, Projects, Referral Links, Click Logs, Pending Attributions, Download Logs).
   - Smart device redirection engine at `/r/:code`.
   - Unique click detection per IP.
   - Android Google Play Install Referrer tracking.
   - iOS IP + Fingerprint matching with 2–4 hour TTL.
   - Automated email dispatch of login credentials via Nodemailer.

2. **`frontend/` (React + Vite + Tailwind CSS — Port 5173)**:
   - Referral portal dashboard for users (designed to host on a subdomain like `referrals.yourdomain.com`).
   - Project management (Add/Edit/Delete projects with optional Web, Android, and iOS destination URLs).
   - Real-time click analytics (Desktop, Android, iOS, Total vs. Unique) and verified app downloads.
   - Built-in multi-device simulator to test all platform flows without physical devices.

3. **`embed/` (Drop-in Website Widget & Demo)**:
   - `embed.js`: A lightweight vanilla JavaScript widget that adds a "Refer & Earn" button and modal to your existing website.
   - `index.html`: An interactive demo simulating an existing website.

---

## ⚡ Quick Start: Running the Project Locally

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

### 2. Environment Variables
Both `backend/` and `frontend/` have pre-configured `.env` files:
- **`backend/.env`**:
  ```env
  PORT=5000
  MONGODB_URI=mongodb://localhost:27017/referral_db
  JWT_SECRET=supersecret_referral_jwt_key_982341
  FRONTEND_URL=http://localhost:5173
  SMTP_ENABLE=false
  ```
  *(When `SMTP_ENABLE=false`, generated user credentials print directly to the backend terminal for instant local testing!)*

- **`frontend/.env`**:
  ```env
  VITE_API_BASE_URL=http://localhost:5000
  ```

### 3. Start the Services
From the root project directory:
```bash
# 1. Seed demo account & sample projects
npm run seed

# 2. Start Backend (Runs on http://localhost:5000)
npm run dev:backend

# 3. Start Frontend Dashboard (Runs on http://localhost:5173)
npm run dev:frontend
```

🔑 **Demo Account Credentials**:
- **User ID**: `USR-DEMO1` *(or email: `demo@example.com`)*
- **Password**: `Demo@12345`

### 4. Run Automated Simulation Tests (No Devices Needed)
```bash
npm run simulate
```
This tests Desktop redirection, Android Google Play Referrer parameters, and iOS IP/fingerprint matching with TTL window in under 2 seconds!

---

## 🌐 1. Website Drop-in Button Integration

To allow visitors on your existing website to join the referral program:

### Step A: Place the Button
Add a button anywhere on your HTML page with `id="referral-btn"`:
```html
<button id="referral-btn" class="my-button-style">
  Refer & Earn 🎁
</button>
```

### Step B: Include the Script
Include `embed.js` right before the closing `</body>` tag:
```html
<!-- In production, point to your deployed backend URL: -->
<script src="https://api.yourdomain.com/embed.js"></script>

<!-- For local development: -->
<!-- <script src="http://localhost:5000/embed.js"></script> -->
```

### What Happens Automatically:
1. Clicking the button opens a modern modal requesting **Full Name** and **Email**.
2. Submitting creates a unique user account (auto-generating `User ID` like `USR-82419` and password).
3. Sends login credentials via email (or prints to console in dev mode).
4. Displays a success screen with a direct button to log into the referral dashboard (`https://referrals.yourdomain.com`).

---

## 🔀 2. Smart Redirection Engine (`/r/:code`)

When a referrer shares their link (`https://api.yourdomain.com/r/code`):

| Device Type Detected | Redirection Destination | Tracking Mechanism |
| :--- | :--- | :--- |
| **Desktop / Laptop** (Windows, Mac, Linux) | Project Web URL | Query params: `?ref=CODE&ref_by=USER_ID` |
| **Android Mobile / Tablet** | Google Play Store URL | Play Referrer tag: `&referrer=utm_source=referral&ref=CODE&ref_by=USER_ID` |
| **iOS** (iPhone, iPad) | Apple App Store URL | Client IP + SHA-256 fingerprint saved in MongoDB (3h TTL) |

> **Fallback Rule**: If a project doesn't have an Android or iOS URL configured, it automatically falls back to the Web URL.

---

## 🤖 3. Android App Integration (Google Play Referrer)

When a user installs the Android app from the Play Store via a referral link, the Play Store preserves the referral parameters.

### Step A: Add Dependency (`build.gradle`)
```groovy
implementation 'com.android.installreferrer:installreferrer:2.2'
```

### Step B: Read Referrer on First Open (Kotlin)
```kotlin
import com.android.installreferrer.api.InstallReferrerClient
import com.android.installreferrer.api.InstallReferrerStateListener
import java.net.URLDecoder

val referrerClient = InstallReferrerClient.newBuilder(context).build()
referrerClient.startConnection(object : InstallReferrerStateListener {
    override fun onInstallReferrerSetupFinished(responseCode: Int) {
        if (responseCode == InstallReferrerClient.InstallReferrerResponse.OK) {
            val response = referrerClient.installReferrer
            val rawReferrer = response.installReferrerUrl // "utm_source=referral&ref=demo-code&ref_by=USR-123"
            
            // Extract 'ref' code
            val params = rawReferrer.split("&").associate {
                val pair = it.split("=")
                pair[0] to (if (pair.size > 1) URLDecoder.decode(pair[1], "UTF-8") else "")
            }
            val referralCode = params["ref"]

            if (!referralCode.isNullOrEmpty()) {
                // Send to backend conversion API
                sendInstallToBackend(referralCode)
            }
            referrerClient.endConnection()
        }
    }
    override fun onInstallReferrerServiceDisconnected() {}
})
```

### Step C: Call Backend Conversion Endpoint
Send a POST request from the app:
```http
POST https://api.yourdomain.com/api/conversions/android-install
Content-Type: application/json

{
  "referralCode": "demo-code"
}
```
The backend will attribute the download to the referrer and increment verified downloads in MongoDB!

---

## 🍏 4. iOS App Integration (IP & Fingerprint Matching)

Apple's App Store does not allow passing custom URL parameters to installed apps. This system uses **IP & Device Fingerprint Matching with a 2–4 Hour TTL Window**:
1. When clicked on iOS, `/r/:code` records visitor IP with a 3-hour expiration in MongoDB.
2. When the iOS app is opened for the very first time, the app calls the verify endpoint.

### Step A: Call Verify Endpoint on First Open (Swift)
```swift
import Foundation

func checkReferralAttributionOnFirstLaunch() {
    let hasChecked = UserDefaults.standard.bool(forKey: "referral_checked")
    guard !hasChecked else { return } // Run only once on first open

    guard let url = URL(string: "https://api.yourdomain.com/api/conversions/ios-verify") else { return }
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")

    URLSession.shared.dataTask(with: request) { data, response, error in
        guard let data = data, error == nil else { return }
        if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
           let attributed = json["attributed"] as? Bool, attributed == true {
            
            let referralCode = (json["attribution"] as? [String: Any])?["code"] as? String
            let referrerUserId = (json["attribution"] as? [String: Any])?["referrerUserId"] as? String
            
            print("Successfully attributed to referrer: \(referrerUserId ?? "") (Code: \(referralCode ?? ""))")
            UserDefaults.standard.set(true, forKey: "referral_checked")
        }
    }.resume()
}
```

### What the Backend Does:
- Detects the client's IP.
- Looks for an unexpired `PendingAttribution` record from that IP in MongoDB.
- If found: credits the download to the referrer, marks it converted, and returns `{ attributed: true, attribution: { code, referrerUserId } }`.
- If no match or expired: returns `{ attributed: false }`.

---

## 🖥️ 5. Web App Attribution

When redirected to your website on Desktop, the URL will contain:
`https://yourwebsite.com/signup?ref=demo-code&ref_by=USR-DEMO1`

Extract and store them during user signup:
```javascript
// On your signup page:
const urlParams = new URLSearchParams(window.location.search);
const referralCode = urlParams.get('ref');
const referrerUserId = urlParams.get('ref_by');

if (referralCode) {
  localStorage.setItem('referral_code', referralCode);
  localStorage.setItem('referrer_user_id', referrerUserId);
}
```

---

## 📊 6. Analytics Tracked Per Link

In the referral portal dashboard, each link tracks:
- **Total Clicks**: Cumulative clicks across all devices.
- **Unique Clicks**: Distinct visitor IPs (repeat clicks from the same IP only increment total clicks).
- **Device Breakdown**: Clicks separated into Desktop, Android, and iOS.
- **Verified Downloads**: Real app installs confirmed via Google Play Referrer API and iOS IP matching.

---

## 🚀 7. Subdomain & Production Deployment

For step-by-step DNS, reverse proxy, and Nginx/Caddy configuration to host the dashboard on `referrals.yourdomain.com` and API on `api.yourdomain.com`, refer to [`SUBDOMAIN_SETUP.md`](./SUBDOMAIN_SETUP.md).
