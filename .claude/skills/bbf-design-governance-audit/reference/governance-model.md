# Design Governance Model — BBF / Sivar Brains

> The vocabulary of the system, defined precisely. Industry-aligned
> (PrimeVue base/preset, USWDS "radio presets", 3-tier token consensus).
> This is the authority for what each level MEANS. Agnostic — values live in
> bbf-system-context.md.

## The 8 levels (root → surface)

1. **BRAND PRESET** — the curated root selection. The brand as a closed set of
   decisions: the palette (each color with a clear intent), the type families,
   the base scale, base line weight / radius / motion. Analogy: "the preset
   stations on a car radio — not every option, a specific selection." If the
   preset changes, the whole brand changes. Lives in: BrandSystem global + primitives.

2. **TOKENS** (three sub-tiers):
   - **Primitive** = raw value, no context. `sand-400 = #d9b87c`. An ingredient.
     Not consumed directly by components.
   - **Mother semantic (the intent)** = the semantic root of an intent that
     references a primitive. Holds PURPOSE, not value. e.g. `--line-color-divider`.
     "Mother" = the semantic token from which variants derive. Change the mother →
     variants change.
   - **Variant** = a derivation/graduation of the mother (size/tone/state). Exists
     ONLY if an intent needs a graduation. Variants subtract from the mother; never invent.

3. **INTENT** — not a separate file level; the semantics carried IN the mother
   token. The catalog of purposes: divider, eyebrow, cta-primary, nav-link,
   logo-link, legal/micro, input. When something new appears, ask "what intent is
   this?" → inherit the mother.

4. **ATOM / MOLECULE** — pieces that CONSUME intents+tokens, they don't define
   appearance. Atoms: Button, Badge, Logo, Input. Molecules: NewsletterBox,
   SectionHeader, FormField (atoms combined). An atom REQUESTS "intent X on
   surface Y"; it never decides its own colors.

5. **COMPONENT / ORGANISM** — larger composition with its own structure/logic.
   Header, Footer, MegaMenu. Combine molecules + atoms.

6. **TEMPLATE** — the page skeleton (layout) WITHOUT real content. NOT the
   component. "Header goes here, content here, footer here." Distinct from level 5.

7. **SECTION** — a content block inside a page (Hero, Capabilities, Cierre).
   Consumes a surface.

8. **SURFACE** — the skin. Roles of color / line / radius / text that a block
   adopts. A block USES a surface; it is not a surface. The same surface can be
   used by many blocks. A piece is "dynamic" if changing the surface re-paints it
   automatically.

## D-SCALE-GOVERNANCE — SCALE TEST (mandatory for every Layer B audit)

Every property category (radius, spacing, typography, motion, line weight) must satisfy:
> **UN valor madre + fórmula de escala.**

- **SCALE-BASED** = one mother value + `calc()` derivation. If the mother changes, all steps reajust automatically. Example: `--bbf-radius-base: 0.5rem` + `calc(var(--bbf-radius-base) * 1.5)` = 12px.
- **NAMED TOKEN** = the value is tokenized but arbitrary (no derivation formula). Better than a literal but still deuda under D-SCALE-GOVERNANCE.
- **LITERAL / PHANTOM** = `12px`, `rounded-md`, `duration-200` (Tailwind utility that maps to no BBF token), hardcoded `cubic-bezier(...)`. Immediate flag.

**Scale test for Layer B:**
1. Is the value a scale-based token? → BELONGS.
2. Is it a named token (no formula)? → partial deuda — note, don't block.
3. Is it a Tailwind utility or literal that bypasses the system? → FITS (replace) or NEEDS-NEW if no token exists.
4. Does the token link back to a mother? `var(--bbf-radius-xl)` → `calc(var(--bbf-radius-base) * 2)` → BELONGS. `var(--bbf-some-token): 42px` with no derivation → deuda.

**Current scale status (verify against reality):**
- Radius ✅ scale-based: `--bbf-radius-base` madre + calc() (FASE 4.C.2-B, dd9d9f6)
- Typography ✅ scale-based: golden ratio / perfect-fourth madre + BBF tokens
- Motion durations ✅ scale-based: `--bbf-motion-duration-base=240ms` MADRE reveal + calc(×1.5) medium/slow; instant+fast anchored (piso snappy + state-madre invariant) (8d29f25)
- Motion delays ✅ scale-based: `--bbf-stagger-base=75ms` madre + calc(×N) for delays
- Spacing ✅ SEEDED: `--bbf-space-base=4px` madre + calc(×N) 24 steps (8d29f25). Consumers (Tailwind px-*/gap-*) = deuda futura — menu NOT migrated.
- Line weight ✅ named tokens exist; madre TBD
- Easings ⚠️ named set (correct — not scalar); namespace collision: `--bbf-easing-organic` ≠ `--bbf-motion-ease-organic` (AP-022, deuda)

## THE GOLDEN RULE (priority order, never skip)

For any new piece, ask in this order:
1. **ALIGN** — what intent is this? Does a mother already exist? → inherit it.
2. **REPLACE** — if not exact, is there a property/token we already have that
   should cover it? → use it.
3. **CREATE (last resort)** — only if nothing fits, is a new intent/variant
   *absolutely necessary*? → create it AND register it in the preset/catalog,
   never as a loose exception.

Plus the surface test: *is this intent contemplated in the surface?* If the
surface doesn't define the role, either extend the surface (so all blocks
inherit) or the piece is leaking hardcode.

This is A-01 Simplicity First → A-02 No Patches, applied to the design system.

## Common confusions resolved
- Component ≠ Template. Footer is a component/organism (level 5); the template
  (level 6) is the skeleton that positions it.
- Preset ≠ mother-token. Preset = the whole curated selection (level 1).
  Mother-token = the semantic root of ONE intent (level 2).
- Primitive ≠ semantic. Primitive holds the value; semantic holds the intent and
  references the primitive. Theming works by changing which primitive a semantic
  references — the semantic name stays stable.
