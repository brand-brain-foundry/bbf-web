# bbf-web

Brand Brain Foundry — web pública.

## Stack

- Next.js 15 (App Router)
- Payload 3 (Headless CMS)
- TypeScript 5
- Tailwind CSS 4
- pnpm 10
- Postgres (Neon en producción — Fase F-4)

## Setup local

```bash
pnpm install
pnpm dev
```

Web disponible en `http://localhost:3000`.
Payload admin en `http://localhost:3000/admin` (no operativo hasta F-4 con DB).

## Scripts

- `pnpm dev` — desarrollo local
- `pnpm build` — build de producción
- `pnpm start` — servidor de producción
- `pnpm lint` — ESLint
- `pnpm typecheck` — type check sin emit
- `pnpm format` — Prettier sobre `**/*.{ts,tsx,md,json}`

## Doctrina

Toda construcción técnica respeta `bbf-docs/03-canon/platform/BBF_FoundryCanon_v1_0.md` (identidad BBF) + `bbf-docs/04-strategic/web-public/BBF_WebPublicaTopologiaCanon_v0_3.md` (arquitectura web pública).

Antes de construir features verificar `BBF_WebPublicaRoadmap_v0_1.md` (orden de capas).

## Repos relacionados

- `bbf-docs` — doctrina, research, auditorías (separado intencionalmente)
- `bbf-web` — este repo

## Estado

- ✅ F-3 bootstrap (este commit)
- ⏳ F-4 Neon DB
- ⏳ F-5 servicios externos (Resend, PostHog, Sentry, Mux, etc.)
- ⏳ H1-1..H1-8 Sistema mínimo viable público
- ⏳ H2-1..H2-8 Sistema dinámico
