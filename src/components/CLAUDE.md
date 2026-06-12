# CLAUDE.md — src/components/

**Atomic Design canon BBF**

> Filosofía: atoms → molecules → sections.
> Lee antes de crear/modificar componentes.

---

## Estructura

```
components/
├── atoms/                     Primitive UI elements
│   ├── BrandLogo/             D-DS-08 rename (era BrandLogo)
│   │   ├── BrandLogo.tsx      Server Component (carga SVG)
│   │   ├── BrandLogoAnimator.tsx  Client wrapper WAAPI (D-99)
│   │   ├── BrandLogo.variants.ts
│   │   └── index.ts
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.variants.ts
│   │   └── index.ts
│   ├── Heading/
│   │   ├── Heading.tsx
│   │   ├── Heading.variants.ts
│   │   └── index.ts
│   ├── Icon/
│   │   ├── Icon.tsx
│   │   ├── Icon.variants.ts
│   │   ├── registry.ts        Icon registry canon (D-108)
│   │   └── index.ts
│   ├── Text/
│   │   ├── Text.tsx
│   │   ├── Text.variants.ts
│   │   └── index.ts
│   └── index.ts               Barrel export atoms
├── molecules/                 Composed atoms
│   ├── HeroVideo/             Compound pattern (D-86)
│   │   ├── HeroVideo.tsx
│   │   ├── HeroVideo.variants.ts
│   │   └── index.ts
│   ├── LocaleSwitcher/        Monolítica pattern (D-85)
│   │   ├── LocaleSwitcher.tsx
│   │   ├── LocaleSwitcher.variants.ts
│   │   └── index.ts
│   └── index.ts               Barrel export molecules
├── sections/                  Page sections (compound)
│   ├── HeroSection/           Section + Content compound (D-89)
│   │   ├── HeroSection.tsx
│   │   ├── HeroSection.variants.ts
│   │   └── index.ts
│   └── index.ts               Barrel export sections
└── templates/                 Tier 4 — composition de sections (D-106)
    └── CLAUDE.md              Documentación tier (sin implementaciones aún)
```

---

## Pattern canon por nivel

### Atoms

**Folder estructura canon:**
```
atoms/{Name}/
├── {Name}.tsx                 Componente Server (o Client si necesita interactividad)
├── {Name}.variants.ts         CVA variants
└── index.ts                   Barrel export
```

**API prop canon (D-95 RATIFICADA):**
- Atoms tienen prop **semántica** (intent, level, variant)
- NO prop genérica ni genéricos numéricos
- `<Button intent="primary">`, `<Heading level="display-lg">`, `<Text variant="tagline">`

**CVA pattern:**
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const atomVariants = cva(
  'base-classes',
  {
    variants: {
      intent: { /* ... */ },
    },
    compoundVariants: [/* override cuando variant cambia default */],
    defaultVariants: { /* ... */ },
  }
);

export type AtomVariants = VariantProps<typeof atomVariants>;
```

### Molecules

**Patterns canon:**
- **Monolítica (D-85):** componente único, todas las props en la API directa
- **Compound (D-86):** sub-components nombrados (`Molecule.SubComponent`)

**Cuándo usar cada uno:**
- Monolítica si pocas props + uso interno simple (ej. LocaleSwitcher)
- Compound si composition flexible necesaria (ej. HeroVideo)

### Sections

**Pattern canon (D-88, D-89):**
- Folder: `sections/{Name}/` — NO organisms/
- Compound pattern preferido
- API: `<Section surface="..."><Section.Content>...</Section.Content></Section>`

### Templates (Tier 4 — D-106)

**Pattern canon:**
- Folder: `templates/{Name}Template/`
- Thin wrappers que orquestan sections con slots ReactNode
- Server Components — 0 lógica de negocio
- Cuando ≥2 pages comparten composition de sections
- Ver `templates/CLAUDE.md` para documentación completa

---

## Atomic composition canon

```tsx
// Atoms
<Heading level="display-lg">...</Heading>
<Text variant="body-md">...</Text>
<Button intent="primary" href="...">...</Button>

// Atom Server + Client split (D-99)
<BrandLogoAnimator>
  <BrandLogo variant="stamp" animated />
</BrandLogoAnimator>

// Molecule compound
<HeroVideo>
  <HeroVideo.Source ... />
</HeroVideo>

// Section compound
<HeroSection>
  <HeroSection.Content align="center">
    <Heading ... />
    <Text ... />
    <Button ... />
  </HeroSection.Content>
</HeroSection>
```

---

## Server vs Client

### Default: Server Component

- Sin `'use client'` directive
- Sin state interactivo, sin event handlers
- Mejor performance, RSC compatible
- Ejemplos: Heading, Text, BrandLogo, Button, Icon

### Client cuando necesario

- `'use client'` al top del archivo
- State, events, browser APIs, hooks de React
- Ejemplos: BrandLogoAnimator (WAAPI), LocaleSwitcher (useRouter)

### Server + Client split canon (D-99)

```
Server Component → carga estático (SVG, markup, tokens)
Client Component → wrappea para interactividad (WAAPI, router, state)
Pattern: <ClientWrapper><ServerComponent /></ClientWrapper>
```

---

## Tokens canon en componentes

```tsx
// ✅ CANON — arbitrary property Tailwind v4 (D-92)
className="[font-size:var(--bbf-text-display-lg)]"

// ✅ CANON — CSSProperties para tokens dinámicos (D-96)
style={{ '--bbf-custom-token': value } as CSSProperties}

// ❌ Hardcoded
style={{ fontSize: '3rem', color: '#1a1a1a' }}
```

---

## data-component AI-readable (D-82)

Todos los componentes BBF tienen `data-component` attribute:

```tsx
<div data-component="bbf-{component-name}" ...>
```

Permite a AI agentes identificar componentes BBF por HTML inspection.

---

## Surface canon (D-94 + D-110)

Sistema canon BBF de 5 surfaces para composition cross-surface:

```
auto         default según context heredado (resuelve a valor concreto)
dark         fondos oscuros (hero, secciones inversas, modals)
sand         fondos claros canon BBF
glass        translúcidas backdrop blur (LocaleSwitcher)
transparent  child preserve parent surface (composition explícita)
```

**Pattern canon:** propagación via `data-surface` attribute en HTML.
**SurfaceContext:** solo override programático JS (raro).

Ver `lib/CLAUDE.md` §Surface canon + `BBF_DESIGN.md` §5.6.

---

## Decisiones aplicables

- **D-82** AI-readable canon (data-component)
- **D-85** Molecules monolítica pattern
- **D-86** Molecules compound pattern
- **D-88** Sections folder canon (NO organisms/)
- **D-89** HeroSection compound pattern
- **D-92** Tailwind v4 arbitrary properties
- **D-95** Atoms prop semántica canon (intent, level, variant)
- **D-96** CSSProperties import directo canon
- **D-99** Server + Client split canon
- **D-106** Templates Tier 4 canon
- **D-107** Cross-surface fuente de verdad única
- **D-108** Icon registry centralizado
- **D-110** Surface canon 5 valores (auto/dark/sand/glass/transparent)

---

## Lecciones aplicables

- **L-91** Migrar inline-style a atom: verificar que variant mapea al token exacto
- **L-92** Tailwind v4 `text-[var()]` sin hint = color (bug latente, usar arbitrary)
- **L-93** Variants semánticos NO tamaño genérico (`tagline` NO `overline`)
- **L-98** Crear foundations cuando ≥3 casos justifican (no premature abstraction)

---

## Cómo agregar nuevos componentes

1. Identificar nivel: atom / molecule / section
2. Folder canon: `{nivel}/{Name}/`
3. Archivos: `{Name}.tsx` + `{Name}.variants.ts` + `index.ts`
4. JSDoc canon con D-* refs relevantes
5. `data-component="bbf-{name}"` attribute (D-82)
6. Tokens canon — NUNCA valores hardcoded
7. Surface-aware si el componente cambia según contexto visual
8. Export barrel en `{nivel}/index.ts`
9. Si toca >3 archivos no relacionados, escalar a Strategic antes de ejecutar
