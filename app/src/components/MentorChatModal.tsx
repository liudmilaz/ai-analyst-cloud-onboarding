"use client";

import React, { useState, useRef, useEffect } from "react";
import { LearningTrack } from "../lib/types";

interface Message {
  sender: "user" | "mentor";
  text: string;
}

interface MentorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack?: LearningTrack;
  activePhaseTitle?: string;
}

export const MentorChatModal: React.FC<MentorChatModalProps> = ({
  isOpen,
  onClose,
  currentTrack = "dataform",
  activePhaseTitle = "Overview"
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "mentor",
      text: "Hello! I am your Gemini AI Socratic Mentor. In this human-led training, you are in the driver's seat. What hypothesis, query, or data trap are you exploring in BigQuery or Dataform?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isMinimized]);

  if (!isOpen) return null;

  // Minimized Floating Pill in the Right Corner
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 rounded-full bg-slate-900 border border-indigo-500/50 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl hover:border-indigo-400 hover:bg-slate-850 transition group"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="text-indigo-300 font-bold">🤖 Gemini AI Mentor</span>
          <span className="rounded bg-indigo-950 px-1.5 py-0.5 text-[10px] text-indigo-400 border border-indigo-800">
            Click to Open
          </span>
        </button>
      </div>
    );
  }

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const newMsgs: Message[] = [...messages, { sender: "user", text: query }];
    setMessages(newMsgs);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          phase: activePhaseTitle,
          track: currentTrack
        })
      });
      const data = await res.json();
      setMessages([...newMsgs, { sender: "mentor", text: data.reply || "Let us examine the data again." }]);
    } catch {
      setMessages([
        ...newMsgs,
        {
          sender: "mentor",
          text: "Let us examine `raw_operating_costs` and `raw_subscriptions`. Where might a join fan-out or balance stock distort our numbers?"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const prompts = [
    "Why does joining subscriptions on currency triple rows?",
    "How should cash_balance_eom be treated in operating expenses?",
    "Why divide mrr_local by 100 in SaaS billing?",
    "Who legitimately belongs in the churn denominator?"
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col w-[440px] max-w-[calc(100vw-2.5rem)] h-[620px] max-h-[calc(100vh-6rem)] rounded-2xl border border-indigo-500/50 bg-slate-950 shadow-2xl shadow-indigo-950/70 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 ring-1 ring-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white text-xs shadow-sm">
            AI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white">Gemini Socratic Mentor</h3>
              <span className="rounded bg-indigo-950 px-1.5 py-0.2 text-[9px] font-semibold text-indigo-300 border border-indigo-800">
                Human-Led Mode
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Context: {activePhaseTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white text-xs"
            title="Minimize to right corner pill"
          >
            —
          </button>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white text-xs"
            title="Close chat"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Mindful AI Guidance Banner */}
      <div className="bg-indigo-950/60 border-b border-indigo-900/40 px-3.5 py-2 text-[11px] text-indigo-200 flex items-start gap-2">
        <span className="text-sm">💡</span>
        <p className="leading-tight">
          <strong>Learn by doing:</strong> Test queries in BigQuery first. The AI mentor challenges your assumptions and guides you with hints—no spoilers!
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-950/70">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[88%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none shadow-sm"
                  : "bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs text-indigo-300 border border-slate-800 flex items-center gap-2">
              <span className="animate-spin text-xs">⟳</span>
              <span>Gemini is formulating Socratic guidance...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggested Socratic Inquiries & Input */}
      <div className="border-t border-slate-800 p-3 bg-slate-900/95 space-y-2">
        <div className="flex flex-wrap gap-1">
          {prompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="rounded-full bg-slate-800 hover:bg-indigo-900/60 hover:text-indigo-200 px-2.5 py-1 text-[10px] text-slate-300 border border-slate-700/60 transition text-left truncate max-w-[200px]"
              title={p}
            >
              {p}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a hypothesis or describe a data anomaly..."
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
