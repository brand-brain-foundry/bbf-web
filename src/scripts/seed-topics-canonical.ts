/**
 * Seed Topics Canonical — FASE 4.B.1.A.1 / D-ALIGN-40
 *
 * Sembrar los 5 Pillar Topics del OntologyPrimitives Canon v1.0.4 §3.8.
 * Fuente: SB_OntologyPrimitives_Canon.md §3.8 "Pillar Topics".
 *
 * Topics (slugs kebab-case):
 *   brand-intelligence      — concept, root     → ES: Inteligencia de marca
 *   brand-brain-architecture — concept, parent: brand-intelligence
 *   hub-and-spoke           — method,  parent: brand-brain-architecture
 *   brand-operating-system  — concept, parent: brand-intelligence
 *   brand-memory-systems    — concept, parent: brand-brain-architecture
 *
 * Estrategia: upsert — si existe → update; si no → create.
 * Los 3 primeros ya existen (solo les faltan nombres EN).
 * Los 2 últimos son CREAR.
 *
 * Devuelve los IDs de los 5 topics en orden canónico
 * para que el seed de SiteIdentity los use.
 *
 * Usage:
 *   set -a; source .env.local; set +a; pnpm tsx src/scripts/seed-topics-canonical.ts
 */

import { getPayload } from 'payload';

import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  // vars expected from shell environment
}

async function seedTopics(): Promise<{ slug: string; id: number }[]> {
  const payload = await getPayload({ config });

  console.log('[seed-topics] Iniciando seed Pillar Topics (OntologyPrimitives §3.8)...');

  const topics = [
    {
      slug: 'brand-intelligence',
      kind: 'concept' as const,
      nameES: 'Inteligencia de marca',
      nameEN: 'Brand intelligence',
      parentSlug: null,
    },
    {
      slug: 'brand-brain-architecture',
      kind: 'concept' as const,
      nameES: 'Arquitectura de cerebro de marca',
      nameEN: 'Brand brain architecture',
      parentSlug: 'brand-intelligence',
    },
    {
      slug: 'hub-and-spoke',
      kind: 'method' as const,
      nameES: 'Hub-and-spoke',
      nameEN: 'Hub-and-spoke',
      parentSlug: 'brand-brain-architecture',
    },
    {
      slug: 'brand-operating-system',
      kind: 'concept' as const,
      nameES: 'Sistema operativo de marca',
      nameEN: 'Brand operating system',
      parentSlug: 'brand-intelligence',
    },
    {
      slug: 'brand-memory-systems',
      kind: 'concept' as const,
      nameES: 'Sistemas de memoria de marca',
      nameEN: 'Brand memory systems',
      parentSlug: 'brand-brain-architecture',
    },
  ];

  const results: { slug: string; id: number }[] = [];
  const idMap = new Map<string, number>();

  for (const t of topics) {
    const parentId = t.parentSlug ? idMap.get(t.parentSlug) : undefined;

    // Check if exists
    const existing = await payload.find({
      collection: 'topics',
      where: { slug: { equals: t.slug } },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      const doc = existing.docs[0];
      // Update ES + EN names
      await payload.update({
        collection: 'topics',
        id: doc.id,
        locale: 'es',
        data: { name: t.nameES, ...(parentId ? { parentTopic: parentId } : {}) },
      });
      await payload.update({
        collection: 'topics',
        id: doc.id,
        locale: 'en',
        data: { name: t.nameEN },
      });
      console.log(`[seed-topics] ✅ UPDATED  ${t.slug} (id=${doc.id})`);
      idMap.set(t.slug, doc.id as number);
      results.push({ slug: t.slug, id: doc.id as number });
    } else {
      // Create ES first (creates record), then update EN
      const created = await payload.create({
        collection: 'topics',
        locale: 'es',
        data: {
          slug: t.slug,
          kind: t.kind,
          name: t.nameES,
          status: 'active',
          ...(parentId ? { parentTopic: parentId } : {}),
        },
      });
      await payload.update({
        collection: 'topics',
        id: created.id,
        locale: 'en',
        data: { name: t.nameEN },
      });
      console.log(`[seed-topics] ✅ CREATED  ${t.slug} (id=${created.id})`);
      idMap.set(t.slug, created.id as number);
      results.push({ slug: t.slug, id: created.id as number });
    }
  }

  console.log('');
  console.log('[seed-topics] ✅ 5 Pillar Topics seeded:');
  for (const r of results) {
    console.log(`   ${r.slug} → id=${r.id}`);
  }

  return results;
}

seedTopics()
  .then((ids) => {
    console.log('');
    console.log(
      '[seed-topics] IDs para SiteIdentity.schemaKnowsAbout:',
      JSON.stringify(ids.map((r) => r.id)),
    );
    process.exit(0);
  })
  .catch((err) => {
    console.error('[seed-topics] ❌ Error:', err);
    process.exit(1);
  });
