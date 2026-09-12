import { NextRequest, NextResponse } from "next/server";
import { askGeminiMentor } from "../../../lib/geminiMentor";

export async function POST(req: NextRequest) {
  try {
    const { message, phase, track } = await req.json();
    const reply = await askGeminiMentor(message || "", phase || "General", track || "dataform");
    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ reply: "I am having trouble accessing Gemini right now. Let us review the query again." }, { status: 500 });
  }
}
