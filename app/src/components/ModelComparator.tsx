"use client";

import React, { useState } from "react";
import { MODEL_COMPARISONS } from "../data/modelsComparison";

export const ModelComparator: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = MODEL_COMPARISONS[selectedIdx];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Dataform (SQLX) vs dbt Core Comparison</h2>
          <p className="text-xs text-slate-400">Line-by-line model translation between the two transformation paradigms</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {MODEL_COMPARISONS.map((model, idx) => (
          <button
            key={model.name}
            onClick={() => setSelectedIdx(idx)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              selectedIdx === idx
                ? "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-sm"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {model.name} ({model.category})
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-white">{current.name}</h3>
          <span className="text-[11px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
            {current.keyTrapAvoided}
          </span>
        </div>
        <p className="text-xs text-slate-300 mb-4">{current.description}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between rounded-t-lg bg-sky-950/80 px-3 py-1.5 border border-sky-800/50 text-xs font-semibold text-sky-300">
              <span>Google Cloud Dataform (.sqlx)</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded">Applied</span>
            </div>
            <pre className="rounded-b-lg border-x border-b border-sky-900/40 bg-[#070B14] p-3 font-mono text-[11px] text-sky-200 overflow-x-auto h-72">
              {current.dataformCode}
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between rounded-t-lg bg-amber-950/80 px-3 py-1.5 border border-amber-800/50 text-xs font-semibold text-amber-300">
              <span>dbt Core (.sql + Jinja)</span>
              <span className="text-[10px] text-amber-400 bg-amber-950 px-1.5 py-0.2 rounded">Comparison</span>
            </div>
            <pre className="rounded-b-lg border-x border-b border-amber-900/40 bg-slate-950 p-3 font-mono text-[11px] text-amber-200 overflow-x-auto h-72">
              {current.dbtCode}
            </pre>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-slate-950 p-3 text-xs">
          <h4 className="font-semibold text-slate-300 mb-1.5">Key Syntax & Structural Nuances:</h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
            {current.differences.map((diff, i) => (
              <li key={i}>{diff}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
