// SERVER-ONLY. Neither the Gemini key (GEMINI_API_KEY) nor Groq key (GROQ_API_KEY) reaches the browser.
import { GoogleGenAI } from '@google/genai';
import type { UserStats } from '../../types.js';

const AI_TIMEOUT_MS = 6000;

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

function buildPrompt(stats: UserStats): string {
  return `
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
    Top language: ${stats.topLanguages[0]?.name || 'Unknown'}
    Streak: ${stats.longestStreakDays} days
    Best day: ${stats.bestDayOfWeek}
    Best hour: ${stats.bestHour}:00
  `.trim();
}

function cleanOneLiner(text: string): string | null {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (!trimmed) return null;
  // Keep the first sentence only
  const first = trimmed.split(/(?<=[.!?])\s+/)[0].trim();
  if (!first) return null;
  return /[.!?]$/.test(first) ? first : `${first}.`;
}

async function generateWithGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const client = new GoogleGenAI({ apiKey });
  const response = await Promise.race([
    client.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
      contents: prompt,
      config: { maxOutputTokens: 48, temperature: 0.9 },
    }),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Gemini timed out')), AI_TIMEOUT_MS)),
  ]);

  return cleanOneLiner(response.text || '');
}

async function generateWithGroq(prompt: string): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.9,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Groq API responded with ${res.status}: ${errText}`);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content || '';
    return cleanOneLiner(content);
  } finally {
    clearTimeout(timer);
  }
}

export async function generateFunMessage(stats: UserStats): Promise<string> {
  const prompt = buildPrompt(stats);

  // 1. Try Gemini if configured
  if (process.env.GEMINI_API_KEY) {
    try {
      const message = await generateWithGemini(prompt);
      if (message) return message;
    } catch (error) {
      console.warn('Gemini one-liner failed, falling back:', error);
    }
  }

  // 2. Try Groq if Gemini wasn't configured or failed
  if (process.env.GROQ_API_KEY) {
    try {
      const message = await generateWithGroq(prompt);
      if (message) return message;
    } catch (error) {
      console.warn('Groq one-liner failed, falling back:', error);
    }
  }

  // 3. Fallback to deterministic template
  return templateOneLiner(stats);
}
