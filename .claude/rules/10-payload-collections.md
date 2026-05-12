---
description: Reglas para trabajar con collections, globals, fields y hooks de Payload 3.
globs: ["collections/**", "globals/**", "blocks/**", "payload.config.ts", "lib/payload/**"]
alwaysApply: false
---

# Regla 10 — Payload CMS

> **Fuente Canon:** `BBF_WebPublicaTopologiaCanon_v0_1.md` §3.3, §4.1, §4.3, §8.
> **Plugin oficial Payload:** instala `@payloadcms/claude-plugin` para SKILL.md propia de Payload.

## Colecciones del Canon (no se inventan otras sin firma)

Core: `Users`, `Media`, `Posts`, `Cases`, `Pages`, `Authors`, `Categories`, `Tags`, `Videos`, `Episodes`.
Operación: `Subscribers`, `Submissions`, `Audits`, `Redirects`.
Globals: `Site`, `Navigation`, `SocialLinks`, `SEO`, `BrandSystem`.

**Si necesitas una collection que no está aquí: paras y pides a Zavala que firme la decisión.**

## Campos siempre localized (D-BBF-WEB-05)

Todo campo de **contenido visible para el usuario** lleva `localized: true`:
- `title`, `description`, `summary`, `content`, `excerpt`
- `seoMeta.title`, `seoMeta.description`, `seoMeta.ogImage` (opcional)
- `slug` (decisión H1-2 — ver Canon, default: localized si el SSOT de i18n lo confirma)
- `alt`, `caption`, `credit` en Media

Campos **no localized**: `email`, `url`, `status`, fechas, IDs, tokens, `muxAssetId`, `tenant_id`, etc.

## Hooks obligatorios (Canon §4.3)

- `Posts.beforeChange`: valida SEO meta length (150-160 char description), genera slug si vacío, calcula reading time.
- `Posts.afterChange`: trigger `revalidate` API, genera OG image, log a `Audits`.
- `Cases.afterChange`: revalidate + audit + opcional notify subscribers.
- `Subscribers.afterChange`: dispara double-opt-in via Resend.
- `Submissions.afterChange`: notifica Zavala via Resend.
- `Audits.beforeChange`: rechaza updates. Collection es inmutable, solo inserts.

## Access control declarativo (no en frontend)

```ts
access: {
  read: () => true,        // público
  create: ({ req }) => !!req.user,
  update: ({ req }) => !!req.user,
  delete: ({ req }) => req.user?.role === 'admin',
}
```

Nunca filtres por permiso en el frontend. Si Payload lo devuelve, es porque el usuario puede verlo.

## Audit trail (Canon §8.4)

Cada cambio significativo (create/update/publish/delete en Posts, Cases, Pages, Episodes) **genera registro en `Audits`** desde el hook afterChange. Campos: `timestamp`, `actor_type` (user/ai/system), `actor_id`, `action`, `target_collection`, `target_id`, `changes` (diff), `source` (admin/mcp/api/hook), `reasoning?`.

## Antes de modificar un schema

1. Verifica que el cambio está en el Canon §4.1 o D-BBF-WEB-* firmada.
2. Si no, **para y pide firma a Zavala** vía `feedback.md`.
3. Si sí: edita el schema, ejecuta `pnpm payload generate:types`, crea migración con `pnpm payload migrate:create <nombre>`, aplica con `pnpm payload migrate`.
4. Loggea el cambio en `bbf-docs/04-strategic/web-public/BBF_PayloadAudits/BBF_PayloadAudit_$(date +%Y-%m-%d).md` (esto lo escribe Zavala, no tú — solo prepárale el bloque listo para pegar).

## MCP integration (Canon §8.3)

El plugin `@payloadcms/plugin-mcp` permite que Claude Desktop opere Payload. Permisos por collection:

```ts
mcpPlugin({
  collections: {
    posts: { read: true, write: true, delete: false },
    cases: { read: true, write: true },
    subscribers: { read: true, write: false }, // privacy
  }
})
```

`Subscribers` y `Audits` nunca writable desde MCP. `Audits` ni siquiera readable a través de MCP (privacidad de actores).
