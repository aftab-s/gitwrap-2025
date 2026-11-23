import React, { useEffect, useState } from 'react';
import { playerAvatar } from '../playerAvatars';

/** Decorative companion; the adjacent class name supplies its accessible label. */
export default function PlayerAvatar({ name, size = 160, animated = false }: { name: string; size?: number; animated?: boolean }) {
  const avatar = playerAvatar(name);
  const slug = avatar.split('/').pop()!.replace('.png', '');
  const sheet = '/avatars/animated/' + slug + '.png';
  const [loadedSheet, setLoadedSheet] = useState('');
  useEffect(() => {
    if (!animated) return;
    let active = true;
    const image = new Image();
    image.onload = () => { if (active) setLoadedSheet(sheet); };
    image.src = sheet;
    return () => { active = false; };
  }, [animated, sheet]);
  if (animated && loadedSheet === sheet) return <span aria-hidden="true" className="player-sprite" style={{ width: size, height: size, backgroundImage: `url(/avatars/animated/${slug}.png)` }} />;
  return <img src={avatar} alt="" width={size} height={size} style={{ width: size, height: size, objectFit: 'contain', imageRendering: 'pixelated', flexShrink: 0 }} />;
}
