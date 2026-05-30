# CLAUDE.md — ComoFuncionaSection

**§3 Cómo Funciona — Section compound D-89**

> Server Component. No 'use client'. Lissajous es Client leaf pre-existente.

## Compound API

```tsx
<ComoFuncionaSection surface="sand">
  <ComoFuncionaSection.Header
    eyebrow="§3 · Cómo funciona"
    h2Line1="Tres pasos."
    h2Line2Soft="Una sola memoria al centro."
  />
  <ComoFuncionaSection.Flow steps={[...]} />
  <ComoFuncionaSection.Steps>
    <ComoFuncionaSection.Step index={1} label="Aprende" title="..." body="..." side={[...]} />
  </ComoFuncionaSection.Steps>
</ComoFuncionaSection>
```

## ⚠️ L-BBF-216 — Reveal variant obligatorio

`.bbf-hiw-section__head-l` usa `position:sticky top:96px`.
Framer Motion `transform` en `variant="up"` rompe `position:sticky` en descendientes.

**Consumer DEBE usar `variant="fade"` en `<Header>`, NO `variant="up"`.**

```tsx
// ✅ CORRECTO
<Reveal variant="fade"><ComoFuncionaSection.Header ... /></Reveal>

// ❌ ROMPE STICKY
<Reveal variant="up"><ComoFuncionaSection.Header ... /></Reveal>
```

## Sub-components

| Component | Props | Notas |
|---|---|---|
| `Root` | `surface`, `children`, `className` | `<section>` wrapper |
| `Header` | `eyebrow?`, `h2Line1`, `h2Line2Soft` | sticky col left + H2 |
| `Flow` | `steps: FlowStep[]` | SVG inline + labels |
| `Steps` | `children` | `<ol>` wrapper |
| `Step` | `index`, `label`, `title`, `body`, `side?` | `<li>` card |

## Tokens CSS consumidos (Tier 3)

Ver `src/styles/tokens/components/como-funciona.css` — scope `.bbf-hiw-*`.

## Lissajous

`<Lissajous name="process-2d" animation="point-center" />` — preset a=5,b=4,δ=π/4.
