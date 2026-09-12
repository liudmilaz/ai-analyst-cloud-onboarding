#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

PROJECT_ID="aiwomen26ham-4452"
DATASET="invented_software_raw"
DATA_DIR="${PROJECT_ROOT}/data"

echo "=========================================================="
echo "Loading 6 CSV files into BigQuery: ${PROJECT_ID}.${DATASET}"
echo "Data Directory: ${DATA_DIR}"
echo "=========================================================="

TABLES=(
  "raw_merchants"
  "raw_subscriptions"
  "raw_products"
  "raw_markets"
  "raw_acquisition_costs"
  "raw_operating_costs"
)

for table in "${TABLES[@]}"; do
  csv_file="${DATA_DIR}/${table}.csv"
  if [ -f "${csv_file}" ]; then
    echo "Loading ${table} from ${csv_file}..."
    bq load \
      --project_id="${PROJECT_ID}" \
      --source_format=CSV \
      --autodetect \
      --skip_leading_rows=1 \
      --replace \
      "${PROJECT_ID}:${DATASET}.${table}" \
      "${csv_file}"
  else
    echo "Warning: File not found: ${csv_file}"
  fi
done

echo ""
echo "Validating table row counts in ${PROJECT_ID}.${DATASET}:"
bq query --project_id="${PROJECT_ID}" --use_legacy_sql=false \
"SELECT 'raw_merchants' AS table_name, count(*) AS count FROM \`${PROJECT_ID}.${DATASET}.raw_merchants\` UNION ALL
 SELECT 'raw_subscriptions', count(*) FROM \`${PROJECT_ID}.${DATASET}.raw_subscriptions\` UNION ALL
 SELECT 'raw_products', count(*) FROM \`${PROJECT_ID}.${DATASET}.raw_products\` UNION ALL
 SELECT 'raw_markets', count(*) FROM \`${PROJECT_ID}.${DATASET}.raw_markets\` UNION ALL
 SELECT 'raw_acquisition_costs', count(*) FROM \`${PROJECT_ID}.${DATASET}.raw_acquisition_costs\` UNION ALL
 SELECT 'raw_operating_costs', count(*) FROM \`${PROJECT_ID}.${DATASET}.raw_operating_costs\`;"

echo ""
echo "All 6 tables loaded and validated successfully!"
