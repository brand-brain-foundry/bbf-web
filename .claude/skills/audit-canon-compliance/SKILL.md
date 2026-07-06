---
name: audit-canon-compliance
description: Audita un archivo o conjunto de archivos contra el Canon BBF, SB_Law, y los invariantes W-1..W-7. Usa cuando Zavala pida revisar trabajo previo, antes de cerrar un PR, o cuando termines una capa H1/H2 antes de declararla cerrada.
---

# Skill — Auditoría de compliance Canon + SB_Law

## Cuándo usar

- Zavala pide auditar X en `feedback.md`.
- Vas a cerrar una capa del Roadmap y necesitas validar antes de actualizar SSOT.
- Antes de abrir un PR significativo.
- Sospechas que algo se desvió del Canon en sesiones previas.

## Procedimiento

### 1. Determinar el alcance

¿Auditas un archivo? ¿Un directorio? ¿Una capa entera del Roadmap?

Si es una capa: lee la sección correspondiente del Roadmap (§4 H0, §5 H1, §6 H2) para saber qué debería existir.

### 2. Checklist universal (todos los archivos)

| Check | Cómo |
|---|---|
| Sin `any` injustificado | `rg -n ': any\b\|<any>' app/ collections/ globals/ blocks/ components/ lib/` — para cada hit verificar comentario `// @ts-justify:` |
| Sin hardcode de contenido | `rg -n '<h1>\|<h2>\|<p>' components/ app/` — todo texto visible debe venir de Payload o `lib/i18n/messages/` |
| Sin `<form>` HTML nativo en RSC | Forms son componentes `'use client'` |
| `dangerouslySetInnerHTML` solo en `<RichText>` | `rg -n 'dangerouslySetInnerHTML'` |
| `target="_blank"` con `rel="noopener noreferrer"` | `rg -n 'target="_blank"'` |
| Sin `fetch` interno a Payload desde RSC | RSC usa Local API. `fetch` solo para edge runtime. |

### 3. Checklist Payload (collections/, globals/, blocks/)

| Check | Verificación |
|---|---|
| Fields visibles al usuario son `localized: true` | Inspección manual contra Canon §4.1 |
| Hooks beforeChange/afterChange existen donde el Canon §4.3 los exige | Comparar contra la tabla |
| `access` declarativo, no permisivo | `read`, `create`, `update`, `delete` definidos |
| `versions.drafts` activo en collections con publishing | Posts, Cases, Pages, Episodes |
| Migración aplicada y `payload-types.ts` actualizado | `pnpm payload generate:types` no produce diff |

### 4. Checklist Next.js / pages

| Check | Verificación |
|---|---|
| `export const revalidate` declarado | Cada `page.tsx` |
| `generateMetadata` retorna meta + OG + hreflang | Cada `page.tsx` con contenido |
| JSON-LD Schema.org renderizado | Inspección de DOM o source |
| `'use client'` solo donde se necesita | `rg -l "'use client'" app/` |
| Imports de `next/image`, no `<img>` | `rg -n '<img ' app/ components/` |

### 5. Checklist seguridad (regla 40)

| Check | Verificación |
|---|---|
| Route handlers con escritura validan con Zod | Inspección |
| Rate limit con Upstash en `/api/contact`, `/api/newsletter/*` | Inspección |
| Honeypot field presente en forms públicos | Inspección |
| Turnstile validation en handlers | Inspección |
| Secrets via `process.env` validados con Zod en `lib/env.ts` | `cat lib/env.ts` |
| Sin `eval`, `Function()`, `new Function()` | `rg -n 'eval\\(\|new Function\\('` |

### 6. Checklist SEO+GEO (regla 50)

| Check | Verificación |
|---|---|
| `robots.txt` permisivo a AI bots | `cat public/robots.txt \|\| cat app/robots.ts` |
| `sitemap.xml` con hreflang | `curl localhost:3000/sitemap.xml` |
| `llms.txt` existe en ambos locales | `curl localhost:3000/llms.txt && curl localhost:3000/en/llms.txt` |
| JSON-LD Organization en layout root | Inspección de `app/(frontend)/layout.tsx` |
| Posts cumplen Answer Capsule 40-60 palabras | Inspección de campo `summary` en docs existentes |

### 7. Reporte

Estructura del reporte (markdown, en respuesta directa, no archivo nuevo):

```markdown
# Audit Report — <ámbito> — <fecha>

## ✅ Cumplimientos
- ...

## ⚠️ Desvíos menores (no bloqueantes)
- archivo.ts:42 — descripción exacta — sugerencia

## ❌ Violaciones (bloqueantes)
- archivo.ts:88 — viola SB_Law D-01 (uso de `any` sin justificación) — fix sugerido

## 📊 Métricas
- Archivos auditados: N
- Cumplimientos: X
- Desvíos: Y
- Violaciones: Z

## Veredicto
[CUMPLE / CUMPLE CON OBSERVACIONES / NO CUMPLE]
```

Si veredicto es **NO CUMPLE**: Zavala decide si proceder. No corrijas autonomamente las violaciones — repórtalas y deja que él priorice.

## Reglas

- **No hagas auditoría parcial silenciosa**. Si solo pudiste validar 3 de 7 checklists, dilo explícitamente.
- **No infieras intención** si el código se desvía. Reporta el desvío y deja que Zavala explique si fue deliberado.
- **No "arregles mientras auditas"**. Audit y fix son ciclos separados.
