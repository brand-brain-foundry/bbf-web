/**
 * getBrandSystem — D-DS-01 consumer helper
 *
 * Lee BrandSystem global via Payload Local API (no network, ISR-safe).
 * Devuelve selectores de alto nivel; los valores CSS viven en tokens de código.
 *
 * Pattern: análogo a getSiteIdentity() en lib/data/site-identity.ts.
 *
 * Uso:
 *   const bs = await getBrandSystem();
 *   // bs.primaryPalette → 'blue' (data-palette attribute → CSS cascade)
 *   // bs.logoVariant    → 'horizontal' (BrandLogo variant prop)
 *   // bs.accentGradient → 'blue-animated' (className en gradient consumers)
 *   // bs.gradientClass  → 'bbf-gradient-blue-animated' (convenience)
 *
 * Contract D-DS-01↔D-DS-08:
 *   bs.logoVariant es el tipo exacto de BrandLogoVariant.
 *   Pásalo directamente como variant prop de <BrandLogo>.
 */
import { getPayload } from 'payload';
import config from '@/payload-config';

export type PrimaryPalette = 'red' | 'blue';
export type ThemeMode = 'light' | 'dark' | 'auto';
export type DisplayFamily = 'inter' | 'custom';
export type BodyFamily = 'mulish' | 'custom';
export type LogoVariant = 'icon' | 'horizontal' | 'name-only' | 'stamp';
export type AccentGradient = 'red-animated' | 'blue-animated' | 'none';

export interface BrandSystemSelections {
  primaryPalette: PrimaryPalette;
  themeMode: ThemeMode;
  displayFamily: DisplayFamily;
  bodyFamily: BodyFamily;
  logoVariant: LogoVariant;
  accentGradient: AccentGradient;
  /** Convenience: className CSS correspondiente al accentGradient selector. */
  gradientClass: string;
}

const GRADIENT_CLASS_MAP: Record<AccentGradient, string> = {
  'red-animated': 'bbf-gradient-red-animated',
  'blue-animated': 'bbf-gradient-blue-animated',
  none: '',
};

export async function getBrandSystem(): Promise<BrandSystemSelections> {
  const payload = await getPayload({ config });
  const data = await payload.findGlobal({ slug: 'brandSystem' });

  const primaryPalette: PrimaryPalette = data.colors?.primaryPalette ?? 'blue';
  const themeMode: ThemeMode = data.colors?.themeMode ?? 'light';
  const displayFamily: DisplayFamily = data.typography?.displayFamily ?? 'inter';
  const bodyFamily: BodyFamily = data.typography?.bodyFamily ?? 'mulish';
  const logoVariant: LogoVariant = data.brand?.logoVariant ?? 'horizontal';
  const accentGradient: AccentGradient = data.brand?.accentGradient ?? 'blue-animated';

  return {
    primaryPalette,
    themeMode,
    displayFamily,
    bodyFamily,
    logoVariant,
    accentGradient,
    gradientClass: GRADIENT_CLASS_MAP[accentGradient],
  };
}
