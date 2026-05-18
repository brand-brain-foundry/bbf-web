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

### 1. custom.scss — CSS overrides

Archivo `custom.scss` importado en `layout.tsx`. Aquí van overrides de CSS variables de Payload.

Payload Admin usa CSS variables que pueden ser sobreescritas:

```scss
// custom.scss — BBF admin brand overrides
:root {
  // Color brand
  --color-base-1250: oklch(0.1 0 0);    // fondo oscuro admin
  --color-base-0: oklch(0.98 0 0);      // texto sobre oscuro

  // Accent BBF canon
  --color-success-500: oklch(0.6 0.2 25); // rojo BBF como accent (si aplica)
}
```

**Regla D-107:** Los overrides de `custom.scss` son **cosméticos únicamente**. NO afectan lógica Payload.

### 2. payload.config.ts — admin config

La customización estructural del admin va en `src/payload.config.ts`, sección `admin`:

```ts
admin: {
  user: Users.slug,
  importMap: { baseDir: path.resolve(dirname) },
  meta: {
    titleSuffix: '— BBF Admin',
    favicon: '/favicon.ico',
    ogImage: '/og-image.png',
  },
  // graphics: opcional — logo personalizado en login/nav
  // components: { beforeNavLinks: [...], afterNavLinks: [...] }
}
```

### 3. Custom graphics (futuro — TD pendiente)

Payload permite reemplazar:
- Logo en sidebar nav
- Logo en login screen

Pattern canon (cuando se implemente):

```ts
// payload.config.ts
admin: {
  graphics: {
    Logo: '/src/components/admin/AdminLogo',      // Sidebar logo
    Icon: '/src/components/admin/AdminIcon',       // Small icon
  },
}
```

**Estado actual:** TD pendiente — implementar con BBFLogo canon en M6+.

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

---

## Refs

- `src/payload.config.ts` — configuración Payload central
- `collections/` — schemas de collections
- `globals/` — schemas de globals
- Canon §4.1 — reglas de Payload collections
- Regla `10-payload-collections.md` — operativa canon
