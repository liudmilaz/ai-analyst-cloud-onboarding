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
  currentTrack: LearningTrack;
  activePhaseTitle: string;
}

export const MentorChatModal: React.FC<MentorChatModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  activePhaseTitle
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "mentor",
      text: "Hello! I am your AI Mentor for Invented Software. I follow strict Socratic guidance (no spoilers!). What are you investigating in the dataset or transformation models?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

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
    "I calculated €54k in monthly operating costs, is that right?",
    "Why does joining subscriptions on currency triple the rows?",
    "How does Dataform ref() differ from dbt?",
    "Why exclude non-paying signups from logo churn?"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="flex h-[600px] w-full max-w-2xl flex-col rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
              AI
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Invented Software AI Mentor</h3>
              <p className="text-xs text-slate-400">
                Socratic Guide • {currentTrack === "dataform" ? "Dataform Track" : "dbt Track"} • {activePhaseTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2.5 text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-200 border border-slate-700/60"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-slate-800 px-4 py-2.5 text-xs text-slate-400 border border-slate-700/60">
                AI Mentor is thinking Socratic thoughts...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-slate-800 p-3 bg-slate-950/60">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {prompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-indigo-900/50 hover:text-indigo-200 border border-slate-700/50 transition"
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
              placeholder="Ask mentor (e.g. 'Why did my join fan out?' or 'Verify my runway')..."
              className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
