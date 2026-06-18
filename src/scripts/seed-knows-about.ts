/**
 * Seed knowsAbout — FIX-KNOWS-ABOUT (FASE 3B)
 * Despacho: B-BBF-WEB-HOME-FASE3B-FIXES · D-FASE3B-KNOWS-01
 *
 * Crea/upsert los 10 topics canónicos del SEO-AEO §2.9 y actualiza
 * Entity 'sivar-brains'.organization.knowsAbout a esos 10.
 *
 * SUPERSEDE: D-FASE1 (3 topics: brand-intelligence, brand-brain-architecture,
 * hub-and-spoke) → D-FASE3B-KNOWS-01: knowsAbout = 10 topics §2.9.
 * Razón: "Hub-and-spoke" es término §6.3 prohibido; nombres ES no alineados
 * con schema.org (§2.9 usa EN como estándar para entidades internacionales).
 *
 * 'hub-and-spoke' queda en DB (registro histórico) pero sale del Entity.
 *
 * Usage:
 *   set -a; source .env.local; set +a && pnpm tsx src/scripts/seed-knows-about.ts
 */

import { getPayload } from 'payload';

import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  // vars expected from shell environment
}

// SEO-AEO §2.9 — literales EXACTOS del canon (verificado 2026-06-18)
const CANONICAL_TOPICS = [
  { slug: 'brand-intelligence-systems', name: 'Brand intelligence systems' },
  { slug: 'brand-operating-systems', name: 'Brand operating systems' },
  { slug: 'brand-brain-construction', name: 'Brand brain construction and operation' },
  { slug: 'multi-channel-brand-orchestration', name: 'Multi-channel brand orchestration' },
  { slug: 'conversational-brand-agents', name: 'Conversational brand agents' },
  { slug: 'brand-content-automation', name: 'Brand content automation' },
  { slug: 'brand-voice-consistency', name: 'Brand voice consistency at scale' },
  { slug: 'proprietary-brand-ai', name: 'Proprietary brand AI' },
  { slug: 'brand-memory-systems', name: 'Brand memory systems' },
  { slug: 'b2b-brand-operationalization', name: 'B2B brand operationalization' },
] as const;

async function seedKnowsAbout() {
  const payload = await getPayload({ config });

  console.log('[seed-knows-about] D-FASE3B-KNOWS-01 — 10 topics §2.9 + Entity sivar-brains');
  console.log('[seed-knows-about] SUPERSEDE: D-FASE1 knowsAbout (3 topics) → 10 §2.9');

  // ── PASO 1: Crear/upsert 10 topics §2.9 ─────────────────────────────────────
  console.log('\n[1/3] Creando/upserting 10 topics canónicos §2.9...');
  const topicIds: number[] = [];

  for (const topic of CANONICAL_TOPICS) {
    const existing = await payload.find({
      collection: 'topics',
      where: { slug: { equals: topic.slug } },
      limit: 1,
    });

    let id: number;
    if (existing.docs.length > 0) {
      id = existing.docs[0].id as number;
      // Update name in case it drifted
      await payload.update({
        collection: 'topics',
        id,
        data: { name: topic.name },
      });
      console.log(`  ⊘ ${topic.slug} ya existe (id=${id}) — nombre actualizado`);
    } else {
      const created = await payload.create({
        collection: 'topics',
        data: {
          slug: topic.slug,
          name: topic.name,
          kind: 'concept' as const,
          status: 'active' as const,
        },
      });
      id = created.id as number;
      console.log(`  ✓ ${topic.slug} creado (id=${id})`);
    }

    topicIds.push(id);
  }

  console.log(`\n[1/3] ✅ ${topicIds.length} topic IDs listos`);

  // ── PASO 2: Actualizar Entity 'sivar-brains' → organization.knowsAbout ───────
  console.log('\n[2/3] Actualizando Entity sivar-brains.organization.knowsAbout...');

  const entityResult = await payload.find({
    collection: 'entities',
    where: { slug: { equals: 'sivar-brains' } },
    limit: 1,
  });

  if (entityResult.docs.length === 0) {
    throw new Error('[seed-knows-about] ERROR: Entity sivar-brains no encontrada');
  }

  const entityId = entityResult.docs[0].id as number;

  await payload.update({
    collection: 'entities',
    id: entityId,
    data: {
      organization: {
        // @ts-justify: Payload v3 relationship accepts number[] for hasMany (IDs)
        knowsAbout: topicIds as unknown as number[],
      },
    },
  });

  console.log(`[2/3] ✅ Entity ${entityId} actualizada con ${topicIds.length} knowsAbout`);

  // ── PASO 3: Verificación ─────────────────────────────────────────────────────
  console.log('\n[3/3] Verificación final...');

  const verified = await payload.find({
    collection: 'entities',
    where: { slug: { equals: 'sivar-brains' } },
    depth: 1,
    limit: 1,
  });

  const updatedEntity = verified.docs[0];
  // @ts-justify: Payload v3 populated relationship depth=1 — items son Topic objects con id:number
  const knowsAbout = (updatedEntity?.organization?.knowsAbout ?? []) as unknown as Array<{
    id: number;
    name: string;
    slug: string;
  }>;

  console.log(`\n  knowsAbout en Entity (${knowsAbout.length} items):`);
  for (const t of knowsAbout) {
    const isProhibited = t.slug === 'hub-and-spoke';
    console.log(`  ${isProhibited ? '❌ PROHIBIDO' : '✅'} "${t.name}" (${t.slug})`);
  }

  const hasProhibited = knowsAbout.some((t) => t.slug === 'hub-and-spoke');
  const hasAll10 = knowsAbout.length === 10;

  console.log('');
  if (!hasProhibited && hasAll10) {
    console.log('✅ D-FASE3B-KNOWS-01 APLICADO');
    console.log('   10 topics §2.9 en Entity.organization.knowsAbout');
    console.log('   hub-and-spoke: fuera del enlace (en DB como registro histórico)');
    console.log('   SUPERSEDE: D-FASE1 knowsAbout → D-FASE3B-KNOWS-01 (firmado Zavala 2026-06-18)');
  } else {
    if (hasProhibited) console.log('❌ ERROR: hub-and-spoke aún presente');
    if (!hasAll10) console.log(`❌ ERROR: esperaba 10 items, encontré ${knowsAbout.length}`);
    process.exit(1);
  }

  process.exit(0);
}

seedKnowsAbout().catch((err) => {
  console.error('[seed-knows-about] ERROR:', err);
  process.exit(1);
});
