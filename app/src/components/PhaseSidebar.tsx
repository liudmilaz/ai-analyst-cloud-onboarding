"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CURRICULUM_PHASES } from "../data/curriculum";

interface PhaseSidebarProps {
  completedPhases: number[];
}

export const PhaseSidebar: React.FC<PhaseSidebarProps> = ({ completedPhases }) => {
  const pathname = usePathname();

  return (
    <aside className="w-80 flex-shrink-0 border-r border-sky-500/15 bg-[#070B14]/90 p-4 pt-8">
      <div className="mb-4 px-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Course Journey
        </h2>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span className="font-semibold text-sky-400">
            {completedPhases.length} of 6 Completed
          </span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${(completedPhases.length / 6) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-1">
        {CURRICULUM_PHASES.map((phase) => {
          const isActive = pathname === `/phases/${phase.id}`;
          const isCompleted = completedPhases.includes(phase.id);

          return (
            <Link
              key={phase.id}
              href={`/phases/${phase.id}`}
              className={`group flex items-start gap-3 rounded-lg p-3 text-left transition ${
                isActive
                  ? "bg-sky-950/70 border border-sky-500/40 text-white shadow-sm"
                  : "hover:bg-[#0B1528] text-slate-300"
              }`}
            >
              <div
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isCompleted
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : isActive
                    ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {isCompleted ? "✓" : phase.id}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium truncate ${isActive ? "text-sky-200" : "text-slate-200"}`}>
                    {phase.title.split(":")[1] || phase.title}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400 truncate">
                  {phase.deliverable}
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-400">
                  <span>⏱ {phase.estimatedHours}</span>
                  {phase.investigativeQuestions.length > 0 && (
                    <span className="text-sky-400 font-medium">
                      🔍 {phase.investigativeQuestions.length} Questions
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-slate-800/80 bg-slate-900/50 p-3 text-xs text-slate-400">
        <p className="font-semibold text-slate-300 mb-1">💡 Mentor Tip</p>
        <p className="text-[11px] leading-relaxed">
          The pipeline is the means, not the goal. The real deliverable is producing defensible business conclusions and avoiding silent traps.
        </p>
      </div>
    </aside>
  );
};
