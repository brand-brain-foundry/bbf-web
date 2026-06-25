'use client';
/**
 * ChatSequence — D-99 Client leaf for sequential chat bubble animation.
 * Server Component (CapabilityScene) renders markup; this leaf drives behavior.
 *
 * Behavior:
 *   - IntersectionObserver triggers sequence when scene enters viewport (threshold 0.3)
 *   - Resets on exit → re-animates on re-entry
 *   - Loop: stagger per bubble → pause after last → reset → repeat
 *   - Timings read via getComputedStyle from Tier-3 CSS tokens (single source of truth)
 *   - prefers-reduced-motion: bubbles stay visible, no animation (CSS handles)
 */
import { useEffect, useRef, type ReactNode } from 'react';

interface ChatSequenceProps {
  children: ReactNode;
  msgCount: number;
}

export function ChatSequence({ children, msgCount }: ChatSequenceProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Read timings from CSS tokens — getComputedStyle is the single source of truth
    const style = getComputedStyle(el);
    const parseMs = (v: string): number => {
      const trimmed = v.trim();
      if (!trimmed) return 0;
      return trimmed.endsWith('ms') ? parseFloat(trimmed) : parseFloat(trimmed) * 1000;
    };
    const STAGGER = parseMs(style.getPropertyValue('--bbf-chat-msg-stagger')) || 600;
    const APPEAR = parseMs(style.getPropertyValue('--bbf-chat-msg-appear-duration')) || 400;
    const PAUSE = parseMs(style.getPropertyValue('--bbf-chat-msg-pause')) || 2400;
    // Full cycle: last bubble finishes at (N-1)×STAGGER + APPEAR, then pause
    const CYCLE = (msgCount - 1) * STAGGER + APPEAR + PAUSE;

    let timer: ReturnType<typeof setTimeout>;

    const reset = () => {
      el.dataset.seqActive = 'false';
    };

    const run = () => {
      const msgs = el.querySelectorAll<HTMLElement>('.bbf-cap-chat__msg');
      msgs.forEach((msg, i) => {
        msg.style.animationDelay = `${i * STAGGER}ms`;
      });
      el.dataset.seqActive = 'true';
      timer = setTimeout(() => {
        reset();
        timer = setTimeout(run, 100); // brief gap before restart
      }, CYCLE);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
        } else {
          clearTimeout(timer);
          reset();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [msgCount]);

  return (
    <div ref={ref} className="bbf-cap-scene__body bbf-cap-chat__messages">
      {children}
    </div>
  );
}
