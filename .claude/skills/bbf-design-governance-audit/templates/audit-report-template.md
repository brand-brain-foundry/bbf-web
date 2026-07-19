# Audit Report — <piece name> — <date>

> Verdict first, evidence after, no preamble. One row per layer.

## Identity
- Piece: <token | atom | molecule | component | section | template>
- Files: <paths>
- Renders: <what> · on surface: <surface>
- Known system? <yes → which | no>

## Verdict table (bottom-up)

| Layer | Verdict | Evidence (file:line) | Action |
|---|---|---|---|
| A. Admin contract | BELONGS / FITS / NEEDS-NEW | | align / replace / create / wire-to-admin |
| B. Preset / primitive | | | |
| C. Mother semantic (intent) | | | |
| D. Variant | | | |
| E. Atom / molecule | | | |
| F. Component / organism | | | |
| G. Surface | | | re-paints on surface change? Y/N |
| H. Section / template | | | |

## Hardcode / drift flags
- <file:line> — <what leaks> → <correct token/source>

## Plan (ordered, for architect approval — NOT executed)
1. ...
2. ...
For each NEEDS-NEW, full lineage:
- preset → primitive → mother semantic (intent name) → variant → admin wiring → surface contemplation

## Self-improve actions taken
- consolidated-systems.md: <appended? what>
- learnings.md: <appended? what>
