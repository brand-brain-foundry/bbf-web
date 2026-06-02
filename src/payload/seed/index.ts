import { getPayload } from 'payload';
import config from '@/payload-config';

async function seed() {
  const payload = await getPayload({ config });

  payload.logger.info('🌱 Starting seed...');

  // === Entities canónicas (Canon v1 §2.3) ===
  const entities = [
    {
      slug: 'bbf',
      kind: 'organization' as const,
      name: 'Brand Brain Foundry',
      description: 'Foundry de cerebros de marca.',
      organization: {
        foundingDate: '2026-01-01T00:00:00.000Z',
        foundingLocation: 'Valencia, España',
      },
      sameAs: [{ url: 'https://linkedin.com/company/brand-brain-foundry' }],
      status: 'active' as const,
    },
    {
      slug: 'zavala',
      kind: 'person' as const,
      name: 'Christian Zavala',
      description: 'Fundador de Brand Brain Foundry. Estratega de marca con oficio Ogilvy.',
      person: {
        jobTitle: 'Founder, Brand Brain Foundry',
        homeLocation: 'Valencia, España',
        nationality: 'El Salvador',
      },
      sameAs: [{ url: 'https://linkedin.com/in/zavala' }],
      status: 'active' as const,
    },
  ];

  for (const e of entities) {
    try {
      const existing = await payload.find({
        collection: 'entities',
        where: { slug: { equals: e.slug } },
        limit: 1,
      });
      if (existing.docs.length > 0) {
        payload.logger.info(`  ⊘ Entity ${e.slug} already exists, skipping`);
        continue;
      }

      const created = await payload.create({ collection: 'entities', data: e as any });
      payload.logger.info(`  ✓ Entity ${e.slug} created (id: ${created.id})`);
    } catch (err) {
      payload.logger.error(`  ✗ Entity ${e.slug} failed: ${err}`);
    }
  }

  // === Topics canónicos (Canon v1 §3.3) ===
  const topics = [
    {
      slug: 'brand-intelligence',
      name: 'Inteligencia de marca',
      kind: 'concept' as const,
      status: 'active' as const,
    },
    {
      slug: 'brand-brain-architecture',
      name: 'Arquitectura de cerebro de marca',
      kind: 'concept' as const,
      status: 'active' as const,
    },
    {
      slug: 'hub-and-spoke',
      name: 'Hub-and-spoke',
      kind: 'method' as const,
      status: 'active' as const,
    },
  ];

  for (const t of topics) {
    try {
      const existing = await payload.find({
        collection: 'topics',
        where: { slug: { equals: t.slug } },
        limit: 1,
      });
      if (existing.docs.length > 0) {
        payload.logger.info(`  ⊘ Topic ${t.slug} already exists, skipping`);
        continue;
      }

      await payload.create({ collection: 'topics', data: t as any });
      payload.logger.info(`  ✓ Topic ${t.slug} created`);
    } catch (err) {
      payload.logger.error(`  ✗ Topic ${t.slug} failed: ${err}`);
    }
  }

  // === Clusters firmados (Canon v1 §4.3) — 4 cornerstones ===
  const cornerstones = [
    {
      code: 'CS-01',
      slug: 'homepage',
      tier: 'cornerstone' as const,
      name: 'Homepage',
      status: 'active' as const,
    },
    {
      code: 'CS-02',
      slug: 'que-es-cerebro-marca',
      tier: 'cornerstone' as const,
      name: 'Qué es un cerebro de marca',
      canonicalSlug: 'cerebro-marca',
      status: 'active' as const,
    },
    {
      code: 'CS-03',
      slug: 'metodo-bbf',
      tier: 'cornerstone' as const,
      name: 'El método BBF',
      canonicalSlug: 'metodo',
      status: 'active' as const,
    },
    {
      code: 'CS-04',
      slug: 'casos-construidos',
      tier: 'cornerstone' as const,
      name: 'Casos construidos',
      canonicalSlug: 'casos',
      status: 'active' as const,
    },
  ];

  for (const c of cornerstones) {
    try {
      const existing = await payload.find({
        collection: 'clusters',
        where: { code: { equals: c.code } },
        limit: 1,
      });
      if (existing.docs.length > 0) {
        payload.logger.info(`  ⊘ Cluster ${c.code} already exists, skipping`);
        continue;
      }

      await payload.create({ collection: 'clusters', data: c as any });
      payload.logger.info(`  ✓ Cluster ${c.code} created`);
    } catch (err) {
      payload.logger.error(`  ✗ Cluster ${c.code} failed: ${err}`);
    }
  }

  // === §3 Caso — seed site-homepage global caseStudy (D-DATA-1: forzar upsert) ===
  // D-DATA-1 firmada: siempre overwrite con valores canónicos de web-copy-optimized.md §3
  try {
    await payload.updateGlobal({
      slug: 'site-homepage',
      locale: 'es',
      data: {
        caseStudy: {
          eyebrow: '● §3 · CASO',
          h2Line1: 'El primer cerebro',
          h2Line2Soft: 'en producción.',
          lead: 'Sivar Brains es el primer cerebro de marca construido por Brand Brain Foundry. Joint venture con Sivar Films en El Salvador. Operando hoy.',
          mediaChromeLabel: 'SIVAR-BRAINS · WhatsApp Business · live',
          mediaTimestamp: 'captura · 23:04 viernes',
          phases: [
            {
              tag: 'Antes',
              title: 'Situación',
              body: 'Sivar Films producía marcas con identidad fuerte pero cada canal vivía en silo. WhatsApp respondía una cosa. Instagram decía otra. La web tenía datos viejos. El equipo gastaba 3-4 horas diarias respondiendo lo mismo en cinco lugares.',
            },
            {
              tag: '12 semanas',
              title: 'Construcción',
              body: 'En 12 semanas montamos su cerebro: ingestamos catálogo, voz, políticas, historia. Conectamos WhatsApp Business, Instagram, web. Activamos generación de contenido desde brief. Configuramos workflows de reservas y pedidos.',
            },
            {
              tag: 'Hoy',
              title: 'Operación',
              body: 'Hoy el cerebro atiende clientes los siete días, genera el contenido semanal de redes, registra reservas en sistema sin intervención humana. Sivar Films opera el cliente final. BBF mantiene y evoluciona el sistema.',
            },
          ],
          quoteText:
            'Un viernes a las 11pm, un cliente abre WhatsApp y pregunta qué vino marida bien con la entraña. La marca responde — con voz, con criterio, con el conocimiento aprobado. Ese mismo conocimiento alimenta el contenido que se publica en redes el sábado.',
          quoteCaption: '— Equipo BBF · Sivar Brains, en operación',
          ctaLabel: 'Leer el caso completo',
          ctaHref: '/casos/sivar-brains',
        },
      } as any,
    });
    payload.logger.info('  ✓ caseStudy (es) upserted con valores canónicos web-copy');
  } catch (err) {
    payload.logger.error(`  ✗ caseStudy seed failed: ${err}`);
  }

  // Pillars + cluster articles: B-BBF-12-SEED-EXPANSION
  payload.logger.info('🌱 Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
