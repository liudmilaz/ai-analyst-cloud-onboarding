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
          <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-[#0B1528] via-[#09101E] to-[#070B14] p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-sky-950/80 px-2.5 py-0.5 text-[11px] font-bold text-sky-300 border border-sky-700/50">
                    6-Phase Curriculum Roadmap
                  </span>
                  <span className="text-xs text-slate-400">Human-Led & AI-Powered</span>
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
                  className="rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 px-4 py-2.5 text-center text-xs font-bold text-white shadow-md hover:from-blue-500 hover:to-cyan-400 transition flex items-center justify-center gap-1.5 ring-1 ring-sky-400/30"
                >
                  <span>⚡ Implement in Antigravity</span>
                  <span className="text-xs">↗</span>
                </a>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="rounded-xl bg-sky-950/80 border border-sky-500/40 px-4 py-2.5 text-center text-xs font-semibold text-sky-200 hover:bg-sky-900 transition flex items-center justify-center gap-1.5"
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
                  className="rounded-xl border border-slate-800 bg-[#0B1528]/60 p-5 hover:border-sky-500/60 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-sky-950 font-bold text-xs text-sky-400 border border-sky-800/40">
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
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 px-3.5 py-2 text-xs font-semibold text-white transition flex items-center gap-1.5 shadow-sm"
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
                      <span className="text-sky-300">BigQuery • Dataform • Antigravity</span>
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
