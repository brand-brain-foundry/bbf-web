/**
 * BBF Design System — BBFLogo atom
 *
 * Subordinado a: BBF_M5_D_Plan.md §2
 *
 * PRESERVACIÓN CRÍTICA:
 * - SVG inline loading via fs.readFileSync (Server Component pattern)
 * - Animation rotation preserved (CSS canon en hero.css)
 * - dangerouslySetInnerHTML pattern preserved
 * - Tamaño hero por default via --bbf-logo-size-hero token
 */

import fs from 'node:fs';
import path from 'node:path';
import { cn } from '@/lib/utils';
import { bbfLogoVariants, type BBFLogoVariants } from './BBFLogo.variants';

type VariantSizeName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';

export interface BBFLogoProps extends Omit<BBFLogoVariants, 'size'> {
  /**
   * Tamaño explícito (CSS string / px number) o variant name.
   * Acepta: variant names (xs/sm/md/lg/xl/hero), number (px), o string CSS.
   */
  size?: number | string;
  className?: string;
  /**
   * ARIA label custom. Default: "Brand Brain Foundry"
   */
  ariaLabel?: string;
}

const VARIANT_SIZES: VariantSizeName[] = ['xs', 'sm', 'md', 'lg', 'xl', 'hero'];

/**
 * BBF Logo atom — Atomic Design canon
 *
 * @description
 * Brand Brain Foundry logo (rotating wordmark + 8-petal flower).
 * Server Component que inyecta SVG inline para acceso a #circle id
 * que es lo que rota via CSS animation canon.
 *
 * Color controlled via .bbf-logo-stamp .cls-1 selector (--bbf-logo-color).
 *
 * @example Default hero size
 * ```tsx
 * <BBFLogo />
 * ```
 *
 * @example Nav size
 * ```tsx
 * <BBFLogo size="md" />
 * ```
 *
 * @example Custom size
 * ```tsx
 * <BBFLogo size="3rem" />
 * ```
 *
 * @see {@link tokens/components/hero.css} for animation CSS
 */
export function BBFLogo({ size, className, ariaLabel = 'Brand Brain Foundry' }: BBFLogoProps) {
  const svgPath = path.join(process.cwd(), 'public', 'logos', 'BBF-Logo-Stamp.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf-8');

  const enrichedSvg = svgContent.replace(
    /<svg\s/i,
    `<svg class="bbf-logo-stamp ${className ?? ''}" aria-label="${ariaLabel}" role="img" `,
  );

  // Determinar si size es una variant predefinida
  const isVariantSize = typeof size === 'string' && (VARIANT_SIZES as string[]).includes(size);
  const variantSize = isVariantSize ? (size as VariantSizeName) : undefined;

  // Calcular dimensión CSS a aplicar en el style wrapper
  let computedSize: string;
  if (isVariantSize) {
    computedSize = 'var(--logo-rendered-size, var(--bbf-logo-size-hero))';
  } else if (typeof size === 'number') {
    computedSize = `${size}px`;
  } else if (typeof size === 'string') {
    computedSize = size;
  } else {
    computedSize = 'var(--bbf-logo-size-hero)';
  }

  return (
    <div
      data-component="bbf-logo"
      data-size={isVariantSize ? variantSize : 'custom'}
      className={cn(bbfLogoVariants({ size: variantSize }), className)}
      style={{ width: computedSize, height: computedSize }}
      // SVG injected inline to enable CSS animation access to #circle id
      dangerouslySetInnerHTML={{ __html: enrichedSvg }}
    />
  );
}
