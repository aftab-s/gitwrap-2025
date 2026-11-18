import React from 'react';
import { playerAvatar } from '../playerAvatars';

/** Decorative companion; the adjacent class name supplies its accessible label. */
export default function PlayerAvatar({ name, size = 160 }: { name: string; size?: number }) {
  return <img src={playerAvatar(name)} alt="" width={size} height={size} style={{ width: size, height: size, objectFit: 'contain', imageRendering: 'pixelated', flexShrink: 0 }} />;
}
