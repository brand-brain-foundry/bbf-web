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
      canonicalSlug: 'como-trabajamos',
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

  // === §3 Caso — seed site-homepage global caseStudy ===
  // Fuente: SB_ContentMaster_Homepage §2.3 (Content/Final) — EXACTO.
  // Caso: Hacienda Real (primer cliente). B-BBF-WEB-SEED-03-CASESTUDY.
  // ES + EN con workaround L-BBF-256 para arrays localized.
  try {
    await payload.updateGlobal({
      slug: 'site-homepage',
      locale: 'es',
      data: {
        caseStudy: {
          eyebrow: 'En marcha · Primer cliente',
          h2Line1: 'El primer cerebro,',
          h2Line2Soft: 'en marcha.',
          lead: 'Hacienda Real es el primer cliente de Sivar Brains. Hoy su cerebro genera el contenido de sus redes a partir de un brief —del concepto a la pieza lista para publicar— y atiende a sus clientes en WhatsApp con el menú, las recomendaciones de maridaje y las reservas, con la voz exacta del restaurante.\n\nEsto es lo que opera hoy. El caso sigue creciendo.',
          mediaChromeLabel: 'HACIENDA-REAL · WhatsApp Business · live',
          timelineAttribution: 'En operación · Sivar Brains',
          phases: [
            {
              tag: 'Antes',
              title: 'Situación',
              body: 'Respuestas manuales en WhatsApp. El contenido de redes salía sin sistema de voz unificada. La memoria del restaurante vivía dispersa entre personas.',
            },
            {
              tag: 'Construcción',
              title: 'Cerebro activo',
              body: 'Ingresamos el menú, los maridajes, la historia y la voz de Hacienda Real. Conectamos WhatsApp Business y activamos el motor de contenido desde brief.',
            },
            {
              tag: 'Hoy',
              title: 'Operación',
              body: 'El cerebro genera el contenido de redes desde un brief y atiende a los clientes en WhatsApp con la voz exacta del restaurante.',
            },
          ],
          milestones: [
            {
              title: 'Primer cliente del cerebro de marca',
              note: '',
              status: 'active',
              statusLabel: 'Activo',
            },
            {
              title: 'Genera el contenido de redes desde un brief',
              note: '',
              status: 'active',
              statusLabel: 'Activo',
            },
            {
              title: 'Agente en WhatsApp: menú, maridajes, reservas',
              note: '',
              status: 'demo',
              statusLabel: 'En demo, conectándose',
            },
            {
              title: 'Resultados y nuevos canales',
              note: '',
              status: 'next',
              statusLabel: 'Próximo',
            },
          ],
          quoteText:
            'Es como tener a alguien del equipo respondiendo cada mensaje. Solo que nadie del equipo está respondiendo.',
          quoteCaption: '— En operación · Sivar Brains',
          ctaLabel: 'Ver el historial completo',
          ctaHref: '/casos/hacienda-real',
        },
      } as any,
    });
    payload.logger.info('  ✓ caseStudy (es) upserted — Hacienda Real canon §2.3');
  } catch (err) {
    payload.logger.error(`  ✗ caseStudy ES seed failed: ${err}`);
  }

  // caseStudy EN — L-BBF-256 full bypass: Payload v3 throws ValidationError on
  // updateGlobal(locale='en') when global has existing array children (phases).
  // Use pool.query directly for EN scalars + milestone locales.
  // @ts-justify: accessing Payload v3 internal pg pool (L-BBF-256 pattern)
  const caseStudyPool = (payload as any).db.pool as {
    query: (sql: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
  };
  try {
    await caseStudyPool.query(
      `INSERT INTO site_homepage_locales
         (case_study_eyebrow, case_study_h2_line1, case_study_h2_line2_soft,
          case_study_lead, case_study_media_chrome_label, case_study_timeline_attribution,
          case_study_quote_text, case_study_quote_caption, case_study_cta_label,
          _locale, _parent_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'en',1)
       ON CONFLICT (_locale, _parent_id)
       DO UPDATE SET
         case_study_eyebrow              = EXCLUDED.case_study_eyebrow,
         case_study_h2_line1             = EXCLUDED.case_study_h2_line1,
         case_study_h2_line2_soft        = EXCLUDED.case_study_h2_line2_soft,
         case_study_lead                 = EXCLUDED.case_study_lead,
         case_study_media_chrome_label   = EXCLUDED.case_study_media_chrome_label,
         case_study_timeline_attribution = EXCLUDED.case_study_timeline_attribution,
         case_study_quote_text           = EXCLUDED.case_study_quote_text,
         case_study_quote_caption        = EXCLUDED.case_study_quote_caption,
         case_study_cta_label            = EXCLUDED.case_study_cta_label`,
      [
        'In motion · First client',
        'The first brain,',
        'in motion.',
        "Hacienda Real is the first client of Sivar Brains. Today its brain generates its social content from a brief —from concept to a piece ready to publish— and serves its customers on WhatsApp with the menu, pairing recommendations and reservations, in the restaurant's exact voice.\n\nThis is what runs today. The case keeps growing.",
        'HACIENDA-REAL · WhatsApp Business · live',
        'In operation · Sivar Brains',
        "It's like having someone from the team answering every message. Except no one from the team is answering.",
        '— In operation · Sivar Brains',
        'View the full history',
      ],
    );
    const mRows = await caseStudyPool.query(
      'SELECT id FROM site_homepage_case_study_milestones ORDER BY _order',
    );
    const enMs = [
      { title: 'First client of the brand brain', note: '', statusLabel: 'Active' },
      { title: 'Generates social content from a brief', note: '', statusLabel: 'Active' },
      {
        title: 'WhatsApp agent: menu, pairings, reservations',
        note: '',
        statusLabel: 'In demo, connecting',
      },
      { title: 'Results and new channels', note: '', statusLabel: 'Upcoming' },
    ];
    for (let i = 0; i < mRows.rows.length; i++) {
      const r = mRows.rows[i];
      const en = enMs[i];
      if (!r || !en) continue;
      await caseStudyPool.query(
        `INSERT INTO site_homepage_case_study_milestones_locales
           (title, note, status_label, _locale, _parent_id)
         VALUES ($1,$2,$3,'en',$4)
         ON CONFLICT (_locale, _parent_id)
         DO UPDATE SET title=$1, note=$2, status_label=$3`,
        [en.title, en.note, en.statusLabel, r.id],
      );
    }
    payload.logger.info('  ✓ caseStudy (en) upserted via SQL — Hacienda Real canon §2.3');
  } catch (err) {
    payload.logger.error(`  ✗ caseStudy EN seed failed: ${err}`);
  }

  // === §4 Por qué — seed site-homepage comparison (D-COMPARISON-01, 3 cols × 9 rows)
  // Columna A: "Lo que ya usás" (era "SaaS / Chatbot" — D-COMPARISON-01 corrige a status-quo framing).
  // Fuente: SB_ContentMaster_Homepage §2.4 post D-COMPARISON-01.
  // EN: L-BBF-256 bypass — pool.query INSERT ON CONFLICT para columnas/filas/celdas.
  try {
    await payload.updateGlobal({
      slug: 'site-homepage',
      locale: 'es',
      data: {
        comparison: {
          eyebrow: 'Por qué',
          h2Line1: 'La diferencia entre alquilar y ser dueño.',
          h2Line2Soft: 'Y entre ejecutar a mano o coordinar con criterio.',
          lead: 'Hoy tu empresa enfrenta dos costos invisibles: el software que alquilás sin que sea tuyo, y el trabajo que tu equipo todavía hace a mano, una tarea a la vez. Un cerebro de marca cierra los dos. No suma otra herramienta: coordina, desde una sola memoria, todo lo que tu marca dice y hace en cada canal —para que tu equipo deje de ejecutar y vuelva a dirigir.',
          columns: [
            { label: 'Lo que ya usás', isHighlighted: false },
            { label: 'Trabajo manual', isHighlighted: false },
            { label: 'Cerebro de marca', isHighlighted: true },
          ],
          rows: [
            {
              attribute: 'Propiedad',
              cells: [
                { state: 'text', value: 'Suya' },
                { state: 'text', value: 'Tuya, pero diluida' },
                { state: 'text', value: 'Tuya: memoria y datos' },
              ],
            },
            {
              attribute: 'Aprende tu empresa',
              cells: [
                { state: 'text', value: 'Promedio de mercado' },
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
              attribute: 'Coordinación',
              cells: [
                { state: 'text', value: 'Cada herramienta por su lado' },
                { state: 'text', value: 'La hace una persona' },
                { state: 'text', value: 'Una sola fuente coordina todo' },
              ],
            },
            {
              attribute: 'Disponibilidad',
              cells: [
                { state: 'text', value: 'Funciona, sin tu voz' },
                { state: 'text', value: 'Horario laboral' },
                { state: 'text', value: 'Tu voz exacta, siempre' },
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
                { state: 'text', value: 'Sí, es tuyo' },
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
            body: 'Un software te da acceso temporal a una herramienta que también usan tus competidores. El trabajo manual no escala: cada canal nuevo es más horas, más personas, más costo. Y ni el software ni las manos coordinan entre sí —cada pieza vive aparte.\n\nUn cerebro de marca es tuyo y coordina: una sola memoria detrás de cada agente, cada pieza de contenido, cada proceso. La voz es la misma en todos lados porque la fuente es una sola. Tu equipo vuelve a lo que solo una persona puede hacer: dirigir.',
          },
        },
      } as any,
    });
    payload.logger.info('  ✓ comparison §4 (es) seeded — D-COMPARISON-01 (3 cols × 9 rows)');
  } catch (err) {
    payload.logger.error(`  ✗ comparison §4 seed failed: ${err}`);
  }

  // === §4 EN — L-BBF-256 bypass para EN locales (scalars + columns + rows + cells)
  try {
    await caseStudyPool.query(
      `INSERT INTO site_homepage_locales
         (comparison_eyebrow, comparison_h2_line1, comparison_h2_line2_soft,
          comparison_lead, comparison_epilogue_title, comparison_epilogue_body,
          _locale, _parent_id)
       VALUES ($1,$2,$3,$4,$5,$6,'en',1)
       ON CONFLICT (_locale, _parent_id)
       DO UPDATE SET
         comparison_eyebrow        = EXCLUDED.comparison_eyebrow,
         comparison_h2_line1       = EXCLUDED.comparison_h2_line1,
         comparison_h2_line2_soft  = EXCLUDED.comparison_h2_line2_soft,
         comparison_lead           = EXCLUDED.comparison_lead,
         comparison_epilogue_title = EXCLUDED.comparison_epilogue_title,
         comparison_epilogue_body  = EXCLUDED.comparison_epilogue_body`,
      [
        'Why',
        'The difference between renting and owning.',
        'And between doing it by hand or coordinating with judgment.',
        "Today your company faces two invisible costs: the software you rent without owning, and the work your team still does by hand, one task at a time. A brand brain closes both. It doesn't add another tool: it coordinates, from a single memory, everything your brand says and does across every channel —so your team stops executing and goes back to leading.",
        'The operational difference',
        "Software gives you temporary access to a tool your competitors also use. Manual work doesn't scale: every new channel is more hours, more people, more cost. And neither software nor hands coordinate with each other —each piece lives apart.\n\nA brand brain is yours and it coordinates: a single memory behind every agent, every piece of content, every process. The voice is the same everywhere because the source is one. Your team returns to what only a person can do: lead.",
      ],
    );
    const enColLabels = ['What you already use', 'Manual work', 'Brand brain'];
    const colRows = await caseStudyPool.query(
      'SELECT id FROM cmp_columns WHERE _parent_id=1 ORDER BY _order',
    );
    for (let i = 0; i < colRows.rows.length; i++) {
      await caseStudyPool.query(
        `INSERT INTO cmp_columns_locales (label, sub, _locale, _parent_id)
         VALUES ($1,'','en',$2) ON CONFLICT (_locale,_parent_id)
         DO UPDATE SET label=EXCLUDED.label, sub=EXCLUDED.sub`,
        [enColLabels[i], colRows.rows[i]!.id],
      );
    }
    const enRows: Array<{ attribute: string; cells: [string, string, string] }> = [
      { attribute: 'Ownership', cells: ['Theirs', 'Yours, but diluted', 'Yours: memory and data'] },
      {
        attribute: 'Learns your company',
        cells: ['Market average', 'Per person', 'Your specific memory'],
      },
      { attribute: 'Consistent voice', cells: ['Approximate', 'Depends who', 'Exact, always'] },
      {
        attribute: 'Coordination',
        cells: ['Each tool on its own', 'A person does it', 'One source coordinates all'],
      },
      {
        attribute: 'Availability',
        cells: ['Works, not your voice', 'Business hours', 'Your exact voice, always'],
      },
      { attribute: 'Scale', cells: ['Pay per use', 'Hire more', 'No linear cost'] },
      { attribute: 'Governance', cells: ["The vendor's", 'No traceability', 'Yours, auditable'] },
      { attribute: 'Portability', cells: ['No, lock-in', 'Yes, but in people', "Yes, it's yours"] },
      {
        attribute: '3-year cost',
        cells: ['Rises every year', 'Rises with scale', 'An investment that appreciates'],
      },
    ];
    const rowRows = await caseStudyPool.query(
      'SELECT id FROM cmp_rows WHERE _parent_id=1 ORDER BY _order',
    );
    for (let i = 0; i < rowRows.rows.length; i++) {
      const rowId = rowRows.rows[i]!.id;
      const enRow = enRows[i]!;
      await caseStudyPool.query(
        `INSERT INTO cmp_rows_locales (attribute,_locale,_parent_id)
         VALUES ($1,'en',$2) ON CONFLICT (_locale,_parent_id) DO UPDATE SET attribute=EXCLUDED.attribute`,
        [enRow.attribute, rowId],
      );
      const cellRows = await caseStudyPool.query(
        'SELECT id FROM cmp_cells WHERE _parent_id=$1 ORDER BY _order',
        [rowId],
      );
      for (let j = 0; j < cellRows.rows.length; j++) {
        await caseStudyPool.query(
          `INSERT INTO cmp_cells_locales (value,_locale,_parent_id)
           VALUES ($1,'en',$2) ON CONFLICT (_locale,_parent_id) DO UPDATE SET value=EXCLUDED.value`,
          [enRow.cells[j], cellRows.rows[j]!.id],
        );
      }
    }
    payload.logger.info('  ✓ comparison §4 (en) seeded via SQL L-BBF-256 bypass');
  } catch (err) {
    payload.logger.error(`  ✗ comparison §4 EN seed failed: ${err}`);
  }

  // === §5 Cómo trabajamos — seed site-homepage global method
  // Canon: SB_ContentMaster_Homepage.md §2.5 — B-BBF-WEB-SEED-05-COMOTRABAJAMOS
  // Elimina bug B-4: H2 equivocado ("Tres servicios coordinados.") + "Retainer" (vocabulario prohibido).
  try {
    await payload.updateGlobal({
      slug: 'site-homepage',
      locale: 'es',
      data: {
        method: {
          eyebrow: 'Cómo trabajamos',
          h2Line1: 'Un camino claro.',
          h2Line2Soft: 'Vos marcás el ritmo.',
          phases: [
            { number: '01', shortLabel: 'Diagnóstico' },
            { number: '02', shortLabel: 'Build' },
            { number: '03', shortLabel: 'Operación' },
          ],
          services: [
            {
              number: '01',
              name: 'Diagnóstico',
              duration: '2 – 3 semanas',
              commitment: 'Alcance cerrado · sin recurrencia',
              body: 'Antes de construir nada, entendemos tu marca: qué sabe tu empresa, dónde vive ese conocimiento, qué canales atendés y qué se puede mejorar. Salís de aquí con un mapa claro de lo que vamos a construir y cuánto cuesta —sin sorpresas después.\n\nSi decidís no seguir, el diagnóstico es tuyo igual. Te sirve con nosotros o con quien quieras.',
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
              commitment: 'Según alcance · trabajo verificable cada semana',
              body: 'Construimos tu cerebro por partes, no en una caja negra que abrís al final. Cada semana ves avances reales y validás antes de seguir. Ingestamos tu conocimiento, configuramos tu voz y tus reglas, conectamos tus canales y activamos cada servicio cuando está listo.\n\nTus datos viven aislados y bajo tu control: cada parte de tu información está separada y protegida, y podés ver qué hace el sistema en tu nombre. Al terminar, todo es tuyo —el sistema, el código, la configuración, la documentación.',
              deliverables: [
                { text: 'Ingesta de conocimiento de marca' },
                { text: 'Voz, políticas y criterios configurados' },
                { text: 'Integraciones de canal activas' },
                { text: 'Documentación y transferencia completa' },
              ],
            },
            {
              number: '03',
              name: 'Operación y mejora',
              duration: 'Mes a mes · sin permanencia',
              commitment: 'Sin contratos que te aten',
              body: 'Un cerebro de marca no se entrega y se abandona: mejora con cada uso. Lo mantenemos funcionando, lo afinamos con lo que aprende, sumamos canales y casos nuevos a medida que tu negocio crece. Quien lo construyó es quien lo cuida —no te pasamos a otro equipo.\n\nY sos libre: si un mes querés operarlo con tu propia gente, podés. Si querés que sigamos a tu lado, seguimos. Sin contratos que te aten, sin letra chica. Tu marca es tuya, y la libertad de decidir también.',
              deliverables: [
                { text: 'Mejora continua del sistema' },
                { text: 'Nuevos casos de uso activados' },
                { text: 'Nuevos canales integrados' },
                { text: 'Sin contratos que te aten' },
              ],
            },
          ],
          ctaLabel: 'Conocer cómo trabajamos',
          ctaHref: '/como-trabajamos',
        },
      } as any,
    });
    payload.logger.info('  ✓ method §5 (es) seeded — B-BBF-WEB-SEED-05-COMOTRABAJAMOS');
  } catch (err) {
    payload.logger.error(`  ✗ method §5 ES seed failed: ${err}`);
  }

  // === §5 Cómo trabajamos EN — L-BBF-256 bypass (scalars + phases + services + deliverables)
  // Queries IDs post-ES-seed (arrays are recreated → IDs change → no hardcoding).
  try {
    await caseStudyPool.query(
      `INSERT INTO site_homepage_locales
         (method_eyebrow, method_h2_line1, method_h2_line2_soft, method_cta_label,
          _locale, _parent_id)
       VALUES ($1,$2,$3,$4,'en',1)
       ON CONFLICT (_locale, _parent_id)
       DO UPDATE SET
         method_eyebrow       = EXCLUDED.method_eyebrow,
         method_h2_line1      = EXCLUDED.method_h2_line1,
         method_h2_line2_soft = EXCLUDED.method_h2_line2_soft,
         method_cta_label     = EXCLUDED.method_cta_label`,
      ['How we work', 'A clear path.', 'You set the pace.', 'Learn how we work'],
    );
    const enPhaseLabels = ['Diagnosis', 'Build', 'Ongoing'];
    const phaseRows = await caseStudyPool.query(
      'SELECT id FROM mth_phases WHERE _parent_id=1 ORDER BY _order',
    );
    for (let i = 0; i < phaseRows.rows.length; i++) {
      await caseStudyPool.query(
        `INSERT INTO mth_phases_locales (short_label, _locale, _parent_id)
         VALUES ($1,'en',$2) ON CONFLICT (_locale, _parent_id)
         DO UPDATE SET short_label = EXCLUDED.short_label`,
        [enPhaseLabels[i], phaseRows.rows[i]!.id],
      );
    }
    const enServices = [
      {
        name: 'Diagnosis',
        duration: '2 – 3 weeks',
        commitment: 'Closed scope · no recurrence',
        body: "Before building anything, we understand your brand: what your company knows, where that knowledge lives, what channels you serve and what can improve. You leave with a clear map of what we'll build and what it costs —no surprises later.\n\nIf you decide not to continue, the diagnosis is yours anyway. It serves you with us or with whoever you choose.",
      },
      {
        name: 'Build',
        duration: 'By scope · verified weekly',
        commitment: 'Your system, your property',
        body: "We build your brain in parts, not in a black box you open at the end. Each week you see real progress and approve before moving on. We ingest your knowledge, configure your voice and rules, connect your channels and activate each service when it's ready.\n\nYour data lives isolated and under your control: each part of your information is separated and protected, and you can see what the system does on your behalf. When we're done, it's all yours —the system, the code, the configuration, the documentation.",
      },
      {
        name: 'Ongoing Support',
        duration: 'Month to month · no lock-in',
        commitment: 'No contracts that bind you',
        body: "A brand brain isn't delivered and abandoned: it improves with every use. We keep it running, sharpen it with what it learns, add channels and new use cases as your business grows. Whoever built it is who cares for it —we don't pass you to another team.\n\nAnd you're free: if one month you want to run it with your own people, you can. If you want us to stay by your side, we stay. No contracts that bind you, no fine print. Your brand is yours, and so is the freedom to decide.",
      },
    ] as const;
    const enDeliverables: readonly string[][] = [
      [
        'Brand brain blueprint',
        'Prioritized build roadmap',
        'Closed proposal with scope and cost',
        "If it's not viable, we'll say so",
      ],
      [
        'Brand knowledge ingested',
        'Voice, policies and criteria configured',
        'Channel integrations active',
        'Complete documentation and handover',
      ],
      [
        'Continuous system improvement',
        'New use cases activated',
        'New channels integrated',
        'No contracts that bind you',
      ],
    ];
    const serviceRows = await caseStudyPool.query(
      'SELECT id FROM mth_services WHERE _parent_id=1 ORDER BY _order',
    );
    for (let i = 0; i < serviceRows.rows.length; i++) {
      const svc = enServices[i]!;
      const serviceId = serviceRows.rows[i]!.id as string;
      await caseStudyPool.query(
        `INSERT INTO mth_services_locales (name, duration, commitment, body, _locale, _parent_id)
         VALUES ($1,$2,$3,$4,'en',$5) ON CONFLICT (_locale, _parent_id)
         DO UPDATE SET name=$1, duration=$2, commitment=$3, body=$4`,
        [svc.name, svc.duration, svc.commitment, svc.body, serviceId],
      );
      const delivRows = await caseStudyPool.query(
        'SELECT id FROM mth_deliverables WHERE _parent_id=$1 ORDER BY _order',
        [serviceId],
      );
      const envDelivs = enDeliverables[i]!;
      for (let j = 0; j < delivRows.rows.length; j++) {
        await caseStudyPool.query(
          `INSERT INTO mth_deliverables_locales (text, _locale, _parent_id)
           VALUES ($1,'en',$2) ON CONFLICT (_locale, _parent_id)
           DO UPDATE SET text = EXCLUDED.text`,
          [envDelivs[j], delivRows.rows[j]!.id],
        );
      }
    }
    payload.logger.info('  ✓ method §5 (en) seeded via SQL L-BBF-256 bypass');
  } catch (err) {
    payload.logger.error(`  ✗ method §5 EN seed failed: ${err}`);
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
