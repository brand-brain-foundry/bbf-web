/**
 * BrandLogo — atom genérico (D-DS-08, 2026-06-12)
 *
 * Rename BBFLogo → BrandLogo (agnóstico, sin acoplamiento a nombre de marca).
 * Subordinado a: B-BBF-WEB-M5-D1.5-LOGO-SYSTEM-V2
 * Decisiones: D-77, D-78, D-82, D-84, D-99, D-DS-08
 *
 * Server Component que carga e inyecta SVGs inline.
 *
 * Variantes canon:
 *   icon       → solo flor 8-petal
 *   horizontal → icon + nombre horizontal a derecha
 *   name-only  → solo nombre horizontal
 *   stamp      → icon centro + nombre circular alrededor (animable)
 *
 * ASSET NAMING CONTRACT (D-DS-08 / AssetGenerationCanon §3):
 *   Final naming: sb-logo-icon.svg | sb-logo-horizontal.svg | sb-logo-name.svg | sb-logo-stamp.svg
 *   Drop-in cuando Zavala/diseño entregue los 7 SVG finales.
 *   Actualmente apunta a los assets BBF-Logo-*.svg existentes.
 *
 * PRESERVACIÓN CRÍTICA:
 *   - Server Component (fs.readFileSync)
 *   - dangerouslySetInnerHTML pattern
 *   - IDs SVG preservados (#BBF-Logo-Name-Circle para animación WAAPI)
 *
 * Color: heredado via CSS currentColor (surface-aware).
 * Tamaño: via variant size o size prop explícito.
 * logoVariant canonical: getBrandSystem().logoVariant → esta prop (D-DS-01↔08 circle).
 */

import fs from 'node:fs';
import path from 'node:path';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { brandLogoVariants, type BrandLogoVariants } from './BrandLogo.variants';

const LOGO_DIR = path.join(process.cwd(), 'public', 'assets', 'brand', 'logos');

// ASSET NAMING CONTRACT (D-DS-08):
//   Canon final: sb-logo-icon | sb-logo-horizontal | sb-logo-name | sb-logo-stamp
//   Drop-in cuando lleguen los SVG finales con sb-logo-* naming.
const LOGO_FILES = {
  icon: 'BBF-Logo-Icon.svg', // → sb-logo-icon.svg (pending design)
  nameH: 'BBF-Logo-Name-H.svg', // → sb-logo-name.svg (pending design)
  nameCircle: 'BBF-Logo-Name-Circle.svg', // → sb-logo-stamp.svg (pending design)
} as const;

function loadSvg(filename: string): string {
  return fs.readFileSync(path.join(LOGO_DIR, filename), 'utf-8');
}

function enrichSvg(svg: string, additionalClass: string, ariaLabel?: string): string {
  return svg.replace(
    /<svg\s/i,
    `<svg class="${additionalClass}" ${
      ariaLabel ? `aria-label="${ariaLabel}" role="img"` : 'aria-hidden="true"'
    } `,
  );
}

type VariantSizeName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
const VARIANT_SIZES: VariantSizeName[] = ['xs', 'sm', 'md', 'lg', 'xl', 'hero'];

export interface BrandLogoProps extends Omit<BrandLogoVariants, 'size'> {
  /**
   * Tamaño: variant name (xs/sm/md/lg/xl/hero), number (px), o string CSS.
   */
  size?: number | string;
  /**
   * Para variant="stamp": activa animación de rotación.
   */
  animated?: boolean;
  className?: string;
  /**
   * ARIA label custom. Default: nombre de la marca.
   */
  ariaLabel?: string;
  /**
   * Nombre dinámico (fuente de verdad: SiteIdentity).
   * Cuando se provee en variant="horizontal" o "name-only",
   * renderiza texto HTML en vez del wordmark SVG — garantiza
   * que el nombre mostrado siempre viene de getSiteIdentity().
   */
  name?: string;
}

/**
 * BrandLogo — atom genérico agnóstico (D-DS-08)
 *
 * @example Default (icon variant, md size)
 * ```tsx
 * <BrandLogo />
 * ```
 *
 * @example Hero stamp animado (uso actual)
 * ```tsx
 * <BrandLogo variant="stamp" size="hero" animated />
 * ```
 *
 * @example Header horizontal
 * ```tsx
 * <BrandLogo variant="horizontal" size="md" />
 * ```
 *
 * @example Con variante canónica de BrandSystem (D-DS-01↔08 circle)
 * ```tsx
 * const bs = await getBrandSystem();
 * <BrandLogo variant={bs.logoVariant} size="md" />
 * ```
 */
export function BrandLogo({
  variant = 'icon',
  size,
  animated = false,
  className,
  ariaLabel,
  name,
}: BrandLogoProps) {
  const isVariantSize = typeof size === 'string' && (VARIANT_SIZES as string[]).includes(size);
  const variantSize = isVariantSize ? (size as VariantSizeName) : undefined;

  let customSizeStyle: CSSProperties | undefined;
  if (!isVariantSize && size !== undefined) {
    const cssSize = typeof size === 'number' ? `${size}px` : size;
    customSizeStyle = { '--bbf-logo-rendered': cssSize } as CSSProperties;
  }

  // Mixed render (name prop): icon SVG + texto dinámico desde SiteIdentity.
  if (name && (variant === 'horizontal' || variant === 'name-only')) {
    const resolvedLabel = ariaLabel ?? name;
    const iconHtml =
      variant === 'horizontal' ? enrichSvg(loadSvg(LOGO_FILES.icon), 'bbf-logo-icon') : null;

    return (
      <div
        data-component="brand-logo"
        data-variant={variant}
        className={cn(brandLogoVariants({ variant, size: variantSize }), className)}
        style={customSizeStyle}
        role="img"
        aria-label={resolvedLabel}
      >
        {iconHtml && (
          <span className="contents" aria-hidden dangerouslySetInnerHTML={{ __html: iconHtml }} />
        )}
        <span className="bbf-logo-name-text">{name}</span>
      </div>
    );
  }

  // SVG-only render (default: wordmark vectorial o stamp animado)
  // Fallback agnóstico (D-DS-08): mismo default que usa Header vía getSiteIdentity().
  const resolvedLabel = ariaLabel ?? 'Sivar Brains';
  let svgContent = '';

  if (variant === 'icon') {
    svgContent = enrichSvg(loadSvg(LOGO_FILES.icon), 'bbf-logo-icon', resolvedLabel);
  } else if (variant === 'horizontal') {
    svgContent =
      enrichSvg(loadSvg(LOGO_FILES.icon), 'bbf-logo-icon') +
      enrichSvg(loadSvg(LOGO_FILES.nameH), 'bbf-logo-name-h', resolvedLabel);
  } else if (variant === 'name-only') {
    svgContent = enrichSvg(loadSvg(LOGO_FILES.nameH), 'bbf-logo-name-h', resolvedLabel);
  } else if (variant === 'stamp') {
    svgContent =
      enrichSvg(loadSvg(LOGO_FILES.nameCircle), 'bbf-logo-name-circle') +
      enrichSvg(loadSvg(LOGO_FILES.icon), 'bbf-logo-icon');
  }

  return (
    <div
      data-component="brand-logo"
      data-variant={variant}
      data-animated={animated || undefined}
      className={cn(brandLogoVariants({ variant, size: variantSize }), className)}
      style={customSizeStyle}
      role={variant === 'stamp' ? 'img' : undefined}
      aria-label={variant === 'stamp' ? resolvedLabel : undefined}
      // SVG injected inline: Server Component pattern preserving animation IDs
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
