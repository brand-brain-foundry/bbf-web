# MethodSection — D-89 Section Compound

Server Component (Pure Server, sin 'use client').
Sub-components: Root + Header + ProcessBar + Cards + Card + Quote + CTA.

## Pattern D-89

Compound exportado via `Object.assign(Root, { Header, ProcessBar, ... })`.
Cada sub-component renderiza su parte semántica.

## Surface

Default `sand`. `data-surface="sand"` propagation para Tier 3 styling.
CSS en `src/styles/tokens/components/method.css` (FASE 3).

## L-BBF-216 nota

**NO hay sticky en ningún elemento de Method.**
`Reveal variant="up"` es SAFE para esta sección.
Wiring desde page.tsx usa Reveal INDIVIDUAL por Card (no staggerChildren wrapper).
Patrón: `{services.map((s, i) => <Reveal key={s.id} variant="up" delay={i * 100}><MethodSection.Card .../></Reveal>)}`

## Atoms reusados

- `Heading` (`display-section-h2` en Header + Quote, `h4` en Card)
- `Text` (`caption`, `body-sm`, `body-md`, `body-lg` + weight medium + tone subtle)
- `Container` (`size="wide"`)
- `Lissajous` (`name="method-2d"` — preset a=2, b=3, delta=π/2 — agregado en FASE 2)
- `Icon` (`Icons.checkCircle` en deliverables, `Icons.arrowRight` en CTA)

## Adaptaciones FASE 2 vs diseño original

- `variant="mono-md"` → no existe en Text → `variant="caption"` + `className="bbf-method-card__num"` (FASE 3 sobreescribe font-family a mono)
- `color="subtle"` → no existe en Text.color → `tone="subtle"` (prop alternativa)
- Quote `as="p"` en Heading → `asChild={true}` con `<p>` child (Radix Slot pattern, evita type error)

## Schema Payload

`SiteHomepage.method` (FASE 1, commit c26e7e8):
- `eyebrow`, `h2Line1`, `h2Line2Soft`
- `services[]` (3 items): `name`, `range`, `commit`, `body`, `deliverables[]`
- `quoteMain`, `quoteSoft`, `quoteCaption`
- `ctaText`, `ctaHref`

## Wiring page.tsx (FASE 4)

```tsx
<MethodSection surface="sand">
  <MethodSection.Header eyebrow={method.eyebrow} h2Line1={method.h2Line1} h2Line2Soft={method.h2Line2Soft} />
  <MethodSection.ProcessBar />
  <MethodSection.Cards>
    {(method.services ?? []).map((s, i) => (
      <Reveal key={s.id ?? `svc-${i}`} variant="up" delay={i * 100}>
        <MethodSection.Card index={i + 1} name={s.name} range={s.range} commit={s.commit} body={s.body} deliverables={s.deliverables} />
      </Reveal>
    ))}
  </MethodSection.Cards>
  <MethodSection.Quote main={method.quoteMain ?? ''} soft={method.quoteSoft ?? ''} caption={method.quoteCaption ?? ''} />
  <MethodSection.CTA text={method.ctaText ?? ''} href={method.ctaHref ?? '/metodo'} />
</MethodSection>
```

## Styling

Clases BEM prefix `bbf-method-*` — todas sin estilos en FASE 2.
FASE 3 crea `src/styles/tokens/components/method.css` con layout completo.
