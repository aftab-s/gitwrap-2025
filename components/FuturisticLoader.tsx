import React from 'react';

interface Props {
  username: string;
  year: number;
}

export const FuturisticLoader: React.FC<Props> = ({ username, year }) => (
  <div className="recap-loader" role="status" aria-live="polite">
    <svg className="recap-loader-mark" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <path className="recap-loader-track" d="M30 72V24M30 60C30 40 66 56 66 32" />
      <path className="recap-loader-trace" pathLength="100" d="M30 72V60C30 40 66 56 66 32" />
      <circle className="recap-loader-node" cx="30" cy="24" r="5" />
      <circle className="recap-loader-node" cx="30" cy="72" r="5" />
      <g className="recap-loader-spark">
        <path d="m66 17 3.5 9.5L79 30l-9.5 3.5L66 43l-3.5-9.5L53 30l9.5-3.5Z" />
      </g>
    </svg>
    <span className="recap-loader-edition">Your {year}, in the making</span>
    <h2 className="recap-loader-title">Connecting the commits<span className="recap-loader-period">.</span></h2>
    <p className="recap-loader-caption">A year of little things. One story.</p>
    <div className="recap-loader-account">@{username}</div>
    <div className="recap-loader-line" aria-hidden="true"><span /></div>
    <span className="recap-loader-label">Preparing your recap</span>
  </div>
);

export default FuturisticLoader;
