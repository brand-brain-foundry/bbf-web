'use client';

/**
 * PorqueSection.Comparison — ComparisonTable Tier 3
 *
 * Desktop (≥768px): CSS Grid via <table> semántico (G-07 Sprint 1 AEO).
 * Mobile (<768px): Column Selector Tabs (D-S4-03 P-3) — BBF tab por defecto.
 * WCAG 2.1 AA: role=tablist/tab/tabpanel + ArrowLeft/Right keyboard nav.
 * AEO: <table><thead><tbody><tr><th><td> reales para extracción fila-a-fila.
 *
 * Refs: D-S4-02 (fully dynamic), D-S4-03 (P-3 tabs), B-BBF-WEB-S4-PORQUE-FASES-2A6 §5
 */

import type { CSSProperties } from 'react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Icon, Icons } from '@/components/atoms/Icon';

/* ── Types ─────────────────────────────────────────────────────────────── */

interface Column {
  id?: string | null;
  label?: string | null;
  sub?: string | null;
  isHighlighted?: boolean | null;
}

interface Cell {
  id?: string | null;
  state: 'yes' | 'no' | 'mid' | 'text';
  value?: string | null;
}

interface Row {
  id?: string | null;
  attribute?: string | null;
  cells?: Cell[] | null;
}

interface ComparisonProps {
  columns?: Column[] | null;
  rows?: Row[] | null;
  /** Short name from SiteIdentity admin — shown in crown pill of highlighted column. */
  crownText?: string | null;
}

/* ── Cell icons ─────────────────────────────────────────────────────────── */

const CELL_ICON_MAP = {
  yes: { cls: 'bbf-cmp__cell--yes', icon: Icons.check },
  no: { cls: 'bbf-cmp__cell--no', icon: Icons.close },
  mid: { cls: 'bbf-cmp__cell--mid', icon: Icons.minus },
} as const;

function CellIcon({ state }: { state: 'yes' | 'no' | 'mid' }) {
  const { cls, icon } = CELL_ICON_MAP[state];
  return (
    <span className={`bbf-cmp__cell-icon ${cls}`} aria-hidden="true">
      <Icon icon={icon} size="sm" />
    </span>
  );
}

/* ── Comparison component ───────────────────────────────────────────────── */

export function Comparison({ columns, rows, crownText }: ComparisonProps) {
  const cols = columns ?? [];
  const dataRows = rows ?? [];

  const highlightedIdx = Math.max(
    cols.findIndex((c) => c.isHighlighted),
    0,
  );
  const [activeIdx, setActiveIdx] = useState(highlightedIdx);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (cols.length === 0) return null;

  function handleTabKeyDown(e: React.KeyboardEvent, idx: number) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (idx + 1) % cols.length;
      setActiveIdx(next);
      tabRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (idx - 1 + cols.length) % cols.length;
      setActiveIdx(prev);
      tabRefs.current[prev]?.focus();
    }
  }

  const activeCol = cols[activeIdx];
  const activeColId = activeCol?.id ?? String(activeIdx);

  return (
    <div className="bbf-cmp" data-component="bbf-cmp">
      {/* ── Desktop: <table> semántico con CSS Grid layout (G-07 AEO) ── */}
      {/* thead/tbody tienen display:contents en CSS → cells son grid items directos */}
      <table
        className="bbf-cmp__grid"
        style={{ '--cmp-cols': String(cols.length) } as CSSProperties}
      >
        <caption className="sr-only">Comparación entre alternativas</caption>
        <thead>
          <tr className="bbf-cmp__row bbf-cmp__row--head">
            <th scope="col" className="bbf-cmp__rowhead bbf-cmp__cell--head">
              <span className="bbf-cmp__col-sub">Dimensión</span>
            </th>
            {cols.map((col, ci) => (
              <th
                key={col.id ?? ci}
                scope="col"
                className={cn('bbf-cmp__cell--head', col.isHighlighted && 'is-hl')}
              >
                {col.isHighlighted && (
                  <div className="bbf-cmp__crown" aria-hidden="true">
                    ▼ {crownText ?? 'SB'}
                  </div>
                )}
                <div className="bbf-cmp__col-name">{col.label}</div>
                {col.sub && <div className="bbf-cmp__col-sub">{col.sub}</div>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, ri) => (
            <tr key={row.id ?? ri} className="bbf-cmp__row">
              <th scope="row" className="bbf-cmp__rowhead">
                <span className="bbf-cmp__rowhead-num">{String(ri + 1).padStart(2, '0')}</span>
                <span>{row.attribute}</span>
              </th>
              {(row.cells ?? []).map((cell, ci) => {
                const isHl = cols[ci]?.isHighlighted ?? false;
                return (
                  <td key={cell.id ?? ci} className={cn('bbf-cmp__cell', isHl && 'is-hl')}>
                    {cell.state !== 'text' && <CellIcon state={cell.state} />}
                    {cell.value && <span>{cell.value}</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Mobile: tabs + panel ── */}
      <div role="tablist" className="bbf-cmp__tabs" aria-label="Seleccionar columna de comparación">
        {cols.map((col, ci) => (
          <button
            key={col.id ?? ci}
            ref={(el) => {
              tabRefs.current[ci] = el;
            }}
            role="tab"
            aria-selected={ci === activeIdx}
            aria-controls={`cmp-panel-${activeColId}`}
            id={`cmp-tab-${col.id ?? ci}`}
            tabIndex={ci === activeIdx ? 0 : -1}
            className={cn('bbf-cmp__tab', col.isHighlighted && 'bbf-cmp__tab--highlighted')}
            onClick={() => setActiveIdx(ci)}
            onKeyDown={(e) => handleTabKeyDown(e, ci)}
          >
            {col.label}
          </button>
        ))}
      </div>

      <div
        className="bbf-cmp-mobile"
        data-hl-active={String(cols[activeIdx]?.isHighlighted ?? false)}
      >
        <div
          id={`cmp-panel-${activeColId}`}
          role="tabpanel"
          aria-labelledby={`cmp-tab-${activeColId}`}
          className="bbf-cmp-mobile__panel"
        >
          {dataRows.map((row, ri) => {
            const cell = row.cells?.[activeIdx];
            const isHl = cols[activeIdx]?.isHighlighted ?? false;
            return (
              <div key={row.id ?? ri} className="bbf-cmp-mobile__row">
                <span className="bbf-cmp-mobile__attr">{row.attribute}</span>
                <span className={cn('bbf-cmp-mobile__val', isHl && 'is-highlighted')}>
                  {cell?.state !== 'text' && cell?.state && <CellIcon state={cell.state} />}
                  {cell?.value ?? '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
