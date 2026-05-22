# BBF_SurfacesAudit.md

**Despacho:** B-BBF-WEB-WAVE-11-3-A
**Fecha:** 2026-05-22
**Método:** READ-ONLY (0 archivos código modificados)
**Resuelve:** Pre-requisito para Wave 11.3-B (tokens + authorized pairs) + Wave 11.3-C (migration)
**Aplica:** D-BBF-KB-145 FIRMADA (Opción A)

---

## §0 — Pre-verificación

| Check | Resultado | Notas |
|---|---|---|
| HEAD | `9a0e705` ✅ | feat(wave11.2-bc) — post Wave 11.2-BC |
| git status | ⚠️ 1 archivo | `D BBF_DesignSystemInventory_v0_addendum.md` — eliminado en WD por Zavala, no staged. Solo doc, no código. |
| Branch | `main` ✅ | |
| `containers.css` existe | ✅ | `src/styles/utilities/containers.css` |
| Container.tsx new API | ✅ | `prose\|narrow\|default\|wide\|max\|full` presente |
| SurfaceContext.tsx | ✅ | `src/lib/context/SurfaceContext.tsx` |
| useSurface.ts | ✅ | `src/lib/hooks/useSurface.ts` |

**Decisión §5:** anomalía git status es doc-file eliminado por Zavala (no código). Todas las verificaciones de código pasan. Audit ejecutado.

---

## §1 — T-A-0: Inventario tokens surface

### §1.1 Tokens `--bbf-surface-*` (Tier 2 Semantic)

Archivo fuente: `src/styles/tokens/semantic/colors.css`

| Token | Línea | Valor | Categoría | Consumidores |
|---|---|---|---|---|
| `--bbf-surface-sand` | 27 | `var(--bbf-color-sand-100)` | Core surface | **8** |
| `--bbf-surface-sand-elevated` | 28 | `var(--bbf-color-sand-50)` | Core surface | 1 |
| `--bbf-surface-white` | 29 | `var(--bbf-color-white)` | Core surface | 2 |
| `--bbf-surface-black` | 30 | `var(--bbf-color-black-900)` | Core surface | 3 |
| `--bbf-surface-black-elevated` | 31 | `var(--bbf-color-black-800)` | Core surface elevated | 4 |
| `--bbf-surface-red` | 32 | `var(--bbf-color-red-500)` | Core surface accent | 1 |
| `--bbf-surface-gradient-red` | 33 | `var(--bbf-gradient-red)` | Core surface gradient | **0 — DEAD CODE** |
| `--bbf-surface-hover-on-sand` | 104 | `var(--bbf-color-black-100)` | Interactive state | 6 |
| `--bbf-surface-hover-subtle-on-sand` | 105 | `var(--bbf-color-black-50)` | Interactive state | 4 |
| `--bbf-surface-glass-light` | 120 | `color-mix(in oklch, white, transparent 40%)` | Glass | **0 — DEAD CODE** |
| `--bbf-surface-glass-dark` | 121 | `color-mix(in oklch, black-900, transparent 10%)` | Glass | **0 — DEAD CODE** |
| `--bbf-surface-glass-hover` | 122 | `color-mix(in oklch, black-900, transparent 96%)` | Glass | **0 — DEAD CODE** |
| `--bbf-surface-success-subtle` | 176 | `var(--bbf-color-success-50)` | Status subtle | **0 — DEAD CODE** |
| `--bbf-surface-warning-subtle` | 177 | `var(--bbf-color-warning-50)` | Status subtle | **0 — DEAD CODE** |
| `--bbf-surface-error-subtle` | 178 | `var(--bbf-color-error-50)` | Status subtle | **0 — DEAD CODE** |
| `--bbf-surface-info-subtle` | 179 | `var(--bbf-color-info-50)` | Status subtle | **0 — DEAD CODE** |

**Subtotal `--bbf-surface-*`: 16 tokens | 7 dead code**

### §1.2 Glass tokens adicionales (border + text-on-glass)

Archivo: `src/styles/tokens/semantic/colors.css` (líneas 123-126)

| Token | Línea | Valor | Consumidores |
|---|---|---|---|
| `--bbf-border-glass` | 123 | `color-mix(in oklch, black-900, transparent 92%)` | **0 — DEAD CODE** |
| `--bbf-text-on-glass-light` | 124 | `color-mix(in oklch, black-900, transparent 50%)` | **0 — DEAD CODE** |
| `--bbf-text-on-glass-light-hover` | 125 | `color-mix(in oklch, black-900, transparent 15%)` | **0 — DEAD CODE** |
| `--bbf-text-on-glass-dark` | 126 | `color-mix(in oklch, white, transparent 5%)` | **0 — DEAD CODE** |

**Glass tokens total: 7 (3 surface + 4 border/text). Consumidores: 0.**

### §1.3 Tokens legacy `--bbf-color-bg-*` (deprecated, TD-11-17)

Archivo: `src/styles/tokens/semantic/colors.css` (líneas 150-152)

| Token | Línea | Mapea a | Consumidores |
|---|---|---|---|
| `--bbf-color-bg-base` | 150 | `var(--bbf-surface-sand)` | **2** (reset.css:30, HeroSection.variants.ts:13) |
| `--bbf-color-bg-surface` | 151 | `var(--bbf-surface-white)` | **0 — DEAD CODE** |
| `--bbf-color-bg-inverse` | 152 | `var(--bbf-surface-black)` | **0 — DEAD CODE** |

### §1.4 Resumen inventario

| Categoría | Total | Dead code | Live |
|---|---|---|---|
| Core surface (`--bbf-surface-*`) | 16 | 7 | 9 |
| Glass tokens (border + text-on-glass) | 4 | 4 | 0 |
| Legacy `--bbf-color-bg-*` | 3 | 2 | 1 |
| **Total** | **23** | **13** | **10** |

---

## §2 — T-A-1: Consumidores de surfaces

### Por token — paths completos

**`--bbf-surface-sand`** (8 usos):
| Path | Línea | Contexto |
|---|---|---|
| `src/components/molecules/MobileMenu/MobileMenu.tsx` | 139 | `bg-[var(--bbf-surface-sand)]` — drawer panel |
| `src/components/molecules/MegaMenuPanel/MegaMenuPanel.tsx` | 76 | `bg-[var(--bbf-surface-sand)]` — mega menu panel |
| `src/components/blocks/ComparisonTable.tsx` | 33 | `bg-[var(--bbf-surface-sand)]` — header row |
| `src/components/blocks/ComparisonTable.tsx` | 56 | `bg-[var(--bbf-surface-sand)]` — highlight col |
| `src/components/organisms/Header/Header.tsx` | 70 | `bg-[var(--bbf-surface-sand)]/95` — floating header |
| `src/components/organisms/Footer/Footer.tsx` | 68 | `bg-[var(--bbf-surface-sand)]` — footer bg |
| `src/components/sections/HeroSection/HeroSection.variants.ts` | 15 | CVA variant `sand` |
| `src/app/(frontend)/[locale]/contacto/page.tsx` | 50 | `bg-[var(--bbf-surface-sand)]` — page wrapper |

**`--bbf-surface-sand-elevated`** (1 uso):
| Path | Línea | Contexto |
|---|---|---|
| `src/components/blocks/TableOfContents.tsx` | 28 | `bg-[var(--bbf-surface-sand-elevated)]` — ToC box |

**`--bbf-surface-white`** (2 usos):
| Path | Línea | Contexto |
|---|---|---|
| `src/components/molecules/FormField/FormField.tsx` | 45 | `bg-[var(--bbf-surface-white)]` — input bg |
| `src/components/molecules/NewsletterBox/NewsletterBox.tsx` | 119 | `bg-[var(--bbf-surface-white)]` — input bg |

**`--bbf-surface-black`** (3 usos):
| Path | Línea | Contexto |
|---|---|---|
| `src/components/atoms/Button/Button.variants.ts` | 41 | `bg-[var(--bbf-surface-black)]` — secondary dark btn |
| `src/components/atoms/Button/Button.variants.ts` | 74–75 | `focus-visible:ring-offset-[var(--bbf-surface-black)]` — ring offset dark/black surface |
| `src/components/sections/HeroSection/HeroSection.variants.ts` | 14 | CVA variant `dark` |

**`--bbf-surface-black-elevated`** (4 usos):
| Path | Línea | Contexto |
|---|---|---|
| `src/components/atoms/Button/Button.variants.ts` | 43 | `hover:bg-[var(--bbf-surface-black-elevated)]` |
| `src/components/atoms/Button/Button.variants.ts` | 88 | compound variant dark/dark hover |
| `src/components/atoms/Button/Button.variants.ts` | 93 | compound variant dark/black hover |
| `src/components/atoms/Button/Button.variants.ts` | 99 | compound variant outline dark hover |

**`--bbf-surface-red`** (1 uso):
| Path | Línea | Contexto |
|---|---|---|
| `src/components/atoms/Button/Button.variants.ts` | 76 | `focus-visible:ring-offset-[var(--bbf-surface-red)]` — ring offset red surface |

**`--bbf-surface-gradient-red`**: 0 consumidores — DEAD CODE

**`--bbf-surface-hover-on-sand`** (6 usos):
| Path | Línea | Contexto |
|---|---|---|
| `src/components/molecules/MobileMenu/MobileMenu.tsx` | 106 | nav item hover |
| `src/components/molecules/MobileMenu/MobileMenu.tsx` | 159 | sub-item hover |
| `src/components/molecules/MegaMenuPanel/MegaMenuPanel.tsx` | 113 | image placeholder bg |
| `src/components/molecules/MegaMenuPanel/MegaMenuPanel.tsx` | 124 | video placeholder bg |
| `src/components/molecules/MobileSubMenu/MobileSubMenu.tsx` | 124 | image placeholder bg |
| `src/components/molecules/MobileSubMenu/MobileSubMenu.tsx` | 135 | video placeholder bg |

**`--bbf-surface-hover-subtle-on-sand`** (4 usos):
| Path | Línea | Contexto |
|---|---|---|
| `src/components/molecules/MegaMenuPanel/MegaMenuPanel.tsx` | 108 | card hover bg |
| `src/components/molecules/MegaMenuPanel/MegaMenuPanel.tsx` | 109 | card focus bg |
| `src/components/molecules/MobileSubMenu/MobileSubMenu.tsx` | 119 | item hover bg |
| `src/components/molecules/MobileSubMenu/MobileSubMenu.tsx` | 120 | item focus bg |

**Glass tokens**: 0 consumidores (ver §3)

**Status subtles** (`success/warning/error/info`): 0 consumidores — DEAD CODE

**Legacy `--bbf-color-bg-base`** (2 usos):
| Path | Línea | Contexto |
|---|---|---|
| `src/styles/base/reset.css` | 30 | `background-color: var(--bbf-color-bg-base)` — body default |
| `src/components/sections/HeroSection/HeroSection.variants.ts` | 13 | CVA variant `auto` bg |

**Legacy `--bbf-color-bg-surface`**: 0 consumidores — DEAD CODE

**Legacy `--bbf-color-bg-inverse`**: 0 consumidores — DEAD CODE

**Legacy `--bbf-color-text-primary`** (2 usos):
| Path | Línea | Contexto |
|---|---|---|
| `src/styles/base/reset.css` | 29 | `color: var(--bbf-color-text-primary)` — body default |
| `src/styles/tokens/components/hero.css` | 68 | `--bbf-tagline-color: var(--bbf-color-text-primary)` |

### Tokens con 0 consumidores (dead code):

- `--bbf-surface-gradient-red`
- `--bbf-surface-glass-light`, `--bbf-surface-glass-dark`, `--bbf-surface-glass-hover`
- `--bbf-border-glass`, `--bbf-text-on-glass-light`, `--bbf-text-on-glass-light-hover`, `--bbf-text-on-glass-dark`
- `--bbf-surface-success-subtle`, `--bbf-surface-warning-subtle`, `--bbf-surface-error-subtle`, `--bbf-surface-info-subtle`
- `--bbf-color-bg-surface`, `--bbf-color-bg-inverse`

**13 tokens dead code — 56% del total.**

---

## §3 — T-A-2: Glass tokens (TD-11-18)

**Total glass tokens: 7**
```
--bbf-surface-glass-light    → color-mix(in oklch, white, transparent 40%)
--bbf-surface-glass-dark     → color-mix(in oklch, black-900, transparent 10%)
--bbf-surface-glass-hover    → color-mix(in oklch, black-900, transparent 96%)
--bbf-border-glass           → color-mix(in oklch, black-900, transparent 92%)
--bbf-text-on-glass-light    → color-mix(in oklch, black-900, transparent 50%)
--bbf-text-on-glass-light-hover → color-mix(in oklch, black-900, transparent 15%)
--bbf-text-on-glass-dark     → color-mix(in oklch, white, transparent 5%)
```

**Consumidores reales: 0 en todos los 7 tokens.**

**Hallazgo importante:** El tipo `Surface = 'auto' | 'dark' | 'sand' | 'glass' | 'transparent'` incluye `glass` y Button.variants.ts tiene `glass: 'backdrop-blur-md'` — pero ese variant NO referencia los glass tokens, solo aplica `backdrop-blur-md` de Tailwind directamente.

LocaleSwitcher (mencionado como el consumidor canónico en el comentario de colors.css) no existe como componente en `src/components/molecules/LocaleSwitcher/` — el directorio está vacío o el componente fue eliminado/no implementado aún.

**Recomendación CC:**
- **ELIMINAR los 7 glass tokens** — 0 consumidores activos. La infra de superficie glass existe en el tipo Surface pero no está wired a tokens CSS reales.
- **Conservar `glass` en Surface type** hasta que LocaleSwitcher o componente equivalente se implemente.
- Si en Wave 11.3-C o futura Wave 12 se implementa LocaleSwitcher glass, se definen los tokens entonces (D-145 §3.6 — no agregar antes de que exista el caso).

---

## §4 — T-A-3: Section paddings hardcoded

### Patterns detectados

| Componente | Path | Padding/margin | Responsive | ¿Recurrente? |
|---|---|---|---|---|
| CornerstoneTemplate header | `src/components/templates/CornerstoneTemplate.tsx:17` | `py-16` | `md:py-24` | Parcial (py-16 × 3) |
| CornerstoneTemplate aside | `src/components/templates/CornerstoneTemplate.tsx:47` | `mt-16 py-12` | — | — |
| NotFoundTemplate | `src/components/templates/NotFoundTemplate/NotFoundTemplate.tsx:19` | `py-16` | — | Parcial (py-16 × 3) |
| ErrorTemplate | `src/components/templates/ErrorTemplate/ErrorTemplate.tsx:20` | `py-16` | — | Parcial (py-16 × 3) |
| Footer inner | `src/components/organisms/Footer/Footer.tsx:73` | `py-12` | `lg:py-16` | Parcial |
| Footer top margin | `src/components/organisms/Footer/Footer.tsx:67` | `mt-20` | `lg:mt-32` | — |
| Footer columns | `src/components/organisms/Footer/Footer.tsx:77` | `mb-10` | `lg:mb-12` | — |
| Contacto page wrapper | `src/app/(frontend)/[locale]/contacto/page.tsx:50` | `pt-24 pb-20` | `lg:pt-32 lg:pb-32` | — |

### Patterns recurrentes (candidatos a token):

| Pattern | Ocurrencias | Candidato token |
|---|---|---|
| `py-16` | 3× (Cornerstone header, NotFound, Error) | `--bbf-section-padding-default` |
| `py-12 → lg:py-16` | 1× (Footer) | alinea con `--bbf-space-section-gap-sm/md` |
| `py-16 → md:py-24` | 1× (Cornerstone article header) | `--bbf-section-padding-article` |

### Tokens section-gap existentes (semantic/spacing.css) — TODO DEAD CODE

```css
--bbf-space-section-gap-sm: var(--bbf-space-12); /* 48px */
--bbf-space-section-gap-md: var(--bbf-space-16); /* 64px */
--bbf-space-section-gap-lg: var(--bbf-space-24); /* 96px */
--bbf-space-section-gap-xl: var(--bbf-space-32); /* 128px */
```

**Consumidores: 0 en los 4 tokens.** Los componentes usan clases Tailwind hardcoded en lugar de estos tokens. TD-11-24 ya registrada.

**Hallazgo crítico:** la infraestructura de tokens de section padding YA existe pero ningún componente la consume. Wave 11.3-C debe priorizar migración a estos tokens (o redefinir si los valores no coinciden).

Verificación de alineación:
- `--bbf-space-section-gap-sm` = 48px (`space-12`). Componentes usan `py-12` = 48px ✅ — valor correcto.
- `--bbf-space-section-gap-md` = 64px (`space-16`). Componentes usan `py-16` = 64px ✅ — valor correcto.

Los tokens existen con valores correctos, simplemente no se consumen. Esto confirma TD-11-24 y TD-11-25.

---

## §5 — T-A-4: Authorized color pairs observados

### Pairs completos encontrados

| Background | Text | Border | Hover BG | Componente(s) | Count |
|---|---|---|---|---|---|
| `--bbf-surface-sand` | `--bbf-text-on-sand` | `--bbf-border-on-sand` | `--bbf-surface-hover-on-sand` | Header, Footer, MegaMenu, MobileMenu | **6+** |
| `--bbf-surface-sand` | `--bbf-accent-red` | — | — | ComparisonTable header (highlight cell) | 1 |
| `--bbf-surface-sand-elevated` | (heredado) | `--bbf-border-subtle-on-sand` | — | TableOfContents | 1 |
| `--bbf-surface-black` | `--bbf-text-on-black` | — | `--bbf-surface-black-elevated` | Button (secondary dark) | 2 |
| `--bbf-surface-white` | `--bbf-text-on-sand` | `--bbf-border-on-sand` | — | FormField, NewsletterBox input | 2 |
| `--bbf-surface-gradient-red` (HeroSection auto) | — | — | — | — | 0 (dead code) |

**Pairs recurrentes (≥3 usos) — candidatos canónicos:**

1. **PAIR CANON A: sand** — `bg-sand + text-on-sand + border-on-sand + hover:bg-hover-on-sand`
   - 6+ usos: Header, Footer, MegaMenuPanel, MobileMenu, Cornerstone, contacto
   - Pair autorizado canónico. Surfaces primaria BBF.

2. **PAIR CANON B: black/dark** — `bg-black + text-on-black + hover:bg-black-elevated`
   - 2 usos en Button, 1 en HeroSection
   - Pair autorizado canónico. Secciones inversas + hero dark.

**Pairs one-off o anomalías:**

1. **SkipLink anomalía:** `bg-[var(--bbf-text-on-light)] + text-[var(--bbf-surface-sand)]`
   - Usa token de texto como fondo (inversión semántica).
   - Técnicamente funciona (ambos son blacks/sands) pero es una confusión semántica.
   - TD oportunidad: usar `--bbf-surface-black` + `--bbf-text-on-black`.

2. **Code.tsx anomalía I-4:** `bg-[var(--bbf-color-black-900)] + text-[var(--bbf-color-sand-100)]`
   - Usa tokens **Tier 1 directamente** — viola Invariante I-4.
   - Debería ser `--bbf-surface-black` + `--bbf-text-on-black`.
   - TD necesaria.

3. **ContactForm/NewsletterBox status pair:** `bg-success-bg + text-success-text` (desde feedback.css)
   - Tokens en `semantic/feedback.css` — correctos, tier 2 semántico.
   - No es anomalía — es pair de feedback.

---

## §6 — T-A-5: Responsive coherente check (D-145 §3.5)

### Tipografía responsive

- Tracking/kerning responsive: **0 instancias** (`md:tracking-*`, `lg:tracking-*`) ✅
- Letter-spacing inline: **0 instancias** ✅
- Line-height responsive: **0 instancias** (`md:leading-*`, `lg:leading-*`) ✅
- Font-size arbitrary responsive: **0 instancias** (`lg:text-[`, `md:text-[`) ✅

**Resultado tipográfico: coherente.** No hay diferencias mobile↔desktop hardcoded para texto.

### Layout/spacing responsive (hallazgos)

| Pattern | Path | Mobile | Desktop | Contexto |
|---|---|---|---|---|
| Padding vertical article | `CornerstoneTemplate.tsx:17` | `py-16` | `md:py-24` | Header artículo |
| Padding vertical footer | `Footer.tsx:73` | `py-12` | `lg:py-16` | Footer inner |
| Margin top footer | `Footer.tsx:67` | `mt-20` | `lg:mt-32` | Footer separador |
| Padding contacto | `contacto/page.tsx:50` | `pt-24 pb-20` | `lg:pt-32 lg:pb-32` | Page wrapper |

**Recomendación:** Las diferencias responsive de layout son pocas y razonables. No se recomienda tokens responsive (`--bbf-text-h1-mobile/-desktop`) — la escala tipográfica actual no los necesita. Los paddings responsive de layout sí se beneficiarían de utility classes con responsive built-in en Wave 11.3-C.

---

## §7 — T-A-6: Surfaces soportados por componente

| Componente | Surfaces soportados | Implementación | Coverage |
|---|---|---|---|
| `HeroSection` | `auto`, `dark`, `sand`, `transparent` | CVA variant | Parcial — sin `glass`, sin `max` |
| `Button` | `auto`, `dark`, `black`, `red`, `glass` | CVA variant + compound | Completo para su scope |
| `BBFLogo` | Tiene surface en variants.ts pero NO mapea colores | Hereda `currentColor` | Solo form estructural — sin tokens surface |
| `Icon` | Tiene surface en variants.ts pero NO mapea colores | Hereda `currentColor` | Solo form estructural |
| `Header` | Sand hardcoded (`bg-[var(--bbf-surface-sand)]/95`) | Hardcoded | Sin prop surface |
| `Footer` | Sand hardcoded (`bg-[var(--bbf-surface-sand)]`) | Hardcoded | Sin prop surface |
| `FormField` | White hardcoded (`bg-[var(--bbf-surface-white)]`) | Hardcoded | Sin prop surface — TD-11-04 |
| `NewsletterBox` | White hardcoded (`bg-[var(--bbf-surface-white)]`) | Hardcoded | Sin prop surface |
| `MobileMenu` | Sand hardcoded | Hardcoded | Sin prop surface |
| `MegaMenuPanel` | Sand hardcoded | Hardcoded | Sin prop surface |

### Surface type canon actual (SurfaceContext.tsx:57)

```typescript
export type Surface = 'auto' | 'dark' | 'sand' | 'glass' | 'transparent';
```

**Nota:** `useSurface()` hook existe pero **0 componentes lo llaman** — el hook es infraestructura no utilizada. Los componentes que necesitan surface lo leen directamente de props, no del Context.

### Gap surface — componentes que deberían soportar surface pero no lo hacen:

- `Header`: siempre sand — sin surface prop. Justificado (nav siempre sobre sand). No TD urgente.
- `Footer`: siempre sand — sin surface prop. Justificado (footer siempre sand). No TD urgente.
- `FormField`: siempre white sobre sand — TD-11-04 ya registrada.
- `NewsletterBox`: siempre white — relacionado con TD-11-04.

---

## §X — Síntesis para Wave 11.3-B y Wave 11.3-C

### Estado actual

- **Tokens surface totales:** 23 (16 `--bbf-surface-*` + 4 glass border/text + 3 legacy `--bbf-color-bg-*`)
- **Tokens surface con consumidor real:** 10 (43%)
- **Tokens surface DEAD CODE:** 13 (57%)
  - `--bbf-surface-gradient-red` (1)
  - Todos los glass tokens: `surface-glass-light/dark/hover`, `border-glass`, `text-on-glass-*` (7)
  - Status subtles: `surface-success/warning/error/info-subtle` (4)
  - Legacy: `color-bg-surface`, `color-bg-inverse` (2, sin contar `color-bg-base` que tiene 2 consumidores)
- **Glass tokens:** 7 totales, 0 consumidos → **RECOMENDACIÓN: ELIMINAR**
- **Section padding tokens existentes sin consumidor:** 4 (`section-gap-sm/md/lg/xl`) — infraestructura lista, migration pendiente
- **Authorized pairs observados:**
  - PAIR A: sand + text-on-sand + border-on-sand (6+ usos) — CANÓNICO primario
  - PAIR B: black + text-on-black (3 usos) — CANÓNICO secundario
  - PAIR C: white + text-on-sand (2 usos, forms) — CANÓNICO forms
- **Responsive incoherencias tipográficas:** 0
- **Responsive layout hardcoded:** 4 instancias (todas razonables)

### Decisión surface set cerrado — recomendación CC

Set propuesto (aplicando D-145 §3.1):

| Surface | Consumidores actuales | Uso | Recomendación |
|---|---|---|---|
| `sand` | 8 | Superficie principal BBF | ✅ CONSERVAR |
| `sand-elevated` | 1 | Contenido destacado sobre sand | ✅ CONSERVAR (1 uso activo) |
| `white` | 2 | Inputs/forms sobre sand | ✅ CONSERVAR |
| `black` | 3 | Hero dark, secciones inversas | ✅ CONSERVAR |
| `black-elevated` | 4 | Hover states sobre black | ✅ CONSERVAR |
| `red` | 1 (ring-offset) | Accent — ring offset only | ✅ CONSERVAR (Button focus) |
| `gradient-red` | 0 | — | ❌ ELIMINAR |
| `glass-*` (7 tokens) | 0 | Transitorio no implementado | ❌ ELIMINAR tokens |
| `success/warning/error/info-subtle` | 0 | Status, no implementado en surface | ❌ ELIMINAR (mover a feedback.css si se necesitan) |
| `hover-on-sand` | 6 | Interactive hover sand | ✅ CONSERVAR |
| `hover-subtle-on-sand` | 4 | Interactive hover subtle sand | ✅ CONSERVAR |

**Set cerrado propuesto: 8 tokens surface vivos** (sand, sand-elevated, white, black, black-elevated, red, hover-on-sand, hover-subtle-on-sand)

**Nota sobre legacy:** `--bbf-color-bg-base` (2 consumidores) — migrar en Wave 11.3-C a `--bbf-surface-sand`.

### Decisión section paddings set cerrado — recomendación CC

Los 4 tokens `--bbf-space-section-gap-*` YA existen con valores correctos. No hay que crear nuevos tokens. La migration es de consumo, no de definición:

| Token existente | Valor | Pattern hardcoded equivalente | Components a migrar |
|---|---|---|---|
| `--bbf-space-section-gap-sm` | 48px (space-12) | `py-12` | Footer inner (base) |
| `--bbf-space-section-gap-md` | 64px (space-16) | `py-16` | NotFound, Error, CornerstoneTemplate aside |
| `--bbf-space-section-gap-lg` | 96px (space-24) | `py-24` | CornerstoneTemplate header (desktop) |
| `--bbf-space-section-gap-xl` | 128px (space-32) | `py-32` | (contacto desktop approx) |

### Decisión authorized pairs — recomendación CC

| Surface BG | Text FG | Border | Hover BG | Nombre canónico |
|---|---|---|---|---|
| `--bbf-surface-sand` | `--bbf-text-on-sand` | `--bbf-border-on-sand` | `--bbf-surface-hover-on-sand` | **pair-sand** |
| `--bbf-surface-black` | `--bbf-text-on-black` | `--bbf-border-on-black` | `--bbf-surface-black-elevated` | **pair-black** |
| `--bbf-surface-white` | `--bbf-text-on-sand` | `--bbf-border-on-sand` | — | **pair-white** (forms) |

### Plan Wave 11.3-B (tokens + utilities)

**Archivos a tocar:**
1. `src/styles/tokens/semantic/colors.css` — eliminar 12 dead code tokens:
   - `--bbf-surface-gradient-red` (1)
   - Glass block completo: `surface-glass-*`, `border-glass`, `text-on-glass-*` (7)
   - Status subtles: `surface-success/warning/error/info-subtle` (4)
   - Legacy `color-bg-surface`, `color-bg-inverse` (2) — ya dead code
   - Documentar authorized pairs con header inline comentado
2. `src/styles/tokens/semantic/colors.css` — agregar header "SET CERRADO SURFACES" similar a containers
3. `src/styles/utilities/` — (opcional) utility classes `data-surface` si se decide sistema CSS-based
4. **Estimado: 2 archivos, ~-50 líneas netas**
5. **Tiempo estimado: 15-20 min**

### Plan Wave 11.3-C (componentes migration)

**Archivos a tocar:**
1. `src/components/sections/HeroSection/HeroSection.variants.ts:13` — migrar `auto` de `--bbf-color-bg-base` → `--bbf-surface-sand` (TD-11-17 parcial)
2. `src/styles/base/reset.css:29-30` — migrar `--bbf-color-text-primary` → `--bbf-text-on-sand` y `--bbf-color-bg-base` → `--bbf-surface-sand` (TD-11-17)
3. `src/styles/tokens/components/hero.css:68` — migrar `--bbf-tagline-color` de `--bbf-color-text-primary` → `--bbf-text-on-sand` (TD-11-17)
4. `src/components/atoms/SkipLink/SkipLink.tsx:12` — corregir inversión semántica: `--bbf-text-on-light` → `--bbf-surface-black`, `--bbf-surface-sand` → `--bbf-text-on-black`
5. `src/components/blocks/Code.tsx:33` — migrar Tier 1 directo: `--bbf-color-black-900` → `--bbf-surface-black`, `--bbf-color-sand-100` → `--bbf-text-on-black` (I-4)
6. `src/components/templates/CornerstoneTemplate.tsx`, `NotFoundTemplate`, `ErrorTemplate`, `Footer.tsx` — migrar `py-12/py-16/py-24` → utility classes que consuman `--bbf-space-section-gap-*`
7. `src/components/organisms/Footer/Footer.tsx:73` — migrar `max-w-7xl` → `bbf-container-max` o `Container` component
8. `src/components/organisms/Header/Header.tsx:66` — migrar `max-w-7xl` → `bbf-container-max`
9. **Estimado: 8-9 archivos**
10. **Tiempo estimado: 40-50 min**

### TDs cerradas por Wave 11.3-B/C anticipadas

- TD-11-17: Legacy color tokens (cierre completo post migración reset.css + HeroSection + hero.css)
- TD-11-18: Glass tokens (cierre — eliminación)
- TD-11-24: Footer section-gap tokens dead code (cierre — migración consumidores)
- TD-11-25: Footer py-12/py-16 (cierre — migración a tokens)
- TD-11-31: Container mx-auto px-4 md:px-8 (cierre parcial — Footer/Header max-w-7xl → bbf-container)

### TDs nuevas detectadas

| TD | Descripción | Severidad | Archivo(s) |
|---|---|---|---|
| TD-11-32 | Code.tsx usa Tier 1 directamente (`--bbf-color-black-900`, `--bbf-color-sand-100`) — viola I-4 | MEDIA | `src/components/blocks/Code.tsx:33` |
| TD-11-33 | SkipLink usa token de texto como fondo (inversión semántica) | BAJA | `src/components/atoms/SkipLink/SkipLink.tsx:12` |
| TD-11-34 | Header + Footer usan `max-w-7xl` Tailwind en lugar de `bbf-container-*` — outside Container atom | MEDIA | `Header.tsx:66`, `Footer.tsx:73` |
| TD-11-35 | `useSurface()` hook existe pero 0 componentes lo consumen — infraestructura muerta | BAJA | `src/lib/hooks/useSurface.ts` |
| TD-11-36 | `BBFLogo` + `Icon` declaran surface en variants.ts pero sin implementación funcional real | BAJA | `BBFLogo.variants.ts`, `Icon.variants.ts` |

### Bloqueantes para Wave 11.3-B/C

**Ninguno.** Todos los pre-requisitos están en lugar:
- Wave 11.2-BC cerrada (Container semantic migration) ✅
- Tokens section-gap ya definidos (solo necesitan consumers) ✅
- Superficie canónica bien delimitada por este audit ✅

---

## §8 — Estado final del despacho

**Archivo creado:** `BBF_SurfacesAudit.md` (este archivo)
**git diff --stat:** `BBF_DesignSystemInventory_v0_addendum.md` (398 deletions — eliminado por Zavala en WD, no por CC)
**0 archivos código modificados** ✅ — READ-ONLY cumplido

---

## §12 — Anomalías

| # | Descripción | Severidad | Acción |
|---|---|---|---|
| A-1 | `git status` dirty: `BBF_DesignSystemInventory_v0_addendum.md` eliminado en WD. Claramente eliminado por Zavala post-commit 9a0e705. No afecta código. | INFO | Zavala: `git add -A && git commit` o `git checkout -- BBF_...` si fue accidental |
| A-2 | 56% tokens surface son dead code (13/23). Sistema inflado sin consumo real. | ALTA | Limpiar en Wave 11.3-B |
| A-3 | 4 tokens `--bbf-space-section-gap-*` definidos, 0 consumidores — tokens correctos con migration pendiente. | MEDIA | Migration en Wave 11.3-C |
| A-4 | LocaleSwitcher (consumidor glass según comentario en colors.css) no existe en `/src/components/molecules/LocaleSwitcher/` — componente no implementado. | INFO | Glass tokens: eliminar hasta que LocaleSwitcher exista |

---

## §Y — CIERRE Wave 11.3-B

**Despacho:** B-BBF-WEB-WAVE-11-3-B
**Commit:** [pendiente Zavala stage+commit]
**Fecha cierre:** 2026-05-22

### Cambios aplicados

**Tokens eliminados (14 total):**

| Token | Categoría | Motivo |
|---|---|---|
| `--bbf-surface-glass-light` | Glass | 0 consumidores — dead code |
| `--bbf-surface-glass-dark` | Glass | 0 consumidores — dead code |
| `--bbf-surface-glass-hover` | Glass | 0 consumidores — dead code |
| `--bbf-border-glass` | Glass | 0 consumidores — dead code |
| `--bbf-text-on-glass-light` | Glass | 0 consumidores — dead code |
| `--bbf-text-on-glass-light-hover` | Glass | 0 consumidores — dead code |
| `--bbf-text-on-glass-dark` | Glass | 0 consumidores — dead code |
| `--bbf-surface-success-subtle` | Status subtle | 0 consumidores — dead code |
| `--bbf-surface-warning-subtle` | Status subtle | 0 consumidores — dead code |
| `--bbf-surface-error-subtle` | Status subtle | 0 consumidores — dead code |
| `--bbf-surface-info-subtle` | Status subtle | 0 consumidores — dead code |
| `--bbf-color-bg-surface` | Legacy @deprecated | 0 consumidores — dead code |
| `--bbf-color-bg-inverse` | Legacy @deprecated | 0 consumidores — dead code |
| `--bbf-surface-gradient-red` | T-B-3 CASO B | 0 consumidores — D-145 §3.6 |

**Header SET CERRADO agregado:**
- `src/styles/tokens/semantic/colors.css` — bloque 54 líneas antes de `--bbf-surface-sand`
- 4 surfaces autorizados + 4 PAIRs canónicos documentados in-code

**Red-gradient (contingencia aplicada — CASO B):**
- `--bbf-gradient-red` Tier 1 existe en `primitives/colors.css:95`
- `--bbf-surface-gradient-red` tenía 0 consumidores → ELIMINADO per D-145 §3.6
- Superficie autorizada en D-1 pero token CSS solo se crea cuando aparezca primer consumidor
- TD-11-37 registrada (ver abajo)

### TDs cerradas

- ✅ **TD-11-09** Surface expansion (cierre — set cerrado documentado: 4 surfaces + 4 PAIRs)
- ✅ **TD-11-18** Glass tokens (cierre — 7 tokens eliminados)
- ⏳ **TD-11-17** Legacy migration (cierre parcial — `color-bg-surface` + `color-bg-inverse` eliminados; `color-bg-base` + `color-text-*` permanecen hasta Wave 12)

### TDs registradas en este despacho

**TD-11-37 — red-gradient surface autorizado pendiente consumidor:**
- Severidad: LOW
- Estado: PENDING — token NO creado por D-145 §3.6
- Acción cuando aparezca consumidor real: crear `--bbf-surface-gradient-red: var(--bbf-gradient-red)` en el mismo commit que introduce el consumidor
- Tier 1 `--bbf-gradient-red` ya existe y está listo

### Verificación post-Wave 11.3-B

| Check | Resultado |
|---|---|
| `pnpm typecheck` | ✅ 0 errores |
| Dead code tokens en colors.css | ✅ 0 definiciones (solo 2 menciones en comentarios) |
| Tokens preservados (9/10 verificados) | ✅ |
| `bbf-text-default` (T-B-4 #10) | ⚠️ Token no existe en el archivo — posiblemente referencia desactualizada en despacho. No es TD. |

### Próximo paso

Wave 11.3-C migra componentes:
- Header / Footer `max-w-7xl` → Container atom (TD-11-34)
- Section padding hardcoded → tokens section-gap (TD-11-24/25)
- Code.tsx Tier 1 violation (TD-11-32)
- SkipLink inversión semántica (TD-11-33)
- `bbf-color-bg-base` + `bbf-color-text-primary` (TD-11-17 cierre completo)

---

*BBF_SurfacesAudit.md*
*Actualizado con cierre Wave 11.3-B*
*Despacho B-BBF-WEB-WAVE-11-3-B*
*Para bbf-docs: copiar a 03-canon/design-system/ (Zavala commitea)*
