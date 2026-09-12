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

        <main className="flex-1 p-8 max-w-5xl mx-auto space-y-8">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-indigo-900/40 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/80 px-3 py-1 text-xs text-indigo-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  GCP Project: aiwomen26ham-4452
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Welcome to Invented Software Analytics
                </h1>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  You are the incoming Lead Data Analyst. You start with six raw tables in BigQuery for a fictional B2B SaaS company and build a complete enterprise analytics platform: <strong>raw data → BigQuery → Dataform models → Looker Studio dashboard</strong>.
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

          {/* Cloud Stack Architecture Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-bold">
                  BQ
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Google BigQuery</h3>
                  <span className="text-[11px] text-slate-400">Lakehouse Data Layer</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Replaces local PostgreSQL. Ingests all 6 raw CSVs in <code>invented_software_raw</code> with zero server management and native partitioning.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold">
                  DF
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Google Dataform</h3>
                  <span className="text-[11px] text-slate-400">In-Database Transformations</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Replaces containerized dbt Core. SQLX models with automated data quality assertions, native lineage graphs, and serverless execution.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-bold">
                  LS
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Looker Studio</h3>
                  <span className="text-[11px] text-slate-400">Executive BI Platform</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Replaces Metabase. Directly connects to <code>invented_software_mart</code> to render live MRR waterfalls, cohort retention, and cash runways.
              </p>
            </div>
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
