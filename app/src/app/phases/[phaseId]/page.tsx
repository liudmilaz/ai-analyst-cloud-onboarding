"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "../../../components/Navbar";
import { PhaseSidebar } from "../../../components/PhaseSidebar";
import { MentorChatModal } from "../../../components/MentorChatModal";
import { CheckpointCard } from "../../../components/CheckpointCard";
import { CURRICULUM_PHASES } from "../../../data/curriculum";
import { LearningTrack } from "../../../lib/types";

export default function PhaseDetailPage() {
  const params = useParams();
  const phaseId = Number(params?.phaseId) || 1;
  const phase = CURRICULUM_PHASES.find((p) => p.id === phaseId) || CURRICULUM_PHASES[0];

  const [currentTrack, setCurrentTrack] = useState<LearningTrack>("dataform");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);

  const isCompleted = completedPhases.includes(phase.id);

  const handleCheckpointSuccess = () => {
    if (!completedPhases.includes(phase.id)) {
      setCompletedPhases((prev) => [...prev, phase.id]);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar
        currentTrack={currentTrack}
        onTrackChange={setCurrentTrack}
        onOpenChat={() => setIsChatOpen(true)}
      />

      <div className="flex flex-1">
        <PhaseSidebar completedPhases={completedPhases} />

        <main className="flex-1 p-8 pt-10 max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="border-b border-slate-800 pb-5">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
              <span>Phase {phase.id} of 6</span>
              <span>•</span>
              <span>Estimated: {phase.estimatedHours}</span>
            </div>
            <h1 className="text-2xl font-bold text-white leading-tight">{phase.title}</h1>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{phase.subtitle}</p>
          </div>

          {/* Deliverable & BigQuery Deep-Link Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-indigo-900/50 bg-indigo-950/30 p-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                Phase Deliverable
              </span>
              <p className="text-xs font-semibold text-white mt-0.5">{phase.deliverable}</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://console.cloud.google.com/bigquery?project=aiwomen26ham-4452"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow transition"
              >
                <span>BigQuery Studio</span>
                <span className="text-[10px]">↗</span>
              </a>
              <Link
                href="/playground"
                className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 transition"
              >
                Query Validator
              </Link>
              <Link
                href="/dataform"
                className="rounded-lg bg-emerald-950/80 border border-emerald-700/60 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-900/60 transition"
              >
                Dataform Models
              </Link>
              <button
                onClick={() => setIsChatOpen(true)}
                className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-slate-750 transition"
              >
                Ask Mentor
              </button>
            </div>
          </div>

          {/* Socratic Analytical Questions (No Spoilers!) */}
          {phase.investigativeQuestions && phase.investigativeQuestions.length > 0 && (
            <div className="rounded-xl border border-indigo-800/40 bg-slate-900/90 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-xs font-bold text-indigo-300 flex items-center gap-2">
                  <span>🔍 Analytical Hypotheses & Questions to Answer</span>
                </h2>
                <span className="text-[11px] text-slate-400">Investigate in BigQuery</span>
              </div>
              <p className="text-xs text-slate-400">
                Data pipelines are only as good as the business decisions they enable. Query the BigQuery lakehouse directly to investigate these analytical questions:
              </p>
              <ul className="space-y-2 text-xs text-slate-200">
                {phase.investigativeQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 rounded-lg bg-slate-950/60 p-2.5 border border-slate-800/80">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-950 text-[10px] font-bold text-indigo-400 border border-indigo-800/50">
                      ?
                    </span>
                    <span className="leading-relaxed">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Live BigQuery Tables for This Phase */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Google BigQuery Raw Lakehouse Tables
              </h2>
              <span className="text-[11px] text-indigo-400 font-mono">
                aiwomen26ham-4452.invented_software_raw
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
              {[
                { name: "raw_merchants", desc: "160 accounts (signups & active status)" },
                { name: "raw_subscriptions", desc: "117 subscription agreements" },
                { name: "raw_markets", desc: "8 regional markets & EUR FX rates" },
                { name: "raw_products", desc: "5 core SaaS product SKUs & margins" },
                { name: "raw_operating_costs", desc: "144 expense line items (2024-2025)" },
                { name: "raw_acquisition_costs", desc: "768 acquisition channel spend rows" },
              ].map((tbl) => (
                <a
                  key={tbl.name}
                  href={`https://console.cloud.google.com/bigquery?project=aiwomen26ham-4452`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 hover:border-indigo-600/70 hover:bg-slate-900 transition group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-indigo-300 font-semibold group-hover:text-white">
                    <span>{tbl.name}</span>
                    <span className="text-[10px] text-slate-500 group-hover:text-indigo-400">↗</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans mt-1">{tbl.desc}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Objectives */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white">Learning Objectives</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {phase.objectives.map((obj, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks & Step-by-Step Questions */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white">Interactive Hands-on Tasks</h2>
            <div className="space-y-4">
              {phase.tasks.map((task, idx) => (
                <div key={task.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-200">
                      Task {idx + 1}: {task.title}
                    </h3>
                    {task.bigQueryTables && task.bigQueryTables.length > 0 && (
                      <div className="flex items-center gap-1">
                        {task.bigQueryTables.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-indigo-300 border border-slate-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{task.instruction}</p>

                  {/* Socratic Question without giving answer */}
                  <div className="rounded-lg bg-indigo-950/40 p-3 text-xs text-indigo-200 border border-indigo-800/40 space-y-1">
                    <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                      <span>💡 Question to Investigate:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">{task.socraticQuestion}</p>
                  </div>

                  {task.investigativeHint && (
                    <details className="rounded-lg bg-slate-950/70 p-2.5 text-[11px] text-slate-400 border border-slate-800/80 cursor-pointer">
                      <summary className="font-medium text-slate-300 hover:text-indigo-300 transition">
                        Show Investigation Guidance
                      </summary>
                      <p className="mt-2 text-slate-300 pl-2 border-l border-indigo-700/60 leading-relaxed">
                        {task.investigativeHint}
                      </p>
                    </details>
                  )}

                  {(task.dataformSnippet || task.dbtSnippet) && (
                    <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-xs font-mono">
                      <div className="text-[10px] text-slate-400 mb-1">
                        {currentTrack === "dataform" ? "Dataform SQLX Snippet:" : "dbt Jinja SQL Snippet:"}
                      </div>
                      <code className="text-indigo-300">
                        {currentTrack === "dataform" ? task.dataformSnippet : task.dbtSnippet}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Phase Checkpoint Quiz */}
          <CheckpointCard
            questions={phase.checkpoint}
            onComplete={handleCheckpointSuccess}
            isCompleted={isCompleted}
          />

          {/* Next Phase Navigation */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-5">
            {phase.id > 1 ? (
              <Link
                href={`/phases/${phase.id - 1}`}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700"
              >
                ← Previous Phase
              </Link>
            ) : <div />}

            {phase.id < 6 ? (
              <Link
                href={`/phases/${phase.id + 1}`}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition"
              >
                Next Phase →
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition"
              >
                Complete Onboarding & View Dashboard →
              </Link>
            )}
          </div>
        </main>
      </div>

      <MentorChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentTrack={currentTrack}
        activePhaseTitle={phase.title}
      />
    </div>
  );
}
