"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { PhaseSidebar } from "../../components/PhaseSidebar";
import { MentorChatModal } from "../../components/MentorChatModal";
import { CURRICULUM_PHASES } from "../../data/curriculum";
import { LearningTrack } from "../../lib/types";

export default function CurriculumPage() {
  const [currentTrack, setCurrentTrack] = useState<LearningTrack>("dataform");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [completedPhases] = useState<number[]>([]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        currentTrack={currentTrack}
        onTrackChange={setCurrentTrack}
        onOpenChat={() => setIsChatOpen(true)}
      />

      <div className="flex flex-1">
        <PhaseSidebar completedPhases={completedPhases} />

        <main className="flex-1 p-8 pt-10 max-w-5xl mx-auto space-y-8">
          {/* Header Banner */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-7 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-950 border border-indigo-700/60 px-3 py-1 text-xs font-semibold text-indigo-300">
                    Curriculum Roadmap
                  </span>
                  <span className="text-xs text-slate-400">
                    6 Progressive Phases • 12.5 Total Estimated Hours
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Analytical Training Roadmap & Phases
                </h1>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Advance through real enterprise engineering milestones: investigate raw BigQuery tables, craft Dataform models in Google Antigravity, defeat deliberate data traps, and build executive Looker Studio scorecards.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                <a
                  href="https://antigravity.google"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-center text-xs font-bold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 transition flex items-center justify-center gap-1.5"
                >
                  <span>⚡ Implement in Antigravity</span>
                  <span className="text-xs">↗</span>
                </a>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="rounded-xl bg-indigo-950 border border-indigo-600/50 px-4 py-2.5 text-center text-xs font-semibold text-indigo-200 hover:bg-indigo-900 transition flex items-center justify-center gap-1.5"
                >
                  <span>🤖 Ask Socratic Coach</span>
                </button>
              </div>
            </div>
          </div>

          {/* Phase Cards */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {CURRICULUM_PHASES.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-indigo-600/60 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-950 font-bold text-xs text-indigo-400 border border-indigo-800/40">
                        0{p.id}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">
                            {p.title}
                          </h3>
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-medium">
                            {p.estimatedHours}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{p.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
                      {p.id === 5 && (
                        <Link
                          href="/dashboard"
                          className="rounded-lg bg-amber-500 hover:bg-amber-400 px-3 py-2 text-xs font-bold text-slate-950 transition flex items-center gap-1.5 shadow"
                        >
                          <span>📊 Executive Dashboard</span>
                        </Link>
                      )}
                      <Link
                        href={`/phases/${p.id}`}
                        className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white transition flex items-center gap-1.5"
                      >
                        <span>Start Phase {p.id}</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/70 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">Deliverable:</span>
                      <span className="text-slate-300">{p.deliverable}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">Core Tools:</span>
                      <span className="text-indigo-300">BigQuery • Dataform • Antigravity</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <MentorChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentTrack={currentTrack}
        activePhaseTitle="Curriculum Roadmap"
      />
    </div>
  );
}
