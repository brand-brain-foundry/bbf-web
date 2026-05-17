/**
 * BBF Design System — HeroVideo molecule
 *
 * Subordinado a: B-BBF-WEB-M5-D3-HEROVIDEO
 * Decisiones: D-79 (compound), D-82 (AI-readable), D-86 (compound API),
 *             D-87 (assets canon paths)
 *
 * API compound canon BBF (D-79 aplica — Source/Overlay contenidos distintos):
 *
 *   <HeroVideo poster="..." autoplay muted loop>
 *     <HeroVideo.Source src="..." type="webm-vp9" />
 *     <HeroVideo.Source src="..." type="mp4-h264" />
 *     <HeroVideo.Overlay tone="none" />
 *   </HeroVideo>
 *
 * Server Component (sin state interactivo, atributos native HTML video).
 *
 * Auto-corrección §14: import CSSProperties directamente (no React.CSSProperties).
 * NOTA: codec real de hero.av1.webm es VP9 (encoder fnord plugin Premier 2026).
 */

import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  heroVideoVariants,
  heroVideoOverlayVariants,
  type HeroVideoVariants,
  type HeroVideoOverlayVariants,
} from './HeroVideo.variants';

/**
 * Source type → MIME type canon BBF.
 * Strategic mapea string simple a MIME completo para limpieza API.
 */
const SOURCE_TYPE_MAP = {
  'webm-vp9': 'video/webm; codecs="vp9"',
  'webm-av1': 'video/webm; codecs="av01.0.05M.08"',
  'mp4-h264': 'video/mp4; codecs="avc1.4D401E,mp4a.40.2"',
  'mp4-h265': 'video/mp4; codecs="hvc1"',
  'mp4-av1': 'video/mp4; codecs="av01.0.05M.08,mp4a.40.2"',
  mov: 'video/quicktime',
} as const;

export type HeroVideoSourceType = keyof typeof SOURCE_TYPE_MAP;

/* ============================================================
   ROOT
   ============================================================ */
export interface HeroVideoProps extends HeroVideoVariants {
  /**
   * Poster frame image (preview antes de cargar video).
   * Path canon: /assets/media/hero/hero-poster.{jpg|webp}
   * TD-M5-D3-01: poster pendiente de crear en M6+.
   */
  poster?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  /**
   * Preload strategy. Default: 'metadata' (canon performance).
   */
  preload?: 'none' | 'metadata' | 'auto';
  /**
   * ARIA label opcional. Default: aria-hidden=true (video decorativo).
   */
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
}

/**
 * BBF HeroVideo molecule — Atomic Design canon
 *
 * @description
 * Video hero canon BBF. Compound components dot notation (D-79).
 * Sources tipados con MIME map. Overlay opcional con tone variant.
 *
 * @example Default (sin overlay)
 * ```tsx
 * <HeroVideo poster="/assets/media/hero/hero-poster.jpg" autoplay muted loop>
 *   <HeroVideo.Source src="/assets/media/hero/hero.av1.webm" type="webm-vp9" />
 *   <HeroVideo.Source src="/assets/media/hero/hero.h264.mp4" type="mp4-h264" />
 * </HeroVideo>
 * ```
 *
 * @example Con overlay dark
 * ```tsx
 * <HeroVideo poster="..." autoplay muted loop>
 *   <HeroVideo.Source src="..." type="webm-vp9" />
 *   <HeroVideo.Source src="..." type="mp4-h264" />
 *   <HeroVideo.Overlay tone="dark" />
 * </HeroVideo>
 * ```
 *
 * @example Fit contain (no fill)
 * ```tsx
 * <HeroVideo fit="contain" poster="...">...</HeroVideo>
 * ```
 */
function HeroVideoRoot({
  poster,
  autoplay = false,
  muted = false,
  loop = false,
  playsInline = true,
  preload = 'metadata',
  fit,
  ariaLabel,
  className,
  children,
}: HeroVideoProps) {
  return (
    <div data-component="bbf-hero-video" className={cn(heroVideoVariants({ fit }), className)}>
      <video
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload={preload}
        poster={poster}
        aria-label={ariaLabel}
        aria-hidden={ariaLabel ? undefined : true}
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: 'var(--bbf-hero-video-object-fit, cover)' as 'cover' }}
      >
        {children}
      </video>
    </div>
  );
}

/* ============================================================
   SOURCE (sub-component)
   ============================================================ */
export interface HeroVideoSourceProps {
  src: string;
  type: HeroVideoSourceType;
}

/**
 * HeroVideo.Source — sub-component canon
 *
 * @example
 * ```tsx
 * <HeroVideo.Source src="/assets/media/hero/hero.av1.webm" type="webm-vp9" />
 * ```
 */
function HeroVideoSource({ src, type }: HeroVideoSourceProps) {
  const mimeType = SOURCE_TYPE_MAP[type];
  return (
    <source
      data-component="bbf-hero-video-source"
      data-source-type={type}
      src={src}
      type={mimeType}
    />
  );
}

/* ============================================================
   OVERLAY (sub-component opcional)
   ============================================================ */
export interface HeroVideoOverlayProps extends HeroVideoOverlayVariants {
  /**
   * Opacity override 0..1. Default según tone variant.
   */
  opacity?: number;
  /**
   * Color custom CSS (solo si tone='custom').
   */
  color?: string;
  className?: string;
}

/**
 * HeroVideo.Overlay — sub-component opcional canon
 *
 * @example
 * ```tsx
 * <HeroVideo.Overlay tone="dark" />
 * <HeroVideo.Overlay tone="custom" color="rgba(0,0,0,0.3)" />
 * ```
 */
function HeroVideoOverlay({ tone = 'none', opacity, color, className }: HeroVideoOverlayProps) {
  if (tone === 'none' && !opacity && !color) return null;

  const style: CSSProperties = {};
  if (opacity !== undefined) style.opacity = opacity;
  if (tone === 'custom' && color) style.backgroundColor = color;

  return (
    <div
      data-component="bbf-hero-video-overlay"
      data-tone={tone}
      className={cn(heroVideoOverlayVariants({ tone }), className)}
      style={Object.keys(style).length > 0 ? style : undefined}
      aria-hidden="true"
    />
  );
}

/* ============================================================
   COMPOUND EXPORT (canon Radix pattern)
   ============================================================ */
export const HeroVideo = Object.assign(HeroVideoRoot, {
  Source: HeroVideoSource,
  Overlay: HeroVideoOverlay,
});
