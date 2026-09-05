/**
 * BBF Brand Gradient — Barrel Exports (D-SBWEB-BLOB-BRAND-01)
 *
 * Single entry point del motor WebGL2 de fondo animado de marca.
 * Use desde el atom: `import { createBrandGradientEngine } from '@/lib/brand-gradient';`
 */

export { createBrandGradientEngine, type BrandGradientEngine } from './engine';
export { BRAND_GRADIENT_DEFAULTS, type BrandGradientConfig } from './config';
export { BRAND_TOKENS, type BrandToken } from './tokens';
