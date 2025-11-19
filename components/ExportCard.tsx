import React from 'react';
import GitWrapCard from './GitWrapCard';
import type { UserStats, Theme } from '../types';
import { CardLayout } from '../types';

interface ExportCardProps {
  userData: UserStats;
  funMessage: string;
  theme: Theme;
  layout: CardLayout;
}

/**
 * Export-only wrapper that renders a GitWrap card at a fixed 1080x1440 size.
 * The component is meant to be mounted in a hidden container before converting to PNG.
 */
const ExportCard: React.FC<ExportCardProps> = ({ userData, funMessage, theme, layout }) => {
  return (
    <div
      style={{
        width: '1080px',
        height: '1440px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      className={`${theme.classes.bg} ${theme.classes.textPrimary}`}
    >
      <GitWrapCard
        userData={userData}
        funMessage={funMessage}
        theme={theme}
        layout={layout}
        isExport
      />
    </div>
  );
};

export default ExportCard;
