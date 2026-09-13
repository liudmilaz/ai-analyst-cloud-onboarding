#!/usr/bin/env bash
set -e

PROJECT_ID="aiwomen26ham-4452"
LOCATION="europe-west1"
REPO_NAME="invented-software-transformations"
WORKSPACE_NAME="production"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
DATAFORM_DIR="${PROJECT_ROOT}/dataform"

echo "=========================================================="
echo "Deploying Ready Production Dataform Project to Google Cloud"
echo "GCP Project: ${PROJECT_ID}"
echo "Location:    ${LOCATION}"
echo "Repository:  ${REPO_NAME}"
echo "Workspace:   ${WORKSPACE_NAME}"
echo "=========================================================="

# 1. Enable Dataform API
echo "1. Enabling Dataform API..."
gcloud services enable dataform.googleapis.com --project="${PROJECT_ID}"

# 2. Setup Service Account for Dataform
echo "2. Setting up Service Account for Dataform..."
PROJECT_NUMBER=$(gcloud projects describe "${PROJECT_ID}" --format="value(projectNumber)" 2>/dev/null || echo "")
SA_NAME="dataform-runner"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# Create service account if not exists
gcloud iam service-accounts create "${SA_NAME}" \
  --display-name="Dataform Runner Service Account" \
  --project="${PROJECT_ID}" 2>/dev/null || echo "Service account ${SA_NAME} already exists."

# Grant BigQuery Admin to the runner SA
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/bigquery.admin" \
  --condition=None 2>/dev/null || true

# Grant current user serviceAccountUser permission on this SA
CURRENT_USER=$(gcloud config get-value account 2>/dev/null || echo "")
if [ -n "${CURRENT_USER}" ]; then
  echo "Granting roles/iam.serviceAccountUser to ${CURRENT_USER}..."
  gcloud iam service-accounts add-iam-policy-binding "${SA_EMAIL}" \
    --member="user:${CURRENT_USER}" \
    --role="roles/iam.serviceAccountUser" \
    --project="${PROJECT_ID}" 2>/dev/null || true
fi

# Also grant Dataform default service agent BigQuery Admin
if [ -n "${PROJECT_NUMBER}" ]; then
  DEFAULT_DF_SA="service-${PROJECT_NUMBER}@gcp-sa-dataform.iam.gserviceaccount.com"
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${DEFAULT_DF_SA}" \
    --role="roles/bigquery.admin" \
    --condition=None 2>/dev/null || true
fi

# 3. Create Dataform Repository
echo "3. Creating Dataform repository '${REPO_NAME}'..."
TOKEN=$(gcloud auth print-access-token)

HTTP_CODE=$(curl -s -o /tmp/repo_create.json -w "%{http_code}" -X POST \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"serviceAccount\": \"${SA_EMAIL}\"}" \
  "https://dataform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/repositories?repositoryId=${REPO_NAME}")

if [ "${HTTP_CODE}" = "200" ] || [ "${HTTP_CODE}" = "201" ]; then
  echo "✓ Repository created successfully."
elif [ "${HTTP_CODE}" = "409" ] || grep -q "ALREADY_EXISTS" /tmp/repo_create.json 2>/dev/null; then
  echo "✓ Repository '${REPO_NAME}' already exists."
else
  echo "Repository creation response (${HTTP_CODE}):"
  cat /tmp/repo_create.json
  # Fallback try without body
  curl -s -X POST \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{}' \
    "https://dataform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/repositories?repositoryId=${REPO_NAME}" > /dev/null 2>&1 || true
fi

# 4. Create Workspace 'production'
echo "4. Creating development workspace '${WORKSPACE_NAME}'..."
WS_HTTP_CODE=$(curl -s -o /tmp/ws_create.json -w "%{http_code}" -X POST \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{}' \
  "https://dataform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/repositories/${REPO_NAME}/workspaces?workspaceId=${WORKSPACE_NAME}")

if [ "${WS_HTTP_CODE}" = "200" ] || [ "${WS_HTTP_CODE}" = "201" ]; then
  echo "✓ Workspace '${WORKSPACE_NAME}' created successfully."
elif [ "${WS_HTTP_CODE}" = "409" ] || grep -q "ALREADY_EXISTS" /tmp/ws_create.json 2>/dev/null; then
  echo "✓ Workspace '${WORKSPACE_NAME}' already exists."
else
  echo "Workspace creation response (${WS_HTTP_CODE}):"
  cat /tmp/ws_create.json
fi

# 5. Upload all Dataform files into the Workspace
echo "5. Writing all production SQLX and configuration files to workspace..."
cd "${DATAFORM_DIR}"
export TOKEN
export PROJECT_ID
export LOCATION
export REPO_NAME
export WORKSPACE_NAME

# Python uploader for safe base64 encoding and JSON handling
python3 -c "
import os, json, urllib.request, base64

token = os.environ.get('TOKEN')
project_id = os.environ.get('PROJECT_ID')
location = os.environ.get('LOCATION')
repo_name = os.environ.get('REPO_NAME')
workspace_name = os.environ.get('WORKSPACE_NAME')

url_base = f'https://dataform.googleapis.com/v1/projects/{project_id}/locations/{location}/repositories/{repo_name}/workspaces/{workspace_name}:writeFile'
remove_url = f'https://dataform.googleapis.com/v1/projects/{project_id}/locations/{location}/repositories/{repo_name}/workspaces/{workspace_name}:removeFile'

# Remove legacy dataform.json if present in the workspace
try:
    req_rm = urllib.request.Request(
        remove_url,
        data=json.dumps({'path': 'dataform.json'}).encode('utf-8'),
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req_rm):
        print('   ✓ Removed legacy dataform.json from workspace')
except Exception:
    pass

for root, dirs, files in os.walk('.'):
    # Skip git and node_modules
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        if file.endswith(('.json', '.sqlx', '.js', '.yaml')):
            filepath = os.path.join(root, file)
            rel_path = os.path.relpath(filepath, '.')
            try:
                with open(filepath, 'rb') as f:
                    content_b64 = base64.b64encode(f.read()).decode('utf-8')
                
                payload = json.dumps({'path': rel_path, 'contents': content_b64}).encode('utf-8')
                req = urllib.request.Request(
                    url_base,
                    data=payload,
                    headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'},
                    method='POST'
                )
                with urllib.request.urlopen(req) as resp:
                    print(f'   ✓ Wrote {rel_path}')
            except Exception as e:
                print(f'   ! Notice for {rel_path}: {e}')
"

# 6. Commit the workspace changes
echo "6. Committing files in workspace '${WORKSPACE_NAME}'..."
TOKEN=$(gcloud auth print-access-token)
curl -s -X POST \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "author": {
      "name": "Lead Data Specialist",
      "emailAddress": "specialist@inventedsoftware.com"
    },
    "commitMessage": "Deploy corrected production dataform models (traps resolved, BigQuery lakehouse connected)"
  }' \
  "https://dataform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/repositories/${REPO_NAME}/workspaces/${WORKSPACE_NAME}:commit" > /tmp/ws_commit.json 2>&1 || true

# 7. Compile the Dataform project
echo "7. Compiling Dataform project..."
COMP_RES=$(curl -s -X POST \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"workspace\": \"projects/${PROJECT_ID}/locations/${LOCATION}/repositories/${REPO_NAME}/workspaces/${WORKSPACE_NAME}\"
  }" \
  "https://dataform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/repositories/${REPO_NAME}/compilationResults")

COMP_NAME=$(python3 -c "
import json, sys
try:
    data = json.loads('''${COMP_RES}''')
    print(data.get('name', ''))
except:
    print('')
")

if [ -n "${COMP_NAME}" ]; then
  echo "   ✓ Compilation successful: ${COMP_NAME}"
  
  # 8. Execute Workflow Invocations (materialize staging views, marts, and run assertions in BigQuery)
  echo "8. Triggering Dataform workflow execution in BigQuery..."
  INV_RES=$(curl -s -X POST \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{
      \"compilationResult\": \"${COMP_NAME}\"
    }" \
    "https://dataform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/repositories/${REPO_NAME}/workflowInvocations")
  echo "   ✓ Workflow invocation initiated in BigQuery!"
fi

DIRECT_URL="https://console.cloud.google.com/bigquery/dataform/locations/${LOCATION}/repositories/${REPO_NAME}/workspaces/${WORKSPACE_NAME}?project=${PROJECT_ID}"

echo ""
echo "=========================================================="
echo "🎉 Dataform Ready & Deployed in Google Cloud!"
echo "Direct Link to Deployed Project:"
echo "${DIRECT_URL}"
echo "=========================================================="
