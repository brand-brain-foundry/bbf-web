# CaseMediaFrame

**Tipo:** Molecule — compound pattern (D-86, D-89)  
**Surface:** Diseñado para `data-surface="dark"`. No funciona sobre warm/sand sin adaptación.  
**Decisión origen:** D-CASO-1 — no extiende HeroMediaFrame por divergencia semántica: `live` ≠ `REC`.  
**Score de reutilización:** 6/10 — API genérica, nombre atado a "case". Ver sección de evolución.

---

## API

### CaseMediaFrame (root)

```tsx
<CaseMediaFrame className?="...">
  <CaseMediaFrame.Chrome ... />
  <CaseMediaFrame.Body ... />
</CaseMediaFrame>
```

### CaseMediaFrame.Chrome

```typescript
interface CaseMediaFrameChromeProps {
  label?: string | null;    // left chip label (e.g. "SIVAR-BRAINS · WhatsApp Business · live")
  timestamp?: string | null; // right decorative text (e.g. "captura · 23:04 viernes")
  live?: boolean;            // show green pulse dot — default: true
  className?: string;
}
```

### CaseMediaFrame.Body

```typescript
interface CaseMediaFrameBodyProps {
  children?: ReactNode;     // media content (image, video, HeroVideo). If null → placeholder.
  placeholderText?: string; // default: "Captura · próximamente"
  className?: string;
}
```

---

## Uso canónico (§3 Caso)

```tsx
<CaseMediaFrame>
  <CaseMediaFrame.Chrome
    label={cs.mediaChromeLabel ?? 'SIVAR-BRAINS · WhatsApp Business · live'}
    timestamp={cs.mediaTimestamp ?? 'captura · 23:04 viernes'}
    live
  />
  <CaseMediaFrame.Body>
    {videoSources.length > 0 ? (
      <HeroVideo controls preload="metadata" poster={posterUrl}>
        {videoSources.map(s => <HeroVideo.Source key={s.src} src={s.src} type={s.type} />)}
      </HeroVideo>
    ) : null}
  </CaseMediaFrame.Body>
</CaseMediaFrame>
```

Si `children` es `null`, renderiza placeholder automáticamente. No es necesario pasarlo.

---

## Comparación con HeroMediaFrame

| Aspecto | HeroMediaFrame | CaseMediaFrame |
|---|---|---|
| Surface | warm (`#ebe3d4`) | dark (`#0a0a0a`) |
| Semántica del chrome | `REC` (grabando) | `live` (operando) |
| Pulse color | Rojo coral | Verde (`#16a34a`) |
| Tiene Foot sub-component | Sí | No |
| Media shell | `VideoShell` (16:9 enforced) | `Body` (16:9 enforced) |
| Uso | §1 Hero (único) | §3 Caso, posibles §5/§6 |

---

## Cuándo usarlo

- Mostrar un caso real, producto, demo o captura en frame estilo "terminal live" sobre dark surface
- Contexto semántico: "esto está operando", no "esto se está grabando"

## Cuándo NO usarlo

- **§1 Hero:** usar `HeroMediaFrame` (semántica REC, surface warm)
- Frames sobre warm/sand surface: requeriría modificaciones de tokens y CSS no diseñadas
- Si el chrome necesita mostrar estado `off-air` o `recording`: evaluar extensión primero

---

## Decisión de evolución (D-AUDIT-02)

NO renombrar especulativamente. Si §5/§6 necesitan un frame sobre dark con semántica distinta a "live":
1. Evaluar si `live?: boolean` se puede extender a `status?: 'live' | 'off-air' | 'static'`
2. Si la divergencia es mayor → crear `MediaFrameDark` con `variant` prop
3. Decisión en ese momento con Zavala, no ahora

---

## CSS

`src/styles/tokens/components/case-media-frame.css`  
Scope: `.bbf-case-media-frame-*`  
Token set: `--bbf-*-on-dark-surface` de `semantic/colors-dark.css`

Hardcode justificado: `background: #16a34a` para live dot (verde de estado, no color BBF brand).  
Candidato futuro: `var(--bbf-color-success-500)` si se standardiza.
