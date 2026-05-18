# CLAUDE.md — src/app/(payload)/

**Payload CMS Admin — Canon BBF**

> Route group: `(payload)/` — Admin CMS + API handlers
> No modificar archivos auto-generados por Payload.
> Customización solo vía canales canon.

---

## Estructura

```
app/(payload)/
├── admin/
│   ├── [[...segments]]/
│   │   └── page.tsx       Auto-generado Payload (NO tocar)
│   └── importMap.js       Auto-generado Payload (NO tocar)
├── api/
│   └── [...slug]/
│       └── route.ts       Auto-generado Payload (NO tocar)
├── custom.scss            Estilos admin override canon
└── layout.tsx             Auto-generado Payload (NO tocar)
```

---

## Archivos auto-generados (NO modificar)

Los siguientes archivos son generados por Payload y se sobreescriben en cada `payload generate:types`:

- `admin/[[...segments]]/page.tsx`
- `admin/importMap.js`
- `api/[...slug]/route.ts`
- `layout.tsx`

**Regla:** si necesitas cambiar comportamiento admin, usa los canales canon de Payload (ver §Customización), NO edites estos archivos directamente.

---

## Customización admin canon

### 1. graphics.Logo + graphics.Icon (D-109)

React Components canon BBF registrados en `src/payload.config.ts`:

```ts
admin: {
  components: {
    graphics: {
      Logo: '@/app/(payload)/components/AdminLogo',
      Icon: '@/app/(payload)/components/AdminIcon',
    },
  },
}
```

Components en `src/app/(payload)/components/`:
- `AdminLogo/` — BBFLogo variant `horizontal` size `md` (login page)
- `AdminIcon/` — BBFLogo variant `stamp` size `sm` (nav icon)

Reusan BBFLogo atom canon (D-107 cross-surface). NO sistema design paralelo.

### 2. custom.scss canon BBF (D-115 — reemplaza D-114)

Override MINIMAL en `src/app/(payload)/custom.scss`. Importado por `layout.tsx`.

```scss
:root, [data-theme="light"], [data-theme="dark"] {
  /* BBF brand identity — fonts canon únicamente */
  --font-body:  'Mulish', 'Inter', system-ui, sans-serif;
  --font-serif: 'Mulish', 'Inter', system-ui, sans-serif;
  --font-mono:  'JetBrains Mono', ui-monospace, monospace;
}
```

**PRINCIPIO CANON BBF cross-surface (D-115):**

```
Admin Payload = Payload sistema visual PRESERVED
              + BBF brand identity SUTIL aplicada
              + NO reemplazo sistema host
```

**Variables overridden (mínimo brand identity):**
- ✓ `--font-body` — Mulish canon BBF
- ✓ `--font-mono` — JetBrains Mono canon BBF

**Variables PRESERVED (Payload sistema calibrado):**
- ✗ `--theme-elevation-*` (21 niveles calibrados)
- ✗ `--theme-text` + `--theme-text-faded` (contrast hierarchy)
- ✗ `--theme-input-*` (UX functional)
- ✗ `--theme-success/warning/error` (auto dark mode)
- ✗ `--base` + spacing system

**HISTORIA DOCTRINAL (lección aprendida — L-BBF-115):**

| Iteración | Approach | Resultado |
|-----------|----------|-----------|
| M5-ADMIN-3 (D-112) | admin.css separado | NO funcionó (@import) |
| M5-ADMIN-4 (D-114) | custom.scss massive override (~30 vars) | Visual Payload roto |
| **M5-ADMIN-5 (D-115)** | **custom.scss minimal (3 vars)** | **CANON BBF doctrinal** |

**Lección canon BBF (L-BBF-115):**
Cross-surface canon ≠ reemplazo sistema host. Canon BBF aplica brand identity sutil sobre host system. El host (Payload) preserva su sistema visual calibrado.

**Investigación aplicada:** R-BBF-13 (Payload 3 Admin Brand Override REAL 2026).
Pattern community confirmado: "minimal changes" = override 2-3 variables máximo.

### 3. payload.config.ts — admin config

La customización estructural del admin va en `src/payload.config.ts`, sección `admin`:

```ts
admin: {
  user: Users.slug,
  importMap: { baseDir: path.resolve(dirname) },
  meta: { titleSuffix: '— BBF Admin' },
  components: {
    graphics: {
      Logo: '@/app/(payload)/components/AdminLogo',
      Icon: '@/app/(payload)/components/AdminIcon',
    },
  },
}
```

**Nota:** Payload 3.84.1 NO soporta propiedad `css:` en admin config.
Canal correcto: `custom.scss` importado en `layout.tsx`.

---

## API Route handlers canon (NO en este folder)

Los route handlers públicos BBF (contact, newsletter, og, revalidate) viven en:

```
app/(frontend)/api/
├── contact/route.ts
├── newsletter/subscribe/route.ts
├── newsletter/confirm/route.ts
├── og/route.tsx
└── revalidate/route.ts
```

El `api/[...slug]/route.ts` en `(payload)/` es **exclusivo de Payload** — maneja Payload REST API + GraphQL. No agregar lógica de negocio aquí.

---

## Runtime

Todo el route group `(payload)/` corre en **Node runtime** — requerimiento de Payload (no compatible con Edge runtime).

```ts
// NO agregar en archivos payload — ya está configurado implícitamente
// export const runtime = 'nodejs'; // Payload lo asume
```

---

## Acceso admin

URL: `/admin` (redirige a `/admin/login` si no autenticado).

Acceso controlado por `collections/Users` con `access` fields:
```ts
access: {
  create: ({ req }) => req.user?.role === 'admin',
  read: ({ req }) => !!req.user,
  update: ({ req }) => !!req.user,
  delete: ({ req }) => req.user?.role === 'admin',
}
```

**Regla:** access control declarativo en collection schema, NUNCA en frontend/middleware.

---

## Decisiones aplicables

- **D-82** AI-readable canon (aplica también a admin custom components)
- **D-99** Server + Client split (custom admin components pueden requerir Client)
- **D-107** Cross-surface fuente de verdad (overrides admin en custom.scss)
- **D-109** Admin canon BBF (AdminLogo + AdminIcon reusan BBFLogo atom)
- **D-115** custom.scss MINIMAL canon BBF (reemplaza D-114, override 3 vars)

---

## Refs

- `src/payload.config.ts` — configuración Payload central
- `collections/` — schemas de collections
- `globals/` — schemas de globals
- Canon §4.1 — reglas de Payload collections
- Regla `10-payload-collections.md` — operativa canon
