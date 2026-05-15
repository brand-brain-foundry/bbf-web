# B-BBF-11-H1-1-PATCH-FIX — Correctivo paths + ESM + tsconfig

**Patch ID:** B-BBF-11-H1-1-PATCH-FIX
**Repo:** bbf-web (/Volumes/PK/BBF/Repos/bbf-web)
**Branch:** main (push directo — L-BBF-18)
**Fecha:** 2026-05-15
**Tipo:** Correctivo de ejecución B-BBF-11-H1-1
**Sobre commit:** 18a2c6a (B-BBF-11-H1-1 ejecutado parcialmente)
**Bloqueante para:** admin/produccion funcional + cualquier sesión H1 siguiente

---

## §0 — CONTEXTO

Verificación post-B-BBF-11 detectó 6 hallazgos críticos:

| # | Hallazgo | Severidad |
|---|----------|-----------|
| H-1 | Paths usados `src/{collections,globals,lib,seed}/` planos en vez de `src/payload/...` (F-3 convention firmada D-BBF-WEB-35) | 🔴 |
| H-2 | F-3 bootstrap `src/payload/collections/` y `src/payload/globals/` quedaron huérfanos vacíos | 🔴 |
| H-3 | `tsconfig.json` quedó con duplicado: `@payload-config` (sin slash) + `@/payload-config` (con slash) | 🟡 |
| H-4 | `pnpm payload generate:types` falla con `ERR_PACKAGE_PATH_NOT_EXPORTED` en `file-type@21.3.4` | 🔴 |
| H-5 | Vercel `/admin` retorna **HTTP 404** (deploy roto o cache antiguo) | 🔴 |
| H-6 | postbuild `payload migrate` falla por mismo issue ESM que generate:types | 🔴 |

**Causa raíz del ERR_PACKAGE_PATH_NOT_EXPORTED:** `file-type@21.3.4` es ESM puro
(sin "exports" CJS). `tsx@4.21.0` lo trata como CJS porque package.json del repo
NO tiene `"type": "module"`. Issue documentado en Payload #15875 (marzo 2026).
**Fix oficial:** agregar `"type": "module"` a package.json.

**Decisión Zavala:** B-BBF-11-H1-1-PATCH-FIX correctivo HOY, antes de cualquier
otra cosa.

### §0.1 Estado actual a corregir

```
src/
├── collections/          ← MOVER a src/payload/collections/
│   ├── users/
│   ├── media/
│   ├── entities/
│   ├── topics/
│   ├── clusters/
│   ├── contentItems/
│   │   └── blocks/
│   ├── surfaces/
│   ├── signals/
│   └── redirects/
├── globals/              ← MOVER a src/payload/globals/
│   ├── Site.ts
│   ├── Navigation.ts
│   ├── SocialLinks.ts
│   ├── SEO.ts
│   └── BrandSystem.ts
├── lib/                  ← MOVER a src/payload/lib/
│   ├── access/
│   ├── hooks/
│   └── utils/
├── seed/                 ← MOVER a src/payload/seed/
│   └── index.ts
├── payload/              ← F-3 huérfano, contiene dirs vacíos
│   ├── collections/      ← VACÍO, eliminar
│   └── globals/          ← VACÍO, eliminar
├── payload.config.ts     ← AJUSTAR imports + paths
├── payload-types.ts      ← MOVER a src/payload/payload-types.ts (después regenerar)
└── app/(payload)/...     ← INTOCABLE (route group Next.js, correcto)
```

---

## §1 — VERIFICACIÓN PRE-EJECUCIÓN

```bash
cd /Volumes/PK/BBF/Repos/bbf-web

# 1. Estado git
git status
git log --oneline -3
# Esperado: HEAD 18a2c6a en main, clean

# 2. Confirmar estructura actual
ls -la src/collections 2>/dev/null && echo "src/collections existe ✓"
ls -la src/globals 2>/dev/null && echo "src/globals existe ✓"
ls -la src/lib 2>/dev/null && echo "src/lib existe ✓"
ls -la src/seed 2>/dev/null && echo "src/seed existe ✓"
ls -la src/payload 2>/dev/null && echo "src/payload F-3 huérfano ✓"

# 3. Confirmar .env.local intacto
grep -c "^DATABASE_URL=\|^BLOB_READ_WRITE_TOKEN=\|^PAYLOAD_SECRET=" .env.local
# Esperado: 3

# 4. Verificar package.json NO tiene "type": "module" todavía
grep '"type":' package.json && echo "type ya existe" || echo "type FALTA - se agrega en F-3"

# 5. Verificar tsconfig duplicado
grep -A 4 '"paths":' tsconfig.json
# Esperado: ver tanto "@payload-config" como "@/payload-config"
```

**✋ STOP 1 — Reportar todos los outputs anteriores.**

Si HEAD NO es 18a2c6a → escalar.
Si .env.local NO tiene las 3 keys → escalar.
Si no aparecen los directorios listados → escalar.

---

## §2 — FIX 1: Agregar `"type": "module"` a package.json

Este es el fix MÁS CRÍTICO. Sin él, `payload generate:types` y `payload migrate`
siguen rotos (issue ESM `file-type@21.3.4`).

**Riesgo controlado:** Next.js 15 + el repo bbf-web usa `next.config.mjs` (no
`.js`), todo TypeScript en `.ts`/`.tsx`, scripts assets en `.mjs`. Agregar
`"type": "module"` es seguro porque:
- `.mjs` ya es ESM explícito (no cambia)
- `.ts/.tsx` se transpilan a ESM por Next.js
- No hay `.js` con `require()` en el proyecto (verificar antes)

### §2.1 Verificar no hay `.js` con require()

```bash
# Buscar archivos .js con require( en el repo (excluyendo node_modules y .next)
find . -type f -name "*.js" \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./.git/*" \
  -exec grep -l "require(" {} \; 2>/dev/null
```

**Si hay matches:** STOP y reportar. Algún archivo `.js` usa CommonJS.

**Si no hay matches:** seguro proceder.

### §2.2 Editar package.json

Abrir `package.json` y agregar `"type": "module"` justo después de `"version"`:

```json
{
  "name": "bbf-web",
  "version": "0.2.0",
  "type": "module",
  "private": true,
  "scripts": {
    ...
  }
}
```

### §2.3 Verificar

```bash
node -e "const p=require('fs').readFileSync('package.json','utf8'); const j=JSON.parse(p); console.log('type:', j.type)" 2>&1 || \
  cat package.json | python3 -c "import sys,json; d=json.load(sys.stdin); print('type:', d.get('type','MISSING'))"
# Esperado: type: module
```

---

## §3 — FIX 2: Quitar duplicado en tsconfig.json

Mantener UNA convención: `@/payload-config` (con slash, F-3 original).

### §3.1 Editar tsconfig.json

Localizar el bloque `paths` y eliminar la línea `"@payload-config"`:

**ANTES:**
```json
"paths": {
  "@/*": ["./src/*"],
  "@payload-config": ["./src/payload.config.ts"],
  "@/payload-config": ["./src/payload.config.ts"]
}
```

**DESPUÉS:**
```json
"paths": {
  "@/*": ["./src/*"],
  "@/payload-config": ["./src/payload.config.ts"]
}
```

### §3.2 Verificar

```bash
grep -A 4 '"paths":' tsconfig.json
# Esperado: ver SOLO "@/payload-config" + "@/*"
```

---

## §4 — FIX 3: Migrar TODOS los archivos a `src/payload/...`

### §4.1 Mover directorios

```bash
# Verificar src/payload/ está vacío antes de mover
ls -la src/payload/collections/
ls -la src/payload/globals/
# Esperado: vacíos (solo . y ..)

# Eliminar F-3 huérfanos vacíos
rmdir src/payload/collections
rmdir src/payload/globals
ls -la src/payload/

# Mover los directorios completos
mv src/collections src/payload/collections
mv src/globals src/payload/globals
mv src/lib src/payload/lib
mv src/seed src/payload/seed

# Verificar estructura nueva
find src -maxdepth 3 -type d | sort
```

**Esperado después del mv:**
```
src
src/app
src/app/(payload)
src/app/(payload)/admin
src/app/(payload)/api
src/components
src/payload
src/payload/collections
src/payload/collections/clusters
src/payload/collections/contentItems
src/payload/collections/contentItems/blocks
src/payload/collections/entities
src/payload/collections/media
src/payload/collections/redirects
src/payload/collections/signals
src/payload/collections/surfaces
src/payload/collections/topics
src/payload/collections/users
src/payload/globals
src/payload/lib
src/payload/lib/access
src/payload/lib/hooks
src/payload/lib/utils
src/payload/seed
```

### §4.2 Buscar y reemplazar imports en TODOS los archivos

```bash
# Listar archivos que necesitan ajuste de imports
grep -rl "@/lib/access\|@/lib/hooks\|@/lib/utils\|@payload-config" src/ | sort
```

**Esperado:** lista de archivos en `src/payload/collections/*`, `src/payload/globals/*`, `src/payload/seed/*`, `src/app/(payload)/...`

### §4.3 Aplicar reemplazos via sed

```bash
# REPLACE 1: @/lib/access → @/payload/lib/access
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|@/lib/access|@/payload/lib/access|g' {} +

# REPLACE 2: @/lib/hooks → @/payload/lib/hooks
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|@/lib/hooks|@/payload/lib/hooks|g' {} +

# REPLACE 3: @/lib/utils → @/payload/lib/utils
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|@/lib/utils|@/payload/lib/utils|g' {} +

# REPLACE 4: '@payload-config' (sin slash) → '@/payload-config' (con slash, F-3 convention)
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@payload-config'|from '@/payload-config'|g" {} +

# Verificación post-sed
echo "=== Buscando imports residuales viejos ==="
grep -rn "@/lib/" src/ && echo "RESIDUAL: imports @/lib/ encontrados" || echo "✓ sin residuales @/lib/"
grep -rn "@payload-config" src/ | grep -v "@/payload-config" && echo "RESIDUAL: @payload-config sin slash encontrado" || echo "✓ todos usan @/payload-config con slash"
```

---

## §5 — FIX 4: Actualizar imports en `payload.config.ts`

Los imports relativos en `src/payload.config.ts` apuntan a `./collections/...` y
`./globals/...`. Ahora deben apuntar a `./payload/collections/...` y
`./payload/globals/...`.

### §5.1 Editar `src/payload.config.ts`

Aplicar via sed:

```bash
sed -i '' "s|from './collections/|from './payload/collections/|g" src/payload.config.ts
sed -i '' "s|from './globals/|from './payload/globals/|g" src/payload.config.ts
```

### §5.2 Ajustar `migrationDir` y `outputFile`

En el mismo archivo, cambiar las rutas de migration y types:

```bash
# migrationDir: 'migrations' → 'payload/migrations'
sed -i '' "s|path.resolve(dirname, 'migrations')|path.resolve(dirname, 'payload/migrations')|g" src/payload.config.ts

# outputFile: 'payload-types.ts' → 'payload/payload-types.ts'
sed -i '' "s|path.resolve(dirname, 'payload-types.ts')|path.resolve(dirname, 'payload/payload-types.ts')|g" src/payload.config.ts
```

### §5.3 Verificación

```bash
echo "=== Imports collections esperados ==="
grep "from './payload/collections" src/payload.config.ts | wc -l
# Esperado: 9 (Users, Media, Entities, Topics, Clusters, ContentItems, Surfaces, Signals, Redirects)

echo "=== Imports globals esperados ==="
grep "from './payload/globals" src/payload.config.ts | wc -l
# Esperado: 5 (Site, Navigation, SocialLinks, SEO, BrandSystem)

echo "=== migrationDir y outputFile ==="
grep -E "migrationDir|outputFile" src/payload.config.ts
# Esperado:
#   migrationDir: path.resolve(dirname, 'payload/migrations'),
#   outputFile: path.resolve(dirname, 'payload/payload-types.ts'),
```

---

## §6 — FIX 5: Mover payload-types.ts si existe

```bash
# Si existe en src/, mover a src/payload/
if [ -f src/payload-types.ts ]; then
  mkdir -p src/payload
  mv src/payload-types.ts src/payload/payload-types.ts
  echo "✓ payload-types.ts movido"
else
  echo "⊘ payload-types.ts no existe (se regenera en §7)"
fi
```

---

## §7 — FIX 6: Regenerar import map + types

Con `"type": "module"` en package.json, el issue ESM debe quedar resuelto.

```bash
# 1. Generate import map (debería funcionar ahora)
pnpm payload generate:importmap 2>&1 | tail -10
# Esperado: ✓ success, sin ERR_PACKAGE_PATH_NOT_EXPORTED

# 2. Generate types
pnpm payload generate:types 2>&1 | tail -10
# Esperado: ✓ success

# 3. Verificar archivo generado
ls -la src/payload/payload-types.ts
wc -l src/payload/payload-types.ts
# Esperado: >500 líneas
```

**✋ STOP 2 — Reportar:**

Si `generate:importmap` o `generate:types` falla con error distinto a ERR_PACKAGE_PATH_NOT_EXPORTED → reportar y escalar.

Si sigue fallando con ERR_PACKAGE_PATH_NOT_EXPORTED después de agregar `"type": "module"` → fix alternativo §11.

---

## §8 — FIX 7: Type check + build local

```bash
# 1. TypeScript check
pnpm typecheck 2>&1 | tail -20
# Esperado: 0 errores

# 2. Build local (sin postbuild que requiere DB live)
pnpm exec next build 2>&1 | tail -20
# Esperado: ✓ Build verde
# Si falla por imports: verificar §4.3 sed completos
```

**✋ STOP 3 — Reportar:**

Si typecheck falla → reportar errores específicos, no proceder.
Si next build falla → reportar error completo.

---

## §9 — FIX 8: Cleanup importMap residual

Verificar si quedó `importMap.js` o `importMap.ts` residual:

```bash
find src/app -name "importMap*"
# Esperado: ver UNO solo (probablemente importMap.ts)

# Si hay duplicado .js + .ts, mantener solo .ts:
test -f "src/app/(payload)/importMap.js" && rm "src/app/(payload)/importMap.js"

# Verificar paths importMap en page.tsx y not-found.tsx
grep "importMap" "src/app/(payload)/admin/[[...segments]]/page.tsx"
grep "importMap" "src/app/(payload)/admin/[[...segments]]/not-found.tsx"
# Esperado: from '../../importMap' (path relativo correcto)
```

---

## §10 — FIX 9: Commit + push

```bash
git status

# Stage los cambios esperados
git add -A
git status

# El stage debe incluir:
# - deleted: src/collections/* (todos los archivos)
# - deleted: src/globals/* (todos)
# - deleted: src/lib/* (todos)
# - deleted: src/seed/index.ts
# - deleted: src/payload-types.ts (si existía)
# - new: src/payload/collections/* (idéntico contenido, nueva ubicación)
# - new: src/payload/globals/*
# - new: src/payload/lib/*
# - new: src/payload/seed/index.ts
# - new: src/payload/payload-types.ts
# - modified: src/payload.config.ts (imports)
# - modified: package.json ("type": "module")
# - modified: tsconfig.json (duplicado removido)
# - modified: archivos con imports actualizados (sed)

git commit -m "fix(h1-1): patch correctivo paths + ESM + tsconfig duplicado

B-BBF-11-H1-1-PATCH-FIX — Correctivo sobre commit 18a2c6a

Resuelve 6 hallazgos críticos detectados en auditoría post-ejecución:

H-1/H-2 (path drift): migración src/{collections,globals,lib,seed}/
  → src/payload/{collections,globals,lib,seed}/ respetando D-BBF-WEB-35
  (firmada en patch que la ejecución original ignoró).
  F-3 directorios huérfanos (src/payload/collections/ y globals/ vacíos)
  eliminados.

H-3 (tsconfig): removido alias duplicado @payload-config (sin slash).
  Convención única: @/payload-config (con slash, F-3 original).

H-4 (ESM): agregado \"type\": \"module\" a package.json.
  Resuelve ERR_PACKAGE_PATH_NOT_EXPORTED al ejecutar payload generate:types
  causado por file-type@21.3.4 ESM-only cargado por tsx@4.21.0 en modo CJS.
  Issue documentado: payloadcms/payload#15875 (marzo 2026).

H-5 (deploy 404): force redeploy via push fuerza Vercel rebuild.
  El deploy previo de 18a2c6a falló en postbuild silenciosamente
  (mismo issue ESM), dejando /admin sin renderizar en producción.

H-6 (postbuild migrate): mismo fix de H-4 — \"type\": \"module\"
  permite que pnpm payload migrate corra después de next build.

Archivos:
- modified: package.json (\"type\": \"module\")
- modified: tsconfig.json (paths sin duplicado)
- modified: src/payload.config.ts (imports + migrationDir + outputFile)
- modified: src/payload/seed/index.ts (import @/payload-config)
- modified: src/app/(payload)/admin/[[...segments]]/page.tsx (import @/payload-config)
- modified: src/app/(payload)/admin/[[...segments]]/not-found.tsx (ídem)
- modified: src/app/(payload)/api/[...slug]/route.ts (ídem)
- moved: src/collections/ → src/payload/collections/ (10 collections + 3 blocks)
- moved: src/globals/ → src/payload/globals/ (5 globals)
- moved: src/lib/ → src/payload/lib/ (access + hooks + utils)
- moved: src/seed/ → src/payload/seed/ (seed inicial)
- moved: src/payload-types.ts → src/payload/payload-types.ts (regenerado)
- deleted: src/payload/{collections,globals}/ vacíos huérfanos F-3

Verificaciones:
- pnpm payload generate:importmap → ✓ verde
- pnpm payload generate:types → ✓ verde, 500+ líneas
- pnpm typecheck → ✓ 0 errores
- pnpm exec next build → ✓ verde

Lecciones nuevas:
- L-BBF-27: Patches deben verificarse aplicados antes de continuar
- L-BBF-28: Convención \"type\": \"module\" canon Payload 3 + Next.js 15

Próximo paso: verificar deploy Vercel + crear primer admin via
https://brandbrainfoundry.com/admin/create-first-user

Refs: BBF_PrimitiveTopologyCanon_v1.md (9ca216a)
Refs: D-BBF-WEB-32, 33, 34, 35 firmadas
Refs: Payload issue #15875 (ESM workaround)
Refs: SB_Law A-02 Sin parches, A-04 Convenciones, C-01 Verificación por nivel"

git push origin main
git log --oneline -5
```

**✋ STOP 4 — Reportar:**
- Hash commit
- Output push
- `git log --oneline -5`
- `ls src/payload/`

---

## §11 — FALLBACK: Si `"type": "module"` rompe algo

Si después de §2 el typecheck o build falla por archivos `.js` que usan
CommonJS, el fallback es renombrar esos archivos a `.cjs`:

```bash
# Identificar
find . -type f -name "*.js" \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./.git/*" \
  -exec grep -l "require(\|module.exports" {} \;
```

Para cada archivo encontrado:
- Si es script de utility → renombrar `.js` → `.cjs`
- Si es lib esencial → escalar a Zavala

**Alternativa más conservadora:** NO agregar `"type": "module"` y en su lugar
usar el workaround del issue Payload #15875:

```json
// package.json scripts
"generate:types": "tsx node_modules/payload/bin.js generate:types",
"generate:importmap": "tsx node_modules/payload/bin.js generate:importmap",
"postbuild": "tsx node_modules/payload/bin.js migrate"
```

Esto fuerza ejecución a través de `tsx` directamente sin el wrapper del CLI
de Payload. Pero requiere `tsx` instalado como devDependency.

---

## §12 — POST-PATCH: Verificación deploy Vercel

Después del push, esperar 2-3 min y verificar:

```bash
# 1. Vercel deploy status (sin acceso a dashboard, intentar curl)
curl -sI https://brandbrainfoundry.com/admin 2>&1 | head -3
# Esperado: HTTP/2 200 o 307 (no 404)

# 2. Admin /api/health
curl -sI https://brandbrainfoundry.com/api/health 2>&1 | head -3
# Esperado: HTTP/2 200 (si endpoint existe, sino 404 OK)

# 3. Admin /api/access (endpoint Payload)
curl -s https://brandbrainfoundry.com/api/access 2>&1 | head -5
# Esperado: JSON con access permissions
```

**Acción tuya:** ir a Vercel dashboard del proyecto bbf-web y verificar:
1. Último deploy de commit `[NEW_HASH]` (este patch) está verde
2. Build log muestra `payload migrate` ejecutándose exitosamente
3. `/admin` responde

**Si deploy falla:** reportar error del Vercel log y escalar.

---

## §13 — POST-PATCH: Crear primer admin

Una vez deploy verde:

1. Ir a `https://brandbrainfoundry.com/admin/create-first-user`
2. Completar:
   - Email: tu email Zavala
   - Name: Christian Zavala
   - Password: fuerte, guardar en Bitwarden
   - Role: admin
3. Login → debería redireccionar a `/admin` con dashboard

---

## §14 — INVARIANTES

### IN — tocás:
- `package.json` (agregar `"type": "module"`)
- `tsconfig.json` (quitar duplicado)
- `src/payload.config.ts` (imports + paths)
- Estructura: mover `src/{collections,globals,lib,seed}` → `src/payload/`
- Imports en todos los archivos `src/payload/**/*.ts` y `src/app/(payload)/**/*.tsx`
- Eliminar `src/payload/collections/` y `src/payload/globals/` huérfanos
- `src/payload/payload-types.ts` regenerar

### OUT — NO tocás:
- `next.config.mjs` (correcto F-3)
- `src/app/page.tsx`, `layout.tsx`, `globals.css` (home live)
- `src/components/*` (BBFLogo, HeroVideo)
- `public/*`
- `scripts/*`
- `.env.local`

### Cuándo detenerte y escalar:

1. .js con require() o module.exports detectados en §2.1 → escalar
2. typecheck falla post-fix → reportar errores completos
3. next build falla por imports no resueltos → reportar paths erróneos
4. `payload generate:types` sigue fallando después de §2 + §7 → aplicar §11
5. Cualquier ambigüedad → escalar

---

## §15 — REPORTE FINAL ESPERADO

```
Commit:    [HASH] en main de bbf-web
Push:      18a2c6a..[HASH]
Status:    clean

Estructura final:
src/payload/
  collections/   (9 collections — users, media, entities, topics, clusters, contentItems, surfaces, signals, redirects)
  globals/       (5 globals)
  lib/           (access, hooks, utils)
  seed/          (index.ts)
  payload-types.ts (auto-generated >500 líneas)
src/payload.config.ts (imports actualizados)
src/app/(payload)/  (route group Payload intacto)

Cambios commit:
- package.json: +"type": "module"
- tsconfig.json: -duplicado @payload-config
- payload.config.ts: imports ./payload/...
- moved: ~30 archivos a src/payload/
- regenerated: src/payload/payload-types.ts
- deleted: F-3 huérfanos src/payload/{collections,globals}/ vacíos

Verificaciones pasadas:
- pnpm payload generate:importmap → ✓
- pnpm payload generate:types → ✓
- pnpm typecheck → ✓ 0 errores
- pnpm exec next build → ✓
- Vercel deploy [NEW_HASH] → ⏳ esperar verificación visual

Próximo paso Zavala:
1. Verificar Vercel deploy verde en dashboard
2. Ir a /admin/create-first-user
3. Crear primer admin

Próximo despacho previsto:
- Si admin funcional → B-BBF-12 (blocks expansion + seed expansion)
- Si admin falla → B-BBF-11-H1-1-PATCH-FIX-2
```

---

## §16 — LECCIONES REGISTRADAS

| ID | Lección | Aplicación |
|----|---------|------------|
| **L-BBF-27** | Strategic debe verificar que el patch del despacho ANTERIOR se aplicó antes de declarar la sesión cerrada | Próxima sesión, primer paso es STOP 1 que valide la convención del Canon respecto a archivos commiteados |
| **L-BBF-28** | Payload 3 + Next.js 15 requieren `"type": "module"` en package.json para que el CLI tools (generate:types, migrate) funcionen | Canon Payload setup futuro: incluir desde día 1 |

---

**Patch:** 2026-05-15
**Patch ID:** B-BBF-11-H1-1-PATCH-FIX
**Strategic:** Modo 1 + Modo 2 (autoaudit + correctivo)
**Tipo:** Correctivo 6 hallazgos críticos
**Bloquea:** producción admin funcional
**Tiempo estimado:** 30-45 min ejecución Claude Code