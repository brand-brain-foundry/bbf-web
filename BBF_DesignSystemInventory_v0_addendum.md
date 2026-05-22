# BBF Design System Inventory v0 — Addendum
## Header · Footer · ContactForm

**Despacho:** B-BBF-WEB-WAVE-11-0-BIS-PLUS-TDs
**Fecha:** 2026-05-22
**Método:** READ-ONLY audit (T-A-0..T-A-4 §1.2 invariante)
**Numeración TD:** TD-11-19+ (no choca con v0 §8)
**Nota:** CC NO modificó ningún archivo durante este audit.

---

## §0 — Paths encontrados (T-A-0)

```
Organism: Header
  src/components/organisms/Header/Header.tsx          (149 LOC, Server Component)
  src/components/organisms/Header/HeaderDesktopNav.tsx (145 LOC, Client Component)
  src/components/organisms/Header/index.ts

Sub-componentes Header:
  src/components/atoms/NavLink/NavLink.tsx             (113 LOC, Client Component)
  src/components/molecules/MegaMenuPanel/MegaMenuPanel.tsx (159 LOC, Client Component)
  src/components/molecules/MobileMenu/MobileMenu.tsx   (231 LOC, Client Component)
  src/components/molecules/MobileSubMenu/MobileSubMenu.tsx (172 LOC, Client Component)

Organism: Footer
  src/components/organisms/Footer/Footer.tsx          (205 LOC, Server Component)
  src/components/organisms/Footer/index.ts

Organism: ContactForm
  src/components/molecules/ContactForm/ContactForm.tsx (214 LOC, Client Component)
  src/components/molecules/ContactForm/index.ts

Página /contacto:
  src/app/(frontend)/[locale]/contacto/page.tsx        (97 LOC, Server Component)

Consumidores en layout:
  src/app/(frontend)/[locale]/layout.tsx               (Header + Footer montados aquí)
```

---

## §1 — Inventory Header

### Header.tsx (149 LOC · Server Component · data-component="bbf-header")

**Tokens consumidos:**
```
--bbf-z-header
--bbf-surface-sand          ← con /95 opacity + backdrop-blur-xl
--bbf-border-on-sand
--bbf-shadow-floating
--bbf-text-on-sand
--bbf-accent-red
--bbf-color-focus-ring
```

**Hardcoded values detectados:**
| Valor | Uso | Observación |
|-------|-----|-------------|
| `max-w-7xl` | wrapper interior | Tailwind base (1280px) — sin token BBF |
| `rounded-2xl` | floating card | Token `--bbf-radius-2xl` existe (Wave 11.1) — no consumido |
| `backdrop-blur-xl` | glass effect | Sin token BBF motion/visual |
| `h-14` / `h-16` | altura inner div | Sin semantic height token |
| `px-3 sm:px-4 lg:px-6` | padding wrapper | Magic numbers — no token |
| `pt-3 sm:pt-4` | padding top | Magic numbers — no token |
| `gap-3 sm:gap-6` | right cluster gap | No token semantic |
| `px-4 sm:px-5 lg:px-6` | inner padding | Magic numbers — no token |
| `h-11 w-11` | trigger button size | 44px touch target — sin token |

**CVA:** ❌ No existe `Header.variants.ts`
**Surface prop:** ❌ No. Surface hardcoded como `bg-[var(--bbf-surface-sand)]/95`
**A11y:**
- Logo: `aria-label="${siteName} — Home"` ✓
- `data-component="bbf-header"` ✓
- Keyboard: delegado a HeaderDesktopNav y MobileMenu
- No ARIA role en `<header>` (correcto — elemento semántico nativo) ✓

**Desvíos detectados:**
- `rounded-2xl` sin tokenizar — TD-11-20

---

### HeaderDesktopNav.tsx (145 LOC · Client Component · data-component="bbf-header-desktop-nav")

**Tokens consumidos:** ninguno directo (hereda via NavLink + MegaMenuPanel)

**Hardcoded values:**
| Valor | Uso |
|-------|-----|
| `gap-6` | gap entre NavLinks |
| `150` (ms) | timeout close mega menu — sin motion token |

**CVA:** ❌ No
**A11y:**
- `aria-label="Main navigation"` ✓
- Escape key → cierra mega menu ✓
- Click outside → cierra mega menu ✓
- `aria-expanded`, `aria-controls` en NavLink ✓
- `aria-haspopup="true"` en NavLink trigger ✓

---

### NavLink.tsx (113 LOC · Client Component · data-component="bbf-nav-link")

**Tokens consumidos:**
```
--bbf-text-on-sand
--bbf-accent-red
--bbf-color-focus-ring (implícito vía focus-visible utility)
```

**Hardcoded values:**
| Valor | Uso | TD |
|-------|-----|----|
| `-bottom-1` (−4px) | underline offset bajo baseline | TD-11-15 (ya identificado, fix en T-B-4) |
| `h-3.5 w-3.5` | chevron size | Sin token icon-size |
| `300ms` (via ease-out) | transition underline | No consume `--bbf-motion-*` |

**CVA:** ❌ No (funciona como atom, debería tener variants.ts)

---

### MobileMenu.tsx (231 LOC · Client Component)

**Tokens consumidos:**
```
--bbf-text-on-sand
--bbf-surface-hover-on-sand
--bbf-color-focus-ring
--bbf-z-drawer
--bbf-z-drawer-panel
--bbf-surface-sand
--bbf-border-on-sand
--bbf-accent-red
```

**Hardcoded values:**
| Valor | Uso |
|-------|-----|
| `w-[85vw] max-w-[380px]` | panel width — sin token |
| `h-[100dvh]` | panel height — correcto (dvh) |
| `min-h-[44px]` | touch target — sin token pero WCAG correcto |
| `px-6 py-5` | panel header padding |
| `py-6 px-6` | nav section padding |
| `h-9 w-9 rounded-full` | close button size |
| `py-8` | footer section padding |
| `text-sm font-bold` | siteName en panel header — inline typography |
| `280ms` | transition duration — sin `--bbf-motion-*` token |
| `cubic-bezier(0.32,0.72,0,1)` | easing — sin `--bbf-easing-*` token |
| `bg-black/40 backdrop-blur-sm` | backdrop overlay — sin surface token |

**A11y:**
- `role="dialog"` ✓, `aria-modal="true"` ✓, `aria-label` ✓
- `aria-expanded` en trigger ✓
- Focus management en open ✓, restore en close ✓
- Scroll lock pattern correcto (position fixed + scrollY restore) ✓
- Escape key ✓

**TD-11-22:** panel width `85vw max-w-[380px]` sin token

---

### MegaMenuPanel.tsx (159 LOC · Client Component)

**Tokens consumidos:**
```
--bbf-z-mega-menu
--bbf-surface-sand
--bbf-border-on-sand
--bbf-shadow-floating
--bbf-surface-hover-subtle-on-sand   ← migrado Wave 11.1
--bbf-surface-hover-on-sand          ← migrado Wave 11.1
--bbf-text-on-sand
--bbf-accent-red
--bbf-color-focus-ring
```

**Estado Wave 11.1:** hover tokens migrados a Tier 2 ✓

---

### MobileSubMenu.tsx (172 LOC · Client Component)

**Tokens consumidos:**
```
--bbf-border-on-sand
--bbf-text-on-sand
--bbf-accent-red
--bbf-color-focus-ring
--bbf-surface-hover-subtle-on-sand   ← migrado Wave 11.1
--bbf-text-on-sand-muted
```

**Estado Wave 11.1:** hover tokens migrados ✓

---

## §2 — Inventory Footer

### Footer.tsx (205 LOC · Server Component · data-component="bbf-footer")

**Tokens consumidos:**
```
Surfaces:
  --bbf-surface-sand

Borders:
  --bbf-border-on-sand

Text:
  --bbf-text-on-sand
  --bbf-text-on-sand-muted
  --bbf-text-on-sand-subtle

Accent:
  --bbf-accent-red

Typography tokens (via arbitrary Tailwind):
  --bbf-font-display
  --bbf-text-base, --bbf-text-sm, --bbf-text-xs, --bbf-text-micro
  --bbf-leading-snug, --bbf-leading-snug-small, --bbf-leading-base
  --bbf-tracking-tight, --bbf-tracking-wider
  --bbf-weight-bold, --bbf-weight-medium, --bbf-weight-regular
```

**Hardcoded values:**
| Valor | Uso | Severidad |
|-------|-----|-----------|
| `mt-20 lg:mt-32` | section top margin | MEDIUM — debería usar `--bbf-space-section-gap-lg/xl` |
| `py-12 lg:py-16` | section padding vertical | MEDIUM — parcialmente cubierto por section-gap tokens |
| `px-6 sm:px-8 lg:px-10` | horizontal padding | LOW |
| `mb-10 lg:mb-12` | grid bottom margin | LOW |
| `gap-12 md:gap-8 lg:gap-10` | grid gaps | LOW |
| `max-w-7xl` | container | SIN token BBF (mismo que Header) |
| `max-w-xs` | shortDescription limit | LOW |
| `py-1` / `gap-2` / `gap-3` | link spacing | LOW — valores pequeños |
| `pt-6` | bottom bar padding | LOW |
| `gap-2` / `py-5` | bottom bar | LOW |
| `[1.4fr_repeat(...)_1.4fr]` | grid template | Complejo, OK por lógica dinámica |

**Newsletter:** embebido via `<NewsletterBox>` ✓ (cubierto en v0)
**CVA:** ❌ No
**Surface prop:** ❌ No. Hardcoded `bg-[var(--bbf-surface-sand)]`
**A11y:**
- `<footer>` semántico ✓
- `<nav aria-label={group.groupTitle}>` por cada grupo ✓
- `hover:translate-x-0.5` — animación con `will-change: auto` implícito (OK)

**Desvíos detectados:**
- **TD-11-24:** `mt-20 lg:mt-32` — margins de sección sin tokenizar. Tokens `--bbf-space-section-gap-md/lg/xl` existen pero no se usan.
- **TD-11-25:** `py-12 lg:py-16` — padding vertical sin tokenizar.

---

## §3 — Inventory ContactForm + página /contacto

### ContactForm.tsx (214 LOC · Client Component · data-component="bbf-contact-form")

**Tokens consumidos:**
```
Feedback:
  --bbf-color-success-bg    ← definido en semantic/feedback.css ✓
  --bbf-color-success-text  ← definido ✓
  --bbf-color-error-bg      ← definido ✓
  --bbf-color-error-text    ← definido ✓
```

**Validación:**
- Zod schema: `contactSchema` en `src/lib/schemas/contact` ✓
- zodResolver integrado con react-hook-form ✓
- `mode: 'onBlur'` ✓

**Server action:**
- `submitContact` importado de `src/lib/actions/contact` ✓
- `useActionState` pattern (Next.js 15 Server Actions) ✓
- NO usa fetch HTTP — correcto (C-02)

**Estados de form:**
| Estado | Implementación |
|--------|----------------|
| idle | form normal visible |
| submitting | `useFormStatus` → pending=true → label cambia |
| verifying | turnstileReady=false → "Verificando..." |
| success | state.success → banner verde + reset() |
| error | state.success=false → banner rojo |

**Turnstile:**
- Integrado vía `<Turnstile>` component ✓
- `size="flexible"` ✓
- `theme="auto"` ✓
- Callbacks stable vía `useCallback` ✓ (evita re-render loop)

**Honeypot:**
- Campo `website` oculto con `position: absolute; left: -9999px` ✓
- `aria-hidden="true"` en wrapper ✓
- `tabIndex={-1}` ✓
- Implementación: inline style en lugar de utility class — funcional pero no canon CSS

**Hardcoded values:**
| Valor | Uso |
|-------|-----|
| `rounded-2xl p-6` | response status banner |
| `gap-5 lg:gap-6` | form fields gap |
| `flex flex-col` | layout base |

**A11y:**
- `role="status"` en success ✓, `role="alert"` en error ✓
- `aria-live="polite"` ✓
- `id="bbf-contact-form"` para targeting ✓
- Labels via FormField: `htmlFor` implícito vía react-hook-form register ✓
- Submit disabled state durante pending ✓
- `noValidate` en form (valida via Zod) ✓

---

### contacto/page.tsx (97 LOC · Server Component)

**Tokens consumidos:**
```
--bbf-surface-sand
--bbf-text-on-sand
--bbf-text-on-sand-muted
--bbf-leading-tight, --bbf-leading-snug, --bbf-leading-base
--bbf-tracking-tight
--bbf-weight-semibold, --bbf-weight-medium
--bbf-font-display
--bbf-text-display-2, --bbf-text-display-1, --bbf-text-h1, --bbf-text-base
```

**SEO:**
- `generateMetadata` ✓
- `buildHreflang` ✓
- `openGraph` ✓
- `dynamic = 'force-dynamic'` ✓ (form page)

**Hardcoded values:**
| Valor | Uso | Severidad |
|-------|-----|-----------|
| `min-h-[calc(100vh-4rem)]` | page min height | MEDIUM — dvh preferido sobre vh |
| `pt-24 pb-20 lg:pt-32 lg:pb-32` | page padding | LOW — no usa section-gap tokens |
| `mb-12 lg:mb-16` | hero→form gap | LOW |
| `space-y-4 lg:space-y-6` | hero internals | LOW |
| `max-w-[60ch]` | intro text limit | LOW — similar a --bbf-container-prose |

**Atom canon compliance:**
- `<h1>` y `<p>` usados directamente (no `<Heading>` ni `<Text>` atoms) — patrón divergente del `app/CLAUDE.md §D-90` que dice "0 inline styles, composition via atoms"
- Funcional pero inconsistente con el patrón atom-first

---

## §4 — Síntesis para Wave 11.6/11.7/12-14

### Conteo de desvíos por organismo

| Organismo | Hardcoded values | TDs nuevas | Severidad agregada |
|-----------|-----------------|------------|-------------------|
| Header (completo) | ~15 | 2 (TD-11-20, TD-11-22) | MEDIUM×1, LOW×1 |
| Footer | ~12 | 2 (TD-11-24, TD-11-25) | MEDIUM×2 |
| ContactForm | ~4 | 1 (TD-11-28) | LOW×1 |
| Página /contacto | ~5 | 2 (TD-11-26, TD-11-27) | LOW×2 |
| Container tokens | — | 1 (TD-11-19) | CRITICAL×1 |

### TDs nuevas abiertas (TD-11-19 al TD-11-28)

| ID | Componente | Descripción | Severidad |
|----|-----------|-------------|-----------|
| **TD-11-19** | Container/semantic | Token naming conflict: semantic usa `prose/narrow/default/wide/max/full` vs Component usa `sm/md/lg/xl/2xl/prose`. Además `prose` tiene valor distinto (65ch semantic vs 70ch component). Bloquea T-B-3. | CRITICAL |
| **TD-11-20** | Header | `rounded-2xl` hardcoded en floating card — token `--bbf-radius-2xl` existe pero no consumido | MEDIUM |
| **TD-11-21** | Header | `h-14 sm:h-16` sin semantic height token | LOW |
| **TD-11-22** | MobileMenu | Panel width `w-[85vw] max-w-[380px]` sin token | LOW |
| **TD-11-23** | NavLink | Sin `NavLink.variants.ts` (atom debería seguir CVA canon D-95) | LOW |
| **TD-11-24** | Footer | `mt-20 lg:mt-32` sin tokenizar — tokens section-gap existen pero no se usan | MEDIUM |
| **TD-11-25** | Footer | `py-12 lg:py-16` padding vertical sin tokenizar | LOW |
| **TD-11-26** | contacto/page | `<h1>` y `<p>` directos en lugar de `<Heading>` y `<Text>` atoms | LOW |
| **TD-11-27** | contacto/page | `min-h-[calc(100vh-4rem)]` → dvh preferido; valor fijo sin token | LOW |
| **TD-11-28** | ContactForm | Honeypot usa inline style para ocultamiento — debería ser utility class | LOW |

### Prioridad de refactor

1. **TD-11-19 (CRITICAL):** Resolver antes de T-B-3 — requiere decisión Strategic sobre naming de container tokens. ¿Renombrar semantic tokens a sm/md/lg? ¿Añadir tokens md? ¿Ajustar prose a 70ch?
2. **TD-11-20 (MEDIUM):** Header `rounded-2xl` — fix puntual, 1 línea, bajo riesgo.
3. **TD-11-24 (MEDIUM):** Footer margins — usa tokens existentes `--bbf-space-section-gap-*`, fix directo.
4. El resto (LOW) se pueden agrupar en un mini-wave de polish.

### Bloqueantes para Wave 12 (Contact refactor)

- **ContactForm está bien implementado** — Zod ✓, Turnstile ✓, Honeypot ✓, Server Action ✓, estados ✓
- **Bloqueante 1:** TD-11-19 (Container naming) — si el refactor de contact usa Container atom con size nuevo, choca con tokens inconsistentes
- **Bloqueante 2:** contacto/page.tsx usa `h1/p` directo — si Wave 12 refactoriza la página, necesita migrar a Heading/Text atoms primero (TD-11-26)
- **No hay bloqueantes de seguridad o funcionalidad** — el form ya está production-ready

---

*Addendum BBF_DesignSystemInventory_v0*
*Audit READ-ONLY — CC no modificó archivos durante este proceso*
*Despacho B-BBF-WEB-WAVE-11-0-BIS-PLUS-TDs*
*Para bbf-docs: copiar a 03-canon/design-system/ (Zavala commitea)*
