# Deploy Service 1 (uwo-unified-core) to Google Cloud Run (PowerShell)
$ErrorActionPreference = "Stop"

$ProjectId = $env:GCP_PROJECT_ID
if (-not $ProjectId) {
    $ProjectId = (gcloud config get-value project 2>$null)
}
$Region = if ($env:GCP_REGION) { $env:GCP_REGION } else { "asia-south1" }
$ServiceName = if ($env:SERVICE_NAME) { $env:SERVICE_NAME } else { "uwo-unified-core" }
$RepoName = if ($env:REPO_NAME) { $env:REPO_NAME } else { "uwo-docker-repo" }
$ImageName = "${Region}-docker.pkg.dev/${ProjectId}/${RepoName}/${ServiceName}:latest"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Deploying Service 1: UWO Unified Core & Backend" -ForegroundColor Cyan
Write-Host " Project ID:   $ProjectId"
Write-Host " Region:       $Region"
Write-Host " Service Name: $ServiceName"
Write-Host " Image:        $ImageName"
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
        --description="Docker repository for UWO Unified Platform" `
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
    --memory=2Gi `
    --cpu=2 `
    --min-instances=1 `
    --max-instances=10 `
    --project=$ProjectId

Write-Host "========================================================" -ForegroundColor Green
Write-Host " Service 1 Deployment Complete!" -ForegroundColor Green
$ServiceUrl = (gcloud run services describe $ServiceName --region=$Region --project=$ProjectId --format='value(status.url)')
Write-Host " Service 1 URL: $ServiceUrl" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
