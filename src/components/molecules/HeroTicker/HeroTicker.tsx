/**
 * BBF Design System — HeroTicker molecule
 *
 * Despacho: B-BBF-WEB-HERO-HOME-CONSTRUCTION (FASE 5)
 * Decisiones: D-85 (monolítica pattern), D-82 (AI-readable), D-96 (CSSProperties),
 *             D-FASE2-05 (NEW molecule), D-98 (reduced-motion via CSS)
 *
 * Horizontal marquee ticker — decorative, aria-hidden by default.
 * Items duplicated for seamless loop (translateX -50% canon).
 * Animation controlled via CSS keyframe bbf-marquee (utilities/animations.css).
 * Duration override via CSS custom property --bbf-hero-ticker-duration (D-96).
 *
 * Reduced motion: animations.css freezes .bbf-hero-ticker__track (no JS needed).
 */

import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface HeroTickerProps {
  /** Array of ticker item strings (from Payload SiteHomepage.hero.ticker). */
  items: string[];
  /** Marquee duration in seconds. Default: 50. */
  durationSeconds?: number;
  /** Hide from screen readers. Default: true (decorative). */
  ariaHidden?: boolean;
  className?: string;
}

export function HeroTicker({
  items,
  durationSeconds = 50,
  ariaHidden = true,
  className,
}: HeroTickerProps) {
  // Duplicate items for seamless translateX(-50%) loop
  const loopedItems = [...items, ...items];

  return (
    <div
      data-component="bbf-hero-ticker"
      className={cn('bbf-hero-ticker', className)}
      aria-hidden={ariaHidden}
    >
      <div
        className="bbf-hero-ticker__track"
        style={{ '--bbf-hero-ticker-duration': `${durationSeconds}s` } as CSSProperties}
      >
        {loopedItems.map((item, index) => (
          <span key={index} className="bbf-hero-ticker__item">
            <span className="bbf-hero-ticker__dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
