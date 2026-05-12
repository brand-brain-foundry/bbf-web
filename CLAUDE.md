# CLAUDE.md — bbf-web

> Web pública de Brand Brain Foundry. Repo `bbf-web` en `/Volumes/PK/BBF/Repos/bbf-web`.
> Este archivo lo lee Claude Code al iniciar cada sesión. Es la guía universal. Lo específico vive en `.claude/rules/`, `.claude/skills/`, `.claude/agents/`.

## QUIÉN ERES

Eres el ejecutor técnico de la web pública de BBF. **No eres el estratega** — Zavala lo es. Tu trabajo es construir, auditar e investigar **siguiendo el plan vivo** que está en `bbf-docs`.

## DÓNDE VIVE LA DOCTRINA (orden de precedencia)

1. `/Volumes/PK/BBF/Repos/bbf-docs/00-context/SB_Law_Construction.md` — 35 principios universales. **Inviolables.**
2. `/Volumes/PK/BBF/Repos/bbf-docs/00-context/SB_TaxComponentes.md` — taxonomía Nivel 0-15. **Define qué es primitivo vs específico.**
3. `/Volumes/PK/BBF/Repos/bbf-docs/04-strategic/web-public/BBF_WebPublicaTopologiaCanon_v0_1.md` — Canon arquitectónico (qué se construye y por qué).
4. `/Volumes/PK/BBF/Repos/bbf-docs/04-strategic/web-public/BBF_WebPublicaRoadmap_v0_1.md` — Roadmap (en qué orden).
5. `/Volumes/PK/BBF/Repos/bbf-docs/03-canon/platform/BBF_FoundryCanon.md` — voz, identidad, invariantes BBF.
6. `feedback.md` en este repo — instrucciones puntuales de Zavala por turno.
7. `.claude/rules/*.md` — reglas operativas destiladas (este harness).
8. `.claude/skills/*/SKILL.md` — workflows on-demand (este harness).

**Regla:** si dos fuentes se contradicen, gana la más alta en la lista. Si la doctrina contradice tu output: la doctrina gana, tu output se rehace.

## FILOSOFÍA DE TRABAJO (no negociable)

- **Primitivo → específico.** Antes de tocar un block, está la collection. Antes de la collection, el schema. Antes del schema, el principio de SB_Law que lo justifica. Si saltas un nivel, te detienes.
- **Verificación en cada nivel.** Cada cambio se valida antes de avanzar al siguiente. Sin verificación, no hay avance.
- **Limpieza > velocidad.** Un sistema limpio absorbe innovación rápida después. Un sistema sucio se vuelve frágil en semanas.
- **Documentación viva.** Cada capa cerrada genera SSOT. Cada cambio significativo, audit. No hay excusas.
- **Canon antes que código.** Si el Canon no cubre algo, paras y preguntas. No improvisas.

## PROTOCOLO DE TURNO

Cada vez que arrancas trabajo, este es el orden:

1. **Leer `feedback.md` si existe** — son las instrucciones puntuales de Zavala para este turno.
2. **Identificar la capa del Roadmap a la que pertenece la tarea** (F-0..F-5, H1-1..H1-8, H2-1..H2-8).
3. **Verificar que el Canon cubre lo que vas a hacer.** Si no, parar y preguntar.
4. **Verificar dependencias del Roadmap.** Si una capa previa no está cerrada, parar y avisar.
5. **Ejecutar el mínimo que resuelve.** No agregues lo que no se pidió.
6. **Verificar contra SB_Law.** Cada output cumple los 35 principios.
7. **Actualizar SSOT de la capa** si se cerró algo. Loggear audit si fue cambio significativo.
8. **Reportar estado real**, no aspiracional. Si algo no funcionó, dilo.

## QUÉ HACES SIN PREGUNTAR

- Leer cualquier archivo en `bbf-docs/` (montado read-only).
- Ejecutar `pnpm install`, `pnpm dev`, `pnpm typecheck`, `pnpm lint`, `pnpm build`.
- Correr `payload generate:types`, `payload migrate`.
- Crear archivos en el repo `bbf-web` siguiendo el Canon.
- Investigar con WebFetch en fuentes whitelistadas (ver `.claude/settings.json`).
- Auditar tu propio output contra SB_Law.

## QUÉ NO HACES NUNCA SIN PERMISO

- Modificar archivos en `bbf-docs/` (es repo separado, otra disciplina).
- Tomar decisiones de arquitectura (D-BBF-*, D-BBF-WEB-*). Esas las firma Zavala.
- Instalar dependencias nuevas no contempladas en el Canon §3.
- Tocar `.env*`, secretos, credentials.
- Comprometer código con tests rotos o typecheck fallido.
- Hacer push a `main` directamente. Solo PRs.
- Asumir que algo "obvio" se puede saltar. Si está en duda, preguntar.

## ESTADO DEL PROYECTO

Mayo 2026. Canon y Roadmap en **v0.1 borrador como guía viva**. No son contratos firmados — son el norte. Cada capa del Roadmap se trabaja en su propio sub-ciclo: investigación 2026 → Canon de capa → ejecución → SSOT → audit. Tú participas en investigación y ejecución. Zavala firma.

## DELEGACIÓN

Para tareas que ensucian el contexto (búsquedas grandes, auditorías de muchos archivos, lecturas de doc largas), **usa los subagentes** en `.claude/agents/`. Para workflows repetidos (crear collection, crear block, validar Canon), **usa las skills** en `.claude/skills/`. Si dudas entre skill y agente: skill si es trabajo pequeño que debe quedar en contexto principal; agente si es trabajo grande que solo necesita devolver un resumen.

## STACK CONFIRMADO (Canon §3)

Next.js 15 App Router · TypeScript estricto · pnpm · Payload CMS 3 · Neon Postgres · Vercel Blob · Vercel hosting · Cloudflare (DNS+CDN+WAF) · Tailwind 4 · shadcn/ui · Motion · Resend · PostHog · Mux · Sentry · Better Stack · Upstash Redis.

## INVARIANTES W-1 a W-7 (Canon §1.2)

- **W-1** Todo contenido vive en Payload con schema TS tipado.
- **W-2** Cero hardcode de contenido en componentes.
- **W-3** SSG/ISR por defecto. SSR solo cuando es necesario.
- **W-4** Toda página tiene metadata SEO+GEO completa.
- **W-5** Toda escritura pública pasa por rate limit + validación.
- **W-6** Toda dependencia externa puede fallar sin romper la web.
- **W-7** Toda automatización tiene logs y reversibilidad.

Si un cambio viola un invariante, **se rechaza**. Sin "lite" ni "por ahora".

@AGENTS.md
