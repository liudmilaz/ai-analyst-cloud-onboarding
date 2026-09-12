"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "../../../components/Navbar";
import { PhaseSidebar } from "../../../components/PhaseSidebar";
import { MentorChatModal } from "../../../components/MentorChatModal";
import { CheckpointCard } from "../../../components/CheckpointCard";
import { CURRICULUM_PHASES } from "../../../data/curriculum";
import { LearningTrack } from "../../../lib/types";

export default function PhaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const phaseId = Number(params?.phaseId) || 1;
  const phase = CURRICULUM_PHASES.find((p) => p.id === phaseId) || CURRICULUM_PHASES[0];

  const [currentTrack, setCurrentTrack] = useState<LearningTrack>("dataform");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [completedPhases, setCompletedPhases] = useState<number[]>([1]);

  const isCompleted = completedPhases.includes(phase.id);

  const handleCheckpointSuccess = () => {
    if (!completedPhases.includes(phase.id)) {
      setCompletedPhases([...completedPhases, phase.id]);
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

        <main className="flex-1 p-8 max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="border-b border-slate-800 pb-5">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
              <span>Phase {phase.id} of 6</span>
              <span>•</span>
              <span>Estimated: {phase.estimatedHours}</span>
            </div>
            <h1 className="text-2xl font-bold text-white">{phase.title}</h1>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{phase.subtitle}</p>
          </div>

          {/* Deliverable Banner */}
          <div className="flex items-center justify-between rounded-xl border border-indigo-900/50 bg-indigo-950/30 p-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                Phase Deliverable
              </span>
              <p className="text-xs font-semibold text-white mt-0.5">{phase.deliverable}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/playground"
                className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 transition"
              >
                Run SQL In BigQuery
              </Link>
              <button
                onClick={() => setIsChatOpen(true)}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition"
              >
                Ask Mentor
              </button>
            </div>
          </div>

          {/* Traps Alert */}
          {phase.trapsHighlighted.length > 0 && (
            <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-4 space-y-2">
              <h2 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>⚠️ Traps to Watch For in This Phase</span>
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                {phase.trapsHighlighted.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          )}

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

          {/* Tasks & Code Snippets */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white">Practical Step-by-Step Tasks</h2>
            <div className="space-y-4">
              {phase.tasks.map((task, idx) => (
                <div key={task.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-200">
                      Task {idx + 1}: {task.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{task.instruction}</p>

                  {task.keyTrapAlert && (
                    <div className="rounded-lg bg-amber-950/40 p-2.5 text-[11px] text-amber-200 border border-amber-800/40">
                      <strong>Watch Out:</strong> {task.keyTrapAlert}
                    </div>
                  )}

                  {task.verificationTip && (
                    <div className="rounded-lg bg-emerald-950/40 p-2.5 text-[11px] text-emerald-200 border border-emerald-800/40">
                      <strong>Verification Ground Truth:</strong> {task.verificationTip}
                    </div>
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
