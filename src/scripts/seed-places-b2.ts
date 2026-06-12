/* eslint-disable no-console */
// BLOQUE 4 — seed place entities (FASE 4.B)
// Requires kind 'place' added to Entities collection (done in FASE 4.B.2).
// Source: OntologyPrimitives_Canon §2.8
try {
  process.loadEnvFile('/Volumes/PK/BBF/Repos/bbf-web/.env.local');
} catch {
  // CI: vars already injected
}

import { getPayload } from 'payload';
import config from '../payload.config';

async function main() {
  const payload = await getPayload({ config });

  // Entity 'name' is NOT localized (single text field).
  // For latin-america: use English canonical + alternateNames_es = 'América Latina'.
  // Entity 'description' IS localized — set ES + EN separately.
  // externalIds.wikidata: QID string (e.g. 'Q792')

  type PlaceToSeed = {
    slug: string;
    name: string; // canonical (non-localized)
    alternateNameEs?: string;
    descriptionEs?: string;
    descriptionEn?: string;
    wikidataQID: string;
  };

  const places: PlaceToSeed[] = [
    {
      slug: 'el-salvador',
      name: 'El Salvador',
      descriptionEs: 'País de América Central. Mercado primario de Sivar Brains.',
      descriptionEn: 'Country in Central America. Primary market of Sivar Brains.',
      wikidataQID: 'Q792',
    },
    {
      slug: 'latin-america',
      name: 'Latin America',
      alternateNameEs: 'América Latina',
      descriptionEs: 'Región de servicio de Sivar Brains.',
      descriptionEn: 'Service region of Sivar Brains.',
      wikidataQID: 'Q12585',
    },
  ];

  for (const p of places) {
    const existing = await payload.find({
      collection: 'entities',
      where: { slug: { equals: p.slug } },
    });
    if (existing.docs[0]) {
      console.log(`   ⚠️ ${p.slug} ya existe (id: ${existing.docs[0].id}) — skip`);
      continue;
    }

    const created = await payload.create({
      collection: 'entities',
      data: {
        slug: p.slug,
        kind: 'place' as 'organization' | 'person' | 'concept' | 'tool',
        name: p.name,
        ...(p.descriptionEs ? { description: p.descriptionEs } : {}),
        externalIds: {
          wikidata: p.wikidataQID,
        },
        status: 'active',
      },
    });
    console.log(`   ✅ Created entity: ${p.slug} (id: ${created.id})`);

    // Set EN description
    if (p.descriptionEn) {
      await payload.update({
        collection: 'entities',
        id: created.id as number,
        locale: 'en',
        data: { description: p.descriptionEn },
      });
    }

    // Set alternateNames_es for latin-america
    if (p.alternateNameEs) {
      await payload.update({
        collection: 'entities',
        id: created.id as number,
        locale: 'es',
        data: { alternateNames: [{ value: p.alternateNameEs }] },
      });
    }

    console.log(`   ✅ ${p.slug} localized fields set`);
  }

  // ── GAP LIST ────────────────────────────────────────────────────────────
  console.log('');
  console.log('📋 GAP LIST — Entities Places B.4:');
  console.log('   GAP-ENT-01: entity.name es non-localized → "Latin America" en inglés.');
  console.log('     "América Latina" guardada en alternateNames_es.');
  console.log('     Si se necesita name localizado en FASE 6: requiere schema change (D-sign).');
  console.log('   GAP-ENT-02: areaServed en Organization entity (sivar-brains) no actualizado');
  console.log('     para apuntar a el-salvador / latin-america entities. Scope B.3 (Surfaces).');
  console.log(
    '   GAP-ENT-03: place kind no tiene group fields en Entities schema (solo person/org/concept/tool).',
  );
  console.log(
    '     Place entities usan campos base: slug, name, description, externalIds, sameAs.',
  );

  process.exit(0);
}

main().catch((e) => {
  console.error('[seed-places-b2] ❌ Error:', e);
  process.exit(1);
});
