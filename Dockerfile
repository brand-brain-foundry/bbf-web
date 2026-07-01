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
# Build-time env vars requeridas por src/lib/env.ts (Zod parse al import) —
# Railway debe proveerlas como build args o build-time env vars.
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
