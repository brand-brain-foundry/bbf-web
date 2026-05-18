# SKILL: Use Tokens Canon BBF

**Aplicar tokens canon BBF correctamente en componentes**

> Trigger: cualquier componente que aplica color/typography/spacing/shadow/motion
> Output esperado: tokens canon aplicados — cero hardcoded values
> Tiempo estimado: aplicación continua durante construcción
> Decisiones canon: D-69, D-72..74, D-92, D-93, D-98

---

## Cuándo usar este skill

**Triggers concretos:**
- Construir nuevo componente (átomo/molécula/sección)
- Modificar estilos de componente existente
- Auditar componente con hardcoded values
- Strategic detecta regresión de tokens

---

## Sistema de tokens canon (3 tiers)

```
Tier 1 — Primitives    valores brutos (NO usar directo en componentes)
   ↓ subordina
Tier 2 — Semantic      significados contextuales (ENTRY POINT canon)
   ↓ subordina
Tier 3 — Components    tokens específicos de un componente
```

**Archivos reales:**
```
src/styles/tokens/
├── primitives/   breakpoints, colors, motion, radius, shadows, spacing, typography, z-index
├── semantic/     colors, motion, shadows, spacing, typography
└── components/   button, hero, hero-section, locale-switcher, logo
```

**Regla:** componentes usan **Tier 2 (semantic)** preferiblemente. Tier 3 solo internamente en ese componente.

---

## Pattern Tailwind v4 canon (D-92 CRÍTICO)

### El bug

```tsx
// ❌ Tailwind v4 sin type hint: text-[var()] → color: (NO font-size:)
className="text-[var(--bbf-text-display-lg)]"
// Resultado: browser default font-size, el token NO aplica como font-size
```

### La solución canon (D-92)

```tsx
// ✅ Arbitrary property explícita — garantiza la CSS property correcta
className="[font-size:var(--bbf-text-display-lg)]"
```

### Cuándo aplica por propiedad

| CSS property | Tailwind canon |
|-------------|----------------|
| font-size | `[font-size:var(--bbf-text-*)]` — ⚠️ usar arbitrary |
| font-weight | `[font-weight:var(--bbf-weight-*)]` o `font-[var(--bbf-weight-*)]` |
| color | `text-[var(--bbf-text-on-light)]` ✓ no ambiguo |
| background | `bg-[var(--bbf-surface-sand)]` ✓ no ambiguo |
| padding/margin | `p-[var(--bbf-space-4)]` ✓ no ambiguo |
| box-shadow | `shadow-[var(--bbf-shadow-md)]` ✓ no ambiguo |
| transition | `[transition:var(--bbf-transition-hover)]` — arbitrary |
| letter-spacing | `tracking-[var(--bbf-tracking-overline)]` ✓ no ambiguo |

**Regla:** Si Tailwind utility puede ser ambigua (texto → color vs font-size), usar **arbitrary property explícita**.

---

## Tokens canon por categoría

### Colors (OKLCH — D-69)

```css
/* Semantic Tier 2 */

/* Texto */
--bbf-text-on-light            /* texto sobre fondos claros */
--bbf-text-on-light-secondary  /* texto secundario sobre claro */
--bbf-text-on-light-muted      /* texto muted sobre claro */
--bbf-text-on-dark             /* texto sobre fondos oscuros */

/* Superficies */
--bbf-surface-black            /* fondo dark canon (hero, secciones inversas) */
--bbf-surface-black-elevated   /* hover sobre dark */
--bbf-surface-sand             /* fondo sand canon BBF */
--bbf-surface-sand-elevated    /* hover sobre sand */

/* Accent */
--bbf-accent-red               /* rojo canon BBF */
--bbf-accent-red-hover         /* rojo hover */

/* Borders */
--bbf-border-on-light
--bbf-border-on-dark

/* Focus */
--bbf-color-focus-ring
```

### Typography (Major Third 1.25 — D-72..74)

```css
/* Display */
--bbf-text-display-xl
--bbf-text-display-lg
--bbf-text-display-md

/* Headings */
--bbf-text-h1  --bbf-text-h2  --bbf-text-h3
--bbf-text-h4  --bbf-text-h5  --bbf-text-h6

/* Body */
--bbf-text-body-lg  --bbf-text-body-md  --bbf-text-body-sm

/* Special */
--bbf-text-caption
--bbf-text-overline
--bbf-text-base          /* tagline hero canon */

/* Weights */
--bbf-weight-regular
--bbf-weight-medium
--bbf-weight-semibold
--bbf-weight-bold
--bbf-weight-extrabold
--bbf-weight-black

/* Leading (line-height) */
--bbf-leading-display
--bbf-leading-heading
--bbf-leading-body
--bbf-leading-snug

/* Tracking (letter-spacing) */
--bbf-tracking-display
--bbf-tracking-heading
--bbf-tracking-overline

/* Families */
--bbf-font-display
--bbf-font-body
```

### Spacing (8pt grid)

```css
--bbf-space-0 .. --bbf-space-32  /* rem-based, 8pt grid */
```

### Shadows (OKLCH semantic — D-93)

```css
/* Elevation levels */
--bbf-shadow-xs  --bbf-shadow-sm  --bbf-shadow-md
--bbf-shadow-lg  --bbf-shadow-xl

/* Semantic aliases */
--bbf-shadow-card
--bbf-shadow-floating
--bbf-shadow-modal
--bbf-shadow-button-hover
--bbf-shadow-cta-hover
```

### Motion (D-98)

```css
/* Durations */
--bbf-motion-instant  --bbf-motion-fast  --bbf-motion-base
--bbf-motion-slow     --bbf-motion-slower

/* Easings estándar */
--bbf-easing-linear  --bbf-easing-in  --bbf-easing-out  --bbf-easing-in-out

/* BBF signature easings */
--bbf-easing-entrance  --bbf-easing-exit
--bbf-easing-hover     --bbf-easing-bounce

/* Stagger delays (75ms base) */
--bbf-delay-1 .. --bbf-delay-5

/* Aliases transition semánticos */
--bbf-transition-default
--bbf-transition-hover
--bbf-transition-color
--bbf-transition-fade
--bbf-transition-entrance
```

---

## Proceso canon (paso a paso)

### Paso 1 — Identificar qué propiedad CSS necesita

```
¿Color texto?     → --bbf-text-on-* o --bbf-text-on-light-*
¿Background?      → --bbf-surface-*
¿Font-size?       → --bbf-text-{display|h*|body|caption|overline|base}
¿Font-weight?     → --bbf-weight-{regular|medium|semibold|bold|extrabold|black}
¿Espaciado?       → --bbf-space-{0..32}
¿Shadow?          → --bbf-shadow-{xs|sm|md|lg|xl} o alias semántico
¿Animación?       → --bbf-motion-* + --bbf-easing-* + --bbf-transition-*
¿Border-radius?   → (buscar en primitives/radius.css)
¿Z-index?         → (buscar en primitives/z-index.css)
```

### Paso 2 — Verificar que el token existe

```bash
# Buscar en semantic (preferido)
grep -n "bbf-text-display" src/styles/tokens/semantic/typography.css

# Si no existe en semantic, buscar en primitives
grep -rn "bbf-{nombre}" src/styles/tokens/primitives/
```

### Paso 3 — Aplicar token canon

#### En CSS component-specific (Tier 3):
```css
.bbf-mi-componente {
  color: var(--bbf-text-on-light);
  background: var(--bbf-surface-sand);
  padding: var(--bbf-space-4);
  font-size: var(--bbf-text-body-md);
  box-shadow: var(--bbf-shadow-card);
  transition: var(--bbf-transition-hover);
}
```

#### En JSX/TSX con Tailwind v4 (canon en componentes):
```tsx
<div className={cn(
  'text-[var(--bbf-text-on-light)]',         // color ✓
  'bg-[var(--bbf-surface-sand)]',            // background ✓
  'p-[var(--bbf-space-4)]',                  // padding ✓
  '[font-size:var(--bbf-text-body-md)]',     // font-size ⚠️ arbitrary
  'shadow-[var(--bbf-shadow-card)]',         // shadow ✓
  '[transition:var(--bbf-transition-hover)]', // transition ⚠️ arbitrary
)}>
```

#### En CVA variants (patrón más común en atoms/molecules):
```typescript
export const myVariants = cva('base', {
  variants: {
    color: {
      primary: 'text-[var(--bbf-text-on-light)]',
      inverse: 'text-[var(--bbf-text-on-dark)]',
    },
    size: {
      md: '[font-size:var(--bbf-text-body-md)]',  // ⚠️ arbitrary obligatorio
      lg: '[font-size:var(--bbf-text-body-lg)]',
    },
  },
});
```

### Paso 4 — Verificar resultado

```bash
pnpm dev
# Inspect element → Computed styles
# Confirmar: font-size aplicado (no default browser)
# Confirmar: color del token correcto
```

### Paso 5 — Si token NO existe, escalar

**NUNCA crear tokens ad-hoc sin validar:**
- ¿≥3 casos de uso justifican? (L-BBF-98 foundation rule)
- ¿Categoría existe o requiere tier nuevo?
- Escalar a Strategic → Strategic decide tier correcto

---

## Anti-patterns (NO hacer)

| ❌ NO | ✅ Canon BBF |
|------|-------------|
| `style={{ fontSize: '3rem' }}` | `[font-size:var(--bbf-text-display-md)]` |
| `className="text-blue-500"` | `text-[var(--bbf-accent-*)]` (si existe) |
| `className="text-[var(--bbf-text-display-lg)]"` | `[font-size:var(--bbf-text-display-lg)]` (D-92) |
| `style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}` | `shadow-[var(--bbf-shadow-sm)]` |
| `oklch(0.6 0.2 25)` hardcoded | Tokens OKLCH via `var(--bbf-color-*)` |
| `--bbf-mi-token-custom` sin justificar | Reusar tokens canon existentes |
| Animations sin `prefers-reduced-motion` | Tokens motion incluyen canon |

---

## Verificación de hardcoded values

```bash
# Hardcoded en componentes (debería ser 0 en canon)
grep -rn "style={{" src/components/ --include="*.tsx" | grep -v "as CSSProperties"
grep -rn "font-size:" src/components/ --include="*.css"

# Verificar que se usa token (no oklch/hex directo)
grep -rn "oklch(" src/components/
grep -rn "#[0-9a-fA-F]\{3,6\}" src/components/
```

---

## Refs

### Decisiones canon
- **D-69** OKLCH paleta canon
- **D-72..74** Typography Major Third scale
- **D-92** Tailwind v4 arbitrary properties (CRÍTICO)
- **D-93** Shadow tokens semantic OKLCH
- **D-98** Motion system canon BBF

### Lecciones críticas
- **L-92** Tailwind v4 `text-[var()]` = color (bug — usar `[font-size:var()]`)
- **L-95** Primitives vs Semantic — componentes usan semantic
- **L-98** Foundations (nuevos tokens) cuando ≥3 casos justifican

### Documentos relacionados
- `src/styles/CLAUDE.md` — Token system canon (3 tiers, estructura)
- `BBF_DESIGN.md` §3 — Tokens canon overview
