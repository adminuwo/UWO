# Master Deployment Script for all 3 UWO Services (PowerShell)
$ErrorActionPreference = "Stop"

$ProjectId = $env:GCP_PROJECT_ID
if (-not $ProjectId) {
    $ProjectId = (gcloud config get-value project 2>$null)
}
if (-not $ProjectId) {
    Write-Error "GCP Project ID is not set. Run 'gcloud config set project ai-mall-484810' or set `$env:GCP_PROJECT_ID."
}

$Region = if ($env:GCP_REGION) { $env:GCP_REGION } else { "asia-south1" }

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 UWO 3-Tier Cloud Run Master Deployment" -ForegroundColor Cyan
Write-Host " Project ID: $ProjectId"
Write-Host " Region:     $Region"
Write-Host "==========================================================" -ForegroundColor Cyan

# ------------------------------------------------------------
# STEP 1: Deploy Service 1 (uwo-unified-core)
# ------------------------------------------------------------
Write-Host "`n[1/3] Deploying Service 1: Unified Core & Backend..." -ForegroundColor Yellow
Push-Location -Path "$PSScriptRoot\UWO"
try {
    .\deploy-cloudrun.ps1
} finally {
    Pop-Location
}

$Service1Url = (gcloud run services describe uwo-unified-core --region=$Region --project=$ProjectId --format='value(status.url)').Trim()
Write-Host "✅ Service 1 Live URL: $Service1Url" -ForegroundColor Green

# ------------------------------------------------------------
# STEP 2: Deploy Service 2 (uwo-user-dashboard)
# ------------------------------------------------------------
Write-Host "`n[2/3] Deploying Service 2: User Referral Dashboard Frontend..." -ForegroundColor Yellow
Push-Location -Path "$PSScriptRoot\user-dashboard"
try {
    .\deploy-cloudrun.ps1 -ServiceName "uwo-user-dashboard" -Region $Region -ApiBaseUrl $Service1Url
} finally {
    Pop-Location
}

$Service2Url = (gcloud run services describe uwo-user-dashboard --region=$Region --project=$ProjectId --format='value(status.url)').Trim()
Write-Host "✅ Service 2 Live URL: $Service2Url" -ForegroundColor Green

# ------------------------------------------------------------
# STEP 3: Deploy Service 3 (uwo-unified-dashboard)
# ------------------------------------------------------------
Write-Host "`n[3/3] Deploying Service 3: Unified Dashboard Frontend..." -ForegroundColor Yellow
Push-Location -Path "$PSScriptRoot\Unified-Dashboard"
try {
    $env:BACKEND_API_URL = $Service1Url
    .\deploy-cloudrun.ps1
} finally {
    Pop-Location
}

$Service3Url = (gcloud run services describe uwo-unified-dashboard --region=$Region --project=$ProjectId --format='value(status.url)').Trim()
Write-Host "✅ Service 3 Live URL: $Service3Url" -ForegroundColor Green

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "🎉 ALL 3 SERVICES DEPLOYED SUCCESSFULLY!" -ForegroundColor Green
Write-Host " Service 1 (Unified Backend + Main Web): $Service1Url" -ForegroundColor Green
Write-Host " Service 2 (User Referral Portal):       $Service2Url" -ForegroundColor Green
Write-Host " Service 3 (Unified Dashboard UI):       $Service3Url" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
