
import React from 'react';
import styled from 'styled-components';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md';
}

const Loader: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const isSmall = size === 'sm';
  
  return (
    <StyledWrapper className={isSmall ? 'small' : ''}>
      <div className="loader-container">        
        <div className="text-container">
          <span className="analyzing-text">Analyzing</span>
          <div className="data-stream">
            <span className="data-item">commits</span>
            <span className="data-item">pull requests</span>
            <span className="data-item">issues</span>
            <span className="data-item">repositories</span>
            <span className="data-item">contributions</span>
            <span className="data-item">commits</span>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  /* Text Animation */
  .text-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: "Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  &.small .text-container {
    gap: 0.5rem;
  }

  .analyzing-text {
    color: rgba(156, 163, 175, 0.9);
    font-size: 1.5rem;
    font-weight: 500;
  }

  &.small .analyzing-text {
    font-size: 1rem;
  }

  .data-stream {
    position: relative;
    height: 2rem;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  &.small .data-stream {
    height: 1.5rem;
  }

  .data-item {
    display: block;
    position: absolute;
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    white-space: nowrap;
    animation: slideData 12s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  }

  &.small .data-item {
    font-size: 1rem;
  }

  .data-item:nth-child(1) { animation-delay: 0s; }
  .data-item:nth-child(2) { animation-delay: 2s; }
  .data-item:nth-child(3) { animation-delay: 4s; }
  .data-item:nth-child(4) { animation-delay: 6s; }
  .data-item:nth-child(5) { animation-delay: 8s; }
  .data-item:nth-child(6) { animation-delay: 10s; }

  @keyframes slideData {
    0%, 12% {
      opacity: 1;
      transform: translateY(0);
    }
    17%, 100% {
      opacity: 0;
      transform: translateY(-2rem);
    }
  }
`;

export default Loader;
export const LoadingSpinner = Loader;
