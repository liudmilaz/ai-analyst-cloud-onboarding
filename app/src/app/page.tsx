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
          {/* Hero Banner - AI-Powered Introduction */}
          <div className="relative overflow-hidden rounded-2xl border border-indigo-900/40 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 p-8 shadow-xl space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/40 bg-indigo-950/90 px-3 py-1 text-xs font-semibold text-indigo-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    AI-Powered & AI-Led Training
                  </span>
                  <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300">
                    Target: Data Specialists & Analytics Engineers
                  </span>
                  <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-400">
                    GCP: aiwomen26ham-4452
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  AI-Led Cloud Analytics Onboarding for Data Specialists
                </h1>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Welcome to an immersive, <strong>AI-powered technical onboarding program</strong> designed to train and upskill data specialists into modern cloud data practitioners. Rather than following static tutorials, your entire learning journey is <strong>guided by an embedded Socratic AI Mentor powered by Google Gemini</strong>.
                </p>

                <p className="text-xs text-slate-400 leading-relaxed">
                  You are placed in a realistic enterprise setting (NovaScale Analytics) with prepared raw lakehouse tables in Google BigQuery. Your mission is to engineer a production data pipeline from scratch using Google Dataform and deliver executive BI scorecards in Looker Studio—defending your findings and resolving silent data traps along the way.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0">
                <Link
                  href="/phases/1"
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-center text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition flex items-center justify-center gap-2 ring-2 ring-indigo-500/30"
                >
                  <span>🚀 Start Phase 1: Data Discovery</span>
                </Link>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="rounded-xl bg-indigo-950/80 border border-indigo-600/50 px-5 py-3 text-center text-xs font-semibold text-indigo-200 hover:bg-indigo-900/60 hover:text-white transition flex items-center justify-center gap-2"
                >
                  <span>🤖 Consult Socratic AI Mentor</span>
                </button>
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-slate-800 border border-slate-700 px-5 py-3 text-center text-xs font-semibold text-slate-200 hover:bg-slate-750 transition flex items-center justify-center gap-2"
                >
                  <span>📊 View Executive Dashboard</span>
                </Link>
              </div>
            </div>

            {/* 4 Pillars of the AI-Led Program */}
            <div className="pt-4 border-t border-indigo-900/40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <span>🤖</span>
                  <span>Socratic AI Mentorship</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Google Gemini guides your reasoning with targeted questions—never giving away spoilers, challenging you to defend metrics.
                </p>
              </div>

              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                  <span>☁️</span>
                  <span>Live Google Cloud Stack</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Direct hands-on experience: BigQuery lakehouse, serverless Dataform SQLX pipelines, and native Looker Studio BI.
                </p>
              </div>

              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <span>🎯</span>
                  <span>Deliberate Data Traps</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Test defensive acumen by uncovering minor units (cents), currency fan-outs, and stock-vs-flow cost traps before reporting.
                </p>
              </div>

              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <span>🛠️</span>
                  <span>Empty Starters & Solutions</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Build from blank starter templates with guided TODOs, then verify against complete production reference models.
                </p>
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

          {/* How the Specialist Advances Through the AI-Led Program */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🎓</span>
                  <span>How the Specialist Advances Through the AI-Led Program</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  The training follows a continuous feedback loop between hands-on cloud implementation and AI-guided review.
                </p>
              </div>
              <span className="hidden sm:inline-flex rounded-full bg-indigo-950/80 border border-indigo-700/50 px-2.5 py-1 text-[11px] font-medium text-indigo-300">
                Socratic Methodology
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Step 1</span>
                <h4 className="text-xs font-semibold text-slate-200">Audit Raw Lakehouse</h4>
                <p className="text-[11px] text-slate-400">
                  Run SQL in BigQuery to explore raw SaaS tables and identify suspicious anomalies.
                </p>
              </div>

              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Step 2</span>
                <h4 className="text-xs font-semibold text-slate-200">Consult AI Mentor</h4>
                <p className="text-[11px] text-slate-400">
                  Discuss hypotheses with Gemini AI. Receive Socratic hints without answers spoiled.
                </p>
              </div>

              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Step 3</span>
                <h4 className="text-xs font-semibold text-slate-200">Build in Dataform</h4>
                <p className="text-[11px] text-slate-400">
                  Transform raw data into staging views, date spines, and marts using starter templates.
                </p>
              </div>

              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Step 4</span>
                <h4 className="text-xs font-semibold text-slate-200">Resolve Data Traps</h4>
                <p className="text-[11px] text-slate-400">
                  Write automated assertions to test minor units, currency joins, and cash balances.
                </p>
              </div>

              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Step 5</span>
                <h4 className="text-xs font-semibold text-slate-200">Deliver BI & Benchmark</h4>
                <p className="text-[11px] text-slate-400">
                  Create Looker Studio dashboards and compare your models against verified reference code.
                </p>
              </div>
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
