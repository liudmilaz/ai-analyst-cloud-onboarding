"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LearningTrack } from "../lib/types";
import { LiniaLogo } from "./LiniaLogo";

interface NavbarProps {
  currentTrack?: LearningTrack;
  onTrackChange?: (track: LearningTrack) => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat }) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sky-500/15 bg-[#070B14]/90 backdrop-blur-md shadow-lg shadow-sky-950/20">
      <div className="flex min-h-[68px] py-2.5 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          {/* Official LINIA Brand Logo as Home Button */}
          <Link
            href="/"
            className="flex items-center gap-2 py-1 group hover:opacity-95 transition"
            title="Return to LINIA Home"
          >
            <LiniaLogo variant="horizontal" size="sm" showSubtitle={true} />
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            <Link
              href="/curriculum"
              className={`px-3 py-1.5 rounded-lg transition ${
                pathname === "/curriculum" || pathname.startsWith("/phases")
                  ? "bg-sky-950/70 border border-sky-500/30 text-sky-200 shadow-sm"
                  : "text-slate-400 hover:text-sky-300"
              }`}
            >
              Curriculum Roadmap
            </Link>
            <Link
              href="/playground"
              className={`px-3 py-1.5 rounded-lg transition ${
                pathname === "/playground"
                  ? "bg-sky-950/70 border border-sky-500/30 text-sky-200 shadow-sm"
                  : "text-slate-400 hover:text-sky-300"
              }`}
            >
              SQL & Traps Playground
            </Link>
            <Link
              href="/dataform"
              className={`px-3 py-1.5 rounded-lg transition ${
                pathname === "/dataform"
                  ? "bg-sky-950/70 border border-emerald-500/30 text-emerald-300 shadow-sm"
                  : "text-slate-400 hover:text-emerald-300"
              }`}
            >
              Reference Solutions
            </Link>
            <Link
              href="/compare"
              className={`px-3 py-1.5 rounded-lg transition ${
                pathname === "/compare"
                  ? "bg-sky-950/70 border border-sky-500/30 text-sky-200 shadow-sm"
                  : "text-slate-400 hover:text-sky-300"
              }`}
            >
              Dataform vs dbt
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-sky-900/30 hover:from-blue-500 hover:to-cyan-400 transition"
            title="Open Gemini AI Socratic Coach in right corner"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span>Gemini AI Mentor</span>
          </button>
        </div>
      </div>
    </header>
  );
};
