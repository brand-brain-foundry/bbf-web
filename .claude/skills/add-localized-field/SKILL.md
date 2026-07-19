---
name: add-localized-field
description: Agrega un campo localized:true a una collection o block existente. Usa cuando un campo de contenido no tiene localization y debería tenerla, o cuando se necesita un nuevo field traducible.
---

# Skill — Agregar field localized

## Cuándo usar

- Identificaste un campo de contenido visible al usuario que NO tiene `localized: true`.
- Zavala pide agregar un campo nuevo traducible a una collection o block.
- Investigación H1-2 confirmó que un slug debe ser localized y aún no lo es.

## Pasos

### 1. Verificar Canon

Confirma que el field está justificado por Canon §4.1.x o por D-BBF-WEB-* firmada. Si no: para y pide firma.

### 2. Editar la collection/block

```ts
{
  name: 'description',
  type: 'textarea',
  localized: true,         // ← clave
  required: true,
  maxLength: 500,
},
```

Si el field ya existía sin `localized: true` y tenía datos en producción: **para y avisa**. El cambio implica migración compleja de datos existentes (los valores actuales pasan a vivir bajo el locale default).

### 3. Crear migración

```bash
pnpm payload migrate:create add-localized-<field>-to-<collection>
```

Inspecciona el SQL. Verifica que:
- Crea la tabla `_<collection>_<field>_locales` o equivalente Payload usa.
- Si hay datos existentes: ¿se copian al locale default? Si no, escribe SQL custom en la migración.

### 4. Aplicar

```bash
pnpm payload migrate
```

### 5. Regenerar types

```bash
pnpm payload generate:types
```

### 6. Actualizar componentes que consumen el field

Antes:
```tsx
{post.description}
```

Después: ya no necesita cambiar — Payload Local API devuelve el valor del locale actual basado en el request. Pero **verifica que la query incluye el `locale`**:

```ts
const post = await payload.findByID({
  collection: 'posts',
  id,
  locale: 'es', // o 'en', basado en la URL
});
```

### 7. Verificación

- `pnpm typecheck` → 0 errors.
- En admin, el field muestra toggle ES/EN.
- En frontend ES y EN, el contenido cambia.
- Fallback: si EN no tiene valor, muestra ES (con `fallback: true` en config).

## Reglas

- **No conviertas a localized algo que no debería serlo**: `email`, `url`, `id`, fechas, tokens, `muxAssetId`, IDs de tenant, `status` enum.
- **Sí convierte a localized**: `title`, `description`, `summary`, `content`, `excerpt`, `alt` en Media, `caption`, `credit`, slugs de páginas con traducción (`/manifiesto` vs `/manifesto`).
- **Decisión gris — slug de Post**: ver D-BBF-WEB pendiente en investigación H1-2. Hasta que firme, mantén slugs **localized** por consistency.
- **Si el campo ya tenía datos**: confirma plan de migración con Zavala antes de aplicar.
