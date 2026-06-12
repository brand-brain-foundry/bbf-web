/* eslint-disable no-console */
try {
  process.loadEnvFile('/Volumes/PK/BBF/Repos/bbf-web/.env.local');
} catch {
  // CI: vars already injected
}

import { getPayload } from 'payload';
import config from '../payload.config';

async function main() {
  const payload = await getPayload({ config });

  // ── STEP 1: Build slug → id map for existing pillar topics ──────────────
  const pillarSlugs = [
    'brand-intelligence',
    'brand-brain-architecture',
    'hub-and-spoke',
    'brand-operating-system',
    'brand-memory-systems',
  ];
  const topicIdMap = new Map<string, number>();
  for (const slug of pillarSlugs) {
    const r = await payload.find({ collection: 'topics', where: { slug: { equals: slug } } });
    if (r.docs[0]) topicIdMap.set(slug, r.docs[0].id as number);
  }
  console.log(`[seed-topics-b2] Found ${topicIdMap.size} existing pillar topics`);

  // ── STEP 2: Set parentTopic for 4 existing pillar topics ────────────────
  // brand-intelligence is top-level (parent = null) → no update needed
  const parentUpdates: Array<{ slug: string; parent: string }> = [
    { slug: 'brand-brain-architecture', parent: 'brand-intelligence' },
    { slug: 'hub-and-spoke', parent: 'brand-brain-architecture' },
    { slug: 'brand-operating-system', parent: 'brand-intelligence' },
    { slug: 'brand-memory-systems', parent: 'brand-brain-architecture' },
  ];
  for (const { slug, parent } of parentUpdates) {
    const id = topicIdMap.get(slug);
    const parentId = topicIdMap.get(parent);
    if (id && parentId) {
      await payload.update({ collection: 'topics', id, data: { parentTopic: parentId } });
      console.log(`   ✅ parentTopic set: ${slug} → ${parent} (ID ${parentId})`);
    } else {
      console.log(
        `   ⚠️ SKIP parentTopic: ${slug} (id=${id}) or parent ${parent} (id=${parentId}) missing`,
      );
    }
  }

  // ── STEP 3: Create 6 cluster topics ────────────────────────────────────
  // Sources: OntologyPrimitives_Canon §3.8 cluster topics + D-ONTOLOGY-09
  type NewTopic = {
    slug: string;
    kind: 'concept' | 'method' | 'sector' | 'tool';
    nameEs: string;
    nameEn: string;
    parentSlug: string | null;
  };

  const clusterTopics: NewTopic[] = [
    {
      slug: 'ai-agents-for-brand',
      kind: 'concept',
      nameEs: 'Agentes IA para marca',
      nameEn: 'AI agents for brand',
      parentSlug: 'brand-intelligence',
    },
    {
      slug: 'brand-content-automation',
      kind: 'method',
      nameEs: 'Automatización de contenido de marca',
      nameEn: 'Brand content automation',
      parentSlug: 'brand-brain-architecture',
    },
    {
      slug: 'multi-channel-brand-orchestration',
      kind: 'method',
      nameEs: 'Orquestación multicanal de marca',
      nameEn: 'Multi-channel brand orchestration',
      parentSlug: 'brand-brain-architecture',
    },
    {
      slug: 'brand-voice-consistency',
      kind: 'concept',
      nameEs: 'Consistencia de voz de marca',
      nameEn: 'Brand voice consistency',
      parentSlug: 'brand-intelligence',
    },
    {
      slug: 'b2b-brand-latam',
      kind: 'sector',
      nameEs: 'Marca B2B en LATAM',
      nameEn: 'B2B brand in LATAM',
      parentSlug: null, // top-level sector
    },
    // motor-de-contenido LAST — parent = brand-content-automation (created above)
    {
      slug: 'motor-de-contenido',
      kind: 'concept',
      nameEs: 'Motor de contenido',
      nameEn: 'Content engine',
      parentSlug: 'brand-content-automation',
    },
  ];

  for (const t of clusterTopics) {
    const existing = await payload.find({
      collection: 'topics',
      where: { slug: { equals: t.slug } },
    });
    if (existing.docs[0]) {
      console.log(`   ⚠️ ${t.slug} ya existe (id: ${existing.docs[0].id}) — skip create`);
      topicIdMap.set(t.slug, existing.docs[0].id as number);
      continue;
    }

    const parentId = t.parentSlug ? topicIdMap.get(t.parentSlug) : undefined;
    const created = await payload.create({
      collection: 'topics',
      data: {
        slug: t.slug,
        kind: t.kind,
        name: t.nameEs,
        ...(parentId != null ? { parentTopic: parentId } : {}),
        status: 'active',
      },
    });
    await payload.update({
      collection: 'topics',
      id: created.id as number,
      locale: 'en',
      data: { name: t.nameEn },
    });
    topicIdMap.set(t.slug, created.id as number);
    console.log(`   ✅ Created: ${t.slug} (id: ${created.id})`);
  }

  // ── GAP LIST ────────────────────────────────────────────────────────────
  console.log('');
  console.log('📋 GAP LIST — Topics B.2:');
  console.log(
    '   GAP-TOP-01: descriptions no definidas en Canon §3.8 → null para todos los topics',
  );
  console.log('   GAP-TOP-02: wikidataQID no definido en Canon §3.8 para cluster topics → null');
  console.log('   GAP-TOP-03: searchKeywords no definido en Canon §3.8 → null');
  console.log(
    '   GAP-TOP-04: parentTopic para "brand-intelligence" es null (top-level) — confirmado §3.8',
  );
  console.log(
    '   GAP-TOP-05: parentTopic para "b2b-brand-latam" es null (top-level sector) — confirmado §3.8',
  );

  process.exit(0);
}

main().catch((e) => {
  console.error('[seed-topics-b2] ❌ Error:', e);
  process.exit(1);
});
