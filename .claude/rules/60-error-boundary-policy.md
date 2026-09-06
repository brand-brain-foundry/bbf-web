---
description: Error Boundary para componentes cliente con APIs de navegador riesgosas (WebGL/canvas/getContext/media). Formaliza L-34 — un componente decorativo jamás tumba el sitio. Cierra HAL-SBWEB-CLIENT-COMPONENT-NO-BOUNDARY-01.
globs: ["src/components/**"]
alwaysApply: false
---

# Regla 60 — Error Boundary Policy (componentes cliente riesgosos)

> Formaliza `L-34` (hub `shared/LECCIONES.md`): un componente decorativo/cliente jamás debe
> poder tumbar el sitio. Cierra `HAL-SBWEB-CLIENT-COMPONENT-NO-BOUNDARY-01`.
> **Mecanismo, no un lint** — ver §3 por qué.

## 1 — El patrón obligatorio

Todo componente **cliente** (`'use client'`) que toca una API de navegador con superficie de
fallo real en dispositivos/navegadores reales — WebGL, `canvas`/`getContext`, media
(audio/video/`getUserMedia`), o cualquier API dependiente de GPU/driver/hardware — nace con
las 3 piezas juntas, nunca solo una:

1. **Error Boundary de React** (class component) envolviendo el widget.
2. **Fallback degradado por token** — `var(--bbf-...)` vía className/CSS, **nunca hardcode**
   (guardia de color, regla 40).
3. **try/catch en la carga/init async** — los Error Boundary de React **no capturan errores
   async** (promesas, `useEffect`, callbacks, `<script>` lazy). Ese try/catch va aparte, en
   cada punto de contacto real con la API del navegador (no en el boundary).

Si falta cualquiera de las 3, el widget puede tumbar el sitio entero por un adorno — exactamente
el incidente que originó esta regla (PR#24, `L-34`).

## 2 — El molde (copiar, no reinventar)

Dos boundaries ya construidos siguen el mismo patrón — cópialo:

- `src/components/atoms/BrandGradientBackground/BrandGradientBackgroundBoundary.tsx`
- `src/components/atoms/BlobBackground/BlobBackgroundBoundary.tsx`

Forma: `class extends Component` con `getDerivedStateFromError` (marca `hasError`) +
`componentDidCatch` (log a consola, describe qué motor falló) + `render()` que devuelve el
fallback por token si `hasError`, o `children` si no.

**No crees una librería/abstracción de boundary genérica mientras sean solo 2 casos** (L-98 —
sin abstracción prematura). Cuando exista un 3er widget riesgoso no-blob, se extrae un boundary
genérico compartido — no antes.

## 3 — Por qué no un lint

Un lint que detecte `getContext`/`canvas`/WebGL y exija boundary da falsos negativos (no puede
seguir el árbol de imports para saber si el consumidor ya está envuelto, como
`CierreSection.tsx` con `BlobBackgroundBoundary`) y falsos positivos (un `canvas` 2D trivial sin
riesgo real). Ningún líder de industria (React docs, Sentry, Messenger) lo hace así en 2026. La
red de layout (§4) da la garantía determinista que un lint intentaría dar, sin el ruido.

## 4 — La red de layout nativa de Next (el respaldo, no el mecanismo primario)

Cualquier error de render que se escape de un boundary de widget cae en la red nativa de
Next.js App Router (regla 20):

- `src/app/(frontend)/[locale]/error.tsx` — boundary por segmento de ruta.
- `src/app/global-error.tsx` — boundary root; reemplaza el layout raíz COMPLETO cuando un error
  escapa hasta ahí (spec Next: define su propio `<html>/<body>`, re-declara fuentes y
  `globals.css` porque nada del árbol normal está disponible).

Esta red es la última malla — no sustituye el boundary por-widget de §1, es el respaldo si algo
se escapa igual.

## 5 — Cuándo NO aplica

- Server Components (RSC) — no tienen este modo de fallo.
- Componentes cliente triviales sin API de navegador riesgosa (forms controlados, toggles,
  dropdowns, etc.).
- Un `canvas` 2D trivial sin dependencia de GPU/driver y sin historial de fallo real — no
  sobre-granularices. No es "un boundary por componente"; es un boundary por **widget
  riesgoso conocido**, más la red de layout como respaldo universal.

## 6 — Antes de escribir un componente cliente nuevo con API de navegador riesgosa

1. ¿Ya hay un boundary del mismo widget en otro punto del árbol? No dupliques — envuelve una
   sola vez, cerca del punto de uso (mismo patrón que `CierreSection.tsx` con `BlobBackground`).
2. Si no existe: copia el molde de §2, ajusta el mensaje de `componentDidCatch` y el fallback
   visual al widget concreto.
3. Verifica que el punto de contacto async con la API del navegador tiene su propio try/catch
   — el boundary solo cubre errores síncronos de render.
4. Si dudas si el riesgo es real (API nueva, sin precedente de fallo) — para y consulta a
   Zavala vía `feedback.md` en vez de improvisar el criterio.
