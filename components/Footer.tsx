import React from 'react';
import { APP_REPO_URL } from '../config';
import { GitHubMark } from './icons/Arcade';

/** The rule that closes every page of the panel. */
const Footer: React.FC = () => (
  <footer className="footer">
    <div className="gw-wrap footer-row">
      <span className="silk">Open source · private contributions need your own sign-in</span>
      <a
        className="key key-sm key-plain footer-github-key"
        href={APP_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Star GitWrap on GitHub"
      >
        <GitHubMark size={14} />
        <span>STAR ON GITHUB</span>
      </a>
    </div>
  </footer>
);

export default Footer;
