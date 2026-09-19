#!/usr/bin/env bash
# Master Deployment Script for all 3 UWO Services (Bash)
set -eo pipefail

PROJECT_ID=${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}
REGION=${GCP_REGION:-"asia-south1"}

if [ -z "${PROJECT_ID}" ]; then
  echo "Error: GCP Project ID is not set. Run 'gcloud config set project ai-mall-484810' or set GCP_PROJECT_ID."
  exit 1
fi

echo "=========================================================="
echo "🚀 UWO 3-Tier Cloud Run Master Deployment"
echo " Project ID: ${PROJECT_ID}"
echo " Region:     ${REGION}"
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ------------------------------------------------------------
# STEP 1: Deploy Service 1 (uwo-unified-core)
# ------------------------------------------------------------
echo ""
echo "[1/3] Deploying Service 1: Unified Core & Backend..."
cd "${SCRIPT_DIR}/UWO"
./deploy-cloudrun.sh

SERVICE1_URL=$(gcloud run services describe uwo-unified-core --region="${REGION}" --project="${PROJECT_ID}" --format='value(status.url)')
echo "✅ Service 1 Live URL: ${SERVICE1_URL}"

# ------------------------------------------------------------
# STEP 2: Deploy Service 2 (uwo-user-dashboard)
# ------------------------------------------------------------
echo ""
echo "[2/3] Deploying Service 2: User Referral Dashboard Frontend..."
cd "${SCRIPT_DIR}/user-dashboard"
./deploy-cloudrun.sh "uwo-user-dashboard" "${REGION}" "${SERVICE1_URL}"

SERVICE2_URL=$(gcloud run services describe uwo-user-dashboard --region="${REGION}" --project="${PROJECT_ID}" --format='value(status.url)')
echo "✅ Service 2 Live URL: ${SERVICE2_URL}"

# ------------------------------------------------------------
# STEP 3: Deploy Service 3 (uwo-unified-dashboard)
# ------------------------------------------------------------
echo ""
echo "[3/3] Deploying Service 3: Unified Dashboard Frontend..."
cd "${SCRIPT_DIR}/Unified-Dashboard"
BACKEND_API_URL="${SERVICE1_URL}" ./deploy-cloudrun.sh

SERVICE3_URL=$(gcloud run services describe uwo-unified-dashboard --region="${REGION}" --project="${PROJECT_ID}" --format='value(status.url)')
echo "✅ Service 3 Live URL: ${SERVICE3_URL}"

echo ""
echo "=========================================================="
echo "🎉 ALL 3 SERVICES DEPLOYED SUCCESSFULLY!"
echo " Service 1 (Unified Backend + Main Web): ${SERVICE1_URL}"
echo " Service 2 (User Referral Portal):       ${SERVICE2_URL}"
echo " Service 3 (Unified Dashboard UI):       ${SERVICE3_URL}"
echo "=========================================================="
