# Deploy Service 3 (uwo-unified-dashboard) to Google Cloud Run (PowerShell)
$ErrorActionPreference = "Stop"

$ProjectId = $env:GCP_PROJECT_ID
if (-not $ProjectId) {
    $ProjectId = (gcloud config get-value project 2>$null)
}
$Region = if ($env:GCP_REGION) { $env:GCP_REGION } else { "asia-south1" }
$ServiceName = if ($env:SERVICE_NAME) { $env:SERVICE_NAME } else { "uwo-unified-dashboard" }
$RepoName = if ($env:REPO_NAME) { $env:REPO_NAME } else { "uwo-docker-repo" }
$ImageName = "${Region}-docker.pkg.dev/${ProjectId}/${RepoName}/${ServiceName}:latest"
$BackendApiUrl = if ($env:BACKEND_API_URL) { $env:BACKEND_API_URL } else { "https://uwo-unified-core-977864306871.asia-south1.run.app" }

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Deploying Service 3: Unified Dashboard Frontend" -ForegroundColor Cyan
Write-Host " Project ID:       $ProjectId"
Write-Host " Region:           $Region"
Write-Host " Service Name:     $ServiceName"
Write-Host " Image:            $ImageName"
Write-Host " Backend Core API: $BackendApiUrl"
Write-Host "========================================================" -ForegroundColor Cyan

if (-not $ProjectId) {
    Write-Error "GCP Project ID is not set. Run 'gcloud config set project YOUR_PROJECT_ID' or set `$env:GCP_PROJECT_ID."
}

Write-Host "1. Enabling required GCP Service APIs..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com --project=$ProjectId

Write-Host "2. Ensuring Artifact Registry repository exists..." -ForegroundColor Yellow
gcloud artifacts repositories describe $RepoName --location=$Region --project=$ProjectId 2>$null
if ($LASTEXITCODE -ne 0) {
    gcloud artifacts repositories create $RepoName `
        --repository-format=docker `
        --location=$Region `
        --description="Docker repository for Unified Platform" `
        --project=$ProjectId
}

Write-Host "3. Building and submitting image via Cloud Build..." -ForegroundColor Yellow
gcloud builds submit --tag $ImageName --project=$ProjectId .

Write-Host "4. Deploying service to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $ServiceName `
    --image=$ImageName `
    --region=$Region `
    --platform=managed `
    --allow-unauthenticated `
    --port=8080 `
    --memory=512Mi `
    --cpu=1 `
    --min-instances=0 `
    --max-instances=10 `
    --set-env-vars "BACKEND_API_URL=$BackendApiUrl" `
    --project=$ProjectId

Write-Host "========================================================" -ForegroundColor Green
Write-Host " Service 3 Deployment Complete!" -ForegroundColor Green
$ServiceUrl = (gcloud run services describe $ServiceName --region=$Region --project=$ProjectId --format='value(status.url)')
Write-Host " Service 3 URL: $ServiceUrl" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
