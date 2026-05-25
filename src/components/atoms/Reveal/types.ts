/**
 * BBF Reveal Atom Types — Wave 11.8-E
 */

import type { UseRevealOptions } from '@/lib/motion/hooks';
import type { ReactNode, CSSProperties } from 'react';

export type RevealVariant = 'fade' | 'up' | 'down' | 'left' | 'right' | 'scale';

export interface RevealProps extends UseRevealOptions {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
  variant?: RevealVariant;
  /** Delay before reveal starts (ms) */
  delay?: number;
  /** Duration override (ms) — default 540ms (--bbf-motion-duration-slow) */
  duration?: number;
  /** Stagger mode: wraps each direct child in motion.div with child variants */
  staggerChildren?: boolean;
  /** Stagger delay between children (ms) — default 60ms */
  staggerDelay?: number;
  /** Polymorphic element tag */
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'aside' | 'ul' | 'ol';
}
