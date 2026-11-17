import React from 'react';
import ArcadeCard from './ArcadeCard';
import type { UserStats, Theme } from '../types';

interface ExportCardProps {
  userData: UserStats;
  funMessage: string;
  theme: Theme;
}

/**
 * Export-only mount: the card at its natural 1080×1440, rendered in a hidden iframe and
 * rasterised to PNG.
 */
const ExportCard: React.FC<ExportCardProps> = ({ userData, funMessage, theme }) => (
  <ArcadeCard userData={userData} funMessage={funMessage} theme={theme} />
);

export default ExportCard;
