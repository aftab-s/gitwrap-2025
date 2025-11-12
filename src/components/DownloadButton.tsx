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
  const [cardSize, setCardSize] = useState<{ width: number; height: number } | null>(null);

  React.useEffect(() => {
    if (!cardRef?.current) {
      return;
    }

    let animationFrame: number | null = null;

    const updateSize = () => {
      animationFrame = null;
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (!width || !height) return;
      setCardSize((prev) => {
        if (prev && prev.width === width && prev.height === height) {
          return prev;
        }
        return { width, height };
      });
    };

    const requestUpdate = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(updateSize);
    };

    updateSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(requestUpdate);
      resizeObserver.observe(cardRef.current);
    } else {
      window.addEventListener('resize', requestUpdate);
    }

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', requestUpdate);
      }
    };
  }, [cardRef]);

  const resolvedCardSize = React.useMemo(() => {
    if (cardSize && cardSize.width > 0 && cardSize.height > 0) {
      const ratio = cardSize.height / cardSize.width;
      const width = CANONICAL_CARD_DIMENSIONS.width;
      const height = Math.round(width * ratio);
      return { width, height };
    }

    return {
      width: CANONICAL_CARD_DIMENSIONS.width,
      height: CANONICAL_CARD_DIMENSIONS.height,
    };
  }, [cardSize]);

  const desktopExportSize: ExportDimensions = React.useMemo(() => ({
    width: resolvedCardSize.width,
    height: resolvedCardSize.height,
    label: `Desktop (${resolvedCardSize.width} × ${resolvedCardSize.height})`,
  }), [resolvedCardSize]);

  const handleDownloadPng = async () => {
    if (!cardRef?.current || downloading) return;

    setDownloading(true);
    try {
      await exportHtmlToPng(cardRef.current, desktopExportSize, `${username}-github-unwrapped-2025`, {
        backgroundColor: theme === 'minimal' ? '#ffffff' : null,
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
            <span>Download PNG</span>
          </>
        )}
      </button>

      <p
        className="mt-2 text-center text-xs font-medium"
        style={{ color: theme === 'minimal' ? '#475569' : '#e5e7eb' }}
      >
        {desktopExportSize.label}
      </p>
    </div>
  );
}
