"use client";

import React, { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { SqlRunner } from "../../components/SqlRunner";
import { MentorChatModal } from "../../components/MentorChatModal";
import { LearningTrack } from "../../lib/types";

export default function PlaygroundPage() {
  const [currentTrack, setCurrentTrack] = useState<LearningTrack>("dataform");
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#070B14]">
      <Navbar
        currentTrack={currentTrack}
        onTrackChange={setCurrentTrack}
        onOpenChat={() => setIsChatOpen(true)}
      />

      <main className="flex-1 p-8 pt-10 max-w-5xl mx-auto w-full">
        <SqlRunner />
      </main>

      <MentorChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentTrack={currentTrack}
        activePhaseTitle="SQL & Traps Playground"
      />
    </div>
  );
}
