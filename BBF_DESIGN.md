# BBF Design System

**Brand Brain Foundry — Sistema canon de diseño**

> Versión: 1.0 (post-saga M5, 2026-05-17)
> Branch: main | HEAD: ~2a8358b
> Estado: Production canon

---

## 1. Filosofía

Brand Brain Foundry (BBF) opera un sistema de diseño canon basado en:

- **Atomic Design** (Brad Frost) adaptado canon BBF
- **Surface-aware components** con context propagation
- **Token-based** OKLCH colors + semantic abstractions
- **AI-readable** data attributes + JSDoc canon
- **RSC-first** (React Server Components) + Client wraps selectivos
- **Tailwind v4** con arbitrary properties canon

El sistema preserva método (canon BBF) mientras el IP del cerebro de cada cliente es propiedad del cliente. BBF retiene patterns, no instances.

---

## 2. Estructura

```
bbf-web/
├── BBF_DESIGN.md              ← este archivo
├── src/
│   ├── styles/                 ← Foundation: token system
│   │   ├── base/              Reset + focus global
│   │   ├── tokens/
│   │   │   ├── primitives/    Tier 1: raw values (8 archivos)
│   │   │   ├── semantic/      Tier 2: semantic meanings (5 archivos)
│   │   │   └── components/    Tier 3: component-specific (5 archivos)
│   │   ├── utilities/         CSS utilities canon
│   │   └── CLAUDE.md
│   ├── lib/                    ← Foundation: utilities
│   │   ├── context/           SurfaceContext provider
│   │   ├── hooks/             useSurface hook
│   │   ├── i18n/              buildAlternates, helpers
│   │   ├── utils.ts           cn() canon
│   │   └── CLAUDE.md
│   ├── components/             ← Atomic design
│   │   ├── atoms/             5 atoms (BBFLogo, Button, Heading, Icon, Text)
│   │   ├── molecules/         2 molecules (HeroVideo, LocaleSwitcher)
│   │   ├── sections/          1 section (HeroSection)
│   │   └── CLAUDE.md
│   └── app/                    ← Next.js App Router
│       ├── (frontend)/        Public-facing locale
│       ├── (payload)/         Admin CMS
│       ├── globals.css        CSS orchestrator
│       └── CLAUDE.md
```

---

## 3. Tokens canon

### 3.1 Color (OKLCH)

- Primitives: rotaciones hue + saturación (`src/styles/tokens/primitives/colors.css`)
- Semantic: surface-based contextual (`src/styles/tokens/semantic/colors.css`)
- D-69 canon: OKLCH en toda la paleta

### 3.2 Typography

- Family: Inter (display + body) — Major Third scale 1.25
- Tokens: display-xl/lg/md, h1-h6, body-lg/md/sm, caption, overline, tagline
- Pattern: `[font-size:var(--bbf-text-*)]` (Tailwind v4 canon, D-92)
- Archivos: `primitives/typography.css` + `semantic/typography.css`

### 3.3 Spacing

- 8pt grid canon BBF
- Tokens: space-0..32 (rem-based)
- Archivos: `primitives/spacing.css` + `semantic/spacing.css`

### 3.4 Shadows (OKLCH semantic)

- 5 niveles elevación (xs, sm, md, lg, xl)
- 5 aliases contextuales (card, floating, modal, button-hover, cta-hover)
- Archivos: `primitives/shadows.css` + `semantic/shadows.css`

### 3.5 Motion (D-98)

- 5 durations (instant, fast, base, slow, slower)
- 4 easings estándar + 4 BBF signatures (entrance, exit, hover, bounce)
- 5 delays stagger (75ms base canon)
- 5 aliases transitions semánticos
- Archivos: `primitives/motion.css` + `semantic/motion.css`

### 3.6 Otros primitives

- `primitives/breakpoints.css` — breakpoints responsive canon
- `primitives/radius.css` — border-radius canon
- `primitives/z-index.css` — z-index scale canon

---

## 4. Componentes

### 4.1 Atoms (5)

| Atom | Prop semántica | Surface-aware | Server/Client |
|------|----------------|---------------|---------------|
| BBFLogo | variant (4 variantes) | ✓ | Server |
| BBFLogoAnimator | wrapper WAAPI | — | Client |
| Button | intent (semantic) | ✓ | Server |
| Heading | level (display + h1-h6) | ✓ | Server |
| Text | variant (semantic) | ✓ | Server |
| Icon | (Lucide wrapper) | ✓ | Server |

> BBFLogoAnimator vive dentro de `atoms/BBFLogo/` — Client wrapper para WAAPI hover (D-99).

### 4.2 Molecules (2)

| Molecule | Pattern | Archivos |
|----------|---------|---------|
| LocaleSwitcher | Monolítica (D-85) | `LocaleSwitcher.tsx` + `.variants.ts` |
| HeroVideo | Compound (D-86) | `HeroVideo.tsx` + `.variants.ts` |

### 4.3 Sections (1)

| Section | Pattern | Archivos |
|---------|---------|---------|
| HeroSection | Compound (D-89) | `HeroSection.tsx` + `.variants.ts` |

---

## 5. Patterns canon BBF

### 5.1 Atomic composition

```tsx
import { BBFLogo, BBFLogoAnimator } from '@/components/atoms/BBFLogo';
import { Button } from '@/components/atoms/Button';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { HeroSection } from '@/components/sections/HeroSection';

<HeroSection surface="auto">
  <HeroSection.Content align="center">
    <BBFLogoAnimator>
      <BBFLogo variant="stamp" size="hero" animated />
    </BBFLogoAnimator>
    <Heading level="display-lg">...</Heading>
    <Text variant="tagline">...</Text>
    <Button intent="primary" href="...">...</Button>
  </HeroSection.Content>
</HeroSection>
```

### 5.2 Surface flow

```
SurfaceContext propaga top-down ÚNICAMENTE.
DOM traversal por ref DESCARTADO (RSC incompatible).
Components override via prop explícita.
```

### 5.3 Server + Client split (D-99)

```
Pattern canon: Server Component (estático) + Client wrapper (interactividad).
Ejemplo: BBFLogo + BBFLogoAnimator (WAAPI hover).
Aplicable a futuros: carousels, scroll-triggered, video controls.
```

### 5.4 Tailwind v4 arbitrary properties (D-92)

```
Canon:    [font-size:var(--bbf-text-*)]    → font-size: var(...)
Evitar:   text-[var(--bbf-text-*)]          → color: var(...) (bug v4)
Razón:    Tailwind v4 sin type hint defaultea a color.
```

### 5.5 CVA compoundVariants

```typescript
compoundVariants: [
  {
    variant: 'overline',
    weight: 'regular',
    class: 'font-[var(--bbf-weight-bold)]',
  },
]
```

---

## 6. Decisiones doctrinales firmadas (D-BBF-WEB-*)

Sistema de 100+ decisiones doctrinales acumuladas durante construcción.

### Highlights:

- **D-69** OKLCH paleta canon
- **D-72..74** Typography Major Third
- **D-82** AI-readable canon (data-component attributes)
- **D-85** Molecules monolítica pattern
- **D-86** Molecules compound pattern
- **D-88** Sections folder canon (NO organisms/)
- **D-89** HeroSection compound pattern canon
- **D-90** Eliminar inline styles en page.tsx
- **D-91** Hero composition canon variants semánticos
- **D-92** Tailwind v4 arbitrary properties canon
- **D-93** Shadow tokens semantic OKLCH
- **D-94** Surface type 4 valores canon
- **D-95** Atoms `intent` API canon (NO `variant` genérico)
- **D-96** CSSProperties import directo canon
- **D-97** Surface flow context-only (RSC compatible)
- **D-98** Motion system canon BBF
- **D-99** BBFLogo split Server + Client canon
- **D-100** Merge saga M5 a main canon
- **D-101** .gitignore canon (.claude/ excluded)
- **D-102** M5-F fragmentado en 3 fases iterativas

Index completo: ver `docs/D-BBF-WEB.md` (M5-F2 generará).

---

## 7. Lecciones acumuladas (L-BBF-*)

~20 lecciones canon BBF emergidas durante construcción.

### Highlights:

- **L-91** Migrar inline-style a atom requiere verificar variant mapea al token exacto
- **L-92** Tailwind v4 `text-[var()]` sin hint = color (bug latente)
- **L-93** Variants semánticos vs tamaño genérico (tagline NO overline)
- **L-94** Visual review fundador necesario pero NO suficiente
- **L-95** Primitives vs Semantic separation en token system
- **L-96** Cleanups técnicos antes de foundations nuevas
- **L-97** Audits técnicos (HTML class inspection) complementarios
- **L-98** Foundations cuando ≥3 casos justifican
- **L-99** Merge a main cuando sistema canon visualmente completo
- **L-100** Audit pre-merge incluye verificación side-commits no-source
- **L-101** .gitignore canon incluye directorios cliente-local desde inicio

---

## 8. Research canon

Documentos de investigación que respaldan decisiones doctrinales:

- **R-BBF-07** DesignSystemArchitecture (1,169 líneas)
- **R-BBF-08** ComponentArchitecture (1,141 líneas)
- **R-BBF-09** WAAPI canon 2026 + motion best practices

---

## 9. Cómo construir con BBF

### 9.1 Crear nuevo atom

Pattern canon BBF:

1. Folder: `components/atoms/{Name}/`
2. Archivos: `{Name}.tsx`, `{Name}.variants.ts`, `index.ts`
3. CVA con compoundVariants si variants tienen overrides
4. JSDoc canon con D-* y L-* refs
5. `data-component="bbf-{name}"` attribute (D-82)
6. Tokens canon — NO valores hardcoded
7. Surface-aware si aplica
8. Export barrel en `atoms/index.ts`

### 9.2 Crear nueva molecule

1. Folder: `components/molecules/{Name}/`
2. Elegir pattern: monolítica (D-85) o compound (D-86)
3. Misma estructura que atom + elegir Server vs Client
4. Export barrel en `molecules/index.ts`

### 9.3 Crear nueva section

1. Folder: `components/sections/{Name}/` (NO organisms/)
2. Compound pattern preferido (D-88)
3. Export barrel en `sections/index.ts`

### 9.4 Usar tokens canon

```tsx
// ✅ CANON
className="[font-size:var(--bbf-text-display-lg)]"
style={{ '--bbf-custom': value } as CSSProperties}

// ❌ Hardcoded
style={{ fontSize: '3rem' }}
```

---

## 10. Sistema vivo

Este documento se actualiza con cada nueva decisión doctrinal canon BBF.
Fuente de verdad: `/Volumes/PK/BBF/Repos/bbf-web/` + commits trazables.

**Last updated:** 2026-05-18 (M5-F1)
