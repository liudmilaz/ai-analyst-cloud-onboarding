"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { PhaseSidebar } from "../components/PhaseSidebar";
import { MentorChatModal } from "../components/MentorChatModal";
import { LearningTrack } from "../lib/types";
import { CURRICULUM_PHASES } from "../data/curriculum";

export default function HomePage() {
  const [currentTrack, setCurrentTrack] = useState<LearningTrack>("dataform");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar
        currentTrack={currentTrack}
        onTrackChange={setCurrentTrack}
        onOpenChat={() => setIsChatOpen(true)}
      />

      <div className="flex flex-1">
        <PhaseSidebar completedPhases={completedPhases} />

        <main className="flex-1 p-8 pt-10 max-w-5xl mx-auto space-y-8">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-indigo-900/40 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/80 px-3 py-1 text-xs text-indigo-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  GCP Project: aiwomen26ham-4452
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Welcome to NovaScale Analytics
                </h1>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  You are the incoming Lead Data Analyst. You start with six raw tables in BigQuery for a fast-growing B2B SaaS company and build a complete enterprise analytics platform: <strong>raw data → BigQuery → Dataform models → Looker Studio dashboard</strong>.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="/phases/1"
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-center text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition"
                >
                  🚀 Start Phase 1: Data Discovery
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-slate-800 border border-slate-700 px-5 py-3 text-center text-xs font-semibold text-slate-200 hover:bg-slate-750 transition"
                >
                  📊 View Executive Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Cloud Stack Architecture Cards (Clickable Empty / Prepared Tools, No Explanations) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://console.cloud.google.com/bigquery?project=aiwomen26ham-4452&ws=!1m5!1m4!4m3!1saiwomen26ham-4452!2sinvented_software_raw!2sraw_subscriptions"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-5 hover:border-blue-500/60 hover:bg-slate-850 transition shadow-sm"
              title="Open prepared raw lakehouse dataset in Google BigQuery"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-bold text-sm flex-shrink-0">
                  BQ
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition flex items-center gap-1.5">
                    Google BigQuery
                    <span className="text-xs text-blue-400">↗</span>
                  </h3>
                  <span className="text-xs text-slate-400">Prepared Raw Data Layer</span>
                </div>
              </div>
            </a>

            <a
              href="https://console.cloud.google.com/bigquery/dataform?project=aiwomen26ham-4452"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-5 hover:border-emerald-500/60 hover:bg-slate-850 transition shadow-sm"
              title="Open empty Dataform workspace for analyst training"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-sm flex-shrink-0">
                  DF
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition flex items-center gap-1.5">
                    Google Dataform
                    <span className="text-xs text-emerald-400">↗</span>
                  </h3>
                  <span className="text-xs text-slate-400">Empty Transformation Workspace</span>
                </div>
              </div>
            </a>

            <a
              href="https://lookerstudio.google.com/reporting/create"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-5 hover:border-amber-500/60 hover:bg-slate-850 transition shadow-sm"
              title="Open empty Looker Studio report to build dashboards"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-bold text-sm flex-shrink-0">
                  LS
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition flex items-center gap-1.5">
                    Looker Studio
                    <span className="text-xs text-amber-400">↗</span>
                  </h3>
                  <span className="text-xs text-slate-400">Empty Executive BI Platform</span>
                </div>
              </div>
            </a>
          </div>

          {/* Phase Roadmap Overview */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Curriculum Roadmap</h2>
            <div className="grid grid-cols-1 gap-3">
              {CURRICULUM_PHASES.map((p) => (
                <Link
                  key={p.id}
                  href={`/phases/${p.id}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-indigo-600/60 transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-950 font-bold text-xs text-indigo-400 border border-indigo-800/40">
                      {p.id}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition">
                        {p.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{p.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 sm:text-right">
                    <span>⏱ {p.estimatedHours}</span>
                    <span className="rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300 font-medium">
                      {p.deliverable.split("&")[0]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>

      <MentorChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentTrack={currentTrack}
        activePhaseTitle="Overview"
      />
    </div>
  );
}
