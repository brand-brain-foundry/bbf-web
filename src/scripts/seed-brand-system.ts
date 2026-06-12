/**
 * Seed BrandSystem — D-DS-01 (2026-06-12)
 *
 * Aplica selecciones canónicas actuales de BrandSystem.
 * El seed REFLEJA el estado real del diseño (no lo cambia).
 *
 * Selecciones canónicas:
 *   primaryPalette: 'blue'     — Phase 3 rebrand Sivar Brains (FASE 3 SiteConfig)
 *   themeMode:      'light'    — default BBF web
 *   displayFamily:  'inter'    — Inter font canon (D-72..74)
 *   bodyFamily:     'mulish'   — Mulish font canon
 *   logoVariant:    'horizontal' — forma canónica del logo (D-DS-01 proposal §B)
 *   accentGradient: 'blue-animated' — rebrand blue (D-DS-05 bbf-gradient-blue-animated)
 *
 * Requires: pnpm payload migrate aplicado
 *
 * Usage:
 *   pnpm tsx src/scripts/seed-brand-system.ts
 */

import { getPayload } from 'payload';
import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  // vars expected from shell environment
}

async function seedBrandSystem() {
  const payload = await getPayload({ config });

  console.log('[seed-brand-system] Iniciando seed D-DS-01...');

  await payload.updateGlobal({
    slug: 'brandSystem',
    data: {
      colors: {
        primaryPalette: 'blue',
        themeMode: 'light',
      },
      typography: {
        displayFamily: 'inter',
        bodyFamily: 'mulish',
      },
      brand: {
        logoVariant: 'horizontal',
        accentGradient: 'blue-animated',
      },
    },
  });

  console.log('[seed-brand-system] ✅ BrandSystem seeded con selecciones canónicas.');
  console.log('  primaryPalette:  blue');
  console.log('  themeMode:       light');
  console.log('  displayFamily:   inter');
  console.log('  bodyFamily:      mulish');
  console.log('  logoVariant:     horizontal');
  console.log('  accentGradient:  blue-animated');

  process.exit(0);
}

seedBrandSystem().catch((err) => {
  console.error('[seed-brand-system] ❌ Error:', err);
  process.exit(1);
});
