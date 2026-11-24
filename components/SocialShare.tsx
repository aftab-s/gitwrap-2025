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
  // Use shareArticle scheme so the LinkedIn native app intercepts and opens on mobile
  const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(xBody)}`;

  const open = (url: string) => window.open(url, '_blank', 'noopener,noreferrer,width=600,height=520');

  // On phones (iOS/Android), trigger native share with the card image attached!
  const handleShareWithCard = async (fallbackUrl?: string) => {
    if (onGetCardBlob && canNativeShare) {
      setIsSharing(true);
      try {
        const blob = await onGetCardBlob();
        if (blob) {
          const file = new File([blob], `gitwrap-${year}-${username}.png`, { type: 'image/png' });
          const shareBody = statsLines.length > 0
            ? `${heading}\n\n${statsLines.join('\n')}\n\nCheck yours: ${shareUrl}\n\n${tagsText}`
            : `${heading}\n\nCheck yours: ${shareUrl}\n\n${tagsText}`;

          if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title,
              text: shareBody,
              files: [file],
            });
            return;
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return; // User cancelled share drawer
        }
        console.warn('Native share with file failed, falling back:', err);
      } finally {
        setIsSharing(false);
      }
    }

    // Fallback if on desktop or if native file share is unavailable
    if (fallbackUrl) {
      open(fallbackUrl);
    } else if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: heading,
          url: shareUrl,
        });
      } catch {}
    }
  };

  return (
    <div className="social-share-container">
      {canNativeShare && (
        <button
          type="button"
          className="key key-plain social-share-native"
          onClick={() => handleShareWithCard()}
          disabled={isSharing}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Share size={18} />
          {isSharing ? 'Preparing card...' : 'Share Card to Apps (X, LinkedIn)'}
        </button>
      )}
      <div className="social-share-grid">
        <button
          type="button"
          className="key key-plain"
          onClick={() => handleShareWithCard(xShareUrl)}
          disabled={isSharing}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <XIcon className="ico" />
          Post on X
        </button>
        <button
          type="button"
          className="key key-plain"
          onClick={() => handleShareWithCard(linkedInShareUrl)}
          disabled={isSharing}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <LinkedInIcon className="ico" />
          LinkedIn
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
