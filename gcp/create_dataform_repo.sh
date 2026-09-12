#!/usr/bin/env bash
set -e

PROJECT_ID="aiwomen26ham-4452"
REGION="europe-west1"
REPO_NAME="invented-software-transformations"

echo "=========================================================="
echo "Creating Google Cloud Dataform Repository in GCP"
echo "Project: ${PROJECT_ID} | Region: ${REGION} | Repo: ${REPO_NAME}"
echo "=========================================================="

# 1. Enable Dataform API
gcloud services enable dataform.googleapis.com --project="${PROJECT_ID}"

# 2. Create the Dataform Repository
echo "Creating Dataform repository '${REPO_NAME}'..."
gcloud dataform repositories create "${REPO_NAME}" \
  --project="${PROJECT_ID}" \
  --location="${REGION}" || echo "Repository '${REPO_NAME}' already exists or was initialized."

echo ""
echo "=========================================================="
echo "Dataform Repository Ready!"
echo "Open in GCP Console:"
echo "https://console.cloud.google.com/bigquery/dataform/locations/${REGION}/repositories/${REPO_NAME}?project=${PROJECT_ID}"
echo "=========================================================="
