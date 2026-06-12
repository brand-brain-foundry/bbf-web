/* eslint-disable no-console */
// GUARD MÁXIMO: PROHIBIDO tocar blocks/layout/richText en clusters existentes.
// Este script SOLO actualiza: canonicalSlug (fix D-ONTOLOGY-09), name EN, topicRefs.
try {
  process.loadEnvFile('/Volumes/PK/BBF/Repos/bbf-web/.env.local');
} catch {
  // CI: vars already injected
}

import { getPayload } from 'payload';
import config from '../payload.config';

async function main() {
  const payload = await getPayload({ config });

  // ── Fetch all topic IDs by slug ─────────────────────────────────────────
  const topicSlugs = [
    'brand-intelligence',
    'brand-brain-architecture',
    'hub-and-spoke',
    'brand-operating-system',
    'brand-memory-systems',
    'ai-agents-for-brand',
    'brand-content-automation',
    'multi-channel-brand-orchestration',
    'brand-voice-consistency',
    'b2b-brand-latam',
    'motor-de-contenido',
  ];
  const topicIdMap = new Map<string, number>();
  for (const slug of topicSlugs) {
    const r = await payload.find({ collection: 'topics', where: { slug: { equals: slug } } });
    if (r.docs[0]) topicIdMap.set(slug, r.docs[0].id as number);
  }
  console.log(`[seed-clusters-b2] Topics found: ${topicIdMap.size}/${topicSlugs.length}`);

  // ── Fetch all 4 cornerstone cluster IDs by code ─────────────────────────
  const clusterCodes = ['CS-01', 'CS-02', 'CS-03', 'CS-04'];
  const clusterIdMap = new Map<string, number>();
  for (const code of clusterCodes) {
    const r = await payload.find({ collection: 'clusters', where: { code: { equals: code } } });
    if (r.docs[0]) clusterIdMap.set(code, r.docs[0].id as number);
  }
  console.log(`[seed-clusters-b2] Clusters found: ${clusterIdMap.size}/4`);

  // ── CS-03: fix canonicalSlug ES (D-ONTOLOGY-09) ─────────────────────────
  // Old value: 'metodo' (DRIFT). Correct: 'como-trabajamos'.
  const cs03Id = clusterIdMap.get('CS-03');
  if (cs03Id) {
    await payload.update({
      collection: 'clusters',
      id: cs03Id,
      locale: 'es',
      data: { canonicalSlug: 'como-trabajamos' },
    });
    console.log('   ✅ CS-03 canonicalSlug_es: metodo → como-trabajamos (D-ONTOLOGY-09)');
  }

  // ── EN names for all 4 cornerstones ─────────────────────────────────────
  // Canon §4.8 has ES names only. EN translations per OntologyPrimitives conventions.
  // CS-03: 'How we work' — paralelo ES 'Cómo trabajamos'.
  // D2 firmada Zavala: 'The BBF method' violaba §6.5 (BBF como sujeto público).
  const enNames: Record<string, string> = {
    'CS-01': 'Homepage',
    'CS-02': 'What is a brand brain',
    'CS-03': 'How we work',
    'CS-04': 'Built cases',
  };
  for (const [code, nameEn] of Object.entries(enNames)) {
    const id = clusterIdMap.get(code);
    if (id) {
      await payload.update({
        collection: 'clusters',
        id,
        locale: 'en',
        data: { name: nameEn },
      });
      console.log(`   ✅ ${code} name_en: "${nameEn}"`);
    }
  }

  // ── topicRefs for all 4 cornerstones ────────────────────────────────────
  // Source: OntologyPrimitives_Canon §4.5 (CS-01) and §4.8 table (CS-02..04)
  // GAP-CLU-01: Canon §4.8 lists 'cerebro-de-marca' for CS-02 but that topic
  //   does not exist in §3.8 catalog. Mapped to brand-brain-architecture (same
  //   semantic concept: brand brain = cerebro de marca). Flagged below.
  type TopicRef = { topic: number; weight: number };

  const buildRefs = (entries: Array<[string, number]>): TopicRef[] =>
    entries
      .map(([slug, weight]) => {
        const id = topicIdMap.get(slug);
        if (!id) {
          console.log(`   ⚠️ topic '${slug}' not found — skipping ref`);
          return null;
        }
        return { topic: id, weight };
      })
      .filter((r): r is TopicRef => r !== null);

  const topicRefsMap: Record<string, TopicRef[]> = {
    'CS-01': buildRefs([
      ['brand-intelligence', 1.0], // §4.5 explicit
      ['brand-brain-architecture', 0.8],
      ['hub-and-spoke', 0.6],
    ]),
    'CS-02': buildRefs([
      ['brand-brain-architecture', 1.0], // GAP-CLU-01: 'cerebro-de-marca' → brand-brain-architecture
      ['brand-operating-system', 0.8],
    ]),
    'CS-03': buildRefs([
      ['brand-content-automation', 1.0],
      ['multi-channel-brand-orchestration', 0.8],
    ]),
    'CS-04': buildRefs([['brand-intelligence', 1.0]]),
  };

  for (const [code, refs] of Object.entries(topicRefsMap)) {
    const id = clusterIdMap.get(code);
    if (id && refs.length > 0) {
      await payload.update({
        collection: 'clusters',
        id,
        data: { topicRefs: refs },
      });
      console.log(`   ✅ ${code} topicRefs set: ${refs.length} refs`);
    }
  }

  // ── GAP LIST ────────────────────────────────────────────────────────────
  console.log('');
  console.log('📋 GAP LIST — Clusters B.3:');
  console.log('   GAP-CLU-01: Canon §4.8 CS-02 dice "cerebro-de-marca" como topicRef principal.');
  console.log(
    '     "cerebro-de-marca" no existe en Topics §3.8. Mapeado a brand-brain-architecture',
  );
  console.log('     (cerebro de marca = brand brain, mismo concepto). Requiere validación Zavala.');
  console.log('   GAP-CLU-02: canonicalSlug EN para CS-01..04 no definido en Canon §4.8.');
  console.log(
    '     Solo Pillars (P1-P6) tienen canonicalSlug EN definido. Cornerstones: pendiente.',
  );
  console.log(
    '   GAP-CLU-03: Pillars P1..P6 NO sembrados en esta fase (B.2 scope = cornerstones).',
  );
  console.log(
    '     P6 blog-pillar activación requiere D-ONTOLOGY-10 (FASE 4.B — fuera de scope B.2).',
  );

  process.exit(0);
}

main().catch((e) => {
  console.error('[seed-clusters-b2] ❌ Error:', e);
  process.exit(1);
});
