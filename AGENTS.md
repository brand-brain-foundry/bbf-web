# AGENTS.md — bbf-web

> Este archivo lo leen Claude Code, Cursor, Codex CLI, Gemini CLI, GitHub Copilot y cualquier agente que respete el estándar `AGENTS.md`.
> Para Claude Code, este archivo se importa desde `CLAUDE.md` con `@AGENTS.md`.

## CONTEXTO MÍNIMO

Estás trabajando en **`bbf-web`**: la web pública de Brand Brain Foundry (`brandbrainfoundry.com`). Stack: Next.js 15 + Payload 3 + Neon + Vercel + Cloudflare. Multilingüe ES/EN desde día 1.

## REGLAS UNIVERSALES PARA CUALQUIER AGENTE

1. **No tomas decisiones de arquitectura.** Zavala las toma. Tú ejecutas el plan.
2. **Antes de escribir código**, lee el Canon en `/Volumes/PK/BBF/Repos/bbf-docs/04-strategic/web-public/BBF_WebPublicaTopologiaCanon_v0_1.md` y el Roadmap en la misma carpeta.
3. **Toda construcción va de primitivo a específico.** No te saltas niveles. Ver `SB_TaxComponentes.md` en `bbf-docs/00-context/`.
4. **Toda construcción cumple los 35 principios de `SB_Law_Construction.md`.** Sin excepciones.
5. **Contenido vive en Payload, no en componentes.** Cero hardcode (invariante W-2).
6. **Tipado estricto.** TypeScript con `strict: true`. Cero `any` sin justificación documentada.
7. **Multilingüe es first-class.** Toda field de contenido es `localized: true` (Canon §4.1, D-BBF-WEB-05).
8. **SEO+GEO en cada página.** Schema.org JSON-LD, meta tags, hreflang. No es opcional (invariante W-4).
9. **Seguridad por diseño.** Rate limit + validación Zod en toda escritura pública (W-5).
10. **Si algo no está en el Canon, paras y preguntas.** No improvisas arquitectura.

## STACK DECLARADO (no cambiar sin firma de Zavala)

- Framework: **Next.js 15** App Router
- Lenguaje: **TypeScript 5.5+** estricto
- Runtime: **Node.js 20 LTS**
- Package manager: **pnpm 9+**
- CMS: **Payload 3** + `@payloadcms/db-postgres` + `@payloadcms/richtext-lexical`
- DB: **Neon Postgres** (serverless)
- Storage: **Vercel Blob**
- Hosting: **Vercel**
- Edge: **Cloudflare** (DNS+CDN+WAF)
- CSS: **Tailwind 4**
- UI primitives: **shadcn/ui** (copy-paste, no dependencia)
- Animation: **Motion** (ex Framer Motion). GSAP solo para timelines complejos puntuales.
- Email: **Resend** (transaccional + Broadcasts)
- Analytics: **PostHog** (Plausible pendiente decisión)
- Errors: **Sentry**
- Uptime: **Better Stack**
- Rate limit: **Upstash Redis**
- Video: **Mux** (D-BBF-WEB activa desde día 1)

## ESTRUCTURA DE CARPETAS (Canon §2.1)

```
bbf-web/
├── app/
│   ├── (frontend)/         # Rutas públicas
│   │   ├── [locale]/       # ES default sin prefijo, EN con /en
│   │   └── api/            # Route handlers (contact, newsletter, og, revalidate)
│   └── (payload)/          # Admin Payload en /admin
├── collections/            # Payload collections (TS)
├── globals/                # Payload globals
├── blocks/                 # Lexical blocks composables
├── components/             # React components
├── lib/                    # Utilities (seo, i18n, validation, etc.)
├── payload.config.ts
├── middleware.ts           # i18n routing + security
└── next.config.ts
```

## COMANDOS BASE

```bash
pnpm install               # instalar
pnpm dev                   # desarrollo local
pnpm typecheck             # tsc --noEmit
pnpm lint                  # eslint
pnpm build                 # producción
pnpm payload generate:types     # tipos desde collections
pnpm payload migrate            # aplicar migraciones
pnpm payload migrate:create     # crear migración
```

## CÓMO PEDIR AYUDA

Si Zavala dejó `feedback.md` en la raíz del repo: **léelo primero.** Son sus instrucciones puntuales del turno.

Si el Canon no cubre lo que vas a hacer: **paras y preguntas.** No improvises arquitectura.

Si una capa anterior del Roadmap no está cerrada y la actual depende de ella: **paras y avisas.** No avances con bases inestables.

## QUÉ NO HACES

- No `npm install` (es pnpm).
- No tocas `.env*`.
- No haces push a `main` directo. Solo PRs.
- No instalas dependencias fuera del Canon §3 sin firma.
- No modificas archivos en `bbf-docs/` (otro repo, otra disciplina).
- No usas `any` salvo casos justificados y documentados con `// @ts-justify: ...`.
