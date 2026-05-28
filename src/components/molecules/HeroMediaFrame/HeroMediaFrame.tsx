'use client';

/**
 * BBF Design System — HeroMediaFrame molecule
 *
 * Despacho: B-BBF-WEB-HERO-HOME-CONSTRUCTION (FASE 5 + T6.7 Q3-Op-A)
 * Decisiones: D-86 (compound API), D-82 (AI-readable), D-FASE2-06 (NEW molecule)
 *
 * Client Component (T6.7 Q3-Op-A): useVideoTime hook + Context para REC timer sync.
 * Context interno (no exportado) conecta Root → Chrome (recTime) y VideoShell (videoRef).
 *
 * <HeroMediaFrame>
 *   <HeroMediaFrame.Chrome label="// brand-brain.foundry · live feed" recording />
 *   <HeroMediaFrame.VideoShell><HeroVideo controls ... /></HeroMediaFrame.VideoShell>
 *   <HeroMediaFrame.Foot><Text variant="caption">...</Text></HeroMediaFrame.Foot>
 * </HeroMediaFrame>
 */

import {
  useRef,
  useState,
  useContext,
  createContext,
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
  type RefObject,
} from 'react';
import { cn } from '@/lib/utils';
import { heroMediaFrameVariants } from './HeroMediaFrame.variants';

/* ============================================================
   INTERNAL VIDEO TIMER CONTEXT (not exported — encapsulated)
   ============================================================ */
interface HeroVideoTimerContextValue {
  videoRef: RefObject<HTMLVideoElement | null>;
  onTimeUpdate: () => void;
  onPlayingChange: (playing: boolean) => void;
  recTime: string;
}

const HeroVideoTimerContext = createContext<HeroVideoTimerContextValue | null>(null);

function formatRecTime(seconds: number): string {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mm}:${ss}`;
}

/* ============================================================
   ROOT
   ============================================================ */
interface HeroMediaFrameProps {
  className?: string;
  children: ReactNode;
}

function HeroMediaFrameRoot({ className, children }: HeroMediaFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const onTimeUpdate = () => {
    setCurrentTime(videoRef.current?.currentTime ?? 0);
  };

  /* Q-PAUSE Op-A: pause → freeze timer (natural — onTimeUpdate stops firing).
   * Ended → reset to 00:00. */
  const onPlayingChange = (playing: boolean) => {
    if (!playing && videoRef.current?.ended) {
      setCurrentTime(0);
    }
  };

  return (
    <HeroVideoTimerContext.Provider
      value={{ videoRef, onTimeUpdate, onPlayingChange, recTime: formatRecTime(currentTime) }}
    >
      <div
        data-component="bbf-hero-media-frame"
        className={cn(heroMediaFrameVariants(), className)}
      >
        {children}
      </div>
    </HeroVideoTimerContext.Provider>
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
  /** Fallback REC display when not inside HeroMediaFrame root. Default: "00:42" */
  recDuration?: string;
  className?: string;
}

function HeroMediaFrameChrome({
  label = '// brand-brain.foundry · live feed',
  recording = false,
  recDuration = '00:42',
  className,
}: HeroMediaFrameChromeProps) {
  const ctx = useContext(HeroVideoTimerContext);
  const displayTime = ctx ? ctx.recTime : recDuration;

  return (
    <div
      data-component="bbf-hero-media-frame-chrome"
      className={cn('bbf-hero-media-frame__chrome', className)}
    >
      <span>{label}</span>
      {recording && (
        <span className="bbf-hero-media-frame__rec" aria-hidden="true">
          <span className="bbf-hero-media-frame__rec-dot" />
          REC&nbsp;{displayTime}
        </span>
      )}
    </div>
  );
}
HeroMediaFrameChrome.displayName = 'HeroMediaFrame.Chrome';

/* ============================================================
   VIDEO SHELL (sub-component — 16:9 container for HeroVideo)
   Injects videoRef + handlers into HeroVideo child via cloneElement.
   ============================================================ */
interface HeroMediaFrameVideoShellProps {
  className?: string;
  children: ReactNode;
}

function HeroMediaFrameVideoShell({ className, children }: HeroMediaFrameVideoShellProps) {
  const ctx = useContext(HeroVideoTimerContext);

  const enhancedChildren = ctx
    ? Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        return cloneElement(child as React.ReactElement<Record<string, unknown>>, {
          ref: ctx.videoRef,
          onTimeUpdate: ctx.onTimeUpdate,
          onPlayingChange: ctx.onPlayingChange,
        });
      })
    : children;

  return (
    <div
      data-component="bbf-hero-media-frame-video-shell"
      className={cn('bbf-hero-media-frame__video-shell', className)}
    >
      {enhancedChildren}
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
