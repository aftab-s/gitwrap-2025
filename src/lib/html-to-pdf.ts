// High-fidelity HTML export utilities powered by html-to-image
import { toCanvas } from 'html-to-image';

export const CANONICAL_CARD_DIMENSIONS = {
  width: 1080,
  height: 1350,
} as const;

export interface ExportDimensions {
  width: number;
  height: number;
  label?: string;
}

interface ExportOptions {
  /**
   * Optional CSS color string used to fill the background of the exported image.
   * Defaults to transparent to preserve the exact card styling.
   */
  backgroundColor?: string | null;
}

const EXPORT_PIXEL_RATIO = 2; // balances clarity and file size

async function waitForFonts(): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) {
    return;
  }

  try {
    await (document as Document & { fonts: FontFaceSet }).fonts.ready;
  } catch (error) {
    console.warn('Font readiness check failed:', error);
  }
}

function mountCloneForExport(element: HTMLElement, targetWidth: number): {
  wrapper: HTMLDivElement;
  clone: HTMLElement;
} {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.setAttribute('data-exporting', 'true');
  clone.style.boxSizing = 'border-box';
  clone.style.margin = '0';
  clone.style.width = `${targetWidth}px`;
  clone.style.minWidth = `${targetWidth}px`;
  clone.style.maxWidth = `${targetWidth}px`;
  clone.style.height = 'auto';
  clone.style.maxHeight = 'none';
  clone.style.position = 'relative';
  clone.style.left = '0';
  clone.style.top = '0';
  clone.style.transform = 'none';

  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.opacity = '0';
  wrapper.style.left = '0';
  wrapper.style.top = '-100000px';
  wrapper.style.width = `${targetWidth}px`;
  wrapper.style.zIndex = '-1';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  return { wrapper, clone };
}

async function renderElementToCanvas(
  element: HTMLElement,
  captureWidth: number,
  backgroundColor: string | null
): Promise<{ canvas: HTMLCanvasElement; logicalWidth: number; logicalHeight: number }> {
  await waitForFonts();

  const { wrapper, clone } = mountCloneForExport(element, captureWidth);

  // Allow the browser to recalculate layout with the enforced width
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const canvas = await toCanvas(clone, {
    cacheBust: true,
    pixelRatio: EXPORT_PIXEL_RATIO,
    backgroundColor: backgroundColor ?? undefined,
    width: captureWidth,
  });

  const logicalWidth = canvas.width / EXPORT_PIXEL_RATIO;
  const logicalHeight = canvas.height / EXPORT_PIXEL_RATIO;

  document.body.removeChild(wrapper);

  return { canvas, logicalWidth, logicalHeight };
}

/**
 * Convert an HTML element (the on-screen card) into a downloadable PNG.
 *
 * SECURITY: All rendering occurs client-side. We never transmit the user's stats or rendered
 * card outside the browser, keeping sensitive contribution information in-memory only.
 *
 * EDGE CASES:
 * - External avatar images are loaded with CORS enabled; failures fall back to blank avatars.
 * - The card is rendered at the canonical 1080px desktop width to guarantee consistent spacing,
 *   then letterboxed when a different export aspect ratio is requested.
 * - Transparent background is preserved unless an explicit `backgroundColor` is supplied.
 *
 * @param element The HTML element that visually represents the GitHub Unwrapped card.
 * @param size Target output dimensions in pixels (predefined via PNG_EXPORT_SIZES).
 * @param filename Base filename (extension is appended automatically).
 * @param options Optional overrides such as a background fill colour.
 *
 * @returns Promise resolved when the download has been triggered.
 *
 * @example
 * await exportHtmlToPng(cardElement, PNG_EXPORT_SIZES.instagram, 'octocat-github-unwrapped');
 */
export async function exportHtmlToPng(
  element: HTMLElement,
  size: ExportDimensions,
  filename: string = 'github-unwrapped-2025',
  options: ExportOptions = {}
): Promise<void> {
  try {
    const { canvas, logicalWidth, logicalHeight } = await renderElementToCanvas(
      element,
      CANONICAL_CARD_DIMENSIONS.width,
      options.backgroundColor ?? null
    );

    const targetCanvas = document.createElement('canvas');
    targetCanvas.width = size.width;
    targetCanvas.height = size.height;

    const ctx = targetCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not acquire 2D canvas context for PNG export');
    }

    const fill = options.backgroundColor ?? null;
    if (fill !== null) {
      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
    } else {
      ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    }

    const scale = Math.min(targetCanvas.width / logicalWidth, targetCanvas.height / logicalHeight);
    const renderWidth = logicalWidth * scale;
    const renderHeight = logicalHeight * scale;
    const offsetX = (targetCanvas.width - renderWidth) / 2;
    const offsetY = (targetCanvas.height - renderHeight) / 2;

    ctx.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      offsetX,
      offsetY,
      renderWidth,
      renderHeight
    );

    await new Promise<void>((resolve, reject) => {
      targetCanvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Could not produce PNG blob from canvas'));
          return;
        }

        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${filename}-${size.width}x${size.height}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
        resolve();
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error exporting HTML to PNG:', error);
    throw new Error('Failed to export PNG. Please try again.');
  }
}

