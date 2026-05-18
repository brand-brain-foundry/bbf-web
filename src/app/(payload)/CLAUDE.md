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

### 2. custom.scss canon BBF (D-114 — reemplaza D-112)

Override directo en `src/app/(payload)/custom.scss`. Importado por `layout.tsx`.

```scss
[data-theme="light"], :root {
  --theme-elevation-0: var(--bbf-surface-sand, oklch(0.97 0.01 67.52));
  --theme-text: var(--bbf-text-on-light, oklch(0.15 0.01 292.51));
  --font-body: var(--bbf-font-body, 'Mulish', 'Inter', system-ui, sans-serif);
  /* ... mapping completo con fallbacks OKLCH */
}
```

**IMPORTANTE — contexto tokens:** `globals.css` (con `--bbf-*` tokens) NO se carga
en ruta `/admin`. El layout admin es independiente del frontend. Todo `var(--bbf-*)`
en custom.scss DEBE tener fallback OKLCH hardcoded.

**NOTA HISTÓRICA D-114 (M5-ADMIN-4 hotfix):**
- D-112 propuso `admin.css` separado con `@import` desde `custom.scss`
- `@import` NO cargaba correctamente (H-BBF-WEB-001)
- D-114 ratifica: `custom.scss` es fuente única canon
- Pattern aligned con Payload community 2026 (R-BBF-12)

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
- **D-114** custom.scss canon BBF (reemplaza D-112, override directo)

---

## Refs

- `src/payload.config.ts` — configuración Payload central
- `collections/` — schemas de collections
- `globals/` — schemas de globals
- Canon §4.1 — reglas de Payload collections
- Regla `10-payload-collections.md` — operativa canon
