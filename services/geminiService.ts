
import { GoogleGenAI } from "@google/genai";
import type { UserStats } from "../types";

export const generateFunMessage = async (stats: UserStats): Promise<string> => {
  // Read Vite client env `VITE_GEMINI_API_KEY` first, then fall back to server env vars.
  const viteEnv = (import.meta as any).env;
  const apiKey = viteEnv?.VITE_GEMINI_API_KEY || (process.env as any)?.API_KEY || (process.env as any)?.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY / API_KEY / GEMINI_API_KEY not set. Returning mock message.");
    return `With ${stats.totalCommits} commits, you were a coding machine in 2025! Keep up the fantastic work!`;
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze the following GitHub user's statistics for 2025 and generate a fun, encouraging, and slightly witty message for their "GitWrap 2025" summary.
    The message MUST be exactly 2 sentences or less. Keep it concise and punchy.
    Mention one or two specific stats to make it personal.

    User Stats:
    - Username: ${stats.login}
    - Total Commits: ${stats.totalCommits}
    - Total Pull Requests: ${stats.totalPRs}
    - Top Language: ${stats.topLanguages[0]?.name}
    - Longest Streak: ${stats.longestStreakDays} days
    - Most Productive Day: ${stats.bestDayOfWeek}

    Example Output:
    "Wow, ${stats.login}! ${stats.totalCommits} commits in 2025 is epic. Keep shipping that awesome code!"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 100, // Limit output length
      },
    });

    const text = response.text.trim();
    return text;
  } catch (error) {
    console.error("Error generating fun message with Gemini:", error);
    return `With ${stats.totalCommits} commits, you were a coding machine in 2025! Keep up the great work.`;
  }
};