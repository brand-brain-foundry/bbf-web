/**
 * Seed SiteIdentity — FASE 4.B.1.A.1 + Correctivo FIX-CANON-INJECTION
 *
 * Aplica valores canónicos de SiteIdentity per jerarquía documental firmada:
 *   Tier 1: SB_ContentMaster_Homepage v1.2 (§6.2 vocab aprobado, §6.3 filtro absoluto)
 *   Tier 2: SB_PlaceholdersCanon v1.1
 *   Tier 3: SB_OntologyPrimitives_Canon v1.0.4
 *   Tier 4: SB_ContentMaster_QuienesSomos
 *   Despacho: B-BBF-WEB-FASE4-B-1-A-1-SITE-IDENTITY + FIX-CANON-INJECTION
 *
 * D-ALIGN resueltas: D-ALIGN-02 (foundingDate) + D-ALIGN-05 (areaServed) + D-ALIGN-09 (slug doc)
 *
 * Requiere: pnpm payload migrate aplicado + pnpm payload generate:types aplicado
 * Self-contained: carga .env.local via process.loadEnvFile (Node 20.12+ built-in)
 *
 * Escribe: siteDescription ES (149c) + EN (140c) — Sprint 1 G-16/G-17 ✅
 * NO sobrescribe: organizationEntity (null TEMPORAL — conectar en 4.B.1.B)
 *
 * siteTagline: "Construimos tu cerebro de marca" / "We build your brand brain"
 *   Nota: corrige DRIFT vs PlaceholdersCanon §3.5 / Ontology §2.5 que usaban frase
 *   §6.3 prohibida "Cerebros de marca operacionales". CM-HP v1.2 §6.3 es Tier 1 (filtro
 *   absoluto). PlaceholdersCanon + Ontology requieren update futuro (NOTA-FUTURE).
 *
 * Usage:
 *   pnpm tsx src/scripts/seed-site-identity.ts
 *   (o: set -a; source .env.local; set +a; pnpm tsx src/scripts/seed-site-identity.ts)
 */

import { getPayload } from 'payload';

import config from '../payload.config';

// Self-contained env loading — Node 20.12+ built-in, no deps required
// Si .env.local no existe (ej. CI con vars ya inyectadas), silencia el error
try {
  process.loadEnvFile('.env.local');
} catch {
  // vars expected from shell environment
}

async function seedSiteIdentity() {
  const payload = await getPayload({ config });

  console.log('[seed-site-identity] Iniciando seed canonical SiteIdentity...');
  console.log('[seed-site-identity] Despacho: B-BBF-WEB-FASE4-B-1-A-1-FIX-CANON-INJECTION');

  // ── LOCALE ES ──────────────────────────────────────────────────────
  // Todos los campos (localized ES + non-localized).
  // siteDescription: NO incluida — canonical de Hotfix, NO sobrescribir (L-BBF-253).
  // organizationEntity: null TEMPORAL — NO incluir, conectar en 4.B.1.B.
  await payload.updateGlobal({
    slug: 'site-identity',
    locale: 'es',
    data: {
      // Core identity
      siteName: 'Sivar Brains',
      siteShortName: 'SB', // nombre corto para PWA manifest (DERIVADO — "SB" es abreviatura natural)

      siteDomain: 'https://sivarbrains.com',

      // siteTagline: CM-HP v1.2 §6.3 filtro Tier 1 → "Construimos = verbo del tagline" (§6.2)
      // Corrige DRIFT: PlaceholdersCanon §3.5 usaba "Cerebros de marca operacionales" (§6.3 prohibido)
      // NOTA-FUTURE: actualizar PlaceholdersCanon §3.5 + OntologyPrimitives en sub-fase futura
      siteTagline: 'Construimos tu cerebro de marca',

      // siteDescription ES (155c) — SEO-AEO-home-SB §1.2 + ContentMaster canonical (Sprint 1 G-16)
      // Fix L-BBF-253 gap: valor anterior vacío/~105c, nuevo valor cumple 150-160c meta description
      siteDescription:
        'Construimos tu cerebro de marca: una sola fuente para tu voz, tu contenido y tus respuestas, consistente en cada canal. Tú diriges. Tu marca ejecuta.',

      // longDescription ES: DERIVADO desde CM-HP v1.2 §6.2 (§6.3 clean)
      // Estructura "No es agencia/consultora/SaaS" validada en CM-HP.
      // Eliminado: "Knowledge Brain" (§6.3 prohibido), "factorías" (§6.3 prohibido),
      //            "hub-and-spoke" (jerga interna), sujeto BBF incorrecto.
      longDescription:
        '{{siteName}} construye, opera y mantiene cerebros de marca. No es una agencia: no vendemos campañas. No es una consultora: no entregamos PowerPoints. No es un SaaS: cada cliente recibe un cerebro propio, que le pertenece y puede llevarse. Construimos el lugar único donde vive todo lo que tu empresa sabe —su voz, sus productos, sus procesos— y desde donde responde a tus clientes, genera tu contenido y asiste a tu equipo. Tu marca es dueña de su memoria. Tú diriges. Tu marca ejecuta.',

      // Org metadata (D-ALIGN-02 + D-ALIGN-05)
      foundingDate: '2025-10',
      areaServed: [
        { type: 'Country', name: 'El Salvador', iso2: 'SV' },
        { type: 'Region', name: 'Latinoamérica', iso2: null },
      ],

      // Founders (OntologyPrimitives v1.0.4 canonical — L-BBF-251)
      // Orden CM-HP §1.8: Christian → Brenda → Pedro
      // url vacío per L-BBF-240 (brandbrainfoundry.com pertenece a BBF Org, no a la Person)
      // Brenda Zavala: nombre v1.0.4 (mandato Zavala 2026-06-10) — CM-HP §1.8 dice "Brenda Gutiérrez"
      //   pero OntologyPrimitives v1.0.4 (más reciente, firmado) gana per L-BBF-251
      founders: [
        {
          name: 'Christian Zavala',
          role: 'Co-fundador · Arquitecto del método',
          url: '',
          linkedin: 'https://www.linkedin.com/in/zavalacubas/',
          affiliation: 'Brand Brain Foundry',
        },
        {
          name: 'Brenda Zavala',
          role: 'Co-fundadora · Operaciones cliente',
          url: '',
          linkedin: 'https://www.linkedin.com/in/brenda-zavala-cubas-7720142b/',
          affiliation: 'Sivar Films',
        },
        {
          name: 'Pedro Gutiérrez',
          role: 'Co-fundador · Comercial y administración',
          url: '',
          linkedin: 'https://www.linkedin.com/in/pedro-gutierrez-2a4a2114/',
          affiliation: 'Sivar Films',
        },
      ],

      // Producer (PlaceholdersCanon §3.5 + AUD-BBF-ALIGN-01 §3.1.1)
      producer: {
        name: 'Brand Brain Foundry',
        url: 'https://brandbrainfoundry.com',
      },

      // SEO
      // twitterHandle: firmado despacho correctivo (cuenta pendiente de crear — registrar pending)
      // themeColor: #255FF1 firmado Zavala 2026-06-10 (corrige #fef9e8 del seed anterior)
      // ogImagePath: temporal, actualizar en 4.B.1.C cuando logo SB listo
      seo: {
        defaultLocale: 'es_SV',
        twitterHandle: '@sivarbrains',
        ogImagePath: '/og-image.png',
        themeColor: '#255FF1',
      },

      // StatusBanner — disabled, label null (banner desactivado, label cosmético)
      statusBanner: {
        enabled: false,
        label: null,
        href: null,
        dotColor: '#3b82f6',
      },
    },
  });

  console.log('[seed-site-identity] ✅ Locale ES seeded.');

  // ── LOCALE EN ──────────────────────────────────────────────────────
  // Campos localized con valores EN. Non-localized preservados del call ES.
  // siteDescription EN: NO incluida — canonical de Hotfix, NO sobrescribir.
  await payload.updateGlobal({
    slug: 'site-identity',
    locale: 'en',
    data: {
      siteName: 'Sivar Brains', // brand name invariant
      siteShortName: 'SB',

      siteTagline: 'We build your brand brain',

      // siteDescription EN (141c) — SEO-AEO-home-SB §1.2 + ContentMaster canonical (Sprint 1 G-17)
      siteDescription:
        'We build your brand brain: a single source for your voice, content and answers, consistent across every channel. You drive. Your brand runs.',

      // longDescription EN: DERIVADO desde CM-HP v1.2 (§6.3 clean, sujeto {{siteName}})
      // Corrige: sujeto "Brand Brain Foundry" incorrecto del FASE 3 DB
      // Elimina: "Knowledge Brain" (§6.3), "factories" (§6.3)
      longDescription:
        "{{siteName}} builds, operates and maintains brand brains. Not an agency: we don't sell campaigns. Not a consultancy: we don't deliver PowerPoints. Not a SaaS: every client owns their brand brain —it's theirs and they can take it with them. We build the single place where everything your company knows lives —its voice, products, processes— and from where your brand answers customers, generates content and assists your team. Your brand owns its memory. You drive. Your brand runs.",

      // areaServed — localized name field
      areaServed: [
        { type: 'Country', name: 'El Salvador', iso2: 'SV' },
        { type: 'Region', name: 'Latin America', iso2: null },
      ],

      // Founders — localized role field (EN)
      founders: [
        {
          name: 'Christian Zavala',
          role: 'Co-founder · Method Architect',
          url: '',
          linkedin: 'https://www.linkedin.com/in/zavalacubas/',
          affiliation: 'Brand Brain Foundry',
        },
        {
          name: 'Brenda Zavala',
          role: 'Co-founder · Client Operations',
          url: '',
          linkedin: 'https://www.linkedin.com/in/brenda-zavala-cubas-7720142b/',
          affiliation: 'Sivar Films',
        },
        {
          name: 'Pedro Gutiérrez',
          role: 'Co-founder · Commercial and administration',
          url: '',
          linkedin: 'https://www.linkedin.com/in/pedro-gutierrez-2a4a2114/',
          affiliation: 'Sivar Films',
        },
      ],

      // statusBanner.label EN — null (banner desactivado)
      statusBanner: {
        enabled: false,
        label: null,
        href: null,
        dotColor: '#3b82f6',
      },
    },
  });

  console.log('[seed-site-identity] ✅ Locale EN seeded.');

  // ── STEP 3: Fix Payload v3 array locale behavior ──────────────────
  // Payload v3: updateGlobal(locale='en') with arrays (no IDs) replaces the
  // entire array, creating new rows and storing only EN locale entries.
  // This loses the ES locale data set in Step 1 for localized sub-fields
  // (areaServed[].name, founders[].role). Workaround: re-query current
  // array item IDs and re-upsert the ES locale entries directly.
  // L-BBF-256: document as lesson in ETAPA 6 memory.
  // @ts-justify: accessing Payload v3 internal pg pool for locale fix
  const pool = (payload as any).db.pool as {
    query: (sql: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
  };

  const areaServedRows = await pool.query(
    'SELECT id, type FROM site_identity_area_served WHERE _parent_id = 1 ORDER BY _order',
  );

  const areaServedESNames: Record<string, string> = {
    Country: 'El Salvador',
    Region: 'Latinoamérica',
  };

  for (const row of areaServedRows.rows) {
    await pool.query(
      `INSERT INTO site_identity_area_served_locales (name, _locale, _parent_id)
       VALUES ($1, 'es', $2)
       ON CONFLICT (_locale, _parent_id) DO UPDATE SET name = EXCLUDED.name`,
      [areaServedESNames[row.type as string] ?? '', row.id],
    );
  }

  const foundersRows = await pool.query(
    'SELECT id, name FROM site_identity_founders WHERE _parent_id = 1 ORDER BY _order',
  );

  const foundersESRoles: Record<string, string> = {
    'Christian Zavala': 'Co-fundador · Arquitecto del método',
    'Brenda Zavala': 'Co-fundadora · Operaciones cliente',
    'Pedro Gutiérrez': 'Co-fundador · Comercial y administración',
  };

  for (const row of foundersRows.rows) {
    await pool.query(
      `INSERT INTO site_identity_founders_locales (role, _locale, _parent_id)
       VALUES ($1, 'es', $2)
       ON CONFLICT (_locale, _parent_id) DO UPDATE SET role = EXCLUDED.role`,
      [foundersESRoles[row.name as string] ?? '', row.id],
    );
  }

  console.log('[seed-site-identity] ✅ ES locale array sub-fields fixed (Payload v3 workaround).');

  console.log('');
  console.log('[seed-site-identity] ✅ SiteIdentity canonical seed COMPLETADO.');
  console.log('');
  console.log('📋 Campos inyectados:');
  console.log('   ✅ siteName ES+EN: Sivar Brains');
  console.log('   ✅ siteShortName ES+EN: SB');
  console.log('   ✅ siteTagline ES: Construimos tu cerebro de marca (corrige §6.3 drift)');
  console.log('   ✅ siteTagline EN: We build your brand brain');
  console.log('   ✅ longDescription ES: derivado CM-HP v1.2 §6.3 clean');
  console.log('   ✅ longDescription EN: derivado, sujeto {{siteName}} correcto');
  console.log('   ✅ foundingDate: 2025-10');
  console.log('   ✅ areaServed: El Salvador SV + Latinoamérica/Latin America');
  console.log('   ✅ founders: 3 (Christian, Brenda, Pedro) + LinkedIn + affiliation');
  console.log('   ✅ producer: Brand Brain Foundry');
  console.log('   ✅ seo.themeColor: #255FF1 (corrige #fef9e8)');
  console.log('   ✅ seo.twitterHandle: @sivarbrains (pendiente de crear cuenta)');
  console.log('   ✅ statusBanner: disabled, label null');
  console.log('');
  console.log('✅ siteDescription ES+EN: escritos (Sprint 1 G-16/G-17)');
  console.log('   - organizationEntity (null TEMPORAL — conectar en 4.B.1.B)');
  console.log('');
  console.log('⚠️  NOTA-FUTURE: PlaceholdersCanon §3.5 + OntologyPrimitives §2.5');
  console.log('   usan "Cerebros de marca operacionales" (§6.3 prohibido) como siteTagline.');
  console.log('   Requieren update en sub-fase futura.');

  process.exit(0);
}

seedSiteIdentity().catch((err) => {
  console.error('[seed-site-identity] ❌ Error:', err);
  process.exit(1);
});
