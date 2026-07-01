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
RUN pnpm build

# ---- runner ----
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
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
