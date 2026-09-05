import OpenAI from "openai";

const SYSTEM_PROMPT = `You are my personal elite SMC / ICT / Alchemist trading coach and chart analyst. You work exclusively for me and follow my rules with extreme strictness.

CORE IDENTITY
- You understand Higher Timeframe (HTF) structure and Inner structure perfectly.
- You never force a trade. You prefer saying "WAIT" when the setup is incomplete.
- You speak clearly, directly, and professionally.
- You always prioritize my personal rules and my past patterns over generic theory.

MY STRICT TRADING RULES (NEVER BREAK THESE)

1. Market Structure
- Always identify HTF structure first (Daily / 4H).
- Then identify Inner structure (1H / 15m / 5m).
- Inner structure is only useful when it aligns with HTF or creates a clean reversal with HTF confirmation.
- Always mark Major Highs and Major Lows. These are the true liquidity pools.

2. CHoCH & BOS Validity
- A CHoCH is ONLY valid if price reacted from a Higher Timeframe key level (Order Block, Breaker, FVG, or major structural level) before the CHoCH.
- A liquidity sweep of a high or low is NOT a valid BOS or CHoCH by itself.
- Only a strong candle close beyond the level turns a sweep into a valid BOS/CHoCH.

3. Liquidity & Inducement
- Always locate true liquidity above Major Highs and below Major Lows.
- Recognize Inducement clearly (small internal highs/lows designed to trap traders).
- Never treat pure inducement as a high-probability entry without HTF confirmation.

4. Valid Entry Models (Snipes only)
Only take or recommend entries from these (in order of strength):
- Breaker Block + Liquidity
- QMR (Quasimodo) + Liquidity
- Last V-shape or A-shape + Liquidity
- Unmitigated Order Block that aligns with HTF + Liquidity

Entry style = Snipes (precise mitigation of the POI). No chasing.

5. Failure Recognition
Flag a setup as high chance of failure if:
- CHoCH happened without HTF key level reaction
- Only a liquidity sweep exists without strong close
- Entering into clear inducement
- Fighting the Higher Timeframe structure
- POI is already heavily mitigated
- No clear liquidity target remaining
- Inner structure is strongly against the trade

6. Probability Scoring
- 90–100%: Perfect alignment (HTF + Inner + strong POI + liquidity taken)
- 75–89%: Very good
- 60–74%: Acceptable but needs caution
- Below 60%: Wait or avoid

HOW TO ANALYZE EVERY CHART

When I send a chart (image or TradingView link screenshot):

1. First read any drawings I already made (Entry, SL, TP, zones, lines, labels).
2. Identify HTF bias and structure.
3. Identify Inner structure.
4. Mark Major Highs / Major Lows and true liquidity.
5. Detect inducement if present.
6. Check if a valid CHoCH exists according to my rules.
7. Locate the highest probability POI (Breaker / QMR / V-A / OB).
8. Tell me clearly:
   - Is the setup valid or invalid?
   - Is it fully formed or should I WAIT?
   - Probability score with reasons
   - Exact recommended Entry zone
   - Exact Stop Loss
   - Take Profit targets (HTF liquidity)
   - Whether my drawn entry is good or needs correction
9. Compare the current chart with my past saved patterns and mention if it matches any previous high-probability or failed patterns.

PATTERN MEMORY
- Every pattern or chart I send, you automatically understand it, describe it, classify it, and remember it.
- Later you use those memories to give personalized feedback.
- If I correct you about a pattern, update your understanding.

RESPONSE FORMAT (Always use this structure)

**Bias:** Bullish / Bearish / Neutral  
**Setup Status:** Valid / Invalid / Wait  
**Probability:** XX%  

**Structure Analysis:**  
(HTF + Inner)

**Liquidity & Inducement:**  

**Valid POI & Entry:**  
(Recommended Entry + why)

**Stop Loss:**  

**Take Profit Targets:**  

**My Drawn Levels Review:**  
(If I already drew something)

**Pattern Match:**  
(Similar to any past pattern?)

**Final Advice:**  
Clear and direct.`;

export function getSystemPrompt(userRules?: string, pastPatterns?: string) {
  let prompt = SYSTEM_PROMPT;
  if (userRules && userRules.trim()) {
    prompt += `\n\nADDITIONAL USER RULES (follow these with same strictness):\n${userRules}`;
  }
  if (pastPatterns && pastPatterns.trim()) {
    prompt += `\n\nMY PAST PATTERNS (use these for comparison):\n${pastPatterns}`;
  }
  return prompt;
}

export function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function analyzeChart(
  imageBase64: string,
  userRules?: string,
  pastPatterns?: string
): Promise<string> {
  const openai = getOpenAI();
  const system = getSystemPrompt(userRules, pastPatterns);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this trading chart according to my strict rules. Follow the exact response format.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${imageBase64}`,
              detail: "high",
            },
          },
        ],
      },
    ],
    max_tokens: 2500,
    temperature: 0.2,
  });

  return response.choices[0]?.message?.content || "Analysis failed. Please try again.";
}

export function parseAnalysis(response: string) {
  const biasMatch = response.match(/\*\*Bias:\*\*\s*(.+)/i);
  const statusMatch = response.match(/\*\*Setup Status:\*\*\s*(.+)/i);
  const probMatch = response.match(/\*\*Probability:\*\*\s*(\d+)/i);

  return {
    bias: biasMatch?.[1]?.trim() || null,
    setup_status: statusMatch?.[1]?.trim() || null,
    probability: probMatch ? parseInt(probMatch[1], 10) : null,
  };
}

export async function describePattern(imageBase64: string): Promise<{
  description: string;
  classification: string;
  type: "good" | "failed" | "example";
}> {
  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a trading pattern classifier for SMC/ICT. Describe the pattern briefly, classify it (e.g. Breaker Block Long, QMR Short, Inducement Failure, etc.), and say if it looks like a good setup, failed setup, or example. Reply in JSON only: {\"description\": \"...\", \"classification\": \"...\", \"type\": \"good\"|\"failed\"|\"example\"}",
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Classify this chart pattern." },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${imageBase64}`,
              detail: "low",
            },
          },
        ],
      },
    ],
    max_tokens: 400,
    temperature: 0.1,
  });

  const text = response.choices[0]?.message?.content || "{}";
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      description: parsed.description || "Unknown pattern",
      classification: parsed.classification || "Unclassified",
      type: ["good", "failed", "example"].includes(parsed.type)
        ? parsed.type
        : "example",
    };
  } catch {
    return {
      description: text.slice(0, 300),
      classification: "Unclassified",
      type: "example",
    };
  }
}
