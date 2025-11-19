import React, { forwardRef } from 'react';
import type { UserStats, Theme } from '../types';
import { CardLayout } from '../types';

import ClassicLayout from './layouts/ClassicLayout';
import ModernLayout from './layouts/ModernLayout';
import CompactLayout from './layouts/CompactLayout';

interface GitWrapCardProps {
  userData: UserStats;
  funMessage: string;
  theme: Theme;
  layout: CardLayout;
  isExport?: boolean;
}

const GitWrapCard = forwardRef<HTMLDivElement, GitWrapCardProps>(({ userData, funMessage, theme, layout, isExport = false }, ref) => {
  const props = { userData, funMessage, theme, isExport };

  switch (layout) {
    case CardLayout.Modern:
      return <ModernLayout ref={ref} {...props} />;
    case CardLayout.Compact:
      return <CompactLayout ref={ref} {...props} />;
    case CardLayout.Classic:
    default:
      return <ClassicLayout ref={ref} {...props} />;
  }
});

export default GitWrapCard;