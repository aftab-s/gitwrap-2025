import React from 'react';
import { Link } from 'react-router-dom';
import { APP_REPO_URL } from '../config';
import { GitHubMark } from './icons/Arcade';

/** The rule that closes every page of the panel. */
const Footer: React.FC<{ showThemeGuide?: boolean }> = ({ showThemeGuide = false }) => (
  <footer className="footer">
    <div className="gw-wrap footer-row">
      <span className="silk">Open source · private contributions need your own sign-in</span>
      <div className="footer-actions">
      {showThemeGuide && <Link to="/themes" className="key key-sm key-plain footer-themes-key">Explore 2026 themes <span aria-hidden="true">↗</span></Link>}
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
    </div>
  </footer>
);

export default Footer;
