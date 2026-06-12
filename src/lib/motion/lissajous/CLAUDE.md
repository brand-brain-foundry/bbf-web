# CLAUDE.md — src/lib/motion/lissajous/

**Lissajous motion system canon BBF — registry + motors**

> Lee antes de agregar, modificar o llamar variantes Lissajous.
> D-DS-06 (2026-06-12): registry es SSOT canónico. 17 variantes (6 3D + 11 2D).

---

## Estructura

```
lib/motion/lissajous/
├── CLAUDE.md          Este archivo
├── index.ts           Barrel export (registry + types + helpers)
├── registry.ts        LISSAJOUS_REGISTRY — catálogo canon de 17 variantes
├── types.ts           LissajousName union + interfaces
├── math.ts            Motor matemático (sin estado)
├── 2d/                Motor 2D (canvas/SVG rendering)
└── 3d/                Motor 3D (Three.js rendering)
```

---

## Registry — SSOT canónico (D-DS-06)

`LISSAJOUS_REGISTRY` en `registry.ts` es la fuente única de verdad.
Toda variante que se use en producción **debe estar en el registry**.

### 17 variantes registradas

**3D (6 variantes):**
| Nombre | a:b:c | Descripción |
|---|---|---|
| `trefoil-3d` | 3:2:1 | Trefoil knot clásico |
| `pretzel-3d` | 5:3:2 | Pretzel tridimensional |
| `toroidal-3d` | 4:3:2 | Toroidal |
| `wave-3d` | 1:2:3 | Ola 3D |
| `ring-3d` | 1:1:1 | Anillo inclinado |
| `dense-3d` | 7:5:3 | Denso complejo |

**2D (11 variantes):**
| Nombre | a:b | Contexto de uso |
|---|---|---|
| `trefoil-2d` | 3:2 | General |
| `pretzel-2d` | 5:3 | General |
| `wave-2d` | 1:2 | General |
| `ring-2d` | 1:1 | Círculo |
| `dense-2d` | 7:5 | General |
| `figure8-2d` | 1:2 δ=π/2 | Lab, lemniscata |
| `process-2d` | 5:4 δ=π/4 | General proceso |
| `case-2d` | 3:4 δ=π/3 | §3 CaseSection |
| `comparison-2d` | 5:6 δ=π/6 | §4 PorqueSection comparación |
| `cross-2d` | 5:3 δ=π/4 | §4 PorqueSection |
| `metodo-2d` | 2:3 δ=π/2 | §5 MetodoSection |

---

## Uso canónico

```tsx
import { Lissajous } from '@/components/atoms/Lissajous';

// Basic
<Lissajous name="figure8-2d" animation="traveling" />

// Con opciones runtime
<Lissajous name="metodo-2d" animation="traveling" numNodes={80} />
```

---

## Cómo agregar nueva variante

1. Añadir entrada al `LISSAJOUS_REGISTRY` en `registry.ts`:
   ```ts
   'nueva-2d': {
     name: 'nueva-2d',
     dimension: '2d',
     preset: { a: 3, b: 5, delta: Math.PI / 3 },
     defaultLabel: '3:5 Nueva 2D',
   },
   ```
2. Añadir el nombre al union `LissajousName` en `types.ts`
3. Si es section-specific: añadir comentario indicando el contexto
4. Si es Payload-persisted: crear migración `pnpm payload migrate:create <nombre>`

---

## D-DS-06 — Estado (2026-06-12)

El audit AUD-15 detectó que `case-2d`, `cross-2d`, `metodo-2d` eran "section-specific".
Al ejecutar D-DS-06, se confirmó que **ya estaban en el registry y en LissajousName**.
Acción ejecutada: este CLAUDE.md documenta el estado canónico.

---

## Decisiones aplicables

- **D-BBF-WEB-QQ** Lissajous como sistema de iconos dinámicos
- **D-DS-06** (2026-06-12): registry es SSOT, section presets en registry
- **TD-LIS-01**: Lissajous point-traveling mode diferido — ver memory project_td_lis_01.md
