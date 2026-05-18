# CLAUDE.md — HeroVideo

**Hero video molecule canon BBF — compound pattern con Source + Overlay**

> Tier: molecule
> Subordinado a: B-BBF-WEB-M5-D3-HEROVIDEO
> Decisiones: D-79 (compound), D-82 (AI-readable), D-86 (compound API), D-87 (assets path), D-96 (CSSProperties)

---

## API

### HeroVideo (root)

```typescript
interface HeroVideoProps extends HeroVideoVariants {
  poster?: string;              // path: /assets/media/hero/hero-poster.jpg
  autoplay?: boolean;           // default: false
  muted?: boolean;              // default: false
  loop?: boolean;               // default: false
  playsInline?: boolean;        // default: true
  preload?: 'none' | 'metadata' | 'auto'; // default: 'metadata'
  ariaLabel?: string;           // si omitido → aria-hidden=true (decorativo)
  className?: string;
  children: ReactNode;          // HeroVideo.Source + HeroVideo.Overlay
}
```

### HeroVideo.Source

```typescript
interface HeroVideoSourceProps {
  src: string;
  type: 'webm-vp9' | 'webm-av1' | 'mp4-h264' | 'mp4-h265' | 'mp4-av1' | 'mov';
}
```

### HeroVideo.Overlay

```typescript
interface HeroVideoOverlayProps extends HeroVideoOverlayVariants {
  opacity?: number;   // override 0..1
  color?: string;     // solo con tone='custom'
  className?: string;
}
```

### Variants (CVA)

**HeroVideo (root):**
- **fit:** `cover` | `contain` | `fill`

**HeroVideo.Overlay:**
- **tone:** `none` | `dark` | `light` | `custom`

### Defaults

- fit: `cover`
- overlay tone: `none` (opcional — si tone=none y sin opacity/color, no renderiza)

---

## Pattern canon

- **Server/Client:** Server (HTML video element nativo, sin state)
- **Surface-aware:** No (es contexto de fondo)
- **Composition:** **Compound** (D-86) — `HeroVideo.Source` + `HeroVideo.Overlay`
- **AI-readable:** `data-component="bbf-hero-video"` + Source `data-source-type` ✓

---

## MIME map canon

```typescript
'webm-vp9'  → 'video/webm; codecs="vp9"'
'webm-av1'  → 'video/webm; codecs="av01.0.05M.08"'
'mp4-h264'  → 'video/mp4; codecs="avc1.4D401E,mp4a.40.2"'
'mp4-h265'  → 'video/mp4; codecs="hvc1"'
'mp4-av1'   → 'video/mp4; codecs="av01.0.05M.08,mp4a.40.2"'
'mov'       → 'video/quicktime'
```

**Nota:** hero.av1.webm actual usa codec VP9 (encoder fnord plugin Premiere 2026) → usar `type="webm-vp9"`.

---

## Assets canon (D-87)

```
public/assets/media/
├── hero/
│   ├── hero.av1.webm     (codec real: VP9)
│   ├── hero.h264.mp4
│   └── hero-poster.jpg   (TD-M5-D3-01: pendiente crear en M6+)
```

---

## Tokens canon usados

```css
--bbf-hero-video-object-fit    /* custom prop via CVA fit variant */
```

Overlay usa Tailwind gradients directos (no tokens).

CSSProperties canon (D-96):
```typescript
import type { CSSProperties } from 'react'; // NO React.CSSProperties
```

---

## Decisiones aplicables

- **D-79** Compound API (Source/Overlay son contenidos distintos)
- **D-82** AI-readable canon
- **D-86** Molecules compound pattern
- **D-87** Assets migration canon (path en public/assets/media/)
- **D-96** `import type { CSSProperties } from 'react'` canon (NO namespace)

---

## Lecciones canon BBF

- **L-95** Primitives vs Semantic separation
- **L-98** Foundations cuando ≥3 casos justifican

---

## Ejemplos canon

### Hero con múltiples formatos

```tsx
import { HeroVideo } from '@/components/molecules/HeroVideo';

<HeroVideo autoplay muted loop poster="/assets/media/hero/hero-poster.jpg">
  <HeroVideo.Source src="/assets/media/hero/hero.av1.webm" type="webm-vp9" />
  <HeroVideo.Source src="/assets/media/hero/hero.h264.mp4" type="mp4-h264" />
</HeroVideo>
```

### Con overlay dark

```tsx
<HeroVideo autoplay muted loop>
  <HeroVideo.Source src="..." type="webm-vp9" />
  <HeroVideo.Source src="..." type="mp4-h264" />
  <HeroVideo.Overlay tone="dark" />
</HeroVideo>
```

### Overlay opacity custom

```tsx
<HeroVideo.Overlay tone="custom" color="rgba(0,0,0,0.4)" opacity={0.6} />
```

---

## NO usar

- `HeroVideo` sin `HeroVideo.Source` (no funciona)
- `type="mp4"` string libre — usar type map canon
- `React.CSSProperties` — usar `import type { CSSProperties } from 'react'` (D-96)
- `autoplay` sin `muted` (browsers bloquean autoplay con audio)
- Video en rutas fuera de `public/assets/media/` (D-87)

---

## Files

- `HeroVideo.tsx` — Server Component compound (Root + Source + Overlay)
- `HeroVideo.variants.ts` — 2 CVAs: root (fit) + overlay (tone)
- `index.ts` — Barrel export

---

## Cómo modificar

1. Nuevo formato → agregar al `SOURCE_TYPE_MAP` canon
2. Nuevo overlay tone → CVA `heroVideoOverlayVariants`
3. Si necesita controls UI interactivos → escalar a Strategic (Client wrap pattern)
4. Actualizar este CLAUDE.md si cambia API
