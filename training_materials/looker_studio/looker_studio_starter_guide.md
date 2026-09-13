# Looker Studio Trainee Starter Guide

Welcome to the Looker Studio reporting module for **Invented Software Inc.**.

## Direct Blank Report Link
To begin building your executive report from a blank canvas:
👉 [Create New Blank Report in Looker Studio](https://lookerstudio.google.com/reporting/create)

## Data Source Connection
1. In Looker Studio, select the **BigQuery** connector.
2. Select Project: `aiwomen26ham-4452`.
3. Select Dataset: `invented_software_mart`.
4. Connect to tables:
   - `mart_mrr_monthly`: For Exit ARR, MRR Growth, and Subscriber counts.
   - `mart_pnl_summary`: For Net Monthly Burn, Operational Expenses, and Cash Runway.
   - `mart_customer_retention`: For Logo Churn (9.47%) and Cohort Retention.

## Required Executive Scorecards
| Scorecard | Dimension | Metric Formula | Benchmark |
| :--- | :--- | :--- | :--- |
| **Exit ARR (Dec 2025)** | `month_date = '2025-12-01'` | `total_mrr_eur * 12` | **€18,117.34** |
| **Logo Churn Rate** | Period 2024-2025 | `churned_paying / total_paying` | **9.47%** (9 / 95) |
| **Monthly Net Burn** | Average 2024-2025 | `clean_opex + cac - revenue` | **€3,253 / mo** |
| **Cash Runway** | End of 2025 | `cash_balance / net_monthly_burn` | **~15.5 to 17.6 Mo** |

## Verified Solution Reference
For the complete dashboard specification and pre-built chart templates, consult `solutions/looker_studio/dashboard_specification.md`.
