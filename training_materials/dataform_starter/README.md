# Trainee Dataform Starter Workspace

Welcome to your hands-on Dataform transformation workspace!

## Objective
As the incoming Lead Data Analyst, your mission is to transform the 6 raw BigQuery lakehouse tables in `aiwomen26ham-4452.invented_software_raw` into production-ready staging views and executive marts.

## Project Structure
- `workflow_settings.yaml`: Points Dataform Core 3.0+ to BigQuery location `EU`.
- `definitions/declarations/sources.js`: Declares all 6 raw BigQuery tables.
- `definitions/staging/`: Staging views where data cleansing, minor units division (/100), and entity deduplication occur.
- `definitions/intermediate/`: Date spines and business logic transforms.
- `definitions/mart/`: Executive reporting tables for Looker Studio.
- `definitions/assertions/`: Automated data quality checks.

## Traps to Avoid
1. **Minor Units**: Amounts are stored in cents as integers. Divide by 100.
2. **Currency Fan-Out**: Join subscriptions to merchants first, then to markets.
3. **Stock Among Flows**: Exclude `cash_balance_eom` from operating expenses.
4. **Subscription Lifetime**: Subscriptions with `status = 'cancelled'` stop generating MRR after `end_date`.

## Need Reference?
When you want to compare your models against verified production code, inspect the reference models in `solutions/dataform_completed/`.
