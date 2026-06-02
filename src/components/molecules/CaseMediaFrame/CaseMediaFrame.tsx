/**
 * CaseMediaFrame — BBF molecule para frame de media del Caso (§3)
 *
 * D-1: molecule nuevo (no extiende HeroMediaFrame — semántica distinta: live ≠ REC)
 * D-89 compound pattern. Server Component.
 *
 * Compound:
 *   <CaseMediaFrame>
 *     <CaseMediaFrame.Chrome label="SIVAR-BRAINS · WhatsApp Business · live" timestamp="captura · 23:04 viernes" />
 *     <CaseMediaFrame.Body>
 *       {asset ? <img ... /> : null}
 *     </CaseMediaFrame.Body>
 *   </CaseMediaFrame>
 *
 * Surface: dark — tokens --bbf-*-on-dark-surface de semantic/colors-dark.css
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ── Root ─────────────────────────────────────────────────── */

interface CaseMediaFrameProps {
  className?: string;
  children: ReactNode;
}

function CaseMediaFrameRoot({ className, children }: CaseMediaFrameProps) {
  return (
    <div data-component="bbf-case-media-frame" className={cn('bbf-case-media-frame', className)}>
      {children}
    </div>
  );
}
CaseMediaFrameRoot.displayName = 'CaseMediaFrame';

/* ── Chrome ───────────────────────────────────────────────── */

interface CaseMediaFrameChromeProps {
  /** Left label: entity + channel + status (e.g. "SIVAR-BRAINS · WhatsApp Business · live") */
  label?: string | null;
  /** Right decorative timestamp (e.g. "captura · 23:04 viernes") */
  timestamp?: string | null;
  /** Show green live pulse dot (default: true) */
  live?: boolean;
  className?: string;
}

function CaseMediaFrameChrome({
  label,
  timestamp,
  live = true,
  className,
}: CaseMediaFrameChromeProps) {
  return (
    <div
      data-component="bbf-case-media-frame-chrome"
      className={cn('bbf-case-media-frame__chrome', className)}
    >
      <div className="bbf-case-media-frame__chip">
        {live && <span className="bbf-case-media-frame__live-dot" aria-hidden="true" />}
        {label && <span>{label}</span>}
      </div>
      {timestamp && <span className="bbf-case-media-frame__timestamp">{timestamp}</span>}
    </div>
  );
}
CaseMediaFrameChrome.displayName = 'CaseMediaFrame.Chrome';

/* ── Body ─────────────────────────────────────────────────── */

interface CaseMediaFrameBodyProps {
  className?: string;
  /** Media content (image, video). If empty, renders placeholder. */
  children?: ReactNode;
  /** Placeholder text when no media. Default: "Media placeholder" */
  placeholderText?: string;
}

function CaseMediaFrameBody({
  className,
  children,
  placeholderText = 'Captura · próximamente',
}: CaseMediaFrameBodyProps) {
  return (
    <div
      data-component="bbf-case-media-frame-body"
      className={cn('bbf-case-media-frame__body', className)}
    >
      {children ?? <div className="bbf-case-media-frame__placeholder">{placeholderText}</div>}
    </div>
  );
}
CaseMediaFrameBody.displayName = 'CaseMediaFrame.Body';

/* ── Compound export ─────────────────────────────────────── */

export const CaseMediaFrame = Object.assign(CaseMediaFrameRoot, {
  Chrome: CaseMediaFrameChrome,
  Body: CaseMediaFrameBody,
});
