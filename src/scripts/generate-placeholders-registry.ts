 
// BLOQUE 5 — Generate SB_PlaceholdersRegistry.md
// Extracts INTERPOLATION_PLACEHOLDERS from content-interpolation.ts via regex
// (no Payload init — pure fs + text processing).
// Output: bbf-docs/04-strategic/web-public/Content/Final/SB_PlaceholdersRegistry.md
//
// Run: node --import=tsx/esm src/scripts/generate-placeholders-registry.ts

import * as fs from 'fs';
import * as path from 'path';

const rootDir = path.resolve(new URL(import.meta.url).pathname, '../../..');
const srcFile = path.join(rootDir, 'src/lib/content-interpolation.ts');
const outFile = path.join(
  rootDir,
  '../bbf-docs/04-strategic/web-public/Content/Final/SB_PlaceholdersRegistry.md',
);

// ── Extract INTERPOLATION_PLACEHOLDERS from source ───────────────────────
const src = fs.readFileSync(srcFile, 'utf-8');
const match = src.match(/INTERPOLATION_PLACEHOLDERS\s*=\s*\[([\s\S]*?)\]\s*as const/);
if (!match) throw new Error('INTERPOLATION_PLACEHOLDERS not found in content-interpolation.ts');

const activeInCode: string[] = Array.from(match[1].matchAll(/'(\{\{[^}]+\}\})'/g)).map((m) => m[1]);

console.log(
  `[generate-placeholders-registry] Found ${activeInCode.length} active placeholders in code:`,
);
activeInCode.forEach((p) => console.log(`  ${p}`));

// ── Canon data — from SB_PlaceholdersCanon v1.1 §4.1 + §4.2 + §4.3 ───────

type PlaceholderEntry = {
  name: string;
  source: string;
  type: string;
  localized: boolean;
  phase: string;
  scope: string;
  example: string;
  status: 'active' | 'crear' | 'scoped' | 'rejected';
  notes?: string;
};

const CANON_ACTIVE: PlaceholderEntry[] = [
  {
    name: '{{siteName}}',
    source: 'SiteIdentity.siteName',
    type: 'string',
    localized: true,
    phase: 'FASE 3',
    scope: 'global',
    example: '"Sivar Brains"',
    status: 'active',
  },
  {
    name: '{{siteShortName}}',
    source: 'SiteIdentity.siteShortName',
    type: 'string',
    localized: true,
    phase: 'FASE 3',
    scope: 'global',
    example: '"SB"',
    status: 'active',
  },
  {
    name: '{{siteTagline}}',
    source: 'SiteIdentity.siteTagline',
    type: 'string',
    localized: true,
    phase: 'FASE 3',
    scope: 'global',
    example: '"Cerebros de marca operacionales"',
    status: 'active',
  },
  {
    name: '{{siteDescription}}',
    source: 'SiteIdentity.siteDescription',
    type: 'textarea',
    localized: true,
    phase: 'FASE 3',
    scope: 'global',
    example: '"Sivar Brains construye cerebros de marca..."',
    status: 'active',
  },
  {
    name: '{{longDescription}}',
    source: 'SiteIdentity.longDescription',
    type: 'textarea',
    localized: true,
    phase: 'FASE 3',
    scope: 'global',
    example: 'Texto largo (3-5 párrafos)',
    status: 'active',
    notes: 'naming gap: debería ser {{siteLongDescription}} — no renombrar (campo en admin)',
  },
  {
    name: '{{siteDomain}}',
    source: 'SiteIdentity.siteDomain',
    type: 'URL',
    localized: false,
    phase: 'FASE 3',
    scope: 'global',
    example: '"https://sivarbrains.com"',
    status: 'active',
  },
  {
    name: '{{founderName}}',
    source: 'SiteIdentity.founders[0].name',
    type: 'string',
    localized: false,
    phase: 'FASE 3',
    scope: 'global',
    example: '"Christian Zavala"',
    status: 'active',
  },
  {
    name: '{{foundersList}}',
    source: 'formatList(SiteIdentity.founders[].name, locale)',
    type: 'computed',
    localized: true,
    phase: 'FASE 3.6',
    scope: 'global',
    example: '"Christian Zavala, Brenda Gutiérrez y Pedro Gutiérrez"',
    status: 'active',
  },
  {
    name: '{{producerName}}',
    source: 'SiteIdentity.producer.name',
    type: 'string',
    localized: false,
    phase: 'FASE 3',
    scope: 'global',
    example: '"Brand Brain Foundry"',
    status: 'active',
  },
  {
    name: '{{currentYear}}',
    source: 'new Date().getFullYear()',
    type: 'computed',
    localized: false,
    phase: 'FASE 3',
    scope: 'global',
    example: '"2026"',
    status: 'active',
  },
];

const CANON_CREAR: PlaceholderEntry[] = [
  {
    name: '{{producerUrl}}',
    source: 'SiteIdentity.producer.url (field ya existe)',
    type: 'URL',
    localized: false,
    phase: 'FASE 4.C',
    scope: 'global',
    example: '"https://tu-dominio.com"',
    status: 'crear',
    notes:
      'DISCREPANCIA: field existe en admin, solo falta agregar a interpolate() + INTERPOLATION_PLACEHOLDERS',
  },
  {
    name: '{{foundingYear}}',
    source: 'SiteIdentity.foundingDate.split("-")[0]',
    type: 'derived',
    localized: false,
    phase: 'FASE 4.B + 4.C',
    scope: 'global',
    example: '"2025"',
    status: 'crear',
  },
  {
    name: '{{foundingDate}}',
    source: 'SiteIdentity.foundingDate (field a crear)',
    type: 'string',
    localized: false,
    phase: 'FASE 4.B + 4.C',
    scope: 'global',
    example: '"2025-10"',
    status: 'crear',
  },
  {
    name: '{{serviceCount}}',
    source: 'SiteHomepage.capabilities.items.length',
    type: 'derived',
    localized: true,
    phase: 'FASE 4.C',
    scope: 'global',
    example: '"5"',
    status: 'crear',
    notes: 'Requiere interpolateWithHomepage() separado (D-PLACEHOLDER-02)',
  },
  {
    name: '{{areaServedPrimary}}',
    source: 'SiteIdentity.areaServed[0].name',
    type: 'string',
    localized: true,
    phase: 'FASE 4.B + 4.C',
    scope: 'global',
    example: '"El Salvador"',
    status: 'crear',
  },
  {
    name: '{{areaServedRegion}}',
    source: 'SiteIdentity.areaServed[1].name',
    type: 'string',
    localized: true,
    phase: 'FASE 4.B + 4.C',
    scope: 'global',
    example: '"Latin America" / "América Latina"',
    status: 'crear',
  },
  {
    name: '{{currentLocale}}',
    source: 'locale param (ya en helper)',
    type: 'derived',
    localized: false,
    phase: 'FASE 4.C',
    scope: 'global',
    example: '"es" / "en"',
    status: 'crear',
    notes: 'No requiere campo admin (D-PLACEHOLDER-03)',
  },
];

const CANON_SCOPED: PlaceholderEntry[] = [
  {
    name: '{{articleAuthor}}',
    source: 'ContentItem.author → Entity.name',
    type: 'string',
    localized: true,
    phase: 'FASE 4.C',
    scope: 'interpolateArticle()',
    example: '"Christian Zavala"',
    status: 'scoped',
  },
  {
    name: '{{articleDate}}',
    source: 'ContentItem.publishedAt (formatted)',
    type: 'date',
    localized: true,
    phase: 'FASE 4.C',
    scope: 'interpolateArticle()',
    example: '"11 de junio de 2026"',
    status: 'scoped',
  },
  {
    name: '{{articleExcerpt}}',
    source: 'ContentItem.summary (Answer Capsule)',
    type: 'textarea',
    localized: true,
    phase: 'FASE 4.C',
    scope: 'interpolateArticle()',
    example: '40-80 palabras',
    status: 'scoped',
  },
  {
    name: '{{articleReadTime}}',
    source: 'ContentItem.readingTime (Math.ceil(wordCount/238))',
    type: 'computed',
    localized: false,
    phase: 'FASE 4.C',
    scope: 'interpolateArticle()',
    example: '"5 min"',
    status: 'scoped',
  },
  {
    name: '{{articleCategory}}',
    source: 'ContentItem.categories[0].name',
    type: 'string',
    localized: true,
    phase: 'FASE 4.C',
    scope: 'interpolateArticle()',
    example: '"Brand Intelligence"',
    status: 'scoped',
  },
  {
    name: '{{caseClientName}}',
    source: 'ContentItem.clientEntity.name',
    type: 'string',
    localized: true,
    phase: 'FASE 4.C',
    scope: 'interpolateCaseStudy()',
    example: '"Hacienda Real"',
    status: 'scoped',
  },
  {
    name: '{{caseTimelineFirst}}',
    source: 'ContentItem.timeline[0].milestone',
    type: 'string',
    localized: true,
    phase: 'FASE 4.C',
    scope: 'interpolateCaseStudy()',
    example: '"Q1 2025"',
    status: 'scoped',
  },
  {
    name: '{{caseTimelineLast}}',
    source: 'ContentItem.timeline[-1].milestone',
    type: 'string',
    localized: true,
    phase: 'FASE 4.C',
    scope: 'interpolateCaseStudy()',
    example: '"Q4 2025"',
    status: 'scoped',
  },
];

// ── Compute discrepancies ─────────────────────────────────────────────────
const canonActiveNames = new Set(CANON_ACTIVE.map((p) => p.name));
const canonCrearNames = new Set(CANON_CREAR.map((p) => p.name));
const canonScopedNames = new Set(CANON_SCOPED.map((p) => p.name));
const allCanonNames = new Set([...canonActiveNames, ...canonCrearNames, ...canonScopedNames]);
const codeSet = new Set(activeInCode);

const inCodeNotInCanon = activeInCode.filter((p) => !allCanonNames.has(p));
const inCanonActiveNotInCode = CANON_ACTIVE.filter((p) => !codeSet.has(p.name));
const inCanonCrearNotInCode = CANON_CREAR.filter((p) => !codeSet.has(p.name));

// ── Build markdown ────────────────────────────────────────────────────────
const today = '2026-06-12';

const md = `# SB Placeholders Registry

**Versión:** 1.0
**Fecha:** ${today}
**Generado por:** \`src/scripts/generate-placeholders-registry.ts\`
**Fuente código:** \`src/lib/content-interpolation.ts\` → \`INTERPOLATION_PLACEHOLDERS\`
**Fuente Canon:** \`SB_PlaceholdersCanon.md\` v1.1
**Despacho:** B-BBF-WEB-FASE4-B-2 BLOQUE 5

---

## §1 Placeholders activos en código (${activeInCode.length})

\`INTERPOLATION_PLACEHOLDERS\` array en \`content-interpolation.ts\`:

| Placeholder | Source admin | Localized | Phase | Ejemplo ES |
|---|---|---|---|---|
${CANON_ACTIVE.map(
  (p) =>
    `| \`${p.name}\` | ${p.source} | ${p.localized ? '✅' : '❌'} | ${p.phase} | ${p.example} |`,
).join('\n')}

---

## §2 Placeholders en Canon — pendientes implementación

### §2.1 Globales a crear (${CANON_CREAR.length})

Definidos en \`SB_PlaceholdersCanon.md\` §4.2. Requieren cambios en código.

| Placeholder | Source | Localized | Requiere | Notas |
|---|---|---|---|---|
${CANON_CREAR.map(
  (p) =>
    `| \`${p.name}\` | ${p.source} | ${p.localized ? '✅' : '❌'} | \`[${p.phase}]\` | ${p.notes ?? '—'} |`,
).join('\n')}

### §2.2 Scoped (contexto ContentItem) — ${CANON_SCOPED.length} items

No van en \`interpolate()\` global. Requieren helpers separados.

| Placeholder | Helper | Source | Phase |
|---|---|---|---|
${CANON_SCOPED.map((p) => `| \`${p.name}\` | \`${p.scope}\` | ${p.source} | \`[${p.phase}]\` |`).join('\n')}

---

## §3 Tabla de discrepancias

### §3.1 En código pero NO en Canon activos

${inCodeNotInCanon.length === 0 ? '_Ninguno — código y Canon están alineados en activos._' : inCodeNotInCanon.map((p) => `- \`${p}\``).join('\n')}

### §3.2 En Canon ACTIVOS pero NO en código

${inCanonActiveNotInCode.length === 0 ? '_Ninguno._' : inCanonActiveNotInCode.map((p) => `- \`${p.name}\` — ${p.notes ?? p.source}`).join('\n')}

### §3.3 DISCREPANCIA CRÍTICA — \`{{producerUrl}}\`

| Campo | Estado |
|---|---|
| \`SiteIdentity.producer.url\` (admin field) | ✅ Existe (defaultValue: '' — configurable en admin) |
| Canon §4.2 \`{{producerUrl}}\` | ❌ CREAR — marcado "requiere solo [FASE 4.C]" |
| \`INTERPOLATION_PLACEHOLDERS\` en código | ❌ NO incluido |
| \`interpolate()\` helper | ❌ NO implementado |

**Acción requerida (FASE 4.C):** Agregar \`'{{producerUrl}}'\` a \`INTERPOLATION_PLACEHOLDERS\` + agregar \`.replace(/\\{\\{producerUrl\\}\\}/g, site.producer?.url ?? '')\` en \`interpolate()\`.
El campo admin ya existe — solo es cambio de código (D-PLACEHOLDER-04).

---

## §4 Resumen de estado

| Estado | Count |
|---|---|
| Activos en código + en Canon | ${CANON_ACTIVE.length} |
| Globales pendientes (Canon CREAR, no en código) | ${CANON_CREAR.length} |
| Scoped pendientes (article* + case*) | ${CANON_SCOPED.length} |
| En código pero sin Canon doc | ${inCodeNotInCanon.length} |
| Discrepancias críticas | 1 (\`{{producerUrl}}\`) |

---

*Registro generado automáticamente. Fuente de verdad: \`SB_PlaceholdersCanon.md\`.*
*Para modificar: actualizar \`SB_PlaceholdersCanon.md\` y re-ejecutar el script.*
`;

fs.writeFileSync(outFile, md, 'utf-8');
console.log(`\n[generate-placeholders-registry] ✅ Registry escrito en:\n  ${outFile}`);
console.log(
  `  ${CANON_ACTIVE.length} activos | ${CANON_CREAR.length} pendientes | ${CANON_SCOPED.length} scoped`,
);
console.log(
  `  Discrepancias: ${inCodeNotInCanon.length + inCanonActiveNotInCode.length} (+ 1 crítica: {{producerUrl}})`,
);
