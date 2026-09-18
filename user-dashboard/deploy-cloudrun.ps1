# ==============================================================================
# UWO User Referral Dashboard - GCP Cloud Run Deployment Script (PowerShell)
# ==============================================================================

param (
    [string]$ServiceName = "uwo-user-dashboard",
    [string]$Region = "asia-south1",
    [string]$ApiBaseUrl = "https://uwo-backend-977864306871.asia-south1.run.app",
    [string]$Memory = "512Mi",
    [string]$Cpu = "1",
    [string]$MinInstances = "0",
    [string]$MaxInstances = "10"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Deploying UWO User Dashboard to Google Cloud Run" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Check if gcloud CLI is available
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Google Cloud CLI (gcloud) is not installed or not in PATH." -ForegroundColor Red
    Write-Host "   Please install it from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Determine current active GCP project
$currentProject = (gcloud config get-value project 2>$null).Trim()
if ([string]::IsNullOrWhiteSpace($currentProject) -or $currentProject -eq "(unset)") {
    $projectId = Read-Host "Enter your Google Cloud Project ID (e.g. ai-mall-484810)"
    gcloud config set project $projectId
} else {
    $projectId = $currentProject
}

Write-Host "🔹 Project ID    : $projectId" -ForegroundColor Green
Write-Host "🔹 Service Name  : $ServiceName" -ForegroundColor Green
Write-Host "🔹 Region        : $Region" -ForegroundColor Green
Write-Host "🔹 Backend API   : $ApiBaseUrl" -ForegroundColor Green
Write-Host ""

# Enable required GCP APIs
Write-Host "📦 Ensuring required GCP Cloud APIs are enabled..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com --project $projectId

Write-Host ""
Write-Host "🔨 Building container image and deploying to Cloud Run..." -ForegroundColor Yellow
Write-Host "   (Vite app built inside Docker, served by optimized Nginx on Cloud Run)"
Write-Host ""

# Deploy directly from current source directory
gcloud run deploy $ServiceName `
    --source . `
    --project $projectId `
    --region $Region `
    --platform managed `
    --allow-unauthenticated `
    --port 8080 `
    --cpu $Cpu `
    --memory $Memory `
    --min-instances $MinInstances `
    --max-instances $MaxInstances `
    --set-env-vars "VITE_API_BASE_URL=$ApiBaseUrl"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "✅ Deployment Succeeded!" -ForegroundColor Green
Write-Host "The referral portal is now live on the Cloud Run URL above." -ForegroundColor Green
Write-Host "To link a custom subdomain (e.g. referrals.uwo24.com):" -ForegroundColor Yellow
Write-Host "gcloud beta run domain-mappings create --service $ServiceName --domain referrals.uwo24.com --region $Region" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
