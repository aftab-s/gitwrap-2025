import React from 'react';
import { XIcon } from './icons/XIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';

interface SocialShareProps {
  year: number;
  username: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ username, year }) => {
  const shareUrl = window.location.href;
  const text = `My GitHub ${year}, scored. #GitWrap${year}`;
  const title = `${username}'s GitWrap ${year}`;

  const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
  const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`;

  const open = (url: string) => window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <button type="button" className="key key-plain" onClick={() => open(xShareUrl)}>
        <XIcon className="ico" />
        Post on X
      </button>
      <button type="button" className="key key-plain" onClick={() => open(linkedInShareUrl)}>
        <LinkedInIcon className="ico" />
        LinkedIn
      </button>
    </div>
  );
};

export default SocialShare;
