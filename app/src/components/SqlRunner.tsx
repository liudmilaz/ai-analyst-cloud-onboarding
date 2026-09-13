"use client";

import React, { useState } from "react";

interface QueryLab {
  id: string;
  title: string;
  hypothesis: string;
  initialSql: string;
  tablesInvolved: string[];
  evaluation: {
    resultSummary: string;
    metrics: { label: string; value: string }[];
    socraticFeedback: string;
    guidingQuestions: string[];
  };
}

const LAB_EXPERIMENTS: QueryLab[] = [
  {
    id: "exp-fx-join",
    title: "Experiment 1: Foreign Exchange Join Path Analysis",
    hypothesis: "Test whether joining raw_subscriptions to raw_markets directly on currency preserves subscription record integrity.",
    initialSql: `-- Test join on currency vs merchant country
SELECT
  COUNT(*) AS total_rows,
  COUNT(DISTINCT s.subscription_id) AS distinct_subscriptions,
  ROUND(SUM(s.mrr_local / 100 * m.eur_fx), 2) AS calculated_revenue_eur
FROM \`aiwomen26ham-4452.invented_software_raw.raw_subscriptions\` s
JOIN \`aiwomen26ham-4452.invented_software_raw.raw_markets\` m
  ON s.currency = m.currency;`,
    tablesInvolved: ["raw_subscriptions", "raw_markets"],
    evaluation: {
      resultSummary: "Query executed on BigQuery lakehouse: 300 rows produced from 117 base subscriptions.",
      metrics: [
        { label: "Result Row Count", value: "300 rows" },
        { label: "Original Subscriptions", value: "117 rows" },
        { label: "Calculated Revenue", value: "€4,433.36" }
      ],
      socraticFeedback: "Notice that although there are only 117 subscription agreements in raw_subscriptions, this query outputs 300 rows. Why did each EUR subscription record duplicate across multiple rows?",
      guidingQuestions: [
        "How many countries in raw_markets share the EUR currency? Run: SELECT country_code, currency FROM `aiwomen26ham-4452.invented_software_raw.raw_markets` WHERE currency = 'EUR'",
        "What column in raw_merchants links a merchant to their specific country?",
        "What happens to the row count if you join subscriptions -> merchants -> markets instead?"
      ]
    }
  },
  {
    id: "exp-fx-corrected",
    title: "Experiment 2: Merchant-Routed FX Conversion",
    hypothesis: "Test routing the market exchange rate join through the merchant country code.",
    initialSql: `-- Routed join through merchant country code
SELECT
  COUNT(*) AS total_rows,
  COUNT(DISTINCT s.subscription_id) AS distinct_subscriptions,
  ROUND(SUM(s.mrr_local / 100 * m.eur_fx), 2) AS calculated_revenue_eur
FROM \`aiwomen26ham-4452.invented_software_raw.raw_subscriptions\` s
JOIN \`aiwomen26ham-4452.invented_software_raw.raw_merchants\` merc
  ON s.merchant_id = merc.merchant_id
JOIN \`aiwomen26ham-4452.invented_software_raw.raw_markets\` m
  ON merc.country_code = m.country_code;`,
    tablesInvolved: ["raw_subscriptions", "raw_merchants", "raw_markets"],
    evaluation: {
      resultSummary: "Query executed on BigQuery lakehouse: Exactly 117 rows produced matching the 117 subscriptions.",
      metrics: [
        { label: "Result Row Count", value: "117 rows" },
        { label: "Distinct Subscriptions", value: "117 rows" },
        { label: "Calculated Revenue", value: "€1,697.75" }
      ],
      socraticFeedback: "Notice how the row count now matches raw_subscriptions exactly 1-to-1. Why is routing foreign keys through business entity relationships critical in enterprise data modeling?",
      guidingQuestions: [
        "Why was the previous revenue calculation (€4,433.36) 2.61x higher than the true revenue (€1,697.75)?",
        "How would an automated Dataform assertion verify that subscription row counts do not fan out during staging transformations?"
      ]
    }
  },
  {
    id: "exp-opex-flows",
    title: "Experiment 3: Operating Expense Breakdown by Category",
    hypothesis: "Audit the distribution of amounts across distinct cost categories in raw_operating_costs.",
    initialSql: `-- Inspect spend by cost category across 2024-2025
SELECT
  cost_category,
  COUNT(*) AS record_count,
  ROUND(SUM(amount_eur) / 100, 2) AS total_category_eur,
  ROUND(AVG(amount_eur) / 100, 2) AS monthly_avg_eur
FROM \`aiwomen26ham-4452.invented_software_raw.raw_operating_costs\`
GROUP BY cost_category
ORDER BY total_category_eur DESC;`,
    tablesInvolved: ["raw_operating_costs"],
    evaluation: {
      resultSummary: "Query executed on BigQuery lakehouse: 6 distinct cost categories identified.",
      metrics: [
        { label: "Total Table Sum", value: "€1,315,531.25" },
        { label: "cash_balance_eom Sum", value: "€1,233,485.81 (93.8%)" },
        { label: "Operating Expense Sum", value: "€82,045.44 (6.2%)" }
      ],
      socraticFeedback: "Inspect the results: notice that one category (cash_balance_eom) accounts for nearly 94% of the entire table sum. In accounting, what is the fundamental difference between an end-of-month bank balance and monthly operational expenses?",
      guidingQuestions: [
        "If you sum all rows in raw_operating_costs without filtering, what monthly burn rate does that imply for Invented Software Inc.?",
        "If monthly revenue is roughly ~€1,500, could a business survive with €54,000 in monthly expenses?",
        "How should your Dataform staging model classify these records to ensure accurate P&L reporting?"
      ]
    }
  },
  {
    id: "exp-retention-base",
    title: "Experiment 4: Customer Account Base & Conversion Analysis",
    hypothesis: "Analyze the total merchant population versus merchants with historical subscriptions.",
    initialSql: `-- Compare account signups vs paying subscriber base
SELECT
  COUNT(DISTINCT m.merchant_id) AS total_merchant_accounts,
  COUNT(DISTINCT s.merchant_id) AS accounts_with_paid_subscriptions,
  COUNT(DISTINCT CASE WHEN s.merchant_id IS NULL THEN m.merchant_id END) AS accounts_never_subscribed,
  COUNT(DISTINCT CASE WHEN m.status = 'churned' AND s.merchant_id IS NOT NULL THEN m.merchant_id END) AS churned_paying_customers
FROM \`aiwomen26ham-4452.invented_software_raw.raw_merchants\` m
LEFT JOIN \`aiwomen26ham-4452.invented_software_raw.raw_subscriptions\` s
  ON m.merchant_id = s.merchant_id;`,
    tablesInvolved: ["raw_merchants", "raw_subscriptions"],
    evaluation: {
      resultSummary: "Query executed on BigQuery lakehouse: 160 total accounts, 95 paying customers, 65 free signups.",
      metrics: [
        { label: "Total Signups", value: "160 accounts" },
        { label: "Ever-Paid Base", value: "95 customers" },
        { label: "Non-Converting Leads", value: "65 accounts" },
        { label: "Churned from Paid", value: "9 customers" }
      ],
      socraticFeedback: "Notice that 65 merchants registered an account but never completed payment for a subscription. If you divide churned merchants by all 160 accounts versus dividing by the 95 paying customers, what happens to your retention metric?",
      guidingQuestions: [
        "In SaaS metrics, what is the difference between product churn and top-of-funnel conversion drop-off?",
        "How would you defend your denominator choice to the Chief Revenue Officer versus the VP of Product?"
      ]
    }
  }
];

export const SqlRunner: React.FC = () => {
  const [activeExpIdx, setActiveExpIdx] = useState<number>(0);
  const [userSql, setUserSql] = useState<string>(LAB_EXPERIMENTS[0].initialSql);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const activeExp = LAB_EXPERIMENTS[activeExpIdx];

  const handleSelectExp = (idx: number) => {
    setActiveExpIdx(idx);
    setUserSql(LAB_EXPERIMENTS[idx].initialSql);
    setHasEvaluated(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(userSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Direct BigQuery Deep Link */}
      <div className="rounded-xl border border-sky-500/20 bg-gradient-to-r from-[#0B1528] via-[#09101E] to-[#0B1528] p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-sky-950/70 px-2 py-0.5 text-xs font-semibold text-sky-300 border border-sky-700/50">
                Google BigQuery Interactive Lab
              </span>
              <span className="text-xs text-slate-400 font-mono">aiwomen26ham-4452.invented_software_raw</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Hypothesis Testing & Query Exploration
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              Formulate analytical queries against BigQuery lakehouse tables. Rather than giving away answers, this lab evaluates your analytical reasoning and guides your investigation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://console.cloud.google.com/bigquery?project=aiwomen26ham-4452"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-blue-500 hover:to-cyan-400 transition"
            >
              <span>Open in BigQuery Studio</span>
              <span className="text-xs">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Experiment Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {LAB_EXPERIMENTS.map((exp, idx) => (
          <button
            key={exp.id}
            onClick={() => handleSelectExp(idx)}
            className={`p-3 rounded-lg text-left text-xs transition border flex flex-col justify-between ${
              activeExpIdx === idx
                ? "bg-sky-950/70 border-sky-500/50 text-white font-medium shadow"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <span className="font-semibold">{exp.title.split(":")[0]}</span>
            <span className="text-[11px] text-slate-400 truncate mt-1">
              {exp.title.split(":")[1] || exp.title}
            </span>
          </button>
        ))}
      </div>

      {/* SQL Editor & Hypothesis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor (Left 7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white">{activeExp.title}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{activeExp.hypothesis}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {activeExp.tablesInvolved.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-sky-300 border border-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* SQL Text Area */}
            <div className="relative rounded-lg border border-slate-800 bg-[#070B14]">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/70 px-3 py-1.5 text-[11px] text-slate-400 font-mono">
                <span>BigQuery Standard SQL</span>
                <button
                  onClick={handleCopySql}
                  className="text-xs text-sky-400 hover:text-sky-300 transition"
                >
                  {copied ? "✓ Copied!" : "Copy SQL"}
                </button>
              </div>
              <textarea
                value={userSql}
                onChange={(e) => setUserSql(e.target.value)}
                rows={9}
                className="w-full bg-transparent p-3 font-mono text-xs text-sky-200 focus:outline-none resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                Tip: Copy and test directly in BigQuery Studio for live execution.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUserSql(activeExp.initialSql)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition"
                >
                  Reset Query
                </button>
                <button
                  onClick={() => setHasEvaluated(true)}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-sky-600 px-4 py-1.5 text-xs font-semibold text-white hover:from-blue-500 hover:to-sky-500 transition shadow"
                >
                  Evaluate Query Logic
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Socratic Feedback & Guidance Panel (Right 5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {hasEvaluated ? (
            <div className="rounded-xl border border-sky-500/30 bg-[#0B1528]/80 p-4 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-sky-300">
                  Analytical Logic Evaluation
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/40">
                  Execution Checked
                </span>
              </div>

              {/* Metrics Result */}
              <div className="grid grid-cols-2 gap-2">
                {activeExp.evaluation.metrics.map((m, idx) => (
                  <div key={idx} className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{m.label}</span>
                    <span className="text-xs font-bold font-mono text-white mt-0.5 block">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Socratic Feedback */}
              <div className="rounded-lg bg-sky-950/40 border border-sky-800/40 p-3 text-xs space-y-1.5">
                <span className="font-semibold text-sky-300 flex items-center gap-1.5">
                  <span>💡 Socratic Mentor Observation:</span>
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {activeExp.evaluation.socraticFeedback}
                </p>
              </div>

              {/* Guiding Questions */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Questions to Answer Next:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeExp.evaluation.guidingQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                      <span className="text-sky-400 font-bold">•</span>
                      <span className="text-[11px] leading-relaxed">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px]">
                <a
                  href="https://console.cloud.google.com/bigquery?project=aiwomen26ham-4452"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-sky-300 font-medium"
                >
                  Verify in BigQuery Studio ↗
                </a>
                <a
                  href="/dataform"
                  className="text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Inspect Dataform Solution →
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 mx-auto">
                🔍
              </div>
              <h4 className="text-xs font-semibold text-slate-300">Ready to Analyze</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                Inspect or modify the SQL query on the left, then click <strong>Evaluate Query Logic</strong> to receive Socratic feedback and investigation questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
