import React, { useId } from 'react';

/** Quiet circuit field shared by the landing page and card studio. */
export default function HomeFusionBackdrop() {
  const id = useId().replace(/:/g, '');
  return <div className="circuit-backdrop" aria-hidden="true">
    <svg width="100%" height="100%">
      <defs>
        <pattern id={id + '-grid'} width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeOpacity=".09" />
          <circle cx="0" cy="0" r="1" fill="currentColor" opacity=".24" />
        </pattern>
        <pattern id={id + '-nodes'} width="384" height="288" patternUnits="userSpaceOnUse">
          <path d="M32 96h64v64h96 M256 32v64h64 M96 256h64v-32" fill="none" stroke="currentColor" strokeOpacity=".12" />
          <path d="M248 216h16m-8-8v16 M88 24h16m-8-8v16" stroke="currentColor" strokeOpacity=".2" />
          <rect x="192" y="64" width="64" height="64" fill="currentColor" opacity=".025" />
          <rect x="32" y="192" width="32" height="32" fill="none" stroke="currentColor" opacity=".13" />
          <circle cx="96" cy="96" r="2" fill="var(--chrome-lunar)" opacity=".45" />
          <circle cx="320" cy="96" r="1.5" fill="var(--chrome-riso)" opacity=".4" />
          <circle cx="160" cy="224" r="1.5" fill="var(--chrome-volt)" opacity=".35" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={'url(#' + id + '-grid)'} />
      <rect width="100%" height="100%" fill={'url(#' + id + '-nodes)'} />
    </svg>
  </div>;
}
