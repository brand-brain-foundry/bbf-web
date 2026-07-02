# syntax=docker/dockerfile:1
# Dockerfile multi-stage — Railway (B-BBF-WEB-RAILWAY-EJECUCION-01)
# Requiere next.config.mjs con output: 'standalone'.

# ---- deps ----
FROM node:22-slim AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- builder ----
FROM node:22-slim AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time env vars requeridas por src/lib/env.ts (Zod parse al import de next build).
# DO App Platform pasa build args via `docker build --build-arg` — declarar ARG aquí
# los expone como env vars al proceso `RUN` de esta etapa (no persisten a runner).
ARG DATABASE_URL
ARG PAYLOAD_SECRET
ARG R2_BUCKET
ARG R2_ENDPOINT
ARG R2_ACCESS_KEY_ID
ARG R2_SECRET_ACCESS_KEY
ARG RESEND_API_KEY
ARG UPSTASH_REDIS_REST_URL
ARG UPSTASH_REDIS_REST_TOKEN
ARG TURNSTILE_SECRET_KEY
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_SITE_URL
# B-BBF-WEB-FIX-SERVER-ACTIONS-01: sin esta key, Next.js genera una aleatoria en cada
# build/boot — self-hosted en output:'standalone' esto rompe Server Actions entre
# builds (y potencialmente entre restarts de un mismo build, o entre réplicas si hay
# más de una instancia). MISMA key requerida en runtime (ver comentario en runner stage).
# Generar una vez con: openssl rand -base64 32 — setear en DO como build-time Y runtime.
ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
# B-BBF-WEB-FIX-BUILDID-01: buildId estable por commit — sin esto, cada build genera
# un ID aleatorio y los Server Actions del bundle viejo mueren al redeploy
# ("Failed to find Server Action"). DO inyecta el valor via App Spec (${_self.COMMIT_HASH}
# con scope BUILD_TIME); .git no está disponible en este build context (ver .dockerignore),
# así que no se puede leer el commit con git rev-parse.
ARG GIT_COMMIT_HASH
ENV GIT_COMMIT_HASH=$GIT_COMMIT_HASH
RUN pnpm build

# ---- runner ----
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: NO se declara ENV aquí (sería fijarla en la imagen,
# server-only value no debe viajar en capas). DO debe inyectarla como env var runtime
# (docker run -e) con el MISMO valor pasado como build-arg arriba — si no coincide,
# el problema persiste igual. Server (proceso corriendo) la necesita para decriptar los
# action IDs que el cliente pide, generados en build con esta misma key.
RUN corepack enable
# sharp requiere su binario nativo compilado para ESTA imagen — copiar
# node_modules de otra etapa/arch puede romperlo silenciosamente en runtime.
RUN npm rebuild sharp

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
