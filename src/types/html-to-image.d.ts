declare module 'html-to-image' {
  export interface HtmlToImageOptions {
    width?: number;
    height?: number;
    quality?: number;
    style?: Partial<CSSStyleDeclaration>;
    pixelRatio?: number;
    backgroundColor?: string;
    cacheBust?: boolean;
  }

  export function toCanvas(
    node: HTMLElement,
    options?: HtmlToImageOptions
  ): Promise<HTMLCanvasElement>;
  export function toPng(node: HTMLElement, options?: HtmlToImageOptions): Promise<string>;
  export function toJpeg(node: HTMLElement, options?: HtmlToImageOptions): Promise<string>;
  export function toSvg(node: HTMLElement, options?: HtmlToImageOptions): Promise<string>;
  export function toBlob(node: HTMLElement, options?: HtmlToImageOptions): Promise<Blob | null>;
}

