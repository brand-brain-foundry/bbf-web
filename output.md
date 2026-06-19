# HOME FASE 4 — HERO auditoría completa
> Despacho B-BBF-WEB-HOME-FASE4-HERO-AUDIT · 2026-06-19
> HEAD base: 89f21af · NO push

---

## PASO 0.5 — Fix topic #7 EN

**Causa raíz:** `seed-knows-about.ts` actualizó `name` solo en el locale DEFAULT (es). El campo
`name` en Topics es `localized: true` → el EN locale tenía el valor anterior de una creación
previa: "Brand voice consistency" (sin "at scale").

**Acción:** Creado `src/scripts/fix-topic7-en.ts` — update puntual con `locale: 'en'` en
topic `brand-voice-consistency`. Script corriendo. Verificación HTML EN: ver sección abajo.

**Fix raíz en seed:** `seed-knows-about.ts` debería también pasar `locale: 'en'` en cada update
para que re-runs sean idempotentes en ambos locales. Quedará como ítem de Wave 13.

---

## CAPA 1 — ADMIN (campos del Hero en SiteHomepage)

### Inventario de campos (`SiteHomepage.ts` → `hero` group)

| # | Campo | Tipo | Localized | Hallazgo |
|---|---|---|---|---|
| 1 | `h1Line1` | text | ✅ | ÚNICO-OK — primera línea H1, ES+EN |
| 2 | `h1Line2Soft` | text | ✅ | ÚNICO-OK — segunda línea H1 muted |
| 3 | `ledeBody` | textarea (max 280) | ✅ | ÚNICO-OK — párrafo principal |
| 4 | `ledeEmphasis` | text | ✅ | ÚNICO-OK — frase énfasis primaria |
| 5 | `ctaPrimary.label` | text | ✅ | ÚNICO-OK* ver nota |
| 6 | `ctaPrimary.href` | text | ❌ | `#proceso` — no localized OK (anchor) |
| 7 | `ctaSecondary.label` | text | ✅ | ÚNICO-OK* ver nota |
| 8 | `ctaSecondary.href` | text | ❌ | `#metodo` — no localized OK (anchor) |
| 9 | `media.chromeLabel` | text | ❌ | Sintético/decorativo, no localized intencional |
| 10 | `media.videoPoster` | upload → Media | n/a | YA-REFERENCIA ✅ Media collection |
| 11 | `media.videoSources[].src` | **text** | ❌ | ⚠️ GAP: debería ser upload → Media |
| 12 | `media.videoSources[].type` | select | n/a | OK — 6 codec options |
| 13 | `media.demoLabel` | text | ✅ | ÚNICO-OK |
| 14 | `media.footCaption` | textarea | ✅ | ÚNICO-OK |
| 15 | `ticker` | array | ✅ (array-level) | ÚNICO-OK — min 4 max 12 items |

*CTAs: `SiteCtaLibrary` global existe (D-DS-18, D-NAV-11) pero los CTAs del Hero son
anchors de página (`#proceso`, `#metodo`) — homepage-específicos, NO cross-site. ÚNICO-OK
para esta etapa. Si en Fase 4 se decide vincularlos a CtaLibrary: decisión firmada.

### Hallazgos CAPA 1

**H1-ADMIN-01** — `media.videoSources[].src` es `type: 'text'` en lugar de `upload → media`.
Los videos del Hero se referencian por path string (`/assets/media/hero/hero.av1.webm`), no
como assets administrados en la colección Media. El poster sí usa upload correctamente.
Consecuencia: el video no aparece en Media admin, no tiene metadata (alt, title, filesize),
no puede gestionarse desde el CMS. **Deuda: migrar a upload → media o type: 'upload' en el
array con `relationTo: 'media'`.**

**H1-ADMIN-02** — Organización visual del grupo `hero`: 15 campos en un grupo plano. Sin
tabs o collapsible groups. Para una edición fluida del Hero en admin, convendría separar:
editorial (h1, lede, CTAs) / media (video, poster) / ticker. No crítico pero mejora UX del
CMS.

**H1-ADMIN-03** — ES+EN: todos los campos `localized: true` tienen contenido. Verificado
por el HTML servido (FAQPage, WebPage, Organization con nombres en ambos locales). ✅

---

## CAPA 2 — OPTIMIZACIÓN INTEGRAL

### Assets del Hero

| Asset | Existe | Optimización | Hallazgo |
|---|---|---|---|
| `hero.av1.webm` (VP9 real) | ✅ | — | OK. Nota: codec real VP9, tipo declarado webm-vp9 ✅ |
| `hero.h264.mp4` | ✅ | — | Fallback H.264 OK |
| `hero-poster.jpg` | ❌ MISSING | — | TD-M5-D3-01 pendiente. Sin poster → usuario ve video sin frame inicial |
| Video width/height attrs | — | aspect-ratio CSS | `.bbf-hero__video-shell { aspect-ratio: 16/9 }` ✅ |
| Versión mobile del video | ❌ | — | Un solo video para todas las resoluciones. Sin `<source media="...">` |
| `preload` | — | `"metadata"` | ✅ No carga video completo hasta interacción |

### SEO/IA del Hero

| Check | Estado | Hallazgo |
|---|---|---|
| H1 content | ✅ | Viene de `hero.h1Line1` + `h1Line2Soft` localized — correcto |
| H1 canon match SEO-AEO | ? | Verificar contra ContentMaster — fuera de scope de esta auditoría |
| TP-HERO-ANCHOR | ⏳ | Frase ancla §1.9 diferida a Fase 4. FAQPage (hero Q&A) ya activo ✅ |
| `aria-label` en video | ⚠️ | `ariaLabel` NO pasado → `aria-hidden=true` en `<video>`. Pero el video tiene `controls` → un video con controles Y aria-hidden es problemático: screen readers no anuncian el video |
| Video aria correcto | ❌ | Si tiene `controls`, debe tener `aria-label` o `aria-describedby`. Hoy: decorativo (aria-hidden) + controls = conflicto accesibilidad |
| Ticker aria | ? | HeroTicker no auditado en profundidad (marquee sin stop mechanism = WCAG 2.2.2 potencial) |

**H2-OPT-01** — `aria-hidden={true}` + `controls={true}` en el mismo video es
contradictorio. Si el video es decorativo → no debería tener controles. Si tiene controles →
el usuario puede interactuar → necesita aria-label. Deuda: quitar `controls` (background video)
O agregar `ariaLabel` (foreground video).

**H2-OPT-02** — Poster del video FALTA. TD-M5-D3-01 pendiente desde Wave 5. Sin poster,
hay flash de black/placeholder antes de que cargue el video. Afecta LCP en mobile.

**H2-OPT-03** — No hay versión mobile del video. El video 16:9 se recorta en mobile con
`object-fit: cover`. Aceptable por ahora, pero impacta performance (descarga full video en
mobile). A considerar en Fase 4.

---

## CAPA 3 — DESIGN SYSTEM (código agnóstico)

### Grep de valores arbitrarios/hardcodeados en Hero CSS

**`home-hero.css`** (Claude Design migration):

| Línea/Selector | Valor | Veredicto |
|---|---|---|
| `.bbf-hero` padding-top | `clamp(96px, 11vw, 132px)` | ⚠️ No usa tokens `--bbf-hero-padding-*` |
| `.bbf-hero` padding-bottom | `clamp(48px, 6vw, 96px)` | ⚠️ No usa tokens |
| `.bbf-hero::before` opacity | `0.4` | ⚠️ Literal — podría ser token de opacidad |
| `.bbf-hero__grid` gap | `clamp(28px, 3.5vw, 48px)` | ⚠️ Duplica `heroSectionGridVariants` |
| `.bbf-hero__head` gap | `clamp(32px, 6vw, 96px)` | ⚠️ Duplica `heroSectionGridVariants` |
| `.bbf-hero__media-chrome` padding | `12px 16px` | ⚠️ Literal — debería `var(--bbf-space-*)` |
| `.bbf-hero__rec-dot` size | `width: 6px; height: 6px` | Aceptable (decorativo 6px) |
| `.bbf-hero__ticker` padding-block | `12px` | ⚠️ Literal (= 1.5× 8pt, no canónico) |
| `.bbf-hero__ticker-track` gap | `36px` | ⚠️ 36px NO está en 8pt grid (32/40 serían los canónicos) |
| `.bbf-hero__ticker-track` animation | `50s linear` | Podría ser token de duration |
| `.bbf-hero__video-empty-mark` size | `56px × 56px` | ⚠️ Fuera de escala (48/64 serían canónicos) |
| `.bbf-hero__video-empty-msg` line-height | `1.5` | ⚠️ Debería `var(--bbf-leading-*)` |

**`hero.css`** (tokens canon original):
- Espaciado: todos via `var(--bbf-space-*)` ✅
- Tamaños logo: `clamp()` documentado ✅
- Motion: via tokens semánticos `--bbf-motion-*/--bbf-easing-*` ✅

### Duplicación CSS: `hero.css` vs `home-hero.css`

Hay dos archivos CSS para el Hero:
- `hero.css` — tokens + classes originales (bbf-cta-pill, hero-entrance)
- `home-hero.css` — styles de la migración Claude Design (bbf-hero, bbf-hero__*)

`home-hero.css` reimplementa algunos conceptos que ya existen como tokens en `hero.css`
(padding, gap) sin referenciarlos. Viola C-01 (fuente única). `home-hero.css` NO está
importado en `globals.css` (solo `hero.css` y `hero-section.css` están). Verificar si
`home-hero.css` está siendo usado realmente (puede ser dead code o importado desde page.tsx).

### ⚠️ HALLAZGO CRÍTICO — Surface intercambiable

**Pregunta clave del despacho: ¿dark + blob = atributo o refactor?**

**Respuesta: REFACTOR.**

Cadena completa:

1. **HeroSection CVA** TIENE `surface: { dark: 'bg-[var(--bbf-surface-black)]' }` ✅
   → El background CVA PUEDE cambiar a negro por atributo.

2. **PERO `hero.css`** tiene:
   ```css
   [data-component='bbf-hero-section'] {
     background: var(--bbf-surface-hero); /* #ebe3d4 — sand deep shade */
   }
   ```
   Este selector tiene IGUAL especificidad que Tailwind utilities y aparece DESPUÉS en el
   cascada → OVERRIDES el background de CVA. Con la configuración actual, `surface="dark"` en
   el `<HeroSection>` NO cambia el color de fondo porque `hero.css` lo sobreescribe con
   `--bbf-surface-hero` (arena).

3. **`home-hero.css`** usa tokens warm en todo el contenido:
   - `.bbf-hero__title { color: var(--bbf-text-on-warm) }` — NO dark-aware
   - `.bbf-hero__media-chrome { background: var(--bbf-surface-warm-base) }` — NO dark-aware
   - `.bbf-hero__ticker { background: var(--bbf-surface-warm-base) }` — NO dark-aware
   - Todas las borders: `var(--bbf-border-on-warm)` — NO dark-aware
   → Si el fondo cambia a negro, el texto/borders seguirán siendo warm color sobre negro.

4. **BlobBackground** (D-BLOB-01 ✅) NO está conectado al Hero. Montarlo requiere:
   integrar el canvas 3D como child de HeroSection o como background layer absoluto.

**Qué requiere el refactor dark + blob:**
- Eliminar o condicionalar `[data-component='bbf-hero-section'] { background }` en `hero.css`
- Reescribir content classes en `home-hero.css` con selectors `[data-surface="dark"] .bbf-hero__*`
  usando tokens dark-on en lugar de warm-on
- Crear o mapear tokens `--bbf-text-on-dark`, `--bbf-border-on-dark`, `--bbf-surface-dark-*`
  equivalentes a los warm tokens (si no existen en semantic/colors.css)
- Integrar BlobBackground como child de HeroSection (posición absoluta, z=0)
- Validar pixelwise

**Estimación de alcance:** 3-4 archivos CSS + 1 componente (page.tsx Hero block).
No es refactor mayor, pero tampoco es solo un atributo.

### Tokens en componentes Hero

**`HeroSection.tsx`:** cero inline styles. CVA limpio. ✅
**`HeroVideo.tsx`:** un inline style residual:
```tsx
style={{ objectFit: 'var(--bbf-hero-video-object-fit, cover)' as 'cover' }}
```
Justificado (Tailwind v4 no soporta bien `object-fit: var(...)` arbitrary). Aceptable con nota.

**Tipografía del Hero:**
```css
.bbf-hero__title {
  font-size: var(--bbf-text-display-hero);     ✅
  font-weight: var(--bbf-weight-medium);        ✅
  line-height: var(--bbf-typography-display-hero-leading); ✅
  letter-spacing: var(--bbf-typography-display-hero-tracking); ✅
  font-family: var(--bbf-font-display);         ✅
}
```
Tipografía completamente tokenizada. ✅

### HERO_STATE.md

❌ No existe. Parte del cierre de Fase 4 será crearlo.

---

## VEREDICTO

### Por capa

| Capa | Estado | Deuda |
|---|---|---|
| CAPA 1 — Admin | ⚠️ Bien pero con gaps | H1-ADMIN-01 (video src como text), H1-ADMIN-02 (UX admin plano) |
| CAPA 2 — Optimización | ⚠️ Funcional, deuda knowable | H2-OPT-01 (aria conflict), H2-OPT-02 (poster missing), H2-OPT-03 (no mobile video) |
| CAPA 3 — Design System | ⚠️ Parcialmente sistémico | H3-DS-01 (surface hardcoded), H3-DS-02 (tokens warm hardcoded), H3-DS-03 (literals en home-hero.css) |

### Mapa de corrección (NO ejecutado — Fase 4 Hero build)

**Prioridad P0 (bloqueantes para dark+blob):**
- H3-DS-01: Quitar/condicionalar override de background en `hero.css`
- H3-DS-02: Reescribir `home-hero.css` con selectors surface-aware
- H3-DS-03: Tokenizar literales de `home-hero.css` (12px→space-3, 36px→space-9 o space-10)

**Prioridad P1 (deuda inmediata):**
- H2-OPT-01: Resolver aria conflict (`controls` vs `aria-hidden`)
- H1-ADMIN-01: Migrar `videoSources[].src` de text a upload/relation Media
- H2-OPT-02: Crear poster del video (depende de asset Zavala)

**Prioridad P2 (mejoras):**
- H2-OPT-03: Video mobile-specific (source con media query)
- H1-ADMIN-02: Organizar admin Hero en grupos visuales
- TP-HERO-ANCHOR: Agregar `<p>` frase ancla §1.9 visible
- Crear HERO_STATE.md al cierre del Hero block

### Respuesta clave: ¿dark + blob = atributo o refactor?

> **REFACTOR.** La estructura de componentes (HeroSection CVA) permite el cambio de surface
> como atributo, pero el CSS de contenido (`home-hero.css`) y el override en `hero.css`
> están hardcodeados al warm surface. El blob (D-BLOB-01) existe como componente pero no
> está conectado. Para llegar al Hero negro + blob se requiere reescribir los estilos de
> contenido con selectores `[data-surface="dark"]` y eliminar el override de background.
> Alcance: ~3-4 archivos CSS + integración del blob en page.tsx. No es mayor.

---

## PASO 0.5 — Verificación EN HTML (topic #7) ✅

Script corrió con exit 0. Topic id=9, EN name actualizado a "Brand voice consistency at scale".
HTML EN verificado post-update (cache refrescado automáticamente):

```json
"knowsAbout": [
  "Brand intelligence systems",
  "Brand operating systems",
  "Brand brain construction and operation",
  "Multi-channel brand orchestration",
  "Conversational brand agents",
  "Brand content automation",
  "Brand voice consistency at scale",   ← CORREGIDO ✅
  "Proprietary brand AI",
  "Brand memory systems",
  "B2B brand operationalization"
]
```

ES y EN ahora idénticos en topic #7. D-FASE3B-KNOWS-01 completamente alineado.

---

## Tablas de referencia (Desktop + Mobile)

### Desktop

| Componente | Estructura | Tokens | Surface | Arbitrario |
|---|---|---|---|---|
| HeroSection root | CVA surface×height | bbf-surface-* | ✅ via data-surface | override en hero.css |
| HeroSection.Content | CVA align | Tailwind utilities | no aplica | — |
| HeroSection.Grid | CVA cols | clamp() inline | no aplica | gap: clamp(28px...) |
| .bbf-hero layout | CSS clamp grid | parcial | ❌ warm hardcoded | padding clamp sin token |
| .bbf-hero__title | CSS | ✅ todos tokens | ❌ --bbf-text-on-warm | — |
| .bbf-hero__media | CSS | ✅ border token | ❌ --bbf-border-on-warm | padding 12px literal |
| .bbf-hero__ticker | CSS | parcial | ❌ --bbf-surface-warm-base | 36px gap, 12px padding |
| HeroVideo | CVA fit | custom prop | no aplica | objectFit inline style |

### Mobile (≤920px)

| Componente | Comportamiento | Estado |
|---|---|---|
| .bbf-hero__head | 2-col → 1-col a 920px | ✅ media query en home-hero.css |
| .bbf-hero__head gap | 24px (var(--bbf-space-6)) | ✅ usa token |
| Video | object-fit: cover | OK — se recorta verticalmente |
| Ticker | overflow: hidden + marquee 50s | OK |
| HeroSection height | min-h-screen (CVA default) | OK |
| Video poster | MISSING | ⚠️ LCP impact en mobile |
