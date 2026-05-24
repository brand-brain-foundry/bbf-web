'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  megaMenuPanelVariants,
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
  subLinks: SubLink[];
  localePrefix: string;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

/**
 * BBF MegaMenuPanel desktop — Wave 8.4 research-aligned (D-BBF-KB-114)
 *
 * Grid responsive con CSS Grid auto-fit:
 *   - Solo label: minmax(200px, 1fr) → más columnas, cards estrechos
 *   - Con media: minmax(280px, 1fr) → menos columnas, cards amplios
 *
 * Cards adaptan según mediaType:
 *   - 'none': solo label + description (compact)
 *   - 'image'/'video': preview 16:9 + label + description
 *
 * Posicionado absolute desde el nav parent (hereda ancho header).
 * Microinteracciones canon: hover bg shift + image scale + label accent.
 *
 * Research: Notion compact, Adobe 3-col parallel, Stripe contained width.
 */
export function MegaMenuPanel({
  id,
  isOpen,
  subLinks,
  localePrefix,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuPanelProps) {
  const hasAnyMedia = subLinks.some(
    (s) => (s.mediaType === 'image' || s.mediaType === 'video') && s.media?.url,
  );

  const gridMinColumn = hasAnyMedia ? '280px' : '200px';

  return (
    <div
      id={id}
      role="menu"
      aria-hidden={!isOpen}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-component="bbf-mega-menu-panel"
      className={megaMenuPanelVariants({ open: isOpen })}
    >
      <div
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
              href={`${localePrefix}${sub.href}`}
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

              <p className={megaMenuTitleVariants({ hasDescription: Boolean(sub.description) })}>
                {sub.label}
              </p>

              {sub.description && (
                <p className={megaMenuDescriptionVariants()}>{sub.description}</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
