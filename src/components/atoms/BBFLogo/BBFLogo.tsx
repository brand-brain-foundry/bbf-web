/**
 * BBF Design System — BBFLogo atom
 *
 * Subordinado a: B-BBF-WEB-M5-D1.5-LOGO-SYSTEM-V2
 * Decisiones: D-77, D-78, D-82, D-84
 *
 * Server Component que carga e inyecta SVGs inline.
 *
 * Variantes canon:
 *   icon       → solo flor 8-petal
 *   horizontal → icon + nombre horizontal a derecha
 *   name-only  → solo nombre horizontal
 *   stamp      → icon centro + nombre circular alrededor (animable)
 *
 * PRESERVACIÓN CRÍTICA:
 *   - Server Component (fs.readFileSync)
 *   - dangerouslySetInnerHTML pattern
 *   - IDs SVG preservados (#BBF-Logo-Name-Circle para animación)
 *
 * Color: heredado via CSS currentColor (surface-aware).
 * Tamaño: via variant size o size prop explícito.
 */

import fs from 'node:fs';
import path from 'node:path';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { bbfLogoVariants, type BBFLogoVariants } from './BBFLogo.variants';

const LOGO_DIR = path.join(process.cwd(), 'public', 'assets', 'brand', 'logos');
const LOGO_FILES = {
  icon: 'BBF-Logo-Icon.svg',
  nameH: 'BBF-Logo-Name-H.svg',
  nameCircle: 'BBF-Logo-Name-Circle.svg',
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

export interface BBFLogoProps extends Omit<BBFLogoVariants, 'size'> {
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
   * ARIA label custom. Default: "Brand Brain Foundry"
   */
  ariaLabel?: string;
}

/**
 * BBF Logo atom — Atomic Design canon
 *
 * @description
 * Brand Brain Foundry logo system con 4 variantes compositional.
 * Atom NO conoce color (hereda via CSS surface).
 * Atom SÍ conoce tamaño y variante.
 *
 * @example Default (icon variant, md size)
 * ```tsx
 * <BBFLogo />
 * ```
 *
 * @example Hero stamp animado (uso actual)
 * ```tsx
 * <BBFLogo variant="stamp" size="hero" animated />
 * ```
 *
 * @example Header horizontal
 * ```tsx
 * <BBFLogo variant="horizontal" size="md" />
 * ```
 *
 * @example Footer minimal (solo nombre)
 * ```tsx
 * <BBFLogo variant="name-only" size="sm" />
 * ```
 *
 * @example Custom size (override variant)
 * ```tsx
 * <BBFLogo variant="icon" size="3rem" />
 * <BBFLogo variant="icon" size={48} />
 * ```
 */
export function BBFLogo({
  variant = 'icon',
  size,
  animated = false,
  className,
  ariaLabel = 'Brand Brain Foundry',
}: BBFLogoProps) {
  // Determinar variant size predefinida vs custom
  const isVariantSize = typeof size === 'string' && (VARIANT_SIZES as string[]).includes(size);
  const variantSize = isVariantSize ? (size as VariantSizeName) : undefined;

  // Calcular dimensión CSS para override custom
  let customSizeStyle: CSSProperties | undefined;
  if (!isVariantSize && size !== undefined) {
    const cssSize = typeof size === 'number' ? `${size}px` : size;
    customSizeStyle = { '--bbf-logo-rendered': cssSize } as CSSProperties;
  }

  // Cargar SVGs según variant
  let svgContent = '';

  if (variant === 'icon') {
    svgContent = enrichSvg(loadSvg(LOGO_FILES.icon), 'bbf-logo-icon', ariaLabel);
  } else if (variant === 'horizontal') {
    svgContent =
      enrichSvg(loadSvg(LOGO_FILES.icon), 'bbf-logo-icon') +
      enrichSvg(loadSvg(LOGO_FILES.nameH), 'bbf-logo-name-h', ariaLabel);
  } else if (variant === 'name-only') {
    svgContent = enrichSvg(loadSvg(LOGO_FILES.nameH), 'bbf-logo-name-h', ariaLabel);
  } else if (variant === 'stamp') {
    svgContent =
      enrichSvg(loadSvg(LOGO_FILES.nameCircle), 'bbf-logo-name-circle') +
      enrichSvg(loadSvg(LOGO_FILES.icon), 'bbf-logo-icon');
  }

  return (
    <div
      data-component="bbf-logo"
      data-variant={variant}
      data-animated={animated || undefined}
      className={cn(bbfLogoVariants({ variant, size: variantSize }), className)}
      style={customSizeStyle}
      // SVG injected inline: Server Component pattern preserving animation IDs
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
