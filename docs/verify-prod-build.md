# Verificación local del build de producción

Resuelve `HAL-SBWEB-NO-PROD-BUILD-VERIFY-01` (ALTA) — la ausencia de esta
herramienta es la causa raíz de que el crash de PR#24 llegara a producción
sin cazarse antes. No es tooling específico del blob: es la capa primitiva
de verificación reutilizable para **cualquier** deploy futuro.

## Dos capas

### Capa 1 — quick-win local (`scripts/verify-prod-build.sh`)

Sin Docker. Corre el runtime real de producción (`node .next/standalone/server.js`)
contra estáticos reales, replicando los 2 `COPY` que el `Dockerfile` (stage
`runner`) hace y que `output:'standalone'` no hace por sí solo — el gap
exacto que causó "sirve sin CSS".

```bash
# .env.verify: crear MANUALMENTE, fuera de Claude Code (ver nota abajo)
./scripts/verify-prod-build.sh       # puerto 3000 por default
```

Fail-closed: si el CSS servido no responde `text/css`, el script falla
(exit 1) — no hay forma de que el gap pase silencioso.

Suficiente para el ~90% de los deploys. Correr antes de cualquier merge a
`main` que toque `next.config.mjs`, el pipeline de build, o dependencias de
storage/cache.

### Capa 2 — paridad Docker (Mac ↔ Linux)

El `Dockerfile` ya existe en la raíz del repo — no hay que crear nada
nuevo, solo correrlo local. Atrapa lo que la Capa 1 no puede: `sharp`
recompilado sobre `node:22-slim` (glibc Linux) puede comportarse distinto
a un `sharp` compilado en macOS/arm64.

```bash
docker build \
  --build-arg DATABASE_URL=<test-db-url> \
  --build-arg PAYLOAD_SECRET=<test-secret> \
  --build-arg R2_BUCKET=<test-bucket> \
  --build-arg R2_ENDPOINT=<test-endpoint> \
  --build-arg R2_ACCESS_KEY_ID=<test-key> \
  --build-arg R2_SECRET_ACCESS_KEY=<test-secret> \
  --build-arg RESEND_API_KEY=<test-key> \
  --build-arg UPSTASH_REDIS_REST_URL=<test-url> \
  --build-arg UPSTASH_REDIS_REST_TOKEN=<test-token> \
  --build-arg TURNSTILE_SECRET_KEY=<test-key> \
  --build-arg NEXT_PUBLIC_TURNSTILE_SITE_KEY=<test-key> \
  --build-arg NEXT_PUBLIC_SITE_URL=https://sivarbrains.com \
  --build-arg NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=$(openssl rand -base64 32) \
  --build-arg GIT_COMMIT_HASH=$(git rev-parse HEAD) \
  -t sbweb-verify .

docker run --rm -p 3000:3000 \
  -e UPSTASH_REDIS_TCP_URL=<test-tcp-url> \
  -e NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=<MISMO-valor-que-el-build-arg> \
  sbweb-verify
```

Reservar para cambios que toquen dependencias nativas o antes de un merge
grande a `main` — no hace falta en cada deploy si la Capa 1 ya pasó.

**Importante:** ni curl ni Docker cazan un crash de **cliente** (browser).
El crash de PR#24 fue WebGL2 fallando en el navegador del visitante, no en
el servidor — el servidor sirvió el bundle correcto en ambos casos. Para
eso, ver la siguiente sección.

## Verificación de fallo de cliente (WebGL2)

`scripts/verify-webgl2-fail.js` parchea `HTMLCanvasElement.prototype.getContext`
para lanzar cuando se pide `webgl2` **con opciones** — el hueco exacto que
crasheó producción (un pre-check sin opciones pasaba, el motor real con
opciones fallaba). Es el único método de esta herramienta que caza fallos
de cliente; inyectarlo en la consola del navegador sobre el server de
cualquiera de las dos capas de arriba, o vía `page.addInitScript()` si se
automatiza con Playwright/Puppeteer. Ver cabecera del archivo para el uso
completo.

## La dimensión completa — 3 HALs del incidente PR#24

Este documento y las herramientas que describe resuelven **solo el
primero**. Los otros dos quedan nombrados, no resueltos aquí:

1. **`HAL-SBWEB-NO-PROD-BUILD-VERIFY-01` (ALTA) — RESUELTO por esta
   herramienta.** Sin verificación de build local, cada deploy era
   "arreglar y rezar".
2. **`HAL-SBWEB-CLIENT-COMPONENT-NO-BOUNDARY-01` (MEDIA) — pendiente.**
   Política general de Error Boundary para componentes cliente con API de
   navegador (WebGL/canvas y similares). El fix de 3 capas para el blob
   específico vive en `preview/blob-hero-fix` (no mergeado) — se verifica
   CON esta herramienta (`verify-prod-build.sh` + `verify-webgl2-fail.js`)
   antes de reintentar el merge, pero la política general para futuros
   componentes cliente sigue sin definir.
3. **`HAL-SBWEB-CACHE-NO-BUILDID-01` (ALTA) — pendiente, independiente.**
   El `CacheHandler` de Redis no incluye build-ID en sus keys — un
   rollback de infra puede servir HTML fantasma de un build muerto
   (causa del "fantasma" en el incidente PR#24, protocolo interino:
   flush manual de Redis post-rollback).

## `.env.verify` — crear MANUALMENTE, fuera de Claude Code

**No se genera vía Claude Code.** El guard `secret-guard.sh` (S-3, hook
`PreToolUse`) bloquea por diseño cualquier archivo cuyo nombre contenga
`.env` — Read, Edit, Write o Bash, sin distinguir una plantilla de un
secreto real. Eso es correcto tal como está: no se rodea. Por eso no
existe un `.env.verify.example` — esta sección es la plantilla.

Crear `/Volumes/PK/BBF/Repos/bbf-web/.env.verify` a mano (ya gitignorado,
ver `.gitignore`) con estas 14 claves — las mismas que los `ARG` del
`Dockerfile` (stage `builder`) — con valores de **dev/staging, NUNCA
producción**:

```bash
# === Database (Payload conecta de verdad durante generate:types/
#     generate:importmap en el build — no basta con una URL bien
#     formada, tiene que ser una DB de prueba/dev alcanzable) ===
DATABASE_URL=<dev-db-url>

# === Payload CMS (min 32 chars) ===
PAYLOAD_SECRET=<dev-secret-32-chars-minimo>

# === Cloudflare R2 (media storage — STORAGE_PROVIDER default es 'r2') ===
R2_BUCKET=<dev-bucket>
R2_ENDPOINT=<dev-r2-endpoint-url>
R2_ACCESS_KEY_ID=<dev-key-id>
R2_SECRET_ACCESS_KEY=<dev-secret>

# === Resend (email) ===
RESEND_API_KEY=<dev-resend-key>

# === Upstash Redis (rate limiting) ===
UPSTASH_REDIS_REST_URL=<dev-upstash-rest-url>
UPSTASH_REDIS_REST_TOKEN=<dev-upstash-rest-token>

# === Cloudflare Turnstile (bot protection) ===
TURNSTILE_SECRET_KEY=<dev-turnstile-secret>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<dev-turnstile-site-key>

# === Site config ===
NEXT_PUBLIC_SITE_URL=https://sivarbrains.com

# === Server Actions (generar una vez: openssl rand -base64 32) ===
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=<dev-key-openssl-rand-base64-32>

# === Build metadata (en DO real: ${_self.COMMIT_HASH}; local: git rev-parse HEAD) ===
GIT_COMMIT_HASH=<git-rev-parse-head>
```

Si `.env.local` ya apunta a la branch DEV de Neon (no a producción), esos
mismos valores de dev sirven aquí — no hace falta provisionar credenciales
nuevas solo para esta herramienta.
