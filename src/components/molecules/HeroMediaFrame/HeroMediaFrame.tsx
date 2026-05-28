/**
 * BBF Design System — HeroMediaFrame molecule
 *
 * Despacho: B-BBF-WEB-HERO-HOME-CONSTRUCTION (FASE 5)
 * Fix: B-BBF-WEB-HERO-T6_7-FIX-RSC (revert a Server Component, D-99)
 * Decisiones: D-86 (compound API), D-82 (AI-readable), D-FASE2-06 (NEW molecule)
 *
 * Server Component — compound intacto. REC timer sync via HeroRecTimer Client leaf.
 * HeroMediaFrame.Chrome acepta children slot para inyectar <HeroRecTimer />.
 *
 * <HeroMediaFrame>
 *   <HeroMediaFrame.Chrome label="// brand-brain.foundry · live feed" recording>
 *     <HeroRecTimer />
 *   </HeroMediaFrame.Chrome>
 *   <HeroMediaFrame.VideoShell><HeroVideo controls ... /></HeroMediaFrame.VideoShell>
 *   <HeroMediaFrame.Foot><Text variant="caption">...</Text></HeroMediaFrame.Foot>
 * </HeroMediaFrame>
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { heroMediaFrameVariants } from './HeroMediaFrame.variants';

/* ============================================================
   ROOT
   ============================================================ */
interface HeroMediaFrameProps {
  className?: string;
  children: ReactNode;
}

function HeroMediaFrameRoot({ className, children }: HeroMediaFrameProps) {
  return (
    <div data-component="bbf-hero-media-frame" className={cn(heroMediaFrameVariants(), className)}>
      {children}
    </div>
  );
}
HeroMediaFrameRoot.displayName = 'HeroMediaFrame';

/* ============================================================
   CHROME (sub-component — top bar with label + REC indicator)
   ============================================================ */
interface HeroMediaFrameChromeProps {
  /** Decorative label. Default: "// brand-brain.foundry · live feed" */
  label?: string;
  /** Show REC indicator with pulse dot. Default: false */
  recording?: boolean;
  /** Fallback REC display when no children provided. Default: "00:42" */
  recDuration?: string;
  /** Slot for HeroRecTimer Client leaf (replaces recDuration when provided). */
  children?: ReactNode;
  className?: string;
}

function HeroMediaFrameChrome({
  label = '// brand-brain.foundry · live feed',
  recording = false,
  recDuration = '00:42',
  children,
  className,
}: HeroMediaFrameChromeProps) {
  return (
    <div
      data-component="bbf-hero-media-frame-chrome"
      className={cn('bbf-hero-media-frame__chrome', className)}
    >
      <span>{label}</span>
      {recording && (
        <span className="bbf-hero-media-frame__rec" aria-hidden="true">
          <span className="bbf-hero-media-frame__rec-dot" />
          REC&nbsp;{children ?? recDuration}
        </span>
      )}
    </div>
  );
}
HeroMediaFrameChrome.displayName = 'HeroMediaFrame.Chrome';

/* ============================================================
   VIDEO SHELL (sub-component — 16:9 container for HeroVideo)
   ============================================================ */
interface HeroMediaFrameVideoShellProps {
  className?: string;
  children: ReactNode;
}

function HeroMediaFrameVideoShell({ className, children }: HeroMediaFrameVideoShellProps) {
  return (
    <div
      data-component="bbf-hero-media-frame-video-shell"
      className={cn('bbf-hero-media-frame__video-shell', className)}
    >
      {children}
    </div>
  );
}
HeroMediaFrameVideoShell.displayName = 'HeroMediaFrame.VideoShell';

/* ============================================================
   FOOT (sub-component — bottom caption bar)
   ============================================================ */
interface HeroMediaFrameFootProps {
  className?: string;
  children: ReactNode;
}

function HeroMediaFrameFoot({ className, children }: HeroMediaFrameFootProps) {
  return (
    <div
      data-component="bbf-hero-media-frame-foot"
      className={cn('bbf-hero-media-frame__foot', className)}
    >
      {children}
    </div>
  );
}
HeroMediaFrameFoot.displayName = 'HeroMediaFrame.Foot';

/* ============================================================
   COMPOUND EXPORT (D-86 compound pattern)
   ============================================================ */
export const HeroMediaFrame = Object.assign(HeroMediaFrameRoot, {
  Chrome: HeroMediaFrameChrome,
  VideoShell: HeroMediaFrameVideoShell,
  Foot: HeroMediaFrameFoot,
});
