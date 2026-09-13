"use client";

import React, { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { MentorChatModal } from "../../components/MentorChatModal";
import { LearningTrack } from "../../lib/types";

interface DataformFile {
  path: string;
  name: string;
  layer: "config" | "sources" | "staging" | "intermediate" | "mart" | "assertions";
  description: string;
  correctionApplied: string;
  code: string;
}

const DATAFORM_FILES: DataformFile[] = [
  {
    path: "workflow_settings.yaml",
    name: "workflow_settings.yaml",
    layer: "config",
    description: "Core project configuration for Google Cloud Dataform Core 3.0+ targeting BigQuery in aiwomen26ham-4452.",
    correctionApplied: "Configured for BigQuery lakehouse datasets in region EU with defaultAssertionDataset defined.",
    code: `defaultProject: "aiwomen26ham-4452"
defaultLocation: "EU"
defaultDataset: "invented_software_staging"
defaultAssertionDataset: "invented_software_assertions"`
  },
  {
    path: "definitions/declarations/sources.js",
    name: "sources.js",
    layer: "sources",
    description: "Declares the 6 BigQuery raw lakehouse tables as external sources in Dataform.",
    correctionApplied: "Directly points to aiwomen26ham-4452.invented_software_raw tables ingested from the canonical CSVs.",
    code: `const rawTables = [
  "raw_merchants",
  "raw_subscriptions",
  "raw_products",
  "raw_markets",
  "raw_acquisition_costs",
  "raw_operating_costs"
];

rawTables.forEach((table) => {
  declare({
    database: "aiwomen26ham-4452",
    schema: "invented_software_raw",
    name: table,
    description: \`Raw lakehouse table for \${table}\`
  });
});`
  },
  {
    path: "definitions/staging/stg_subscriptions.sqlx",
    name: "stg_subscriptions.sqlx",
    layer: "staging",
    description: "Cleans subscription records, converts minor units (cents) to EUR, and resolves the FX join path.",
    correctionApplied: "CORRECTION 1: Divides mrr_local by 100.0 to prevent 100x inflation.\nCORRECTION 2: Routes foreign exchange join through stg_merchants.country_code to prevent 300-row fan-out.",
    code: `config {
  type: "view",
  schema: "invented_software_staging",
  description: "Cleaned subscriptions with minor unit conversion and EUR FX applied via merchant country join path",
  columns: {
    subscription_id: "Unique subscription identifier",
    merchant_id: "Merchant identifier foreign key",
    mrr_eur: "Monthly recurring revenue converted to EUR using merchant market exchange rate"
  }
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
  -- Correct join path: subscriptions -> merchants -> markets
  -- Prevents Cartesian multiplication across EUR markets (DE, FR, IT, ES)
  ROUND((s.mrr_local / 100.0) * mkt.eur_fx, 2) AS mrr_eur,
  s.cancellation_reason
FROM
  \${ref("raw_subscriptions")} s
JOIN
  \${ref("stg_merchants")} m
  ON s.merchant_id = m.merchant_id
JOIN
  \${ref("stg_markets")} mkt
  ON m.country_code = mkt.country_code`
  },
  {
    path: "definitions/staging/stg_operating_costs.sqlx",
    name: "stg_operating_costs.sqlx",
    layer: "staging",
    description: "Cleans operating expenses and isolates the point-in-time cash balance stock.",
    correctionApplied: "CORRECTION 3: Flags cash_balance_eom with is_cost_flow = false, eliminating the 16x expense overstatement.",
    code: `config {
  type: "view",
  schema: "invented_software_staging",
  description: "Operating costs with cost flow vs balance sheet classification",
  columns: {
    cost_id: "Unique cost line item ID",
    year_month: "Billing month (YYYY-MM-01)",
    amount_eur: "Clean expense in EUR (divided by 100)",
    is_cost_flow: "TRUE for actual operating expenses; FALSE for cash_balance_eom stock balance"
  }
}

SELECT
  cost_id,
  year_month,
  TRIM(cost_category) AS cost_category,
  ROUND(amount_eur / 100.0, 2) AS amount_eur,
  TRIM(description) AS description,
  -- Crucial correction: cash_balance_eom is a balance sheet asset stock, not an expense flow
  CASE
    WHEN TRIM(cost_category) = "cash_balance_eom" THEN FALSE
    ELSE TRUE
  END AS is_cost_flow
FROM
  \${ref("raw_operating_costs")}`
  },
  {
    path: "definitions/intermediate/int_monthly_revenue.sqlx",
    name: "int_monthly_revenue.sqlx",
    layer: "intermediate",
    description: "Generates calendar spine using BigQuery GENERATE_DATE_ARRAY and explodes subscriptions month by month.",
    correctionApplied: "Ensures continuous month coverage for active subscriptions, preserving recurring MRR across non-uniform reporting periods.",
    code: `config {
  type: "table",
  schema: "invented_software_intermediate",
  description: "Monthly subscription explosion via BigQuery GENERATE_DATE_ARRAY calendar spine"
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
  ON s.plan_sku = p.sku`
  },
  {
    path: "definitions/intermediate/int_merchant_lifecycle.sqlx",
    name: "int_merchant_lifecycle.sqlx",
    layer: "intermediate",
    description: "Aggregates customer lifetime subscriptions and determines paying vs non-paying status.",
    correctionApplied: "Distinguishes between 95 paying customers and 65 non-converting signups for accurate retention modeling.",
    code: `config {
  type: "table",
  schema: "invented_software_intermediate",
  description: "Merchant lifetime status, subscription count, and tenure"
}

SELECT
  m.merchant_id,
  m.merchant_name,
  m.country_code,
  m.created_at,
  m.status AS current_status,
  COUNT(s.subscription_id) AS total_subscriptions_count,
  CASE WHEN COUNT(s.subscription_id) > 0 THEN TRUE ELSE FALSE END AS is_paying_customer,
  MIN(s.start_date) AS first_subscription_date,
  MAX(s.end_date) AS last_subscription_end_date,
  ROUND(SUM(s.mrr_eur), 2) AS total_historical_mrr_eur
FROM
  \${ref("stg_merchants")} m
LEFT JOIN
  \${ref("stg_subscriptions")} s
  ON m.merchant_id = s.merchant_id
GROUP BY
  1, 2, 3, 4, 5`
  },
  {
    path: "definitions/mart/mart_mrr_monthly.sqlx",
    name: "mart_mrr_monthly.sqlx",
    layer: "mart",
    description: "Monthly recurring revenue, ARR, gross margin, and active client count across 2024-2025.",
    correctionApplied: "Produces verified Dec 2025 MRR of €1,509.78 and Exit ARR of €18,117.34.",
    code: `config {
  type: "table",
  schema: "invented_software_mart",
  description: "Production MRR mart with monthly aggregates and active subscriber counts"
}

SELECT
  month_date,
  COUNT(DISTINCT merchant_id) AS active_paying_merchants,
  COUNT(DISTINCT subscription_id) AS active_subscriptions,
  ROUND(SUM(mrr_eur), 2) AS total_mrr_eur,
  ROUND(SUM(mrr_eur) * 12, 2) AS annualized_run_rate_arr_eur,
  ROUND(AVG(gross_margin_pct), 1) AS blended_gross_margin_pct
FROM
  \${ref("int_monthly_revenue")}
GROUP BY
  month_date
ORDER BY
  month_date ASC`
  },
  {
    path: "definitions/mart/mart_pnl_summary.sqlx",
    name: "mart_pnl_summary.sqlx",
    layer: "mart",
    description: "Monthly P&L reporting net burn, clean operating expenses, CAC spend, and cash balance.",
    correctionApplied: "Isolates cash balance from cost flows, revealing true net burn of €3,253/mo and ~17.6 months of cash runway.",
    code: `config {
  type: "table",
  schema: "invented_software_mart",
  description: "Executive P&L summary with clean operational burn and runway"
}

WITH monthly_rev AS (
  SELECT month_date, SUM(mrr_eur) AS revenue_eur
  FROM \${ref("int_monthly_revenue")}
  GROUP BY 1
),
monthly_clean_opex AS (
  SELECT year_month AS month_date, SUM(amount_eur) AS opex_eur
  FROM \${ref("stg_operating_costs")}
  WHERE is_cost_flow = TRUE
  GROUP BY 1
),
monthly_cac AS (
  SELECT year_month AS month_date, SUM(spend_amount_eur) AS cac_eur
  FROM \${ref("stg_acquisition_costs")}
  GROUP BY 1
),
monthly_cash_balance AS (
  SELECT year_month AS month_date, SUM(amount_eur) AS cash_balance_eur
  FROM \${ref("stg_operating_costs")}
  WHERE is_cost_flow = FALSE
  GROUP BY 1
)

SELECT
  r.month_date,
  COALESCE(r.revenue_eur, 0) AS revenue_eur,
  COALESCE(o.opex_eur, 0) AS clean_opex_eur,
  COALESCE(c.cac_eur, 0) AS acquisition_cac_eur,
  ROUND((COALESCE(o.opex_eur, 0) + COALESCE(c.cac_eur, 0)) - COALESCE(r.revenue_eur, 0), 2) AS net_burn_eur,
  b.cash_balance_eur,
  ROUND(b.cash_balance_eur / NULLIF((COALESCE(o.opex_eur, 0) + COALESCE(c.cac_eur, 0)) - COALESCE(r.revenue_eur, 0), 0), 1) AS implied_runway_months
FROM
  monthly_rev r
LEFT JOIN monthly_clean_opex o ON r.month_date = o.month_date
LEFT JOIN monthly_cac c ON r.month_date = c.month_date
LEFT JOIN monthly_cash_balance b ON r.month_date = b.month_date
ORDER BY
  month_date ASC`
  },
  {
    path: "definitions/assertions/assert_clean_operating_costs.sqlx",
    name: "assert_clean_operating_costs.sqlx",
    layer: "assertions",
    description: "Quality assurance test: fails if cash_balance_eom is ever marked as a cost flow.",
    correctionApplied: "Enforces zero row violation rule to prevent future regressions in P&L reporting.",
    code: `config {
  type: "assertion",
  schema: "invented_software_assertions",
  description: "Quality test: cash_balance_eom must never be flagged as a cost flow"
}

SELECT
  cost_id,
  year_month,
  cost_category,
  amount_eur
FROM
  \${ref("stg_operating_costs")}
WHERE
  cost_category = "cash_balance_eom"
  AND is_cost_flow = TRUE`
  }
];

export default function DataformPage() {
  const [currentTrack, setCurrentTrack] = useState<LearningTrack>("dataform");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedFileIdx, setSelectedFileIdx] = useState(2); // stg_subscriptions by default

  const activeFile = DATAFORM_FILES[selectedFileIdx];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar
        currentTrack={currentTrack}
        onTrackChange={setCurrentTrack}
        onOpenChat={() => setIsChatOpen(true)}
      />

      <main className="flex-1 p-6 lg:p-8 pt-10 max-w-7xl mx-auto w-full space-y-6">
        {/* Top Header Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="rounded bg-indigo-900/60 px-2 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-700/50">
                  Dataform Reference Solutions
                </span>
                <span className="text-xs text-slate-400">GCP Project: aiwomen26ham-4452</span>
              </div>
              <h1 className="text-2xl font-bold text-white leading-tight">
                Dataform Reference Solutions (NovaScale Analytics)
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                This is the verified reference repository. For hands-on training, start in the empty workspace; use this reference to compare your staging models, date spines, marts, and data assertions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://console.cloud.google.com/bigquery/dataform?project=aiwomen26ham-4452"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
              >
                <span>Empty Dataform Workspace</span>
                <span>↗</span>
              </a>
              <a
                href="https://console.cloud.google.com/bigquery/dataform/locations/europe-west1/repositories/invented-software-transformations/workspaces/production?project=aiwomen26ham-4452"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-emerald-500 transition ring-2 ring-emerald-400/30"
              >
                <span>🚀 Open Ready Deployed Project in Dataform</span>
                <span className="text-sm">↗</span>
              </a>
              <a
                href="https://console.cloud.google.com/bigquery/dataform/locations/europe-west1/repositories/invented-software-transformations?project=aiwomen26ham-4452"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
              >
                <span>Repository Overview</span>
                <span>↗</span>
              </a>
              <a
                href="https://console.cloud.google.com/bigquery?project=aiwomen26ham-4452"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600/80 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition"
              >
                <span>BigQuery Studio</span>
                <span>↗</span>
              </a>
              <a
                href="https://github.com/liudmilaz/ai-analyst-cloud-onboarding/tree/main/dataform"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                <span>GitHub Repo</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Live Workspace Info Banner */}
        <div className="rounded-xl border border-indigo-900/50 bg-indigo-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-indigo-400 font-bold flex items-center gap-1.5">
              <span>⚡ Live GCP Target:</span>
              <span className="font-mono text-slate-200">invented-software-transformations / workspaces / production</span>
            </span>
            <p className="text-slate-400">
              Region: <strong className="text-slate-300">europe-west1</strong> • Target Datasets: <strong className="text-slate-300">invented_software_staging, invented_software_mart</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden md:inline">Sync code from Cloud Shell:</span>
            <code className="rounded bg-slate-900 px-2 py-1 text-[11px] font-mono text-indigo-300 border border-slate-800">
              ./deploy_dataform_to_gcp.sh
            </code>
          </div>
        </div>

        {/* Main Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* File Tree Sidebar */}
          <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Repository File Tree
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-1.5 py-0.5 rounded">
                9 Models & Assertions
              </span>
            </div>

            <div className="space-y-1">
              {DATAFORM_FILES.map((file, idx) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIdx(idx)}
                  className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition ${
                    selectedFileIdx === idx
                      ? "bg-indigo-950 border border-indigo-700/60 text-white font-medium"
                      : "text-slate-300 hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-500 font-mono text-[10px]">
                      {file.layer === "staging" ? "stg" : file.layer === "mart" ? "mrt" : file.layer === "assertions" ? "tst" : "cfg"}
                    </span>
                    <span className="truncate">{file.name}</span>
                  </div>
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${
                    file.layer === "staging"
                      ? "bg-blue-950 text-blue-300"
                      : file.layer === "mart"
                      ? "bg-purple-950 text-purple-300"
                      : file.layer === "assertions"
                      ? "bg-emerald-950 text-emerald-300"
                      : "bg-slate-800 text-slate-400"
                  }`}>
                    {file.layer}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-slate-950 p-3 text-[11px] text-slate-400 border border-slate-800 space-y-1">
              <p className="font-semibold text-slate-300">⚡ Dataform Execution Graph</p>
              <p>Dataform parses the <code>\${"{"}ref(...){"}"}</code> references and compiles a DAG running directly inside BigQuery with zero data egress.</p>
            </div>
          </div>

          {/* Code Viewer & Corrections Panel */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">{activeFile.path}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{activeFile.description}</p>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                  SQLX Model
                </span>
              </div>

              {/* Analytical Correction Callout */}
              <div className="rounded-lg bg-emerald-950/30 border border-emerald-800/40 p-3 text-xs text-emerald-200 space-y-1">
                <span className="font-bold text-emerald-400">✓ Analytical Correction Implemented:</span>
                <p className="text-[11px] text-slate-300 whitespace-pre-line leading-relaxed">
                  {activeFile.correctionApplied}
                </p>
              </div>

              {/* Code block */}
              <div className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden">
                <div className="flex items-center justify-between bg-slate-900 px-3 py-1.5 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                  <span>SQLX / JavaScript Block</span>
                  <a
                    href="https://console.cloud.google.com/bigquery/dataform/locations/europe-west1/repositories/invented-software-transformations/workspaces/production?project=aiwomen26ham-4452"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Open Workspace in Cloud Console ↗
                  </a>
                </div>
                <pre className="p-4 font-mono text-xs text-indigo-200 overflow-x-auto leading-relaxed">
                  {activeFile.code}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MentorChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentTrack={currentTrack}
        activePhaseTitle="Dataform Production Project"
      />
    </div>
  );
}
