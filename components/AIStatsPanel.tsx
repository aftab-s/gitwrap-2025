import React, { useState } from 'react';
import type { AIStats } from '../types';

/** The AI co-authored reading in full, with a plain account of how it is measured. */
const AIStatsPanel: React.FC<{ stats: AIStats }> = ({ stats }) => {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <h2 className="heading">AI co-authored</h2>
      <div className="window" style={{ padding: '8px 16px' }}>
        <div className="score-row">
          <span className="silk">
            Commits ({stats.aiCommits.toLocaleString()} of {stats.analyzedCommits.toLocaleString()})
          </span>
          <span className="score-value">{stats.commitShare}%</span>
        </div>
        <div className="score-row">
          <span className="silk">Added lines</span>
          <span className="score-value">{stats.lineShare}%</span>
        </div>
        {stats.tools.map((tool) => (
          <div className="score-row" key={tool.name}>
            <span className="silk">{tool.name}</span>
            <span className="score-value">{tool.commits.toLocaleString()}</span>
          </div>
        ))}
        {stats.tools.length === 0 && (
          <div className="score-row">
            <span className="silk">No AI co-author signatures in the commits scanned</span>
          </div>
        )}
      </div>

      <button type="button" className="link" style={{ marginTop: 16 }} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? 'Hide the method' : 'How is this measured?'}
      </button>
      {open && (
        <div className="dim" style={{ fontSize: '0.9375rem', lineHeight: 1.5, marginTop: 12, maxWidth: '62ch' }}>
          <p style={{ margin: '0 0 8px' }}>
            {stats.analyzedCommits.toLocaleString()} non-merge commits on the default branch of the {stats.reposScanned} most active
            repositories were checked for the signatures AI coding tools leave behind, mainly <code>Co-authored-by:</code> trailers from
            Claude Code, GitHub Copilot, Cursor, Codex, Gemini, Aider, Devin, Windsurf, Amazon Q and Junie.
          </p>
          <p style={{ margin: 0 }}>
            This is a lower bound. Autocomplete and code pasted from a chat window leave no trace in git, and squash merges can drop
            trailers. Commits larger than 2,000 lines are capped so lockfiles do not skew the line share.
          </p>
        </div>
      )}
    </section>
  );
};

export default AIStatsPanel;
