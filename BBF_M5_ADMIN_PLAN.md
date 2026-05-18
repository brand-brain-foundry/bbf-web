# BBF_M5_ADMIN_PLAN.md

**Plan implementación M5-ADMIN-3 canon BBF**

> Subordinado a: B-BBF-WEB-M5-ADMIN-2-AUDIT-PLAN
> Decisiones: D-109 (Admin canon strategy), D-110 (Surface 5 valores)
> Estado: PLAN (no implementado)
> Versión: 1.0 (M5-ADMIN-2, 2026-05-18)

---

## 1. Resumen ejecutivo

M5-ADMIN-3 implementa canon BBF en admin Payload via:
- Custom Logo BBF (`graphics.Logo` + `graphics.Icon`)
- CSS override mapping Payload vars → tokens BBF canon
- Resolver TDs heredadas (identificadas en este plan)

**Filosofía (D-109):**
Admin Payload = INSTANCE de canon BBF, no sistema paralelo.

---

## 2. Audit estado actual (STOP 5 reporte)

### 2.1 Configuration actual

```
payload.config.ts: src/payload.config.ts
Payload version: 3.84.1
@payloadcms/db-postgres: 3.84.1
@payloadcms/next: 3.84.1

admin.components.graphics: NOT SET (sin Logo/Icon personalizado aún)
admin.meta.titleSuffix: ' — BBF Admin'  ← YA CONFIGURADO ✓
admin.css: NO (custom.scss existe pero vacío)
```

### 2.2 (payload)/ structure actual

```
src/app/(payload)/
├── admin/[[...segments]]/page.tsx     Auto-generado
├── admin/[[...segments]]/not-found.tsx  Auto-generado
├── admin/importMap.js                 Auto-generado
├── api/[...slug]/route.ts             Auto-generado
├── layout.tsx                         Auto-generado
├── custom.scss                        EXISTE (vacío — placeholder)
└── CLAUDE.md                          Creado M5-ADMIN-1 ✓

(payload)/components/: NO existe (crear en M5-ADMIN-3)
```

### 2.3 Hardcoded values detectados

```
Hex colors en (payload)/: 0
rgba/rgb en (payload)/: 0
font-size hardcoded: 0
box-shadow hardcoded: 0
```

**Estado limpio** — custom.scss actualmente vacío. Cero hardcoded.

### 2.4 TDs heredadas

TD-M5-C-01, TD-M5-A-07, TD-M5-A-08 — sin referencias encontradas en markdown del repo.
**Análisis:** TDs probablemente documentadas en `bbf-docs` o en contexto previo de sesión.
Resolver en M5-ADMIN-3 cuando Strategic proporcione contexto.

---

## 3. Plan implementación M5-ADMIN-3

### 3.1 Archivos a CREAR

**Logo + Icon admin (D-109):**

```
src/app/(payload)/components/AdminLogo/AdminLogo.tsx
  Server Component que usa BBFLogo atom canon
  variant="horizontal" size="md"
  Exportado desde index.ts

src/app/(payload)/components/AdminIcon/AdminIcon.tsx
  Server Component que usa BBFLogo atom canon
  variant="icon" size="sm" (icon condensado)
  Exportado desde index.ts
```

**CSS override canon BBF:**

```
src/app/(payload)/styles/admin.css
  Map Payload CSS vars → tokens canon BBF
  Sin hardcoded values
  Comments con refs D-109 + D-107
```

### 3.2 Archivos a MODIFICAR

**`src/payload.config.ts`** — sección admin:

```typescript
admin: {
  user: Users.slug,
  importMap: { baseDir: path.resolve(dirname) },
  meta: {
    titleSuffix: ' — BBF Admin',   // ← ya existe ✓
    favicon: '/favicon.ico',
    ogImage: '/og-default.png',    // ← agregar
  },
  components: {
    graphics: {
      Logo: '@/app/(payload)/components/AdminLogo',
      Icon: '@/app/(payload)/components/AdminIcon',
    },
  },
  css: path.resolve(dirname, 'app/(payload)/styles/admin.css'),
}
```

---

## 4. CSS variables mapping canon BBF (D-109 + D-107)

### 4.1 Tokens BBF disponibles (verificados en audit)

```
✓ --bbf-surface-sand              var(--bbf-color-sand-100)
✓ --bbf-surface-sand-elevated     var(--bbf-color-sand-50)
✓ --bbf-surface-white             var(--bbf-color-white)
✓ --bbf-surface-black             var(--bbf-color-black-900)
✓ --bbf-surface-black-elevated    var(--bbf-color-black-800)
✓ --bbf-text-on-light             var(--bbf-color-black-900)
✓ --bbf-text-on-light-secondary   var(--bbf-color-black-600)
✓ --bbf-text-on-light-muted       var(--bbf-color-black-400)
✓ --bbf-text-on-dark              var(--bbf-color-sand-100)
✓ --bbf-accent-red                var(--bbf-color-red-500)
✓ --bbf-accent-red-accessible     var(--bbf-color-red-700)
✓ --bbf-border-on-light           var(--bbf-color-sand-300)
✓ --bbf-border-on-light-strong    var(--bbf-color-sand-400)
✓ --bbf-font-display (Inter)      var(--bbf-font-inter)
✓ --bbf-font-body (Mulish)        var(--bbf-font-mulish)
✓ --bbf-font-code (mono)          var(--bbf-font-mono)
✓ --bbf-space-{N} (8pt grid)
✓ --bbf-shadow-{level}

✗ --bbf-color-success             NO EXISTE → D-111 NUEVA
✗ --bbf-color-error               NO EXISTE → D-111 NUEVA
✗ --bbf-color-warning             NO EXISTE → D-111 NUEVA
✗ --bbf-text-muted                NO EXISTE (usar --bbf-text-on-light-muted)
```

### 4.2 Mapping propuesto admin.css

```css
/* BBF Admin Canon Overrides (D-109) */
/* Map: Payload CSS vars → tokens BBF canon */
/* Sin hardcoded values — todo via var(--bbf-*) */

:root,
[data-theme='light'] {
  /* === Surfaces / Elevation === */
  --theme-elevation-0:     var(--bbf-surface-sand);
  --theme-elevation-50:    var(--bbf-surface-sand-elevated);
  --theme-elevation-100:   var(--bbf-surface-white);
  --theme-elevation-150:   var(--bbf-surface-white);

  /* === Text === */
  --theme-text:            var(--bbf-text-on-light);
  --theme-text-faded:      var(--bbf-text-on-light-secondary);

  /* === Inputs === */
  --theme-input-bg:        var(--bbf-surface-sand-elevated);

  /* === Status (PENDIENTE D-111) === */
  /* --theme-success:      var(--bbf-color-success); */
  /* --theme-error:        var(--bbf-color-error); */
  /* --theme-warning:      var(--bbf-color-warning); */

  /* === Typography === */
  --font-body:             var(--bbf-font-body);    /* Mulish */
  --font-mono:             var(--bbf-font-code);

  /* === Spacing baseline === */
  --theme-baseline:        var(--bbf-space-2); /* 8px */
}
```

**IMPORTANTE:** Variables Payload `--theme-*` no están todas documentadas oficialmente.
Inspeccionar `/admin` con devtools antes de implementar para confirmar qué vars usa Payload 3.84.1.

---

## 5. Strategic decisión requerida antes de M5-ADMIN-3

### D-BBF-WEB-111 NUEVA — Status tokens canon BBF

**Status:** PENDIENTE FIRMA STRATEGIC

**Tokens necesarios:**
- `--bbf-color-success` — verde semántico (éxito, confirmación)
- `--bbf-color-error` — rojo semántico (diferente a --bbf-accent-red)
- `--bbf-color-warning` — amarillo/naranja semántico (alertas)

**Contexto:** Admin Payload usa `--theme-success/error/warning` para feedback UI.
Sin estos tokens canon BBF, el mapping quedará incompleto (Payload usará sus defaults).

**Opciones Strategic:**
1. Crear D-111: nuevos tokens status en `semantic/colors.css`
2. Reusar tokens existentes: error → `--bbf-accent-red-accessible`, success/warning → defer
3. Defer completo a post-M5 (admin funciona con Payload defaults)

---

## 6. Order of operations M5-ADMIN-3

```
STOP 1: Audit pre-execution (verificar HEAD + tsc)
STOP 2: Crear AdminLogo component (BBFLogo atom canon)
STOP 3: Crear AdminIcon component (BBFLogo atom canon)
STOP 4: Crear src/app/(payload)/styles/admin.css (CSS override)
STOP 5: Update src/payload.config.ts admin section (graphics + css)
STOP 6: Verificación typecheck + build
STOP 7: Verificación visual /admin route (devtools inspection)
STOP 8: Resolver TDs heredadas (TD-M5-C-01, A-07, A-08)
STOP 9: Verificación final
STOP 10: Commit + push
```

**Pre-requisito:** Strategic firma D-BBF-WEB-111 (o decide defer).

---

## 7. Verificación canon BBF (checklist M5-ADMIN-3)

### 7.1 Técnico

- [ ] AdminLogo usa BBFLogo atom canon (`variant="horizontal"`)
- [ ] AdminIcon usa BBFLogo atom canon (`variant="icon"`)
- [ ] `data-component="bbf-admin-logo"` en AdminLogo (D-82)
- [ ] admin.css sin hardcoded values (0 hex, 0 rgb, 0 font-size)
- [ ] admin.css usa solo var(--bbf-*) tokens
- [ ] payload.config.ts admin.graphics apunta a componentes correctos
- [ ] tsc exit 0
- [ ] pnpm build exit 0

### 7.2 Visual

- [ ] /admin/login muestra BBFLogo `horizontal` canon
- [ ] /admin dashboard muestra BBFLogo `icon` en sidebar
- [ ] Typography Inter/Mulish en admin
- [ ] Colors sand/dark BBF en admin UI
- [ ] Sin regresiones funcionales Payload (forms, media, collections)
- [ ] Dark mode admin (si Payload 3.84.1 lo incluye) coherente

### 7.3 Doctrinal

- [ ] D-82 AI-readable (data-component en admin components)
- [ ] D-107 Cross-surface (cero tokens duplicados)
- [ ] D-108 Icon registry usado si aplica
- [ ] D-109 Admin canon strategy — 0 sistema design paralelo
- [ ] Atoms canon BBF reused (BBFLogo, no re-implementación)

---

## 8. Riesgos identificados

### 8.1 Payload CSS vars no documentadas (Riesgo: MEDIO)

Payload 3.84.1 puede usar vars internas distintas a `--theme-*`.
**Mitigación:** Inspeccionar devtools en /admin antes de implementar.

### 8.2 Dark mode admin (Riesgo: BAJO)

Payload puede tener `[data-theme='dark']` con sus propias vars.
**Mitigación:** Agregar overrides para dark si existe.

### 8.3 Status tokens ausentes (Riesgo: BAJO)

Si D-111 no se firma, admin usa Payload defaults para success/error/warning.
Funcional pero no canon BBF.

### 8.4 custom.scss vs admin.css (Riesgo: BAJO)

Payload acepta ambos. Evaluar si mover overrides a `styles/admin.css` o mantener en `custom.scss`.
**Recomendación M5-ADMIN-3:** Usar `custom.scss` existente (evitar nueva carpeta si Payload lo soporta).
Verificar que `payload.config.ts` acepta `css:` apuntando a `custom.scss` directamente.

---

## 9. Estimación tiempo M5-ADMIN-3

```
STOP 1 audit:              3 min
STOP 2-3 AdminLogo+Icon:  15 min
STOP 4 admin.css:         20 min (mapping + devtools verification)
STOP 5 payload config:     5 min
STOP 6 typecheck+build:    5 min
STOP 7 visual verify:     15 min (manual /admin + devtools)
STOP 8 TDs:               15 min (si Strategic provee contexto)
STOP 9 final verify:       5 min
STOP 10 commit:            5 min

TOTAL estimado: ~90 min
Probable real: ~20-25 min
```

---

## 10. Refs

### Decisiones aplicables
- **D-82** AI-readable canon (data-component)
- **D-94** Surface canon (4 valores + D-110 expansion)
- **D-107** Cross-surface fuente de verdad única
- **D-108** Icon registry canon
- **D-109** Admin canon BBF estrategia
- **D-110** Surface canon 5 valores (RATIFICADA M5-ADMIN-2)

### Decisión pendiente
- **D-BBF-WEB-111 NUEVA** — Status tokens canon BBF (success/error/warning)
  Strategic firma antes de M5-ADMIN-3 si aplica.

### Documentos canon relacionados
- `src/app/(payload)/CLAUDE.md` — Admin canon strategy
- `bbf-skills/cross-surface/SKILL.md` — Process canon
- `BBF_DESIGN.md` §5.6 — Cross-surface canon
- `src/components/atoms/BBFLogo/CLAUDE.md` — Logo atom canon
- `src/payload.config.ts` — Config Payload (admin section)
