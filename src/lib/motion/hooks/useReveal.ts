/**
 * BBF useReveal — Wave 11.8-E
 *
 * Hook canon BBF para scroll-triggered reveals.
 * Wraps Framer Motion useInView con defaults BBF.
 *
 * Usage:
 *   const { ref, isVisible } = useReveal();
 *   <motion.div ref={ref} animate={isVisible ? 'visible' : 'hidden'} />
 *
 * Or via <Reveal> atom (preferred — T2).
 *
 * Refs: R-BBF-15 §2.3, BBF_MotionArchitectureProposal_v1 §5 Pattern 1
 */

import { useRef } from 'react';
import { useInView } from 'motion/react';

type InViewOptions = NonNullable<Parameters<typeof useInView>[1]>;

export interface UseRevealOptions {
  /** Triggers once (default) or re-triggers each time element enters viewport */
  once?: boolean;
  /** Viewport margin — negative value triggers before edge of viewport */
  margin?: InViewOptions['margin'];
  /** Fraction of element visible before triggering (0–1, 'some', 'all') */
  amount?: InViewOptions['amount'];
}

export function useReveal(options: UseRevealOptions = {}) {
  const ref = useRef(null);
  const isVisible = useInView(ref, {
    once: options.once ?? true,
    margin: options.margin ?? '0px 0px -80px 0px',
    amount: options.amount ?? 'some',
  });

  return { ref, isVisible };
}
