# BBF / Sivar Brains — System Context (current state)

> The CONCRETE current system. This file changes as the system grows. The
> SKILL.md method is agnostic; THIS is what makes it audit BBF specifically.
> ALWAYS verify against the real repo — this doc can drift; code/DB wins.

## Repo
- `/Volumes/PK/BBF/Repos/bbf-web` (Next.js 15, Payload CMS 3, Tailwind v4, Neon)
- DB dev branch = `ep-raspy-hat-alhr143k` (.env.local MUST point here)
- Token tiers live in: `src/styles/tokens/primitives/`, `src/styles/tokens/semantic/`,
  `src/styles/tokens/components/`

## BRAND PRESET (level 1)
- **Palette: 6 mother colors, each a clear intent** (verify exact names/hex in
  primitives/colors.css — do not trust this list blindly):
  sand family, black family, accent-blue (#255ff1), brand-red (#ff5949) +
  accessible red (#c0341d), plus the sand scale 100→600.
- **Type families (2 + mono):** Inter = display, Mulish = body, mono = code.
  Selected via BrandSystem global (D-DS-01 option B: selectors, not raw values).
- **Base scales:** typography (golden ratio desktop / perfect-fourth mobile),
  line weight (`--bbf-line-base` + sm/md/lg/xl), radius (madre `--bbf-radius-base=8px` + ×1.5),
  motion (reveal: madre `--bbf-motion-duration-base=240ms` + ×1.5; interactive: fast+instant anchored),
  spacing (madre `--bbf-space-base=4px` + ×N linear, 24 steps seeded — consumers deuda futura).

## CONFIRMED INTENTS / MOTHER SYSTEMS (level 3, the catalog so far)
> Cross-check with registry/consolidated-systems.md for what's truly "mother".
- **CTA (Button):** 2-axis `fill {solid|outline} × intent {primary|black|secondary|red}`
  + specials ghost / outline-dark. compoundVariants → bbf-btn-{fill}-{intent}.
  primary hover = BLACK (not red). red = visible (gradient-red normal → dark hover).
  outline = dual-pseudo border gradient; text syncs to border color per state.
- **LINE SYSTEM (2-axis):** weight (base/sm/md/lg/xl) × intent:
  divider (sand-400, subtle guide), border (sand-600, WCAG 3:1 for inputs),
  focus (black), accent (blue), light (sand-100, lines over dark). ZERO gray.
- **RADIUS (D-RADIUS-SCALE, FASE 4.C.2-B):** SCALE-BASED. Mother `--bbf-radius-base: 0.5rem` (8px).
  Ratio ≈ 1.5 geometric. All primitives via `calc(var(--bbf-radius-base) * factor)` in primitives/radius.css.
  5 semantic roles (semantic/radius.css):
    interactive = full (9999px) | pill = 2xs (6px) | media = md (8px) | card = lg (12px) | floating = xl (16px)
  ⚠️ `rounded-*` Tailwind utilities ≠ `--bbf-radius-*` tokens. In TW v4 without --radius-* override:
    rounded-lg=8px, rounded-xl=12px, rounded-2xl=16px. Always check node_modules/tailwindcss/theme.css.
  Badge consumes --bbf-radius-pill, NOT Tailwind rounded-md.
  Menu 100% token-clean: Header card + MegaMenu panel → floating; menu items → card; media thumbs → media.
- **TYPOGRAPHY:** 15 semantic roles. display (hero, 1/2, section-h2, step-title,
  card-title), headings h1-h4, body lg/md/sm, caption, tagline. Color is
  DECOUPLED from typography (color comes from surface roles, type roles carry
  family/size/weight/leading/tracking). leading + tracking = 6 semantic tokens each.
  KNOWN GAP: `eyebrow` and `micro` lack a semantic bundle (drift L-TYPO).
- **LOGO:** BrandLogoLink exists (from menu, L1, mask-image hover). STATUS: verify
  if it is a true mother-system (reusable, surface-driven states) or a loose
  instance. The footer needs logo-link as a mother (icon+name+link+states, variants
  = seal / text-only / no-link SUBTRACT from mother).
- **NAV-LINK:** CONSOLIDATED (D-NAV-LINK-UNIFIED, FASE 4.C.2-B). ONE mother: blue+underline.
  Menu renderer = client NavLink (active via usePathname). Footer renderer = server Link
  consuming navLinkBaseVariants({active:false}). red+translate eliminated.

## SURFACES (level 8)
- Only ONE surface built so far and still being extended: `--bbf-surface-sand`
  (background sand-100, on-surface text roles, line roles via the line system).
  Future surfaces (dark, white) will follow the same role contract.
- A piece passes the dynamism test if changing `data-surface` re-paints it.

## ADMIN SOURCES OF TRUTH (level A) — see admin-contract.md
- SiteIdentity (global): siteName, siteTagline, siteDescription, organizationEntity, canonical URLs.
- Newsletter (global/collection): subscription component content.
- Footer link groups: Group Title + Links (label + linkTarget {routeKey|page} + badge text).
- SiteCtaLibrary: CTAs (type {solid|outline} + intent).
- pathnames.ts: routing SSOT (routeKeys). Cleaned of phantoms; /metodo pending
  migration to /como-trabajamos (TAREA-METODO-MIGRATION).

## PROHIBITED PUBLIC VOCAB (filter §6.3) — never in user-facing content
CM-L, Content Factory, factorías, Knowledge Brain, multi-tenant, inquilino,
Equipo BBF, arquitectura cognitiva, Retainer (public), "cerebros operacionales".
§6.5: BBF is never the subject of the site — Sivar Brains is.
