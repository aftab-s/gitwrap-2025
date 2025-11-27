
import { GoogleGenAI } from "@google/genai";
import type { UserStats } from "../types";

// Lightweight deterministic template fallback (always one sentence)
function templateOneLiner(stats: UserStats) {
  const topLang = stats.topLanguages?.[0]?.name || 'your top language';
  const templates = [
    `${stats.login}: ${stats.totalContributions} contributions — you've been committing like it's cardio!`,
    `${stats.login} made ${stats.totalContributions} contributions in 2025; your keyboard must be legendary.`,
    `${stats.login} clocked ${stats.totalContributions} contributions — who needs sleep anyway?`,
    `${stats.login} — ${stats.totalContributions} contributions, coding and chaos in perfect harmony.`,
  ];
  // deterministic pick by username
  const idx = Math.abs([...stats.login].reduce((s, ch) => s * 31 + ch.charCodeAt(0), 7)) % templates.length;
  let msg = templates[idx];
  // ensure single sentence and trailing punctuation
  const first = msg.split(/[.!?]\s+/)[0].trim();
  return first.endsWith('.') || first.endsWith('!') || first.endsWith('?') ? first : `${first}.`;
}

export const generateFunMessage = async (stats: UserStats): Promise<string> => {
  // Prefer server-side secret `GEMINI_API_KEY`. Fall back to Vite client key only if server key missing.
  const serverKey = (process.env as any)?.GEMINI_API_KEY || (process.env as any)?.API_KEY;
  const viteEnv = (import.meta as any).env || {};
  const clientKey = viteEnv?.VITE_GEMINI_API_KEY;
  const apiKey = serverKey || clientKey;

  if (!apiKey) {
    console.warn("No Gemini API key found. Using template fallback.");
    return templateOneLiner(stats);
  }

  // Use server-side key when possible to avoid exposing secrets in the browser
  const ai = new GoogleGenAI({ apiKey });

  // Compact prompt to reduce input tokens and focus the model on producing a funny one-liner.
  const prompt = `
    Generate one funny single-sentence GitHub summary with no line breaks.
    Tone: light, simple, playful. No metaphors, no over-the-top jokes.
    Use the user's stats directly and clearly. Mention at most two stats.
    Address the user as "User" instead of pronouns.
    Do not use gender-neutral pronouns like "they".
    Limit to 25 words.

    Stats:
    Username: ${stats.login}
    Contributions: ${stats.totalContributions}
    Commits: ${stats.totalCommits}
    PRs: ${stats.totalPRs}
    Reviews: ${stats.totalPRReviews}
    Top language: ${stats.topLanguages[0]?.name}
    Streak: ${stats.longestStreakDays} days
    Best day: ${stats.bestDayOfWeek}
    Best hour: ${stats.bestHour}:00
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-preview-09-2025",
      contents: prompt,
      // Reduce output token budget (shorter response) and increase temperature for funnier, creative lines
      config: { maxOutputTokens: 32, temperature: 0.9 },
    });

    let text = (response.text || '').trim();
    if (!text) return templateOneLiner(stats);

    // Post-process: ensure one sentence only
    const first = text.split(/[\.!?]\s+/)[0].trim();
    const out = /[\.!?]$/.test(first) ? first : `${first}.`;
    return out;
  } catch (error) {
    console.error("Error generating fun message with Gemini:", error);
    return templateOneLiner(stats);
  }
};