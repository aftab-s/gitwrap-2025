import React, { useState } from 'react';
import { exportHtmlToPng, type ExportDimensions, CANONICAL_CARD_DIMENSIONS } from '@/lib/html-to-pdf';

interface DownloadButtonProps {
  cardRef?: React.RefObject<HTMLDivElement>; // HTML card reference for exports
  username: string;
  disabled?: boolean;
  theme?: string;
  themeColors?: any;
}

export function DownloadButton({ cardRef, username, disabled, theme = 'space', themeColors }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const storyExportSize: ExportDimensions = React.useMemo(
    () => ({
      width: CANONICAL_CARD_DIMENSIONS.width,
      height: CANONICAL_CARD_DIMENSIONS.height,
      label: `Story 9:16 (${CANONICAL_CARD_DIMENSIONS.width} × ${CANONICAL_CARD_DIMENSIONS.height})`,
    }),
    []
  );

  const handleDownloadPng = async () => {
    if (!cardRef?.current || downloading) return;

    setDownloading(true);
    try {
      await exportHtmlToPng(cardRef.current, storyExportSize, `${username}-github-unwrapped-2025`, {
        backgroundColor: theme === 'minimal' ? '#ffffff' : null,
        fitToFrame: true,
      });
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleDownloadPng}
        disabled={disabled || downloading}
        className="group flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: themeColors?.accent || '#06b6d4',
          boxShadow: `0 10px 15px -3px ${themeColors?.accent || '#06b6d4'}30`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = themeColors?.accentSecondary || '#0891b2';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = themeColors?.accent || '#06b6d4';
        }}
      >
        {downloading ? (
          <>
            <span className="spinner" style={{ width: 20, height: 20, borderWidth: '2px' }} />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined transition-transform group-hover:rotate-12">download</span>
            <span>Download Card PNG</span>
          </>
        )}
      </button>

      <p
        className="mt-2 text-center text-xs font-medium"
        style={{ color: theme === 'minimal' ? '#475569' : '#e5e7eb' }}
      >
        {storyExportSize.label}
      </p>
    </div>
  );
}
