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
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/u/${encodeURIComponent(username)}` : '';
  const title = `My GitWrap ${year} — @${username}`;

  const heading = `My GitWrap ${year}. A cool log of turning coffee into commits that barely passed CI😎`;

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

  // Build share text for web intents (text + link only, used by direct X/LinkedIn buttons)
  const fullBody = statsLines.length > 0
    ? `${heading}\n\n${statsLines.join(' · ')}\n\n${tagsText}`
    : `${heading}\n\n${tagsText}`;

  // Web intent URLs — on mobile these open the native app via Universal Links / App Links
  // when the app is installed; otherwise they open in the browser.
  const xWebUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(fullBody)}`;
  // LinkedIn officially uses share-offsite (?url=). Custom title/summary parameters in shareArticle were deprecated by LinkedIn.
  const linkedInWebUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const open = (url: string) => window.open(url, '_blank', 'noopener,noreferrer,width=600,height=520');

  const handleLinkedInShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullBody);
        setCopiedLinkedIn(true);
        setTimeout(() => setCopiedLinkedIn(false), 3000);
      }
    } catch {
      // ignore clipboard error
    }
    open(linkedInWebUrl);
  };

  /**
   * "Share Card" button — opens the system share sheet with the card image
   * attached as a file. When the user picks X, LinkedIn, WhatsApp, etc. from
   * the sheet, the image + text are forwarded to that app.
   *
   * LinkedIn image fix: the body text uses a bare URL (no https:// protocol).
   * When the text contains a full https:// link, LinkedIn's mobile app switches
   * to "link scraping / article preview" mode and silently drops the attached
   * image file. Stripping the protocol keeps it in normal "image post" mode so
   * the card PNG shows up in the composed post.
   */
  const handleShareCard = async () => {
    if (onGetCardBlob && canNativeShare) {
      setIsSharing(true);
      try {
        const blob = await onGetCardBlob();
        if (blob) {
          const file = new File([blob], `gitwrap-${year}-${username}.png`, { type: 'image/png' });

          // Bare URL (no protocol) so LinkedIn keeps the image attachment
          const bareUrl = shareUrl.replace(/^https?:\/\//, '');
          const shareBody = statsLines.length > 0
            ? `${heading}\n\n${statsLines.join('\n')}\n\nCheck yours: ${bareUrl}\n\n${tagsText}`
            : `${heading}\n\nCheck yours: ${bareUrl}\n\n${tagsText}`;

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
        await navigator.share({ title, text: heading, url: shareUrl });
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
          onClick={handleLinkedInShare}
          style={{ width: '100%', justifyContent: 'center' }}
          title="Opens LinkedIn share. Recap text is automatically copied to clipboard for pasting!"
        >
          <LinkedInIcon className="ico" />
          {copiedLinkedIn ? 'Copied & Opening...' : 'LinkedIn'}
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
