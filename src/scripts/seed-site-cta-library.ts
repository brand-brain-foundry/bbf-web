/**
 * Seed SiteCtaLibrary — FASE 4.C.2 L5 (D-DS-18, D-NAV-11)
 *
 * Siembra el catálogo canónico de CTAs cross-site. Consumers referencian
 * por key; label + type + intent vienen de aquí.
 *
 * CTAs canónicos (firma Zavala 2026-06-14):
 *   watch-it-run → "Verlo funcionar" / "Watch it run" (nav header, §1.6)
 *
 * L-BBF-256: updateGlobal(locale='en') recrea rows del array y huérfana el locale ES
 *   de _locales. Fix: re-upsert ES vía SQL crudo post-EN-seed.
 *
 * Usage: pnpm tsx src/scripts/seed-site-cta-library.ts
 * Prerequisite: migration 20260614_000100_site_cta_library aplicada.
 */

import { getPayload } from 'payload';

import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  // vars expected from shell environment
}

const CTA_ITEMS = [
  {
    key: 'watch-it-run',
    es: 'Verlo funcionar',
    en: 'Watch it run',
    type: 'solid' as const,
    intent: 'primary' as const,
    href: '/casos',
  },
  {
    key: 'hero-cta-primary',
    es: 'Verlo funcionar',
    en: 'Watch it run',
    type: 'solid' as const,
    intent: 'secondary' as const,
    href: '#proceso',
  },
  {
    key: 'hero-cta-secondary',
    es: 'Conocer el método',
    en: 'Learn the method',
    type: 'outline' as const,
    intent: 'secondary' as const,
    href: '#metodo',
  },
] as const;

async function seedSiteCtaLibrary() {
  const payload = await getPayload({ config });
  console.log('[seed-site-cta-library] Iniciando seed SiteCtaLibrary (D-DS-18, D-NAV-11)...');

  const buildItems = (loc: 'es' | 'en') =>
    CTA_ITEMS.map((cta) => ({
      key: cta.key,
      label: cta[loc],
      type: cta.type,
      intent: cta.intent,
      href: cta.href,
    }));

  await payload.updateGlobal({
    slug: 'site-cta-library',
    locale: 'es',
    data: { items: buildItems('es') },
  });
  console.log('[seed-site-cta-library] ✅ Locale ES seeded.');

  await payload.updateGlobal({
    slug: 'site-cta-library',
    locale: 'en',
    data: { items: buildItems('en') },
  });
  console.log('[seed-site-cta-library] ✅ Locale EN seeded.');

  // L-BBF-256: re-upsert ES en _locales tras recreación de rows por EN update.
  // @ts-justify: acceso al pool pg interno de Payload v3 para fix de locale en arrays
  const pool = (payload as any).db.pool as {
    query: (sql: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
  };

  const esLabelByKey = Object.fromEntries(CTA_ITEMS.map((c) => [c.key, c.es]));
  const itemRows = await pool.query('SELECT id, key FROM site_cta_library_items');
  for (const row of itemRows.rows) {
    const esLabel = esLabelByKey[row.key as string];
    if (!esLabel) continue;
    await pool.query(
      `INSERT INTO site_cta_library_items_locales (label, _locale, _parent_id)
       VALUES ($1, 'es', $2) ON CONFLICT (_locale, _parent_id) DO UPDATE SET label = EXCLUDED.label`,
      [esLabel, row.id],
    );
  }
  console.log('[seed-site-cta-library] ✅ ES locale _locales re-upserted (L-BBF-256).');

  console.log('[seed-site-cta-library] ✅ SiteCtaLibrary seed COMPLETADO.');
  console.log('   CTAs: watch-it-run → Verlo funcionar / Watch it run (solid, primary)');
  console.log('   CTAs: hero-cta-primary → Verlo funcionar / Watch it run (solid, secondary)');
  console.log(
    '   CTAs: hero-cta-secondary → Conocer el método / Learn the method (outline, secondary)',
  );
  process.exit(0);
}

seedSiteCtaLibrary().catch((err) => {
  console.error('[seed-site-cta-library] ❌ Error:', err);
  process.exit(1);
});
