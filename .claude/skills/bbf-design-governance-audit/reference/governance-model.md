# Design Governance Model — BBF / Sivar Brains

> The vocabulary of the system, defined precisely. Industry-aligned
> (DTCG + Material 3/Spectrum/SLDS/Polaris for tokens; Atomic Design/Brad Frost
> for UI composition). This is the authority for what each concept MEANS.
> Agnostic — values live in `bbf-system-context.md`.

## D-SBWEB-TOKENS — 2 ejes ortogonales (supersede el marco de "8 niveles")

Una versión anterior de este documento presentaba una sola escalera de 8
niveles (root → surface) que mezclaba dos taxonomías ortogonales de la
industria: **derivación de tokens** (DTCG) y **composición de UI** (Atomic
Design). Esa mezcla fue causa raíz de `HAL-SBWEB-TAXONOMY-DOC-DRIFT-01` — 3
`CLAUDE.md` describiendo el sistema de formas incompatibles. `D-SBWEB-TOKENS`
(firmada, `shared/DECISIONES.md`) separa el marco en 2 ejes independientes,
cada uno con su propio documento canónico y referente:

| Eje | Pregunta que responde | Documento canónico | Referente |
|---|---|---|---|
| **A — Derivación de tokens** | ¿de dónde sale este VALOR? | `src/styles/CLAUDE.md` | DTCG 2025.10 + Material 3/Spectrum/SLDS/Polaris |
| **B — Composición de UI** | ¿qué COMBINA a qué? | `src/components/CLAUDE.md` + `src/components/templates/CLAUDE.md` | Atomic Design, Brad Frost |

**"Brand Preset" se DESCARTA como peldaño de cualquiera de los dos ejes** — no
tiene precedente en ningún referente citado. Es DATO de marca (gobernado por el
global `BrandSystem` + los primitivos que selecciona), resuelto en
`D-SBWEB-BRAND` (frente aparte, firmada 2026-08-09).

Este documento (`governance-model.md`) queda como el **mapa de ambos ejes +
las reglas transversales** que el skill `bbf-design-governance-audit` necesita
para auditar bottom-up (golden rule, scale test, common confusions). Para el
detalle de cada eje, lee el documento canónico correspondiente — no dupliques
inventarios de archivos aquí (una sola fuente de verdad por dato).

## Mapa de los 2 ejes (equivalencia con las capas del audit bottom-up)

El skill audita 8 capas (A-H) en su STEP 2 — esas capas caen en uno u otro eje:

| Capa del audit (STEP 2) | Eje |
|---|---|
| A — Admin contract | ninguno (fuente de contenido, no de diseño) |
| B — Preset/Primitivo + Scale test | **A** (derivación de tokens) |
| C — Mother semantic (intent) | **A** |
| D — Variant | **A** |
| E — Atom/Molecule | **B** (composición de UI) |
| F — Component/Organism | **B** |
| G — Surface | **A** (la superficie es un ROL semántico — `[data-surface]`) que **B** consume |
| H — Section/Template | **B** |

## Eje A — resumen (detalle completo en `src/styles/CLAUDE.md`)

```
Primitivo (valor bruto) → Semántico/mother (intención) → Variante (graduación) → Componente (específico)
```

- **Primitivo** = raw value, sin contexto. `sand-400 = oklch(...)`. No se
  consume directo en componentes.
- **Mother semantic (el intent)** = la raíz semántica de una intención que
  referencia un primitivo. Sostiene PROPÓSITO, no valor. Ej: `--bbf-line-color-divider`.
  Cambiar la mother → cambian las variantes.
- **Variante** = derivación/graduación de la mother (tamaño/tono/estado). Existe
  SOLO si una intención necesita graduación. Las variantes restan de la mother,
  nunca inventan.
- **Surface** = el rol semántico que un bloque de UI (Eje B) consume: color/línea/
  radio/texto según el contexto (`auto`/`dark`/`sand`/`glass`/`transparent`).
  Vive en el Eje A (es un token semántico más) pero solo tiene sentido cuando
  algo del Eje B lo consume.

## Eje B — resumen (detalle completo en `src/components/CLAUDE.md`)

```
Atom → Molecule → Organism → Section → Template → Page
```

- **Atom/Molecule** — piezas que CONSUMEN intents+tokens del Eje A, no definen
  apariencia. Un atom PIDE "intent X sobre surface Y"; nunca decide sus propios
  colores.
- **Organism** — chrome persistente cross-página (Header, Footer).
- **Section** — bloque de contenido de página (Hero, Capabilities, Cierre),
  consumido directo por `page.tsx` con datos reales.
- **Template** — orquesta `blocks[]` dinámicos de Payload (`contentItems`), sin
  Sections dentro — ruta de ensamblaje alternativa a Section, no anidada.
- **Page** — `page.tsx`: Sections a mano O un Template + `ContentItem` real.

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

**Current scale status (re-verified 2026-09-06, D-SBWEB-TOKENS):**
- Radius ✅ scale-based: `--bbf-radius-base` madre + calc() (FASE 4.C.2-B, dd9d9f6)
- Typography ✅ scale-based: golden ratio φ=1.618 madre + BBF tokens (D-BBF-KB-105)
- Motion durations ✅ scale-based: `--bbf-motion-duration-base=240ms` MADRE reveal + calc(×1.5) medium/slow; instant+fast anchored (piso snappy + state-madre invariant) (8d29f25)
- Motion delays ✅ scale-based: `--bbf-stagger-base=75ms` madre + calc(×N) for delays
- Spacing ✅ SEEDED: `--bbf-space-base=4px` madre + calc(×N) 24 steps (8d29f25). Consumers (Tailwind px-*/gap-*) = deuda futura — menu NOT migrated.
- **Line weight ✅ scale-based: `--bbf-line-base=1px` madre + `calc()` → sm/md/lg/xl (D-DS-14, 2026-06-13).**
  Corrección de esta versión: la anterior reportaba "madre TBD" — stale, ya
  derivaba desde antes de esta corrección. Ver `src/styles/CLAUDE.md`.
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

- **Eje A ≠ Eje B.** A token DERIVES a value; a component CONSUMES it. Never
  say a component "has a tier" in the Eje A sense, or that a token "composes"
  anything.
- Organism ≠ Section. Organism = chrome persistente (Header, Footer, viven en
  el layout root). Section = contenido de página (viven en `page.tsx`).
- Section ≠ Template (nested). Son rutas de ensamblaje ALTERNATIVAS, no una
  dentro de otra — ver `src/components/CLAUDE.md` para la evidencia de código.
- Preset ≠ mother-token. Preset (descartado como nivel, ver arriba) = la
  selección curada completa de marca. Mother-token = la raíz semántica de UNA
  intención (Eje A, nivel 2).
- Primitive ≠ semantic. Primitive holds the value; semantic holds the intent and
  references the primitive. Theming works by changing which primitive a semantic
  references — the semantic name stays stable.
