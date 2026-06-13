/**
 * Seed SiteNavigation — FASE 4.C.1 L6 (cierre NAV agnóstico)
 *
 * Siembra los links canónicos cornerstone (header + CTA + footer), ES+EN, vía
 * linkTarget.routeKey (SSOT pathnames.ts). Reemplaza el junk /memory (FASE 3 drift).
 *
 * Valores canon (firma Zavala 2026-06-13, OPCIÓN 1 cornerstones):
 *   ContentMaster_Homepage §2.5 "Cómo trabajamos" (NO "El método" — §6.3) + § comparison
 *   "Cerebro de marca"/"Brand brain". Footer per propuesta footer firmada.
 *
 * D-NAV-11: CTA usa label DIRECTO (text-cta global SiteCtaLibrary DIFERIDO a 4.C.2).
 *   TODO D-NAV-11: migrar headerCta.label → catálogo text-cta cuando se cree el global.
 *
 * L-BBF-256: Payload v3 updateGlobal(locale='en') con arrays reemplaza filas y huérfana
 *   el locale ES de sub-fields localizados → re-upsert ES vía SQL crudo en _locales.
 * L-BBF-258: verificar SQL live, no exit code.
 *
 * Self-contained: process.loadEnvFile (Node 20.12+).
 * Usage: pnpm tsx src/scripts/seed-site-navigation.ts
 */

import { getPayload } from 'payload';

import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  // vars expected from shell environment
}

// ── Valores canon (route keys reales de pathnames.ts — PROHIBIDO inventar) ──
const HEADER = [
  { routeKey: '/cerebro-marca', es: 'Cerebro de marca', en: 'Brand brain' },
  { routeKey: '/metodo', es: 'Cómo trabajamos', en: 'How we work' },
  { routeKey: '/casos', es: 'Casos', en: 'Cases' },
] as const;

const CTA = {
  ctaKey: 'watch-it-run', // D-NAV-11: label/intent → SiteCtaLibrary (seed-site-cta-library.ts)
  routeKey: '/contacto',
} as const;

// Footer: grupos Explora/Método (propuesta footer firmada). order = índice.
const FOOTER = [
  {
    es: 'Explora',
    en: 'Explore',
    links: [
      { routeKey: '/casos', es: 'Casos', en: 'Cases' },
      { routeKey: '/contacto', es: 'Contacto', en: 'Contact' },
    ],
  },
  {
    es: 'Método',
    en: 'Method',
    links: [
      { routeKey: '/metodo', es: 'Cómo trabajamos', en: 'How we work' },
      { routeKey: '/cerebro-marca', es: 'Cerebro de marca', en: 'Brand brain' },
    ],
  },
] as const;

async function seedSiteNavigation() {
  const payload = await getPayload({ config });
  console.log('[seed-site-navigation] Iniciando seed canonical NAV (FASE 4.C.1 L6)...');

  const buildHeader = (loc: 'es' | 'en') =>
    HEADER.map((h) => ({
      label: h[loc],
      linkTarget: { routeKey: h.routeKey },
      hasSubMenu: false,
      subLinks: [],
    }));

  const buildFooter = (loc: 'es' | 'en') =>
    FOOTER.map((g) => ({
      groupTitle: g[loc],
      links: g.links.map((l) => ({ label: l[loc], linkTarget: { routeKey: l.routeKey } })),
    }));

  // ── LOCALE ES ──
  await payload.updateGlobal({
    slug: 'site-navigation',
    locale: 'es',
    data: {
      headerLinks: buildHeader('es'),
      headerCta: { ctaKey: CTA.ctaKey, linkTarget: { routeKey: CTA.routeKey } },
      footerGroups: buildFooter('es'),
    },
  });
  console.log('[seed-site-navigation] ✅ Locale ES seeded.');

  // ── LOCALE EN (reemplaza arrays → huérfana ES de sub-fields localizados) ──
  await payload.updateGlobal({
    slug: 'site-navigation',
    locale: 'en',
    data: {
      headerLinks: buildHeader('en'),
      headerCta: { ctaKey: CTA.ctaKey, linkTarget: { routeKey: CTA.routeKey } },
      footerGroups: buildFooter('en'),
    },
  });
  console.log('[seed-site-navigation] ✅ Locale EN seeded.');

  // ── L-BBF-256: re-upsert ES en _locales de sub-fields de array ──
  // @ts-justify: acceso al pool pg interno de Payload v3 para fix de locale en arrays
  const pool = (payload as any).db.pool as {
    query: (sql: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
  };

  // header_links.label ES (map por route_key)
  const esHeaderByKey = Object.fromEntries(HEADER.map((h) => [h.routeKey, h.es]));
  const headerRows = await pool.query(
    'SELECT id, link_target_route_key FROM site_navigation_header_links WHERE _parent_id = 1 ORDER BY _order',
  );
  for (const row of headerRows.rows) {
    await pool.query(
      `INSERT INTO site_navigation_header_links_locales (label, _locale, _parent_id)
       VALUES ($1, 'es', $2) ON CONFLICT (_locale, _parent_id) DO UPDATE SET label = EXCLUDED.label`,
      [esHeaderByKey[row.link_target_route_key as string] ?? '', row.id],
    );
  }

  // footer_groups.group_title ES (map por _order)
  const groupRows = await pool.query(
    'SELECT id FROM site_navigation_footer_groups WHERE _parent_id = 1 ORDER BY _order',
  );
  for (let i = 0; i < groupRows.rows.length; i++) {
    await pool.query(
      `INSERT INTO site_navigation_footer_groups_locales (group_title, _locale, _parent_id)
       VALUES ($1, 'es', $2) ON CONFLICT (_locale, _parent_id) DO UPDATE SET group_title = EXCLUDED.group_title`,
      [FOOTER[i]?.es ?? '', groupRows.rows[i]!.id],
    );
  }

  // footer_groups_links.label ES (map por route_key, único dentro de footer)
  const esFooterLinkByKey = Object.fromEntries(
    FOOTER.flatMap((g) => g.links.map((l) => [l.routeKey, l.es])),
  );
  const footerLinkRows = await pool.query(
    `SELECT l.id, l.link_target_route_key FROM site_navigation_footer_groups_links l
     JOIN site_navigation_footer_groups g ON l._parent_id = g.id WHERE g._parent_id = 1`,
  );
  for (const row of footerLinkRows.rows) {
    await pool.query(
      `INSERT INTO site_navigation_footer_groups_links_locales (label, _locale, _parent_id)
       VALUES ($1, 'es', $2) ON CONFLICT (_locale, _parent_id) DO UPDATE SET label = EXCLUDED.label`,
      [esFooterLinkByKey[row.link_target_route_key as string] ?? '', row.id],
    );
  }

  console.log('[seed-site-navigation] ✅ ES locale array sub-fields fixed (L-BBF-256).');
  console.log('[seed-site-navigation] ✅ NAV seed COMPLETADO. Junk /memory reemplazado.');
  console.log('   Header: Cerebro de marca · Cómo trabajamos · Casos + CTA Verlo funcionar');
  console.log('   Footer: Explora · Método');
  console.log('   D-NAV-11 CERRADO: headerCta.ctaKey → SiteCtaLibrary (seed-site-cta-library.ts)');
  process.exit(0);
}

seedSiteNavigation().catch((err) => {
  console.error('[seed-site-navigation] ❌ Error:', err);
  process.exit(1);
});
