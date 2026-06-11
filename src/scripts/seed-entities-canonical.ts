/**
 * Seed Entities — FASE 4.B.1.B.1
 *
 * Siembra/alinea la collection Entities (Personas + Organizaciones + Conceptos)
 * como fuente de verdad de identidades SB, 100% alineada al canon.
 *
 * Fuentes (jerarquía):
 *   Tier 1: SB_OntologyPrimitives_Canon v1.0.4 §2.8 (catálogo canonical)
 *   Tier 2: SB_ContentMaster_QuienesSomos (bios + roles founders)
 *   Tier 3: seed-site-identity.ts (jobTitles ya aprobados por Zavala)
 *   Filtro: CM-HP v1.2 §6.3 vocabulario prohibido (filtro absoluto)
 *
 * Guards aplicados:
 *   L-BBF-255: audita valores actuales antes de escribir
 *   L-BBF-256: arrays localized — se manejan en paso separado si aplica
 *   D-ALIGN-41: sivar-brains.sameAs = solo perfiles externos (no dominio propio)
 *   §6.3: NUNCA exponer relación multi-tenant en hacienda-real
 *
 * ACCIONES:
 *   ID=1 ('zavala')  → UPDATE slug + fields → 'christian-zavala'
 *   ID=2 ('bbf')     → UPDATE slug + fields → 'brand-brain-foundry'
 *   CREATE 'sivar-brains' (P0 — ROOT org)
 *   CREATE 'brenda-zavala'
 *   CREATE 'pedro-gutierrez'
 *   CREATE 'sivar-films'
 *   CREATE 'hacienda-real'
 *   CREATE 'cerebro-de-marca'
 *   UPDATE Site global → organizationEntity → sivar-brains
 *
 * BLOQUEADOS (requieren schema FASE 4.B):
 *   'el-salvador' — kind:'place' no existe en Entities schema (GA-ENT-01)
 *   'latin-america' — idem
 *   'vip-agencia' — [DIFERIDO-CASO-FUTURO] per D-ONTOLOGY-08
 *
 * Usage:
 *   pnpm tsx src/scripts/seed-entities-canonical.ts
 */

import { getPayload } from 'payload';

import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  // vars expected from shell environment
}

async function seedEntities() {
  const payload = await getPayload({ config });

  console.log('[seed-entities] Iniciando seed canonical Entities — FASE 4.B.1.B.1');

  // ── PASO 1: UPDATE entity 1 (zavala → christian-zavala) ──────────────────
  console.log('\n[1/10] UPDATE entity ID=1: zavala → christian-zavala');

  // ES locale — localized fields: description, person.jobTitle
  await payload.update({
    collection: 'entities',
    id: 1,
    locale: 'es',
    data: {
      slug: 'christian-zavala',
      name: 'Christian Zavala',
      description: 'Co-fundador de Sivar Brains. Arquitecto del método Brand Brain Foundry.',
      externalIds: {
        linkedin: 'https://www.linkedin.com/in/zavalacubas/',
        github: 'https://github.com/zavala-brander',
      },
      sameAs: [
        { url: 'https://www.linkedin.com/in/zavalacubas/' },
        { url: 'https://github.com/zavala-brander' },
      ],
      person: {
        jobTitle: 'Co-fundador · Arquitecto del método',
        homeLocation: 'El Salvador',
        nationality: 'SV',
        knowsLanguage: [{ iso: 'es' }, { iso: 'en' }],
      },
    },
  });

  // EN locale — localized fields only
  await payload.update({
    collection: 'entities',
    id: 1,
    locale: 'en',
    data: {
      description: 'Co-founder of Sivar Brains. Architect of the Brand Brain Foundry method.',
      person: {
        jobTitle: 'Co-founder · Method Architect',
      },
    },
  });

  console.log('[1/10] ✓ christian-zavala updated');

  // ── PASO 2: UPDATE entity 2 (bbf → brand-brain-foundry) ──────────────────
  console.log('\n[2/10] UPDATE entity ID=2: bbf → brand-brain-foundry');

  // ES locale — add missing ES description
  await payload.update({
    collection: 'entities',
    id: 2,
    locale: 'es',
    data: {
      slug: 'brand-brain-foundry',
      name: 'Brand Brain Foundry',
      description: 'Foundry y metodología de cerebros de marca. Desarrollada por Christian Zavala.',
      externalIds: {
        linkedin: 'https://www.linkedin.com/company/brand-brain-foundry',
        github: 'https://github.com/brand-brain-foundry',
      },
      sameAs: [
        { url: 'https://brandbrainfoundry.com' },
        { url: 'https://www.linkedin.com/company/brand-brain-foundry' },
        { url: 'https://github.com/brand-brain-foundry' },
      ],
      organization: {
        foundingDate: '2026-03-01T00:00:00.000Z',
        foundingLocation: 'El Salvador',
      },
    },
  });

  // EN locale — update description (longDescription existente NO se toca: L-BBF-255 guard,
  // contiene vocabulario §6.3 drift — flaggeado para corrección manual en admin)
  await payload.update({
    collection: 'entities',
    id: 2,
    locale: 'en',
    data: {
      description: 'Brand brain foundry and methodology. Developed by Christian Zavala.',
    },
  });

  console.log('[2/10] ✓ brand-brain-foundry updated');
  console.log(
    '       NOTA-DRIFT: longDescription EN de brand-brain-foundry contiene vocabulario §6.3 prohibido.',
  );
  console.log('       Requiere corrección manual en admin → Entities → brand-brain-foundry.');

  // ── PASO 3: CREATE sivar-brains (P0 ROOT) ────────────────────────────────
  console.log('\n[3/10] CREATE sivar-brains (P0 ROOT organization)');

  // D-ALIGN-41: sameAs = solo perfiles externos, NO dominio propio sivarbrains.com
  const sbResult = await payload.create({
    collection: 'entities',
    locale: 'es',
    data: {
      slug: 'sivar-brains',
      kind: 'organization',
      name: 'Sivar Brains',
      description:
        'Estudio que construye, opera y mantiene cerebros de marca para empresas B2B en LATAM.',
      sameAs: [
        { url: 'https://brandbrainfoundry.com' },
        { url: 'https://github.com/brand-brain-foundry' },
      ],
      organization: {
        foundingDate: '2025-10-01T00:00:00.000Z',
        foundingLocation: 'El Salvador',
        areaServed: [{ region: 'El Salvador SV' }, { region: 'Latinoamérica / Latin America' }],
        knowsAbout: [1, 2, 3, 4, 5], // Pillar Topics IDs 1-5 (brand-intelligence..brand-memory-systems)
      },
      status: 'active',
    },
  });

  const sivarBrainsId = sbResult.id;
  console.log(`[3/10] ✓ sivar-brains created (ID=${sivarBrainsId})`);

  // EN locale for description
  await payload.update({
    collection: 'entities',
    id: sivarBrainsId,
    locale: 'en',
    data: {
      description:
        'Studio that builds, operates and maintains brand brains for B2B companies in LATAM.',
    },
  });

  // ── PASO 4: CREATE brenda-zavala ──────────────────────────────────────────
  console.log('\n[4/10] CREATE brenda-zavala');

  // v1.0.4 canonical: Brenda Zavala (L-BBF-251: OntologyPrimitives v1.0.4 > CM-QS older)
  const brendaResult = await payload.create({
    collection: 'entities',
    locale: 'es',
    data: {
      slug: 'brenda-zavala',
      kind: 'person',
      name: 'Brenda Zavala',
      description: 'Co-fundadora de Sivar Brains. Operaciones con cliente.',
      externalIds: {
        linkedin: 'https://www.linkedin.com/in/brenda-zavala-cubas-7720142b/',
      },
      sameAs: [{ url: 'https://www.linkedin.com/in/brenda-zavala-cubas-7720142b/' }],
      person: {
        jobTitle: 'Co-fundadora · Operaciones cliente',
        worksFor: sivarBrainsId,
        homeLocation: 'El Salvador',
        nationality: 'SV',
        knowsLanguage: [{ iso: 'es' }, { iso: 'en' }],
      },
      status: 'active',
    },
  });

  const brendaId = brendaResult.id;
  console.log(`[4/10] ✓ brenda-zavala created (ID=${brendaId})`);

  await payload.update({
    collection: 'entities',
    id: brendaId,
    locale: 'en',
    data: {
      description: 'Co-founder of Sivar Brains. Client operations.',
      person: { jobTitle: 'Co-founder · Client Operations' },
    },
  });

  // ── PASO 5: CREATE pedro-gutierrez ────────────────────────────────────────
  console.log('\n[5/10] CREATE pedro-gutierrez');

  const pedroResult = await payload.create({
    collection: 'entities',
    locale: 'es',
    data: {
      slug: 'pedro-gutierrez',
      kind: 'person',
      name: 'Pedro Gutiérrez',
      description:
        'Co-fundador de Sivar Brains. Comercial y administración. Fundador de Sivar Films.',
      externalIds: {
        linkedin: 'https://www.linkedin.com/in/pedro-gutierrez-2a4a2114/',
      },
      sameAs: [{ url: 'https://www.linkedin.com/in/pedro-gutierrez-2a4a2114/' }],
      person: {
        jobTitle: 'Co-fundador · Comercial y administración',
        worksFor: sivarBrainsId,
        homeLocation: 'El Salvador',
        nationality: 'SV',
        knowsLanguage: [{ iso: 'es' }, { iso: 'en' }],
      },
      status: 'active',
    },
  });

  const pedroId = pedroResult.id;
  console.log(`[5/10] ✓ pedro-gutierrez created (ID=${pedroId})`);

  await payload.update({
    collection: 'entities',
    id: pedroId,
    locale: 'en',
    data: {
      description:
        'Co-founder of Sivar Brains. Commercial and administration. Founder of Sivar Films.',
      person: { jobTitle: 'Co-founder · Commercial and administration' },
    },
  });

  // ── PASO 6: UPDATE christian-zavala → add worksFor + sivar-brains founders ─
  console.log('\n[6/10] UPDATE christian-zavala → worksFor + sivar-brains.founders');

  await payload.update({
    collection: 'entities',
    id: 1, // christian-zavala
    locale: 'es',
    data: {
      person: {
        jobTitle: 'Co-fundador · Arquitecto del método', // preserve
        worksFor: sivarBrainsId,
        homeLocation: 'El Salvador',
        nationality: 'SV',
        knowsLanguage: [{ iso: 'es' }, { iso: 'en' }],
      },
    },
  });

  // Update sivar-brains to add founders
  await payload.update({
    collection: 'entities',
    id: sivarBrainsId,
    locale: 'es',
    data: {
      organization: {
        foundingDate: '2025-10-01T00:00:00.000Z',
        foundingLocation: 'El Salvador',
        areaServed: [{ region: 'El Salvador SV' }, { region: 'Latinoamérica / Latin America' }],
        founders: [1, brendaId, pedroId], // christian-zavala (ID=1), brenda-zavala, pedro-gutierrez
        knowsAbout: [1, 2, 3, 4, 5],
      },
    },
  });

  console.log('[6/10] ✓ christian-zavala worksFor set + sivar-brains founders set');

  // ── PASO 7: CREATE sivar-films ────────────────────────────────────────────
  console.log('\n[7/10] CREATE sivar-films');

  const sivarFilmsResult = await payload.create({
    collection: 'entities',
    locale: 'es',
    data: {
      slug: 'sivar-films',
      kind: 'organization',
      name: 'Sivar Films',
      description: 'Productora audiovisual salvadoreña. Aliado estratégico de Sivar Brains.',
      sameAs: [{ url: 'https://sivarfilms.com' }],
      organization: {
        foundingLocation: 'El Salvador',
        founders: [pedroId], // Pedro Gutiérrez es fundador de Sivar Films
      },
      status: 'active',
    },
  });

  const sivarFilmsId = sivarFilmsResult.id;
  console.log(`[7/10] ✓ sivar-films created (ID=${sivarFilmsId})`);

  await payload.update({
    collection: 'entities',
    id: sivarFilmsId,
    locale: 'en',
    data: {
      description: 'Salvadoran audiovisual production company. Strategic ally of Sivar Brains.',
    },
  });

  // ── PASO 8: CREATE hacienda-real ──────────────────────────────────────────
  console.log('\n[8/10] CREATE hacienda-real');

  // §6.3 guard: NUNCA exponer relación multi-tenant en strings públicos
  const haciendaRealResult = await payload.create({
    collection: 'entities',
    locale: 'es',
    data: {
      slug: 'hacienda-real',
      kind: 'organization',
      name: 'Hacienda Real',
      description: 'Restaurante en El Salvador.',
      sameAs: [], // sin sameAs externo por privacidad per §2.8
      organization: {
        foundingLocation: 'El Salvador',
        areaServed: [{ region: 'El Salvador SV' }],
      },
      status: 'active',
    },
  });

  const haciendaRealId = haciendaRealResult.id;
  console.log(`[8/10] ✓ hacienda-real created (ID=${haciendaRealId})`);

  await payload.update({
    collection: 'entities',
    id: haciendaRealId,
    locale: 'en',
    data: {
      description: 'Restaurant in El Salvador.',
    },
  });

  // ── PASO 9: CREATE cerebro-de-marca ───────────────────────────────────────
  console.log('\n[9/10] CREATE cerebro-de-marca');

  const cerebroResult = await payload.create({
    collection: 'entities',
    locale: 'es',
    data: {
      slug: 'cerebro-de-marca',
      kind: 'concept',
      name: 'Cerebro de marca',
      description:
        'El lugar único donde vive todo lo que una empresa sabe —su voz, su criterio, sus productos, sus procesos— y desde donde la marca responde en cada canal.',
      concept: {
        definition:
          'El lugar único donde vive todo lo que una empresa sabe —su voz, su criterio, sus productos, sus procesos— y desde donde la marca responde en cada canal.',
        field: 'brand-strategy',
      },
      sameAs: [], // sin external ID aún per §2.8
      status: 'active',
    },
  });

  const cerebroId = cerebroResult.id;
  console.log(`[9/10] ✓ cerebro-de-marca created (ID=${cerebroId})`);

  await payload.update({
    collection: 'entities',
    id: cerebroId,
    locale: 'en',
    data: {
      description:
        'The unique place where everything a company knows lives —its voice, its criteria, its products, its processes— and from where the brand responds across every channel.',
      concept: {
        definition:
          'The unique place where everything a company knows lives —its voice, its criteria, its products, its processes— and from where the brand responds across every channel.',
      },
    },
  });

  // ── PASO 10: UPDATE SiteIdentity → organizationEntity → sivar-brains (D-ALIGN-42) ──
  // Site legacy global eliminado (D-ALIGN-43). organizationEntity vive en SiteIdentity.
  console.log('\n[10/10] UPDATE SiteIdentity.organizationEntity → sivar-brains (D-ALIGN-42)');

  await payload.updateGlobal({
    slug: 'site-identity',
    locale: 'es',
    data: {
      organizationEntity: sivarBrainsId,
    },
  });

  console.log(`[10/10] ✓ SiteIdentity.organizationEntity → sivar-brains (ID=${sivarBrainsId})`);

  // ── RESUMEN ───────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('[seed-entities] SEED COMPLETADO — FASE 4.B.1.B.1');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('Entities seeded:');
  console.log(`  ID=1  christian-zavala  (person, UPDATE desde zavala)`);
  console.log(`  ID=2  brand-brain-foundry  (organization, UPDATE desde bbf)`);
  console.log(`  ID=${sivarBrainsId}  sivar-brains  (organization, CREATE P0 ROOT)`);
  console.log(`  ID=${brendaId}  brenda-zavala  (person, CREATE)`);
  console.log(`  ID=${pedroId}  pedro-gutierrez  (person, CREATE)`);
  console.log(`  ID=${sivarFilmsId}  sivar-films  (organization, CREATE)`);
  console.log(`  ID=${haciendaRealId}  hacienda-real  (organization, CREATE)`);
  console.log(`  ID=${cerebroId}  cerebro-de-marca  (concept, CREATE)`);
  console.log('');
  console.log('Relationships set:');
  console.log(
    `  sivar-brains.founders → [christian-zavala(1), brenda-zavala(${brendaId}), pedro-gutierrez(${pedroId})]`,
  );
  console.log(`  sivar-brains.knowsAbout → Topics [1,2,3,4,5]`);
  console.log(`  christian-zavala.worksFor → sivar-brains(${sivarBrainsId})`);
  console.log(`  brenda-zavala.worksFor → sivar-brains(${sivarBrainsId})`);
  console.log(`  pedro-gutierrez.worksFor → sivar-brains(${sivarBrainsId})`);
  console.log(`  sivar-films.founders → [pedro-gutierrez(${pedroId})]`);
  console.log(`  SiteIdentity.organizationEntity → sivar-brains(${sivarBrainsId}) [D-ALIGN-42]`);
  console.log('');
  console.log('BLOQUEADOS (requieren schema FASE 4.B):');
  console.log('  el-salvador — kind:place no existe (GA-ENT-01)');
  console.log('  latin-america — idem');
  console.log('  vip-agencia — [DIFERIDO-CASO-FUTURO] D-ONTOLOGY-08');
  console.log('');
  console.log('NOTA-DRIFT: brand-brain-foundry.longDescription EN contiene vocabulario §6.3.');
  console.log('  → Corregir manualmente en admin → Entities → brand-brain-foundry.');

  process.exit(0);
}

seedEntities().catch((err) => {
  console.error('[seed-entities] ERROR:', err);
  process.exit(1);
});
