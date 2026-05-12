# VISION.md — Norte estratégico de bbf-web

> Esto **no es** un README de cómo correr el proyecto. Eso vive en el README.md del repo.
> Esto **es** el norte: por qué este sistema existe, qué se construye, qué se rechaza.
> Cuando dudes entre dos caminos: vuelve aquí.

## La web pública de BBF no es un escaparate

Es una **fábrica de contenido optimizada para recuperación de IA y buscadores**.

Eso significa:
- Lo importante no es cómo se ve. Es **cómo se cita** desde ChatGPT, Claude, Perplexity, Google AI.
- Lo importante no es la primera impresión visual. Es que **un agente IA pueda extraer la idea central en 60 palabras y atribuir correctamente a Brand Brain Foundry**.
- Lo importante no es "marketing" en sentido tradicional. Es **infraestructura de presencia**.

Si una decisión empuja hacia "más visual, menos indexable": probablemente está mal.
Si una decisión empuja hacia "más extractable por IA, más cita-amigable": probablemente está bien.

## 5 cosas que esta web hace

1. **Publica continuamente.** Blog manual primero, AI-assisted después. Posts, casos, episodios de podcast.
2. **Se cita desde IA.** GEO foundational (llms.txt, schema.org, Answer Capsules) es prioridad.
3. **Convierte visitantes en suscriptores.** Newsletter con double opt-in, email transaccional vía Resend.
4. **Existe en dos idiomas.** ES default, EN paralelo, ambos first-class.
5. **Es base de futuro.** El brand system, los schemas, la auth — todo está preparado para que cuando llegue `app.brandbrainfoundry.com` (webapp con CM-L) sume sin refactor mayor.

## 5 cosas que esta web NO hace (no caigas en la tentación)

1. **No es app web.** Sin login de usuarios. Sin dashboards. Eso es `bbf-webapp`, repo separado.
2. **No es e-commerce.** Si llega un día: extensión, no core.
3. **No es CMS as a service.** Payload es nuestro CMS, no producto público.
4. **No es portfolio personal de Zavala.** Es voz BBF, no voz Zavala. (Zavala tiene su propio canal autoral, ese es otro canon.)
5. **No es experimento de "AI publica todo solo".** Hay 3 modos AI: Assist (default), Supervised (futuro), Autonomous (lejano). Día 1 es Assist.

## Por qué Payload (y no algo más simple)

- **Schema-as-code.** Tipos auto-generados desde TypeScript → una sola fuente de verdad (C-01).
- **MCP nativo.** Cuando AI publique vía Claude Desktop, el plugin MCP de Payload lo habilita.
- **Self-hosted en MIT.** Cero lock-in (Canon §14 riesgo Payload-abandono mitigado por MIT license).
- **Next.js native.** Vive en el mismo repo, mismo deploy, mismo route group `(payload)`.

Alternativas consideradas y rechazadas:
- Markdown en repo (Astro/MDX) → no escala a AI publicación + no es referenciable.
- Sanity, Contentful → buenos pero SaaS lock-in.
- Strapi → menos integrado con Next.js que Payload.

## Por qué el orden del Roadmap importa

Foundation-first, no feature-first. Construir el blog antes de que Cloudflare esté frente a Vercel es invitar problemas. Construir el AI content automation antes de tener Audits collection es perder trazabilidad.

**La regla:** una capa no se considera cerrada hasta que su SSOT está firmado. Una capa siguiente no arranca hasta que la anterior está cerrada.

**La excepción:** investigaciones pueden correr en paralelo. Construcción no.

## Por qué multilingüe desde día 1

- BBF apunta a mercado salvadoreño (sivar-brains JV) + mercados angloparlantes.
- Refactorizar i18n después es 10x más caro que diseñarlo first-class.
- Investigación industria 2026: "you don't bolt on i18n later".

ES default porque Zavala escribe en ES primero. EN como segundo carril (revisado humano en H1, automático+human en H2).

## Por qué Cloudflare delante de Vercel

- Edge cache adicional → menos egress de Vercel → menos costo.
- WAF + DDoS gratis (Cloudflare free tier).
- Bot management granular → permitir AI bots, bloquear scrapers maliciosos.
- Si Vercel sube precios: Cloudflare absorbe el cambio.

## La decisión que más cuesta y que sostiene todo: "Canon antes que código"

Cada vez que alguien (incluido Claude Code) escribe código sin Canon firmado, está acumulando deuda doctrinaria. Esa deuda se paga en refactorizaciones masivas seis meses después.

Por eso:
- Si la capa no tiene Canon firmado: **no se construye**.
- Si la sub-decisión no está firmada por Zavala: **se pausa y se pide firma**.
- Si Claude Code "tuvo que decidir algo en el camino": va a §3 del SSOT como decisión a firma retroactiva, y Zavala puede revertir.

Esto no es burocracia. Es lo que mantiene el sistema limpio bajo innovación rápida.

## El criterio último

> Si dudas: vuelve a SB_Law_Construction. Si SB_Law no resuelve: pausa y pregunta.
> Mejor un turno pausado que un turno que ensucia el sistema.
