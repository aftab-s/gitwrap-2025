import React, { useState, useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { Share } from './icons/Arcade';
import type { UserStats } from '../types';

export interface SocialShareProps {
  year: number;
  username: string;
  stats?: UserStats;
  playerClassName?: string;
  onGetCardBlob?: () => Promise<Blob | null>;
}

const SocialShare: React.FC<SocialShareProps> = ({
  username,
  year,
  stats,
  playerClassName,
  onGetCardBlob,
}) => {
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/u/${encodeURIComponent(username)}` : '';
  const title = `My GitWrap ${year} — @${username}`;

  const heading = `My GitWrap ${year} — a year of consistent commits, late-night debugging, and shipping real software, scored.`;

  const statsLines: string[] = [];
  if (stats) {
    if (stats.totalContributions > 0) {
      statsLines.push(`⚡ ${stats.totalContributions.toLocaleString()} contributions`);
    }
    if (stats.longestStreakDays > 0) {
      statsLines.push(`🔥 ${stats.longestStreakDays}-day streak`);
    }
    if (playerClassName) {
      statsLines.push(`🎮 Class: ${playerClassName}`);
    }
    if (stats.topLanguages?.[0]?.name) {
      statsLines.push(`💻 Stack: ${stats.topLanguages[0].name}`);
    }
  }

  const tags = [
    `#GitWrap${year}`,
    '#GitHub',
    '#OpenSource',
    '#SoftwareEngineering',
    '#Coding',
  ];
  if (stats?.topLanguages?.[0]?.name) {
    const langTag = `#${stats.topLanguages[0].name.replace(/[^a-zA-Z0-9]/g, '')}`;
    if (langTag.length > 1 && !tags.includes(langTag)) {
      tags.push(langTag);
    }
  }
  const tagsText = tags.join(' ');

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true);
    }
  }, []);

  const xBody = statsLines.length > 0
    ? `${heading}\n\n${statsLines.join(' · ')}\n\n${tagsText}`
    : `${heading}\n\n${tagsText}`;
  const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(xBody)}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const open = (url: string) => window.open(url, '_blank', 'noopener,noreferrer,width=600,height=520');

  // Mobile Native Share (iOS & Android) with the generated card image file!
  const handleNativeShare = async () => {
    if (!navigator.share) return;
    setIsSharing(true);
    try {
      let file: File | null = null;
      if (onGetCardBlob) {
        const blob = await onGetCardBlob();
        if (blob) {
          file = new File([blob], `gitwrap-${year}-${username}.png`, { type: 'image/png' });
        }
      }

      const shareBody = statsLines.length > 0
        ? `${heading}\n\n${statsLines.join('\n')}\n\nCheck yours: ${shareUrl}\n\n${tagsText}`
        : `${heading}\n\nCheck yours: ${shareUrl}\n\n${tagsText}`;

      // If phone supports sharing files via native share sheet (iOS 14.5+, Android 75+)
      if (file && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title,
          text: shareBody,
          files: [file],
        });
        return;
      }

      // Fallback without file if files not accepted
      await navigator.share({
        title,
        text: shareBody,
        url: shareUrl,
      });
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.warn('Native share failed:', err);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="social-share-container">
      {canNativeShare && (
        <button
          type="button"
          className="key key-plain social-share-native"
          onClick={handleNativeShare}
          disabled={isSharing}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Share size={18} />
          {isSharing ? 'Preparing card...' : 'Share Card to Apps (X, LinkedIn)'}
        </button>
      )}
      <div className="social-share-grid">
        <button type="button" className="key key-plain" onClick={() => open(xShareUrl)} style={{ width: '100%', justifyContent: 'center' }}>
          <XIcon className="ico" />
          Post on X
        </button>
        <button type="button" className="key key-plain" onClick={() => open(linkedInShareUrl)} style={{ width: '100%', justifyContent: 'center' }}>
          <LinkedInIcon className="ico" />
          LinkedIn
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
