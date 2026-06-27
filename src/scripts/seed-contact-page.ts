/**
 * Seed SiteContactPage ES+EN — FASE 4 B-BBF-WEB-CONTACTO-BUILD
 *
 * Fuentes:
 *   - SB_ContentMaster_Contacto.md v1.0 (hero, steps, formConfig, microcopy)
 *   - SEO-AEO-contacto-SB.md v2.0 §3+§4 (seo group) + §9.5 FAQ ES questions (AEO)
 *
 * D-CT-06 = Opción A: manifesto card NO poblado (no existe en CM).
 * D-07 = A: solo form + email (otherChannelsLabel/Note poblados, channels simples).
 *
 * L-BBF-256 workaround aplicado:
 *   updateGlobal(locale='es') crea todos los arrays (steps, stageOptions, roleOptions, faq).
 *   Locales EN se insertan via SQL UPSERT para cada tabla de locales.
 *
 * Usage:
 *   set -a && source .env.local && set +a && pnpm tsx src/scripts/seed-contact-page.ts
 */

import { getPayload } from 'payload';
import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  // vars expected from shell environment
}

// ── §1 HERO ───────────────────────────────────────────────────────────────────
// ContentMaster §2.1 · §1.4

const HERO_ES = {
  heading: 'Sentémonos a pensar.',
  subtitle: 'No hay urgencia. Hay método.',
  lede: 'Contános dónde está hoy tu marca. Escuchamos, preguntamos. Si hay algo que construir juntos, lo decimos. Si no, también.',
  anchorPhrase:
    'Escribir a Sivar Brains abre un diagnóstico cerrado: dos a tres semanas, alcance definido, sin compromiso de continuar. Tu información va directa al equipo —no a una lista, no a un sistema externo. Respondemos en 24 horas hábiles con una persona real. Si no hay match, lo decimos. El primer paso no tiene costo ni urgencia.',
};

const HERO_EN = {
  heading: "Let's think this through.",
  subtitle: 'No rush. A method.',
  lede: "Tell us where your brand is today. We listen, we ask. If there's something to build together, we say so. If there isn't, we say that too.",
  anchorPhrase:
    'Writing to Sivar Brains opens a closed diagnosis: two to three weeks, defined scope, no commitment to continue. Your information goes directly to the team —not to a list, not to an external system. We reply within 24 business hours with a real person. If there is no match, we say so. The first step has no cost, no urgency.',
};

// ── §2 STEPS ─────────────────────────────────────────────────────────────────
// ContentMaster §2.2

const STEPS_EYEBROW_ES = 'QUÉ PASA DESPUÉS';
const STEPS_EYEBROW_EN = 'WHAT HAPPENS NEXT';

const STEPS_ES = [
  {
    title: 'Te respondemos en 24h hábiles.',
    body: 'Misma persona, no un bot. Email.',
  },
  {
    title: 'Llamada de 30 minutos, sin slides.',
    body: 'Te preguntamos qué hace tu marca hoy y dónde se te va el tiempo a mano.',
  },
  {
    title: 'Si encaja, propuesta de diagnóstico.',
    body: '2 a 3 semanas, alcance cerrado, sin recurrencia. El diagnóstico es tuyo, sigas o no.',
  },
  {
    title: 'Si no encaja, te lo decimos así.',
    body: 'No vendemos lo que no podemos construir. Cero tiempo perdido.',
  },
];

const STEPS_EN = [
  {
    title: 'We reply within 24 business hours.',
    body: 'A real person, not a bot. Email.',
  },
  {
    title: 'A 30-minute call, no slides.',
    body: 'We ask what your brand does today and where your time goes by hand.',
  },
  {
    title: 'If it fits, a diagnosis proposal.',
    body: '2 to 3 weeks, closed scope, no recurrence. The diagnosis is yours, whether you continue or not.',
  },
  {
    title: "If it doesn't fit, we tell you straight.",
    body: "We don't sell what we can't build. Zero time wasted.",
  },
];

// ── §3 FORM CONFIG ────────────────────────────────────────────────────────────
// ContentMaster §2.3

const FORM_CONFIG_ES = {
  title: 'Nuevo mensaje',
  stageLabel: 'En qué estás (opcional)',
  roleLabel: 'Rol (opcional)',
  messagePlaceholder:
    'Contános dónde está tu marca hoy, qué canales atendés y qué se hace a mano. Cuanto más concreto, mejor.',
  requiredHint: 'Los campos marcados son obligatorios.',
  submitLabel: 'Enviar mensaje',
};

const FORM_CONFIG_EN = {
  title: 'New message',
  stageLabel: "Where you're at (optional)",
  roleLabel: 'Role (optional)',
  messagePlaceholder:
    "Tell us where your brand is today, what channels you serve and what's done by hand. The more concrete, the better.",
  requiredHint: 'Required fields are marked.',
  submitLabel: 'Send message',
};

// stageOptions — 4 chips del recorrido canónico (CM §2.3)
// value: slug no-localized, label: localized
const STAGE_OPTIONS = [
  { value: 'exploring', labelEs: 'Solo explorando', labelEn: 'Just exploring' },
  { value: 'diagnosis', labelEs: 'Listo para el diagnóstico', labelEn: 'Ready for the diagnosis' },
  { value: 'build', labelEs: 'Quiero construir', labelEn: 'Ready to build' },
  { value: 'operating', labelEs: 'Ya opero un cerebro', labelEn: 'Already running a brain' },
];

// roleOptions — 5 opciones dropdown (CM §2.3)
const ROLE_OPTIONS = [
  { value: 'founder', labelEs: 'Fundador / CEO', labelEn: 'Founder / CEO' },
  { value: 'marketing', labelEs: 'Marketing / Marca', labelEn: 'Marketing / Brand' },
  { value: 'ops', labelEs: 'Operaciones / Tech', labelEn: 'Operations / Tech' },
  { value: 'sales', labelEs: 'Ventas', labelEn: 'Sales' },
  { value: 'other', labelEs: 'Otro', labelEn: 'Other' },
];

// ── §4 MICROCOPY ──────────────────────────────────────────────────────────────
// ContentMaster §2.7 + §2.5 (D-07=A)

const MICROCOPY_ES = {
  successTitle: 'Listo. Te respondemos en 24h hábiles.',
  otherChannelsLabel: 'Si preferís escribir directamente:',
  otherChannelsNote: 'Misma persona, misma respuesta.',
};

const MICROCOPY_EN = {
  successTitle: "Done. We'll reply within 24 business hours.",
  otherChannelsLabel: 'If you prefer to write directly:',
  otherChannelsNote: 'Same person, same response.',
};

// ── §5 FAQ ────────────────────────────────────────────────────────────────────
// ES questions: SEO-AEO-contacto §9.5 (AEO-optimized, include "Sivar Brains")
// EN questions: ContentMaster §2.6
// Answers: SEO-AEO §9.5 (canonical JSON-LD text)

const FAQ_HEADING_ES = 'Preguntas frecuentes';
const FAQ_HEADING_EN = 'Frequently asked questions';

const FAQ_ES = [
  {
    question: '¿Cuándo recibo respuesta de Sivar Brains?',
    answer:
      'En 24 horas hábiles. No es un sistema automático: es una persona real leyendo tu mensaje. Si enviás un viernes al mediodía, respondemos el lunes a más tardar.',
  },
  {
    question: '¿El diagnóstico de Sivar Brains tiene costo?',
    answer:
      'El contacto inicial es sin costo. Si hay match, proponemos un diagnóstico con alcance y precio definidos antes de comenzar —sabés exactamente qué incluye y cuánto cuesta antes de decir que sí.',
  },
  {
    question: '¿Sivar Brains atiende empresas fuera de El Salvador?',
    answer:
      'Sí. Trabajamos con empresas B2B en LATAM y con equipos que operan en español o inglés desde cualquier país. El trabajo es remoto por defecto.',
  },
  {
    question: '¿Puedo contactar a Sivar Brains directamente por email sin el formulario?',
    answer:
      'Sí. contacto@sivarbrains.com llega al mismo equipo que atiende el formulario. Misma persona, misma prioridad.',
  },
  {
    question: '¿Con qué tipo de empresa trabaja Sivar Brains?',
    answer:
      'Con empresas B2B que tienen contenido y proceso reales, pero aún no tienen un sistema que los coordine. Si tenés dudas de si encaja, describilo en el mensaje —respondemos con honestidad.',
  },
];

const FAQ_EN = [
  {
    question: 'When will I receive a reply?',
    answer:
      "Within 24 business hours. This isn't an automated system: it's a real person reading your message. If you send on a Friday afternoon, we reply Monday at the latest.",
  },
  {
    question: 'Does the diagnosis have a cost?',
    answer:
      "The initial contact is no-cost. If there's a match, we propose a diagnosis with defined scope and price before we start —you know exactly what's included and what it costs before saying yes.",
  },
  {
    question: 'Do you work with companies outside El Salvador?',
    answer:
      'Yes. We work with B2B companies in Latin America and with teams operating in Spanish or English from any country. Work is remote by default.',
  },
  {
    question: 'Can I write directly without the form?',
    answer:
      'Yes. contacto@sivarbrains.com — reaches the same team that handles the form. Same person, same priority.',
  },
  {
    question: 'What type of company do you work with?',
    answer:
      "B2B companies that have real content and process, but don't yet have a system to coordinate them. If you're not sure it's a fit, describe it in the message —we'll answer honestly.",
  },
];

// ── §6 SEO ────────────────────────────────────────────────────────────────────
// SEO-AEO-contacto-SB §3 (metaTitle) + §4 (metaDescription)

const SEO_ES = {
  metaTitle: 'Sentémonos a pensar · Contacto · Sivar Brains',
  metaDescription:
    'Contános dónde está tu marca. Diagnóstico cerrado, sin compromiso: 2 a 3 semanas, alcance definido. Respondemos en 24h hábiles. Una persona real, no un bot.',
};

const SEO_EN = {
  metaTitle: "Let's think this through · Contact · Sivar Brains",
  metaDescription:
    'Tell us where your brand is. Closed diagnosis, no commitment: 2 to 3 weeks, defined scope. We reply within 24 business hours. A real person, not a bot.',
};

// ── SEED ─────────────────────────────────────────────────────────────────────

async function seedContactPage() {
  const payload = await getPayload({ config });

  console.log('[seed-contact-page] FASE 4 — SiteContactPage ES+EN');
  console.log('[seed-contact-page] Fuentes: ContentMaster Contacto v1.0 + SEO-AEO-contacto v2.0');
  console.log('[seed-contact-page] D-CT-06=A (sin manifesto card) · D-07=A (email+form)');

  // @ts-justify: Payload v3 internal pg pool — workaround documentado L-BBF-256
  const pool = (payload as any).db.pool as {
    query: (sql: string, params?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>;
  };

  // ── PASO 1: Poblar ES via Payload API ─────────────────────────────────────
  await payload.updateGlobal({
    slug: 'site-contact-page',
    locale: 'es',
    data: {
      hero: HERO_ES,
      stepsEyebrow: STEPS_EYEBROW_ES,
      steps: STEPS_ES,
      formConfig: {
        ...FORM_CONFIG_ES,
        stageOptions: STAGE_OPTIONS.map((o) => ({ value: o.value, label: o.labelEs })),
        roleOptions: ROLE_OPTIONS.map((o) => ({ value: o.value, label: o.labelEs })),
      },
      microcopy: MICROCOPY_ES,
      faqHeading: FAQ_HEADING_ES,
      faq: FAQ_ES,
      seo: SEO_ES,
    },
  });

  console.log('[1/7] ✅ locale ES poblado via Payload API');

  // ── PASO 2: Leer IDs desde DB ─────────────────────────────────────────────
  const cpRow = await pool.query('SELECT id FROM site_contact_page LIMIT 1');
  const parentId = cpRow.rows[0]?.id as number;
  if (!parentId) throw new Error('[seed-contact-page] site_contact_page row not found');

  const stepsRows = await pool.query(
    'SELECT id FROM site_contact_page_steps WHERE _parent_id = $1 ORDER BY _order',
    [parentId],
  );
  const stageRows = await pool.query(
    'SELECT id FROM cp_stage WHERE _parent_id = $1 ORDER BY _order',
    [parentId],
  );
  const roleRows = await pool.query(
    'SELECT id FROM cp_role WHERE _parent_id = $1 ORDER BY _order',
    [parentId],
  );
  const faqRows = await pool.query('SELECT id FROM cp_faq WHERE _parent_id = $1 ORDER BY _order', [
    parentId,
  ]);

  console.log(
    `[2/7] ✅ IDs leídos — site_contact_page.id=${parentId} | steps=${stepsRows.rows.length} stage=${stageRows.rows.length} role=${roleRows.rows.length} faq=${faqRows.rows.length}`,
  );

  if (stepsRows.rows.length !== 4)
    throw new Error(
      `[seed-contact-page] ERROR: esperaba 4 steps, encontré ${stepsRows.rows.length}`,
    );
  if (stageRows.rows.length !== 4)
    throw new Error(
      `[seed-contact-page] ERROR: esperaba 4 stageOptions, encontré ${stageRows.rows.length}`,
    );
  if (roleRows.rows.length !== 5)
    throw new Error(
      `[seed-contact-page] ERROR: esperaba 5 roleOptions, encontré ${roleRows.rows.length}`,
    );
  if (faqRows.rows.length !== 5)
    throw new Error(`[seed-contact-page] ERROR: esperaba 5 faq, encontré ${faqRows.rows.length}`);

  // ── PASO 3: EN locales de site_contact_page_locales ───────────────────────
  await pool.query(
    `INSERT INTO site_contact_page_locales (
       hero_heading, hero_subtitle, hero_lede, hero_anchor_phrase,
       steps_eyebrow,
       form_config_title, form_config_stage_label, form_config_role_label,
       form_config_message_placeholder, form_config_required_hint, form_config_submit_label,
       microcopy_success_title, microcopy_other_channels_label, microcopy_other_channels_note,
       faq_heading,
       seo_meta_title, seo_meta_description,
       _locale, _parent_id
     ) VALUES (
       $1,$2,$3,$4,
       $5,
       $6,$7,$8,$9,$10,$11,
       $12,$13,$14,
       $15,
       $16,$17,
       'en', $18
     )
     ON CONFLICT (_locale, _parent_id) DO UPDATE SET
       hero_heading                  = EXCLUDED.hero_heading,
       hero_subtitle                 = EXCLUDED.hero_subtitle,
       hero_lede                     = EXCLUDED.hero_lede,
       hero_anchor_phrase            = EXCLUDED.hero_anchor_phrase,
       steps_eyebrow                 = EXCLUDED.steps_eyebrow,
       form_config_title             = EXCLUDED.form_config_title,
       form_config_stage_label       = EXCLUDED.form_config_stage_label,
       form_config_role_label        = EXCLUDED.form_config_role_label,
       form_config_message_placeholder = EXCLUDED.form_config_message_placeholder,
       form_config_required_hint     = EXCLUDED.form_config_required_hint,
       form_config_submit_label      = EXCLUDED.form_config_submit_label,
       microcopy_success_title       = EXCLUDED.microcopy_success_title,
       microcopy_other_channels_label= EXCLUDED.microcopy_other_channels_label,
       microcopy_other_channels_note = EXCLUDED.microcopy_other_channels_note,
       faq_heading                   = EXCLUDED.faq_heading,
       seo_meta_title                = EXCLUDED.seo_meta_title,
       seo_meta_description          = EXCLUDED.seo_meta_description`,
    [
      HERO_EN.heading,
      HERO_EN.subtitle,
      HERO_EN.lede,
      HERO_EN.anchorPhrase,
      STEPS_EYEBROW_EN,
      FORM_CONFIG_EN.title,
      FORM_CONFIG_EN.stageLabel,
      FORM_CONFIG_EN.roleLabel,
      FORM_CONFIG_EN.messagePlaceholder,
      FORM_CONFIG_EN.requiredHint,
      FORM_CONFIG_EN.submitLabel,
      MICROCOPY_EN.successTitle,
      MICROCOPY_EN.otherChannelsLabel,
      MICROCOPY_EN.otherChannelsNote,
      FAQ_HEADING_EN,
      SEO_EN.metaTitle,
      SEO_EN.metaDescription,
      parentId,
    ],
  );

  console.log('[3/7] ✅ EN locales de site_contact_page_locales (UPSERT)');

  // ── PASO 4: EN locales de site_contact_page_steps_locales ─────────────────
  for (let i = 0; i < stepsRows.rows.length; i++) {
    const itemId = stepsRows.rows[i].id as string;
    const en = STEPS_EN[i];
    await pool.query(
      `INSERT INTO site_contact_page_steps_locales (title, body, _locale, _parent_id)
       VALUES ($1, $2, 'en', $3)
       ON CONFLICT (_locale, _parent_id) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body`,
      [en.title, en.body, itemId],
    );
    console.log(`    → step[${i}] EN: "${en.title}"`);
  }

  console.log('[4/7] ✅ EN locales de site_contact_page_steps_locales (4 items)');

  // ── PASO 5: EN locales de cp_stage_locales ────────────────────────────────
  for (let i = 0; i < stageRows.rows.length; i++) {
    const itemId = stageRows.rows[i].id as string;
    const en = STAGE_OPTIONS[i];
    await pool.query(
      `INSERT INTO cp_stage_locales (label, _locale, _parent_id)
       VALUES ($1, 'en', $2)
       ON CONFLICT (_locale, _parent_id) DO UPDATE SET label = EXCLUDED.label`,
      [en.labelEn, itemId],
    );
    console.log(`    → stage[${i}] EN: "${en.labelEn}"`);
  }

  console.log('[5/7] ✅ EN locales de cp_stage_locales (4 items)');

  // ── PASO 6: EN locales de cp_role_locales ─────────────────────────────────
  for (let i = 0; i < roleRows.rows.length; i++) {
    const itemId = roleRows.rows[i].id as string;
    const en = ROLE_OPTIONS[i];
    await pool.query(
      `INSERT INTO cp_role_locales (label, _locale, _parent_id)
       VALUES ($1, 'en', $2)
       ON CONFLICT (_locale, _parent_id) DO UPDATE SET label = EXCLUDED.label`,
      [en.labelEn, itemId],
    );
    console.log(`    → role[${i}] EN: "${en.labelEn}"`);
  }

  console.log('[6/7] ✅ EN locales de cp_role_locales (5 items)');

  // ── PASO 7: EN locales de cp_faq_locales ──────────────────────────────────
  for (let i = 0; i < faqRows.rows.length; i++) {
    const itemId = faqRows.rows[i].id as string;
    const en = FAQ_EN[i];
    await pool.query(
      `INSERT INTO cp_faq_locales (question, answer, _locale, _parent_id)
       VALUES ($1, $2, 'en', $3)
       ON CONFLICT (_locale, _parent_id) DO UPDATE SET question = EXCLUDED.question, answer = EXCLUDED.answer`,
      [en.question, en.answer, itemId],
    );
    console.log(`    → faq[${i}] EN: "${en.question}"`);
  }

  console.log('[7/7] ✅ EN locales de cp_faq_locales (5 items)');

  // ── VERIFICACIÓN FINAL ────────────────────────────────────────────────────
  console.log('');
  console.log('[seed-contact-page] Verificación SQL:');

  const localesCheck = await pool.query(
    `SELECT _locale,
       hero_heading, steps_eyebrow, form_config_title,
       microcopy_success_title, faq_heading,
       seo_meta_title, seo_meta_description
     FROM site_contact_page_locales
     WHERE _parent_id = $1
     ORDER BY _locale`,
    [parentId],
  );

  for (const row of localesCheck.rows) {
    const locale = row._locale;
    const ok =
      !!row.hero_heading &&
      !!row.steps_eyebrow &&
      !!row.form_config_title &&
      !!row.microcopy_success_title &&
      !!row.faq_heading &&
      !!row.seo_meta_title &&
      !!row.seo_meta_description;
    console.log(
      `   ${ok ? '✅' : '❌'} [${locale}] heading="${row.hero_heading}" | seoTitle="${row.seo_meta_title}" | seoDesc="${String(row.seo_meta_description).length} chars"`,
    );
  }

  const stepsCounts = await pool.query(
    `SELECT l._locale, COUNT(*) AS n
     FROM site_contact_page_steps s
     JOIN site_contact_page_steps_locales l ON l._parent_id = s.id
     WHERE s._parent_id = $1
     GROUP BY l._locale ORDER BY l._locale`,
    [parentId],
  );

  const stageCounts = await pool.query(
    `SELECT l._locale, COUNT(*) AS n
     FROM cp_stage s
     JOIN cp_stage_locales l ON l._parent_id = s.id
     WHERE s._parent_id = $1
     GROUP BY l._locale ORDER BY l._locale`,
    [parentId],
  );

  const roleCounts = await pool.query(
    `SELECT l._locale, COUNT(*) AS n
     FROM cp_role r
     JOIN cp_role_locales l ON l._parent_id = r.id
     WHERE r._parent_id = $1
     GROUP BY l._locale ORDER BY l._locale`,
    [parentId],
  );

  const faqCounts = await pool.query(
    `SELECT l._locale, COUNT(*) AS n
     FROM cp_faq f
     JOIN cp_faq_locales l ON l._parent_id = f.id
     WHERE f._parent_id = $1
     GROUP BY l._locale ORDER BY l._locale`,
    [parentId],
  );

  const toMap = (rows: Array<Record<string, unknown>>) =>
    Object.fromEntries(rows.map((r) => [r._locale as string, Number(r.n)]));

  const stepsMap = toMap(stepsCounts.rows);
  const stageMap = toMap(stageCounts.rows);
  const roleMap = toMap(roleCounts.rows);
  const faqMap = toMap(faqCounts.rows);

  console.log(`   steps: ES=${stepsMap.es ?? 0} EN=${stepsMap.en ?? 0} (esperado 4×2)`);
  console.log(`   stage: ES=${stageMap.es ?? 0} EN=${stageMap.en ?? 0} (esperado 4×2)`);
  console.log(`   role:  ES=${roleMap.es ?? 0} EN=${roleMap.en ?? 0} (esperado 5×2)`);
  console.log(`   faq:   ES=${faqMap.es ?? 0} EN=${faqMap.en ?? 0} (esperado 5×2)`);

  const pass =
    localesCheck.rows.length === 2 &&
    stepsMap.es === 4 &&
    stepsMap.en === 4 &&
    stageMap.es === 4 &&
    stageMap.en === 4 &&
    roleMap.es === 5 &&
    roleMap.en === 5 &&
    faqMap.es === 5 &&
    faqMap.en === 5;

  if (pass) {
    console.log('');
    console.log('✅ SiteContactPage POBLADO — ES+EN completo (ContentMaster + SEO-AEO)');
    console.log('   hero×2 · steps 4×2 · stageOptions 4×2 · roleOptions 5×2 · faq 5×2 · seo×2');
  } else {
    throw new Error('[seed-contact-page] ERROR: counts incorrectos — revisar logs arriba');
  }

  process.exit(0);
}

seedContactPage().catch((err) => {
  console.error('[seed-contact-page] ERROR:', err);
  process.exit(1);
});
