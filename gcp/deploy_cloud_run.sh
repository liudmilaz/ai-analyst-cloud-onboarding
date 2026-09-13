#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

PROJECT_ID="aiwomen26ham-4452"
REGION="europe-west1"
SERVICE_NAME="ai-data-onboarding"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/cloud-run-apps/${SERVICE_NAME}:latest"

echo "=========================================================="
echo "Deploying Onboarding Web App to Google Cloud Run"
echo "Project: ${PROJECT_ID} | Region: ${REGION} | Service: ${SERVICE_NAME}"
echo "App Source: ${PROJECT_ROOT}/app"
echo "Target Image: ${IMAGE}"
echo "=========================================================="

# 1. Build and push container via Cloud Build using the app directory
echo "Submitting build to Google Cloud Build..."
gcloud builds submit "${PROJECT_ROOT}/app" \
  --tag "${IMAGE}" \
  --project "${PROJECT_ID}"

# 2. Deploy to Cloud Run
echo "Deploying container image to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE}" \
  --platform managed \
  --region "${REGION}" \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars "GCP_PROJECT_ID=${PROJECT_ID},BIGQUERY_DATASET=invented_software_mart" \
  --project "${PROJECT_ID}"

echo ""
echo "=========================================================="
echo "Cloud Run Deployment Complete!"
echo "Service URL:"
gcloud run services describe "${SERVICE_NAME}" --platform managed --region "${REGION}" --project "${PROJECT_ID}" --format="value(status.url)"
echo "=========================================================="
