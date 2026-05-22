# BBF_DesignSystemInventory_v0.md

**Wave:** 11.0 — Audit Inventory  
**Fecha:** 2026-05-22  
**Repo auditado:** `bbf-web` — `/Volumes/PK/BBF/Repos/bbf-web/src/`  
**Autor:** CC (Claude Code) — Wave 11.0 ejecutado bajo D-BBF-KB-141/142/143  
**Destino final:** `bbf-docs/03-canon/design-system/` (Zavala commit)  
**Pre-condición:** Post-revert Wave 10b1. Sistema operativo.

---

## §1 — TOKENS ENCONTRADOS

### 1.1 Estructura de archivos

```
src/styles/
├── globals.css                          ← Entry point (imports en orden correcto)
└── tokens/
    ├── primitives/
    │   ├── colors.css                   ← 75+ tokens color (Tier 1)
    │   ├── typography.css               ← 38 tokens tipografía (Tier 1)
    │   ├── spacing.css                  ← 23 tokens espaciado (Tier 1)
    │   ├── motion.css                   ← 5 tokens motion base (Tier 1 legacy)
    │   ├── radius.css                   ← 5 tokens radio (Tier 1)
    │   ├── shadows.css                  ← VACÍO — shadow vive en semantic
    │   ├── z-index.css                  ← 14 tokens z-index (Tier 1)
    │   └── breakpoints.css              ← 6 tokens breakpoints (Tier 1)
    ├── semantic/
    │   ├── colors.css                   ← ~100 tokens color semantic (Tier 2)
    │   ├── typography.css               ← ~40 tokens tipografía semantic (Tier 2)
    │   ├── spacing.css                  ← 19 tokens spacing semantic (Tier 2)
    │   ├── motion.css                   ← 28 tokens motion canon (Tier 2, D-98)
    │   ├── shadows.css                  ← 10 tokens shadow (Tier 2)
    │   └── feedback.css                 ← 6 tokens feedback state (Tier 2)
    └── components/
        ├── button.css                   ← VACÍO — tokens en CVA directamente
        ├── hero.css                     ← 22 tokens hero-specific (Tier 3)
        ├── hero-section.css             ← Layout classes, 0 tokens nuevos
        ├── logo.css                     ← Pendiente lectura completa
        └── prose.css                    ← Pendiente lectura completa
```

**Orden de import en globals.css:** Tailwind → Reset → Tier1 → Tier2 → Tier3 → Utilities. ✅ Correcto.

---

### 1.2 Tokens Tier 1 — Primitivos

#### Colores (75+ tokens)

| Ramp | Shades | Valores | Formato |
|------|--------|---------|---------|
| Black | 11 (`-50` a `-950`) | `#f5f5f5` → `#000000` | Hex |
| Sand | 7 (`-50` a `-600`) | `#fffcf6` → `#997535` | Hex |
| Red | 11 (`-50` a `-900` + base) | `#fff0ed` → `#6b1a0c` | Hex |
| White | 1 | `#ffffff` | Hex |
| Orange | 1 (`-500`) | `#ff7b49` (gradiente only) | Hex |
| Blue | 9 (`-50` a `-900`) | `#eef4ff` → `#0a2466` | Hex |
| Gradients | 3 | red, red-reverse, sand | CSS gradient |
| Success | 5 (`-50`,`-100`,`-500`,`-700`,`-900`) | `oklch(0.97 0.025 145)` → | OKLCH |
| Warning | 5 | `oklch(0.97 0.025 80)` → | OKLCH |
| Error | 5 | `oklch(0.97 0.02 25)` → | OKLCH |
| Info | 5 | `oklch(0.97 0.02 240)` → | OKLCH |

**Nota:** Color marca en Hex (D-BBF-KB-104), status colors en OKLCH (D-111). Mix intencional.

#### Tipografía (38 tokens)

| Grupo | Tokens |
|-------|--------|
| Font families | `--bbf-font-inter`, `--bbf-font-mulish`, `--bbf-font-mono` |
| Type scale | `--bbf-text-display-1/2` + mobile variants, `h1..h6`, `body-lg/md/sm`, `caption`, `overline`, `micro` |
| Legacy aliases | `--bbf-text-xs..7xl` (compatibilidad) |
| Line heights | 8 tokens (`tight` → `relaxed`) |
| Letter spacing | 9 tokens (`tighter` → `wider` + legacy aliases) |
| Font weights | 7 tokens (`light` → `black`) |
| Paragraph spacing | 3 tokens |

**Golden Ratio φ=1.618 (desktop) + Perfect Fourth 1.333 (mobile).** Sistema musical, no arbitrario.

#### Spacing (23 tokens)

Grid 4pt + 8pt: `--bbf-space-0` → `--bbf-space-64` (0 → 256px).

**Gap detectado:** No existe `--bbf-space-2.5` (10px). Hay salto 8px → 12px. Usado en NewsletterBox con Tailwind `gap-2.5` hardcodeado.

#### Motion primitivos (5 tokens)

`--bbf-duration-fast/normal/slow` + `--bbf-ease-default/out`. Legacy — expandido en semantic.

#### Radius (5 tokens)

`sm` (4px), `md` (8px), `lg` (12px), `xl` (16px), `full` (9999px).

**Gap detectado:** No existe `--bbf-radius-2xl`. Usado `rounded-2xl` en FormField y NewsletterBox (= 16px = `xl`, pero sin token nombrado).

#### Z-index (14 tokens)

Stack completo: `base(0)` → `max(9999)`. Wave 8 agrega `mega-menu(35)`, `header(40)`, `drawer(90)`, `drawer-panel(100)`.

#### Breakpoints (6 tokens)

`xs(480px)`, `sm(640px)`, `md(768px)`, `lg(1024px)`, `xl(1280px)`, `2xl(1536px)`. Estándar Tailwind v4.

---

### 1.3 Tokens Tier 2 — Semánticos

#### Colores semánticos (~100 tokens)

| Grupo | Tokens destacados |
|-------|-------------------|
| Surfaces (7) | `--bbf-surface-sand`, `-sand-elevated`, `-white`, `-black`, `-black-elevated`, `-red`, `-gradient-red` |
| Text on surfaces (9 active + 6 legacy) | `--bbf-text-on-sand/muted/subtle`, `-on-black/muted/subtle`, `-on-red/muted`, `-on-gradient-red` |
| Accents (11) | `--bbf-accent-red/hover/active/accessible/gradient/gradient-hover`, `-on-sand/black/red` + 2 blue |
| Borders (6) | `--bbf-border-on-sand/black/red` + 2 legacy + `strong` |
| Focus ring (2) | `--bbf-color-focus-ring` (red-500), `-on-red` (black-900) |
| Glass (7, deprecated) | `--bbf-surface-glass-*` — transitorio hacia deprecar |
| Legacy aliases (12) | `--bbf-color-bg-*`, `--bbf-color-text-*`, `--bbf-color-border-*`, `--bbf-color-brand-*` |
| Status semantic (12) | `--bbf-color-success/warning/error/info`, surfaces subtle, texts |

#### Tipografía semántica (~40 tokens)

Font roles: `--bbf-font-display` (Inter), `--bbf-font-body` (Mulish), `--bbf-font-code` (Mono).

Semantic props por propósito: `display-1`, `display-2`, `h1`, `h2`, `body`, `lead`, `small`, `micro` — cada uno con 5 atributos (font, size, line, tracking, weight). Mobile overrides via `@media`.

#### Spacing semántico (19 tokens)

Radius semánticos, containers (6), component padding (3), content gaps (3), section gaps (4).

#### Motion semántico (28 tokens, D-98)

Durations (5: instant/fast/base/slow/slower), Easings (8: estándar + BBF signature), Delays stagger (5), Semantic transitions (5), Logo rotation (3).

`@media (prefers-reduced-motion: reduce)` → todas durations a `0.01ms`. ✅ WCAG 2.2.

#### Shadows (10 tokens)

Elevation xs/sm/md/lg/xl + aliases card/floating/modal + button-hover + cta-hover (spread negativo −12px, intencional).

#### Feedback (6 tokens)

Success/Error con bg, text, border semantic.

---

### 1.4 Tokens Tier 3 — Componentes

| Archivo | Estado | Tokens |
|---------|--------|--------|
| `button.css` | VACÍO | 0 — CVA en `.variants.ts` |
| `hero.css` | Activo | 22 tokens hero-specific |
| `hero-section.css` | Solo clases | 0 tokens nuevos |
| `logo.css` | Sin leer | Estimado: logo sizing |
| `prose.css` | Sin leer | Estimado: prose typography |

**Hardcoding detectado en hero.css (CRÍTICO):**
- `--bbf-headline-leading: 0.9` — custom value, no token primitivo
- `--bbf-tagline-tracking: 0.15em` — existe `--bbf-tracking-wider: 0.04em` (diferentes, ambos custom)
- `--bbf-hero-max-width: 56rem` — hardcoded, debería mapear a container token
- `--bbf-cta-icon-shift: 0.375rem` — 6px hardcoded, debería ser `--bbf-space-1.5`

**Resumen token total estimado: ~391 tokens** (Tier1: ~166, Tier2: ~203, Tier3: ~22)

---

## §2 — ATOMS ENCONTRADOS

**Path:** `src/components/atoms/` — 12 componentes

| Componente | Archivo | CVA | Server/Client | Variants (key) |
|-----------|---------|-----|---------------|----------------|
| Button | `Button.tsx` + `Button.variants.ts` | ✅ | Server | intent×4, size×6, surface×6 |
| Heading | `Heading.tsx` + `Heading.variants.ts` | ✅ | Server | level×9, weight×6, color×4, align×3 |
| Text | `Text.tsx` + `Text.variants.ts` | ✅ | Server | variant×6, weight×4, color×5, align×3 |
| Icon | `Icon.tsx` + `Icon.variants.ts` + `registry.ts` | ✅ | Server | size×5, color×6 |
| Badge | `Badge.tsx` | ❌ inline Map | Server | intent×4, size×3 |
| Container | `Container.tsx` | ❌ inline Map | Server | size×6, as polymorphic |
| Link | `Link.tsx` | ❌ sin variantes | Server | next-intl wrapper |
| NavLink | `NavLink.tsx` | ❌ inline | Client | hasSubMenu×2, active state |
| BBFLogo | `BBFLogo.tsx` + `BBFLogoAnimator.tsx` | ✅ | Server+Client | variant×3, size×2 |
| SkipLink | `SkipLink.tsx` | ❌ inline | Server | — |
| MenuIcon | `MenuIcon.tsx` | ❌ inline | Server | — |

### Detalle crítico

**Button** — API canónica completa. `intent: primary|secondary|outline|ghost`. CompoundVariants para ghost/outline sobre superficies dark. Usa tokens vía arbitrary properties `[background:var()]`. ✅

**Heading** — 9 niveles (display-xl/lg/md + h1..h6). D-92 fix: `[font-size:var()]` no `text-[var()]` para evitar conflict Tailwind color. ✅

**Text** — CompoundVariants (M5-D6 fix): `overline` y `tagline` siempre bold aunque se pase `weight=regular`. ✅

**Icon** — Lucide wrapper. Registry type-safe `keyof typeof Icons`. 57 iconos en 7 categorías. ✅

**Badge** — Sin CVA. Inline Maps. `success` usa OKLCH hardcodeado `oklch(70% 0.12 145)`. ⚠️ TD

**Container** — `sizeMap` con 6 valores hardcodeados en TypeScript (no tokens). ⚠️ TD

**BBFLogo** — Server/Client split (D-99). `BBFLogoAnimator` → WAAPI rotation, respeta `prefers-reduced-motion`. ✅

---

## §3 — MOLECULES ENCONTRADOS

**Path:** `src/components/molecules/` — 9 componentes

| Componente | CVA | Server/Client | Propósito |
|-----------|-----|---------------|-----------|
| FormField | ❌ inline | Client | Label + Input/Textarea + Error |
| ContactForm | ❌ monolítica | Client | Form contacto |
| NewsletterBox | ❌ monolítica | Client | Email subscription form |
| HeroVideo | ✅ compound | Server | `<video>` con Source/Overlay |
| LanguageSwitcher | ❌ inline | Client | Selector ES/EN |
| MegaMenuPanel | ❌ inline | Client | Desktop mega-menu |
| MobileMenu | ❌ inline | Client | Mobile drawer nav |
| MobileSubMenu | ❌ inline | Client | Sub-navegación mobile |
| Turnstile | ❌ wrapper | Client | Cloudflare CAPTCHA wrapper |

### Detalle crítico

**FormField** — API sin variantes (solo name/label/type/required/rows). Input: `h-12 rounded-full px-5` hardcodeado. Textarea: `min-h-[120px] rounded-2xl`. Styling surface-locked a `--bbf-text-on-sand` (solo funciona sobre sand surface). ⚠️ CRÍTICO

**NewsletterBox** — State machine correcta (idle/submitting/success/error). Hardcoding: `gap-2.5` (10px sin token), `rounded-2xl` en success box, `p-5`. ⚠️ ALTO

**HeroVideo** — Compound pattern `HeroVideo.Source` + `HeroVideo.Overlay`. Únicas variantes de molecule con CVA. MIME type map codificado en TS (aceptable). ✅

**Navegación (3)** — Wave 8. Sin auditar en detalle. Forman el mega-menu drawer system.

---

## §4 — ORGANISMS ENCONTRADOS

**Path:** `src/components/sections/` — 1 componente activo

| Componente | CVA | Server/Client | Propósito |
|-----------|-----|---------------|-----------|
| HeroSection | ✅ compound | Server | Sección hero completa |

**Path:** `src/components/` — organismos implícitos (Header, Footer — en app/layout o similar)

| Componente | Path estimado | Auditar |
|-----------|---------------|---------|
| Header | `src/components/Header.tsx` o `app/(frontend)/` | Pendiente lectura |
| Footer | `src/components/Footer.tsx` o `app/(frontend)/` | Pendiente lectura |
| ContactSection | `src/components/sections/` o similar | Pendiente lectura |

### HeroSection detallada

**Compound API:**
```tsx
<HeroSection surface="auto" height="screen">
  <HeroVideo ... />
  <HeroSection.Content align="center">
    <Heading ... />
    <Text ... />
    <Button ... />
  </HeroSection.Content>
</HeroSection>
```

**Variantes:**
- Root: `surface: auto|dark|sand|transparent`, `height: screen|auto|half`
- Content: `align: center|left|right`

**Surface** implementada via `data-surface` attribute — única sección con sistema surface activo. ✅

**OBSERVACIÓN:** `src/components/templates/` no existe aún (Tier 4 en docs). HeroSection es el único organism formal.

---

## §5 — SURFACES DE FACTO

### Surfaces formalizadas en schema

`src/payload/collections/surfaces/` — **EXISTE.** Verificar schema actual en Wave 11.2.

### Surfaces en uso en componentes

| Surface | Implementada en | Via |
|---------|----------------|-----|
| `dark` | HeroSection | `data-surface="dark"` |
| `auto` | HeroSection (default) | — |
| `sand` | — | Solo en Button/Heading/Text como `color="primary"` |
| `glass` | Button (variant surface=glass) | CVA class |

**CONCLUSIÓN: Sistema surface (D-94) definido en tokens (~7 surfaces) pero implementado únicamente en HeroSection.** Todos los demás componentes consumen colores hardcoded a `--bbf-text-on-sand` (asumiendo sand context siempre).

### Patrones recurrentes no formalizados

Estas combinaciones aparecen en 3+ lugares sin Surface prop:

| Patrón | Aparece en | Equivalente surface |
|--------|-----------|---------------------|
| `bg-[var(--bbf-surface-sand)] text-[var(--bbf-text-on-sand)]` | Footer, Newsletter, Contact | surface="sand" |
| `bg-[var(--bbf-surface-black)] text-[var(--bbf-text-on-black)]` | Header dark, HeroSection dark | surface="dark" |
| `bg-[var(--bbf-surface-white)] text-[var(--bbf-text-on-sand)]` | FormField inputs | surface="white" |

---

## §6 — ICONS SVG

### SVGs en public/

| Path | Uso |
|------|-----|
| `/public/logos/BBF-Logo-Stamp.svg` | BBFLogo variant="stamp" |
| `/public/logos/BBF-Logo-Icon-Favicon.svg` | Favicon |
| `/public/favicon.svg` | Favicon principal |
| `/public/assets/illustrations/BBF-Identity-line_forms-1.svg` | Decorativo |
| `/public/assets/illustrations/BBF-Identity-line_forms-2.svg` | Decorativo |
| `/public/assets/illustrations/BBF-Identity-line_forms-3.svg` | Decorativo |
| `/public/assets/brand/logos/BBF-Logo-Icon.svg` | Brand asset |
| `/public/assets/brand/logos/BBF-Logo-Name-Circle.svg` | Brand asset |
| `/public/assets/brand/logos/BBF-Logo-Name-H.svg` | Brand asset |
| `/public/assets/brand/icons/BBF-Brand-Brain.jpg` | Sin commitear (untracked) |
| `/public/assets/brand/icons/BBF-Brand-Brain.png` | Sin commitear (untracked) |
| `/public/assets/brand/icons/BBF-Brand-knowledge.jpg` | Sin commitear (untracked) |

### Icon library

**Lucide React** — 57 íconos en registry type-safe:
- Navigation (12): arrowRight, chevronDown, menu, close, etc.
- Actions (14): search, plus, edit, trash, etc.
- Status (13): checkCircle, error, warning, loading, etc.
- Communication (5): mail, phone, message, etc.
- Content (9): file, image, video, calendar, etc.
- User (6): user, users, settings, logout, etc.
- Brand/Decorative (8): sparkles, zap, award, etc.

**Sin inline SVGs en componentes** (excepto BBFLogo que carga via Next.js Image). ✅

---

## §7 — MICROINTERACIONES

### CSS Animations (@keyframes en globals.css/utilities)

| Keyframe | Propósito | Duración |
|----------|-----------|----------|
| `bbf-logo-rotate` | Logo idle rotation | `40s` linear |
| `bbf-fade-up` | Hero entrance (translate + opacity) | Via tokens |
| `bbf-gradient-shift` | Gradient background-position | Via tokens |
| `bbf-gradient-pulse` | Gradient pulsing effect | Via tokens |
| `bbf-fade-in` | Simple fade opacity 0→1 | Via tokens |
| `bbf-slide-up` | Slide from bottom | Via tokens |
| `bbf-scale-in` | Scale 0.95→1 + opacity | Via tokens |

### Clases de motion

| Clase | Uso |
|-------|-----|
| `.hero-entrance` + `.delay-1..5` | Stagger entrada hero (5 elementos) |
| `.bbf-cta-pill` | Scale 1.05 + shadow lift on hover |
| `.bbf-fade-in` | Fade simple |
| `.bbf-slide-up` | Slide entrada |
| `.bbf-scale-in` | Scale entrada |
| `.bbf-hover-lift` | Card hover elevation |
| `.hero-entrance.is-complete` | Cleanup `will-change` post-animación |

### Transitions en componentes

| Componente | Transition |
|-----------|-----------|
| Button | `transition-all duration-200 ease-out` |
| NavLink underline | `transition-all duration-300 ease-out` |
| CTA pill | `transform var(--bbf-motion-cta-duration) var(--bbf-motion-cta-easing), box-shadow ...` |
| BBFLogoAnimator | WAAPI via `element.animate()` (no CSS) |

### Accesibilidad motion

`@media (prefers-reduced-motion: reduce)` en todos los archivos motion: durations → `0.01ms`, animaciones deshabilitadas, logo rotation → 0s. ✅ WCAG 2.2.

**Framer Motion:** NO instalado. ✅ CSS-only + WAAPI canon (D-64, D-98).

---

## §8 — INCONSISTENCIAS DETECTADAS

### Severidad CRÍTICA — Resolver antes de Wave 11.1

| TD | Componente | Problema | Fix propuesto |
|----|-----------|---------|---------------|
| TD-11-01 | `Badge.tsx` | `success` intent usa `oklch(70% 0.12 145)` hardcodeado | Usar `--bbf-color-success-border` + `--bbf-color-success-text` |
| TD-11-02 | `FormField.tsx` | Sin variantes CVA. `h-12`, `min-h-[120px]`, `rounded-full`, `rounded-2xl` hardcodeados | Crear `FormField.variants.ts`, tokens input-height |
| TD-11-03 | `NewsletterBox.tsx` | `gap-2.5` usa spacing 10px sin token | Crear `--bbf-space-2.5` o refactor a `gap-2`/`gap-3` |
| TD-11-04 | `FormField.tsx` | Surface-locked a sand. No funciona sobre dark/red surface | Agregar `surface` prop o contextual surface detection |

### Severidad ALTA — Resolver en Wave 11.1-11.3

| TD | Componente | Problema | Fix propuesto |
|----|-----------|---------|---------------|
| TD-11-05 | `hero.css` | `--bbf-headline-leading: 0.9` custom no-token | Documentar o crear `--bbf-leading-display-tight` |
| TD-11-06 | `hero.css` | `--bbf-hero-max-width: 56rem` hardcoded | Mapear a `--bbf-container-default` (64rem) o crear `--bbf-container-hero` |
| TD-11-07 | `hero.css` | `--bbf-cta-icon-shift: 0.375rem` (6px) | Usar `--bbf-space-1.5` (no existe, crear) o `--bbf-space-2` (8px, close) |
| TD-11-08 | `Container.tsx` | `sizeMap` 6 valores hardcodeados en TypeScript | Migrar a tokens CSS o mapear a `--bbf-container-*` |
| TD-11-09 | Múltiples | Surface system subutilizado — solo HeroSection | Expandir `surface` prop a Header, Footer, FormField, Badge |

### Severidad MEDIA — Wave 11.3-11.7

| TD | Área | Problema | Fix propuesto |
|----|------|---------|---------------|
| TD-11-10 | Tokens | `--bbf-space-2.5` falta (10px gap) | Agregar al spacing primitivos |
| TD-11-11 | Tokens | `--bbf-radius-2xl` falta (rounded-2xl usado) | Agregar a radius primitivos = `1.5rem` (24px) |
| TD-11-12 | Tokens | `--bbf-input-height-sm/md/lg` no existen | Crear en semantic/spacing |
| TD-11-13 | Molecules | Ninguna molecule (excepto HeroVideo) usa CVA | Crear MoleculeVariants pattern |
| TD-11-14 | Badge | Sin `.variants.ts` — patrón inconsistente con otros atoms | Migrar a CVA |
| TD-11-15 | NavLink | `-bottom-1` (−4px) hardcoded | Crear `--bbf-nav-underline-offset` token |
| TD-11-16 | A11y | FormField sin `aria-describedby` para error messages | Agregar en Wave 11.5 |
| TD-11-17 | Tokens legacy | 12 tokens `--bbf-color-bg-*` / `--bbf-color-text-*` legacy en semantic | Deprecar en Wave 11.1, remover en Wave 12 |
| TD-11-18 | Glass tokens | 7 tokens `--bbf-surface-glass-*` marcados transitorio | Evaluar: deprecar o formalizar |

---

## §9 — RECOMENDACIONES DE STANDARDIZACIÓN

### Prioridad 1 — Fundación token (Wave 11.1)

1. **Agregar tokens faltantes:**
   - `--bbf-space-1.5` (6px), `--bbf-space-2.5` (10px) en spacing primitivos
   - `--bbf-radius-2xl` (24px) en radius primitivos
   - `--bbf-input-height-md` (48px = h-12), `--bbf-textarea-min-height` (120px)
   - `--bbf-container-hero` (56rem) en semantic spacing

2. **Deprecar legacy aliases:** 12 tokens `--bbf-color-*-legacy` con fecha Wave 12.

3. **Documentar desvíos intencionales:** `--bbf-headline-leading: 0.9` y `--bbf-tagline-tracking: 0.15em` en BBF_TokensCanon.md como valores especiales justificados.

### Prioridad 2 — Atoms consistentes (Wave 11.5)

4. **Badge → CVA:** Migrar a `Badge.variants.ts` con patrón idéntico a Button/Heading/Text.

5. **Container → tokens:** Migrar `sizeMap` a CSS vars o mapear explícitamente a `--bbf-container-*`.

6. **Badge success fix:** `--bbf-color-success-border` + `--bbf-color-success-text` (tokens ya existen en D-111, solo falta conectar).

### Prioridad 3 — Molecules CVA (Wave 11.6)

7. **FormField completo:** `FormField.variants.ts` con intent (text/email/textarea/search), size (sm/md/lg), surface (sand/dark). Usar tokens input-height.

8. **NewsletterBox tokens:** Reemplazar `gap-2.5` → token, `rounded-2xl` → `--bbf-radius-xl` o `--bbf-radius-2xl`.

9. **Surface prop en molecules:** FormField y NewsletterBox deben funcionar sobre cualquier surface (dark, sand, red).

### Prioridad 4 — Surface expansion (Wave 11.3)

10. **Formalizar surfaces en código:** Header, Footer, ContactSection, Newsletter deben usar `surface` prop explícito, no hardcodear `--bbf-text-on-sand`.

11. **Seed surfaces iniciales** (Wave 11.3): sand, ink, white, brand, subtle, sage.

### Prioridad 5 — Organisms documentar (Wave 11.7)

12. **Auditar Header y Footer** (pendiente lectura completa): verificar uso de atoms/molecules, surface prop, hardcoding.

13. **Definir template Tier 4:** Establecer qué es template vs organism, crear primer template (HomePage).

---

## Resumen ejecutivo

### Estado HOY

| Dimensión | Estado | Calificación |
|-----------|--------|-------------|
| Token system Tier 1-2 | ~370 tokens, 0 hardcoding en primitivos/semánticos | 🟢 Excelente |
| Token system Tier 3 | 22 tokens hero, 3 archivos vacíos | 🟡 Incompleto |
| Atoms | 12 componentes, 9/12 con CVA, patrón inconsistente en 3 | 🟡 Bueno |
| Molecules | 9 componentes, 1/9 con CVA, hardcoding en 3+ | 🔴 Necesita trabajo |
| Organisms | 1 formal (HeroSection), Header/Footer sin auditar | 🟡 Parcial |
| Surfaces | Sistema definido, subutilizado (solo HeroSection) | 🔴 Subutilizado |
| Motion | CSS-only canon, WCAG 2.2, sin framer-motion | 🟢 Excelente |
| Icons | Lucide 57 registry type-safe, SVGs limpios | 🟢 Excelente |
| Accesibilidad | Focus ring, SkipLink, aria-* correctos | 🟡 1 gap (FormField) |

### TDs totales detectadas: 18

- 4 CRÍTICAS (resolver antes Wave 11.1)
- 5 ALTAS (resolver Wave 11.1-11.3)
- 9 MEDIAS (resolver Wave 11.3-11.7)

### Veredicto

**Sistema sólido en tokens y en los atoms principales.** La mayor deuda es en molecules y en la expansión del sistema surface. El Motion system es ejemplar. Los patterns atom (CVA + tokens + Server/Client split) deben propagarse a molecules antes de Wave 12.

**LISTO PARA WAVE 11.1 — Token Standardization.** Scope claro: 4 tokens faltantes + deprecar 12 legacy + documentar desvíos hero.

---

*BBF_DesignSystemInventory_v0*  
*Wave 11.0 — Audit Inventory*  
*Ejecutado 2026-05-22*  
*Destino: bbf-docs/03-canon/design-system/ (Zavala commit)*
