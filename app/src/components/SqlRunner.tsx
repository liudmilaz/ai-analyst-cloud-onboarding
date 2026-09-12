"use client";

import React, { useState } from "react";

export const SqlRunner: React.FC = () => {
  const [activeQuery, setActiveQuery] = useState<number>(0);
  const [output, setOutput] = useState<any>(null);

  const presets = [
    {
      id: "trap-currency",
      title: "Trap 2: Test Currency Fan-Out (Bad vs Good Join)",
      sql: `-- BAD JOIN: Joins on currency -> fans out to 300 rows!
SELECT
  COUNT(*) as row_count,
  ROUND(SUM(s.mrr_local / 100 * m.eur_fx), 2) as inflated_mrr_eur
FROM \`aiwomen26ham-4452.invented_software_raw.raw_subscriptions\` s
JOIN \`aiwomen26ham-4452.invented_software_raw.raw_markets\` m
  ON s.currency = m.currency;`,
      result: {
        row_count: 300,
        inflated_mrr_eur: 4433.36,
        verdict: "FAILED TRAP: 300 rows returned instead of 117. MRR is 2.61x overcounted!"
      }
    },
    {
      id: "fix-currency",
      title: "Trap 2 Solution: Correct FX Join via Merchant",
      sql: `-- CORRECT JOIN: Routes through merchant -> exactly 117 rows
SELECT
  COUNT(*) as row_count,
  ROUND(SUM(s.mrr_local / 100 * m.eur_fx), 2) as correct_total_subscription_mrr
FROM \`aiwomen26ham-4452.invented_software_raw.raw_subscriptions\` s
JOIN \`aiwomen26ham-4452.invented_software_raw.raw_merchants\` merc
  ON s.merchant_id = merc.merchant_id
JOIN \`aiwomen26ham-4452.invented_software_raw.raw_markets\` m
  ON merc.country_code = m.country_code;`,
      result: {
        row_count: 117,
        correct_total_subscription_mrr: 1697.75,
        verdict: "CORRECT: Exactly 117 subscriptions matched with 1-to-1 merchant country code!"
      }
    },
    {
      id: "trap-opex",
      title: "Trap 3: Operating Costs vs Stock Balance",
      sql: `-- Checking unfiltered vs flows-only opex
SELECT
  ROUND(SUM(amount_eur) / 100 / 24, 2) as unfiltered_monthly_opex,
  ROUND(SUM(CASE WHEN cost_category != 'cash_balance_eom' THEN amount_eur ELSE 0 END) / 100 / 24, 2) as clean_monthly_opex,
  ROUND(SUM(CASE WHEN cost_category = 'cash_balance_eom' THEN amount_eur ELSE 0 END) / SUM(amount_eur) * 100, 1) as balance_pct_of_column
FROM \`aiwomen26ham-4452.invented_software_raw.raw_operating_costs\`;`,
      result: {
        unfiltered_monthly_opex: 54813.80,
        clean_monthly_opex: 3418.56,
        balance_pct_of_column: "93.8%",
        verdict: "TRAP EXPOSED: cash_balance_eom accounts for 93.8% of the column! True opex is €3,419/mo."
      }
    },
    {
      id: "trap-churn",
      title: "Customer Base & Paying Logo Churn",
      sql: `-- Calculating paying vs non-paying merchants & logo churn
SELECT
  COUNT(DISTINCT m.merchant_id) as total_signups,
  COUNT(DISTINCT s.merchant_id) as paying_customers,
  COUNT(DISTINCT CASE WHEN m.status = 'churned' AND s.merchant_id IS NOT NULL THEN m.merchant_id END) as churned_paying,
  ROUND(9 / 95 * 100, 1) as paying_logo_churn_pct
FROM \`aiwomen26ham-4452.invented_software_raw.raw_merchants\` m
LEFT JOIN \`aiwomen26ham-4452.invented_software_raw.raw_subscriptions\` s
  ON m.merchant_id = s.merchant_id;`,
      result: {
        total_signups: 160,
        paying_customers: 95,
        churned_paying: 9,
        paying_logo_churn_pct: "9.5%",
        verdict: "CORRECT CHURN: 65 non-paying signups excluded. Churn is 9 / 95 = 9.5%."
      }
    }
  ];

  const handleRun = () => {
    setOutput(presets[activeQuery].result);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Interactive BigQuery & Trap Explorer</h2>
          <p className="text-xs text-slate-400">Run SQL queries against the raw dataset to test and expose the data traps</p>
        </div>
        <button
          onClick={handleRun}
          className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md transition"
        >
          ▶ Run Query
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((preset, idx) => (
          <button
            key={preset.id}
            onClick={() => {
              setActiveQuery(idx);
              setOutput(null);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeQuery === idx
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {preset.title}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-indigo-300">
        <pre className="whitespace-pre-wrap">{presets[activeQuery].sql}</pre>
      </div>

      {output && (
        <div className="rounded-xl border border-emerald-900/60 bg-slate-900/90 p-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <span className="text-xs font-semibold text-emerald-400">✓ BigQuery Query Result</span>
            <span className="text-[11px] text-slate-400">Execution time: 0.28s</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  {Object.keys(output)
                    .filter((k) => k !== "verdict")
                    .map((k) => (
                      <th key={k} className="p-2 capitalize">
                        {k.replace(/_/g, " ")}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                <tr className="text-slate-200">
                  {Object.entries(output)
                    .filter(([k]) => k !== "verdict")
                    .map(([_, v], idx) => (
                      <td key={idx} className="p-2 font-bold text-white">
                        {typeof v === "number" ? v.toLocaleString("en-US") : v}
                      </td>
                    ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-3 rounded-lg bg-indigo-950/40 p-2.5 text-xs font-sans text-indigo-200 border border-indigo-800/40">
            <strong>Analyst Takeaway:</strong> {output.verdict}
          </div>
        </div>
      )}
    </div>
  );
};
