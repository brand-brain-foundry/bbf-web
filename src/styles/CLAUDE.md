# CLAUDE.md — src/styles/

**Token system canon BBF**

> Foundation tier — tokens primitivos, semánticos y component-specific.
> Lee este archivo antes de modificar styles.

---

## Estructura

```
styles/
├── base/
│   ├── reset.css              CSS reset base
│   └── focus.css              Focus styles global
├── tokens/
│   ├── primitives/            Tier 1: valores brutos (8 archivos)
│   │   ├── colors.css
│   │   ├── typography.css
│   │   ├── spacing.css
│   │   ├── motion.css
│   │   ├── shadows.css
│   │   ├── breakpoints.css
│   │   ├── radius.css
│   │   └── z-index.css
│   ├── semantic/              Tier 2: significados canon (5 archivos)
│   │   ├── colors.css
│   │   ├── typography.css
│   │   ├── spacing.css
│   │   ├── motion.css
│   │   └── shadows.css
│   └── components/            Tier 3: componente-specific (5 archivos)
│       ├── button.css
│       ├── hero.css
│       ├── hero-section.css
│       ├── locale-switcher.css
│       └── logo.css
└── utilities/
    ├── animations.css         @keyframes canon
    └── motion-patterns.css    Patterns canon reusables
```

---

## Tiers canon

### Tier 1: Primitives

**Función:** valores brutos sin contexto.
**Ejemplo:** `--bbf-color-red-500: oklch(0.6 0.2 25)`.
**No usar directamente** en componentes — usar semantic.

### Tier 2: Semantic

**Función:** dar significado canon a primitives.
**Ejemplo:** `--bbf-text-on-light: var(--bbf-color-black-900)`.
**Usar en componentes** — preferred entry point.

### Tier 3: Components

**Función:** tokens específicos de un componente.
**Ejemplo:** `--bbf-logo-rotation-duration: 40s`.
**Usar solo internamente** dentro del componente.

---

## Sistema de tokens

### Color (OKLCH — D-69)

- Primitives: rotaciones hue + saturación
- Semantic: text-on-*, surface-*, accent-*
- Surface-based: tokens cambian según contexto de superficie

### Typography

- Family: Inter (display + body)
- Scale: Major Third 1.25 (D-72..74)
- Tokens: display-xl/lg/md, h1-h6, body-lg/md/sm, caption, overline, tagline
- Pattern Tailwind v4: `[font-size:var(--bbf-text-base)]` (D-92)

### Spacing

- 8pt grid canon BBF
- Tokens: space-0..32 (rem-based)

### Shadows (D-93)

- OKLCH alpha alineado D-69
- 5 niveles (xs/sm/md/lg/xl)
- 5 aliases (card/floating/modal/button-hover/cta-hover)

### Motion (D-98)

- Durations: instant/fast/base/slow/slower
- Easings: 4 estándar + 4 BBF signature (entrance, exit, hover, bounce)
- Delays: stagger 75ms base
- Aliases: transition-default/hover/color/fade/entrance

---

## Reglas canon

1. **Nunca hardcodear values** — siempre tokens canon
2. **Tier hierarchy** — primitives → semantic → components
3. **OKLCH para colors** (D-69)
4. **Tailwind v4 pattern** — arbitrary property explícita (D-92)
5. **prefers-reduced-motion** siempre respetar (en utilities/animations.css)
6. **Animate solo** transform + opacity (no layout thrash)
7. **will-change sparingly** + remove post-animation

---

## Decisiones aplicables

- **D-69** OKLCH paleta canon
- **D-72..74** Typography Major Third scale
- **D-92** Tailwind v4 arbitrary properties canon
- **D-93** Shadow tokens semantic canon
- **D-98** Motion system canon BBF

---

## Cómo agregar nuevos tokens

1. Identificar tier correcto (primitives/semantic/components)
2. Naming canon: `--bbf-{category}-{name}-{modifier}`
3. Subordinación: semantic referencia primitive via `var()`
4. Si afecta múltiples componentes, va en semantic (no components)
5. Actualizar `app/globals.css` con el @import correspondiente
6. Actualizar BBF_DESIGN.md §3 si nueva categoría de token
