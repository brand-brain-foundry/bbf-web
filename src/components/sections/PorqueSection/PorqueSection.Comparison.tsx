'use client';

/**
 * PorqueSection.Comparison — ComparisonTable Tier 3
 *
 * Desktop (≥768px): CSS Grid completo (attr col + N data cols).
 * Mobile (<768px): Column Selector Tabs (D-S4-03 P-3) — BBF tab por defecto.
 * WCAG 2.1 AA: role=tablist/tab/tabpanel + ArrowLeft/Right keyboard nav.
 *
 * Refs: D-S4-02 (fully dynamic), D-S4-03 (P-3 tabs), B-BBF-WEB-S4-PORQUE-FASES-2A6 §5
 */

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

/* ── Types ─────────────────────────────────────────────────────────────── */

interface Column {
  id?: string | null;
  label: string;
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
  attribute: string;
  cells?: Cell[] | null;
}

interface ComparisonProps {
  columns?: Column[] | null;
  rows?: Row[] | null;
}

/* ── Cell icons ─────────────────────────────────────────────────────────── */

function CellIcon({ state }: { state: 'yes' | 'no' | 'mid' }) {
  if (state === 'yes') {
    return (
      <span className="bbf-cmp__cell-icon bbf-cmp__cell--yes" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 7.5L6 11L12 3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (state === 'no') {
    return (
      <span className="bbf-cmp__cell-icon bbf-cmp__cell--no" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 3L11 11M11 3L3 11"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }
  return (
    <span className="bbf-cmp__cell-icon bbf-cmp__cell--mid" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 7H12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/* ── Comparison component ───────────────────────────────────────────────── */

export function Comparison({ columns, rows }: ComparisonProps) {
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
      {/* ── Desktop grid ── */}
      <div className="bbf-cmp__grid" role="table" aria-label="Comparación entre alternativas">
        {/* Header row */}
        <div className="bbf-cmp__row bbf-cmp__row--head" role="row">
          <div className="bbf-cmp__rowhead bbf-cmp__cell--head" role="columnheader">
            <span className="bbf-cmp__col-sub">Dimensión</span>
          </div>
          {cols.map((col, ci) => (
            <div
              key={col.id ?? ci}
              className={cn('bbf-cmp__cell--head', col.isHighlighted && 'is-hl')}
              role="columnheader"
            >
              {col.isHighlighted && (
                <div className="bbf-cmp__crown" aria-hidden="true">
                  ▼ BBF
                </div>
              )}
              <div className="bbf-cmp__col-name">{col.label}</div>
              {col.sub && <div className="bbf-cmp__col-sub">{col.sub}</div>}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {dataRows.map((row, ri) => (
          <div key={row.id ?? ri} className="bbf-cmp__row" role="row">
            <div className="bbf-cmp__rowhead" role="rowheader">
              <span className="bbf-cmp__rowhead-num">{String(ri + 1).padStart(2, '0')}</span>
              <span>{row.attribute}</span>
            </div>
            {(row.cells ?? []).map((cell, ci) => {
              const isHl = cols[ci]?.isHighlighted ?? false;
              return (
                <div
                  key={cell.id ?? ci}
                  className={cn('bbf-cmp__cell', isHl && 'is-hl')}
                  role="cell"
                >
                  {cell.state !== 'text' && <CellIcon state={cell.state} />}
                  {cell.value && <span>{cell.value}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

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

      <div className="bbf-cmp-mobile">
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
