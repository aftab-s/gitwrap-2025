import React, { useId } from 'react';

/**
 * Animated CPU circuit substrate shared by the landing page and user dossier.
 * Features traveling optical energy pulses and pulsing solder junction nodes,
 * evocative of modern semiconductor / CPU advertisements.
 */
export default function HomeFusionBackdrop() {
  const id = useId().replace(/:/g, '');

  return (
    <div className="circuit-backdrop" aria-hidden="true">
      <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 900">
        <defs>
          {/* Subtle base matrix grid */}
          <pattern id={id + '-grid'} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeOpacity=".075" />
            <circle cx="0" cy="0" r="1" fill="currentColor" opacity=".2" />
          </pattern>

          {/* Circuit nodes pattern */}
          <pattern id={id + '-nodes'} width="384" height="288" patternUnits="userSpaceOnUse">
            <path d="M32 96h64v64h96 M256 32v64h64 M96 256h64v-32" fill="none" stroke="currentColor" strokeOpacity=".1" />
            <path d="M248 216h16m-8-8v16 M88 24h16m-8-8v16" stroke="currentColor" strokeOpacity=".18" />
            <rect x="192" y="64" width="64" height="64" fill="currentColor" opacity=".02" />
            <rect x="32" y="192" width="32" height="32" fill="none" stroke="currentColor" opacity=".12" />
            <circle cx="96" cy="96" r="2" fill="var(--chrome-lunar)" opacity=".35" />
            <circle cx="320" cy="96" r="1.5" fill="var(--chrome-riso)" opacity=".3" />
            <circle cx="160" cy="224" r="1.5" fill="var(--chrome-volt)" opacity=".3" />
          </pattern>

          {/* CPU Pulse Bloom Glow Filter - Ultra-fine and whisper-subtle */}
          <filter id={id + '-cpu-glow'} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.0" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base Grid & Pattern Layers */}
        <rect width="100%" height="100%" fill={'url(#' + id + '-grid)'} />
        <rect width="100%" height="100%" fill={'url(#' + id + '-nodes)'} />

        {/* Static Circuit Traces (Substrate Wiring) - Ultra-fine 0.65px whisper wires */}
        <g stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.65" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-40,160 L220,160 L220,288 L480,288 L480,416 L720,416" />
          <path d="M1480,120 L1160,120 L1160,256 L960,256 L960,384 L800,384" />
          <path d="M160,640 L416,640 L416,512 L672,512 L672,640 L1024,640 L1024,480 L1280,480" />
          <path d="M-20,780 L320,780 L320,680 L580,680 L580,820 L920,820" />
          <path d="M512,-30 L512,192 L640,192 L640,448 L768,448 L768,720" />
          <path d="M1460,720 L1200,720 L1200,576 L1024,576 L1024,768 L840,768" />
          <path d="M288,320 L544,320 L544,224 L896,224 L896,352 L1152,352" />
        </g>

        {/* Traveling CPU Pulses - Ultra-thin 0.8px hairline optical data signals */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${id}-cpu-glow)`}>
          {/* Cyan Pulse: North Data Bus */}
          <path
            d="M-40,160 L220,160 L220,288 L480,288 L480,416 L720,416"
            stroke="#00E5FF"
            strokeWidth="0.8"
            className="cpu-travel-pulse pulse-speed-1"
          />
          {/* Riso Pink Pulse: Memory Channel A */}
          <path
            d="M1480,120 L1160,120 L1160,256 L960,256 L960,384 L800,384"
            stroke="#FF3366"
            strokeWidth="0.8"
            className="cpu-travel-pulse pulse-speed-2"
          />
          {/* Volt Yellow Pulse: Core Interconnect */}
          <path
            d="M160,640 L416,640 L416,512 L672,512 L672,640 L1024,640 L1024,480 L1280,480"
            stroke="#D4FF00"
            strokeWidth="0.75"
            className="cpu-travel-pulse pulse-speed-3"
          />
          {/* Emerald Pulse: South PCIe Lane */}
          <path
            d="M-20,780 L320,780 L320,680 L580,680 L580,820 L920,820"
            stroke="#00FF88"
            strokeWidth="0.75"
            className="cpu-travel-pulse pulse-speed-4"
          />
          {/* Matchday Gold Pulse: Vertical Clock Tree */}
          <path
            d="M512,-30 L512,192 L640,192 L640,448 L768,448 L768,720"
            stroke="#F7D154"
            strokeWidth="0.8"
            className="cpu-travel-pulse pulse-speed-5"
          />
          {/* Lunar Cyan Pulse: East I/O Controller */}
          <path
            d="M1460,720 L1200,720 L1200,576 L1024,576 L1024,768 L840,768"
            stroke="#00E5FF"
            strokeWidth="0.75"
            className="cpu-travel-pulse pulse-speed-6"
          />
          {/* Amber Pulse: Central Cache Bus */}
          <path
            d="M288,320 L544,320 L544,224 L896,224 L896,352 L1152,352"
            stroke="#FFA31A"
            strokeWidth="0.75"
            className="cpu-travel-pulse pulse-speed-7"
          />
        </g>

        {/* Junction Nodes & Solder Vias with very subtle ambient breathing */}
        <g>
          <circle cx="220" cy="160" r="1.0" fill="#00E5FF" className="cpu-node-pulse" style={{ animationDelay: '-1.4s' }} />
          <circle cx="480" cy="288" r="1.2" fill="#00E5FF" className="cpu-node-pulse" style={{ animationDelay: '-2.2s' }} />
          <circle cx="720" cy="416" r="1.3" fill="#00E5FF" className="cpu-node-pulse" style={{ animationDelay: '-0.8s' }} />

          <circle cx="1160" cy="120" r="1.0" fill="#FF3366" className="cpu-node-pulse" style={{ animationDelay: '-2.6s' }} />
          <circle cx="960" cy="256" r="1.2" fill="#FF3366" className="cpu-node-pulse" style={{ animationDelay: '-1.6s' }} />
          <circle cx="800" cy="384" r="1.3" fill="#FF3366" className="cpu-node-pulse" style={{ animationDelay: '-0.4s' }} />

          <circle cx="416" cy="640" r="1.0" fill="#D4FF00" className="cpu-node-pulse" style={{ animationDelay: '-1.8s' }} />
          <circle cx="672" cy="512" r="1.2" fill="#D4FF00" className="cpu-node-pulse" style={{ animationDelay: '-2.8s' }} />
          <circle cx="1024" cy="640" r="1.3" fill="#D4FF00" className="cpu-node-pulse" style={{ animationDelay: '-0.9s' }} />

          <circle cx="640" cy="192" r="1.0" fill="#F7D154" className="cpu-node-pulse" style={{ animationDelay: '-2.0s' }} />
          <circle cx="768" cy="448" r="1.2" fill="#F7D154" className="cpu-node-pulse" style={{ animationDelay: '-1.2s' }} />

          <circle cx="580" cy="680" r="1.0" fill="#00FF88" className="cpu-node-pulse" style={{ animationDelay: '-2.4s' }} />
          <circle cx="1200" cy="576" r="1.0" fill="#00E5FF" className="cpu-node-pulse" style={{ animationDelay: '-1.1s' }} />
        </g>
      </svg>
    </div>
  );
}
