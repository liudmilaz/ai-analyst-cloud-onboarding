"use client";

import React from "react";
import { VERIFIED_METRICS } from "../data/verifiedMetrics";

export const ExecutiveDashboard: React.FC = () => {
  const { counts, mrrTimeline, exitArrEur, costs } = VERIFIED_METRICS;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Executive BI Dashboard</h1>
            <span className="rounded bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 text-xs font-semibold">
              Live Verified Ground Truth
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            NovaScale Analytics • BigQuery Mart: <code className="text-sky-300">aiwomen26ham-4452.invented_software_mart</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Reporting Range:</span>
          <span className="rounded bg-slate-800 px-2 py-1 text-xs font-medium text-slate-200">
            2024-01-01 to 2025-12-01 (24 Months)
          </span>
        </div>
      </div>

      {/* 4 Core Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs font-medium text-slate-400">Exit ARR (Dec 2025)</div>
          <div className="mt-2 text-2xl font-bold text-white">
            €{exitArrEur.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
            <span>Dec 2025 MRR: €1,509.78 × 12</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs font-medium text-slate-400">Logo Churn Rate</div>
          <div className="mt-2 text-2xl font-bold text-white">
            {counts.logoChurnRatePct}%
          </div>
          <div className="mt-1 text-[11px] text-amber-400">
            9 Churned / 95 Paying Base (not 160!)
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs font-medium text-slate-400">Monthly Net Burn</div>
          <div className="mt-2 text-2xl font-bold text-white">
            €{costs.netMonthlyBurnEur.toLocaleString("en-US")}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Clean Opex €3,419 + CAC €1,352 - Rev €1,517
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs font-medium text-slate-400">Implied Cash Runway</div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            ~{costs.impliedRunwayMonths} Months
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Latest Cash: €{costs.latestCashBalanceEur.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* MRR Trend Line & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">MRR Progression (EUR)</h2>
              <p className="text-xs text-slate-400">Monthly recurring revenue calculated via Dataform date-spine</p>
            </div>
            <span className="text-xs font-semibold text-sky-400">2024 - 2025</span>
          </div>

          <div className="space-y-3">
            {mrrTimeline.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-20 text-xs font-medium text-slate-400">{item.month}</span>
                <div className="flex-1 h-6 bg-slate-800/80 rounded-md overflow-hidden flex items-center px-2">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-sm"
                    style={{ width: `${(item.mrr / 1700) * 100}%` }}
                  />
                </div>
                <span className="w-24 text-right text-xs font-semibold text-slate-200">
                  €{item.mrr.toFixed(2)}
                </span>
                <span className="w-24 text-right text-[11px] text-slate-400">
                  {item.activeMerchants} clients
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* The 3 Traps Comparison Alert Box */}
        <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-5">
          <h2 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
            <span>⚠️ Data Traps Audit</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            How silent errors distort executive conclusions:
          </p>

          <div className="mt-4 space-y-3 text-xs">
            <div className="rounded-lg bg-slate-900/90 p-3 border border-slate-800">
              <span className="font-semibold text-red-400">Unfiltered Opex Trap:</span>
              <p className="text-slate-300 mt-0.5">
                Summing opex without filtering <code className="text-amber-300">cash_balance_eom</code> = <strong className="text-red-300">€54,814/mo</strong> (16x error).
              </p>
              <p className="text-emerald-400 text-[11px] mt-1 font-medium">
                Clean opex (cost flows only) = <strong>€3,419/mo</strong>.
              </p>
            </div>

            <div className="rounded-lg bg-slate-900/90 p-3 border border-slate-800">
              <span className="font-semibold text-red-400">Currency Fan-out Trap:</span>
              <p className="text-slate-300 mt-0.5">
                Joining subscriptions on currency directly inflates rows from 117 to 300, showing <strong className="text-red-300">€4,433</strong> MRR.
              </p>
              <p className="text-emerald-400 text-[11px] mt-1 font-medium">
                Correct join through merchant = <strong>€1,698</strong> total.
              </p>
            </div>

            <div className="rounded-lg bg-slate-900/90 p-3 border border-slate-800">
              <span className="font-semibold text-red-400">Churn Denominator Trap:</span>
              <p className="text-slate-300 mt-0.5">
                Using all 160 signups = 5.6% logo churn.
              </p>
              <p className="text-emerald-400 text-[11px] mt-1 font-medium">
                Paying base (95 clients) = <strong>9.5% churn</strong> (9/95).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
