/**
 * Seed FASE 1 POBLAR — B-BBF-WEB-HOME-FASE1-POBLAR
 *
 * Decisiones firmadas Zavala (2026-06-16):
 *   GRUPO A:
 *     A-1: Entity sivar-brains → sameAs[] += https://cerebrosdemarca.com
 *     A-2..A-5: Entity sivar-brains → organization.knowsAbout[] += 4 topics canónicos §8
 *       (ai-agents-for-brand, multi-channel-brand-orchestration, b2b-brand-latam, motor-de-contenido)
 *   B-1: knowsAbout extras (brand-brain-architecture, brand-memory-systems) → MANTENER
 *   B-2: siteDescription ES → SEO-AEO §1.8 literal
 *   B-3: siteDescription EN → SEO-AEO §1.9 literal
 *   D-FASE1-DESC-01: D-ALIGN-01 + D-ALIGN-03 supersedidas (registrado en bbf-docs)
 *   GRUPO C: LinkedIn, Wikidata, SocialLinks → NO tocar (pendientes)
 *
 * Fuente canon:
 *   SEO-AEO-home-SB.md §1.8 (ES) · §1.9 (EN) · §2.8 (sameAs) · §8 (knowsAbout)
 *
 * Usage:
 *   set -a; source .env.local; set +a && pnpm tsx src/scripts/seed-fase1-poblar.ts
 */

import { getPayload } from 'payload';

import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  // vars expected from shell environment (set -a; source .env.local; set +a)
}

// ── Canon values (literales del canon — NO modificar) ──────────────────────
const SITE_DESC_ES =
  'Construimos tu cerebro de marca: una sola fuente para tu voz, tu contenido y tus respuestas, consistente en cada canal. Tú diriges. Tu marca ejecuta.';

const SITE_DESC_EN =
  'We build your brand brain: a single source for your voice, content and answers, consistent across every channel. You drive. Your brand runs.';

const SAME_AS_TO_ADD = 'https://cerebrosdemarca.com';

const TOPICS_TO_ADD_SLUGS = [
  'ai-agents-for-brand',
  'multi-channel-brand-orchestration',
  'b2b-brand-latam',
  'motor-de-contenido',
];

async function seedFase1Poblar() {
  const payload = await getPayload({ config });

  console.log('[seed-fase1-poblar] FASE 1 POBLAR — B-BBF-WEB-HOME-FASE1-POBLAR');
  console.log('Decisiones firmadas: Grupo A + B-1 mantener + B-2/B-3 SEO-AEO §1.8/§1.9');
  console.log('');

  // ── PASO 1: Leer sivar-brains actual ────────────────────────────────────────
  console.log('[1/6] Leyendo entity sivar-brains (depth:0)...');

  const sbResult = await payload.find({
    collection: 'entities',
    where: { slug: { equals: 'sivar-brains' } },
    depth: 0,
    locale: 'es',
  });

  if (!sbResult.docs.length) {
    throw new Error('[FATAL] Entity sivar-brains not found — abortando');
  }

  const sb = sbResult.docs[0];
  const sbId = sb.id;

  const currentSameAs: Array<{ url: string }> = (sb.sameAs as Array<{ url: string }>) ?? [];
  const currentKnowsAbout: number[] = (sb.organization?.knowsAbout as number[]) ?? [];

  console.log(`[1/6] ✓ sivar-brains encontrado (ID=${sbId})`);
  console.log(
    `      sameAs actual (${currentSameAs.length}): ${currentSameAs.map((s) => s.url).join(', ')}`,
  );
  console.log(
    `      knowsAbout actual (${currentKnowsAbout.length}): [${currentKnowsAbout.join(', ')}]`,
  );

  // ── PASO 2: Leer topics a vincular (obtener IDs) ─────────────────────────
  console.log('\n[2/6] Buscando topics canónicos a vincular...');

  const topicsResult = await payload.find({
    collection: 'topics',
    where: { slug: { in: TOPICS_TO_ADD_SLUGS } },
    depth: 0,
    limit: 10,
  });

  if (topicsResult.docs.length !== TOPICS_TO_ADD_SLUGS.length) {
    const foundSlugs = topicsResult.docs.map((t) => t.slug);
    const missing = TOPICS_TO_ADD_SLUGS.filter((s) => !foundSlugs.includes(s));
    throw new Error(`[FATAL] Topics no encontrados: ${missing.join(', ')} — abortando`);
  }

  const topicIdMap = new Map<string, number>();
  topicsResult.docs.forEach((t) => topicIdMap.set(t.slug as string, t.id as number));

  console.log('[2/6] ✓ Topics encontrados:');
  TOPICS_TO_ADD_SLUGS.forEach((slug) => {
    console.log(`      ${slug} → ID=${topicIdMap.get(slug)}`);
  });

  // ── PASO 3: Construir nuevos arrays ─────────────────────────────────────
  // sameAs: preservar actuales + agregar cerebrosdemarca.com (si no está ya)
  const sameAsUrls = currentSameAs.map((s) => s.url);
  const newSameAs: Array<{ url: string }> = [...currentSameAs];
  if (!sameAsUrls.includes(SAME_AS_TO_ADD)) {
    newSameAs.push({ url: SAME_AS_TO_ADD });
    console.log(`\n[3/6] sameAs: agregando ${SAME_AS_TO_ADD}`);
  } else {
    console.log(`\n[3/6] sameAs: ${SAME_AS_TO_ADD} ya existe — no duplicar`);
  }

  // knowsAbout: preservar actuales + agregar los 4 nuevos (si no están ya)
  const newTopicIds = TOPICS_TO_ADD_SLUGS.map((slug) => topicIdMap.get(slug)!);
  const newKnowsAbout = [...currentKnowsAbout];
  const addedTopics: string[] = [];
  const skippedTopics: string[] = [];

  newTopicIds.forEach((id, idx) => {
    const slug = TOPICS_TO_ADD_SLUGS[idx];
    if (!newKnowsAbout.includes(id)) {
      newKnowsAbout.push(id);
      addedTopics.push(`${slug}(${id})`);
    } else {
      skippedTopics.push(`${slug}(${id}) — ya vinculado`);
    }
  });

  if (addedTopics.length) console.log(`      knowsAbout: agregando ${addedTopics.join(', ')}`);
  if (skippedTopics.length) console.log(`      knowsAbout: skipped ${skippedTopics.join(', ')}`);
  console.log(`      knowsAbout final (${newKnowsAbout.length}): [${newKnowsAbout.join(', ')}]`);

  // ── PASO 4: Actualizar sivar-brains (sameAs + knowsAbout) ──────────────────
  console.log('\n[4/6] Actualizando entity sivar-brains...');

  await payload.update({
    collection: 'entities',
    id: sbId,
    locale: 'es',
    data: {
      sameAs: newSameAs,
      organization: {
        knowsAbout: newKnowsAbout,
      },
    },
  });

  console.log('[4/6] ✓ sivar-brains actualizado');
  console.log(`      sameAs (${newSameAs.length}): ${newSameAs.map((s) => s.url).join(', ')}`);
  console.log(`      knowsAbout (${newKnowsAbout.length}): [${newKnowsAbout.join(', ')}]`);

  // ── PASO 5: Actualizar SiteIdentity siteDescription ES + EN ─────────────
  console.log('\n[5/6] Actualizando SiteIdentity.siteDescription ES + EN (B-2/B-3)...');

  await payload.updateGlobal({
    slug: 'site-identity',
    locale: 'es',
    data: {
      siteDescription: SITE_DESC_ES,
    },
  });

  await payload.updateGlobal({
    slug: 'site-identity',
    locale: 'en',
    data: {
      siteDescription: SITE_DESC_EN,
    },
  });

  console.log('[5/6] ✓ SiteIdentity.siteDescription actualizado');
  console.log(`      ES (${SITE_DESC_ES.length}c): "${SITE_DESC_ES}"`);
  console.log(`      EN (${SITE_DESC_EN.length}c): "${SITE_DESC_EN}"`);

  // ── PASO 6: Verificación post-escritura ─────────────────────────────────
  console.log('\n[6/6] Verificación post-escritura...');

  const verifyEntity = await payload.find({
    collection: 'entities',
    where: { slug: { equals: 'sivar-brains' } },
    depth: 0,
    locale: 'es',
  });

  const verifyIdentityEs = await payload.findGlobal({
    slug: 'site-identity',
    locale: 'es',
    depth: 0,
  });

  const verifyIdentityEn = await payload.findGlobal({
    slug: 'site-identity',
    locale: 'en',
    depth: 0,
  });

  const vEnt = verifyEntity.docs[0];
  const vSameAs = (vEnt.sameAs as Array<{ url: string }>) ?? [];
  const vKnowsAbout = (vEnt.organization?.knowsAbout as number[]) ?? [];
  const vDescEs = verifyIdentityEs.siteDescription as string;
  const vDescEn = verifyIdentityEn.siteDescription as string;

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('[seed-fase1-poblar] VERIFICACIÓN');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log(`Entity sivar-brains (ID=${vEnt.id}):`);
  console.log(`  sameAs (${vSameAs.length}): ${vSameAs.map((s) => s.url).join(', ')}`);
  console.log(`  knowsAbout (${vKnowsAbout.length}): [${vKnowsAbout.join(', ')}]`);
  console.log('');
  console.log(`SiteIdentity.siteDescription:`);
  console.log(`  ES (${vDescEs?.length ?? 0}c): "${vDescEs}"`);
  console.log(`  EN (${vDescEn?.length ?? 0}c): "${vDescEn}"`);
  console.log('');

  // Assertions
  const checks: Array<{ label: string; pass: boolean }> = [
    { label: 'sameAs = 3 URLs', pass: vSameAs.length === 3 },
    {
      label: 'sameAs tiene cerebrosdemarca.com',
      pass: vSameAs.some((s) => s.url === 'https://cerebrosdemarca.com'),
    },
    { label: 'knowsAbout = 9 topics (7 canónicos + 2 extras B-1)', pass: vKnowsAbout.length === 9 },
    { label: 'siteDescription ES = §1.8 canonical', pass: vDescEs === SITE_DESC_ES },
    { label: 'siteDescription EN = §1.9 canonical', pass: vDescEn === SITE_DESC_EN },
    {
      label: 'siteDescription ES ~155c',
      pass: (vDescEs?.length ?? 0) >= 150 && (vDescEs?.length ?? 0) <= 160,
    },
    {
      label: 'siteDescription EN ~141c',
      pass: (vDescEn?.length ?? 0) >= 135 && (vDescEn?.length ?? 0) <= 150,
    },
  ];

  let allPass = true;
  checks.forEach((c) => {
    const icon = c.pass ? '✅' : '❌';
    if (!c.pass) allPass = false;
    console.log(`  ${icon} ${c.label}`);
  });

  console.log('');
  if (allPass) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('[seed-fase1-poblar] FASE 1 POBLAR ✅ COMPLETA');
    console.log('Cómo valida Zavala:');
    console.log('  Admin → Entities → sivar-brains → organization: knowsAbout=9, sameAs=3');
    console.log('  Admin → SiteIdentity → siteDescription ES+EN = textos SEO-AEO §1.8/§1.9');
    console.log('═══════════════════════════════════════════════════════════');
  } else {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('[seed-fase1-poblar] ⚠️ CHECKS FALLARON — revisar arriba');
    console.log('═══════════════════════════════════════════════════════════');
    process.exit(1);
  }

  process.exit(0);
}

seedFase1Poblar().catch((err) => {
  console.error('[seed-fase1-poblar] ERROR:', err);
  process.exit(1);
});
