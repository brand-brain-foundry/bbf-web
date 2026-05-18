# SKILL: Cross-Surface

**Aplicar un elemento UI correctamente en múltiples surfaces (light, dark, sand)**

> Trigger: componente o elemento que debe funcionar en más de una surface
> Output esperado: cross-surface correcto sin duplicación de tokens
> Tiempo estimado: aplicación continua durante construcción
> Decisiones canon: D-77, D-94, D-107

---

## Cuándo usar este skill

**Triggers concretos:**
- Componente necesita verse bien en `surface="dark"` Y `surface="auto"` (light)
- Atom/molecule recibe `surface` prop o `color` variant
- Token de color para texto/fondo no es correcto en una surface específica
- UI element se usa dentro de sections con diferentes surfaces

---

## Sistema de surfaces canon BBF (D-94)

```
4 valores surface canon:
  auto        → fondo base (generalmente light/sand)
  dark        → fondo oscuro (BBF surface-black)
  sand        → fondo arena BBF
  transparent → sin fondo (overlay sobre cualquier surface)
```

**Propagación canon (D-107):**

```
Section root → data-surface attribute → CSS [data-surface] selectors
```

NO via prop drilling. NO via SurfaceContext (salvo override programático JS).

---

## Patrón canon: data-surface attribute

```html
<!-- Section root (patrón HTML canon BBF) -->
<section data-surface="dark" data-component="bbf-features">
  <!-- Children leen surface via CSS [data-surface="dark"] selector -->
  <p class="text-[var(--bbf-text-on-light)]">
    <!-- Token "on-light" que CSS sobreescribe según data-surface -->
  </p>
</section>
```

**Tokens semánticos auto-adaptativos:**
Usar tokens semantic `--bbf-text-on-light` + CSS override en `[data-surface="dark"]`.
Esto elimina prop-drilling de surface a cada child.

---

## Proceso canon (paso a paso)

### Paso 1 — Identificar qué surfaces soporta el componente

```
¿El componente aparece solo en light?  → No necesita cross-surface
¿El componente aparece en dark?        → Necesita tokens on-dark
¿El componente aparece en sand?        → Verificar si sand ≠ light necesita override
¿Es decorativo (no texto)?             → Solo verificar contraste visual
```

### Paso 2 — Elegir patrón de implementación

#### Patrón A: Tokens semánticos directos (simple)

Para atoms/molecules que **heredan color del padre** via CSS:

```css
/* Componente usa token "on-light" */
.bbf-mi-componente {
  color: var(--bbf-text-on-light);
}

/* CSS override cuando está dentro de surface dark */
[data-surface="dark"] .bbf-mi-componente {
  color: var(--bbf-text-on-dark);
}
```

#### Patrón B: CVA `color` variant explícita (atoms)

Para atoms que reciben `color` prop (Icon, Heading, Text, Button):

```typescript
export const headingVariants = cva('', {
  variants: {
    color: {
      primary: 'text-[var(--bbf-text-on-light)]',
      inverse: 'text-[var(--bbf-text-on-dark)]',    // dark surface
      secondary: 'text-[var(--bbf-text-on-light-secondary)]',
      accent: 'text-[var(--bbf-accent-red)]',
    },
  },
});
```

Uso: `<Heading color="inverse">` cuando está sobre dark.

#### Patrón C: `surface` variant en molecule/section

Para molecules/sections que cambian su fondo según surface:

```typescript
export const sectionVariants = cva('', {
  variants: {
    surface: {
      auto:        'bg-[var(--bbf-color-bg-base)]',
      dark:        'bg-[var(--bbf-surface-black)]',
      sand:        'bg-[var(--bbf-surface-sand)]',
      transparent: '',
    },
  },
});
```

### Paso 3 — Fuente de verdad única (D-107 CRÍTICO)

**UN solo lugar define el token cross-surface. NUNCA redefinir.**

```
❌ MALO: Button redefine color en dark mode localmente
✅ CANON: Button usa --bbf-text-on-light → CSS [data-surface="dark"] lo sobreescribe
```

Checklist D-107:
- [ ] Token viene de `src/styles/tokens/semantic/` (Tier 2)
- [ ] CSS override vive en `src/styles/tokens/semantic/colors.css` o en el CSS del componente
- [ ] NO duplicado en múltiples archivos

### Paso 4 — Verificar contraste en cada surface

```bash
pnpm dev
# Inspeccionar elemento en cada surface:
# - data-surface="auto"   → texto legible (WCAG AA: 4.5:1)
# - data-surface="dark"   → texto legible (WCAG AA: 4.5:1)
# - data-surface="sand"   → texto legible (puede diferir de auto)
```

Tokens OKLCH de BBF están diseñados para contraste correcto en cada surface.

### Paso 5 — Si SurfaceContext es necesario (raro)

`SurfaceContext` solo para override programático desde JS (ej: theme toggle dinámico):

```tsx
import { SurfaceProvider, useSurface } from '@/lib/context/SurfaceContext';

// Solo si el override viene de estado JS, no de composición estática
function DynamicSection({ surface }) {
  return (
    <SurfaceProvider value={surface}>
      <div data-surface={surface}>
        {/* children */}
      </div>
    </SurfaceProvider>
  );
}
```

**Regla:** Si la surface es fija en composición, usa `data-surface` attribute. Si cambia dinámicamente desde JS, usa SurfaceContext.

---

## Token map por surface

```
surface="auto" (light/base)
  texto:    --bbf-text-on-light
  fondo:    --bbf-color-bg-base o --bbf-surface-sand
  border:   --bbf-border-on-light
  accent:   --bbf-accent-red

surface="dark"
  texto:    --bbf-text-on-dark
  fondo:    --bbf-surface-black
  border:   --bbf-border-on-dark
  hover:    --bbf-surface-black-elevated

surface="sand"
  texto:    --bbf-text-on-light (mismo que auto)
  fondo:    --bbf-surface-sand
  border:   --bbf-border-on-light

surface="transparent"
  texto:    hereda del padre
  fondo:    ninguno (transparent)
```

---

## Anti-patterns (NO hacer)

| ❌ NO | ✅ Canon BBF |
|------|-------------|
| Hardcoded color por surface: `color="#fff"` | Token semántico + CSS override |
| Prop drilling `surface` a todos los children | `data-surface` attribute en root |
| Redefinir token en cada componente | Una fuente (D-107), CSS override |
| `SurfaceContext` en sections estáticas | `data-surface` attribute es suficiente |
| `oklch()` hardcoded en componente | Siempre via `var(--bbf-*)` |
| Ignorar contraste WCAG en surface nueva | Verificar cada surface |

---

## Refs

### Decisiones canon
- **D-77** Surface-aware components
- **D-94** Surface 4 valores canon (auto/dark/sand/transparent)
- **D-97** Surface flow context-only (RSC compatible)
- **D-107** Cross-surface fuente de verdad única

### Lecciones canon
- **L-95** Primitives vs Semantic token separation

### Archivos clave
- `src/styles/tokens/semantic/colors.css` — tokens surface-aware
- `src/lib/context/SurfaceContext.tsx` — context opcional
- `src/lib/hooks/useSurface.ts` — hook consumidor
- `src/components/sections/HeroSection/CLAUDE.md` — ejemplo canon data-surface
