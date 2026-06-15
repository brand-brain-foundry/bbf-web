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
  /** Si se provee, usa este variant en lugar del admin logoVariant.
   *  Footer lo necesita para forzar horizontal (icon+name).
   *  Header no lo usa → comportamiento actual intacto. */
  variantOverride?: 'icon' | 'horizontal' | 'stamp' | 'name-only';
  /** Nombre del sitio; solo relevante con variant horizontal o name-only. */
  name?: string;
}

export async function BrandLogoLink({
  locale,
  ariaLabel,
  className,
  variantOverride,
  name,
}: BrandLogoLinkProps) {
  const bs = await getBrandSystem();
  const logoVariant = variantOverride ?? bs.logoVariant;
  const homeHref = getPathname({ locale, href: '/' });

  return (
    <Link
      href={homeHref}
      aria-label={ariaLabel}
      data-component="bbf-brand-logo-link"
      className={cn(
        'inline-flex shrink-0 items-center',
        'text-[var(--bbf-on-surface-title)]',
        '[transition:color_var(--bbf-motion-state-duration-logo)_var(--bbf-motion-state-easing)]',
        '[@media(hover:hover)]:hover:text-transparent',
        className,
      )}
    >
      <BrandLogo variant={logoVariant} name={name} size="sm" aria-hidden />
    </Link>
  );
}
