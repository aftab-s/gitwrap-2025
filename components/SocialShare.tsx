import React from 'react';
import { XIcon } from './icons/XIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';

interface SocialShareProps {
  username: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ username }) => {
  const shareUrl = window.location.href;
  const text = `Check out my GitHub 2025 year in review on GitWrap! #GitWrap2025 #GitHubWrapped`;
  const title = `${username}'s GitWrap 2025`;

  const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
  const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`;
  
  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return (
    <div>
        <h2 className="text-2xl font-bold mb-4">Share Your Card</h2>
        <div className="flex flex-col sm:flex-row gap-4">
            <button
                onClick={() => openShareWindow(xShareUrl)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                aria-label="Share on X"
            >
                <XIcon className="w-5 h-5" />
                <span>Share on X</span>
            </button>
            <button
                onClick={() => openShareWindow(linkedInShareUrl)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0A66C2] text-white rounded-lg font-semibold hover:bg-[#0854a0] transition-colors"
                aria-label="Share on LinkedIn"
            >
                <LinkedInIcon className="w-5 h-5" />
                <span>Share on LinkedIn</span>
            </button>
        </div>
    </div>
  );
};

export default SocialShare;
