# BBF_MoleculesAudit — §AA CIERRE Wave 11.6-B (Molecules HIGH Fixes)

**Despacho:** B-BBF-WEB-WAVE-11-6-B
**Fecha cierre:** 2026-05-24
**Commit:** [pendiente Zavala stage+commit]
**Hereda:** 8cbba74

---

## Cambios aplicados

### Sub-fase T-B-1: Hover protection molecules (TD-11-57 parcial → completo atoms+molecules)

**D-BBF-WEB-CC Opción B aplicada — TODOS los hovers molecules.**

Patrón canónico aplicado (D-BBF-WEB-ZZ Wave 11.5-B):
- Tailwind utilities: `hover:` → `[@media(hover:hover)]:hover:`
- group-hover: → `[@media(hover:hover)]:group-hover:`

**Inventario completo — 13 hovers protegidos inline + 1 via CVA compound variant (FormField T-B-2):**

| # | Molecule | Path:línea | Hover original | Reemplazo aplicado |
|---|---|---|---|---|
| H-1 | LanguageSwitcher | L59 | `hover:opacity-100` | `[@media(hover:hover)]:hover:opacity-100` |
| H-2 | MegaMenuPanel | L108 | `hover:bg-[var(--bbf-surface-hover-subtle-on-sand)]` | `[@media(hover:hover)]:hover:bg-[...]` |
| H-3 | MegaMenuPanel | L119 | `group-hover:scale-105` | `[@media(hover:hover)]:group-hover:scale-105` |
| H-4 | MegaMenuPanel | L141 | `group-hover:text-[var(--bbf-accent-red)]` | `[@media(hover:hover)]:group-hover:text-[...]` |
| H-5 | MobileMenu | L106 | `hover:bg-[var(--bbf-surface-hover-on-sand)]` | `[@media(hover:hover)]:hover:bg-[...]` (trigger btn) |
| H-6 | MobileMenu | L159 | `hover:bg-[var(--bbf-surface-hover-on-sand)]` | `[@media(hover:hover)]:hover:bg-[...]` (close btn) |
| H-7 | MobileMenu | L195 | `hover:translate-x-1 hover:text-[...]` | `[@media(hover:hover)]:hover:translate-x-1 [@media(hover:hover)]:hover:text-[...]` |
| H-8 | MobileMenu | L203 | `group-hover:translate-x-0 group-hover:opacity-100` | `[@media(hover:hover)]:group-hover:translate-x-0 [@media(hover:hover)]:group-hover:opacity-100` |
| H-9 | MobileSubMenu | L67 | `hover:text-[var(--bbf-accent-red)]` | `[@media(hover:hover)]:hover:text-[...]` (accordion btn) |
| H-10 | MobileSubMenu | L97 | `hover:text-[var(--bbf-accent-red)]` | `[@media(hover:hover)]:hover:text-[...]` (general link) |
| H-11 | MobileSubMenu | L119 | `hover:bg-[var(--bbf-surface-hover-subtle-on-sand)]` | `[@media(hover:hover)]:hover:bg-[...]` |
| H-12 | MobileSubMenu | L130 | `group-hover:scale-105` | `[@media(hover:hover)]:group-hover:scale-105` |
| H-13 | MobileSubMenu | L153 | `group-hover:text-[var(--bbf-accent-red)]` | `[@media(hover:hover)]:group-hover:text-[...]` |
| H-14 | FormField | (CVA) | `!disabled && hover:border-[...]` | `[@media(hover:hover)]:hover:border-[...]` via `formFieldBorderVariants` compound variant |

**Total: 14/14 hovers protegidos ✅**
**Resultado: 0 hovers sin proteger en atoms + molecules ✅**

`group-focus-visible:` en MegaMenuPanel L141 y MobileSubMenu L153 preservados sin cambio (correcto — no es hover).

---

### Sub-fase T-B-2: FormField CVA agnóstico + bug L73 fix

**D-BBF-WEB-BB Opción A aplicada — CVA SIN surface variant.**

**Archivos:**
- Creado: `src/components/molecules/FormField/FormField.variants.ts`
- Migrado: `src/components/molecules/FormField/FormField.tsx`

**3 CVA exports en FormField.variants.ts:**

| Export | Propósito | Variantes |
|---|---|---|
| `formFieldLabelVariants` | Label styles | — (base only, sin variantes) |
| `formFieldBorderVariants` | Border colors + hover | `error: true/false`, `disabled: true/false` |
| `formFieldMessageVariants` | Error/hint message | `type: 'error' / 'hint'` |

**Bug L73 fix (D-AA pattern):**
- `font-[var(--bbf-weight-medium)]` → `[font-weight:var(--bbf-weight-medium)]` vía `formFieldLabelVariants`

**Token mapping aplicado (tokens reales verificados):**

| Token en despacho template | Token real usado | Existe | Motivo |
|---|---|---|---|
| `--bbf-typography-caption-weight` | `--bbf-weight-medium` | ✅ | `caption-weight` no existe en semantic |
| `--bbf-color-error-border` | `--bbf-color-error` | ✅ | `error-border` no existe en semantic |
| `--bbf-color-error-text` | `--bbf-text-error` | ✅ | `error-text` no existe en semantic; `text-error` sí (L209 colors.css) |

**Hover fix incluido en CVA:**
`formFieldBorderVariants` compound variant `{error: false, disabled: false}` → `[@media(hover:hover)]:hover:border-[var(--bbf-text-on-sand)]`

**API preservada:**
- `forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>` — sin cambio
- Props: `label`, `name`, `type`, `required`, `rows`, `maxLength`, `autoComplete`, `error`, `className`, `inputClassName`, `disabled`, `...props` — todos preservados
- `baseClass` cn() inline preservado (bg, text, focus-ring, disabled-opacity)
- Consumers `ContactForm` (4× FormField) y `NewsletterBox` — sin cambios

---

### Sub-fase T-B-3: Build verification

- `pnpm typecheck`: **PASS exit 0** ✅
- `npx next build`: [pendiente resultado]
- 0 hovers sin proteger en atoms + molecules: **✅**

---

## TDs cerradas Wave 11.6-B

- ✅ **TD-11-57** atoms+molecules — hover sticky mobile protection COMPLETA (atoms Wave 11.5-B, molecules Wave 11.6-B)
- ✅ **TD-11-02** FormField CVA — creado `FormField.variants.ts` con 3 exports
- ✅ **TD-11-04** FormField surface — resuelto vía D-BBF-WEB-BB Opción A (NO requiere variant)
- ✅ **TD-11-13** parcial — FormField CVA (resto molecules → Wave 11.6-C)
- ✅ **H-3 bug L73** — `font-[var()]` → `[font-weight:var()]` D-AA pattern aplicado
- ✅ **silent bug** `--bbf-color-error-text` → `--bbf-text-error` (token inexistente reemplazado)
- ✅ **silent bug** `--bbf-color-error-border` → `--bbf-color-error` (token inexistente reemplazado)

---

## Decisiones registradas

| Decisión | Opción aplicada | Estado |
|---|---|---|
| D-BBF-WEB-BB | Opción A — FormField CVA SIN surface variant | ✅ Aplicada |
| D-BBF-WEB-CC | Opción B — TODOS 14 hovers molecules | ✅ Aplicada |
| D-BBF-WEB-DD | N/A — 0 raw headings violations confirmadas (Wave 11.6-A) | Registrada |
| D-BBF-WEB-EE | WONT-FIX — TD-11-29 NavLink underline Option B | Registrada |

---

## Anomalías Wave 11.6-B

**§6 Tokens no existentes en FormField pre-migración:**
- `--bbf-color-error-border` (en `borderClass` original L55-56) — no existe en semantic. Reemplazado por `--bbf-color-error` en CVA.
- `--bbf-color-error-text` (en error message L112) — no existe en semantic. Reemplazado por `--bbf-text-error` en CVA.
- Ambos eran silent bugs: CSS fallback a `currentColor`/`inherit`. Ahora tokens correctos.

**`--bbf-typography-caption-weight`** en template de despacho — no existe en semantic. Usado `--bbf-weight-medium` directamente (equivalente, primitive token).

---

## TDs pendientes Wave 11.6-C

- TD-11-13 restante: LanguageSwitcher, MegaMenuPanel, MobileMenu, MobileSubMenu CVA
- NewsletterBox CVA wrapper (molecule level)
- ContactForm CVA wrapper (molecule level)

---

## Archivos modificados

```
M  src/components/molecules/FormField/FormField.tsx
M  src/components/molecules/LanguageSwitcher/LanguageSwitcher.tsx
M  src/components/molecules/MegaMenuPanel/MegaMenuPanel.tsx
M  src/components/molecules/MobileMenu/MobileMenu.tsx
M  src/components/molecules/MobileSubMenu/MobileSubMenu.tsx
A  src/components/molecules/FormField/FormField.variants.ts
A  BBF_MoleculesAudit_Wave11-6-B_Closure.md
```

---

## Commit propuesto (NO ejecutado — Zavala)

```bash
git add \
  src/components/molecules/FormField/FormField.tsx \
  src/components/molecules/FormField/FormField.variants.ts \
  src/components/molecules/LanguageSwitcher/LanguageSwitcher.tsx \
  src/components/molecules/MegaMenuPanel/MegaMenuPanel.tsx \
  src/components/molecules/MobileMenu/MobileMenu.tsx \
  src/components/molecules/MobileSubMenu/MobileSubMenu.tsx \
  BBF_MoleculesAudit_Wave11-6-B_Closure.md \
  BBF_MoleculesAudit.md

git commit -m "feat(wave11.6-b): molecules HIGH fixes — hover protection 14 hovers + FormField CVA agnóstico + bug L73

Wave 11.6-B resuelve 3 TDs + 1 bug detectados en Molecules audit Wave 11.6-A.

HOVER PROTECTION MOLECULES (D-BBF-WEB-CC Opción B):
  Patrón canonical Tailwind v4: [@media(hover:hover)]:hover:
  14 hovers protegidos en 5 molecules:
    FormField, LanguageSwitcher, MegaMenuPanel, MobileMenu, MobileSubMenu
  Resultado: 0 hovers sin proteger en atoms + molecules

FORMFIELD CVA AGNÓSTICO (D-BBF-WEB-BB Opción A):
  Creado: FormField.variants.ts (3 CVA exports)
  Migrado: FormField.tsx consume CVA
  Sin surface variant — hereda contexto sand actual (YAGNI Wave 12+)
  Sub-elementos: labelVariants + borderVariants (error/disabled) + messageVariants (error/hint)

BUG L73 FIX (D-BBF-WEB-AA universal):
  font-[var(--bbf-weight-medium)] → [font-weight:var()]
  Patrón canon Wave 11.5-B aplicado universalmente

SILENT BUGS CORREGIDOS:
  --bbf-color-error-border → --bbf-color-error (token inexistente reemplazado)
  --bbf-color-error-text → --bbf-text-error (token inexistente reemplazado)

DECISIONES REGISTRADAS:
  D-BBF-WEB-DD N/A — 0 raw headings violations en molecules (confirmado Wave 11.6-A)
  D-BBF-WEB-EE WONT-FIX — TD-11-29 NavLink underline Option B

TDs cerradas:
  TD-11-02 FormField CVA
  TD-11-04 FormField surface (resuelto vía D-BB Opción A: NO requiere variant)
  TD-11-13 parcial (FormField; resto Wave 11.6-C)
  TD-11-57 atoms+molecules (atoms ya cerrado Wave 11.5-B; molecules ahora)
  H-3 bug L73 FormField font-weight

PRÓXIMO: Wave 11.6-C (LanguageSwitcher/MegaMenuPanel/MobileMenu/MobileSubMenu/NewsletterBox/ContactForm CVA)

Refs: AUD-BBF-034, 035, D-BBF-KB-145, D-BBF-WEB-BB/CC/DD/EE/AA, R-BBF-12"
```

---

## Próximo paso

**Wave 11.6-C** — cleanup molecules restantes (CVA migration):
- LanguageSwitcher CVA
- MegaMenuPanel CVA
- MobileMenu CVA
- MobileSubMenu CVA
- NewsletterBox CVA wrapper
- ContactForm CVA wrapper

Estimado: ~30-40 min CC.

---

*Cierre: 2026-05-24. Autor: Claude Code (despacho B-BBF-WEB-WAVE-11-6-B).*
