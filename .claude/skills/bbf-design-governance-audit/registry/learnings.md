# Learnings — session-level memory (self-improving)

> Notes the previous run left for the next run. Session-level only — durable
> system rules go to the repo canon docs, NOT here. Each bullet: date · note ·
> confidence (high/med/low) · what to do next time. Consolidate when long.

## Active learnings

- 2026-06-15 [SUPERSEDED 2026-06-15] · HOVER IDENTITY audit flag. Original note suggested
  blue+underline vs red+translate were different intents requiring a variant axis. Zavala
  signed the opposite: unify to ONE system (blue+underline everywhere), weight also unified
  to medium. The red+translate in the footer was an implementation drift, not a system
  intention. Lesson revised: when a second link treatment appears, audit whether it's a
  SIGNED design decision or drift — don't treat it as a system without Zavala signing it.
  · high · Before proposing a new variant, confirm the difference is intentional (signed).

- 2026-06-15 · Framer Motion's `ease` prop requires a JS value, NOT a CSS var. The pattern
  is: extract to `lib/motion/constants.ts` as `const BBF_EASE_OUT_QUART = [0.25, 1, 0.5, 1]`
  with a comment linking it to `--bbf-motion-ease-out-quart`. This is NOT a token bypass —
  it's a context constraint (CSS vars are not readable in JS at compile time). Flag inline
  literals for extraction, not for token violation. · high.

- 2026-06-15 [CORRECTED 2026-06-15] · RADIUS px mapping. Original note said "rounded-2xl
  = large floating surface = card radius." This was wrong in two ways: (1) `rounded-2xl`
  in TW v4 = 16px (NOT 24px — see `node_modules/tailwindcss/theme.css`). (2) 16px is
  `--bbf-radius-xl`, which became `--bbf-radius-floating`, NOT `--bbf-radius-card` (12px).
  There are TWO distinct radius intents: `card` (content, 12px) and `floating` (overlay, 16px).
  · high · Before mapping any `rounded-*`, open `node_modules/tailwindcss/theme.css` first
  to get the real px value, THEN find the BBF token that matches it exactly.

- 2026-06-15 · Radius scale madre (D-RADIUS-SCALE) is now in place. `--bbf-radius-base=8px`
  derives all primitives via `calc()`. Semantic roles: interactive(9999px) · pill(6px) ·
  media(8px) · card(12px) · floating(16px). When auditing any component with rounded-*,
  map to these 5 roles first (none = flag as leak). · high ·
  Use the 5-role menu to map rounded-* → token in audits.

- 2026-06-15 · The system has many correct individual tokens/atoms but lacked a
  GOVERNANCE layer (intents catalog). Drift appears as the same intent hand-written
  in N places (e.g. eyebrow ×3). When auditing, the highest-value find is a
  repeated hand-written pattern = a missing mother-intent. · high · Always check if
  a pattern repeats across files before declaring NEEDS-NEW.

- 2026-06-15 · Only ONE surface (sand) exists and is still being extended. Don't
  flag "missing dark/white surface" as a defect — it's expected. Flag only if a
  piece HARDCODES skin instead of consuming the surface it's on. · high.

- 2026-06-15 · Reality wins: the DB enum for SiteCtaLibrary was correct even though
  the migration file looked stale. Always verify schema with information_schema, not
  the migration file. · high · Verify against DB, not docs.

- 2026-06-15 · Tailwind utility leaks are the analog of hardcode: rounded-md (Badge),
  text-xs/sm/base (Button sizes) bypass BBF tokens. Treat framework utilities that
  resolve to non-BBF values as primitive leaks. · high.

- 2026-06-15 · Framer Motion duration values ARE aligned to BBF tokens: `0.24` = 240ms =
  `--bbf-motion-duration-base`, `0.18` = 180ms = `--bbf-motion-duration-fast`. Not a
  token violation — just not readable as CSS vars in JS context. The fix is extraction to
  JS constants in `lib/motion/constants.ts`, NOT to invent new values. Confirm alignment
  (seconds × 1000 = milliseconds) before flagging as a leak. · high ·
  When auditing Framer Motion values, convert to ms and cross-check against duration.css.

- 2026-06-15 · `duration-200` (200ms Tailwind) is a recurring "phantom" value — it appears
  in 3+ CVA files but maps to NO BBF motion token (fast=180ms, base=240ms). Treat as a
  leak and replace with `--bbf-motion-duration-fast` (closest semantic intent for hover
  micro-interactions). Same for `ease-out` inline — always replace with
  `[transition-timing-function:var(--bbf-motion-ease-out-quart)]`. · high ·
  When you see duration-200, it is always wrong — flag and replace.

- 2026-06-15 · `--bbf-text-on-light` and `--bbf-border-on-light` are valid semantic aliases
  for `--bbf-text-on-sand` and `--bbf-border-on-sand` respectively (verified in
  semantic/colors.css:118,155). Not a violation, just a pre-D-DS-12 alias pattern.
  Lower-priority cleanup (alias vs direct). Don't flag as hardcode. · med ·
  Check semantic/colors.css before flagging unfamiliar token names as violations.

- 2026-06-15 · D-DS-12 (`surface-roles.css`) defines 4 surfaces × 8 roles via
  `[data-surface='...']` cascade. BUT the menu uses two roles not in the cascade:
  `--bbf-surface-hover-subtle-on-sand` (item hover bg) and `--bbf-surface-hover-on-sand`
  (media thumb bg). Before declaring "the menu can migrate to D-DS-12," verify that ALL
  consumed roles have cascade equivalents. The cascade needs extension before migration.
  · high · Always map ALL consumed surface tokens against the cascade before declaring
  migration readiness.

- 2026-06-15 · `data-component` (D-82) is easy to miss in molecules. LanguageSwitcher
  `<nav>` is missing it. Pattern check: scan every new/audited molecule's root element
  for `data-component="bbf-{name}"`. · med · In every molecule audit, Layer E check
  includes: does the root element have data-component?

- 2026-06-15 · Motion cluster split (D-MOTION-SCALE): The 7 durations are two distinct
  clusters. Reveal family (base..slow) is geometric ×1.5 → calc() scale. Interactive
  floor (instant=100, fast=180) is perceptually tuned (R-BBF-09 snappy) + fast is the
  MADRE of --bbf-motion-state-duration. Anchoring the floor is correct (precedent:
  --bbf-radius-full=9999px). BOTH can coexist: reveal=live scale, interactive=anchored.
  · high · When auditing motion, split interactive vs reveal before applying a formula.

- 2026-06-15 · Easing namespace collision (AP-022): --bbf-easing-organic ≠ --bbf-motion-ease-organic
  (same suffix, different cubic-bezier curves). Always use --bbf-motion-ease-* namespace
  (motion/easing.css) in new components — it's more complete and is what MegaMenuPanel uses.
  Flag any usage of --bbf-easing-* as potential namespace drift. · high ·
  Check the namespace prefix (easing- vs motion-ease-) when referencing easing tokens.

- 2026-06-15 · Platform drift is a valid reason to change a duration even beyond 30ms:
  MobileSubMenu panel had 280ms, desktop MegaMenuPanel uses 240ms (BBF_DURATION_BASE_S).
  Migrating mobile → base (240ms) closes inter-platform drift. The <30ms invariant guards
  against arbitrary changes; correcting cross-platform inconsistency is not arbitrary.
  · high · When a phantom duration doesn't land on a grid token, check the intent's
  desktop twin before deciding whether to anchor or derive.

- 2026-06-15 · DEEP MODE finding: a sweep of variants.ts does NOT automatically clean
  the .tsx itself. MobileSubMenu.variants.ts was swept clean in 8d29f25, but
  MobileSubMenu.tsx:72-74 (chevron) and :108 (image) still had `duration-200` and
  `duration-300` phantoms never touched. Rule: after any motion sweep of a .variants.ts,
  ALSO grep the corresponding .tsx for `duration-`, `ease-`, `transition-` to catch
  inline classes in JSX elements. · high · Sweep = variants.ts AND .tsx together, always.

- 2026-06-15 · DEEP MODE finding: a whole-component audit (MobileMenu) can hide
  behind a sibling that was swept (MobileSubMenu). MobileMenu.variants.ts had 4 fresh
  phantoms (200ms, 280ms, 280ms cubic, 150ms) plus `rounded-full` and `shadow-2xl`.
  These were never touched because the sweep scope was MobileSubMenu, not MobileMenu.
  Rule: when auditing a group of related components (nav, menu), read ALL sibling
  variants.ts files — not just the one the despacho names. · high · Scope creep is
  audit-only, not execution-only; reading siblings is always safe and necessary.

- 2026-06-15 · `shadow-2xl` is a Tailwind shadow utility that bypasses the BBF shadow
  system entirely. The BBF shadow scale has `--bbf-shadow-modal` and `--bbf-shadow-floating`
  as semantic aliases for elevated surfaces. A drawer/panel open state should use
  `[box-shadow:var(--bbf-shadow-modal)]` not `shadow-2xl`. · high ·
  In every variants.ts audit, `shadow-*` utilities = token bypass, flag immediately.

- 2026-06-15 · `data-component` (D-82) must exist on the ROOT element of every molecule.
  In MobileMenu the trigger div has it but the panel div (`MobileMenu.tsx:122`) does not.
  Rule: in DEEP MODE, Layer E check includes scanning EVERY root element of multi-root
  molecules for `data-component`. Molecules with more than one "top-level visible container"
  (trigger + panel, toggle + accordion) need data-component on each distinct container. · med

- 2026-06-15 · Intent duplication pattern: `title hover` (text color transition → blue
  on parent hover) appears in both MegaMenuPanel and MobileSubMenu as independently
  hand-written CVA variants. Neither references the other. This is a candidate for a
  shared `navItemTitleVariants` mother. Same for `image hover scale` (scale-105 + base
  duration + ease-out-quart) in both components. Rule: when the same intent appears in
  ≥2 molecule variants.ts files with identical or near-identical class strings, flag as
  duplication candidate for a shared atom or base variant. · high

- 2026-06-15 · `opacity-60` is a recurring magic number used for disabled/inactive
  states (LanguageSwitcher inactive button, pending state). BBF has no `--bbf-opacity-*`
  token system. This is a systemic gap — not a component-level defect. Register as
  "opacity token system absent; use consistent value (60%) until formalized." · med

- 2026-06-15 · Behavioral JS delays (e.g. `setTimeout(..., 150)` for hover-close
  debounce in HeaderDesktopNav) are not visual animation durations. They do not map
  to BBF motion tokens. They can be extracted as named constants (`HOVER_CLOSE_DELAY_MS`)
  for readability but are not token violations. Distinguish: behavioral delays (JS
  interaction logic) vs animation durations (CSS transition). · high

## Consolidated summary (compressed older notes)
(none yet)
