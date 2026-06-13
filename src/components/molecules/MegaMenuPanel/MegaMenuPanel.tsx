'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  megaMenuItemVariants,
  megaMenuTitleVariants,
  megaMenuDescriptionVariants,
} from './MegaMenuPanel.variants';

type SubLinkMedia = {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
  mimeType?: string;
};

type SubLink = {
  label: string;
  href: string;
  description?: string | null;
  mediaType: 'none' | 'image' | 'video';
  media?: SubLinkMedia | null;
};

type MegaMenuPanelProps = {
  id: string;
  isOpen: boolean;
  /** Drives content cross-fade key — use String(openIndex) from consumer. */
  activeKey: string;
  subLinks: SubLink[];
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

/**
 * BBF MegaMenuPanel desktop — Wave 11.8-C2 Stripe morphing pattern
 *
 * Single persistent container that morphs between panel content (Stripe 2026 canon).
 * Grid responsive CSS Grid auto-fit (Wave 8.4 research-aligned, D-BBF-KB-114):
 *   - Solo label: minmax(200px, 1fr)
 *   - Con media: minmax(280px, 1fr)
 *
 * Animation stack:
 *   - Outer AnimatePresence: container show/hide (opacity + y)
 *   - layout: container height morphs between panel sizes
 *   - Inner AnimatePresence mode="wait": content cross-fades with direction-aware slide
 *   - useReducedMotion: instant transitions when OS reduces motion
 *
 * Refs: R-BBF-15 §2.2, BBF_MotionArchitectureProposal_v1 §5 Pattern 3, D-BBF-WEB-PP:A
 */
export function MegaMenuPanel({
  id,
  isOpen,
  activeKey,
  subLinks,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuPanelProps) {
  const prefersReducedMotion = useReducedMotion();

  const hasAnyMedia = subLinks.some(
    (s) => (s.mediaType === 'image' || s.mediaType === 'video') && s.media?.url,
  );
  const gridMinColumn = hasAnyMedia ? '280px' : '200px';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="megamenu-morph"
          id={id}
          role="menu"
          aria-hidden={!isOpen}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          data-component="bbf-mega-menu-panel"
          layout={!prefersReducedMotion}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{
            duration: prefersReducedMotion ? 0.01 : 0.24,
            ease: [0.25, 1, 0.5, 1], // --bbf-motion-ease-out-quart
            layout: { duration: prefersReducedMotion ? 0.01 : 0.24, ease: [0.25, 1, 0.5, 1] },
          }}
          className={cn(
            'absolute top-[calc(100%+0.5rem)] right-0 left-0',
            'z-[var(--bbf-z-mega-menu)]',
            'rounded-2xl',
            'bg-[var(--bbf-surface-sand)]',
            '[border:1px_solid_var(--bbf-border-on-sand)]',
            '[box-shadow:var(--bbf-shadow-floating)]',
            'overflow-hidden',
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeKey}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : 0.18,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="grid gap-3 p-4 lg:gap-4 lg:p-6"
              style={{
                gridTemplateColumns: `repeat(auto-fit, minmax(${gridMinColumn}, 1fr))`,
              }}
            >
              {subLinks.map((sub, idx) => {
                const hasMedia =
                  (sub.mediaType === 'image' || sub.mediaType === 'video') && sub.media?.url;

                return (
                  <Link
                    key={`${sub.href}-${idx}`}
                    href={sub.href}
                    onClick={onClose}
                    role="menuitem"
                    tabIndex={isOpen ? 0 : -1}
                    className={megaMenuItemVariants()}
                  >
                    {hasMedia && sub.mediaType === 'image' && (
                      <div className="mb-3 aspect-[16/9] overflow-hidden rounded-lg bg-[var(--bbf-surface-hover-on-sand)]">
                        <Image
                          src={sub.media!.url!}
                          alt={sub.media!.alt ?? sub.label}
                          width={sub.media!.width ?? 320}
                          height={sub.media!.height ?? 180}
                          className="h-full w-full object-cover transition-transform duration-300 ease-out [@media(hover:hover)]:group-hover:scale-105"
                        />
                      </div>
                    )}
                    {hasMedia && sub.mediaType === 'video' && (
                      <div className="mb-3 aspect-[16/9] overflow-hidden rounded-lg bg-[var(--bbf-surface-hover-on-sand)]">
                        <video
                          src={sub.media!.url!}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <p
                      className={megaMenuTitleVariants({
                        hasDescription: Boolean(sub.description),
                      })}
                    >
                      {sub.label}
                    </p>

                    {sub.description && (
                      <p className={megaMenuDescriptionVariants()}>{sub.description}</p>
                    )}
                  </Link>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
