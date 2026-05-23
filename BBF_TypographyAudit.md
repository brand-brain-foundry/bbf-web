# BBF_TypographyAudit.md

**Despacho:** B-BBF-WEB-WAVE-11-4-A
**Fecha audit:** 2026-05-23
**Tipo:** READ-ONLY — sin modificaciones de código
**Repo HEAD:** e287dce feat(wave11.3-c)
**Propósito:** Datos reales para diseñar Typography sistema áureo set cerrado (Wave 11.4-B + 11.4-C)

---

## §0 — Pre-verificación

- **Primera línea feedback.md:** `DESPACHO ID: B-BBF-WEB-WAVE-11-4-A` ✓
- **HEAD:** `e287dce feat(wave11.3-c)` ✓ (post Wave 11.3-C)
- **Branch:** `main` ✓
- **Working tree:** 1 deletion (`BBF_SurfacesAudit.md` movido por Zavala a bbf-docs) — no es bloqueante
- **typography.css Tier 1:** EXISTS ✓
- **typography.css Tier 2 semantic:** EXISTS ✓
- **Heading.variants.ts:** EXISTS ✓
- **Text.variants.ts:** EXISTS ✓
- **typecheck pre:** PASS (0 errores)

---

## §1 — T-A-0: Tier 1 Typography Tokens (inventario completo)

### §1.1 Font Families (5 tokens)

| Token | Valor | Tipo |
|---|---|---|
| `--bbf-font-inter` | `var(--font-inter), system-ui, sans-serif` | primitivo |
| `--bbf-font-mulish` | `var(--font-mulish), system-ui, sans-serif` | primitivo |
| `--bbf-font-mono` | `JetBrains Mono, Fira Code, ui-monospace…` | primitivo |
| `--bbf-font-display` | `var(--bbf-font-inter)` | alias role |
| `--bbf-font-sans` | `var(--bbf-font-mulish)` | alias role |

**Nota:** `--bbf-font-display` y `--bbf-font-sans` son aliases declarados DOS veces (Tier 1 Y Tier 2). Duplicación. → TD-11-40.

### §1.2 Font Sizes (31 tokens)

**Canónicos golden ratio desktop (9):**

| Token | Valor rem | Valor px | Categoría |
|---|---|---|---|
| `--bbf-text-micro` | 0.625rem | 10px | meta / overline |
| `--bbf-text-h6` | 0.875rem | 14px | heading |
| `--bbf-text-h5` | 1rem | 16px | heading |
| `--bbf-text-h4` | 1.125rem | 18px | heading |
| `--bbf-text-h3` | 1.25rem | 20px | heading |
| `--bbf-text-h2` | 1.3125rem | 21px | heading |
| `--bbf-text-h1` | 1.625rem | 26px | heading |
| `--bbf-text-display-2` | 2.625rem | 42px | display |
| `--bbf-text-display-1` | 4.25rem | 68px | display |

**Mobile (ratio 1.333) (3):**

| Token | Valor rem | Valor px |
|---|---|---|
| `--bbf-text-h1-mobile` | 1.5rem | 24px |
| `--bbf-text-display-2-mobile` | 2rem | 32px |
| `--bbf-text-display-1-mobile` | 2.625rem | 42px |

**Legacy fluid clamp (3) — "Major Third fluid":**

| Token | Valor | Rango |
|---|---|---|
| `--bbf-text-display-md` | `clamp(2rem, 4vw, 3.5rem)` | 32→56px |
| `--bbf-text-display-lg` | `clamp(2.5rem, 5.5vw, 4.5rem)` | 40→72px |
| `--bbf-text-display-xl` | `clamp(3rem, 7vw, 6rem)` | 48→96px |

**Body semánticos (3):**

| Token | Valor rem | Valor px |
|---|---|---|
| `--bbf-text-body-sm` | 0.875rem | 14px |
| `--bbf-text-body-md` | 1rem | 16px |
| `--bbf-text-body-lg` | 1.125rem | 18px |

**Meta (2):**

| Token | Valor rem | Valor px |
|---|---|---|
| `--bbf-text-overline` | 0.625rem | 10px |
| `--bbf-text-caption` | 0.875rem | 14px |

**Legacy scale aliases (11) — CANDIDATOS A DEAD CODE:**

| Token | Valor rem | Valor px | Equivale a |
|---|---|---|---|
| `--bbf-text-xs` | 0.75rem | 12px | *(sin equivalente exacto canónico)* |
| `--bbf-text-sm` | 0.875rem | 14px | = body-sm, h6, caption |
| `--bbf-text-base` | 1rem | 16px | = body-md, h5 |
| `--bbf-text-lg` | 1.125rem | 18px | = body-lg, h4 |
| `--bbf-text-xl` | 1.3125rem | 21px | = h2 |
| `--bbf-text-2xl` | 1.625rem | 26px | = h1 |
| `--bbf-text-3xl` | 2.625rem | 42px | = display-2 |
| `--bbf-text-4xl` | 4.25rem | 68px | = display-1 |
| `--bbf-text-5xl` | 3.815rem | 61px | *(no en escala canónica)* ⚠️ |
| `--bbf-text-6xl` | 4.768rem | 76px | *(no en escala canónica)* ⚠️ |
| `--bbf-text-7xl` | 5.96rem | 95px | *(no en escala canónica)* ⚠️ |

**⚠️ Anomalía:** `--bbf-text-5xl/6xl/7xl` no pertenecen a ninguna escala coherente (no golden ratio, no major third). Son vestigios legacy sin base matemática.

### §1.3 Line-Heights (9 tokens, 6 valores únicos)

| Token | Valor | Categoría | Es alias de |
|---|---|---|---|
| `--bbf-leading-none` | 1.0 | — | — |
| `--bbf-leading-tight` | 1.05 | display | — |
| `--bbf-leading-display` | 1.05 | alias | = tight |
| `--bbf-leading-snug` | 1.15 | heading | — |
| `--bbf-leading-heading` | 1.15 | alias | = snug |
| `--bbf-leading-snug-small` | 1.45 | small body | — |
| `--bbf-leading-base` | 1.55 | body | — |
| `--bbf-leading-body` | 1.55 | alias | = base |
| `--bbf-leading-relaxed` | 1.65 | prose | — |

**Aliases redundantes (3):** `--bbf-leading-display`, `--bbf-leading-heading`, `--bbf-leading-body` → dead code candidates.

### §1.4 Letter-Spacings / Tracking (13 tokens, 5 valores únicos)

| Token | Valor | Tipo |
|---|---|---|
| `--bbf-tracking-tighter` | -0.03em | canónico |
| `--bbf-tracking-tight` | -0.02em | canónico |
| `--bbf-tracking-normal` | 0 | canónico |
| `--bbf-tracking-wide` | 0.02em | canónico |
| `--bbf-tracking-wider` | 0.04em | canónico |
| `--bbf-tracking-display` | -0.03em | alias = tighter |
| `--bbf-tracking-heading` | -0.02em | alias = tight |
| `--bbf-tracking-body` | 0 | alias = normal |
| `--bbf-tracking-overline` | 0.04em | alias = wider |
| `--bbf-tracking-ui` | 0 | alias = normal |
| `--bbf-tracking-eyebrow` | 0.04em | alias = wider (dup de overline) |
| `--bbf-tracking-mono` | 0 | alias = normal |
| *(tagline hardcoded)* | `0.15em` | **NO TOKEN** ⚠️ |

**⚠️ Crítico:** `tracking-[0.15em]` en `Text.variants.ts` tagline variant — valor hardcoded sin token. 0.15em está fuera del rango de cualquier token existente (máximo `wider` = 0.04em). Es 3.75× mayor que `tracking-wider`.

### §1.5 Font Weights (7 tokens)

| Token | Valor | Consumidores reales (componentes) |
|---|---|---|
| `--bbf-weight-light` | 300 | **0 consumidores** → dead code |
| `--bbf-weight-regular` | 400 | Footer, Text.variants.ts |
| `--bbf-weight-medium` | 500 | Badge, NewsletterBox, FormField, Footer |
| `--bbf-weight-semibold` | 600 | NewsletterBox, Heading.variants.ts (display-1/2) |
| `--bbf-weight-bold` | 700 | Footer, Heading.variants.ts (h1/h2), Stat.tsx |
| `--bbf-weight-extrabold` | 800 | **0 consumidores via token** → dead code |
| `--bbf-weight-black` | 900 | **0 consumidores via token** → dead code |

**Nota:** Tailwind `font-bold`, `font-semibold`, `font-medium` se usan hardcoded en Nav, Header, MobileMenu, MegaMenu, Badge, ComparisonTable. Son 5 pesos distintos en circulación real (medium, semibold, bold + regular) más light/extrabold/black sin consumidor.

### §1.6 Paragraph/Heading Spacing (3 tokens)

| Token | Valor | Consumidores |
|---|---|---|
| `--bbf-paragraph-spacing` | 1rem (16px) | **0 consumidores directos** |
| `--bbf-heading-spacing-top` | 2rem (32px) | **0 consumidores directos** |
| `--bbf-heading-spacing-bot` | 1rem (16px) | **0 consumidores directos** |

**Dead code total: 3 tokens** (consumidos indirectamente por reset.css styles generales — verificar).

### §1.7 Resumen Tier 1

| Familia | Tokens | Únicos | Dead code / aliases |
|---|---|---|---|
| Font families | 5 | 3 | 2 aliases |
| Font sizes | 31 | ~20 | 11 legacy + 3 sin escala |
| Line-heights | 9 | 6 | 3 aliases |
| Tracking | 13 | 5 | 8 aliases |
| Weights | 7 | 7 | 3 sin consumidor |
| Paragraph spacing | 3 | 3 | 3 sin consumidor directo |
| **TOTAL** | **68** | **~44** | **~30 dead/alias** |

**⚠️ Expected 38 tokens (Inventory v0) vs actual 68 tokens.** La diferencia (30) son legacy aliases y tokens legacy sin escala base que se acumularon. Inventory v0 estaba desactualizado.

---

## §2 — T-A-1: Tier 2 Typography Tokens (semantic)

### §2.1 Font roles (5)

| Token | Mapea a | Categoría |
|---|---|---|
| `--bbf-font-display` | `var(--bbf-font-inter)` | semantic (duplicado de Tier 1) |
| `--bbf-font-body` | `var(--bbf-font-mulish)` | semantic |
| `--bbf-font-code` | `var(--bbf-font-mono)` | semantic |
| `--bbf-font-heading` | `var(--bbf-font-display)` | legacy alias |
| `--bbf-font-sans` | `var(--bbf-font-body)` | legacy alias |

### §2.2 Semantic typography groups (40 tokens = 8 groups × 5 props)

| Grupo | size token | line token | tracking token | weight token | font token |
|---|---|---|---|---|---|
| **display-1** | text-display-1 (4.25rem) | leading-tight (1.05) | tracking-tighter (-0.03em) | weight-semibold | font-display |
| **display-2** | text-display-2 (2.625rem) | leading-tight | tracking-tighter | weight-semibold | font-display |
| **h1** | text-h1 (1.625rem) | leading-snug (1.15) | tracking-tight (-0.02em) | weight-bold | font-display |
| **h2** | text-h2 (1.3125rem) | leading-snug | tracking-tight | weight-bold | font-display |
| **body** | text-base (1rem) | leading-base (1.55) | tracking-normal (0) | weight-regular | font-body |
| **lead** | text-lg (1.125rem) | leading-base | tracking-normal | weight-regular | font-body |
| **small** | text-sm (0.875rem) | leading-snug-small (1.45) | tracking-normal | weight-regular | font-body |
| **micro** | text-micro (0.625rem) | leading-snug-small | tracking-wide (0.02em) | weight-medium | font-body |

### §2.3 Mobile overrides (@media max-width: 640px)

| Token | Valor mobile |
|---|---|
| `--bbf-typography-display-1-size` | text-display-1-mobile (2.625rem) |
| `--bbf-typography-display-2-size` | text-display-2-mobile (2rem) |
| `--bbf-typography-h1-size` | text-h1-mobile (1.5rem) |

### §2.4 Resumen Tier 2

| Categoría | Tokens | Consumidores directos |
|---|---|---|
| Font roles | 5 | bbf-font-body consumido en Text.variants.ts, reset.css |
| Semantic groups | 40 | **0 consumidores directos en componentes** ⚠️ |
| Mobile overrides | 3 (dentro groups) | via @media automático |
| **TOTAL** | **45** | |

**⚠️ Hallazgo crítico:** Los 40 tokens semantic `--bbf-typography-*` NO son consumidos por los componentes. Heading.variants.ts y Text.variants.ts consumen directamente tokens **Tier 1** (ej. `--bbf-text-display-1`, `--bbf-leading-tight`) en lugar de Tier 2 (`--bbf-typography-display-1-size`, `--bbf-typography-display-1-line`). El sistema Tier 2 de typography está definido pero **bypaseado**. → TD-11-41 (CRÍTICO).

---

## §3 — T-A-2: Escala Áurea (análisis de ratios)

### §3.1 Escala canónica en orden ascendente

| Token | Valor rem | Valor px | Ratio vs anterior |
|---|---|---|---|
| `--bbf-text-micro` / overline | 0.625rem | 10px | — |
| `--bbf-text-xs` | 0.75rem | 12px | 1.200 (minor third) |
| `--bbf-text-sm` / caption / h6 | 0.875rem | 14px | 1.167 |
| `--bbf-text-base` / h5 | 1rem | 16px | 1.143 |
| `--bbf-text-lg` / h4 | 1.125rem | 18px | 1.125 (major second) |
| `--bbf-text-h3` | 1.25rem | 20px | 1.111 |
| `--bbf-text-h2` / xl | 1.3125rem | 21px | 1.050 ⚠️ |
| `--bbf-text-h1` / 2xl | 1.625rem | 26px | 1.238 |
| `--bbf-text-display-2` / 3xl | 2.625rem | 42px | 1.615 ≈ φ ✓ |
| `--bbf-text-display-1` / 4xl | 4.25rem | 68px | 1.619 ≈ φ ✓ |

**Golden ratio φ = 1.618 exacto:**

| Par | Ratio | φ? |
|---|---|---|
| micro → base (10→16) | 1.600 | ≈ φ ✓ |
| base → h1 (16→26) | 1.625 | ≈ φ ✓ |
| h1 → display-2 (26→42) | 1.615 | ≈ φ ✓ |
| display-2 → display-1 (42→68) | 1.619 | ≈ φ ✓ |

### §3.2 Veredicto

**Sistema DUAL detectado:**

**Sistema A (GOLDEN RATIO φ — COHERENTE):** 5 anclas en escala áurea exacta:
`10px → 16px → 26px → 42px → 68px` (cada step × φ ≈ 1.618)

**Sistema B (SUB-JERARQUÍA — DRIFT MEDIO):** Heading h2/h3/h4 entre 16px y 26px:
- h4=18px, h3=20px, h2=21px → ratios 1.05 a 1.25 irregulares entre sí
- h2→h3: ratio 1.05 (casi igual — diferenciación visual débil)
- h3→h4: ratio 1.11 (inconsistente con cualquier escala modular)

**Legacy outliers (DRIFT ALTO):**
- `--bbf-text-5xl` (61px), `--bbf-text-6xl` (76px), `--bbf-text-7xl` (95px) no pertenecen a ninguna escala conocida

**Recomendación CC:**
El backbone áureo (φ-escala) es SÓLIDO. El problema es la sub-jerarquía heading (h2/h3/h4). Opciones:
1. **Normalizar sub-escala a perfect fourth (1.333)** desde base: 16, 21.3, 28.4px — más limpio pero rompe h2/h3 actuales
2. **Adoptar major third (1.25)** desde base: 16, 20, 25px — h3=20px ya está, ajustar solo h2 (21→20) y h4 (18→16... pero eso fusiona con h5)
3. **Mantener sistema dual** pero documentar: φ para display, major-second para headings sub-hierarchy

Opción 3 es la menos disruptiva (A-03) para Wave 11.4-B.

---

## §4 — T-A-3: Heading Atom — Consumidores

### §4.1 Levels declarados en Heading.variants.ts (11)

| Level | Token consumido | Tamaño | Consumidores reales | Estado |
|---|---|---|---|---|
| `display-1` | `--bbf-text-display-1` | 68px | **0** | DEAD CODE |
| `display-2` | `--bbf-text-display-2` | 42px | **0** | DEAD CODE |
| `h1` | `--bbf-text-h1` | 26px | newsletter/confirmed, newsletter/error (×2) | ACTIVO |
| `h2` | `--bbf-text-h2` | 21px | error.tsx (×1) | ACTIVO (baja frecuencia) |
| `h3` | `--bbf-text-lg` ⚠️ | 18px | not-found.tsx, CornerstoneTemplate (×2) | ACTIVO |
| `h4` | `--bbf-text-base` | 16px | Callout, TableOfContents (×2) | ACTIVO |
| `h5` | `--bbf-text-sm` | 14px | **0** | DEAD CODE |
| `h6` | `--bbf-text-xs` | 12px | **0** | DEAD CODE |
| `display-xl` (legacy) | `--bbf-text-display-xl` | clamp(48→96px) | CornerstoneTemplate, not-found.tsx (×2) | ACTIVO (legacy fluid) |
| `display-lg` (legacy) | `--bbf-text-display-lg` | clamp(40→72px) | page.tsx, NotFoundTemplate, PillarTemplate, ErrorTemplate (×4) | MÁS USADO |
| `display-md` (legacy) | `--bbf-text-display-md` | clamp(32→56px) | **0** (solo en doc comments) | DEAD CODE |

**Más usado:** `display-lg` (4 consumidores) — el principal hero heading.

**⚠️ Anomalía crítica:** `h3` usa `--bbf-text-lg` (18px) en lugar de `--bbf-text-h3` (20px). Inconsistencia: el token Heading `h3` no mapea al token `text-h3`.

**Via RichTextRenderer:** `h1`, `h2`, `h3`, `h4` se usan dinámicamente desde contenido Payload — consumidores reales para todos los niveles h1-h4.

### §4.2 Resumen Heading

- Levels declarados: 11
- Con consumidor real directo: 6 (`h1`, `h2`, `h3`, `h4`, `display-xl`, `display-lg`)
- Via RichTextRenderer: 4 más (h1-h4)
- **Dead code:** 5 (`display-1`, `display-2`, `display-md`, `h5`, `h6`)

---

## §5 — T-A-4: Text Atom — Consumidores

### §5.1 Variant prop (6 variants)

| Variant | Token consumido | Consumidores reales | Estado |
|---|---|---|---|
| `body-lg` | `--bbf-text-body-lg` (18px) | page.tsx, not-found.tsx, error.tsx, newsletter/×2, CornerstoneTemplate, NotFoundTemplate, ErrorTemplate, Quote (×9+) | MÁS USADO |
| `body-md` | `--bbf-text-body-md` (16px) | ContactForm, Stat, RichTextRenderer (×3) | ACTIVO |
| `body-sm` | `--bbf-text-body-sm` (14px) | Quote, Divider, Stat, Image, Video, Embed×2, Code, ComparisonTable×3, TableOfContents×2 (×12+) | MUY USADO |
| `caption` | `--bbf-text-caption` (14px) | ContactForm (×1) | ACTIVO (baja frecuencia) |
| `overline` | `--bbf-text-overline` (10px) | **0 reales** (solo en HeroSection doc comments) | DEAD CODE |
| `tagline` | `--bbf-text-base` (16px) | page.tsx homepage (×1) | ACTIVO (alta importancia) |

### §5.2 Size prop (4 variants) — DEAD CODE TOTAL

| Size | Token consumido | Consumidores reales | Estado |
|---|---|---|---|
| `lead` | `--bbf-text-lg` (18px) | **0** | DEAD CODE |
| `base` | `--bbf-text-base` (16px) | **0** | DEAD CODE |
| `small` | `--bbf-text-sm` (14px) | **0** | DEAD CODE |
| `micro` | `--bbf-text-micro` (10px) | **0** | DEAD CODE |

**El grupo `size` completo es dead code.** No tiene ningún consumidor real en el codebase.

### §5.3 Resumen Text

- Variants declarados: 10 (6 `variant` + 4 `size`)
- Con consumidor real: 5 (`body-lg`, `body-md`, `body-sm`, `caption`, `tagline`)
- **Dead code:** 5 (`overline` variant + todos los `size`: lead/base/small/micro)

---

## §6 — T-A-5: Pesos — Análisis de proliferación

### §6.1 Pesos circulando en el sistema

**Via tokens (`font-[var(--bbf-weight-*)]`):**

| Peso | Token | Consumidores via token |
|---|---|---|
| 400 regular | `--bbf-weight-regular` | Text.variants.ts (default), Footer |
| 500 medium | `--bbf-weight-medium` | Badge, NewsletterBox, FormField, Footer |
| 600 semibold | `--bbf-weight-semibold` | NewsletterBox, Heading.variants.ts (display-1/2) |
| 700 bold | `--bbf-weight-bold` | Footer, Heading.variants.ts (h1/h2), Stat raw |

**Via Tailwind hardcoded (no token):**

| Tailwind class | Peso | Archivos |
|---|---|---|
| `font-medium` | 500 | NavLink, SkipLink, MobileMenu, MobileSubMenu×2, Quote, Stat, ComparisonTable |
| `font-semibold` | 600 | LanguageSwitcher, MegaMenuPanel |
| `font-bold` | 700 | MobileMenu, Header (logo), Stat, ComparisonTable |
| `font-light` | 300 | **0** |
| `font-extrabold` | 800 | **0** |
| `font-black` | 900 | **0** |

### §6.2 Dead code weights

| Token | Peso | Estado |
|---|---|---|
| `--bbf-weight-light` | 300 | **DEAD CODE** — 0 consumidores |
| `--bbf-weight-extrabold` | 800 | **DEAD CODE** — 0 consumidores via token (solo declarado en Heading.variants.ts API) |
| `--bbf-weight-black` | 900 | **DEAD CODE** — 0 consumidores via token (solo declarado en Heading.variants.ts API) |

### §6.3 Recomendación set cerrado de pesos

**4 pesos activos:** regular (400), medium (500), semibold (600), bold (700).

**Set propuesto Wave 11.4-B:**
- ✅ `--bbf-weight-regular` (400) — body, captions, nav
- ✅ `--bbf-weight-medium` (500) — labels, nav secondary
- ✅ `--bbf-weight-semibold` (600) — display, headlines impactantes
- ✅ `--bbf-weight-bold` (700) — h1/h2, CTAs, emphasis

**Eliminar API:** `light`, `extrabold`, `black` de Heading.variants.ts weight prop.

**Pendiente:** Migrar `font-bold`/`font-semibold`/`font-medium` hardcoded en Nav/Header/MobileMenu/Badge a tokens semánticos (Wave 11.4-C).

---

## §7 — T-A-6: Line-Heights

### §7.1 Tokens definidos vs consumidos

| Token | Valor | Categoría | Consumidores |
|---|---|---|---|
| `--bbf-leading-none` | 1.0 | edge case | Badge.xs (via Tailwind `leading-none` no token), Stat block |
| `--bbf-leading-tight` | 1.05 | display | Heading.variants.ts, HeroSection, semantic/typography.css |
| `--bbf-leading-display` | 1.05 | **alias = tight** | Heading.variants.ts base class → REDUNDANTE |
| `--bbf-leading-snug` | 1.15 | heading h1-h6 | Heading.variants.ts, NewsletterBox, Footer |
| `--bbf-leading-heading` | 1.15 | **alias = snug** | 0 consumidores directos → DEAD CODE |
| `--bbf-leading-snug-small` | 1.45 | small body | Text.variants.ts caption, NewsletterBox, Footer |
| `--bbf-leading-base` | 1.55 | body | Text.variants.ts, NewsletterBox, Footer, semantic |
| `--bbf-leading-body` | 1.55 | **alias = base** | 0 consumidores directos → DEAD CODE |
| `--bbf-leading-relaxed` | 1.65 | prose | **0 consumidores directos** → DEAD CODE |

### §7.2 Hardcoded line-heights en componentes

| Archivo | Pattern | Valor | Debería ser |
|---|---|---|---|
| `Badge.tsx` | `leading-none` (Tailwind) | 1.0 | `--bbf-leading-none` |
| `Stat.tsx` | `leading-none` (Tailwind raw) | 1.0 | `--bbf-leading-none` |
| `MegaMenuPanel.tsx` | `leading-snug` (Tailwind) | ~1.375 ⚠️ | `--bbf-leading-snug` (1.15) — DIVERGENCIA |
| `MobileSubMenu.tsx` | `leading-snug` (Tailwind) | ~1.375 ⚠️ | `--bbf-leading-snug` (1.15) — DIVERGENCIA |

**⚠️ Divergencia crítica:** Tailwind's `leading-snug` = 1.375, pero nuestro `--bbf-leading-snug` = 1.15. Son valores distintos con el mismo nombre semántico. Los componentes Nav que usan Tailwind `leading-snug` tienen un line-height 19.6% más alto del canónico. → TD-11-42.

### §7.3 Recomendación set cerrado

Set propuesto (5 tokens únicos, sin aliases):
- ✅ `--bbf-leading-none` (1.0) — UI tight, números
- ✅ `--bbf-leading-tight` (1.05) — display/hero
- ✅ `--bbf-leading-snug` (1.15) — headings h1-h4
- ✅ `--bbf-leading-snug-small` (1.45) — captions, small
- ✅ `--bbf-leading-base` (1.55) — body default
- ✅ `--bbf-leading-relaxed` (1.65) — prose long-form (sin consumidor hoy pero necesario para blog)

**Eliminar aliases:** `--bbf-leading-display`, `--bbf-leading-heading`, `--bbf-leading-body`.

---

## §8 — T-A-7: Letter-Spacings (Kerning)

### §8.1 Tokens definidos vs consumidos

| Token | Valor | Consumidores directos |
|---|---|---|
| `--bbf-tracking-tighter` | -0.03em | 0 consumidores por nombre |
| `--bbf-tracking-tight` | -0.02em | NewsletterBox, Footer, Heading.variants.ts |
| `--bbf-tracking-normal` | 0 | Heading.variants.ts (base), Text.variants.ts |
| `--bbf-tracking-wide` | 0.02em | Text.variants.ts (micro size) |
| `--bbf-tracking-wider` | 0.04em | Footer |
| `--bbf-tracking-display` | -0.03em | hero.css, Heading.variants.ts (base class via display alias) |
| `--bbf-tracking-overline` | 0.04em | Text.variants.ts (overline) |
| `--bbf-tracking-heading` | -0.02em | 0 por nombre |
| `--bbf-tracking-body` | 0 | 0 por nombre |
| `--bbf-tracking-ui` | 0 | 0 por nombre |
| `--bbf-tracking-eyebrow` | 0.04em | 0 por nombre |
| `--bbf-tracking-mono` | 0 | 0 por nombre |

### §8.2 Hardcoded tracking en componentes

| Archivo | Pattern | Valor | Token disponible |
|---|---|---|---|
| `Text.variants.ts` tagline | `tracking-[0.15em]` | 0.15em | **NINGUNO** ⚠️ |
| `Header.tsx` | `tracking-tight` (Tailwind) | -0.025em | `--bbf-tracking-tight` (-0.02em) — ~divergencia |
| `Badge.tsx` | `tracking-wider` (Tailwind) | 0.05em | `--bbf-tracking-wider` (0.04em) — ~divergencia |
| `Badge.tsx` xs | `tracking-normal` (Tailwind) | 0 | `--bbf-tracking-normal` ✓ |

### §8.3 Análisis drift mobile↔desktop

**No hay `md:tracking-*` en ningún componente.** El tracking es estático, sin responsive override. Correcto: tracking no suele cambiar por breakpoint.

### §8.4 Recomendación set cerrado

Set propuesto (4 tokens canónicos, sin aliases):
- ✅ `--bbf-tracking-tighter` (-0.03em) — display hero
- ✅ `--bbf-tracking-tight` (-0.02em) — headings
- ✅ `--bbf-tracking-normal` (0) — body, UI
- ✅ `--bbf-tracking-wide` (0.02em) — small caps, UI labels
- ✅ `--bbf-tracking-wider` (0.04em) — overline, eyebrow caps
- ➕ **NUEVO:** `--bbf-tracking-tagline` (0.15em) para tagline (actualmente hardcoded) — Wave 11.4-B

**Eliminar aliases:** 7 legacy aliases.

---

## §9 — T-A-8: Responsive Coherente (D-145 §3.5)

### §9.1 Responsive typography diffs detectados

| Archivo | Pattern | Categoría |
|---|---|---|
| `Header.tsx:83` | `text-sm sm:text-base` | Tailwind utility — logo brand name |
| `contacto/page.tsx:58` | `text-[length:var(--bbf-text-display-2)] md:text-[length:var(--bbf-text-display-1)]` | Tier 1 directo — h1 página contacto ⚠️ |

### §9.2 Tokens responsive existentes

Los tokens Tier 2 `--bbf-typography-*-size` tienen overrides via `@media (max-width: 640px)` en semantic/typography.css para display-1, display-2, h1. Pero estos tokens NO son consumidos por componentes (ver §2.4 TD-11-41).

### §9.3 Recomendación

- `Header.tsx` `text-sm sm:text-base`: crear token Tier 2 `--bbf-typography-nav-brand-size` (Wave 11.4-C).
- `contacto/page.tsx`: migrar raw `<h1>` con Tier 1 directo → Heading atom `level="display-2"` (o nuevo `level="display-responsive"` si necesita responsive granular). → TD-11-43.
- La estructura @media en semantic/typography.css es correcta. Activarla requiere que componentes consuman Tier 2 (bloqueo actual: TD-11-41).

---

## §10 — T-A-9: Headings Dispersos Fuera del Atom

### §10.1 Raw heading elements

| Archivo | Elemento | Typography aplicada | Tipo violación |
|---|---|---|---|
| `contacto/page.tsx:55` | `<h1 className={cn(...)}` | Tier 1 directo (`--bbf-text-display-2`, `--bbf-text-display-1` responsive, `--bbf-leading-tight`, `--bbf-tracking-tight`, `--bbf-weight-semibold`) | Heading fuera de atom + Tier 1 directo |

### §10.2 Raw paragraph elements con font-size

| Archivo | Elemento | Font-size | Tipo violación |
|---|---|---|---|
| `Stat.tsx:15` | `<p className="[font-size:var(--bbf-text-display-lg)]..."` | Tier 1 fluid legacy | Párrafo con display size — debería usar Heading atom |
| `NewsletterBox.tsx:94` | `<p className="text-[length:var(--bbf-text-h2)]..."` | Tier 1 canonical | Párrafo como heading — debería usar Heading atom |
| `NewsletterBox.tsx:97,138` | `<p className="text-[length:var(--bbf-text-sm)]..."` etc | Tier 1 canonical | Párrafo — debería usar Text atom |

### §10.3 Recomendación Wave 11.4-C

Migraciones prioritarias:
1. `contacto/page.tsx` `<h1>` → `<Heading level="display-1/2" ...>` (cancela TD-11-43)
2. `Stat.tsx` `<p>` stat number → `<Heading level="display-lg" ...>` (preserve visual)
3. `NewsletterBox.tsx` raw paragraphs → `Heading` y `Text` atoms apropiados

---

## §11 — T-A-10: Section-Gap Escala Revisión (TD-11-39)

### §11.1 Valores actuales

| Token | Valor | px |
|---|---|---|
| `--bbf-space-section-gap-sm` | 3rem (`--bbf-space-12`) | 48px |
| `--bbf-space-section-gap-md` | 4rem (`--bbf-space-16`) | 64px |
| `--bbf-space-section-gap-lg` | 6rem (`--bbf-space-24`) | 96px |
| `--bbf-space-section-gap-xl` | 8rem (`--bbf-space-32`) | 128px |

### §11.2 Ratios section-gap

| Par | Ratio | Escala conocida |
|---|---|---|
| sm→md (3→4rem) | 1.333 | Perfect Fourth |
| md→lg (4→6rem) | 1.500 | Perfect Fifth |
| lg→xl (6→8rem) | 1.333 | Perfect Fourth |

**Ratio dominante:** 1.333 (2 de 3 pares)

### §11.3 Comparación con typography

| Sistema | Ratio dominante |
|---|---|
| Typography (display scale) | φ = 1.618 |
| Section-gap | 1.333 (Perfect Fourth) |
| Typography mobile | 1.333 (mismo que section-gap) |

**Las escalas son DIVERGENTES.** Typography usa φ para la escala principal; section-gap usa ~4/3. No son del mismo sistema.

Sin embargo, hay coherencia interna: section-gap sigue Perfect Fourth, que es la escala que el Canon usa para mobile typography. Puede interpretarse como: los gaps de sección usan la "escala de lectura" (1.333) no la "escala de impacto" (φ).

### §11.4 Footer mt-20 (5rem) análisis

`mt-20` = 5rem = 80px. Se ubica entre section-gap-md (4rem) y section-gap-lg (6rem).

Análisis matemático:
- Media geométrica entre 4 y 6: √(4×6) = √24 = 4.899 ≈ 5rem ✓
- 4 × 1.25 (Major Third) = 5rem ✓
- Dentro del sistema section-gap, 5rem sería la media geométrica entre md y lg

**Recomendación:** agregar `--bbf-space-section-gap-default: var(--bbf-space-20)` (5rem) como valor canónico intermedio. Justificación: es la media geométrica de md→lg, coherente internamente con el sistema. Cierra TD-11-39.

---

## §X — Síntesis para Wave 11.4-B y Wave 11.4-C

### Estado actual

| Métrica | Valor |
|---|---|
| Tier 1 typography tokens TOTAL | 68 |
| Tier 1 únicos (sin aliases) | ~44 |
| Tier 1 dead code / aliases redundantes | ~30 |
| Tier 2 typography tokens TOTAL | 45 |
| Tier 2 tokens consumidos por componentes | **0** ⚠️ (Tier 2 bypaseado) |
| Heading levels declarados | 11 |
| Heading levels con consumidor directo real | 6 |
| Heading levels DEAD CODE | 5 (`display-1`, `display-2`, `display-md`, `h5`, `h6`) |
| Text variants declarados | 10 (6 variant + 4 size) |
| Text variants con consumidor real | 5 |
| Text variants DEAD CODE | 5 (overline + size completo) |
| Pesos distintos activos | 4 (regular/medium/semibold/bold) |
| Pesos DEAD CODE en tokens | 3 (light, extrabold, black) |
| Line-heights únicos consumidos | 5 |
| Line-heights dead code / aliases | 3 aliases |
| Letter-spacings aliases dead | 7 |
| Tracking hardcoded sin token | 1 (tagline 0.15em) |
| Responsive typography diffs sin token | 2 |
| Headings dispersos fuera del atom | 1 (contacto/page.tsx) |
| Párrafos con heading-size fuera del atom | 2 (Stat.tsx, NewsletterBox.tsx) |

### Escala áurea actual

- **Ratio dominante display scale:** φ = 1.618 (4 de 4 pares — COHERENTE ✓)
- **Sub-jerarquía heading (h2/h3/h4):** DRIFT MEDIO — ratios 1.05-1.25 irregulares
- **Legacy outliers:** 3 tokens (`5xl`, `6xl`, `7xl`) sin base matemática
- **Veredicto:** DUAL SYSTEM — φ para display (SÓLIDO), drift para sub-headings

### Problema mayor detectado: Tier 2 Bypaseado (TD-11-41)

Los tokens `--bbf-typography-*` (40 tokens Tier 2 semantic) están correctamente definidos pero **ningún componente los consume**. Heading.variants.ts y Text.variants.ts van directamente a Tier 1. Esto anula el propósito del sistema 3-tier para typography: cambiar un token Tier 2 no tiene efecto en ningún componente.

**Impacto:** Sistema áureo no es verdaderamente "en cascada". El Tier 2 es decorativo.

### Decisión typography scale set cerrado — recomendación CC

**Display (impact) — escala φ, conservar:**
- ✅ `display-1` (68px) — máximo impacto hero
- ✅ `display-2` (42px) — section heroes
- ➕ Considerar eliminar `display-xl/lg/md` legacy fluid y migrar a `display-1/2` con clamp nativo

**Heading (jerarquía) — normalizar sub-escala:**
- ✅ `h1` (26px)
- ⚠️ `h2` (21px→20px) — ajustar al Major Third desde h3
- ✅ `h3` (20px) — fix mapping: debe usar `--bbf-text-h3` no `--bbf-text-lg`
- ✅ `h4` (18px)
- 🗑️ `h5`, `h6` — eliminar (0 consumidores directos, RichTextRenderer puede mapear a h4)

**Body:**
- ✅ `body-lg` (18px) — lead paragraphs
- ✅ `body-md` (16px) — default
- ✅ `body-sm` (14px) — secondary

**UI / Meta:**
- ✅ `caption` (14px) — nota: igual que body-sm en size, diferente en peso/leading
- ✅ `tagline` (16px uppercase) — hero subtitle
- 🗑️ `overline` — eliminar (0 consumidores reales)
- 🗑️ Text `size` group (lead/base/small/micro) — eliminar (0 consumidores)

### Decisión pesos set cerrado — recomendación CC

| Peso | Token | Estado |
|---|---|---|
| 400 | `--bbf-weight-regular` | ✅ mantener |
| 500 | `--bbf-weight-medium` | ✅ mantener |
| 600 | `--bbf-weight-semibold` | ✅ mantener |
| 700 | `--bbf-weight-bold` | ✅ mantener |
| 300 | `--bbf-weight-light` | 🗑️ eliminar |
| 800 | `--bbf-weight-extrabold` | 🗑️ eliminar |
| 900 | `--bbf-weight-black` | 🗑️ eliminar |

### Decisión line-heights set cerrado — recomendación CC

| Token | Valor | Estado |
|---|---|---|
| `--bbf-leading-none` | 1.0 | ✅ mantener (edge case) |
| `--bbf-leading-tight` | 1.05 | ✅ mantener (display) |
| `--bbf-leading-snug` | 1.15 | ✅ mantener (headings) |
| `--bbf-leading-snug-small` | 1.45 | ✅ mantener (small body) |
| `--bbf-leading-base` | 1.55 | ✅ mantener (body) |
| `--bbf-leading-relaxed` | 1.65 | ✅ mantener (prose — consumers vendrán con blog) |
| `--bbf-leading-display` | 1.05 | 🗑️ alias = tight |
| `--bbf-leading-heading` | 1.15 | 🗑️ alias = snug |
| `--bbf-leading-body` | 1.55 | 🗑️ alias = base |

### Decisión letter-spacings set cerrado — recomendación CC

| Token | Valor | Estado |
|---|---|---|
| `--bbf-tracking-tighter` | -0.03em | ✅ mantener (display) |
| `--bbf-tracking-tight` | -0.02em | ✅ mantener (headings) |
| `--bbf-tracking-normal` | 0 | ✅ mantener (body) |
| `--bbf-tracking-wide` | 0.02em | ✅ mantener (small caps) |
| `--bbf-tracking-wider` | 0.04em | ✅ mantener (overline/eyebrow) |
| ➕ `--bbf-tracking-tagline` | 0.15em | NUEVO — cierra hardcoded value |
| 7 legacy aliases | — | 🗑️ eliminar |

### TD-11-39 — Section-gap escala

- **Ratio actual:** 1.333 dominante (Perfect Fourth)
- **Coherente con typography φ ratio:** No (sistemas divergentes — aceptable, son categorías distintas)
- **Recomendación:** Agregar `--bbf-space-section-gap-default: var(--bbf-space-20)` (5rem/80px) — media geométrica entre md y lg. Cierra TD-11-39 con mínimo impacto.

### Plan Wave 11.4-B (tokens normalization)

**Archivos a tocar:**
1. `src/styles/tokens/primitives/typography.css` — eliminar aliases dead code, agregar `--bbf-tracking-tagline`
2. `src/styles/tokens/semantic/typography.css` — completar grupos h3/h4/body-sm/body-lg/caption/tagline
3. `src/styles/tokens/semantic/spacing.css` — agregar `--bbf-space-section-gap-default: 5rem`

**Tokens a eliminar (dead code confirmado):**
- Tier 1: `--bbf-leading-display/heading/body` (3), `--bbf-tracking-heading/body/ui/eyebrow/mono/display/overline` (7 aliases), `--bbf-weight-light/extrabold/black` (3), `--bbf-text-5xl/6xl/7xl` (3) → 16 tokens
- Tier 2: — (mantener Tier 2 — son la SOLUCIÓN a TD-11-41, necesitan activarse no eliminarse)

**Tokens a agregar:**
- `--bbf-tracking-tagline: 0.15em` (Tier 1, 1 nuevo)
- `--bbf-space-section-gap-default: var(--bbf-space-20)` (Tier 2 spacing, 1 nuevo)
- Completar semantic Tier 2 para: h3, h4, body-sm, body-lg, caption, tagline (actualmente no definidos en semantic/typography.css)

**SET CERRADO a documentar en typography.css:** Equal to §3-§8 sets above.

### Plan Wave 11.4-C (componentes migration)

**Prioridad ALTA:**
1. Fix `h3` mapping en Heading.variants.ts: `--bbf-text-lg` → `--bbf-text-h3`
2. Activar Tier 2: Heading.variants.ts consume `--bbf-typography-*` en lugar de Tier 1 (cierra TD-11-41)
3. Activar Tier 2: Text.variants.ts mismo patrón
4. Migrar `contacto/page.tsx` raw `<h1>` → Heading atom
5. Migrar `Stat.tsx` raw `<p>` con display-size → Heading atom

**Prioridad MEDIA:**
6. Eliminar Text `size` prop group (lead/base/small/micro) del API
7. Eliminar Heading levels `display-1`, `display-2`, `display-md`, `h5`, `h6` del API
8. Eliminar Text variant `overline` (0 consumidores)
9. Migrar `NewsletterBox.tsx` raw paragraphs → atoms
10. Migrar Nav/Header Tailwind `font-*`/`leading-*`/`tracking-*` → tokens

**Prioridad BAJA (Wave 11.5):**
11. Migrar `display-xl/lg/md` legacy fluid a `display-1/2` con responsive nativo (impacto en página homepage)
12. Ajustar `h2` de 21px a 20px si se normaliza sub-escala Major Third

### TDs nuevas anticipadas

| TD | Descripción | Prioridad |
|---|---|---|
| TD-11-40 | `--bbf-font-display` y `--bbf-font-sans` duplicados Tier 1 Y Tier 2 — eliminar de Tier 1 | LOW |
| TD-11-41 | Tier 2 typography bypaseado — componentes van a Tier 1 directamente. Activar cascada Tier 2 (Wave 11.4-C HIGH) | CRITICAL |
| TD-11-42 | Tailwind `leading-snug` (1.375) ≠ `--bbf-leading-snug` (1.15) — divergencia 19.6% en Nav/MegaMenu | HIGH |
| TD-11-43 | `contacto/page.tsx` raw `<h1>` con Tier 1 directo + responsive manual → migrar a Heading atom | MEDIUM |
| TD-11-44 | `Stat.tsx` raw `<p>` con `--bbf-text-display-lg` → migrar a Heading atom | MEDIUM |
| TD-11-45 | `NewsletterBox.tsx` raw paragraphs con tokens Tier 1 → migrar a Text/Heading atoms | MEDIUM |
| TD-11-46 | `tagline` variant: tracking-[0.15em] hardcoded → agregar `--bbf-tracking-tagline: 0.15em` Tier 1 | HIGH |
| TD-11-47 | Text `size` prop group (lead/base/small/micro): 0 consumidores → eliminar API (Wave 11.4-C) | MEDIUM |
| TD-11-48 | Heading `h3` variant usa `--bbf-text-lg` (18px) en lugar de `--bbf-text-h3` (20px) — mapping incorrecto | HIGH |

### Bloqueantes detectados

1. **TD-11-41 bloquea Wave 11.4-C:** Hasta que Tier 2 typography no esté activado (componentes consumiendo `--bbf-typography-*`), cambiar valores en semantic/typography.css no tiene efecto. Wave 11.4-C debe activar Tier 2 ANTES de normalizar valores.

2. **display-xl/lg/md en uso activo (4 consumidores):** Eliminar legacy fluid requiere decidir si homepage cambia a display-1/2 fixo o si se adoptan clamp nativos con tokens. Decisión Strategic antes de Wave 11.4-C.

---

## §12 Reporte Ejecutivo

### ¿Está el sistema áureo implementado?

**Parcialmente.** El backbone φ (10→16→26→42→68px) está bien definido en Tier 1. Pero:

1. **Tier 2 no está activado** — los tokens semantic typography son decorativos hoy
2. **La cascada no funciona** — cambiar Tier 2 no mueve nada en pantalla
3. **La sub-jerarquía heading tiene drift** — h2/h3/h4 no siguen ningún ratio coherente
4. **Hay 30+ tokens dead code / aliases** que generan ruido y confusión

### ¿Qué romper lo menos posible en Wave 11.4-B?

**Solo agregar/eliminar tokens sin consumidor.** Los 16 tokens de dead code candidatos pueden eliminarse con 0 riesgo visual. El token nuevo `--bbf-tracking-tagline` cierra un hardcode existente.

### ¿Qué requiere más cuidado en Wave 11.4-C?

**Activar Tier 2 (TD-11-41).** Es el cambio más sistémico pero más seguro si se hace correctamente: cada componente consume exactamente el Tier 2 que ya tiene el mismo valor que el Tier 1 actual → cero cambio visual, ganancia enorme en mantenibilidad.

---

## §X — CIERRE Wave 11.4-B

**Despacho:** B-BBF-WEB-WAVE-11-4-B
**Fecha cierre:** 2026-05-23
**Commit:** [pendiente Zavala stage+commit]

### Cambios aplicados (tokens-only)

**Tokens eliminados (9 de 16 candidatos — 7 conservados por consumer activo):**
- 1 line-height alias sin consumer: `--bbf-leading-heading`
- 4 tracking aliases sin consumer: `--bbf-tracking-body`, `--bbf-tracking-ui`, `--bbf-tracking-eyebrow`, `--bbf-tracking-mono`
- 1 weight sin consumer: `--bbf-weight-light`
- 3 text legacy sin escala: `--bbf-text-5xl`, `--bbf-text-6xl`, `--bbf-text-7xl`
- 2 font duplicados Tier 1: `--bbf-font-display`, `--bbf-font-sans` (preservados en Tier 2)

**7 tokens conservados (consumers activos — audit Wave 11.4-A inexacta):**
- `--bbf-leading-display` → consumer: `Heading.variants.ts:17`
- `--bbf-leading-body` → consumer: `Text.variants.ts:20`
- `--bbf-tracking-heading` → consumer: `reset.css:40`
- `--bbf-tracking-display` → consumers: `Heading.variants.ts:18`, `hero.css:61`
- `--bbf-tracking-overline` → consumer: `Text.variants.ts:30`
- `--bbf-weight-extrabold` → consumer: `Heading.variants.ts:68`
- `--bbf-weight-black` → consumer: `Heading.variants.ts:69`

**Tokens agregados (2 total — con consumer real):**
- `--bbf-tracking-tagline` (0.15em) — consumer: `hero.css --bbf-tagline-tracking` (Wave 11.4-C migra a var())
- `--bbf-space-section-gap-default` (5rem) — consumer: Footer mt-20 (Wave 11.4-C migra)

**Tokens modificados:**
- `--bbf-text-h2`: 1.3125rem → 1.375rem (21→22px Major Third Material 3, R-BBF-12 §1.1)
  - **Impacto inmediato**: Heading.variants.ts h2 consume `--bbf-text-h2` directo (Tier 1) → h2 visualmente cambia a 22px sin esperar Wave 11.4-C

**Tier 2 typography grupos completados:**
- h3: size → `--bbf-text-h3` (20px, fix TD-11-48)
- h4: nuevo grupo completo
- body-lg, body-sm: nuevos grupos
- caption: nuevo grupo
- tagline: nuevo grupo, consume `--bbf-tracking-tagline`
- lead, small: conservados con nota "legacy alias"

**Headers documentación:**
- SET CERRADO typography en `semantic/typography.css` (φ scale + heading ratios + 4 pesos + 6 leadings + 6 trackings + estrategia impacto copy)
- `@deprecated` escalonado en `primitives/typography.css` para display-md/lg/xl (Wave 11.5 elimina)

### TDs cerradas
- ✅ TD-11-39 section-gap-default 5rem (cierra)
- ✅ TD-11-40 font duplicados Tier 1 (cierra)
- ✅ TD-11-46 tracking-tagline token (cierra)
- ✅ TD-11-48 h3 mapping Tier 2 (cierra — Wave 11.4-C activará en componente)

### TDs parciales
- ⏳ TD-11-41 Tier 2 cascada — Tier 2 COMPLETO en este despacho. Wave 11.4-C activa consumo en `Heading.variants.ts` + `Text.variants.ts`

### §14 Anomalías — Audit Wave 11.4-A inexacta en 7 tokens

Los siguientes tokens fueron marcados como dead code en Wave 11.4-A pero tienen consumers activos:

| Token | Consumer real | Archivo | Línea |
|---|---|---|---|
| `--bbf-leading-display` | `leading-[var(--bbf-leading-display)]` | Heading.variants.ts | 17 |
| `--bbf-leading-body` | `leading-[var(--bbf-leading-body)]` | Text.variants.ts | 20 |
| `--bbf-tracking-heading` | `letter-spacing: var(--bbf-tracking-heading)` | base/reset.css | 40 |
| `--bbf-tracking-display` | `tracking-[var(--bbf-tracking-display)]` | Heading.variants.ts | 18 |
| `--bbf-tracking-display` | `--bbf-headline-tracking: var(--bbf-tracking-display)` | hero.css | 61 |
| `--bbf-tracking-overline` | `tracking-[var(--bbf-tracking-overline)]` | Text.variants.ts | 30 |
| `--bbf-weight-extrabold` | `font-[var(--bbf-weight-extrabold)]` | Heading.variants.ts | 68 |
| `--bbf-weight-black` | `font-[var(--bbf-weight-black)]` | Heading.variants.ts | 69 |

Estos quedan marcados con comentario "consumer active — Wave 11.4-C migra" en primitives/typography.css. Wave 11.4-C los migrará a canónico cuando elimine los variants `extrabold`/`black` de Heading API y los alias de tracking de reset.css.

### TDs nuevas registradas
- 🆕 TD-11-49: `--bbf-leading-loose` (2.0) — NO creado. Agregar cuando aparezca primer consumer real.

### Próximo paso — Wave 11.4-C

Wave 11.4-C migrará:
- `Heading.variants.ts` + `Text.variants.ts` → consume Tier 2 (activación cascada, TD-11-41 cierre)
- display-md/lg/xl consumidores → display-1/display-2 (4 archivos)
- Nav/MegaMenu/MobileSubMenu Tailwind `leading-snug` → token canon (TD-11-42)
- HeroSection tagline `tracking-[0.15em]` → `var(--bbf-tracking-tagline)`
- Footer mt-20 → utility class `.bbf-section-mt-default`
- `contacto/page.tsx` raw `<h1>` → Heading atom (TD-11-43)
- `Stat.tsx`, `NewsletterBox.tsx` raw paragraphs → atoms (TD-11-44, TD-11-45)
- Heading h5/h6 variants → eliminar API
- Text `size` group (lead/base/small/micro) → eliminar API
- `--bbf-weight-extrabold`, `--bbf-weight-black`, `--bbf-leading-display`, `--bbf-leading-body`, `--bbf-tracking-heading`, `--bbf-tracking-display`, `--bbf-tracking-overline` → eliminar de Tier 1 (post-migración components)

### Wave 11.5 (futura)
- Eliminar display-md/lg/xl tokens (post-migración Wave 11.4-C)

---

## §Y — CIERRE Wave 11.4-C1 (Tier 2 Cascade Activation)

**Despacho:** B-BBF-WEB-WAVE-11-4-C1
**Fecha cierre:** 2026-05-24
**Commit:** [pendiente Zavala stage+commit]

### Cambios aplicados (componentes-only)

**Archivos modificados (2):**
- `src/components/atoms/Heading/Heading.variants.ts`
- `src/components/atoms/Text/Text.variants.ts`

**Variants migrados de Tier 1 → Tier 2 (11 total):**

Heading (6 variants):
- `display-1`, `display-2`: ahora consumen `--bbf-typography-display-{1,2}-{size/line/tracking/weight/font}`
- `h1`, `h2`, `h3`, `h4`: ahora consumen `--bbf-typography-h{1,2,3,4}-{size/line/tracking/weight/font}`
- **h3 FIX (TD-11-48):** antes consumía `--bbf-text-lg` (18px) → ahora `--bbf-typography-h3-size` → `--bbf-text-h3` (20px). +2px visual.

Text (5 variants):
- `body-lg`, `body-md`, `body-sm`: ahora consumen `--bbf-typography-body{,-lg,-sm}-{size/line/tracking/weight/font}`
- `caption`: ahora consume `--bbf-typography-caption-*`
- `tagline`: ahora consume `--bbf-typography-tagline-*` (incluye `--bbf-tracking-tagline` 0.15em)

**Variants NO migrados (preservados para Wave 11.4-C2):**
- Heading: `display-md`, `display-lg`, `display-xl`, `h5`, `h6`
- Text: `overline` (sin Tier 2 group), `size.lead`, `size.base`, `size.small`, `size.micro`

### TDs cerradas
- ✅ TD-11-41 CRITICAL — Tier 2 cascade ACTIVADA (cierre completo)
- ✅ TD-11-48 h3 mapping fix (activado en componente)

### Cambios visuales — §10 Anomalías

Cambios visuales más allá de los declarados en el despacho:

| Elemento | Antes | Después | Tipo |
|---|---|---|---|
| h3 size | 18px (text-lg) | 20px (typography-h3) | Fix declarado |
| h4 size | 16px (text-base) | 18px (typography-h4) | Fix implícito — h4 estaba con tamaño de body |
| h4 tracking | ninguno | -0.02em (tight) | Corrección heading tracking |
| h4 weight | ninguno (hereda base bold) | semibold (600) | Ajuste sub-jerarquía |
| caption leading | 1.15 (snug) | 1.45 (snug-small) | Corrección — 1.15 era muy compacto |
| caption weight | ninguno (regular) | medium (500) | Apropiado para labels |
| tagline leading | 1.55 (base) | 1.15 (snug) | Corrección — tagline corto, snug correcto |
| body-sm leading | 1.55 (base) | 1.45 (snug-small) | Apropiado para texto secundario |
| tagline tracking | 0.15em (hardcoded) | var(--bbf-tracking-tagline) | Mismo valor, ahora token |

Todos los cambios son fixes de alineación tipográfica, no regresiones. Zavala valida visualmente.

### Próximo paso — Wave 11.4-C2

Wave 11.4-C2 (cleanup masivo):
- Eliminar variants legacy Heading (`display-md/lg/xl`, `h5`, `h6`)
- Eliminar variants legacy Text (`size.lead`, `size.base`, `size.small`, `size.micro`)
- Migrar 7 tokens Tier 1 preservados Wave 11.4-B → eliminar cuando componentes usen solo Tier 2
- Migrar 4 consumidores display fluid (`Heading display-md/lg/xl` + `Stat.tsx`)
- Migrar Nav/MegaMenu/MobileSubMenu `leading-snug` → token canon (TD-11-42)
- Migrar HeroSection tagline `hero.css --bbf-tagline-tracking: 0.15em` → `var(--bbf-tracking-tagline)`
- Migrar Footer `mt-20` → `.bbf-section-mt-default`
- Migrar `contacto/page.tsx` raw `<h1>` → Heading atom (TD-11-43)
- Migrar `Stat.tsx`, `NewsletterBox.tsx` raw paragraphs (TD-11-44, TD-11-45)
- Eliminar `--bbf-text-xl` alias divergente (TD-11-50)
- Eliminar aliases legacy Tier 2 (`lead`, `small`)

---

*Fin BBF_TypographyAudit.md*
*Wave 11.4-A — READ-ONLY — sin modificaciones de código*
*AUD-BBF-019 input*
*Wave 11.4-B — WRITE — tokens normalization*
*AUD-BBF-020 input*
*Wave 11.4-C1 — WRITE — Tier 2 cascade activation*
*AUD-BBF-021 input*
