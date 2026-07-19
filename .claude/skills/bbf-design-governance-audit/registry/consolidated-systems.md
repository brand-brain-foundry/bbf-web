# Consolidated Mother-Systems — confirmed reusable

> Append-only registry of pieces CONFIRMED as reusable mother-systems. Once a
> piece is here, future audits REUSE it instead of re-deriving. Each entry:
> date · system name · what it governs · evidence (file) · variants allowed.
> This file is how the skill compounds — it builds the solid base as we go.

## Format
```
### [name] — CONSOLIDATED YYYY-MM-DD
- Governs: <intent / what it is the mother of>
- Lineage: preset → primitive → mother semantic → variants
- Evidence: <file:line or commit>
- Surface-driven: yes/no (re-paints on surface change?)
- Admin-wired: yes/no (content from admin?)
- Variants allowed: <list>
- Notes: <constraints>
```

---

## CONFIRMED SYSTEMS

### CTA / Button — CONSOLIDATED 2026-06-14
- Governs: all call-to-action buttons.
- Lineage: preset palette → gradients → mother `fill × intent` → 8 compoundVariants.
- Evidence: Button.variants.ts, button.css (commit 035f22d, 53ca1a0).
- Surface-driven: yes (fill from DB type, intent maps to surface-aware classes).
- Admin-wired: yes (SiteCtaLibrary: type + intent).
- Variants allowed: fill {solid|outline} × intent {primary|black|secondary|red};
  specials ghost, outline-dark (have live consumers).
- Notes: primary hover = BLACK. red visible (gradient-red → dark). outline text
  syncs to border color per state. WCAG AA all states.

### LINE SYSTEM (2-axis) — CONSOLIDATED 2026-06-15
- Governs: all lines/borders/dividers.
- Lineage: preset → sand/black/blue primitives → mother weight × intent.
- Evidence: line-roles.css (commit: foundation footer).
- Surface-driven: yes (per-surface; divider sand-400 on sand, light sand-100 on dark).
- Admin-wired: n/a (structural).
- Variants allowed: weight {base|sm|md|lg|xl} × intent {divider|border|focus|accent|light}.
- Notes: ZERO gray. border passes WCAG 3:1 for inputs (sand-600). killed #cccccc.

### RADIUS — CONSOLIDATED 2026-06-15
- Governs: corner rounding.
- Lineage: primitives (incl. 2xs=6px) → semantic roles.
- Evidence: radius.css, primitives/radius.css.
- Variants allowed: interactive (buttons/inputs), pill (badges, =6px BBF token), card.
- Notes: Badge consumes --bbf-radius-pill, NOT Tailwind rounded-md.

### LOGO-LINK — CONFIRMED 2026-06-15
- Governs: brand logo presentation (all variants) + logo-as-home-link (nav context).
- Two-layer architecture (CONFIRMED):
  - **BrandLogo (atom):** pure presentation. Variants: icon / horizontal / name-only / stamp.
    Color: `currentColor` (surface-aware). Size: xs/sm/md/lg/xl/hero via `--bbf-logo-rendered`.
    logoVariant ← `BrandSystem.brand.logoVariant` (admin SSOT, D-DS-01↔D-DS-08).
  - **BrandLogoLink (molecule):** logo + home-link + hover gradient. Wraps BrandLogo in <Link>.
    homeHref ← `getPathname({ locale, href: '/' })` (i18n routing SSOT).
    Hover: `text-transparent` → mask-image gradient reveal via `logo.css` `::after`.
- Evidence: `BrandLogo.tsx`, `BrandLogoLink.tsx`, `logo.css` (commit range: Wave 11-Wave 12A).
- Surface-driven: PARTIAL — color uses `--bbf-text-on-sand` (hardcoded to sand).
  Only one surface exists; migrate to `--bbf-on-surface-text` when second surface arrives.
- Admin-wired: yes (logoVariant from BrandSystem; siteName from SiteIdentity; homeHref via routing SSOT).
- Variants allowed: icon | horizontal | name-only | stamp (from BrandLogo atom).
  `no-link` use case = use BrandLogo atom directly (footer pattern, no wrapper needed).
- Notes: Footer correctly uses BrandLogo atom without BrandLogoLink wrapper.
  `dangerouslySetInnerHTML` authorized for SVG-from-filesystem (D-DS-08 Server Component).
  Hover gradient selector keyed to `[data-component='bbf-brand-logo-link']` in logo.css.

---

### NAV-LINK — CONSOLIDATED 2026-06-15 (unified, zero variant)
- Governs: all navigation text-links — menu AND footer.
- Mother: body-sm + medium (500) + on-sand + blue hover + underline-expand.
  SSOT: `navLinkBaseVariants` + `navLinkUnderlineVariants` in `NavLink.variants.ts`.
  Both exported from `@/components/atoms/NavLink` (barrel re-export added 2026-06-15).
- **Menu renderer** — `NavLink.tsx` (client): `usePathname` → `isActive`; renders
  `<button>` (hasSubMenu) or `<Link>`. Passes `active: isActive` to both CVA variants.
  Evidence: `NavLink.tsx`, `NavLink.variants.ts` (Wave 8, D-BBF-KB-112).
- **Footer renderer** — `Footer.tsx:179-197` (server): plain `<Link>`, always
  `active: false`. Imports the same CVA variants directly. Zero `usePathname`, zero
  client JS. Composition: `cn(navLinkBaseVariants({ active: false }), 'gap-2 py-1 min-h-[44px] md:min-h-0')`.
  Underline span: `aria-hidden`, `navLinkUnderlineVariants({ active: false })`.
  Badge flag child sits before the underline span (composition, not a variant).
- Evidence: `NavLink/index.ts`, `NavLink.variants.ts`, `Footer.tsx` (despacho B-BBF-WEB-NAVLINK-LOGOLINK-01).
- Surface-driven: PARTIAL (hardcoded on-sand; single surface today — migrate to
  `--bbf-on-surface-text` when a second surface arrives).
- Admin-wired: yes (labels/hrefs from navigation global via resolveLinkHref → pathnames.ts).
- Variants allowed: ZERO. Weight unified to medium. Hover unified to blue + underline-expand.
  Red+translate-x (former footer hover) is ELIMINATED. If a future nav context genuinely
  needs a different hover, add a `context` variant axis then — not before.
- Notes: Active-state applies only to the menu renderer (client). Footer is always
  `active: false` (no pathname matching needed in footer context).

### LANGUAGE-SWITCHER — CONFIRMED 2026-06-15
- Governs: locale toggle (ES|EN) in the Header.
- Intent: `locale-toggle` — 2 states: active (semibold, full opacity, disabled) vs inactive
  (opacity-60, hover restores opacity). Pending state (transition in progress) = opacity-60.
- Architecture: monolítica client molecule (D-85). `useLocale()` + `useRouter()` + `useTransition()`.
  Labels are ISO infrastructure constants (not admin content). i18n routing via next-intl SSOT.
- Evidence: `LanguageSwitcher.tsx`, `LanguageSwitcher.variants.ts` (Wave 11.6-C).
- Surface-driven: PARTIAL — uses `--bbf-text-on-light` (alias → `--bbf-text-on-sand`),
  `--bbf-border-on-light` (alias → `--bbf-border-on-sand`). Works on sand only. Pre-D-DS-12 aliases.
- Admin-wired: NO (locale list is infrastructure, not content).
- Variants allowed: ZERO. One design, one behavior. It is a terminus atom.
- Notes:
  - NOT a mother-system — no consumers inherit from it.
  - Flags (FITS, not BELONGS): `text-sm` → body-sm; `duration-150` × 2 → motion-duration-fast;
    `font-semibold` → weight-semibold; `ease-out` → ease-out-quart; missing `data-component` (D-82).
  - These are token replacements, not system changes.

---

## PENDING PROMOTION (suspected mother, not yet confirmed)
> These need an audit to decide BELONGS / promote-to-mother / refactor.

### TYPOGRAPHY intents eyebrow / micro — PENDING
- eyebrow: pattern repeated by hand in 3 places (footer groupTitle, SectionHeader,
  MegaMenu). No semantic bundle. Candidate to promote to mother.
- micro: copyright/legal text. Bundle removed in D-DS-04 but footer uses it.
  Candidate to restore as mother `legal/micro`.
