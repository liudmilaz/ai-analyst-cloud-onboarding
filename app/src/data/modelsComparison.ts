import { ModelComparison } from "../lib/types";

export const MODEL_COMPARISONS: ModelComparison[] = [
  {
    name: "stg_subscriptions",
    category: "staging",
    description: "Cleans subscription records, applies cents-to-euros division, and joins FX correctly through merchants to prevent fan-out.",
    keyTrapAvoided: "Avoids Trap 1 (minor units 100x) & Trap 2 (currency join fan-out 117 -> 300 rows).",
    dataformCode: `config {
  type: "view",
  schema: "invented_software_staging",
  description: "Cleaned subscriptions with minor unit conversion and EUR FX applied via merchant country join path"
}

SELECT
  s.subscription_id,
  s.merchant_id,
  s.plan_sku,
  s.start_date,
  s.end_date,
  s.mrr_local AS mrr_local_cents,
  ROUND(s.mrr_local / 100.0, 2) AS mrr_local,
  s.currency,
  m.country_code,
  mkt.eur_fx,
  ROUND((s.mrr_local / 100.0) * mkt.eur_fx, 2) AS mrr_eur,
  s.cancellation_reason
FROM
  \${ref("raw_subscriptions")} s
JOIN
  \${ref("stg_merchants")} m
  ON s.merchant_id = m.merchant_id
JOIN
  \${ref("stg_markets")} mkt
  ON m.country_code = mkt.country_code`,
    dbtCode: `{{ config(materialized="view") }}

SELECT
  s.subscription_id,
  s.merchant_id,
  s.plan_sku,
  s.start_date,
  s.end_date,
  s.mrr_local as mrr_local_cents,
  round(s.mrr_local / 100.0, 2) as mrr_local,
  s.currency,
  m.country_code,
  mkt.eur_fx,
  round((s.mrr_local / 100.0) * mkt.eur_fx, 2) as mrr_eur,
  s.cancellation_reason
FROM
  {{ source("raw", "raw_subscriptions") }} s
JOIN
  {{ ref("stg_merchants") }} m
  ON s.merchant_id = m.merchant_id
JOIN
  {{ ref("stg_markets") }} mkt
  ON m.country_code = mkt.country_code`,
    differences: [
      "Dataform uses config { type: \"view\" } at the top of the .sqlx file vs dbt {{ config(materialized=\"view\") }}",
      "Dataform references other models with ${ref(\"model\")} vs dbt {{ ref(\"model\") }}",
      "Dataform queries declared sources with ${ref(\"raw_subscriptions\")} without requiring separate source() macro syntax"
    ]
  },
  {
    name: "stg_operating_costs",
    category: "staging",
    description: "Filters and classifies operating expenses, flagging cash_balance_eom as a balance stock to prevent the 16x expense overstatement.",
    keyTrapAvoided: "Avoids Trap 3: Stock Among Flows (93.8% of column is a balance, not an expense).",
    dataformCode: `config {
  type: "view",
  schema: "invented_software_staging",
  description: "Operating costs with cost flow vs balance classification"
}

SELECT
  cost_id,
  year_month,
  TRIM(cost_category) AS cost_category,
  ROUND(amount_eur / 100.0, 2) AS amount_eur,
  TRIM(description) AS description,
  CASE
    WHEN TRIM(cost_category) = "cash_balance_eom" THEN FALSE
    ELSE TRUE
  END AS is_cost_flow
FROM
  \${ref("raw_operating_costs")}`,
    dbtCode: `{{ config(materialized="view") }}

SELECT
  cost_id,
  year_month,
  trim(cost_category) as cost_category,
  round(amount_eur / 100.0, 2) as amount_eur,
  trim(description) as description,
  case
    when trim(cost_category) = \x27cash_balance_eom\x27 then false
    else true
  end as is_cost_flow
FROM
  {{ source("raw", "raw_operating_costs") }}`,
    differences: [
      "Both frameworks use identical BigQuery SQL expressions inside the query block",
      "In Dataform, column documentation is placed directly inside the config { columns: {...} } block",
      "dbt places column documentation in external models/staging/schema.yml"
    ]
  },
  {
    name: "int_monthly_revenue",
    category: "intermediate",
    description: "Generates date spine using BigQuery GENERATE_DATE_ARRAY and explodes subscriptions into month-by-month MRR records.",
    keyTrapAvoided: "Handles non-uniform coverage and properly tracks recurring revenue across months.",
    dataformCode: `config {
  type: "table",
  schema: "invented_software_intermediate",
  description: "Monthly subscription explosion via date spine"
}

WITH months_spine AS (
  SELECT month_date
  FROM UNNEST(GENERATE_DATE_ARRAY("2022-06-01", "2025-12-01", INTERVAL 1 MONTH)) AS month_date
)

SELECT
  m.month_date,
  s.subscription_id,
  s.merchant_id,
  s.plan_sku,
  s.mrr_eur,
  p.product_name,
  p.cogs_eur,
  p.gross_margin_pct
FROM
  months_spine m
JOIN
  \${ref("stg_subscriptions")} s
  ON m.month_date >= DATE_TRUNC(s.start_date, MONTH)
  AND (s.end_date IS NULL OR m.month_date <= DATE_TRUNC(s.end_date, MONTH))
LEFT JOIN
  \${ref("stg_products")} p
  ON s.plan_sku = p.sku`,
    dbtCode: `{{ config(materialized="table") }}

WITH months_spine AS (
  SELECT month_date
  FROM UNNEST(GENERATE_DATE_ARRAY(\x272022-06-01\x27, \x272025-12-01\x27, INTERVAL 1 MONTH)) AS month_date
)

SELECT
  m.month_date,
  s.subscription_id,
  s.merchant_id,
  s.plan_sku,
  s.mrr_eur,
  p.product_name,
  p.cogs_eur,
  p.gross_margin_pct
FROM
  months_spine m
JOIN
  {{ ref("stg_subscriptions") }} s
  ON m.month_date >= DATE_TRUNC(s.start_date, MONTH)
  AND (s.end_date IS NULL OR m.month_date <= DATE_TRUNC(s.end_date, MONTH))
LEFT JOIN
  {{ ref("stg_products") }} p
  ON s.plan_sku = p.sku`,
    differences: [
      "Dataform creates native BigQuery tables in the dataset defined by schema parameter",
      "Native BigQuery functions like GENERATE_DATE_ARRAY work out of the box in both"
    ]
  },
  {
    name: "assert_clean_operating_costs",
    category: "assertion",
    description: "Quality assurance test ensuring no balance stock is tagged as a cost flow.",
    keyTrapAvoided: "Guarantees no regression where cash_balance_eom leaks into monthly P&L expenses.",
    dataformCode: `config {
  type: "assertion",
  schema: "invented_software_assertions",
  description: "Quality test: cash_balance_eom must never be marked as cost flow"
}

SELECT
  cost_id,
  cost_category,
  amount_eur
FROM
  \${ref("stg_operating_costs")}
WHERE
  cost_category = "cash_balance_eom"
  AND is_cost_flow = TRUE`,
    dbtCode: `-- tests/assert_clean_operating_costs.sql
SELECT
  cost_id,
  cost_category,
  amount_eur
FROM
  {{ ref("stg_operating_costs") }}
WHERE
  cost_category = \x27cash_balance_eom\x27
  AND is_cost_flow = true`,
    differences: [
      "In Dataform, assertions are first-class models created with type: \"assertion\"",
      "In dbt, tests are placed in tests/*.sql or defined in schema.yml",
      "Both frameworks fail if the query returns any rows (row count > 0 = test failure)"
    ]
  }
];
