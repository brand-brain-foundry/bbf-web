# Admin Contract — how content must flow

> The rule: NOTHING user-facing is hardcoded. Every dynamic value comes from
> admin, with a single source of truth, consumed by relation/placeholder — never
> copied. This file defines how to AUDIT that contract.

## The principle
Every layer applies the same gesture: store a REFERENCE, not a COPY.
organizationEntity → Entity. headerCta → SiteCtaLibrary. BrandSystem → tokens.
variant → mother. content → admin. No truth lives in two places.

## What to check, per piece
1. **Identify every user-facing value** the piece renders: strings, URLs,
   labels, taglines, descriptions, badge text, image/vector references.
2. **For each value, find its admin source.** It must resolve to a field in a
   global or collection (SiteIdentity, Newsletter, Footer groups, SiteCtaLibrary,
   pathnames). If the value is a literal in JSX/TSX → VIOLATION (flag + locate the
   correct admin source it should read).
3. **Single source of truth.** If the same value (e.g. site name, canonical home
   URL) could be read from two places, that's a duplication risk — flag which is
   canonical.
4. **Placeholder / dynamic field resolution.** Confirm the piece interpolates a
   placeholder (e.g. `{{siteName}}`) or reads a field, rather than embedding text.
5. **Defaults vs hardcode.** A default value in a schema (admin-editable) is fine.
   A literal in the component is not. Distinguish them.

## Known canonical sources (verify in repo — may grow)
| Value | Source | Notes |
|---|---|---|
| Site name | SiteIdentity.siteName | dynamic field; footer logo name reads this |
| Site tagline | SiteIdentity.siteTagline | §6.3-clean |
| Site description | SiteIdentity.siteDescription | §6.3-clean |
| Organization | SiteIdentity.organizationEntity → Entity | relation, JSON-LD reads it |
| Canonical home URL | SiteIdentity canonical (verify field) | logo-link href should read this, not "/" |
| Newsletter content | Newsletter global | subscription component |
| Footer link label | Footer groups → Links.label | per-link |
| Footer link target | Links.linkTarget {routeKey|page} | routeKey → pathnames.ts SSOT |
| Footer badge text | Links.badge text (+ intent) | empty = no badge |
| CTA | SiteCtaLibrary (type + intent) | header/footer CTAs |

## Anchors (D-NAV-9) — DEFERRED
Section anchors (e.g. /metodo#diagnostico) do NOT exist yet — Pages has no section
model. If a piece needs an anchor link, that is NEW work, flag as deferred, do not
fake it.

## Red flags (auto-flag these)
- Any `href="/..."` literal that should be a canonical admin URL.
- Any user-facing string in JSX not coming from a field/placeholder.
- Any prohibited §6.3 vocab in content (CM-L, multi-tenant, etc.).
- BBF used as the subject of the site (§6.5 — must be Sivar Brains).
