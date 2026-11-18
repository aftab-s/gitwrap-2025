// SERVER-ONLY. The Gemini key (GEMINI_API_KEY) never reaches the browser.
import { GoogleGenAI } from '@google/genai';
import type { UserStats } from '../../types.js';

const GEMINI_TIMEOUT_MS = 6000;

// Lightweight deterministic template fallback (always one sentence)
function templateOneLiner(stats: UserStats): string {
  const templates = [
    `${stats.login}: ${stats.totalContributions} contributions — you've been committing like it's cardio!`,
    `${stats.login} made ${stats.totalContributions} contributions in ${stats.year}; your keyboard must be legendary.`,
    `${stats.login} clocked ${stats.totalContributions} contributions — who needs sleep anyway?`,
    `${stats.login} — ${stats.totalContributions} contributions, coding and chaos in perfect harmony.`,
  ];
  // deterministic pick by username
  const idx = Math.abs([...stats.login].reduce((s, ch) => (s * 31 + ch.charCodeAt(0)) | 0, 7)) % templates.length;
  return templates[idx];
}

export async function generateFunMessage(stats: UserStats): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return templateOneLiner(stats);

  const prompt = `
    Generate one funny single-sentence GitHub summary with no line breaks.
    Tone: light, simple, playful. No metaphors, no over-the-top jokes.
    Use the user's stats directly and clearly. Mention at most two stats.
    Address the user by username instead of pronouns.
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
    const client = new GoogleGenAI({ apiKey });
    const response = await Promise.race([
      client.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
        contents: prompt,
        config: { maxOutputTokens: 48, temperature: 0.9 },
      }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Gemini timed out')), GEMINI_TIMEOUT_MS)),
    ]);

    const text = (response.text || '').trim().replace(/\s+/g, ' ');
    if (!text) return templateOneLiner(stats);

    // Keep the first sentence only
    const first = text.split(/(?<=[.!?])\s+/)[0].trim();
    return /[.!?]$/.test(first) ? first : `${first}.`;
  } catch (error) {
    console.error('Gemini one-liner failed, using template:', error);
    return templateOneLiner(stats);
  }
}
