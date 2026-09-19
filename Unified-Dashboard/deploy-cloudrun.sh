#!/usr/bin/env bash
# Deploy Service 3 (uwo-unified-dashboard) to Google Cloud Run
set -e

PROJECT_ID=${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}
REGION=${GCP_REGION:-"asia-south1"}
SERVICE_NAME=${SERVICE_NAME:-"uwo-unified-dashboard"}
REPO_NAME=${REPO_NAME:-"uwo-docker-repo"}
IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"
BACKEND_API_URL=${BACKEND_API_URL:-"https://uwo-unified-core-977864306871.asia-south1.run.app"}

echo "========================================================"
echo " Deploying Service 3: Unified Dashboard Frontend"
echo " Project ID:      ${PROJECT_ID}"
echo " Region:          ${REGION}"
echo " Service Name:    ${SERVICE_NAME}"
echo " Image:           ${IMAGE_NAME}"
echo " Backend Core API: ${BACKEND_API_URL}"
echo "========================================================"

if [ -z "${PROJECT_ID}" ]; then
  echo "Error: GCP Project ID is not set. Run 'gcloud config set project YOUR_PROJECT_ID' or set GCP_PROJECT_ID env var."
  exit 1
fi

echo "1. Enabling required GCP Service APIs..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com --project="${PROJECT_ID}"

echo "2. Ensuring Artifact Registry repository exists..."
gcloud artifacts repositories describe "${REPO_NAME}" --location="${REGION}" --project="${PROJECT_ID}" >/dev/null 2>&1 || \
gcloud artifacts repositories create "${REPO_NAME}" \
  --repository-format=docker \
  --location="${REGION}" \
  --description="Docker repository for Unified Platform" \
  --project="${PROJECT_ID}"

echo "3. Building and submitting image via Cloud Build..."
gcloud builds submit --tag "${IMAGE_NAME}" --project="${PROJECT_ID}" .

echo "4. Deploying service to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --image="${IMAGE_NAME}" \
  --region="${REGION}" \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --set-env-vars "BACKEND_API_URL=${BACKEND_API_URL}" \
  --project="${PROJECT_ID}"

echo "========================================================"
echo " Service 3 Deployment Complete!"
echo " Service 3 URL:"
gcloud run services describe "${SERVICE_NAME}" --region="${REGION}" --project="${PROJECT_ID}" --format='value(status.url)'
echo "========================================================"
