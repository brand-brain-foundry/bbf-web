'use client';

/**
 * BBF Reveal Atom — Wave 11.8-E
 *
 * Wrapper canon para scroll-triggered reveals. Integra useReveal hook
 * con Framer Motion variants y polymorphic tag support.
 *
 * Usage:
 *   <Reveal>Content</Reveal>                    // default 'up'
 *   <Reveal variant="fade" delay={100}>...</Reveal>
 *   <Reveal staggerChildren variant="up">
 *     <Card />  <Card />  <Card />             // each child staggers
 *   </Reveal>
 *
 * Accessibility: prefers-reduced-motion → instant visibility (no animation).
 *
 * Refs: R-BBF-15 §2.3, BBF_MotionArchitectureProposal_v1 §5 Pattern 1
 */

import { Children } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { useReveal } from '@/lib/motion/hooks';
import type { RevealProps } from './types';

const VARIANTS: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  up: {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -32 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
};

const STAGGER_PARENT: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration,
  once = true,
  margin,
  amount,
  staggerChildren = false,
  staggerDelay = 60,
  as = 'div',
  ...rest
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const { ref, isVisible } = useReveal({ once, margin, amount });

  const Component = motion[as] as typeof motion.div;

  if (prefersReducedMotion) {
    return (
      <Component ref={ref} {...rest}>
        {children}
      </Component>
    );
  }

  const activeVariants = staggerChildren ? STAGGER_PARENT : VARIANTS[variant];

  return (
    <Component
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={activeVariants}
      transition={{
        duration: (duration ?? 540) / 1000,
        ease: [0.22, 1, 0.36, 1], // --bbf-motion-ease-out-expo
        delay: delay / 1000,
        ...(staggerChildren ? { staggerChildren: staggerDelay / 1000 } : {}),
      }}
      {...rest}
    >
      {staggerChildren
        ? Children.map(children, (child) => (
            <motion.div variants={VARIANTS[variant]}>{child}</motion.div>
          ))
        : children}
    </Component>
  );
}
