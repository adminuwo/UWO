# ==============================================================================
# Unified Dashboard Frontend - GCP Cloud Run Deployment Script (PowerShell)
# ==============================================================================

param (
    [string]$ServiceName = "unified-dashboard",
    [string]$Region = "asia-south1",
    [string]$BackendApiUrl = "https://uwo24.com",
    [string]$Memory = "512Mi",
    [string]$Cpu = "1",
    [string]$MinInstances = "0",
    [string]$MaxInstances = "10"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Deploying Unified Dashboard Frontend to Google Cloud Run" -ForegroundColor Cyan
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
    $projectId = Read-Host "Enter your Google Cloud Project ID (e.g. unified-web-options)"
    gcloud config set project $projectId
} else {
    $projectId = $currentProject
}

Write-Host "🔹 Project ID    : $projectId" -ForegroundColor Green
Write-Host "🔹 Service Name  : $ServiceName" -ForegroundColor Green
Write-Host "🔹 Region        : $Region" -ForegroundColor Green
Write-Host "🔹 Backend API   : $BackendApiUrl" -ForegroundColor Green
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
    --set-env-vars "BACKEND_API_URL=$BackendApiUrl"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "✅ Deployment Succeeded!" -ForegroundColor Green
Write-Host "Unified Dashboard is live on Cloud Run and connected to Load Balancer: admin.uwo24.com" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
