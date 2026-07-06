---
name: create-payload-collection
description: Crea una nueva collection de Payload siguiendo el Canon §4.1. Usa cuando Zavala pida agregar un schema nuevo, una collection que falte del Canon, o cuando una capa H1-1 del Roadmap esté ejecutándose. NO uses para inventar collections fuera del Canon.
---

# Skill — Crear collection de Payload

## Cuándo usar esta skill

Solo cuando:
1. La collection está listada en Canon §4.1.1, §4.1.2 (core u operación), o
2. Hay una D-BBF-WEB-* firmada que la introduce, o
3. Zavala lo pide explícitamente en `feedback.md`.

**Si la collection no está cubierta: NO la crees. Pausa y reporta el gap.**

## Pasos

### 1. Verificar Canon

> **Nota 05d-web-2:** BBF_WebPublicaTopologiaCanon_v0_1.md fue purgado de bbf-docs en 05c-PURGE.
> Consultar snapshot en: `bbf-docs/docs-pre-hub/sb-web/04-strategic/web-public/BBF_WebPublicaTopologiaCanon_v0_3.md`
> Para nuevas collections no documentadas en el Canon legacy: verificar con Zavala antes de crear.

```bash
grep -E "Collection.*\b<NombreCollection>\b" /Volumes/PK/BBF/Repos/bbf-docs/docs-pre-hub/sb-web/04-strategic/web-public/BBF_WebPublicaTopologiaCanon_v0_3.md
```

Si no aparece: para y reporta.

### 2. Identificar fields del Canon

Lee §4.1.1 o §4.1.2 para la collection objetivo. Anota:
- Fields críticos exactos del Canon.
- Cuáles son `localized: true` (regla de pulgar: contenido visible al usuario → localized).
- Hooks que debe tener (§4.3).
- Access control declarativo.

### 3. Crear archivo

`collections/<NombreCollection>.ts`. Template base:

```ts
import type { CollectionConfig } from 'payload';

export const <NombreCollection>: CollectionConfig = {
  slug: '<slug-kebab>',
  labels: {
    singular: { es: '...', en: '...' },
    plural: { es: '...', en: '...' },
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'updatedAt'],
  },
  fields: [
    // Campos del Canon, con localized:true donde aplique.
  ],
  hooks: {
    beforeChange: [
      // Validación, slug auto, reading time, etc.
    ],
    afterChange: [
      // Audit log, revalidate ISR, OG generation.
    ],
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
  },
};
```

### 4. Registrar en `payload.config.ts`

Agregar al array `collections`. **Orden importa por inspector visual** del admin — agrúpalas: core primero, operación después.

### 5. Generar types

```bash
pnpm payload generate:types
```

Verifica que `payload-types.ts` ahora incluye el type para la nueva collection.

### 6. Migración

```bash
pnpm payload migrate:create create-<slug-kebab>
```

Revisa el SQL generado. Si toca tablas existentes con datos: **para** y pide confirmación a Zavala.

```bash
pnpm payload migrate
```

### 7. Verificación final

- `pnpm typecheck` → 0 errors.
- `pnpm dev` → admin renderiza la nueva collection.
- Crear un documento de prueba en el admin. Verificar que campos localized muestran toggle ES/EN.

### 8. Reportar

A Zavala vía respuesta directa:
- Qué collection se creó.
- Qué hooks se cablearon.
- Qué fields quedaron localized.
- Qué migración se aplicó.
- Sugerir entrada para `BBF_PayloadAudits/BBF_PayloadAudit_$(date +%Y-%m-%d).md` (no la escribes, la propones).

## Reglas dentro de esta skill

- **No inventes fields** que no están en el Canon. Si el Canon dice "title, slug, summary, content, authors[], categories[], tags[], publishedAt": esos son. No agregues `subtitle` por estética.
- **Si el Canon es ambiguo**: para y pregunta. No interpretes.
- **No cambies access control** a algo más laxo que `read: () => true` solo si la collection es genuinamente pública (Posts, Cases, Pages). Para Subscribers, Submissions, Audits: `read` debe requerir auth.
