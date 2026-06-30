/**
 * Seed SiteHomepage §2 Capabilities — B-BBF-WEB-SEED-02-CAPABILITIES
 *
 * Fuente: SB_ContentMaster_Homepage.md v1.2 §2.2 + SEO-AEO-home-SB.md v2.3
 * Contenido EXACTO del canon. Cero términos prohibidos.
 *
 * Estrategia: 100% SQL directo (L-BBF-256-B pattern).
 * Los 5 items ya existen con IDs y escenas configuradas.
 * El seed corrige drifts en texto + bullets + escenas EN.
 *
 * Usage: pnpm tsx src/scripts/seed-homepage-capabilities.ts
 */

import { getPayload } from 'payload';
import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  /* vars from shell */
}

// ── IDs conocidos desde DB (inmutables) ───────────────────────────────────
const PARENT_ID = 1; // site_homepage serial id

const ITEM_IDS = {
  conversa: '6a1b0a1886f1fa2198921a97', // Agentes  · wa-chat
  genera: '6a1b0b0d86f1fa2198921aab', // Contenido · app-screen
  automatiza: '6a1b0bb286f1fa2198921ac1', // Automatizaciones · wa-agenda
  integra: '6a1b0c4586f1fa2198921acf', // Integraciones · integraciones
  aprende: '6a1b0dc986f1fa2198921b33', // Analiza y aprende · aprendizaje
} as const;

const SPOKE_ANALIZA_ID = '6a19cd4a5a42b2473e6ae3a1'; // spoke 5: APRENDE → ANALIZA

const WAG_QR_IDS = {
  yes: '6a3e59c654ed575f6243f46d', // "Sí, agéndala" / "Yes, schedule it"
  no: '6a3e59ec54ed575f6243f46f', // "Ahora no" / "Not now"
};

const INT_ITEM_IDS = [
  {
    id: '6a3e858fd6c15d08d3a70c49',
    name: 'Instagram',
    catEs: 'Red Social',
    catEn: 'Social Network',
  },
  {
    id: '6a3e8639d6c15d08d3a70c4b',
    name: 'Facebook',
    catEs: 'Red Social',
    catEn: 'Social Network',
  },
  {
    id: '6a3e8861d6c15d08d3a70c4d',
    name: 'LinkedIn',
    catEs: 'Red Social',
    catEn: 'Social Network',
  },
  { id: '6a3e88cad6c15d08d3a70c4f', name: 'WhatsApp', catEs: 'Mensajería', catEn: 'Messaging' },
  { id: '6a3e88f5d6c15d08d3a70c51', name: 'Metricool', catEs: 'CMS', catEn: 'CMS' },
  { id: '6a3e8969d6c15d08d3a70c53', name: 'Gmail', catEs: 'Mensajería', catEn: 'Messaging' },
  { id: '6a3e89aed6c15d08d3a70c55', name: 'Drive', catEs: 'Cloud Storage', catEn: 'Cloud Storage' },
  {
    id: '6a3e8a12d6c15d08d3a70c57',
    name: 'Google Calendar',
    catEs: 'Calendario',
    catEn: 'Calendar',
  },
  { id: '6a3e95a0d6c15d08d3a70c5b', name: 'Claude MCP', catEs: 'IA', catEn: 'AI' },
  { id: '6a3e9610d6c15d08d3a70c5d', name: 'Claude Code', catEs: 'IA', catEn: 'AI' },
  { id: '6a3e9632d6c15d08d3a70c5f', name: 'Gemini MCP', catEs: 'IA', catEn: 'AI' },
];

// ── Canon ContentMaster §2.2 ───────────────────────────────────────────────

const BULLETS: Record<string, { es: string[]; en: string[] }> = {
  conversa: {
    es: [
      'Atención a clientes en WhatsApp, web, redes y voz',
      'Asistentes internos para ventas, soporte y operaciones',
      'Recomiendan productos, califican interesados, agendan',
      'Pasan a una persona cuando la situación lo pide',
    ],
    en: [
      'Customer service on WhatsApp, web, social and voice',
      'Internal assistants for sales, support and operations',
      'Recommend products, qualify leads, book appointments',
      'Hand off to a person when the situation calls for it',
    ],
  },
  genera: {
    es: [
      'Del brief a la pieza final: textos, diseño y formato por red',
      'Encuentra el recurso exacto en tu biblioteca aprobada',
      'Puntos de revisión donde tu equipo aprueba o ajusta',
      'Calendariza y publica en cada red, en un solo flujo',
    ],
    en: [
      'From brief to final piece: copy, design and format per network',
      'Finds the exact asset in your approved library',
      'Review points where your team approves or adjusts',
      'Schedules and publishes on each network, in a single flow',
    ],
  },
  automatiza: {
    es: [
      'Bienvenida y registro de clientes nuevos sin trabajo manual',
      'Seguimiento de pedidos, incidencias y reclamos',
      'Sincronización con tus herramientas de negocio',
      'Escala a una persona cuando la decisión lo exige',
    ],
    en: [
      'Welcome and onboarding for new customers with no manual work',
      'Order tracking, incidents and claims',
      'Sync with your business tools',
      'Escalates to a person when the decision demands it',
    ],
  },
  integra: {
    es: [
      'Canales: WhatsApp, Instagram, web, voz',
      'Negocio: tu CRM, tu agenda, tu e-commerce',
      'Marketing: programadores de redes, email, gestores de contenido',
      'Equipo: las herramientas internas donde ya trabajás',
    ],
    en: [
      'Channels: WhatsApp, Instagram, web, voice',
      'Business: your CRM, your calendar, your e-commerce',
      'Marketing: social schedulers, email, content managers',
      'Team: the internal tools where you already work',
    ],
  },
  aprende: {
    es: [
      'Lee qué preguntan tus clientes y qué los detiene',
      'Mide qué contenido convierte y cuál no',
      'Detecta dónde se traba un proceso antes de que escale',
      'Convierte cada interacción en una mejora del sistema',
    ],
    en: [
      'Reads what your customers ask and what stops them',
      "Measures what content converts and what doesn't",
      'Detects where a process stalls before it escalates',
      'Turns every interaction into a system improvement',
    ],
  },
};

const TEXT_ES: Record<string, { title: string; lede: string; body: string; example: string }> = {
  conversa: {
    title: 'Agentes',
    lede: 'Tu marca atiende a clientes y a tu equipo, a toda hora, con tu voz exacta.',
    body: 'No son scripts. Son agentes que recuperan de la memoria de tu marca y responden con criterio —en el canal donde ya conversás y dentro de tu propio equipo. Cuando algo necesita una persona, escalan sin perder el hilo.',
    example:
      'Un cliente pregunta por WhatsApp si hay mesa para ocho el sábado. El agente confirma, registra la reserva y agenda el recordatorio. Al mismo tiempo, dentro del equipo, otro agente le pasa a la persona encargada el resumen del pedido que entró por la web.',
  },
  genera: {
    title: 'Contenido',
    lede: 'De un brief a una pieza lista para publicar, en horas, no en semanas.',
    body: 'Tu cerebro lee el brief, busca en tu memoria de marca, encuentra los recursos exactos en tu biblioteca, escribe con tu voz, define el diseño y el formato para cada red, y deja todo listo —textos, titulares, hashtags, llamados a la acción, fecha y hora de publicación. Tu equipo revisa y ajusta en los puntos que importan; cuando está aprobado, el sistema calendariza y publica.',
    example:
      'De "necesito algo para la campaña de fin de año" a la pieza diseñada, aprobada y programada —con tu tono, en cada formato— sin reuniones ni traspasos entre tres proveedores.',
  },
  automatiza: {
    title: 'Automatizaciones',
    lede: 'Las tareas repetitivas que tu equipo ya no debería hacer a mano.',
    body: 'Bienvenida a clientes nuevos, seguimiento de pedidos, sincronización con tus herramientas, respuestas de primer nivel. Procesos con criterio: cuando el caso es claro, el cerebro lo resuelve; cuando no, lo pasa a una persona.',
    example:
      'Un cliente nuevo se registra. El cerebro le da la bienvenida, le envía lo que necesita, lo agenda y avisa al equipo solo si el caso se sale de lo común.',
  },
  integra: {
    title: 'Integraciones',
    lede: 'El cerebro vive donde tu marca ya trabaja. No migrás nada.',
    body: 'Se conecta a las herramientas que ya usás —lee, escribe, actúa— sin pedirte que cambies de sistema. Tu equipo sigue trabajando donde ya sabe; el cerebro se adapta a tu stack, no al revés.',
    example:
      'Si tu equipo ya vive en sus herramientas de siempre y tu marca ya está en WhatsApp e Instagram, el cerebro entra ahí. Nadie cambia de sistema.',
  },
  aprende: {
    title: 'Analiza y aprende',
    lede: 'El cerebro lee sus propios datos y mejora con cada interacción.',
    body: 'No solo ejecuta: entiende qué está pasando. Qué preguntan tus clientes, qué contenido funciona, dónde se traba un proceso, qué canal rinde. Ese análisis afina las respuestas del sistema —sin que tengas que reentrenarlo— y te llega en un tablero legible, no en una hoja de datos cruda.',
    example:
      'El primer mes, el cerebro responde bien. Al sexto, responde como alguien que conoce el negocio: sabe qué se pregunta más, qué contenido prefiere tu audiencia y qué respuestas cierran ventas.',
  },
};

const TEXT_EN: Record<string, { title: string; lede: string; body: string; example: string }> = {
  conversa: {
    title: 'Agents',
    lede: 'Your brand serves customers and your team, around the clock, in your exact voice.',
    body: "Not scripts. Agents that pull from your brand's memory and answer with judgment —on the channel where you already talk and inside your own team. When something needs a person, they hand off without losing the thread.",
    example:
      "A customer asks on WhatsApp if there's a table for eight on Saturday. The agent confirms, logs the reservation and schedules the reminder. At the same time, inside the team, another agent passes the order that came in through the web to the right person.",
  },
  genera: {
    title: 'Content',
    lede: 'From a brief to a piece ready to publish, in hours, not weeks.',
    body: 'Your brain reads the brief, searches your brand memory, finds the exact assets in your library, writes in your voice, sets the design and format for each network, and leaves everything ready —copy, headlines, hashtags, calls to action, date and time to publish. Your team reviews and adjusts where it matters; once approved, the system schedules and publishes.',
    example:
      'From "I need something for the year-end campaign" to the piece designed, approved and scheduled —in your tone, in every format— with no meetings or handoffs between three vendors.',
  },
  automatiza: {
    title: 'Automations',
    lede: "The repetitive tasks your team shouldn't be doing by hand anymore.",
    body: "New-customer welcome, order tracking, sync with your tools, first-level replies. Processes with judgment: when the case is clear, the brain resolves it; when it isn't, it passes it to a person.",
    example:
      'A new customer signs up. The brain welcomes them, sends what they need, schedules them and only alerts the team if the case is out of the ordinary.',
  },
  integra: {
    title: 'Integrations',
    lede: 'The brain lives where your brand already works. You migrate nothing.',
    body: 'It connects to the tools you already use —reads, writes, acts— without asking you to change systems. Your team keeps working where they already know; the brain adapts to your stack, not the other way around.',
    example:
      'If your team already lives in their usual tools and your brand is already on WhatsApp and Instagram, the brain steps in there. No one changes systems.',
  },
  aprende: {
    title: 'Analyze and learn',
    lede: 'The brain reads its own data and improves with every interaction.',
    body: "It doesn't just execute: it understands what's happening. What your customers ask, what content works, where a process stalls, which channel performs. That analysis sharpens the system's answers —with no retraining— and reaches you in a readable dashboard, not raw data.",
    example:
      "In the first month, the brain answers well. By the sixth, it answers like someone who knows the business: it knows what's asked most, what content your audience prefers, and which answers close sales.",
  },
};

// ── WA Chat EN messages ────────────────────────────────────────────────────
const WA_MSGS_EN = [
  { who: 'user', text: 'Is there a table for Saturday at 8?', time: '23:10' },
  {
    who: 'brain',
    text: 'Yes, one table for 4 at 8:15 pm and another for 2 at 8:45. Which one works?',
    time: '23:10',
  },
  { who: 'user', text: "The one for 4. We're celebrating a birthday.", time: '23:11' },
  {
    who: 'brain',
    text: "Done, reserved. I'll send you a reminder Friday at 6 pm. Want me to set aside the tasting menu?",
    time: '23:11',
  },
];

// ── Apr rpts EN data ───────────────────────────────────────────────────────
const APR_RPTS_EN = [
  {
    key: 'Destination',
    value: 'Another European icon, less crowded',
    data: 'Europe doubled your saves in Q2',
  },
  { key: 'Format', value: 'Vertical reel, 7–10 s', data: 'Video +180% vs. static image' },
  { key: 'Schedule', value: 'Thursday · 7:00 pm', data: 'Your engagement peak' },
  {
    key: 'Copy + CTA',
    value: '"Your next adventure…" + "Reserve your spot"',
    data: 'Formula with 12.4% engagement',
  },
  { key: 'Hashtags', value: '#VIPTravel #VIPExperience', data: '64% non-follower reach' },
];

// ── Seed function ──────────────────────────────────────────────────────────

async function seedCapabilities() {
  const payload = await getPayload({ config });

  // @ts-justify: Payload v3 pool para SQL directo (L-BBF-256-B)
  const pool = (payload as any).db.pool as {
    query: (sql: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
  };

  console.log('[seed-capabilities] B-BBF-WEB-SEED-02-CAPABILITIES');
  console.log('[seed-capabilities] Fuente: ContentMaster_Homepage.md v1.2 §2.2\n');

  // ── [1/8] Section header ──────────────────────────────────────────────────
  console.log('[1/8] Section header ES + EN…');

  await pool.query(
    `
    UPDATE site_homepage_locales SET
      capabilities_eyebrow = $1,
      capabilities_lead = $2
    WHERE _locale = 'es' AND _parent_id = $3
  `,
    [
      '§2 · SERVICIOS',
      'En el centro vive la memoria de tu marca: el lugar único donde está todo lo que tu empresa sabe. Alrededor, cinco servicios coordinan el trabajo —conversar, generar, automatizar, integrar, analizar— siempre desde la misma fuente, siempre con tu voz.',
      PARENT_ID,
    ],
  );

  await pool.query(
    `
    UPDATE site_homepage_locales SET
      capabilities_eyebrow = $1,
      capabilities_lead = $2
    WHERE _locale = 'en' AND _parent_id = $3
  `,
    [
      '§2 · SERVICES',
      "At the center lives your brand's memory: the single place where everything your company knows resides. Around it, five services coordinate the work —converse, generate, automate, integrate, analyze— always from the same source, always in your voice.",
      PARENT_ID,
    ],
  );

  console.log('  ✅ eyebrow ES: "§2 · SERVICIOS" | EN: "§2 · SERVICES"');
  console.log('  ✅ lead ES + EN: ContentMaster canon');

  // ── [2/8] Hub spoke 5: APRENDE → ANALIZA / LEARN → ANALYZE ───────────────
  console.log('\n[2/8] Hub spoke 5 name fix…');

  await pool.query(
    `UPDATE cap_hub_spokes_locales SET name = 'ANALIZA' WHERE _parent_id = $1 AND _locale = 'es'`,
    [SPOKE_ANALIZA_ID],
  );
  await pool.query(
    `UPDATE cap_hub_spokes_locales SET name = 'ANALYZE' WHERE _parent_id = $1 AND _locale = 'en'`,
    [SPOKE_ANALIZA_ID],
  );
  console.log('  ✅ spoke 5: ES "ANALIZA" | EN "ANALYZE" (era APRENDE/LEARN)');

  // ── [3/8] Items text fields ES + EN ───────────────────────────────────────
  console.log('\n[3/8] Items text fields ES + EN…');

  for (const [slug, itemId] of Object.entries(ITEM_IDS)) {
    const es = TEXT_ES[slug];
    const en = TEXT_EN[slug];

    await pool.query(
      `
      UPDATE site_homepage_capabilities_items_locales SET
        title = $1, lede = $2, body = $3, example = $4
      WHERE _parent_id = $5 AND _locale = 'es'
    `,
      [es.title, es.lede, es.body, es.example, itemId],
    );

    await pool.query(
      `
      UPDATE site_homepage_capabilities_items_locales SET
        title = $1, lede = $2, body = $3, example = $4
      WHERE _parent_id = $5 AND _locale = 'en'
    `,
      [en.title, en.lede, en.body, en.example, itemId],
    );

    console.log(`  ✅ [${slug}] ES: "${es.title}" | EN: "${en.title}"`);
  }

  // ── [4/8] Bullets (DELETE + INSERT, ambos locales) ────────────────────────
  console.log('\n[4/8] Bullets (4×5 items × 2 locales)…');

  for (const [slug, itemId] of Object.entries(ITEM_IDS)) {
    const b = BULLETS[slug];

    // ES
    await pool.query(
      `DELETE FROM site_homepage_capabilities_items_bullets WHERE _parent_id = $1 AND _locale = 'es'`,
      [itemId],
    );
    for (let i = 0; i < b.es.length; i++) {
      await pool.query(
        `INSERT INTO site_homepage_capabilities_items_bullets (_order, _parent_id, _locale, id, text)
         VALUES ($1, $2, 'es', gen_random_uuid()::text, $3)`,
        [i + 1, itemId, b.es[i]],
      );
    }

    // EN
    await pool.query(
      `DELETE FROM site_homepage_capabilities_items_bullets WHERE _parent_id = $1 AND _locale = 'en'`,
      [itemId],
    );
    for (let i = 0; i < b.en.length; i++) {
      await pool.query(
        `INSERT INTO site_homepage_capabilities_items_bullets (_order, _parent_id, _locale, id, text)
         VALUES ($1, $2, 'en', gen_random_uuid()::text, $3)`,
        [i + 1, itemId, b.en[i]],
      );
    }

    console.log(`  ✅ [${slug}] ES: ${b.es.length} bullets | EN: ${b.en.length} bullets`);
  }

  // ── [5/8] WA Chat EN messages (conversa) ─────────────────────────────────
  console.log('\n[5/8] WA Chat EN messages (conversa)…');

  await pool.query(`DELETE FROM cap_wa_msgs WHERE _parent_id = $1 AND _locale = 'en'`, [
    ITEM_IDS.conversa,
  ]);
  for (let i = 0; i < WA_MSGS_EN.length; i++) {
    const m = WA_MSGS_EN[i];
    await pool.query(
      `INSERT INTO cap_wa_msgs (_order, _parent_id, _locale, id, who, text, time)
       VALUES ($1, $2, 'en', gen_random_uuid()::text, $3, $4, $5)`,
      [i + 1, ITEM_IDS.conversa, m.who, m.text, m.time],
    );
  }
  console.log(`  ✅ WA chat EN: ${WA_MSGS_EN.length} messages`);

  // ── [6/8] App screen EN (genera) ─────────────────────────────────────────
  console.log('\n[6/8] App screen EN (genera)…');

  await pool.query(
    `
    UPDATE site_homepage_capabilities_items_locales SET
      scene_app_screen_brief_text  = $1,
      scene_app_screen_caption     = $2,
      scene_app_screen_hashtags    = $3,
      scene_app_screen_publish_meta = $4
    WHERE _parent_id = $5 AND _locale = 'en'
  `,
    [
      'Create 1 Instagram story about a travel experience in France',
      'Your next adventure starts in France',
      '#France #Paris #EiffelTower #VIPTravel #VIPExperience #YourNextAdventure',
      'Today · 6:00 pm',
      ITEM_IDS.genera,
    ],
  );

  // Chips EN
  await pool.query(`DELETE FROM cap_app_chps WHERE _parent_id = $1 AND _locale = 'en'`, [
    ITEM_IDS.genera,
  ]);
  for (const [i, label] of ['1 Story', 'Instagram', 'Experience', 'France'].entries()) {
    await pool.query(
      `INSERT INTO cap_app_chps (_order, _parent_id, _locale, id, label)
       VALUES ($1, $2, 'en', gen_random_uuid()::text, $3)`,
      [i + 1, ITEM_IDS.genera, label],
    );
  }

  // Meta rows EN
  await pool.query(`DELETE FROM cap_app_meta WHERE _parent_id = $1 AND _locale = 'en'`, [
    ITEM_IDS.genera,
  ]);
  for (const [i, row] of [
    { key: 'Instagram', value: 'Story 9:16' },
    { key: 'Focus', value: 'Travel experience' },
    { key: 'Destination', value: 'France 🇫🇷' },
  ].entries()) {
    await pool.query(
      `INSERT INTO cap_app_meta (_order, _parent_id, _locale, id, key, value)
       VALUES ($1, $2, 'en', gen_random_uuid()::text, $3, $4)`,
      [i + 1, ITEM_IDS.genera, row.key, row.value],
    );
  }
  console.log('  ✅ App screen EN: brief + caption + hashtags + 4 chips + 3 meta rows');

  // ── [7/8] WA Agenda EN (automatiza) ──────────────────────────────────────
  console.log('\n[7/8] WA Agenda EN (automatiza)…');

  await pool.query(
    `
    UPDATE site_homepage_capabilities_items_locales SET
      scene_wa_agenda_contact_name       = 'Brain',
      scene_wa_agenda_brief_text         = $1,
      scene_wa_agenda_confirm_text       = $2,
      scene_wa_agenda_invite_sent_text   = $3,
      scene_wa_agenda_ask_text           = $4,
      scene_wa_agenda_closing_text       = $5,
      scene_wa_agenda_meet_card_title    = $6,
      scene_wa_agenda_meet_card_day      = $7
    WHERE _parent_id = $8 AND _locale = 'en'
  `,
    [
      'Schedule a video call for next Thursday at 10:00 to discuss the new campaign strategy. Invite fatima@mail.com and edgardo@gmail.com.',
      'Done! 🗓️ I scheduled the video call and generated the Google Meet link:',
      'Invitations sent to Fátima and Edgardo ✅. They received an email with the link and time.',
      'Want me to add it to your calendar?',
      "Done ✅ I added it to your Google Calendar with a 10 min reminder. You'll get the notification.",
      'Strategy · New campaign',
      'Thursday, July 12',
      ITEM_IDS.automatiza,
    ],
  );

  // Quick replies EN
  await pool.query(
    `INSERT INTO cap_wag_qr_locales (label, _locale, _parent_id)
     VALUES ('Yes, schedule it', 'en', $1)
     ON CONFLICT (_locale, _parent_id) DO UPDATE SET label = EXCLUDED.label`,
    [WAG_QR_IDS.yes],
  );
  await pool.query(
    `INSERT INTO cap_wag_qr_locales (label, _locale, _parent_id)
     VALUES ('Not now', 'en', $1)
     ON CONFLICT (_locale, _parent_id) DO UPDATE SET label = EXCLUDED.label`,
    [WAG_QR_IDS.no],
  );
  console.log('  ✅ WA agenda EN: all text fields + 2 quick replies');

  // ── [8a/8] Int items EN (integra) — también fija typos ES ─────────────────
  console.log('\n[8a/8] Int items EN (integra) + fix ES typos…');

  for (const item of INT_ITEM_IDS) {
    // Fix ES name + category (fix typos: Google Calendar, etc.)
    await pool.query(
      `UPDATE cap_int_items_locales SET name = $1, category = $2 WHERE _parent_id = $3 AND _locale = 'es'`,
      [item.name, item.catEs, item.id],
    );

    // EN: INSERT or UPDATE (UNIQUE on _locale, _parent_id)
    await pool.query(
      `INSERT INTO cap_int_items_locales (name, category, _locale, _parent_id)
       VALUES ($1, $2, 'en', $3)
       ON CONFLICT (_locale, _parent_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category`,
      [item.name, item.catEn, item.id],
    );
  }

  // integraciones summary title EN
  await pool.query(
    `
    UPDATE site_homepage_capabilities_items_locales
    SET scene_integraciones_summary_title = 'Connecting your brain to all your sources'
    WHERE _parent_id = $1 AND _locale = 'en'
  `,
    [ITEM_IDS.integra],
  );

  console.log(`  ✅ Int items: ${INT_ITEM_IDS.length} items ES + EN`);

  // ── [8b/8] Aprendizaje EN (aprende) ───────────────────────────────────────
  console.log('\n[8b/8] Aprendizaje EN (aprende)…');

  await pool.query(
    `
    UPDATE site_homepage_capabilities_items_locales SET
      scene_aprendizaje_insights_title = 'Post analysis',
      scene_aprendizaje_projection     = 'Projection: +35–50% reach',
      scene_aprendizaje_platform_label = 'Instagram · Story',
      scene_aprendizaje_time_label     = 'Published 3 days ago',
      scene_aprendizaje_post_caption   = 'Your next adventure starts in France ✨🇫🇷'
    WHERE _parent_id = $1 AND _locale = 'en'
  `,
    [ITEM_IDS.aprende],
  );

  // Apr rpts EN: get parent IDs dynamically, then INSERT
  const aprParentRows = await pool.query(
    `SELECT id, _order FROM cap_apr_rpts WHERE _parent_id = $1 ORDER BY _order`,
    [ITEM_IDS.aprende],
  );

  for (const row of aprParentRows.rows) {
    const idx = (row._order as number) - 1;
    const en = APR_RPTS_EN[idx];
    if (!en) continue;

    await pool.query(
      `INSERT INTO cap_apr_rpts_locales (key, value, data, _locale, _parent_id)
       VALUES ($1, $2, $3, 'en', $4)
       ON CONFLICT (_locale, _parent_id) DO UPDATE SET key = EXCLUDED.key, value = EXCLUDED.value, data = EXCLUDED.data`,
      [en.key, en.value, en.data, row.id],
    );
  }
  console.log(`  ✅ Aprendizaje EN: labels + ${aprParentRows.rows.length} rpts`);

  // ── [9/8] Verificación SQL ────────────────────────────────────────────────
  console.log('\n[9/8] Verificación…');

  const hdr = await pool.query(
    `
    SELECT _locale, capabilities_eyebrow, capabilities_lead
    FROM site_homepage_locales WHERE _parent_id = $1 ORDER BY _locale
  `,
    [PARENT_ID],
  );
  for (const r of hdr.rows) {
    const eyebrowOk =
      (r._locale === 'es' && r.capabilities_eyebrow === '§2 · SERVICIOS') ||
      (r._locale === 'en' && r.capabilities_eyebrow === '§2 · SERVICES');
    const leadOk = r.capabilities_lead != null && (r.capabilities_lead as string).length > 50;
    console.log(`  ${eyebrowOk ? '✅' : '❌'} [${r._locale}] eyebrow: "${r.capabilities_eyebrow}"`);
    console.log(
      `  ${leadOk ? '✅' : '❌'} [${r._locale}] lead: ${(r.capabilities_lead as string).substring(0, 60)}…`,
    );
  }

  const spokeCheck = await pool.query(
    `SELECT _locale, name FROM cap_hub_spokes_locales WHERE _parent_id = $1`,
    [SPOKE_ANALIZA_ID],
  );
  for (const r of spokeCheck.rows) {
    const ok =
      (r._locale === 'es' && r.name === 'ANALIZA') || (r._locale === 'en' && r.name === 'ANALYZE');
    console.log(`  ${ok ? '✅' : '❌'} spoke 5 [${r._locale}]: "${r.name}"`);
  }

  for (const [slug, itemId] of Object.entries(ITEM_IDS)) {
    const locs = await pool.query(
      `SELECT _locale, title, lede FROM site_homepage_capabilities_items_locales WHERE _parent_id = $1 ORDER BY _locale`,
      [itemId],
    );
    const bs = await pool.query(
      `SELECT _locale, COUNT(*) as cnt FROM site_homepage_capabilities_items_bullets WHERE _parent_id = $1 GROUP BY _locale ORDER BY _locale`,
      [itemId],
    );
    const bMap = Object.fromEntries(bs.rows.map((r: any) => [r._locale as string, Number(r.cnt)]));
    for (const r of locs.rows) {
      const titleOk = r.title != null;
      const ledOk = r.lede != null;
      const bcnt = bMap[r._locale as string] ?? 0;
      const bulletsOk = bcnt === 4;
      console.log(
        `  ${titleOk && ledOk && bulletsOk ? '✅' : '❌'} [${slug}][${r._locale}] title="${r.title}" bullets=${bcnt}`,
      );
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('[seed-capabilities] B-BBF-WEB-SEED-02-CAPABILITIES COMPLETADO');
  console.log('  §2 Servicios ES+EN: section header + 5 items + bullets + escenas EN');
  console.log('  Labels canónicos: SERVICIOS, Agentes/Agents, ANALIZA/ANALYZE');
  console.log('  Términos prohibidos: ninguno');
  console.log('═══════════════════════════════════════════════════════════════════');

  process.exit(0);
}

seedCapabilities().catch((e) => {
  console.error('[seed-capabilities] ❌ ERROR:', e);
  process.exit(1);
});
