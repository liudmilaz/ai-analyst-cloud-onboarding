"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { PhaseSidebar } from "../components/PhaseSidebar";
import { MentorChatModal } from "../components/MentorChatModal";
import { LiniaLogo } from "../components/LiniaLogo";
import { LearningTrack } from "../lib/types";
import { useProgress } from "../lib/useProgress";

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState<LearningTrack>("dataform");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { completedPhases } = useProgress();

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans">
      <Navbar
        currentTrack={currentTrack}
        onTrackChange={setCurrentTrack}
        onOpenChat={() => setIsChatOpen(true)}
      />

      <div className="flex flex-1">
        <PhaseSidebar completedPhases={completedPhases} />

        <main className="flex-1 p-8 pt-10 max-w-5xl mx-auto space-y-8">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-br from-[#0B1528] via-[#09101E] to-[#070B14] p-8 shadow-2xl shadow-sky-950/40 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3.5 max-w-3xl">
                {/* LINIA Brand Identifier */}
                <div className="flex items-center gap-2.5">
                  <LiniaLogo variant="mark" size="xs" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">
                    LINIA Academy • Human-Led & AI-Powered
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Welcome to Cloud Analytics Engineering Onboarding
                </h1>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Welcome to the LINIA onboarding program—an intensive, enterprise-grade journey empowering data specialists to master autonomous cloud analytics. You are stepping into the shoes of the lead data specialist for <strong className="text-white">Invented Software Inc.</strong>, a high-growth B2B SaaS enterprise.
                </p>

                <p className="text-xs text-slate-400 leading-relaxed">
                  This course bridges the gap between theoretical SQL and battle-tested production modeling. You will inspect raw lakehouse datasets, build robust transformation pipelines, neutralize deliberate data traps, and deliver executive-ready business intelligence dashboards.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 flex-shrink-0 min-w-[220px] sm:w-64 lg:w-72">
                <a
                  href="https://antigravity.google/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 px-5 py-3 text-center text-xs font-bold text-white shadow-lg shadow-sky-900/40 hover:from-blue-500 hover:to-cyan-400 transition flex items-center justify-center gap-2 ring-2 ring-sky-400/30"
                  title="Launch Google Antigravity"
                >
                  <span>⚡ Launch Antigravity</span>
                  <span className="text-xs">↗</span>
                </a>

                <Link
                  href="/tech-stack"
                  className="rounded-xl bg-slate-900/90 border border-sky-500/40 px-5 py-3 text-center text-xs font-semibold text-sky-200 hover:bg-slate-800 hover:text-white transition flex items-center justify-center gap-2 shadow-sm"
                  title="Explore the 4 core tools and technologies"
                >
                  <span>🛠️ Explore Tech Stack</span>
                  <span className="text-xs">→</span>
                </Link>

                <Link
                  href="/curriculum"
                  className="rounded-xl bg-slate-900/90 border border-sky-500/40 px-5 py-3 text-center text-xs font-semibold text-sky-200 hover:bg-slate-800 hover:text-white transition flex items-center justify-center gap-2 shadow-sm"
                  title="View the Course Journey"
                >
                  <span>🗺️ Curriculum Roadmap</span>
                  <span className="text-xs">→</span>
                </Link>

                <div className="pt-2 border-t border-sky-900/40 flex flex-col gap-2">
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="flex items-center justify-between rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/70 px-4 py-2.5 text-xs font-medium text-cyan-300 hover:text-white hover:bg-slate-850 transition"
                  >
                    <span>🤖 Open AI Helper Chat</span>
                    <span className="text-cyan-400 text-xs">↗</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Highlights Strip */}
            <div className="pt-4 border-t border-sky-900/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3">
                <div className="text-lg font-extrabold text-sky-400">6</div>
                <div className="text-[11px] text-slate-400 font-medium">Hands-On Phases</div>
              </div>
              <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3">
                <div className="text-lg font-extrabold text-blue-400">4</div>
                <div className="text-[11px] text-slate-400 font-medium">Cloud Core Tools</div>
              </div>
              <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3">
                <div className="text-lg font-extrabold text-amber-400">3</div>
                <div className="text-[11px] text-slate-400 font-medium">Silent Data Traps</div>
              </div>
              <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3">
                <div className="text-lg font-extrabold text-emerald-400">100%</div>
                <div className="text-[11px] text-slate-400 font-medium">Human Defensible</div>
              </div>
            </div>
          </div>

          {/* Section: Course Goals & Pedagogical Philosophy */}
          <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-r from-[#0B1528]/90 via-[#09101E] to-[#0B1528]/90 p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded bg-sky-950/80 px-2.5 py-0.5 text-[11px] font-bold text-sky-300 border border-sky-700/50">
                  Course Philosophy & Principles
                </span>
                <span className="text-xs text-slate-400">Core Educational Goals</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Human-Led Analysis, Powered by Antigravity
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                The objective of this course is not to passively copy code from an LLM. It is designed to cultivate genuine engineering rigor and critical data instincts through a clear division of roles:
              </p>
            </div>

            {/* The 3 Core Pillars: Human-Led, Antigravity-Powered, Chatbot Helper */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Pillar 1: Human-Led */}
              <div className="rounded-xl bg-slate-900/80 border border-sky-500/30 p-5 space-y-3 relative overflow-hidden group hover:border-sky-400/60 transition">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 text-lg">
                    🧑‍💻
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">1. Human-Led Leadership</h3>
                    <span className="text-[11px] text-sky-300 font-medium">You Own the Decisions</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You are in the driver&apos;s seat. You inspect the raw tables, uncover schema anomalies, define business KPI logic (MRR, churn, ARR), and choose architectural patterns.
                </p>
                <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-slate-200">Key Takeaway:</strong> An LLM does not know your business context. You are solely responsible for defending every metric before executive stakeholders.
                </div>
              </div>

              {/* Pillar 2: Powered by Antigravity */}
              <div className="rounded-xl bg-slate-900/80 border border-blue-500/30 p-5 space-y-3 relative overflow-hidden group hover:border-blue-400/60 transition">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 text-lg">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">2. Powered by Antigravity</h3>
                    <span className="text-[11px] text-blue-300 font-medium">AI Pair Programmer</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Google Antigravity serves as your high-velocity implementation engine. Use Antigravity to scaffold Dataform models, generate boilerplate SQLX syntax, and refactor code rapidly.
                </p>
                <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-slate-200">Key Takeaway:</strong> Antigravity multiplies your productivity, handling repetitive mechanics so you can focus on domain modeling and data integrity.
                </div>
              </div>

              {/* Pillar 3: Chatbot as Helper */}
              <div className="rounded-xl bg-slate-900/80 border border-cyan-500/30 p-5 space-y-3 relative overflow-hidden group hover:border-cyan-400/60 transition">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 text-lg">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">3. Chatbot as Helper</h3>
                    <span className="text-[11px] text-cyan-300 font-medium">Socratic Coach, Not Spoilers</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The embedded Gemini chatbot in the corner serves strictly as an intellectual helper and thinking partner. It does not provide ready-made queries or do your homework.
                </p>
                <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-slate-200">Key Takeaway:</strong> The coach asks targeted questions to challenge your assumptions, guiding you toward self-discovery without giving away answers.
                </div>
              </div>
            </div>
          </div>

          {/* Section: Mindful AI Usage Principles */}
          <div className="rounded-xl border border-sky-500/20 bg-gradient-to-r from-[#0B1528]/80 via-[#09101E] to-[#0B1528]/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>💡</span>
                  <span>Code of Practice: How to Engage with AI in This Course</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Follow these 4 principles to build transferable intuition rather than dependency.
                </p>
              </div>
              <span className="hidden sm:inline-flex rounded-full bg-sky-950/70 border border-sky-500/40 px-2.5 py-1 text-[11px] font-semibold text-sky-200">
                Data Specialist Mindset
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
              <div className="rounded-lg bg-slate-950/70 border border-slate-800/80 p-3.5 space-y-1.5">
                <span className="text-sky-400 font-bold text-xs flex items-center gap-1.5">
                  <span>1.</span>
                  <span>Hypothesize First</span>
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Always inspect the tables and draft your query logic before prompting AI. Form your own opinion on the underlying business reality.
                </p>
              </div>

              <div className="rounded-lg bg-slate-950/70 border border-slate-800/80 p-3.5 space-y-1.5">
                <span className="text-cyan-400 font-bold text-xs flex items-center gap-1.5">
                  <span>2.</span>
                  <span>Ask the Helper for Hints</span>
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  When stuck, ask the AI Mentor Socratic questions (&ldquo;What edge case might cause row multiplication here?&rdquo;) rather than asking for the final query.
                </p>
              </div>

              <div className="rounded-lg bg-slate-950/70 border border-slate-800/80 p-3.5 space-y-1.5">
                <span className="text-blue-400 font-bold text-xs flex items-center gap-1.5">
                  <span>3.</span>
                  <span>Code with Antigravity</span>
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Use Antigravity as an active pair programmer to generate boilerplate, format SQLX blocks, and run assertions, while you audit every line.
                </p>
              </div>

              <div className="rounded-lg bg-slate-950/70 border border-slate-800/80 p-3.5 space-y-1.5">
                <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                  <span>4.</span>
                  <span>Validate and Defend</span>
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Never accept a metric blindly. Cross-check your calculations against raw event counts, assert zero nulls, and ensure financial reconciliation.
                </p>
              </div>
            </div>
          </div>

          {/* Call-to-Action Banner: Proceed to Second Page (Tech Stack) */}
          <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-r from-blue-950/50 via-slate-900 to-sky-950/50 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300 uppercase tracking-wider">
                  Next Step
                </span>
                <span className="text-xs text-slate-400">Page 2 of Overview</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Explore the Four-Tier Cloud Tech Stack
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Learn about each core technology used throughout the course: <strong className="text-sky-300">Antigravity</strong>, <strong className="text-blue-300">BigQuery</strong>, <strong className="text-emerald-300">Dataform</strong>, and <strong className="text-amber-300">Looker Studio</strong>, including quick console links and their end-to-end architecture.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                href="/tech-stack"
                className="rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 px-6 py-3 text-xs font-bold text-white transition flex items-center justify-center gap-2 shadow-lg shadow-sky-900/40"
              >
                <span>View Tech Stack & Tools</span>
                <span>→</span>
              </Link>
              <Link
                href="/curriculum"
                className="rounded-xl bg-slate-900/90 border border-slate-700 hover:border-sky-500/60 px-5 py-3 text-xs font-semibold text-slate-200 hover:text-white transition flex items-center justify-center gap-2"
              >
                <span>Curriculum Roadmap</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </main>
      </div>

      <MentorChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentTrack={currentTrack}
        activePhaseTitle="Course Overview"
      />
    </div>
  );
}
