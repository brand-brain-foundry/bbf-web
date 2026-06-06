import type { ElementType, HTMLAttributes } from 'react';
import { interpolate } from '@/lib/content-interpolation';

interface InterpolatedProps extends HTMLAttributes<HTMLElement> {
  children: string | null | undefined;
  locale?: 'es' | 'en';
  as?: ElementType;
}

/**
 * Interpolated — Server Component que renderiza texto Payload con
 * placeholders {{var}} sustituidos por valores de SiteIdentity.
 *
 * @example
 * ```tsx
 * <Heading level="display-hero">
 *   <Interpolated locale={locale}>{hero.h1Line1}</Interpolated>
 * </Heading>
 * ```
 *
 * @example Inline span (default)
 * ```tsx
 * <Interpolated locale={locale}>{section.tagline}</Interpolated>
 * ```
 *
 * @example Block div
 * ```tsx
 * <Interpolated as="p" locale={locale} className="lede">
 *   {section.lede}
 * </Interpolated>
 * ```
 */
export async function Interpolated({
  children,
  locale = 'es',
  as: Tag = 'span',
  ...props
}: InterpolatedProps) {
  const text = await interpolate(children, locale);
  if (!text) return null;
  return <Tag {...props}>{text}</Tag>;
}
