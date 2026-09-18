#!/usr/bin/env bash
# ==============================================================================
# UWO User Referral Dashboard - GCP Cloud Run Deployment Script (Bash)
# ==============================================================================

set -eo pipefail

SERVICE_NAME="${1:-uwo-user-dashboard}"
REGION="${2:-asia-south1}"
API_BASE_URL="${3:-https://uwo-backend-977864306871.asia-south1.run.app}"
MEMORY="512Mi"
CPU="1"
MIN_INSTANCES="0"
MAX_INSTANCES="10"

echo "=========================================================="
echo "🚀 Deploying UWO User Dashboard to Google Cloud Run"
echo "=========================================================="

if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: Google Cloud CLI (gcloud) is not installed."
    echo "   Please install it: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

PROJECT_ID=$(gcloud config get-value project 2>/dev/null | tr -d '[:space:]')
if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "(unset)" ]; then
    read -rp "Enter your Google Cloud Project ID: " PROJECT_ID
    gcloud config set project "$PROJECT_ID"
fi

echo "🔹 Project ID    : ${PROJECT_ID}"
echo "🔹 Service Name  : ${SERVICE_NAME}"
echo "🔹 Region        : ${REGION}"
echo "🔹 Backend API   : ${API_BASE_URL}"
echo ""

echo "📦 Ensuring required GCP APIs are enabled..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com --project "${PROJECT_ID}"

echo ""
echo "🔨 Building container image and deploying to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
    --source . \
    --project "${PROJECT_ID}" \
    --region "${REGION}" \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --cpu "${CPU}" \
    --memory "${MEMORY}" \
    --min-instances "${MIN_INSTANCES}" \
    --max-instances "${MAX_INSTANCES}" \
    --set-env-vars "VITE_API_BASE_URL=${API_BASE_URL}"

echo ""
echo "=========================================================="
echo "✅ Deployment Succeeded!"
echo "To link a custom subdomain (e.g. referrals.uwo24.com):"
echo "gcloud beta run domain-mappings create --service ${SERVICE_NAME} --domain referrals.uwo24.com --region ${REGION}"
echo "=========================================================="
