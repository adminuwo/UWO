#!/usr/bin/env bash
# Deploy Service 1 (uwo-unified-core) to Google Cloud Run
set -e

PROJECT_ID=${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}
REGION=${GCP_REGION:-"asia-south1"}
SERVICE_NAME=${SERVICE_NAME:-"uwo-unified-core"}
REPO_NAME=${REPO_NAME:-"uwo-docker-repo"}
IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"

echo "========================================================"
echo " Deploying Service 1: UWO Unified Core & Backend"
echo " Project ID:   ${PROJECT_ID}"
echo " Region:       ${REGION}"
echo " Service Name: ${SERVICE_NAME}"
echo " Image:        ${IMAGE_NAME}"
echo "========================================================"

if [ -z "${PROJECT_ID}" ]; then
  echo "Error: GCP Project ID is not set. Run 'gcloud config set project YOUR_PROJECT_ID' or set GCP_PROJECT_ID."
  exit 1
fi

echo "1. Enabling required GCP Service APIs..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com --project="${PROJECT_ID}"

echo "2. Ensuring Artifact Registry repository exists..."
gcloud artifacts repositories describe "${REPO_NAME}" --location="${REGION}" --project="${PROJECT_ID}" >/dev/null 2>&1 || \
gcloud artifacts repositories create "${REPO_NAME}" \
  --repository-format=docker \
  --location="${REGION}" \
  --description="Docker repository for UWO Unified Platform" \
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
  --memory=2Gi \
  --cpu=2 \
  --min-instances=1 \
  --max-instances=10 \
  --project="${PROJECT_ID}"

echo "========================================================"
echo " Service 1 Deployment Complete!"
echo " Service 1 URL:"
gcloud run services describe "${SERVICE_NAME}" --region="${REGION}" --project="${PROJECT_ID}" --format='value(status.url)'
echo "========================================================"
