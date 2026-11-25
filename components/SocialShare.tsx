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
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

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

  // Full share text: heading + stats + recap url + tags
  const fullBody = statsLines.length > 0
    ? `${heading}\n\n${statsLines.join(' · ')}\n\nCheck yours: ${shareUrl}\n\n${tagsText}`
    : `${heading}\n\nCheck yours: ${shareUrl}\n\n${tagsText}`;

  // Twitter/X web intent URL (X supports both text and url params natively)
  const xBody = statsLines.length > 0
    ? `${heading}\n\n${statsLines.join(' · ')}\n\n${tagsText}`
    : `${heading}\n\n${tagsText}`;
  const xWebUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(xBody)}`;

  // LinkedIn share URL with all supported & legacy fallback parameters
  const linkedInWebUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(fullBody)}&text=${encodeURIComponent(fullBody)}`;

  const open = (url: string) => window.open(url, '_blank', 'noopener,noreferrer,width=600,height=520');

  const copyToClipboard = async (text: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {}
    return false;
  };

  /**
   * Direct LinkedIn button click handler:
   * LinkedIn's API strictly ignores pre-filled text in URL parameters.
   * To ensure heading, stats, link and tags are not lost, we copy the full
   * text to clipboard and notify the user to paste it when LinkedIn opens.
   */
  const handleLinkedInDirect = async () => {
    await copyToClipboard(fullBody);
    setCopiedNotice('✓ Caption copied to clipboard! Paste it into LinkedIn.');
    setTimeout(() => setCopiedNotice(null), 5000);
    open(linkedInWebUrl);
  };

  /**
   * "Share Card" button — opens the system share sheet with the card PNG.
   *
   * iOS / LinkedIn image attachment fix:
   * On iOS, when navigator.share receives BOTH `text` and `files`, LinkedIn's
   * iOS share extension treats it strictly as a text post and drops the image file.
   * By passing ONLY `files: [file]` on iOS (while copying the full caption to the
   * clipboard), LinkedIn's extension is forced to open in media/photo mode,
   * guaranteeing the card image is attached to the post!
   */
  const handleShareCard = async () => {
    if (onGetCardBlob && canNativeShare) {
      setIsSharing(true);
      try {
        const blob = await onGetCardBlob();
        if (blob) {
          const file = new File([blob], `gitwrap-${year}-${username}.png`, { type: 'image/png' });

          // Copy full caption to clipboard so user can paste it anywhere
          await copyToClipboard(fullBody);

          if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
            const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent || '');

            if (isIOS) {
              // Pass ONLY the image file so iOS LinkedIn share extension does NOT drop the image
              setCopiedNotice('✓ Image attached! Caption copied to clipboard — paste when posting.');
              setTimeout(() => setCopiedNotice(null), 6000);

              await navigator.share({
                files: [file],
              });
            } else {
              // On Android and other platforms, both text and files are supported together
              await navigator.share({
                title,
                text: fullBody,
                files: [file],
              });
            }
            return;
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return; // User cancelled share sheet
        }
        console.warn('Native share with file failed, falling back:', err);
      } finally {
        setIsSharing(false);
      }
    }

    // Fallback for desktop or browsers without file sharing support
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: fullBody, url: shareUrl });
      } catch {}
    }
  };

  return (
    <div className="social-share-container">
      {canNativeShare && (
        <button
          type="button"
          className="key key-plain social-share-native"
          onClick={handleShareCard}
          disabled={isSharing}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Share size={18} />
          {isSharing ? 'Preparing card...' : 'Share Card'}
        </button>
      )}
      <div className="social-share-grid">
        <button
          type="button"
          className="key key-plain"
          onClick={() => open(xWebUrl)}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <XIcon className="ico" />
          Post on X
        </button>
        <button
          type="button"
          className="key key-plain"
          onClick={handleLinkedInDirect}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <LinkedInIcon className="ico" />
          LinkedIn
        </button>
      </div>
      {copiedNotice && (
        <div
          className="strip"
          style={{
            marginTop: 8,
            fontSize: '0.8rem',
            textAlign: 'center',
            color: 'var(--a1)',
            borderColor: 'var(--a1)',
            padding: '6px 10px',
          }}
        >
          {copiedNotice}
        </div>
      )}
    </div>
  );
};

export default SocialShare;
