# AGENTS.md — bbf-web

> This file is read by Claude Code, Cursor, Codex CLI, Gemini CLI, GitHub Copilot, and any agent that follows the `AGENTS.md` standard.

## CONTEXT

This is **`bbf-web`**: the public website of Brand Brain Foundry (`brandbrainfoundry.com`).

## STACK

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5+ strict
- **Runtime**: Node.js 20 LTS
- **Package manager**: pnpm 10+
- **CMS**: Payload 3 + Postgres
- **Styling**: Tailwind v4 with arbitrary properties
- **Internationalization**: next-intl (ES/EN)

## UNIVERSAL RULES

1. **TypeScript strict mode.** No `any` without documented justification.
2. **Content lives in Payload, not in components.** No hardcoded content.
3. **Internationalization is first-class.** All content fields are `localized: true`.
4. **SEO + structured data** on every page (Schema.org JSON-LD, meta tags, hreflang).
5. **Security by design.** Rate limiting + Zod validation on all public writes.
6. **Tokens before utilities.** Use design tokens from `src/styles/tokens/` over arbitrary values.
7. **Atomic Design hierarchy.** Atoms → Molecules → Sections → Templates. Don't skip levels.

## DESIGN SYSTEM

See `BBF_DESIGN.md` for the design system documentation: tokens, components, patterns, accessibility.

Per-component documentation lives in each component folder:
- `src/components/atoms/{Component}/CLAUDE.md`
- `src/components/molecules/{Component}/CLAUDE.md`

## DEVELOPMENT

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm typecheck    # type validation
pnpm lint         # ESLint
```

## CONVENTIONS

- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`).
- **Branch**: feature branches off `main`, PR for review.
- **Tests**: when added, co-located in `__tests__/` folders.

## STRUCTURE
src/
├── app/                   # Next.js App Router pages
│   ├── (frontend)/       # Public-facing routes
│   └── (payload)/        # Payload admin + API
├── components/
│   ├── atoms/            # Primitive components
│   ├── molecules/        # Composite components
│   ├── sections/         # Page sections
│   ├── templates/        # Page templates
│   └── blocks/           # Payload block renderers
├── lib/                   # Utilities, hooks, schemas
├── payload/               # Payload CMS configuration
│   ├── collections/      # Content models
│   ├── globals/          # Site-wide content
│   └── migrations/       # DB schema migrations
└── styles/                # Design tokens and base styles

