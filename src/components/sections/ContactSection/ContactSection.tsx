import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ContactSectionProps = {
  /** H1 heading + lede — mobile: order 1, desktop: col 1 row 1 */
  top: ReactNode;
  /** Form card — mobile: order 2, desktop: col 2 spans rows 1-2 */
  right: ReactNode;
  /** Steps + channels — mobile: order 3, desktop: col 1 row 2 */
  bottom: ReactNode;
  className?: string;
};

export function ContactSection({ top, right, bottom, className }: ContactSectionProps) {
  return (
    <section
      data-component="bbf-contact-section"
      data-surface="dark"
      className={cn(
        'min-h-[calc(100vh-4rem)]',
        'bg-[var(--bbf-on-surface-bg)]',
        'pt-24 pb-20 lg:pt-32 lg:pb-32',
        className,
      )}
    >
      <div className="bbf-section-wrap">
        {/* T4: mobile flex-col con order → desktop grid 2-col con placement explícito */}
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_560px] lg:items-stretch lg:gap-x-16 lg:gap-y-8">
          {/* mobile: order 1 → desktop: col 1, row 1 */}
          <div className="order-1 lg:col-start-1 lg:row-start-1">{top}</div>
          {/* mobile: order 2 → desktop: col 2, rows 1-2 (form card ocupa toda la altura izq) */}
          <div className="bbf-contact-card relative order-2 overflow-hidden rounded-[var(--bbf-radius-xl)] border border-[var(--bbf-contact-form-card-border)] bg-[var(--bbf-contact-form-card-bg)] p-8 lg:col-start-2 lg:row-start-1 lg:row-end-3 lg:p-10">
            {right}
          </div>
          {/* mobile: order 3 → desktop: col 1, row 2 */}
          <div className="order-3 lg:col-start-1 lg:row-start-2">{bottom}</div>
        </div>
      </div>
    </section>
  );
}
