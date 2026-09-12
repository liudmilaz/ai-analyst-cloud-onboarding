#!/usr/bin/env python3
"""
Loads raw CSV data from the data/ directory into BigQuery dataset:
aiwomen26ham-4452.invented_software_raw
"""

import os
import sys
from pathlib import Path

# Try importing google.cloud.bigquery
try:
    from google.cloud import bigquery
except ImportError:
    print("google-cloud-bigquery not installed. Use `pip install google-cloud-bigquery` or `gcloud` CLI.")
    bigquery = None

PROJECT_ID = "aiwomen26ham-4452"
DATASET_ID = "invented_software_raw"
DATA_DIR = Path(__file__).resolve().parent.parent / "data"

TABLE_FILES = {
    "raw_merchants": "raw_merchants.csv",
    "raw_subscriptions": "raw_subscriptions.csv",
    "raw_products": "raw_products.csv",
    "raw_markets": "raw_markets.csv",
    "raw_acquisition_costs": "raw_acquisition_costs.csv",
    "raw_operating_costs": "raw_operating_costs.csv",
}

def load_with_python():
    if not bigquery:
        print("Falling back to bq load command generator...")
        return False
    client = bigquery.Client(project=PROJECT_ID)
    dataset_ref = bigquery.DatasetReference(PROJECT_ID, DATASET_ID)

    for table_name, csv_name in TABLE_FILES.items():
        csv_path = DATA_DIR / csv_name
        if not csv_path.exists():
            print(f"Warning: {csv_path} does not exist")
            continue
        table_ref = dataset_ref.table(table_name)
        job_config = bigquery.LoadJobConfig(
            source_format=bigquery.SourceFormat.CSV,
            skip_leading_rows=1,
            autodetect=True,
            write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
        )
        print(f"Loading {csv_name} -> {PROJECT_ID}.{DATASET_ID}.{table_name}...")
        with open(csv_path, "rb") as f:
            load_job = client.load_table_from_file(f, table_ref, job_config=job_config)
        load_job.result()  # Wait for completion
        table = client.get_table(table_ref)
        print(f"  Loaded {table.num_rows} rows into {table_name}")
    return True

def generate_bq_cli_commands():
    print("\n=== BQ CLI LOAD COMMANDS (Run these if python SDK is not configured) ===\n")
    print(f"bq mk --location=EU -d {PROJECT_ID}:{DATASET_ID} || true\n")
    for table_name, csv_name in TABLE_FILES.items():
        csv_path = DATA_DIR / csv_name
        print(f"bq load --source_format=CSV --skip_leading_rows=1 --autodetect=true --replace \\")
        print(f"  {PROJECT_ID}:{DATASET_ID}.{table_name} \\")
        print(f"  {csv_path}\n")

if __name__ == "__main__":
    success = False
    try:
        success = load_with_python()
    except Exception as e:
        print(f"Python SDK load encountered: {e}")
    if not success:
        generate_bq_cli_commands()
