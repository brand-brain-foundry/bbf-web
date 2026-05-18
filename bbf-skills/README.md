# bbf-skills/

**Skills BBF — Proceso canon BBF para construcción de software**

> Versión: 1.0 (M5-F3, 2026-05-18)
> Reusable: M6+ + cerebros clientes BBF

---

## Qué son los Skills BBF

Skills BBF son **procesos canon** documentados que permiten construir nuevos elementos del sistema BBF siguiendo doctrina establecida.

AI agentes (Claude Code, MCP, agentic browsers) y desarrolladores humanos pueden leer un SKILL.md y construir canónicamente sin reinventar.

**Pattern canon BBF:** Strategic decide qué construir; AI/dev ejecuta usando Skills BBF.

---

## Skills disponibles

### Construcción de componentes

| Skill | Cuándo usar |
|-------|-------------|
| `create-atom/SKILL.md` | Crear nuevo atom (primitive UI element) |
| `create-molecule/SKILL.md` | Crear nueva molecule (atoms compuestos) |
| `create-section/SKILL.md` | Crear nueva section (page section compound) |

### Trabajar con tokens

| Skill | Cuándo usar |
|-------|-------------|
| `use-tokens/SKILL.md` | Aplicar tokens canon BBF en componentes |

---

## Cómo usar un Skill

```
1. AI agent/dev recibe tarea: "Crear atom Card"
2. Lee bbf-skills/README.md → identifica create-atom/SKILL.md
3. Lee create-atom/SKILL.md → entiende proceso canon
4. Lee BBF_DESIGN.md → contexto sistema
5. Lee src/components/CLAUDE.md → contexto atomic design
6. Lee CLAUDE.md de atom similar → patterns existentes
7. Ejecuta proceso canon paso a paso
8. Verificación canon (tsc + build)
9. Commit canon
```

---

## Filosofía Skills BBF

Skills NO son tutoriales generales. Son **procesos canon BBF específicos** que:

- Siguen template D-105 (estructura uniforme)
- Refs decisiones D-* aplicables
- Refs lecciones L-* aplicables
- Templates código copy-paste canon
- Anti-patterns explícitos (NO hacer)
- Verificación canon checklist

---

## Skills futuras (M6+)

Conforme el sistema canon BBF crece:

- `create-template/SKILL.md` — Crear template (composition de sections)
- `create-page/SKILL.md` — Crear page (composition de templates)
- `add-token-category/SKILL.md` — Agregar nueva categoría tokens canon
- `migrate-legacy/SKILL.md` — Migrar código legacy a canon BBF

---

## Decisiones aplicables

- **D-82** AI-readable canon BBF
- **D-103** Template canon CLAUDE.md por componente
- **D-104** Skills BBF en bbf-skills/ (root versionado)
- **D-105** Template canon SKILL.md por proceso

---

## Referencias

- `BBF_DESIGN.md` — Overview sistema canon BBF
- `src/components/CLAUDE.md` — Atomic design canon
- `src/styles/CLAUDE.md` — Token system canon
- `src/lib/CLAUDE.md` — Utilities canon
- `src/app/CLAUDE.md` — App routing canon
