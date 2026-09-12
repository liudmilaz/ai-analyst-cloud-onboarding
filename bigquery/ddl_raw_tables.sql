-- BigQuery DDL for Invented Software Raw Dataset
-- Project: aiwomen26ham-4452
-- Dataset: invented_software_raw

CREATE SCHEMA IF NOT EXISTS `aiwomen26ham-4452.invented_software_raw`
OPTIONS (
  location = "EU",
  description = "Raw ingested CSV tables for Invented Software SaaS analytics onboarding"
);

CREATE OR REPLACE TABLE `aiwomen26ham-4452.invented_software_raw.raw_merchants` (
  merchant_id STRING NOT NULL OPTIONS(description="Unique merchant ID (UUID)"),
  merchant_name STRING OPTIONS(description="Business display name"),
  business_type STRING OPTIONS(description="Category (cafe, bakery, beauty_salon, food_truck, etc.)"),
  country_code STRING NOT NULL OPTIONS(description="Two-letter ISO country code, FK to raw_markets"),
  city STRING OPTIONS(description="City of operation"),
  signup_date DATE NOT NULL OPTIONS(description="Date merchant signed up (2022-06-11 to 2024-06-29)"),
  plan_type STRING OPTIONS(description="Plan at SIGNUP (not current plan! 42 read free while holding paid subs)"),
  status STRING NOT NULL OPTIONS(description="Merchant status: active or churned"),
  churn_date DATE OPTIONS(description="Date of churn if status=churned")
);

CREATE OR REPLACE TABLE `aiwomen26ham-4452.invented_software_raw.raw_subscriptions` (
  subscription_id STRING NOT NULL OPTIONS(description="Unique subscription period ID"),
  merchant_id STRING NOT NULL OPTIONS(description="FK to raw_merchants.merchant_id"),
  plan_sku STRING NOT NULL OPTIONS(description="SKU of plan or add-on (SW-001 to SW-005)"),
  start_date DATE NOT NULL OPTIONS(description="Start date of subscription period"),
  end_date DATE OPTIONS(description="End date if cancelled (NULL = currently active)"),
  mrr_local INT64 NOT NULL OPTIONS(description="Monthly recurring revenue in LOCAL currency CENTS"),
  currency STRING NOT NULL OPTIONS(description="Local currency (EUR, GBP, BRL, USD, etc.)"),
  cancellation_reason STRING OPTIONS(description="Reason if cancelled"),
  previous_plan_sku STRING OPTIONS(description="Previous plan SKU if upgraded/downgraded")
);

CREATE OR REPLACE TABLE `aiwomen26ham-4452.invented_software_raw.raw_products` (
  sku STRING NOT NULL OPTIONS(description="Stock Keeping Unit identifier"),
  name STRING NOT NULL OPTIONS(description="Product name"),
  type STRING OPTIONS(description="Catalogue classification label"),
  price_eur INT64 NOT NULL OPTIONS(description="Standard price in EUR CENTS"),
  cogs_eur INT64 NOT NULL OPTIONS(description="Cost of goods sold in EUR CENTS"),
  gross_margin_pct FLOAT64 NOT NULL OPTIONS(description="Target gross profit margin percentage"),
  description STRING OPTIONS(description="Detailed product feature description"),
  launched_at DATE OPTIONS(description="Product launch date")
);

CREATE OR REPLACE TABLE `aiwomen26ham-4452.invented_software_raw.raw_markets` (
  country_code STRING NOT NULL OPTIONS(description="ISO country code"),
  country_name STRING NOT NULL OPTIONS(description="Full country name"),
  region STRING OPTIONS(description="Geographic region"),
  currency STRING NOT NULL OPTIONS(description="Local currency symbol"),
  eur_fx FLOAT64 NOT NULL OPTIONS(description="Exchange rate multiplier to EUR: eur = local * eur_fx"),
  launch_year INT64 OPTIONS(description="Year market was opened"),
  vat_rate FLOAT64 OPTIONS(description="Standard VAT rate")
);

CREATE OR REPLACE TABLE `aiwomen26ham-4452.invented_software_raw.raw_acquisition_costs` (
  cost_id STRING NOT NULL OPTIONS(description="Spend line ID"),
  year_month DATE NOT NULL OPTIONS(description="Billing month (2024-01-01 to 2025-12-01)"),
  country_code STRING NOT NULL OPTIONS(description="FK to raw_markets.country_code"),
  channel STRING NOT NULL OPTIONS(description="Marketing channel"),
  spend_amount INT64 NOT NULL OPTIONS(description="Spend in LOCAL currency CENTS"),
  currency STRING NOT NULL OPTIONS(description="Local currency")
)
PARTITION BY year_month;

CREATE OR REPLACE TABLE `aiwomen26ham-4452.invented_software_raw.raw_operating_costs` (
  cost_id STRING NOT NULL OPTIONS(description="Cost entry ID"),
  year_month DATE NOT NULL OPTIONS(description="First day of month"),
  cost_category STRING NOT NULL OPTIONS(description="Category (WARNING: includes cash_balance_eom)"),
  amount_eur INT64 NOT NULL OPTIONS(description="Amount in EUR CENTS"),
  description STRING OPTIONS(description="Memo")
)
PARTITION BY year_month;
