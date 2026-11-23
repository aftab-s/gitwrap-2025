import React, { useLayoutEffect, useRef, useState } from 'react';
import type { UserStats, Theme } from '../types';
import ArcadeCard from './ArcadeCard';
import { CARD_W, CARD_H } from '../constants';

interface GitWrapCardProps {
  userData: UserStats;
  funMessage: string;
  theme: Theme;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * On-screen preview of the card. The card itself is always laid out at its export size
 * (1080×1440); this wrapper scales it down to the available width, so what you see is exactly
 * the image you download.
 */
const GitWrapCard: React.FC<GitWrapCardProps> = ({ userData, funMessage, theme, className, style }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const update = () => setScale(frame.clientWidth / CARD_W);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className={`card-frame ${className ?? ''}`}
      style={{ aspectRatio: `${CARD_W} / ${CARD_H}`, ...style }}
    >
      <div style={{ width: CARD_W, height: CARD_H, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
        <ArcadeCard userData={userData} funMessage={funMessage} theme={theme} />
      </div>
    </div>
  );
};

export default GitWrapCard;
