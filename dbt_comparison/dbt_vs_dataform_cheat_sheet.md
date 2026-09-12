# dbt Core vs. Google Cloud Dataform: Side-by-Side Cheat Sheet

This guide provides a 1-to-1 mapping for data analysts transitioning between **dbt** (the de facto open-source standard) and **Google Cloud Dataform** (BigQuery-native serverless transformation engine).

---

## 1. Concept Mapping

| Concept | dbt Core | Google Cloud Dataform |
| :--- | :--- | :--- |
| **Project Config** | `dbt_project.yml` | `dataform.json` |
| **Dependencies** | `packages.yml` | `package.json` |
| **Model File** | `.sql` (Jinja + SQL) | `.sqlx` (Config Block + JavaScript + SQL) |
| **Source Declaration** | `sources:` block in `schema.yml` | `declare({ schema, name })` in `.js` or `type: "declaration"` in `.sqlx` |
| **Model References** | `{{ ref('model_name') }}` | `${ref("model_name")}` |
| **Source References** | `{{ source('raw', 'table') }}` | `${ref("table")}` (once declared) |
| **Materialization** | `{{ config(materialized='view') }}` | `config { type: "view" }` |
| **Data Quality Tests** | `tests:` in `schema.yml` (unique, not_null) | `type: "assertion"` in `.sqlx` or built-in `assertions: { uniqueKey, nonNull }` |
| **Documentation** | `description:` in `schema.yml` | `description:` and `columns:` in `config {}` |
| **Templating Language** | Jinja2 (Python-based) | JavaScript (ES6) |
| **Orchestration** | `dbt build`, `dbt run` CLI | Cloud Dataform API / Workflow Configurations / Workflows |
| **Compute Engine** | Runs client-side, sends SQL to DWH | 100% Serverless in Google Cloud, runs directly inside BigQuery |

---

## 2. Model Syntax Comparison

### Staging Model: `stg_merchants`

#### dbt (`models/staging/stg_merchants.sql`)
```sql
{{ config(materialized="view") }}

select
    trim(merchant_id) as merchant_id,
    trim(merchant_name) as merchant_name,
    trim(business_type) as business_type,
    upper(trim(country_code)) as country_code,
    trim(city) as city,
    signup_date,
    trim(plan_type) as signup_plan_type,
    trim(status) as status,
    churn_date
from {{ source("invented_software_raw", "raw_merchants") }}
where merchant_id is not null
```

#### Dataform (`definitions/staging/stg_merchants.sqlx`)
```sql
config {
  type: "view",
  schema: "invented_software_staging",
  description: "Cleaned merchant records",
  columns: {
    merchant_id: "Primary key for merchant"
  }
}

SELECT
  TRIM(merchant_id) AS merchant_id,
  TRIM(merchant_name) AS merchant_name,
  TRIM(business_type) AS business_type,
  UPPER(TRIM(country_code)) AS country_code,
  TRIM(city) AS city,
  signup_date,
  TRIM(plan_type) AS signup_plan_type,
  TRIM(status) AS status,
  churn_date
FROM ${ref("raw_merchants")}
WHERE merchant_id IS NOT NULL
```

---

## 3. Data Quality & Assertions

### dbt (`models/staging/schema.yml`)
```yaml
version: 2
models:
  - name: stg_subscriptions
    columns:
      - name: subscription_id
        tests:
          - unique
          - not_null
      - name: mrr_eur
        tests:
          - dbt_utils.expression_is_true:
              expression: ">= 0"
```

### Dataform (`definitions/assertions/assert_mrr_positive.sqlx`)
```sql
config {
  type: "assertion",
  schema: "invented_software_assertions",
  description: "MRR must never be negative"
}

SELECT
  subscription_id,
  mrr_eur
FROM ${ref("stg_subscriptions")}
WHERE mrr_eur < 0
```
*(In Dataform, any rows returned by an assertion query trigger a test failure, exactly like custom dbt singular tests!)*
