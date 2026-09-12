#!/usr/bin/env bash
set -e

PROJECT_ID="aiwomen26ham-4452"
REGION="europe-west1"
SERVICE_NAME="ai-analyst-onboarding"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/cloud-run-apps/${SERVICE_NAME}:latest"

echo "=========================================================="
echo "Deploying Onboarding Web App to Google Cloud Run"
echo "Project: ${PROJECT_ID} | Region: ${REGION} | Service: ${SERVICE_NAME}"
echo "=========================================================="

# Build and push container via Cloud Build
gcloud builds submit app/ \
  --tag "${IMAGE}" \
  --project "${PROJECT_ID}"

# Deploy to Cloud Run
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE}" \
  --platform managed \
  --region "${REGION}" \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars "GCP_PROJECT_ID=${PROJECT_ID},BIGQUERY_DATASET=invented_software_mart" \
  --project "${PROJECT_ID}"

echo "Cloud Run Deployment Complete!"
gcloud run services describe "${SERVICE_NAME}" --platform managed --region "${REGION}" --format="value(status.url)"
