---
description: SEO + GEO (Generative Engine Optimization). Invariante W-4 obligatorio en cada página.
globs: ["app/**", "lib/seo/**", "lib/geo/**", "collections/**"]
alwaysApply: false
---

# Regla 50 — SEO + GEO (invariante W-4)

> **Fuente Canon:** `BBF_WebPublicaTopologiaCanon_v0_1.md` §5 completo.
> **Doctrina:** la web BBF no es escaparate. Es fábrica de recuperación para IA + buscadores.

## Tres capas obligatorias en cada page

### 1. Meta tags HTML
- `<title>` 50-60 chars, localized.
- `<meta name="description">` 150-160 chars, localized.
- OG image (estática para core, dinámica `/api/og?slug=...` para blog/cases).
- Twitter Card `summary_large_image`.
- Canonical + hreflang (ver regla 30-i18n).

### 2. Schema.org JSON-LD (Canon §5.2.3)
- **Organization** en layout root, todas las páginas.
- **Article** en cada Post.
- **CaseStudy** custom schema en cada Case (ver fuente Canon).
- **FAQPage** en páginas con preguntas frecuentes (aumenta citaciones IA).
- **BreadcrumbList** en páginas anidadas.
- **PodcastEpisode** + **PodcastSeries** para podcast.
- **Person** en author pages.

Cada JSON-LD lleva `inLanguage`.

### 3. GEO foundational (Canon §5.2.1, §5.2.2)
- `robots.txt` — **distinción training vs retrieval (R-BBF-CCBOT-01, D-CCBOT-01)**:
  - **PERMITIR** (retrieval/citation crawlers — traen tráfico de IA):
    OAI-SearchBot, Claude-User, ChatGPT-User, PerplexityBot, Perplexity-User, anthropic-ai, ClaudeBot, Bingbot, cohere-ai, Amazonbot, meta-externalagent, FacebookBot, Google-Extended, GPTBot, Applebot-Extended
  - **BLOQUEAR** (training crawlers — consumen contenido sin citar ni dirigir tráfico):
    CCBot (Common Crawl training corpus). Decisión firmada D-CCBOT-01.
  - **Regla general**: `User-agent: *` con `Allow: /` cubre cualquier retrieval bot no listado explícitamente. Nunca aplicar `Disallow: /` a `User-agent: *`.
  - **`/admin/` y `/api/`** siempre `Disallow` para todos los bots.
- `llms.txt` — mapa para LLMs. Versiones ES + EN.
- `llms-full.txt` — contenido completo. Decisión simple vs full: pendiente (Canon §16).
- `sitemap.xml` con hreflang.
- `feed.xml` (RSS) y `podcast.xml` (Apple Podcasts spec).

## On-page GEO en cada Post (Canon §5.3)

Toda Post tiene:
1. **TL;DR / Answer Capsule de 40-60 palabras** debajo del primer H2. Campo `summary` localized.
2. **Claims con evidencia inline** (cita fuente, año, dato específico).
3. **Q&A sections** — cada H3 puede ser una pregunta.
4. **Data tables** cuando aplique.
5. **Author + date + updateDate visibles** (no solo en meta).
6. **Información densa**, sin filler text.
7. **Update frequency alta** especialmente para Perplexity.

## Tag taxonomy (Canon §4.1.4)

Cada Tag lleva `kind`:
- `concept` — ej: "knowledge brain", "RAG", "multi-tenant"
- `tool` — ej: "Payload", "Next.js", "Pinecone"
- `sector` — ej: "hospitality", "food-service"

Esto habilita filtrado polifacético y citación contextual desde IAs.

## Internal linking

- Cada Post enlaza a 2-5 Posts/Cases relacionados.
- Cada Case enlaza a Posts que lo expanden.
- Author pages enlazan a sus posts.
- No abuses: máximo 10 internal links por 1000 palabras.

## Métricas norte (Canon §5.5)

Tracking manual (no automático en Fase 1):
- **Share of Model (SoM)**: % de respuestas donde BBF es citada en query set de 30 prompts.
- **Citation Frequency**: total menciones por query set.
- **Referral from AI**: `utm_source=chatgpt`, `perplexity`, `claude` tracked en PostHog.

Lista de 30 queries baseline vive en `bbf-docs/04-strategic/web-public/BBF_SEOGEOAudits/BBF_SEOGEOAudit_baseline.md`. **Tú no la inventas, Zavala la define.**

## Validaciones antes de publish

Hook `Posts.beforeChange` verifica:
- `seoMeta.title` entre 30 y 65 chars.
- `seoMeta.description` entre 130 y 165 chars.
- `summary` entre 30 y 80 palabras (Answer Capsule).
- `content` tiene al menos un H2 antes del primer H3.
- Al menos 1 tag, al menos 1 categoría, al menos 1 author.
- Si falta cualquiera de los anteriores: rechaza el cambio con error claro.

## Lo que NO haces

- No metas keyword stuffing.
- No copies meta descriptions automáticas. Cada una es escrita o supervisada.
- No reemplaces el Answer Capsule por un párrafo genérico. Es la pieza más importante para GEO.
- No bloquees AI bots en robots.txt (es lo contrario de lo que queremos).
