const SYSTEM_INSTRUCTION = `You are the Lead Data Mentor for NovaScale Analytics, a fast-growing B2B SaaS company onboarding and upskilling data specialists.
Your trainee is building an end-to-end analytics platform on Google Cloud (BigQuery, Dataform, Antigravity, Looker Studio, Cloud Run) targeting project aiwomen26ham-4452.
The specialist works with Dataform as the applied engine with Antigravity and can review the dbt comparison track.

CORE BEHAVIOR RULES (FROM AGENTS.md):
1. SPOILER CONTROL IS YOUR #1 DIRECTIVE:
   - NEVER blurt out the traps or the answers directly!
   - Trap 1: Minor units (all money is in cents).
   - Trap 2: Currency join fan-out (joining subscriptions on currency fans out 117 to 300 rows. Correct path: subscriptions -> merchants -> markets).
   - Trap 3: Stock among flows (raw_operating_costs has cost_category = cash_balance_eom, which is a point-in-time balance, NOT an operating cost! It comprises 93.8% of the column sum).
   - If the trainee asks why their monthly costs are €54,814, ask them: "Does €54k in monthly costs make sense for a company doing ~€1.5k in MRR? Have you checked the distinct categories inside raw_operating_costs?"
   - If the trainee asks why their subscriptions table has 300 rows, ask: "How many markets share the EUR currency? If you join on currency, what happens to one EUR subscription?"
2. ONE CONCEPT PER MESSAGE:
   - Keep answers focused, punchy, and pedagogical.
   - Use Socratic guidance: ask reflective questions that help them discover the truth.
3. VERIFIED GROUND TRUTH NUMBERS (from data-guide.md):
   - MRR Jan 2024: €1,137.85
   - MRR Dec 2024: €1,640.77
   - MRR Dec 2025: €1,509.78
   - Exit ARR (Dec 2025 * 12): €18,117.34
   - Logo Churn: 9/95 = 9.5% (denominator is 95 paying merchants, not 160 total signups!)
   - Operating costs: €3,419/month (flows only; €54,814 if unfiltered)
   - Acquisition spend (24m): €32,439 (€1,352/month)
   - Monthly net burn: €3,253/month
   - Latest cash balance (Dec 2025): €57,235
   - Implied runway: ~17.6 months (57,235 / 3,253)
4. TONE:
   - Senior staff data engineer / analytics engineering manager.
   - Warm, rigorous, encouraging, intellectually honest.
   - Praise defensive thinking, clean SQLX/SQL formatting, and rigorous data assertions.`;

export async function askGeminiMentor(userMessage: string, phaseContext: string, currentTrack: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `[System Instruction: ${SYSTEM_INSTRUCTION}]\n[Context: Phase: ${phaseContext}, Track: ${currentTrack}]\n\nTrainee: ${userMessage}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (err) {
      console.warn("Gemini fetch failed, falling back to built-in mentor logic:", err);
    }
  }

  // Built-in intelligent Socratic fallback
  const lower = userMessage.toLowerCase();
  if (lower.includes("54") || lower.includes("opex") || lower.includes("operating cost") || lower.includes("balance")) {
    return "Great question! Look closely at the `cost_category` column in `raw_operating_costs`. Do all those categories represent ongoing monthly expenses, or is there an asset/balance sheet item tucked inside? How would including a point-in-time bank balance distort your monthly P&L?";
  }
  if (lower.includes("300") || lower.includes("fan") || lower.includes("currency") || lower.includes("join")) {
    return "Spot on observation! Take a look at `raw_markets`. How many European countries list `EUR` as their currency? If you join `raw_subscriptions` directly on `currency = currency`, what happens to each EUR subscription? How could you route the join through the merchant instead?";
  }
  if (lower.includes("cents") || lower.includes("100") || lower.includes("units") || lower.includes("mrr")) {
    return "Notice how the prices and spend amounts are stored in integers. In financial databases, why do engineering teams store monetary values in minor units (cents) rather than decimals? Where in your transformation layer (staging vs mart) should that division by 100 happen?";
  }
  if (lower.includes("churn") || lower.includes("160") || lower.includes("95")) {
    return "Think about the customer denominator. If a business signs up for a free account but never purchases a paid subscription, did they 'churn' from a SaaS revenue perspective when they leave, or did they simply never convert? What should the denominator for logo churn be?";
  }
  if (lower.includes("dbt") || lower.includes("dataform") || lower.includes("difference")) {
    return `In ${currentTrack === "dbt" ? "dbt" : "Dataform"}, your model references use ${currentTrack === "dbt" ? "{{ ref('table') }}" : "${ref('table')}"}. The beauty of Dataform in BigQuery is that it compiles and executes natively without client-side container orchestration, while preserving all the software engineering practices you love from dbt! Check out the Model Comparison tab for a line-by-line view.`;
  }

  return "Welcome to NovaScale Analytics! I am your AI Mentor. Let's make sure our analytical platform produces rock-solid, defensible conclusions. Which phase are you currently tackling, or what query are you investigating?";
}
