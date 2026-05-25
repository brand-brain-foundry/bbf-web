# BBF Motion Library

**Brand Brain Foundry — Motion library canon. Wave 11.8+**

## Estructura

```
src/lib/motion/
├── hooks/             ← React hooks motion canon (Wave 11.8-E)
│   └── useReveal.ts  ← Scroll-triggered reveal (useInView wrapper)
└── lissajous/         ← Sistema de iconos animados Lissajous (D-BBF-WEB-QQ)
    ├── types.ts       ← Types compartidos
    ├── math.ts        ← Pure math funcs (sin DOM)
    ├── registry.ts    ← Catálogo de variantes name-callable
    ├── 2d/            ← Motor 2D SVG
    └── 3d/            ← Motor 3D Three.js
```

## Hooks

### useReveal

Scroll-triggered visibility hook. Wraps Framer Motion `useInView` con defaults BBF.

```tsx
import { useReveal } from '@/lib/motion/hooks';

const { ref, isVisible } = useReveal({
  once: true,              // trigger once (default)
  margin: '0px 0px -80px 0px',  // 80px before bottom edge
  amount: 'some',          // any part visible triggers
});

<motion.div ref={ref} animate={isVisible ? 'visible' : 'hidden'} />
```

Preferred: use `<Reveal>` atom (`src/components/atoms/Reveal`) which wraps this hook.

```tsx
import { Reveal } from '@/components/atoms/Reveal';

<Reveal variant="up" delay={100}>
  <Card />
</Reveal>

<Reveal staggerChildren variant="up">
  <Card />  <Card />  <Card />  // each child staggers 60ms
</Reveal>
```

## Usage

```tsx
import { Lissajous } from '@/components/atoms/Lissajous';

<Lissajous name="trefoil-3d" />
<Lissajous name="dense-2d" />
<Lissajous name="trefoil-3d" speed={1.5} />
```

## Variantes disponibles

Ver `src/lib/motion/lissajous/registry.ts` para catálogo completo. Llamables por nombre via type `LissajousName`.

## Default transparent

Todas las variantes son **transparent default** (D-BBF-WEB-QQ §5.1). Adoptan la surface debajo. Cuando emerja necesidad de background, ver TD-11-79 (futuro `<MotionBackground>` module).

## Accessibility

`prefers-reduced-motion` respected per WCAG 2.3.3 (Level AAA). Fallback estático SVG cuando reduced motion activo.

## Referencias

- **`BBF_MotionCanon_v1_0.md`** — Canon doctrinal BBF Motion v1.0 (SIGNED 2026-05-25) — fuente de verdad
- `D-BBF-WEB-MM` Motion lenguaje canon
- `D-BBF-WEB-NN` Fondo negro plano default
- `D-BBF-WEB-OO` Source preservation policy
- `D-BBF-WEB-PP` Stack motion canon
- `D-BBF-WEB-QQ` Lissajous como sistema iconos
- `BBF_MotionArchitectureProposal_v1.md`
- `R-BBF-15_MotionTrends2026.md`
