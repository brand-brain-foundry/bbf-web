---
name: create-inner-page
description: Construye una página interna BBF de cero siguiendo el patrón establecido en /contacto. Usa para /cerebro-marca, /como-trabajamos, /casos/hacienda-real, /quienes-somos. Patrón: Global Payload → migración → seed ES+EN → componentes dark → SEO @graph → validar → commit. D-CT-07 firmado 2026-06-27.
---

# Skill — Crear página interna BBF

## Patrón establecido en /contacto (C-9 2deb8e1)

Toda página interna BBF sigue esta secuencia estricta. **No saltarse niveles** (SB_Law B-01: primitivo → específico).

---

## Flujo canónico

### ETAPA 0 — Auditoría previa

Antes de crear NADA:

1. **Leer la referencia visual** (si existe en `public/assets/development/`).
2. **Identificar qué mantener** del homepage vs. qué es propio de la página.
3. **Mapear cada propiedad visual** a un token del sistema:
   - Tokens Tier 1 (primitivos): `--bbf-color-*`, `--bbf-space-*`
   - Tokens Tier 2 (semánticos): `--bbf-on-surface-*`, `--bbf-accent-*`
   - Tokens Tier 3 (componente): encapsulados en `capabilities-*.css` o `<page-name>.css`
   - **Nunca aplanar** a valores fijos (L-BBF-296, L-BBF-297)
4. **Verificar que la page está en el Canon** §4.2 o tiene D-BBF-WEB firmada.

### ETAPA 1 — Schema Payload Global

**Parar dev server ANTES de editar el schema** (L-BBF-288, L-BBF-287).

```bash
# 1. Detener dev server si está corriendo
# 2. Crear src/payload/globals/Site<NombrePagina>.ts
```

Template:
```ts
import type { GlobalConfig } from 'payload';

export const Site<NombrePagina>: GlobalConfig = {
  slug: 'site-<nombre-kebab>',
  label: { es: '...', en: '...' },
  fields: [
    // REGLA: todo campo de contenido visible → localized: true (Regla 10)
    // REGLA: dbName ≤ 63 chars — PRE-CALCULAR antes de crear el campo (L-BBF-289)
    // REGLA: required: false en localized → guardado parcial sin bloqueos (D-WA-05)
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true, required: false },
        { name: 'subtitle', type: 'text', localized: true, required: false },
        { name: 'lede', type: 'textarea', localized: true, required: false },
      ],
    },
    // ... campos específicos de la página
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text', localized: true, required: false },
        { name: 'metaDescription', type: 'textarea', localized: true, required: false },
      ],
    },
  ],
};
```

**Verificar dbName:** cada tabla/columna Payload se nombra `<slug>_<field>`. PostgreSQL NAMEDATALEN = 63 chars. Si supera: usar `dbName` explícito.

```ts
// Calcular ANTES de crear:
// "site_contacto_form_config_stage_options" = 40 chars ✅
// "site_nombre_muy_largo_field_array_items_locales" = > 63 ❌ → añadir dbName
```

### ETAPA 2 — Registrar en payload.config.ts + generate:types

```bash
# Añadir el Global a payload.config.ts → globals: [... , Site<NombrePagina>]
# Luego:
pnpm payload generate:types
```

### ETAPA 3 — Migración

```bash
# Con dev server DETENIDO:
pnpm payload migrate:create <nombre-kebab>-page
# Revisar el .ts y .json generados
pnpm payload migrate
```

Verificar que la migración es idempotente (guards `IF NOT EXISTS` / `DO EXCEPTION WHEN duplicate_object THEN null END`).

Si la migración queda como no-op (la DB ya tiene los cambios por auto-push accidental):
- Ver L-BBF-287 (fix protocol: no-op UP + re-migrate).

### ETAPA 4 — Seed ES+EN

**Completar la fuente canónica (SEO-AEO doc) ANTES del seed** (L-BBF-295).

Crear `scripts/seed-<nombre-kebab>-page.ts`:

```ts
// Patrón L-BBF-256: ES via Payload Local API + EN via SQL UPSERT ON CONFLICT
// O ambos via Payload si los campos soportan locale en el mismo call
```

```bash
# Correr seed:
set -a; source .env.local; set +a && pnpm tsx scripts/seed-<nombre-kebab>-page.ts
```

Verificar en admin (`/admin`) que ES + EN tienen contenido real, sin placeholders.

### ETAPA 5 — Componentes

**Principios duros (L-BBF-296..300):**

1. **Emular, no aplanar** — toda propiedad visual mapea a un token canónico. Nunca valores fijos.
2. **Surface dark** — si la página usa dark surface:
   - `data-surface="dark"` en el wrapper section
   - Texto principal: `--bbf-on-surface-title` (off-white, no blanco puro)
   - Texto body: `--bbf-on-surface-body`
   - Texto muted: `--bbf-on-surface-muted`
   - Accent desaturado: verificar contraste sobre dark
   - **Placeholder faint**: `color: var(--bbf-on-surface-muted)` en `::placeholder` (L-BBF-298)
   - **Hover azul transversal**: `--bbf-accent-blue` en todos los interactivos (L-BBF-299)
3. **Tokens Tier 3 encapsulados** en `src/styles/tokens/components/<page-name>.css`
   - No usar tokens sistema BBF como Tier 3 — son pieles de página, no design system (D-WA-04)
   - Importar en `globals.css` en el slot TIER 3
4. **Layout 3-slot** (si aplica): mobile order top→right→bottom via CSS `order`
5. **Cero hardcode** — todo contenido de admin o i18n. Cero strings en componentes.
6. **Zona intocable intacta** — no tocar lógica de seguridad del form (`/api/contact/route.ts`)

Estructura de archivos:
```
src/components/sections/<NombrePagina>Section/
  index.tsx       # layout wrapper (data-surface, slots)
src/components/molecules/<NombrePagina>/
  index.tsx       # molecule principal
src/styles/tokens/components/<nombre-kebab>.css   # Tier 3
```

### ETAPA 6 — SEO + JSON-LD

**@graph pattern (hereda @id del homepage):**

> ⚠️ **@id canónicos verificados cross-page (L-BBF-304, D-CT-BUG-01):**
> - Organization: `{domain}/#org` — declarado en `StructuredData.tsx` (layout)
> - WebSite: `{domain}/#website` — declarado en `StructuredData.tsx` (layout)
> - NO usar `#organization` — entidad huérfana no vinculada al homepage.
> - Verificar cross-page: leer `StructuredData.tsx` y comparar `@id` exacto antes de codificar.

```ts
const pageGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    // WebPage/ContactPage/AboutPage — localizado por locale
    {
      '@type': '<PageType>',
      '@id': `${domain}/<slug>#webpage`,
      url: pageUrl,
      name: seoTitle,          // de admin
      description: seoDesc,    // de admin
      inLanguage: l === 'es' ? 'es-SV' : 'en-US',
      isPartOf: { '@id': `${domain}/#website` },   // ← #website (no #site, no #web)
      about: { '@id': `${domain}/#org` },           // ← #org (no #organization)
      breadcrumb: { '@id': breadcrumbId },
    },
    // BreadcrumbList — localizado (t('breadcrumbHome') / t('breadcrumbPage'))
    {
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t('breadcrumbHome'), item: homeUrl },
        { '@type': 'ListItem', position: 2, name: t('breadcrumbPage'), item: pageUrl },
      ],
    },
    // Organization — REFERENCIA @id del homepage (NO redeclarar)
    // @id EXACTO: {domain}/#org (L-BBF-304, D-CT-BUG-01)
    // Solo añadir propiedades contextuales si las tiene (contactPoint, etc.)
    // Si no tiene props contextuales: OMITIR el nodo Organization (L-BBF-301)
    {
      '@type': 'Organization',
      '@id': `${domain}/#org`,                     // ← #org siempre, no #organization
      // contactPoint, makesOffer, etc. solo si aplica
    },
    // FAQPage — si la página tiene preguntas frecuentes
    // @id: `${domain}/<slug-es>#faqpage` (mismo entre locales — L-BBF-301)
  ],
};
```

**Slugs localizados (D-CT-03):**
```ts
// ES: /nombre-pagina, EN: /en/page-name
const alternates = buildHreflangBySlugMap(locale, { es: 'nombre-pagina', en: 'page-name' }, domain);
```

**Actualizar también:**
- `sitemap.ts` — añadir la página con sus slugs ES+EN
- `llms.txt` — añadir sección de la página
- `src/i18n/messages/es.json` + `en.json` — `breadcrumbPage` en el namespace

### ETAPA 7 — Validación

```bash
# 1. TypeScript
pnpm tsc --noEmit
# PASS: exit 0

# 2. Servidor dev
pnpm dev
# Navegar a /es/<slug> y /en/<slug-en>

# 3. JSON-LD — validar programáticamente (L-BBF-303)
# En browser devtools:
# JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)
# O en terminal via Node (para guardar a /tmp):
# node -e "require('http').get('http://localhost:3000/es/<slug>', r => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>{ const m=d.match(/<script type="application\/ld\+json">([^<]+)<\/script>/); if(m) { JSON.parse(m[1]); console.log('✅ valid'); } }); }).on('error',e=>console.error(e))"

# 4. Copiar para validator.schema.org:
cat /tmp/jsonld-<page>-es.json | pbcopy
# Pegar en https://validator.schema.org/ → "Code snippet"
```

**Checklist cero-hardcode:**
- [ ] Heading/subtitle viene de admin
- [ ] Meta title/description viene de admin (o i18n como fallback)
- [ ] Breadcrumb labels de i18n (t('breadcrumbHome'), t('breadcrumbPage'))
- [ ] Email/URL visible viene de admin global (SiteContact, SiteIdentity)
- [ ] Ningún string de contenido hardcoded en componente

### ETAPA 8 — Commit + Registro

```bash
# Commit en bbf-web con mensaje referenciando las decisiones
git add <solo archivos de la página — NO output.md, backups, prototipos>
git commit -m "feat(<nombre>): <descripción>"
```

Luego registrar en el hub y bbf-docs:
> **Nota 05d-web-2:** RegistroMaestro y Tracker §10 vivían en `bbf-docs/04-strategic/` (purgado en 05c-PURGE).
> El equivalente activo: actualizar `bbf-command-hub/repos/bbf-web/ESTADO_CANONICO.md` + crear SSOT en `bbf-docs/sb-docs/sb-web/02-referencia/` con skill `crear-doc`.
- ESTADO_CANONICO hub: nueva sección con decisiones D-<PAGE>-01..N
- Lecciones nuevas si emergieron → ESTADO_CANONICO §LECCIONES

---

## Principios duros (resumen ejecutivo)

| Principio | Regla |
|---|---|
| Cero aleatorio | Todo número viene del sistema de tokens. Cero magic numbers. |
| Cero duplicado | SB_Law C-01. Una fuente de verdad. Admin para contenido, i18n para labels. |
| Emular-no-aplanar | Propiedades visuales → tokens del sistema. Nunca `color: #1a1a1a` cuando existe `--bbf-on-surface-title`. |
| Contenido-de-admin | Headings, body text, FAQ, steps, emails → Payload admin. Fallback i18n solo para labels de UI. |
| Zona-intocable-intacta | La lógica de seguridad del form (`/api/contact/route.ts`: rate limit, Zod, honeypot, Turnstile) nunca se toca desde la página. |
| Dev server down antes de schema | L-BBF-288. Si no: la migration queda no-op y se necesita fix manual. |
| dbName ≤ 63 chars | L-BBF-289. Pre-calcular SIEMPRE antes de crear campos array/group. |

---

## Páginas restantes (post-/contacto)

| Página | Slug ES | Slug EN | Notas |
|---|---|---|---|
| /cerebro-marca | cerebro-marca | en/brand-brain | Página cornerstone SEO. Mayor densidad AEO. |
| /como-trabajamos | como-trabajamos | en/how-we-work | Método + proceso. Steps + visual. |
| /casos/hacienda-real | casos/hacienda-real | en/cases/hacienda-real | Primer case study completo. |
| /quienes-somos | quienes-somos | en/who-we-are | Team + misión + Author pages. |

---

## Referencias cruzadas

- L-BBF-296..303 (RegistroMaestro §7, Tracker §10 FASE /CONTACTO)
- D-CT-01..08 (RegistroMaestro §7)
- L-BBF-288..291 (Tracker L-BBF-288..294 FASE CAPABILITIES)
- L-BBF-295 (Tracker SPRINT 2 — fuente canónica antes del seed)
- Commit de referencia: `2deb8e1` (bbf-web FASE /CONTACTO)
