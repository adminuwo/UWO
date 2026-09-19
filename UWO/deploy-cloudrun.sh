#!/usr/bin/env bash
# ==============================================================================
# Service 1: UWO Unified Core & Backend - GCP Cloud Run Deployment Script (Bash)
# ==============================================================================

set -eo pipefail

SERVICE_NAME="${1:-uwo24}"
REGION="${2:-asia-south1}"
MEMORY="2Gi"
CPU="2"
MIN_INSTANCES="1"
MAX_INSTANCES="10"

echo "=========================================================="
echo "🚀 Deploying Service 1: UWO Unified Core & Backend"
echo "=========================================================="

if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: Google Cloud CLI (gcloud) is not installed."
    echo "   Please install it: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

PROJECT_ID=$(gcloud config get-value project 2>/dev/null | tr -d '[:space:]')
if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "(unset)" ]; then
    read -rp "Enter your Google Cloud Project ID (e.g. unified-web-options): " PROJECT_ID
    gcloud config set project "$PROJECT_ID"
fi

echo "🔹 Project ID    : ${PROJECT_ID}"
echo "🔹 Service Name  : ${SERVICE_NAME}"
echo "🔹 Region        : ${REGION}"
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
    --max-instances "${MAX_INSTANCES}"

echo ""
echo "=========================================================="
echo "✅ Service 1 Deployment Succeeded!"
echo " Service 1 URL:"
gcloud run services describe "${SERVICE_NAME}" --region="${REGION}" --project="${PROJECT_ID}" --format='value(status.url)'
echo "=========================================================="
