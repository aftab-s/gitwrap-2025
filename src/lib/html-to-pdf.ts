// High-fidelity HTML export utilities powered by html-to-image
import { toCanvas } from 'html-to-image';

export const CANONICAL_CARD_DIMENSIONS = {
  width: 1080,
  height: 1920,
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
  /**
   * When true, uniformly scales the rendered card to fit entirely within the
   * requested export frame (width × height) without cropping, centering it
   * with potential letterboxing. If false, content may overflow and be clipped.
   * Defaults to true.
   */
  fitToFrame?: boolean;
}

const EXPORT_PIXEL_RATIO = 2; // balances clarity and file size

// User-configurable defaults for exports. These can be set to a number (pixels) or
// a percentage string (e.g. '80%') which will be resolved relative to the card element.
export type Dimension = number | string | null;
export const EXPORT_TARGET_WIDTH: Dimension = CANONICAL_CARD_DIMENSIONS.width; // px by default
export const EXPORT_TARGET_HEIGHT: Dimension = null; // null = auto height (content-driven)

function resolveDimension(
  dim: Dimension,
  element: HTMLElement,
  fallbackPx: number
): number | null {
  if (dim == null) return null;
  if (typeof dim === 'number') return dim;
  const s = String(dim).trim();
  if (s.endsWith('px')) {
    const n = parseFloat(s.slice(0, -2));
    return Number.isFinite(n) ? n : fallbackPx;
  }
  if (s.endsWith('%')) {
    const pct = parseFloat(s.slice(0, -1));
    if (!Number.isFinite(pct)) return fallbackPx;
    // For widths, percentage is of element's bounding width; for heights, caller should
    // pass the appropriate reference (we use element height for height percentages).
    const rect = element.getBoundingClientRect();
    return Math.max(1, Math.round((pct / 100) * rect.width));
  }
  // fallback parse as number of pixels
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : fallbackPx;
}

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

// Tiny helpers for timing/layout stability
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r(undefined)));

/**
 * Wait for all <img> elements inside the root to either load or error (with timeout).
 * We also force eager loading to avoid lazy-loading delays in the offscreen clone.
 */
async function waitForImages(root: HTMLElement, timeoutMs = 5000): Promise<void> {
  const imgs = Array.from(root.querySelectorAll('img')) as HTMLImageElement[];
  if (imgs.length === 0) return;

  await Promise.all(
    imgs.map((img) =>
      new Promise<void>((resolve) => {
        // Force eager loading for the cloned tree
        try {
          img.loading = 'eager';
          img.decoding = 'sync';
        } catch {}

        if (img.complete) {
          resolve();
          return;
        }
        let done = false;
        const onDone = () => {
          if (done) return;
          done = true;
          img.removeEventListener('load', onDone);
          img.removeEventListener('error', onDone);
          resolve();
        };
        const t = setTimeout(onDone, timeoutMs);
        img.addEventListener('load', () => {
          clearTimeout(t);
          onDone();
        });
        img.addEventListener('error', () => {
          clearTimeout(t);
          onDone();
        });
      })
    )
  );
}

/**
 * Wait for the element scrollHeight to stabilize across a number of samples or until timeout.
 */
async function waitForStableLayout(el: HTMLElement, opts?: { samples?: number; intervalMs?: number; timeoutMs?: number }): Promise<void> {
  const samples = opts?.samples ?? 3;
  const intervalMs = opts?.intervalMs ?? 50;
  const timeoutMs = opts?.timeoutMs ?? 1500;
  const heights: number[] = [];
  const start = performance.now();

  // Give the browser two frames to flush styles first
  await nextFrame();
  await nextFrame();

  while (performance.now() - start < timeoutMs) {
    heights.push(el.scrollHeight);
    if (heights.length >= samples) {
      const last = heights.slice(-samples);
      const equal = last.every((h) => h === last[0]);
      if (equal) return;
    }
    await sleep(intervalMs);
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
  // Height will be set later once we know the exportHeight
  clone.style.height = 'auto';
  clone.style.minHeight = '0';
  clone.style.maxHeight = 'none';
  clone.style.position = 'relative';
  clone.style.left = '0';
  clone.style.top = '0';
  clone.style.transform = 'none';
  clone.style.overflow = 'hidden';
  // Freeze text adjustments at the element level for mobile Safari
  clone.style.setProperty('-webkit-text-size-adjust', 'none');
  clone.style.setProperty('text-size-adjust', 'none');
  clone.style.setProperty('font-synthesis', 'none');
  clone.style.fontFamily = "'Space Grotesk', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'";

  const wrapper = document.createElement('div');
  // Offscreen container: keep it renderable (no visibility:hidden) to avoid blank captures
  wrapper.style.position = 'fixed';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.opacity = '0';
  wrapper.style.left = '0';
  wrapper.style.top = '-100000px';
  wrapper.style.width = `${targetWidth}px`;
  // Height will be explicitly set by the caller based on desired export height
  wrapper.style.height = 'auto';
  wrapper.style.zIndex = '-1';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  return { wrapper, clone };
}

async function renderElementToCanvas(
  element: HTMLElement,
  captureWidth: number,
  // Optional forced export height in logical pixels. If null, the function uses
  // a content-measured naturalHeight so exports remain content-driven and responsive.
  desiredHeight: number | null,
  backgroundColor: string | null,
  fitToFrame: boolean
): Promise<{ canvas: HTMLCanvasElement; logicalWidth: number; logicalHeight: number }> {
  await waitForFonts();

  const { wrapper, clone } = mountCloneForExport(element, captureWidth);

  // Allow the browser to recalculate layout with the enforced width
  await new Promise((resolve) => requestAnimationFrame(resolve));

  // Ensure images inside the clone are loaded and the layout is stable before measuring
  await waitForImages(clone).catch(() => undefined);
  await waitForStableLayout(clone).catch(() => undefined);
  // Small additional settle delay to match cached second-run behavior
  await sleep(50);

  // Measure the visible content by finding the innermost z-10 wrapper
  // The card structure is: <card p-8> <div z-10> {content} </div> </card>
  let naturalHeight = clone.scrollHeight;
  
  // Try to find the z-10 wrapper which contains the actual content
  const contentWrapper = clone.querySelector('div[class*="z-10"]') as HTMLElement | null;
  
  if (contentWrapper) {
    // Get the padding of the card
    const cardStyle = window.getComputedStyle(clone);
    const paddingTop = parseFloat(cardStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(cardStyle.paddingBottom) || 0;
    
    // Measure the content wrapper's actual height
    const contentHeight = contentWrapper.scrollHeight;
    
    // Calculate total: top padding + content + minimal bottom spacing (4px)
    naturalHeight = paddingTop + contentHeight + 4;
    
    // Measurements computed for content-driven export height
  } else {
    // Fallback: just remove bottom padding from scrollHeight
    const cardStyle = window.getComputedStyle(clone);
    const paddingBottom = parseFloat(cardStyle.paddingBottom) || 0;
    naturalHeight = clone.scrollHeight - paddingBottom + 4;
    
    // Fallback measurement path for content-driven export height
  }

  // Guard against zero-height measurements on some mobile browsers
  if (!naturalHeight || naturalHeight < 1) {
    naturalHeight = (typeof desiredHeight === 'number' && desiredHeight > 0)
      ? desiredHeight
      : CANONICAL_CARD_DIMENSIONS.height;
  }

  // If a desired height is supplied, use that as the export height; otherwise
  // use the natural content-measured height so the export fits the layout.
  const exportHeight = typeof desiredHeight === 'number' && desiredHeight > 0 ? desiredHeight : naturalHeight;

  // Deterministic framing: if fitToFrame is enabled, ALWAYS scale content to exactly
  // fill the requested export frame height. This eliminates tiny cross-device differences
  // (font metrics, layout rounding) by normalizing to a fixed frame.
  if (fitToFrame) {
  const scale = Number((exportHeight / naturalHeight).toFixed(6));
    const scaledWidth = captureWidth * scale;
    const scaledHeight = naturalHeight * scale; // equals exportHeight

    // Center the scaled content within the frame
    clone.style.position = 'absolute';
    // Expand clone's logical width so that after scaling it exactly fills the frame width.
    // This avoids side letterboxing when scale < 1 on some devices.
    if (scale > 0 && scale !== 1) {
      clone.style.width = `${captureWidth / scale}px`;
      clone.style.minWidth = `${captureWidth / scale}px`;
      clone.style.maxWidth = `${captureWidth / scale}px`;
    }
    clone.style.left = `${(captureWidth - (captureWidth)) / 2}px`;
    clone.style.top = `${(exportHeight - scaledHeight) / 2}px`;
    clone.style.transformOrigin = 'top left';
    clone.style.transform = `scale(${scale})`;

    // Set wrapper (parent) to the fixed frame size
    const parent = clone.parentElement as HTMLDivElement;
    parent.style.width = `${captureWidth}px`;
    parent.style.height = `${exportHeight}px`;
    parent.style.position = 'fixed';
    parent.style.left = '0';
    parent.style.top = '-100000px';
  } else {
    // Lock to explicit height (no scaling)
    clone.style.height = `${exportHeight}px`;
    clone.style.minHeight = `${exportHeight}px`;
    clone.style.maxHeight = `${exportHeight}px`;
    (clone.parentElement as HTMLDivElement).style.height = `${exportHeight}px`;
  }

  const canvas = await toCanvas(clone, {
    cacheBust: true,
    pixelRatio: EXPORT_PIXEL_RATIO,
    backgroundColor: backgroundColor ?? undefined,
    width: captureWidth,
    height: exportHeight,
    style: {
      width: `${captureWidth}px`,
      height: `${exportHeight}px`,
    },
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
 * - The card is rendered at the canonical 1080×1920 (9:16) story layout to guarantee consistent spacing,
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
    // Render at the requested width and (optionally) forced height so output matches the
    // desired aspect ratio (e.g. 9:16). Pass the size.height as desiredHeight.
    // Resolve width/height (allow px number or percentage strings). For width, if
    // size.width is provided we use that; otherwise fall back to EXPORT_TARGET_WIDTH.
    const widthDim = (size && (size.width as Dimension)) ?? EXPORT_TARGET_WIDTH;
    const heightDim = (size && (size.height as Dimension)) ?? EXPORT_TARGET_HEIGHT;

    // Resolve width in pixels relative to the element.
    const captureWidth = resolveDimension(
      widthDim,
      element,
      CANONICAL_CARD_DIMENSIONS.width
    ) as number;

    // If height dimension is provided, resolve it; otherwise pass null so renderer
    // uses content-driven height.
    const desiredHeight = heightDim != null ? resolveDimension(heightDim, element, CANONICAL_CARD_DIMENSIONS.height) : null;

    const { canvas, logicalHeight } = await renderElementToCanvas(
      element,
      captureWidth,
      desiredHeight,
      options.backgroundColor ?? null,
      options.fitToFrame ?? true
    );

    await new Promise<void>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Could not produce PNG blob from canvas'));
          return;
        }

    const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
    // Always use the requested export dimensions in the filename for consistency
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

