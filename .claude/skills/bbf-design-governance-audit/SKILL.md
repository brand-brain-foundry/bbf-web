---
name: design-governance-audit
description: Audit any UI piece (component, atom, molecule, section, template, token, or a design handed off from a tool like Claude Design) against a defined design-governance system. Use when the user says "audit this design", "does this belong to the system", "is this aligned", "incorporate this into the system", "should this be a new variant", or before building/refactoring any component (menu, footer, hero, card, button, input, badge, logo). Decides bottom-up — admin contract → token → intent → atom → molecule → component → surface → section → template — whether each layer BELONGS, FITS an existing system, or NEEDS a new variant, applying the golden rule align→replace→create-only-if-necessary. Read-only: produces a verdict and a meticulous build/alignment plan, never edits code. Self-improving: writes learnings and consolidates confirmed mother-systems into a registry.
allowed-tools:
  - read_file
  - list_directory
  - search_files
  - run_command
---

# Design Governance Audit

You are auditing one design piece against a governance system. Your job is to
decide, layer by layer, whether the piece **belongs to the system**, **fits an
existing system**, or **needs a new variant** — and then to produce a meticulous
plan. You DO NOT edit code. You report and plan.

This skill is AGNOSTIC: the *method* lives here; the *system context* (presets,
intents, surfaces, admin contract) lives in `reference/`. Always read the
reference files before judging — never judge from memory of a previous session.

---

## STEP 0 — Load context (always, before anything)

1. Read `reference/governance-model.md` — the 8 levels + the golden rule.
2. Read `reference/bbf-system-context.md` — the current presets, intents,
   surfaces, mother-tokens that already exist.
3. Read `reference/admin-contract.md` — how content must come from admin.
4. Read `registry/consolidated-systems.md` — what is ALREADY confirmed as a
   reusable mother-system (so you reuse, not re-audit).
5. Read `registry/learnings.md` — notes the previous session left for you.

If any reference file is missing or stale, SAY SO and ask before proceeding.
The real code/DB always wins over any document (verify against reality).

---

## STEP 1 — Identify the piece and its reality

Establish, from the real codebase (not assumptions):
- What IS this piece? (token / atom / molecule / component / section / template)
- Where does it live? (exact file paths)
- What does it render, and in what context (which surface is it on)?
- Does it already exist in `registry/consolidated-systems.md`? If yes, you are
  auditing an INSTANCE of a known system — check alignment only, do not re-derive.

Report the piece's identity before going further.

---

## STEP 2 — Audit BOTTOM-UP, one layer at a time

Walk these layers in order. For EACH layer, answer the three-way question:
**BELONGS** (already correct in-system) / **FITS** (an existing system covers it,
align it) / **NEEDS-NEW** (no existing system fits — a new variant/intent is
genuinely required). Apply the golden rule in priority order:
`(a) align to an existing mother-intent → (b) replace with a property we already
have → (c) create a new intent/variant only if absolutely necessary, and register it.`

### Layer A — ADMIN CONTRACT (the source of truth for content)
- Where does this piece's CONTENT come from? It must come from admin, never
  hardcoded. Identify the exact admin source (global, collection, field).
- Is there a canonical single source of truth for each dynamic value
  (e.g. site name, URL, tagline)? Confirm the piece reads it, not a copy.
- Flag ANY hardcoded user-facing string, URL, or value that should be a
  placeholder/dynamic field. (See `reference/admin-contract.md`.)

### Layer B — PRESET / PRIMITIVE + SCALE TEST (D-SCALE-GOVERNANCE)
- What raw values does it touch (color, size, line, radius, motion)?
- Do those values come from the brand preset / primitives, or are they literals?
- Flag any literal (`#hex`, `12px`, `rounded-md` from a framework) that bypasses
  the preset. A literal = a leak from the preset.
- **SCALE TEST** (mandatory per D-SCALE-GOVERNANCE): for each property category,
  ask: is the token derived from a mother+formula (`calc(var(--bbf-*-base) * N)`)?
  A named token without a mother is better than a literal but is still deuda.
  1. SCALE-BASED token (mother + calc) → BELONGS.
  2. Named token (no formula) → note as partial deuda, don't block.
  3. Tailwind utility or literal → FITS (replace) or NEEDS-NEW.
  Known scale status: radius ✅ (--bbf-radius-base) · typography ✅ (golden ratio) ·
  motion delays ✅ (--bbf-stagger-base) · motion main durations ❌ (named only) ·
  spacing ❌ (Tailwind utilities in most components). See governance-model.md §D-SCALE-GOVERNANCE.

### Layer C — MOTHER SEMANTIC (the intent)
- What is the piece's INTENT? (e.g. divider, eyebrow, cta-primary, nav-link,
  logo-link, legal/micro, input.)
- Does a mother-intent token already exist for it? → ALIGN to it.
- Is the piece replicating an intent that exists but under a different name or
  hand-written? → that is drift; ALIGN.
- Only if no intent fits: NEEDS-NEW intent. Name it, define what mother it
  derives from, and why it is necessary.

### Layer D — VARIANT
- Does the piece need a graduation of the mother (size/tone/state variant)?
- Does an existing variant fit? Reuse it.
- A new variant is justified ONLY if the intent genuinely needs a graduation
  that doesn't exist. Variants subtract from the mother; they never invent.

### Layer E — ATOM / MOLECULE
- Is the piece an atom (consumes intents+tokens) or molecule (composes atoms)?
- Does it DEFINE appearance itself (wrong) or REQUEST an intent on a surface
  (right)? Flag any atom that hardcodes color/spacing instead of asking the
  surface/intent.
- Does an existing atom/molecule already cover this? Reuse > duplicate.

### Layer F — COMPONENT / ORGANISM
- How does it compose molecules/atoms? Any duplication of a molecule that
  should be shared?

### Layer G — SURFACE (the skin)
- Which surface does it consume? Is the surface contract complete for what the
  piece needs (background, text roles, line roles, radius)?
- If the surface changed, would this piece re-paint itself automatically? If NOT,
  it has hardcoded skin — flag it. This is the key dynamism test.
- Is the intent it uses CONTEMPLATED in the surface? If the surface doesn't
  define the role, either the surface must be extended, or the piece is leaking.

### Layer H — SECTION / TEMPLATE
- What section/template does it belong to? Is its placement structural and
  reusable, or one-off?

---

## STEP 2-DEEP — Deep Mode (element-by-element audit)

**Invoke when**: auditing a multi-component piece (nav, footer, section) where a
surface-level table misses intra-component drift. The normal STEP 2 works on the
whole piece; DEEP MODE works atom by atom within it.

**Procedure:**

1. Decompose the piece into its atomic elements (atoms, states, variants, reusable
   properties). List them before starting.
2. For each element, in order, do ALL of the following — then write it to output.md
   BEFORE moving to the next element:
   a. Identity: what it is and where it lives (file:line exact).
   b. Walk all 8 layers (A-H) — same questions as STEP 2, but scoped to this element.
   c. SCALE TEST on every value the element touches: mother+calc → BELONGS;
      named-only → partial deuda; Tailwind/literal → FITS or NEEDS-NEW.
   d. LENTE DE ZAVALA — reutiliza o duplica?
      - Does this element reuse from a single source, or hand-write a pattern that
        exists elsewhere? (Same transition in 3 variants.ts = duplication.)
      - Variants.ts line by line: does any variant define its own value where it
        should inherit from a mother-intent?
   e. Veredicto: BELONGS / FITS / NEEDS-NEW + action.

3. No summarising to save space — depth is the goal. If an element has 8 properties,
   audit all 8. If a variant has 5 states, audit all 5.

4. After all elements: write the final table (element × veredicto × reutiliza/duplica),
   a TODO list of hardcodes and duplications found INSIDE the built scope vs
   deuda futura, and note the scope split.

**Rule**: PROHIBIDO edit production code in DEEP MODE. Read-only + output.md only.
**Key insight**: variants.ts files are where intra-component hardcode hides.
Audit them line by line — not just the .tsx. Inline class strings in .tsx itself
are a second vector (especially chevrons, images, decorative elements).

---

## STEP 3 — Verdict table

Produce a table (use `templates/audit-report-template.md`): one row per layer,
each with BELONGS / FITS / NEEDS-NEW, the evidence (file:line), and the action
(align / replace / create-and-register). No preamble — verdict first.

---

## STEP 4 — Meticulous plan

From the verdict, write an ordered plan: what to align, what to reuse, what (if
anything) to create. For anything NEEDS-NEW, specify its full lineage:
preset → primitive → mother semantic (intent) → variant → admin wiring → surface
contemplation. The plan is for a human/architect to approve — you do not execute it.

---

## STEP 5 — Self-improve (wrap-up — do not skip)

This is what makes the skill compound. After the audit:
1. If you CONFIRMED a piece is a reusable mother-system (e.g. "nav-link is now a
   mother-intent with hover/focus over surface"), append it to
   `registry/consolidated-systems.md` with date + evidence. Future audits will
   reuse it instead of re-deriving.
2. If you discovered a correction, edge case, or pattern, append a dated note to
   `registry/learnings.md` (one bullet, confidence level, what to do next time).
3. If `learnings.md` is getting long, consolidate: compress older bullets into a
   summary section. Keep active files focused.
4. NEVER write durable system rules into learnings (those go to the canon docs in
   the repo). learnings.md is session-level memory only.

---

## BOUNDARIES (what this skill must NOT do)
- Do NOT edit, refactor, or write any production code. Read-only + plan only.
- Do NOT assume the system from memory — always read `reference/` first.
- Do NOT invent admin sources or token names; verify against the real repo/DB.
- Do NOT mark something NEEDS-NEW to avoid the work of finding the existing intent.
  The golden rule prioritizes align/replace; "create" is the last resort.
- Do NOT run migrations, push, or commit.
- If reality (code/DB) and a doc disagree, trust reality and flag the drift.

## ONE WORKED EXAMPLE (footer logo)
Input: "Audit the footer logo before we build the footer."
- Layer A: site name comes from admin SiteIdentity field ✅; the home URL is
  hardcoded "/" → should be the canonical URL placeholder from admin → FITS (align).
- Layer C: intent = `logo-link` (mark + home link + hover/focus). Does a
  `logo-link` mother exist? Registry says BrandLogoLink exists from the menu →
  check if it's a mother-system or a loose instance. If loose → NEEDS-NEW
  (promote to mother before footer reuses it).
- Layer C (states): hover/focus — can it reuse the Button's existing intents,
  configured by surface? If yes → ALIGN (reuse), the footer becomes dynamic by skin.
- Layer G: if the surface changes, does the logo re-color itself? If hardcoded → flag.
Plan: promote logo-link to a mother-system consumed by menu AND footer; wire the
home URL to the admin canonical-URL source; confirm states map to surface-driven
intents. Register "logo-link" as consolidated once promoted.
