import React, { useState } from 'react';
import type { AIStats } from '../types';

/** Sidebar breakdown of the AI co-authored stat, with an honest explanation of how it's measured. */
const AIStatsPanel: React.FC<{ stats: AIStats }> = ({ stats }) => {
  const [open, setOpen] = useState(false);
  const maxTool = Math.max(1, ...stats.tools.map((t) => t.commits));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">AI Co-authored</h2>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-3xl font-black text-purple-300">{stats.commitShare}%</div>
            <div className="text-xs text-gray-400">
              of commits ({stats.aiCommits.toLocaleString()} / {stats.analyzedCommits.toLocaleString()})
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-pink-300">{stats.lineShare}%</div>
            <div className="text-xs text-gray-400">of added lines</div>
          </div>
        </div>

        {stats.tools.length > 0 ? (
          <ul className="space-y-2">
            {stats.tools.map((tool) => (
              <li key={tool.name} className="text-sm">
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>{tool.name}</span>
                  <span className="text-gray-400">{tool.commits.toLocaleString()} commits</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${(tool.commits / maxTool) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No AI co-author signatures found in the commits we scanned.</p>
        )}

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-xs text-gray-400 underline underline-offset-2 hover:text-white"
        >
          {open ? 'Hide' : 'How is this measured?'}
        </button>
        {open && (
          <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
            <p>
              We scanned {stats.analyzedCommits.toLocaleString()} of your non-merge commits on the default branch of your{' '}
              {stats.reposScanned} most-active repositories and looked for signatures AI coding tools leave behind,
              mainly <code className="text-gray-300">Co-authored-by:</code> trailers from Claude Code, GitHub Copilot,
              Cursor, Codex, Gemini/Jules, Aider, Devin, Windsurf, Amazon Q and Junie.
            </p>
            <p>
              It's a <strong className="text-gray-300">lower bound</strong>: inline autocomplete and code pasted from a
              chat window leave no trace in git, and squash merges can drop trailers. Very large commits are capped at
              2,000 lines so lockfiles don't skew the line share.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStatsPanel;
