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
      name: 'Brand Brain Foundry', // producer entity — preserved intentionally
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
      description:
        'Fundador de Sivar Brains y Brand Brain Foundry. Estratega de marca con oficio Ogilvy.',
      person: {
        jobTitle: 'Founder, Sivar Brains',
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

  // === §4 Por qué — seed site-homepage global comparison (Versión B firmada Zavala 2026-06-02)
  // 3 columnas: SaaS / Chatbot · Trabajo manual · Cerebro de marca (highlighted).
  // Contenido: despacho B-BBF-WEB-S4-PORQUE-FASES-2A6 §2C.
  // Nota: state='text' para todas las celdas (V-B no usa yes/no/mid — el énfasis BBF
  // lo gestiona el flag isHighlighted de la columna + CSS del componente.
  try {
    await payload.updateGlobal({
      slug: 'site-homepage',
      locale: 'es',
      data: {
        comparison: {
          eyebrow: '§4 · POR QUÉ',
          h2Line1: 'La diferencia entre alquilar y ser dueño',
          h2Line2Soft: '',
          lead: 'Hoy tu empresa enfrenta dos costos invisibles: el SaaS que alquilás sin ser tuyo, y el trabajo repetitivo que tu equipo hace a mano. Un cerebro de marca cierra ambos.',
          columns: [
            { label: 'SaaS / Chatbot', isHighlighted: false },
            { label: 'Trabajo manual', isHighlighted: false },
            { label: 'Cerebro de marca', isHighlighted: true },
          ],
          rows: [
            {
              attribute: 'Propiedad',
              cells: [
                { state: 'text', value: 'Suya' },
                { state: 'text', value: 'Tuya, pero diluida' },
                { state: 'text', value: 'Tuya, código + datos' },
              ],
            },
            {
              attribute: 'Aprende tu empresa',
              cells: [
                { state: 'text', value: 'Promedio mercado' },
                { state: 'text', value: 'Por persona' },
                { state: 'text', value: 'Tu memoria específica' },
              ],
            },
            {
              attribute: 'Voz consistente',
              cells: [
                { state: 'text', value: 'Aproximada' },
                { state: 'text', value: 'Depende de quién' },
                { state: 'text', value: 'Exacta, siempre' },
              ],
            },
            {
              attribute: 'Disponibilidad',
              cells: [
                { state: 'text', value: '24/7' },
                { state: 'text', value: 'Horario laboral' },
                { state: 'text', value: '24/7' },
              ],
            },
            {
              attribute: 'Escala',
              cells: [
                { state: 'text', value: 'Pagás por uso' },
                { state: 'text', value: 'Contratar más' },
                { state: 'text', value: 'Sin costo lineal' },
              ],
            },
            {
              attribute: 'Gobernanza',
              cells: [
                { state: 'text', value: 'Del proveedor' },
                { state: 'text', value: 'Sin trazabilidad' },
                { state: 'text', value: 'Tuya, auditable' },
              ],
            },
            {
              attribute: 'Portabilidad',
              cells: [
                { state: 'text', value: 'No, lock-in' },
                { state: 'text', value: 'Sí, pero en personas' },
                { state: 'text', value: 'Sí, sistema propio' },
              ],
            },
            {
              attribute: 'Costo a 3 años',
              cells: [
                { state: 'text', value: 'Sube cada año' },
                { state: 'text', value: 'Sube con escala' },
                { state: 'text', value: 'Inversión que se aprecia' },
              ],
            },
          ],
          epilogue: {
            title: 'La diferencia operativa',
            body: 'Un SaaS te da acceso temporal a una herramienta que también usan tus competidores. El día que cancelás, no te llevás nada.\n\nEl trabajo manual repetitivo no escala. Cada nuevo cliente, cada nuevo canal, cada nueva pregunta — más horas, más personas, más costo.\n\nUn cerebro de marca es tuyo. Vive en tu infraestructura. Opera con tu voz exacta. Absorbe el trabajo repetitivo que hoy consume a tu equipo y libera horas para lo que solo un humano puede hacer: dirigir.',
          },
        },
      } as any,
    });
    payload.logger.info('  ✓ comparison §4 (es) seeded con Versión B firmada (3 cols × 8 rows)');
  } catch (err) {
    payload.logger.error(`  ✗ comparison §4 seed failed: ${err}`);
  }

  // === §5 Método — seed site-homepage global method (D-S5-08 firmada: schema simple {text})
  // D-DATA: forzar upsert con valores canónicos de web-copy-optimized.md §5
  try {
    await payload.updateGlobal({
      slug: 'site-homepage',
      locale: 'es',
      data: {
        method: {
          eyebrow: '§5 · MÉTODO',
          h2Line1: 'Tres servicios coordinados.',
          h2Line2Soft: 'Sin sorpresas.',
          phases: [
            { number: '01', shortLabel: 'Diagnóstico' },
            { number: '02', shortLabel: 'Build' },
            { number: '03', shortLabel: 'Retainer' },
          ],
          services: [
            {
              number: '01',
              name: 'Diagnóstico',
              duration: '2 – 3 semanas',
              commitment: 'Alcance cerrado · sin recurrencia',
              body: 'Antes de construir nada, entendemos tu marca. Auditamos lo que existe, mapeamos lo que falta y diseñamos el sistema que vas a operar.',
              deliverables: [
                { text: 'Blueprint del cerebro de marca' },
                { text: 'Roadmap de construcción priorizado' },
                { text: 'Propuesta cerrada con alcance y costo' },
                { text: 'Si no es viable, lo decimos' },
              ],
            },
            {
              number: '02',
              name: 'Build',
              duration: '8 – 24 semanas',
              commitment: 'Según alcance · sistema propietario',
              body: 'Construimos el cerebro: ingestamos conocimiento, configuramos voz y políticas, integramos canales, activamos workflows. Al terminar, el sistema es tuyo.',
              deliverables: [
                { text: 'Ingesta de conocimiento de marca' },
                { text: 'Voz, políticas y criterios configurados' },
                { text: 'Integraciones de canal activas' },
                { text: 'Documentación y transferencia completa' },
              ],
            },
            {
              number: '03',
              name: 'Retainer',
              duration: 'Mensual · renovable',
              commitment: 'Sin lock-in · cancelable en cualquier momento',
              body: 'El cerebro mejora con cada uso. Mantenemos el sistema, incorporamos nuevos casos de uso, abrimos nuevos canales y evolucionamos la arquitectura mes a mes.',
              deliverables: [
                { text: 'Mejora continua del sistema' },
                { text: 'Nuevos casos de uso activados' },
                { text: 'Nuevos canales integrados' },
                { text: 'El cerebro mejora mes a mes' },
              ],
            },
          ],
          ctaLabel: 'Conocer el método completo',
          ctaHref: '/metodo',
        },
      } as any,
    });
    payload.logger.info('  ✓ method §5 (es) seeded con valores canónicos web-copy');
  } catch (err) {
    payload.logger.error(`  ✗ method §5 seed failed: ${err}`);
  }

  // === §6 Cierre — seed site-homepage global closing (D-S6-05..08 firmadas)
  try {
    await payload.updateGlobal({
      slug: 'site-homepage',
      locale: 'es',
      data: {
        closing: {
          eyebrow: '§6 · CIERRE',
          brandLine: 'Sivar Brains',
          brandYear: null, // fallback dinámico en runtime → new Date().getFullYear()
          statementLine1: 'Tu marca aprende una vez.',
          statementLine2Soft: 'Te representa en todos lados.',
          cta: {
            label: 'Sentémonos a pensar',
            href: '/contacto',
          },
          ctaNote: 'Diagnóstico cerrado · 2-3 semanas · sin compromiso de continuar',
          signatureTagline: 'No hay urgencia. Hay método.',
        },
      } as any,
    });
    payload.logger.info('  ✓ closing §6 (es) seeded con valores canónicos web-copy');
  } catch (err) {
    payload.logger.error(`  ✗ closing §6 seed failed: ${err}`);
  }

  // === SiteNavigation — Cerebro de marca subLinks (F4b · Zavala firma 2026-06-23) ===
  // Patrón: findGlobal primero para preservar links existentes + ser idempotente.
  // Solo modifica Cerebro de marca (routeKey '/cerebro-marca'). headerCta + footerGroups: intactos.
  try {
    // ── ES ─────────────────────────────────────────────────────────────────────
    const currentNavEs = await payload.findGlobal({
      slug: 'site-navigation',
      locale: 'es',
      depth: 1,
    });
    const currentLinksEs = (currentNavEs as any)?.headerLinks ?? [];

    const SUBLINKS_ES = [
      {
        label: 'La arquitectura',
        linkTarget: { external: '/cerebro-marca#la-arquitectura' },
        description:
          'Memoria central + 5 servicios que coordinan tu marca en cada canal con tu voz',
        icon: 'layers',
        mediaType: 'none',
        media: null,
      },
      {
        label: 'Qué lo diferencia',
        linkTarget: { external: '/cerebro-marca#que-lo-diferencia' },
        description:
          'Cómo se separa del chatbot y el SaaS: propiedad, voz, escalabilidad sin costo extra',
        icon: 'target',
        mediaType: 'none',
        media: null,
      },
      {
        label: 'Cuándo tiene sentido',
        linkTarget: { external: '/cerebro-marca#cuando-construir-uno' },
        description:
          'Tres condiciones concretas para saber si tu empresa está lista para construir uno',
        icon: 'checkCircle',
        mediaType: 'none',
        media: null,
      },
      {
        label: 'Un activo propio',
        linkTarget: { external: '/cerebro-marca#por-que-es-un-activo' },
        description: 'Tuyo: código, datos, configuración. Sin costos que suben al escalar',
        icon: 'award',
        mediaType: 'none',
        media: null,
      },
    ];

    const SUBLINKS_EN_LABELS = [
      'The architecture',
      'What sets it apart',
      'When it makes sense',
      'An asset of your own',
    ];
    const SUBLINKS_EN_DESCS = [
      'Central memory + 5 services that coordinate your brand across every channel in your voice',
      'How it differs from chatbot and SaaS: ownership, voice, scale without extra cost',
      'Three concrete conditions to know if your company is ready to build one',
      'Yours: code, data, configuration. No costs that rise as you scale',
    ];

    // Idempotency: preserve existing subLink IDs if already seeded
    const cerebroEs = currentLinksEs.find((l: any) => l?.linkTarget?.routeKey === '/cerebro-marca');
    const existingSubsEs: any[] = cerebroEs?.subLinks ?? [];

    const subLinksEsWithIds = SUBLINKS_ES.map((sub, i) => ({
      ...(existingSubsEs[i]?.id ? { id: existingSubsEs[i].id } : {}),
      ...sub,
    }));

    const updatedLinksEs = currentLinksEs.map((link: any) => {
      if (link?.linkTarget?.routeKey === '/cerebro-marca') {
        return { ...link, hasSubMenu: true, subLinks: subLinksEsWithIds };
      }
      return link;
    });

    await payload.updateGlobal({
      slug: 'site-navigation',
      locale: 'es',
      data: { headerLinks: updatedLinksEs } as any,
    });
    payload.logger.info('  ✓ site-navigation Cerebro de marca subLinks (es) seeded');

    // ── EN ─────────────────────────────────────────────────────────────────────
    // Read back ES state to get Payload-assigned IDs (avoid array duplication on EN call)
    const afterEsNav = await payload.findGlobal({
      slug: 'site-navigation',
      locale: 'es',
      depth: 1,
    });
    const afterEsLinks = (afterEsNav as any)?.headerLinks ?? [];
    const cerebroAfterEs = afterEsLinks.find(
      (l: any) => l?.linkTarget?.routeKey === '/cerebro-marca',
    );
    const subsWithIds: any[] = cerebroAfterEs?.subLinks ?? [];

    const updatedLinksEn = afterEsLinks.map((link: any) => {
      if (link?.linkTarget?.routeKey === '/cerebro-marca') {
        return {
          ...link,
          subLinks: subsWithIds.map((sub: any, i: number) => ({
            ...sub,
            label: SUBLINKS_EN_LABELS[i] ?? sub.label,
            description: SUBLINKS_EN_DESCS[i] ?? sub.description,
          })),
        };
      }
      return link;
    });

    await payload.updateGlobal({
      slug: 'site-navigation',
      locale: 'en',
      data: { headerLinks: updatedLinksEn } as any,
    });
    payload.logger.info('  ✓ site-navigation Cerebro de marca subLinks (en) seeded');
  } catch (err) {
    payload.logger.error(`  ✗ site-navigation subLinks seed failed: ${err}`);
  }

  // Pillars + cluster articles: B-BBF-12-SEED-EXPANSION
  payload.logger.info('🌱 Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
