# CLAUDE.md — QuoteBlock

**Molecule canónico BBF con variants testimonial + manifesto**

> D-S5-06: extraído en 2da ocurrencia (§3 + §5) para evitar fragmentación.
> D-FIX-S5-04: manifesto text usa display-section-h2 level — parity visual con H2 del SectionHeader.

---

## API

```tsx
type QuoteBlockProps = {
  text: ReactNode;         // Texto principal del quote
  textSoft?: string;       // Segunda línea soft (variant manifesto: gradient rojo animado)
  attribution?: string;    // Atribución mono-xs
  surface?: 'warm' | 'dark';
  variant?: 'testimonial' | 'manifesto';
  className?: string;
};
```

---

## Variants

### `variant="testimonial"` — §3 Caso (surface dark)

- Left-align, sin centrado
- Dark elevated bg + border + border-radius
- Quote mark SVG (❝) en top-left
- Blockquote: `clamp(1.25rem, 2.4vw, 1.875rem)` / weight 400 / color dark-surface
- Atribución: mono-xs, left-aligned, color dark-muted
- **NO usa Heading atom** — tipografía propia del testimonial

### `variant="manifesto"` — §5 Método (surface warm)

- Text-align: center
- Warm elevated bg + border + border-radius
- Padding generoso: `clamp(3rem, 8vw, 6rem) clamp(2rem, 6vw, 5rem)`
- **text** → usa tokens de `display-section-h2` (parity con H2 del SectionHeader)
  - font-size: `var(--bbf-typography-display-section-h2-size)`
  - font-weight: `var(--bbf-typography-display-section-h2-weight)` (~500)
- **textSoft** → misma tipografía + `.bbf-text-gradient-red-animated`
- Atribución: mono-xs, centrada, margin-top generoso

---

## Reglas de uso

| Situación | Variant | Surface |
|---|---|---|
| Quote narrativo de cliente/caso, fluye en sección dark | `testimonial` | `dark` |
| Frase titular de sección, standalone, centrada | `manifesto` | `warm` |

---

## Cuando agregar un tercer variant

Si aparece un nuevo quote design en páginas internas (/metodo, /cerebro-marca) que no encaja en ninguno de los dos, crear `variant="statement"` o similar. NO modificar testimonial ni manifesto para evitar regresiones.

---

## Tokens consumidos

- Testimonial dark: `--bbf-surface-dark-elevated`, `--bbf-border-on-dark-surface`, `--bbf-text-on-dark-surface*`
- Manifesto warm: `--bbf-surface-warm-elevated`, `--bbf-border-on-warm`, `--bbf-text-on-warm*`, `--bbf-typography-display-section-h2-*`
- Gradient textSoft: `.bbf-text-gradient-red-animated` (gradient-animations.css)

---

## CSS: quote-block.css

Tier 3 component CSS en `src/styles/tokens/components/quote-block.css`.
Importado en globals.css después de case-section.css.
