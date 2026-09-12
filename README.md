# AI Analyst Onboarding & Upskilling Platform
### Google Cloud (AI Studio) & Dataform Edition

> **Target GCP Project:** `aiwomen26ham-4452`  
> **Based on:** [ai_analyst_onboarding](https://github.com/liudmilaz/ai_analyst_onboarding)  
> **Original Stack:** PostgreSQL + dbt Core + Docker Compose + Metabase  
> **Google Cloud Stack:** BigQuery + Dataform + Cloud Run + Looker Studio + Gemini AI  

---

## 1. Executive Summary

This platform is a hands-on onboarding and upskilling training ground for data analysts working with modern cloud transformation tools (**Dataform** and **dbt**).

The trainee begins with six raw CSV files and a business specification for **Invented Software**, a fictional B2B SaaS company selling recurring-fee business software to small merchants across 8 international markets. The analyst builds a complete analytics platform end-to-end on Google Cloud:

$$\text{Raw CSVs} \longrightarrow \text{BigQuery Lakehouse} \longrightarrow \text{Dataform Transformations} \longrightarrow \text{Looker Studio Dashboard}$$

Throughout the journey, an **AI Mentor** powered by **Google Gemini** provides Socratic, spoiler-controlled guidance, challenging the analyst to defend their conclusions rather than simply copying code.

---

## 2. Technical Stack Translation

| Original Architecture | Google Cloud / AI Studio Stack | Rationale & Enterprise Advantage |
| :--- | :--- | :--- |
| **PostgreSQL (Local / Docker)** | **Google BigQuery** (`invented_software_*`) | Petabyte-scale serverless lakehouse; zero index tuning; native column-level security. |
| **dbt Core (Docker Container)** | **Google Cloud Dataform** (SQLX) | BigQuery-native, serverless SQL compilation with built-in lineage and automated assertions. |
| **Docker Compose** | **Google Cloud Run** | Zero-infra serverless container hosting with auto-scaling to zero and HTTPS endpoints. |
| **Metabase** | **Looker Studio** | Native BigQuery connector; interactive executive BI scorecards and real-time refreshes. |
| **Claude Code / AGENTS.md** | **Gemini 1.5 / 2.0 (Google AI Studio)** | Embedded Socratic AI mentor with strict spoiler-control guidelines and checkpoint evaluation. |
| **Manual Scripts** | **Google Cloud Build CI/CD** | Automated image builds, Dataform compilation checks, and continuous deployment. |

---

## 3. The Analyst Track Choice: Dataform vs. dbt

The brief specifies: *"Let the analyst choose between dbt and Dataform, but apply Dataform."*

This platform provides:
1. **Applied Engine (Dataform)**: The production transformations, table materializations, assertions, and pipelines running against BigQuery use Google Cloud Dataform (`.sqlx`).
2. **Side-by-Side Comparison (dbt Track)**: Every model has an exact dbt Core counterpart in `dbt_comparison/` and in the interactive web UI. Analysts can toggle between Dataform and dbt views to see:
   - `config { type: "view" }` vs `{{ config(materialized="view") }}`
   - `${ref("model")}` vs `{{ ref("model") }}`
   - Dataform SQLX assertions vs dbt `schema.yml` tests and singular SQL tests
   - JavaScript blocks vs Jinja macros

See the full [dbt to Dataform Cheat Sheet](dbt_comparison/dbt_vs_dataform_cheat_sheet.md).

---

## 4. The 3 Deliberate Data Traps & Verified Truth

The core philosophy of this curriculum is that **the pipeline is the means, not the goal**. Real analysts must catch subtle data discrepancies that silent tools miss:

### Trap 1: Minor Units (Cents)
- **The Issue**: All monetary amounts in raw CSVs (`mrr_local`, `amount_eur`, `price_eur`, `cogs_eur`, `spend_amount`) are stored in minor units (cents).
- **Impact**: Omitting `/ 100` causes a **100× error** (€113,785 instead of €1,137.85).
- **Resolution**: Staged views explicitly divide by 100.0 into float/numeric fields.

### Trap 2: Currency Join Fan-Out
- **The Issue**: Joining `raw_subscriptions` directly to `raw_markets` on `currency` fans out rows from 117 to **300**, because 4 European markets (DE, FR, IT, ES) share the EUR currency.
- **Impact**: Inflates total revenue by **2.61×** (€4,433.36 vs. €1,697.75).
- **Resolution**: Foreign key must route through the merchant: `raw_subscriptions.merchant_id → raw_merchants.country_code → raw_markets.country_code`.

### Trap 3: Stock Among Flows (The 16× Trap)
- **The Issue**: `raw_operating_costs` contains a line item with `cost_category = 'cash_balance_eom'`. This is a point-in-time balance sheet **stock**, not an operating cost **flow**! It comprises 93.8% of the column sum.
- **Impact**: An unfiltered sum shows **€54,814/month** in operating expenses. A company with ~€1.5k/month in revenue appears to have a 1-month runway.
- **Resolution**: `stg_operating_costs` classifies `is_cost_flow = (cost_category != 'cash_balance_eom')`. Real operating costs are **€3,419/month**, revealing an implied cash runway of **~17.6 months** (€57,235 balance ÷ €3,253 net burn).

---

## 5. Verified Ground Truth Metrics

| Metric | Verified Value | Notes / Denominator Defense |
| :--- | :--- | :--- |
| **Jan 2024 MRR** | **€1,137.85** | Inclusive end-date, no proration. |
| **Dec 2024 MRR** | **€1,640.77** | Peak 2024 MRR. |
| **Dec 2025 MRR** | **€1,509.78** | Exit month MRR. |
| **Exit ARR** | **€18,117.34** | Dec 2025 MRR × 12. |
| **Logo Churn Rate** | **9.5%** | 9 churned ÷ **95 paying merchants** (65 non-paying signups excluded). |
| **Clean Monthly Opex** | **€3,419 / mo** | Cost flows only (excluding `cash_balance_eom`). |
| **Monthly CAC Spend** | **€1,352 / mo** | €32,439 across 24 months. |
| **Monthly Net Burn** | **€3,253 / mo** | Clean Opex (€3,419) + CAC (€1,352) − Revenue (€1,517). |
| **Latest Cash Balance** | **€57,235** | Dec 31, 2025 point-in-time cash balance. |
| **Implied Runway** | **~17.6 Months** | €57,235 ÷ €3,253. |

---

## 6. Project Structure

```
ai_analyst_cloud_onboarding/
├── bigquery/                       # BigQuery DDL, loaders, and verification SQL
│   ├── ddl_raw_tables.sql          # Target schema DDL for aiwomen26ham-4452
│   ├── load_raw_data.py            # Python ingestion script
│   └── test_queries.sql            # Ground-truth validation SQL
├── dataform/                       # Complete Applied Dataform project
│   ├── dataform.json               # Config: EU location, project aiwomen26ham-4452
│   ├── package.json                # @dataform/core dependencies
│   └── definitions/
│       ├── declarations/sources.js # External raw table sources
│       ├── staging/                # 6 cleaned staging views (cents/FX/opex traps handled)
│       ├── intermediate/           # Month-explosion date spine & merchant lifecycle
│       ├── mart/                   # MRR monthly, unit economics, P&L, executive KPIs
│       └── assertions/             # Automated quality tests (zero row return rule)
├── dbt_comparison/                 # Side-by-side dbt Core project
│   ├── dbt_project.yml             # dbt configuration with BigQuery target
│   ├── profiles.yml                # OAuth connection profile
│   ├── dbt_vs_dataform_cheat_sheet.md # 1-to-1 syntax and concept mapping
│   └── models/                     # Equivalent dbt staging, intermediate, and marts
├── gcp/                            # Automated deployment scripts
│   ├── setup_environment.sh        # Enables APIs, creates datasets, setups registries
│   ├── load_bigquery_tables.sh     # bq load runner for all 6 tables
│   ├── deploy_cloud_run.sh         # Cloud Run deployment script
│   └── cloudbuild.yaml             # CI/CD pipeline definition
├── app/                            # Interactive Onboarding Web App (Next.js 14)
│   ├── src/app/                    # App Router pages (Phases, Dashboard, Playground, Compare)
│   ├── src/components/             # UI components (Navbar, Sidebar, Mentor, Dashboard)
│   ├── src/data/                   # Curricula, verified metrics, models comparison
│   ├── src/lib/                    # Gemini Socratic mentor integration
│   ├── Dockerfile                  # Container definition for Cloud Run
│   └── package.json
└── data/                           # The 6 canonical CSV data files
```

---

## 7. Quick Start & Deployment Guide

### Step 1: Initialize GCP Environment
```bash
cd gcp
chmod +x *.sh
./setup_environment.sh
```
*This enables BigQuery, Dataform, Cloud Run, Artifact Registry, and AI Platform APIs, and initializes the BigQuery datasets in `aiwomen26ham-4452`.*

### Step 2: Ingest the Raw Data into BigQuery
```bash
./load_bigquery_tables.sh
```
*Loads all 6 CSV files into `aiwomen26ham-4452.invented_software_raw`.*

### Step 3: Deploy the Training Portal to Cloud Run
```bash
./deploy_cloud_run.sh
```
*Builds the container via Cloud Build and deploys to Cloud Run with public HTTPS access.*

---

## 8. Development & Local Run

To run the Next.js training portal locally:
```bash
cd app
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the onboarding portal, interact with the AI mentor, explore the side-by-side model comparator, and inspect the Executive BI Dashboard.
