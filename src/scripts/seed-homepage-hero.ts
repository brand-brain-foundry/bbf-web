/**
 * Seed SiteHomepage §1 Hero — B-BBF-WEB-SEED-01-HERO
 *
 * Pobla ledeBody, ledeEmphasis, ctas[], ticker[], h1Line1, h1Line2Soft,
 * media.demoLabel desde ContentMaster_Homepage.md v1.2 §2.1.
 *
 * FUENTE: SB_ContentMaster_Homepage.md v1.2 §2.1 (Content/Final).
 * Ningún texto es inventado ni parafraseado.
 *
 * Patrón de locale:
 *   - ctas[] no es localized → seed una vez (ES call). Se aplica a ambos locales.
 *   - ticker[] tiene localized:true en el array (L-BBF-256 aplica):
 *     updateGlobal(locale='en') falla con ValidationError id (PK conflict).
 *     Fix: EN texto via updateGlobal SIN ticker; ticker EN via SQL DELETE+INSERT.
 *   - Campos de texto localized (h1Line1, ledeBody, etc.) → updateGlobal por locale.
 *
 * Usage:
 *   pnpm tsx src/scripts/seed-homepage-hero.ts
 */

import { getPayload } from 'payload';

import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  // vars expected from shell environment
}

// ── ContentMaster §2.1 Hero — valores canónicos exactos ─────────────────────

const HERO_ES = {
  h1Line1: 'Tú diriges.',
  h1Line2Soft: 'Tu marca ejecuta.',
  ledeBody:
    'Construimos tu cerebro de marca: una sola fuente para tu voz, tu contenido y tus respuestas. Responde a tus clientes, asiste a tu equipo, genera tu contenido y aprende con cada uso.',
  ledeEmphasis: 'Con tu voz, en cada canal.',
  // ticker: 5 estados vivos (ContentMaster §2.1)
  ticker: [
    { item: 'WhatsApp Business · activo' },
    { item: 'Contenido · generado' },
    { item: 'Agentes · en vivo' },
    { item: 'Procesos · automatizados' },
    { item: 'Datos · analizados' },
  ],
  // demoLabel: label del frame de demo (no en ContentMaster — traducción estándar del defaultValue)
  demoLabel: 'Demostración',
} as const;

const HERO_EN = {
  h1Line1: 'You drive.',
  h1Line2Soft: 'Your brand runs.',
  ledeBody:
    'We build your brand brain: a single source for your voice, content and answers. It serves your customers, assists your team, generates your content and learns with every use.',
  ledeEmphasis: 'In your voice, on every channel.',
  // ticker EN: derivados del ES — ContentMaster §2.1 no provee EN ticker explícito
  ticker: [
    { item: 'WhatsApp Business · active' },
    { item: 'Content · generated' },
    { item: 'Agents · live' },
    { item: 'Processes · automated' },
    { item: 'Data · analyzed' },
  ],
  demoLabel: 'Demo',
} as const;

// ctas[] — NO localized: se seed en ES call; se aplica a ambos locales.
// hero-cta-primary (Verlo funcionar) + hero-cta-secondary (Conocer el método)
// Fuente: SiteCtaLibrary (keys firmados 2026-06-14, D-DS-18)
const HERO_CTAS = [{ ctaKey: 'hero-cta-primary' }, { ctaKey: 'hero-cta-secondary' }] as const;

async function seedHomepageHero() {
  const payload = await getPayload({ config });

  console.log('[seed-homepage-hero] B-BBF-WEB-SEED-01-HERO — SiteHomepage §1 Hero');
  console.log('[seed-homepage-hero] Fuente: ContentMaster_Homepage.md v1.2 §2.1');

  // ── PASO 1: ES ────────────────────────────────────────────────────────────
  console.log('\n[1/3] Seeding hero ES + ctas (no-localized)…');
  await payload.updateGlobal({
    slug: 'site-homepage',
    locale: 'es',
    data: {
      hero: {
        h1Line1: HERO_ES.h1Line1,
        h1Line2Soft: HERO_ES.h1Line2Soft,
        ledeBody: HERO_ES.ledeBody,
        ledeEmphasis: HERO_ES.ledeEmphasis,
        ctas: HERO_CTAS as unknown as { ctaKey: string }[],
        ticker: HERO_ES.ticker as unknown as { item: string }[],
        media: {
          demoLabel: HERO_ES.demoLabel,
        },
      },
    } as any,
  });
  console.log('[1/3] ✅ hero ES seeded');
  console.log(`      h1Line1: "${HERO_ES.h1Line1}"`);
  console.log(`      ledeBody: "${HERO_ES.ledeBody.slice(0, 60)}…"`);
  console.log(`      ledeEmphasis: "${HERO_ES.ledeEmphasis}"`);
  console.log(`      ticker: ${HERO_ES.ticker.length} items`);
  console.log(`      ctas: [${HERO_CTAS.map((c) => c.ctaKey).join(', ')}]`);

  // ── PASO 2: EN — SQL completo (L-BBF-256 workaround) ────────────────────
  // updateGlobal(locale='en') falla: site_homepage_locales no tiene fila EN todavía,
  // INSERT requeriría TODOS los campos NOT NULL (capabilities, comparison, etc.).
  // Fix: copiar la fila ES como template, sobreescribir solo los campos hero EN.
  //
  // @ts-justify: acceso al pool pg interno de Payload v3 para fix L-BBF-256
  const pool = (payload as any).db.pool as {
    query: (sql: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
  };

  // Obtener parent_id del global (siempre 1 por serial, pero lo verificamos)
  const parentRow = await pool.query(`SELECT id FROM site_homepage LIMIT 1`);
  const parentId = parentRow.rows[0]?.id as number;
  if (!parentId) throw new Error('[seed-homepage-hero] site_homepage row not found');

  console.log(`\n[2/3] Seeding hero EN via SQL (parent_id=${parentId}, L-BBF-256)…`);

  // Verificar si ya existe fila EN en site_homepage_locales
  const enLocaleCheck = await pool.query(
    `SELECT id FROM site_homepage_locales WHERE _locale='en' AND _parent_id=$1 LIMIT 1`,
    [parentId],
  );

  if (enLocaleCheck.rows.length === 0) {
    // No hay fila EN — copiar fila ES como template + override hero fields
    const esLocaleResult = await pool.query(
      `SELECT * FROM site_homepage_locales WHERE _locale='es' AND _parent_id=$1 LIMIT 1`,
      [parentId],
    );
    if (!esLocaleResult.rows.length)
      throw new Error('ES locale row not found in site_homepage_locales');

    const esRow = { ...esLocaleResult.rows[0] } as Record<string, unknown>;
    delete esRow['id']; // serial — DB asigna nuevo id
    esRow['_locale'] = 'en';
    esRow['hero_h1_line1'] = HERO_EN.h1Line1;
    esRow['hero_h1_line2_soft'] = HERO_EN.h1Line2Soft;
    esRow['hero_lede_body'] = HERO_EN.ledeBody;
    esRow['hero_lede_emphasis'] = HERO_EN.ledeEmphasis;
    esRow['hero_media_demo_label'] = HERO_EN.demoLabel;

    const cols = Object.keys(esRow);
    const vals = Object.values(esRow);
    const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ');
    await pool.query(
      `INSERT INTO site_homepage_locales (${cols.join(', ')}) VALUES (${placeholders})`,
      vals,
    );
    console.log('[2] ✅ EN locale row INSERTADA (copied from ES + hero override)');
  } else {
    // Fila EN existe — UPDATE solo hero fields
    await pool.query(
      `UPDATE site_homepage_locales SET
         hero_h1_line1 = $1,
         hero_h1_line2_soft = $2,
         hero_lede_body = $3,
         hero_lede_emphasis = $4,
         hero_media_demo_label = $5
       WHERE _locale = 'en' AND _parent_id = $6`,
      [
        HERO_EN.h1Line1,
        HERO_EN.h1Line2Soft,
        HERO_EN.ledeBody,
        HERO_EN.ledeEmphasis,
        HERO_EN.demoLabel,
        parentId,
      ],
    );
    console.log('[2] ✅ EN locale row ACTUALIZADA (hero fields only)');
  }

  // ── PASO 2b: EN ticker — SQL (tabla separada, localized array) ───────────
  // site_homepage_hero_ticker: (_order int, _parent_id int, _locale, id varchar PK, item varchar)
  await pool.query(
    `DELETE FROM site_homepage_hero_ticker WHERE _parent_id = $1 AND _locale = 'en'`,
    [parentId],
  );
  for (let i = 0; i < HERO_EN.ticker.length; i++) {
    await pool.query(
      `INSERT INTO site_homepage_hero_ticker (_order, _parent_id, _locale, id, item)
       VALUES ($1, $2, 'en', gen_random_uuid()::text, $3)`,
      [i + 1, parentId, HERO_EN.ticker[i].item],
    );
  }
  console.log(`[2b] ✅ EN ticker seeded via SQL (${HERO_EN.ticker.length} items)`);
  console.log(`      h1Line1: "${HERO_EN.h1Line1}"`);
  console.log(`      ledeBody: "${HERO_EN.ledeBody.slice(0, 60)}…"`);
  console.log(`      ledeEmphasis: "${HERO_EN.ledeEmphasis}"`);
  console.log(`      ticker: ${HERO_EN.ticker.length} items via SQL`);

  // ── PASO 3: Verificación vía findGlobal ───────────────────────────────────
  console.log('\n[3/3] Verificando valores en DB…');
  const [verEs, verEn] = await Promise.all([
    payload.findGlobal({ slug: 'site-homepage', locale: 'es', depth: 0 }),
    payload.findGlobal({ slug: 'site-homepage', locale: 'en', depth: 0 }),
  ]);

  const checkField = (label: string, actual: unknown, expected: string) => {
    const ok = actual === expected;
    console.log(
      `  ${ok ? '✅' : '❌'} ${label}: ${ok ? 'OK' : `MISMATCH — got "${actual}" expected "${expected}"`}`,
    );
    return ok;
  };

  let allOk = true;
  allOk = checkField('ES h1Line1', verEs.hero?.h1Line1, HERO_ES.h1Line1) && allOk;
  allOk = checkField('ES h1Line2Soft', verEs.hero?.h1Line2Soft, HERO_ES.h1Line2Soft) && allOk;
  allOk = checkField('ES ledeBody', verEs.hero?.ledeBody, HERO_ES.ledeBody) && allOk;
  allOk = checkField('ES ledeEmphasis', verEs.hero?.ledeEmphasis, HERO_ES.ledeEmphasis) && allOk;
  allOk = checkField('EN h1Line1', verEn.hero?.h1Line1, HERO_EN.h1Line1) && allOk;
  allOk = checkField('EN h1Line2Soft', verEn.hero?.h1Line2Soft, HERO_EN.h1Line2Soft) && allOk;
  allOk = checkField('EN ledeBody', verEn.hero?.ledeBody, HERO_EN.ledeBody) && allOk;
  allOk = checkField('EN ledeEmphasis', verEn.hero?.ledeEmphasis, HERO_EN.ledeEmphasis) && allOk;

  const esTickerLen = (verEs.hero as any)?.ticker?.length ?? 0;
  const enTickerLen = (verEn.hero as any)?.ticker?.length ?? 0;
  const esCtasLen = (verEs.hero as any)?.ctas?.length ?? 0;

  console.log(`  ${esTickerLen === 5 ? '✅' : '❌'} ES ticker: ${esTickerLen} items (expected 5)`);
  console.log(`  ${enTickerLen === 5 ? '✅' : '❌'} EN ticker: ${enTickerLen} items (expected 5)`);
  console.log(`  ${esCtasLen === 2 ? '✅' : '❌'} ctas[]: ${esCtasLen} items (expected 2)`);
  allOk = allOk && esTickerLen === 5 && enTickerLen === 5 && esCtasLen === 2;

  console.log(
    `\n[3/3] ${allOk ? '✅' : '⚠️'} Verificación ${allOk ? 'COMPLETA' : 'CON DIFERENCIAS'}`,
  );

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('[seed-homepage-hero] B-BBF-WEB-SEED-01-HERO COMPLETADO');
  console.log('  Hero §1 ES+EN poblado desde ContentMaster_Homepage.md v1.2 §2.1');
  console.log('  CTAs: hero-cta-primary + hero-cta-secondary (SiteCtaLibrary)');
  console.log('  NOTA: hero-cta-secondary EN label en library es "Learn the method"');
  console.log('        ContentMaster §1.6 dice "See how we work" — drift a resolver');
  console.log('═══════════════════════════════════════════════════════════════════');

  process.exit(0);
}

seedHomepageHero().catch((err) => {
  console.error('[seed-homepage-hero] ❌ ERROR:', err);
  process.exit(1);
});
