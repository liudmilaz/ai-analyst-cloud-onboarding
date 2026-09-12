#!/usr/bin/env bash
set -e

PROJECT_ID="aiwomen26ham-4452"
REGION="europe-west1"
LOCATION="EU"

echo "=========================================================="
echo "Initializing GCP Environment for AI Analyst Onboarding"
echo "Project ID: ${PROJECT_ID}"
echo "Region: ${REGION} | Location: ${LOCATION}"
echo "=========================================================="

# 1. Set default project
gcloud config set project "${PROJECT_ID}"

# 2. Enable Required Google Cloud APIs
echo "Enabling GCP APIs..."
gcloud services enable \
  bigquery.googleapis.com \
  dataform.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  aiplatform.googleapis.com \
  generativelanguage.googleapis.com

# 3. Create BigQuery Datasets
echo "Creating BigQuery Datasets..."
bq mk --project_id="${PROJECT_ID}" --location="${LOCATION}" -d invented_software_raw || true
bq mk --project_id="${PROJECT_ID}" --location="${LOCATION}" -d invented_software_staging || true
bq mk --project_id="${PROJECT_ID}" --location="${LOCATION}" -d invented_software_intermediate || true
bq mk --project_id="${PROJECT_ID}" --location="${LOCATION}" -d invented_software_mart || true
bq mk --project_id="${PROJECT_ID}" --location="${LOCATION}" -d invented_software_assertions || true

# 4. Create Artifact Registry Repository for Cloud Run
echo "Creating Artifact Registry for Cloud Run..."
gcloud artifacts repositories create cloud-run-apps \
  --repository-format=docker \
  --location="${REGION}" \
  --description="Docker repository for onboarding web app" || true

echo "GCP environment initialized successfully!"
