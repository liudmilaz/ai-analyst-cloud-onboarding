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
          {/* Hero Banner - Human-Led & AI-Powered Introduction */}
          <div className="relative overflow-hidden rounded-2xl border border-indigo-900/40 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 p-8 shadow-xl space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3.5 max-w-3xl">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Human-Led, AI-Powered Cloud Analytics Onboarding
                </h1>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Welcome to LINIA - an interactive onboarding program built around a modern principle: human data specialists lead the analysis, critical thinking, and architectural decisions, while AI serves as a high-velocity accelerator and Socratic coach.
                </p>

                <p className="text-xs text-slate-400 leading-relaxed">
                  You learn by doing—running exploratory SQL in BigQuery, authoring transformations from scratch in Google Dataform and Antigravity, diagnosing deliberate data traps, and engineering executive Looker Studio scorecards. The embedded Gemini AI Mentor operates in strict Socratic mode, challenging your hypotheses without giving away answers.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0 min-w-[210px]">
                <a
                  href="https://antigravity.google"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-center text-xs font-bold text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 transition flex items-center justify-center gap-2 ring-2 ring-purple-500/30"
                  title="Open Google Antigravity to implement the project"
                >
                  <span>⚡ Implement with Antigravity</span>
                  <span className="text-xs">↗</span>
                </a>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="rounded-xl bg-indigo-950/90 border border-indigo-500/50 px-5 py-3 text-center text-xs font-semibold text-indigo-200 hover:bg-indigo-900 hover:text-white transition flex items-center justify-center gap-2 shadow-sm"
                  title="Open Gemini AI Socratic Coach in right corner"
                >
                  <span>🤖 Ask Socratic AI Coach</span>
                </button>
              </div>
            </div>

            {/* 4 Pillars of the Human-Led & AI-Powered Model */}
            <div className="pt-4 border-t border-indigo-900/40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <span>🧑‍💻</span>
                  <span>Human-Led Discovery</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  You formulate hypotheses, inspect schemas, and make business judgment calls. You own the analysis.
                </p>
              </div>

              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                  <span>🤖</span>
                  <span>Socratic Gemini Mentor</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The right-corner AI coach poses guiding questions and challenges your logic—no spoilers, strictly guidance.
                </p>
              </div>

              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <span>🎯</span>
                  <span>Real Enterprise Traps</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Diagnose minor units (cents), currency fan-outs, and stock vs flow expenses before reporting.
                </p>
              </div>

              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                  <span>⚡</span>
                  <span>Antigravity & Dataform</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Build production pipelines using Google Antigravity AI pair programming alongside empty Dataform workspaces.
                </p>
              </div>
            </div>
          </div>

          {/* Cloud Stack & Antigravity Architecture Cards (Clickable Tools) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="https://console.cloud.google.com/bigquery?project=aiwomen26ham-4452&ws=!1m5!1m4!4m3!1saiwomen26ham-4452!2sinvented_software_raw!2sraw_subscriptions"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4 hover:border-blue-500/60 hover:bg-slate-850 transition shadow-sm"
              title="Open prepared raw lakehouse dataset in Google BigQuery"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs flex-shrink-0">
                  BQ
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white group-hover:text-blue-300 transition flex items-center gap-1">
                    BigQuery
                    <span className="text-[10px] text-blue-400">↗</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Prepared Raw Data</span>
                </div>
              </div>
            </a>

            <a
              href="https://console.cloud.google.com/bigquery/dataform?project=aiwomen26ham-4452"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4 hover:border-emerald-500/60 hover:bg-slate-850 transition shadow-sm"
              title="Open empty Dataform workspace for analyst training"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex-shrink-0">
                  DF
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white group-hover:text-emerald-300 transition flex items-center gap-1">
                    Google Dataform
                    <span className="text-[10px] text-emerald-400">↗</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Empty Workspace</span>
                </div>
              </div>
            </a>

            <a
              href="https://lookerstudio.google.com/reporting/create"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4 hover:border-amber-500/60 hover:bg-slate-850 transition shadow-sm"
              title="Open empty Looker Studio report to build dashboards"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex-shrink-0">
                  LS
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white group-hover:text-amber-300 transition flex items-center gap-1">
                    Looker Studio
                    <span className="text-[10px] text-amber-400">↗</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Blank BI Canvas</span>
                </div>
              </div>
            </a>

            <a
              href="https://antigravity.google"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4 hover:border-purple-500/60 hover:bg-slate-850 transition shadow-sm"
              title="Open Google Antigravity AI-first development platform"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 font-bold text-xs flex-shrink-0">
                  AG
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white group-hover:text-purple-300 transition flex items-center gap-1">
                    Antigravity
                    <span className="text-[10px] text-purple-400">↗</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">AI-First IDE / Pair Dev</span>
                </div>
              </div>
            </a>
          </div>

          {/* Reasonable AI Usage Principles - Learning by Doing */}
          <div className="rounded-xl border border-indigo-900/40 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>💡</span>
                  <span>Mindful AI Usage: Learning by Doing with AI as a Thought-Partner</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  The goal of this program is to build deep, transferable analytical intuition. Use AI purposefully, not passively.
                </p>
              </div>
              <span className="hidden sm:inline-flex rounded-full bg-indigo-950 border border-indigo-600/50 px-2.5 py-1 text-[11px] font-semibold text-indigo-300">
                Data Specialist Code of Practice
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
              <div className="rounded-lg bg-slate-950/70 border border-slate-800/80 p-3.5 space-y-1.5">
                <span className="text-indigo-400 font-bold text-xs flex items-center gap-1.5">
                  <span>1.</span>
                  <span>Hypothesize First</span>
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Before consulting AI, run queries in BigQuery and inspect schemas. Form your own hypothesis about what the data represents.
                </p>
              </div>

              <div className="rounded-lg bg-slate-950/70 border border-slate-800/80 p-3.5 space-y-1.5">
                <span className="text-blue-400 font-bold text-xs flex items-center gap-1.5">
                  <span>2.</span>
                  <span>Ask Socratic Questions</span>
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Prompt the right-corner Gemini Mentor for guidance and edge-case checks (&ldquo;Why might this join multiply?&rdquo;) rather than for ready-made SQL.
                </p>
              </div>

              <div className="rounded-lg bg-slate-950/70 border border-slate-800/80 p-3.5 space-y-1.5">
                <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                  <span>3.</span>
                  <span>Handcraft in Antigravity / Dataform</span>
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Author your SQLX models directly. True engineering mastery comes from writing code, running assertions, and debugging failures.
                </p>
              </div>

              <div className="rounded-lg bg-slate-950/70 border border-slate-800/80 p-3.5 space-y-1.5">
                <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                  <span>4.</span>
                  <span>Defend Your Metrics</span>
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Never accept a number simply because an LLM produced it. You are responsible for defending every KPI before executive stakeholders.
                </p>
              </div>
            </div>
          </div>

          {/* How the Specialist Advances Through the Human-Led Program */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🎓</span>
                  <span>Human-Led Specialist Workflow with AI Assistance</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  A structured feedback loop balancing independent human investigation with continuous AI coaching.
                </p>
              </div>
              <span className="hidden sm:inline-flex rounded-full bg-indigo-950/80 border border-indigo-700/50 px-2.5 py-1 text-[11px] font-medium text-indigo-300">
                Non-Blocking Socratic Chat
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Step 1</span>
                <h4 className="text-xs font-semibold text-slate-200">Audit Raw BigQuery</h4>
                <p className="text-[11px] text-slate-400">
                  Run SQL in BigQuery to explore raw SaaS tables and identify suspicious anomalies.
                </p>
              </div>

              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Step 2</span>
                <h4 className="text-xs font-semibold text-slate-200">Consult Gemini Coach</h4>
                <p className="text-[11px] text-slate-400">
                  Open the right-corner chat to test hypotheses without blocking your platform view.
                </p>
              </div>

              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Step 3</span>
                <h4 className="text-xs font-semibold text-slate-200">Code in Antigravity / DF</h4>
                <p className="text-[11px] text-slate-400">
                  Transform raw data into staging views, date spines, and marts using starter templates.
                </p>
              </div>

              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Step 4</span>
                <h4 className="text-xs font-semibold text-slate-200">Trap Assertions</h4>
                <p className="text-[11px] text-slate-400">
                  Write automated assertions to test minor units, currency joins, and cash balances.
                </p>
              </div>

              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Step 5</span>
                <h4 className="text-xs font-semibold text-slate-200">Deliver BI & Benchmark</h4>
                <p className="text-[11px] text-slate-400">
                  Create Looker Studio dashboards and compare your models against verified reference code.
                </p>
              </div>
            </div>
          </div>

          {/* Next Step: Proceed to Dedicated Curriculum Roadmap */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🗺️</span>
                <span>Ready to begin the hands-on phases?</span>
              </h3>
              <p className="text-xs text-slate-400">
                Explore the complete 6-phase analytical curriculum, estimated timelines, and core deliverables.
              </p>
            </div>
            <Link
              href="/curriculum"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white transition flex items-center gap-2 self-start sm:self-center flex-shrink-0 shadow-md shadow-indigo-600/30"
            >
              <span>Explore Curriculum Roadmap</span>
              <span>→</span>
            </Link>
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
