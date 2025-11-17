import React from 'react';
import { CardLayout } from '../types';

interface LayoutSelectorProps {
  activeLayout: CardLayout;
  onSelectLayout: (layout: CardLayout) => void;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({ activeLayout, onSelectLayout }) => {
  return (
    <div className="p-2 bg-gray-800/50 rounded-lg">
      <div className="flex items-center gap-2">
        {Object.values(CardLayout).map(layout => (
          <button
            key={layout}
            onClick={() => onSelectLayout(layout)}
            className={`w-full text-center p-2 rounded-md transition-all duration-200 font-semibold ${
              activeLayout === layout
                ? 'bg-purple-600 shadow-lg'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {layout}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;
