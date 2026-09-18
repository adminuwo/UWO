# 🚀 Google Cloud Run Deployment Guide — UWO User Referral Dashboard

This guide walks you through deploying the **UWO User Referral Dashboard** to **Google Cloud Run** using containerization (Vite + React + Nginx Alpine).

---

## 🏗️ Architecture Overview

- **Service Type**: Fully managed serverless container on Google Cloud Run.
- **Frontend SPA**: React 18, Vite 5, Tailwind CSS, Lucide icons.
- **Web Server**: High-performance Nginx Alpine image listening dynamically on `$PORT` (default 8080).
- **Client Routing**: Full SPA routing fallback (`try_files $uri $uri/ /index.html`) to prevent 404 errors on page refreshes (`/login`, `/dashboard`, etc.).
- **Dynamic Runtime Config**: On container startup, `/entrypoint.sh` automatically reads Cloud Run environment variables (e.g., `VITE_API_BASE_URL`) and injects them into `/usr/share/nginx/html/env-config.js`. This allows you to update the backend API URL anytime without rebuilding the image!
- **Default Port**: `8080` (Cloud Run standard).
- **Default Region**: `asia-south1` (Mumbai).

---

## ⚡ Quick Deployment (1-Command)

### Option 1: PowerShell (Windows)
Open PowerShell in `c:\Users\Sansk\OneDrive\Desktop\Unified Platform\UWO\user-dashboard`:

```powershell
.\deploy-cloudrun.ps1
```

Or pass custom parameters:
```powershell
.\deploy-cloudrun.ps1 -ServiceName "uwo-user-dashboard" -Region "asia-south1" -ApiBaseUrl "https://uwo-backend-977864306871.asia-south1.run.app"
```

---

### Option 2: Bash (Linux / macOS / Cloud Shell)
```bash
chmod +x deploy-cloudrun.sh
./deploy-cloudrun.sh uwo-user-dashboard asia-south1 https://uwo-backend-977864306871.asia-south1.run.app
```

---

### Option 3: Direct `gcloud` CLI Command
Run directly from `user-dashboard`:

```bash
gcloud run deploy uwo-user-dashboard \
  --source . \
  --project ai-mall-484810 \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --cpu 1 \
  --memory 512Mi \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "VITE_API_BASE_URL=https://uwo-backend-977864306871.asia-south1.run.app"
```

---

## ⚙️ Environment Variables

You can configure environment variables via the `gcloud` CLI or in the Google Cloud Console under **Cloud Run > [Service] > Edit & Deploy New Revision > Variables & Secrets**:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of the UWO Backend Express API | `https://uwo-backend-977864306871.asia-south1.run.app` |
| `PORT` | Container HTTP listen port (auto-set by Cloud Run) | `8080` |

---

## 🌐 Custom Subdomain Mapping (e.g. `referrals.uwo24.com`)

To link your Cloud Run service to a custom domain:

### Step 1: Create Domain Mapping in GCP
```bash
gcloud beta run domain-mappings create \
  --service uwo-user-dashboard \
  --domain referrals.uwo24.com \
  --region asia-south1 \
  --project ai-mall-484810
```

### Step 2: Add DNS Records
GCP will output the required DNS record (typically a `CNAME` pointing to `ghs.googlehosted.com.`).
1. Go to your DNS provider (Cloudflare, GoDaddy, Namecheap, etc.).
2. Add a `CNAME` record:
   - **Type**: `CNAME`
   - **Name**: `referrals`
   - **Target / Value**: `ghs.googlehosted.com`
3. Google Cloud automatically provisions a managed SSL/TLS certificate for HTTPS.

---

## 🧪 Local Container Testing (Optional)

To test the container locally using Docker before deploying:

```bash
# 1. Build local Docker image
docker build -t uwo-user-dashboard .

# 2. Run container locally with test port and API URL
docker run -p 8080:8080 -e VITE_API_BASE_URL="http://localhost:5000" uwo-user-dashboard

# 3. Test in browser
# http://localhost:8080 (App)
# http://localhost:8080/healthz (Health check)
```

---

## 🔍 Verification & Health Check

- **Health Check Endpoint**:
  ```bash
  curl https://<SERVICE_URL>/healthz
  # Expected response: "healthy" (HTTP 200)
  ```
- **Runtime Configuration Verification**:
  ```bash
  curl https://<SERVICE_URL>/env-config.js
  # Shows window._env_ with your active VITE_API_BASE_URL
  ```
- **SPA Routing Verification**:
  Visit `https://<SERVICE_URL>/login` and `https://<SERVICE_URL>/dashboard` directly in your browser or refresh the page; verify that Nginx serves `index.html` without returning a 404 error.
