import React, { useState, useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { Share } from './icons/Arcade';

interface SocialShareProps {
  year: number;
  username: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ username, year }) => {
  const [canNativeShare, setCanNativeShare] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const text = `My GitHub ${year}, scored. #GitWrap${year}`;
  const title = `${username}'s GitWrap ${year}`;

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true);
    }
  }, []);

  const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
  const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`;

  const open = (url: string) => window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.warn('Native share failed:', err);
        }
      }
    }
  };

  return (
    <div className="social-share-container" style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      {canNativeShare && (
        <button
          type="button"
          className="key key-plain social-share-native"
          onClick={handleNativeShare}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Share size={18} />
          Share Recap
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
