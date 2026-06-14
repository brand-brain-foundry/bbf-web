/**
 * BrandLogoLink — molecule (D-NAV-12, 2026-06-14)
 *
 * BrandLogo (atom presentacional) envuelto en Link→home locale-aware.
 * Cierra D-DS-01↔D-DS-08: logoVariant del BrandSystem global controla
 * qué variante del átomo se renderiza. Cero hardcode.
 *
 * Server Component — fetches getBrandSystem() internamente (Payload Local API,
 * sin network, Next.js deduplica la instancia de getPayload() a nivel request).
 *
 * Decisiones: D-NAV-12 (molécula BrandLogoLink), D-DS-01 (BrandSystem SSOT),
 *             D-DS-08 (BrandLogo atom canon), D-NAV-7 (localePrefix as-needed)
 */

import Link from 'next/link';
import { getPathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getBrandSystem } from '@/lib/brand/getBrandSystem';
import { BrandLogo } from '@/components/atoms/BrandLogo';
import { cn } from '@/lib/utils';

export interface BrandLogoLinkProps {
  locale: Locale;
  /** Aria label completo: e.g. "Sivar Brains — Ir al inicio" */
  ariaLabel: string;
  className?: string;
}

export async function BrandLogoLink({ locale, ariaLabel, className }: BrandLogoLinkProps) {
  const bs = await getBrandSystem();
  const homeHref = getPathname({ locale, href: '/' });

  return (
    <Link
      href={homeHref}
      aria-label={ariaLabel}
      data-component="bbf-brand-logo-link"
      className={cn(
        'inline-flex shrink-0 items-center',
        'text-[var(--bbf-text-on-sand)]',
        'transition-all duration-200 ease-out',
        '[@media(hover:hover)]:hover:text-[var(--bbf-accent-blue)]',
        'focus-visible:text-[var(--bbf-accent-blue)] focus-visible:outline-none',
        className,
      )}
    >
      <BrandLogo variant={bs.logoVariant} size="sm" aria-hidden />
    </Link>
  );
}
