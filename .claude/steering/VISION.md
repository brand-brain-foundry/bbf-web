# VISION.md — Norte estratégico de bbf-web

> Actualizado: 2026-07-06 — Pivote BBF → Sivar Brains (snapshot pre-pivote en docs-pre-hub/sb-web/06-archive/).
> Esto **no es** un README de cómo correr el proyecto. Es el norte: por qué existe, qué se construye, qué se rechaza.
> Cuando dudes entre dos caminos: vuelve aquí.

## La web pública de Sivar Brains no es un escaparate

Es una **fábrica de contenido optimizada para recuperación de IA y buscadores**.

Eso significa:
- Lo importante no es cómo se ve. Es **cómo se cita** desde ChatGPT, Claude, Perplexity, Google AI.
- Lo importante no es la primera impresión visual. Es que **un agente IA pueda extraer la idea central en 60 palabras y atribuir correctamente a Sivar Brains**.
- Lo importante no es "marketing" en sentido tradicional. Es **infraestructura de presencia**.

Si una decisión empuja hacia "más visual, menos indexable": probablemente está mal.
Si una decisión empuja hacia "más extractable por IA, más cita-amigable": probablemente está bien.

## 5 cosas que esta web hace

1. **Publica continuamente.** Blog manual primero, AI-assisted después. Posts, casos, episodios de podcast.
2. **Se cita desde IA.** GEO foundational (llms.txt, schema.org, Answer Capsules) es prioridad.
3. **Convierte visitantes en suscriptores.** Newsletter con double opt-in, email transaccional vía Resend.
4. **Existe en dos idiomas.** ES default, EN paralelo, ambos first-class.
5. **Es base de futuro.** El brand system, los schemas, la auth — todo está preparado para integración con CM-L (sivar-brains).

## 5 cosas que esta web NO hace (no caigas en la tentación)

1. **No es app web.** Sin login de usuarios. Sin dashboards. Eso es CM-L (sivar-brains).
2. **No es e-commerce.** Si llega un día: extensión, no core.
3. **No es CMS as a service.** Payload es nuestro CMS, no producto público.
4. **No es portfolio personal de Zavala.** Es voz Sivar Brains, no voz Zavala.
5. **No es experimento de "AI publica todo solo".** Hay 3 modos AI: Assist (default), Supervised (futuro), Autonomous (lejano).

## Por qué Payload (y no algo más simple)

- **Schema-as-code.** Tipos auto-generados desde TypeScript → una sola fuente de verdad (C-01).
- **MCP nativo.** Cuando AI publique vía Claude Desktop, el plugin MCP de Payload lo habilita.
- **Self-hosted en MIT.** Cero lock-in.
- **Next.js native.** Vive en el mismo repo, mismo deploy, mismo route group `(payload)`.

## Por qué el orden del Roadmap importa

Foundation-first, no feature-first. Construir el blog antes de que Cloudflare esté frente a Vercel es invitar problemas.

**La regla:** una capa no se considera cerrada hasta que su SSOT está firmado. Una capa siguiente no arranca hasta que la anterior está cerrada.

**La excepción:** investigaciones pueden correr en paralelo. Construcción no.

## Por qué multilingüe desde día 1

- Sivar Brains apunta a mercado centroamericano + mercados angloparlantes.
- Refactorizar i18n después es 10x más caro que diseñarlo first-class.
- ES default porque Zavala escribe en ES primero. EN como segundo carril.

## La decisión que más cuesta y que sostiene todo: "Canon antes que código"

Cada vez que alguien (incluido Claude Code) escribe código sin Canon firmado, está acumulando deuda doctrinaria.

Por eso:
- Si la capa no tiene Canon firmado: **no se construye**.
- Si la sub-decisión no está firmada por Zavala: **se pausa y se pide firma**.
- Si Claude Code "tuvo que decidir algo en el camino": va al ESTADO_CANONICO del hub como decisión pendiente de firma.

## El criterio último

> Si dudas: vuelve a `.claude/rules/00-sb-law.md`. Si la ley no resuelve: pausa y pregunta.
> Mejor un turno pausado que un turno que ensucia el sistema.
