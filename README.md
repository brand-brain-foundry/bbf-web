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

## Arquitectura

- **Atomic Design** adaptado canon BBF (atoms → molecules → sections → templates).
- **Surface-aware components** con context propagation.
- **Token-based** OKLCH colors + semantic abstractions.
- **AI-readable** data attributes + JSDoc.
- **RSC-first** + Client wraps selectivos.
- **Tailwind v4** con arbitrary properties.

Ver `BBF_DESIGN.md` para detalles del sistema de diseño.

## Estado

- ✅ F-3 bootstrap (este commit)
- ⏳ F-4 Neon DB
- ⏳ F-5 servicios externos (Resend, PostHog, Sentry, Mux, etc.)
- ⏳ H1-1..H1-8 Sistema mínimo viable público
- ⏳ H2-1..H2-8 Sistema dinámico
