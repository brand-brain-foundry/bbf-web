# BBF Brand Logos

Sistema canónico de logos Brand Brain Foundry.

**Subordinado a:** M5-D1.5 LOGO-SYSTEM
**Atom:** `src/components/atoms/BBFLogo/`

## Archivos

| Archivo | Variante atom | Uso típico |
|---------|---------------|------------|
| `BBF-Logo-Icon.svg` | `variant="icon"` | Solo flor 8-petal. Favicons, márgenes pequeños |
| `BBF-Logo-Name-H.svg` | `variant="horizontal"` o `name-only` | Nombre horizontal. Header, footer, cards |
| `BBF-Logo-Name-Circle.svg` | `variant="stamp"` | Nombre circular. Vive SOLO dentro de stamp |
| `BBF-Logo-Stamp.svg.legacy` | Legacy preservado | Backup durante transición M5-D1.5 |

## Reglas canon

1. **Sin colors hardcoded** — atom hereda color via `currentColor` (D-BBF-WEB-77)
2. **Sin width/height en `<svg>` raíz** — solo viewBox (responsive)
3. **IDs preservables** — para CSS animation y querySelector
4. **Proporción interna preservada** por variante (icon 1:1, horizontal auto)

## Uso en código

```tsx
import { BBFLogo } from '@/components/atoms/BBFLogo';

<BBFLogo variant="icon" size="md" />
<BBFLogo variant="horizontal" size="md" />
<BBFLogo variant="name-only" size="sm" />
<BBFLogo variant="stamp" size="hero" animated />  // Hero canon
```

## Variantes en producción

- **Hero (página home):** `variant="stamp" size="hero" animated`
- **Header (M6+):** `variant="horizontal" size="md"`
- **Footer (M6+):** `variant="name-only" size="sm"`
- **OG images (M6+):** `variant="icon"` o `variant="stamp"` size="xl"

## NO hacer

- ❌ NO crear variantes con color en el nombre (`-Black`, `-Blue`)
- ❌ NO usar `Logo-Name-Circle.svg` aislado (solo dentro de stamp)
- ❌ NO modificar IDs sin actualizar CSS animations
- ❌ NO duplicar logos para diferentes contextos (usar variants)
