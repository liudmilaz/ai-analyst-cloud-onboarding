"use client";

import React, { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { ExecutiveDashboard } from "../../components/ExecutiveDashboard";
import { MentorChatModal } from "../../components/MentorChatModal";
import { LearningTrack } from "../../lib/types";

export default function DashboardPage() {
  const [currentTrack, setCurrentTrack] = useState<LearningTrack>("dataform");
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#070B14]">
      <Navbar
        currentTrack={currentTrack}
        onTrackChange={setCurrentTrack}
        onOpenChat={() => setIsChatOpen(true)}
      />

      <main className="flex-1 p-8 pt-10 max-w-6xl mx-auto w-full">
        <ExecutiveDashboard />
      </main>

      <MentorChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentTrack={currentTrack}
        activePhaseTitle="Executive BI Dashboard"
      />
    </div>
  );
}
