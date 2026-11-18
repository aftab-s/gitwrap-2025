import React from 'react';
import { APP_REPO_URL } from '../config';

/** The rule that closes every page of the panel. */
const Footer: React.FC = () => (
  <footer className="footer">
    <div className="gw-wrap footer-row">
      <span className="silk">Open source · private contributions need your own sign-in</span>
      <a className="link" href={APP_REPO_URL} target="_blank" rel="noopener noreferrer">
        Source on GitHub
      </a>
    </div>
  </footer>
);

export default Footer;
