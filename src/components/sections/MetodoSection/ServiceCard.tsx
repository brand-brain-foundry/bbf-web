/**
 * ServiceCard — Tier 3 local component, MetodoSection
 *
 * Tarjeta de servicio BBF: num + nombre + meta (duración/compromiso) + body + deliverables.
 * LOCAL — no extraer al sistema canónico (D-S5-05: ~70% diferencia vs CapabilityCard).
 *
 * Refs: D-S5-05, migracion-s5-metodo.md T1 (mth__card spec)
 */

import { Heading } from '@/components/atoms/Heading';
import { Icon, Icons } from '@/components/atoms/Icon';

export interface ServiceCardProps {
  number: string;
  name: string;
  duration?: string | null;
  commitment?: string | null;
  body?: string | null;
  deliverables?: { text: string; id?: string | null }[] | null;
}

export function ServiceCard({
  number,
  name,
  duration,
  commitment,
  body,
  deliverables,
}: ServiceCardProps) {
  return (
    <article className="bbf-service-card" data-component="bbf-service-card">
      <div className="bbf-service-card__head">
        <span className="bbf-service-card__number">{number}</span>
        <Heading as="h3" level="display-step-title" className="bbf-service-card__name">
          {name}
        </Heading>
      </div>

      <hr className="bbf-service-card__divider" aria-hidden="true" />

      {(duration || commitment) && (
        <dl className="bbf-service-card__meta">
          {duration && (
            <>
              <dt className="bbf-service-card__meta-label">Duración</dt>
              <dd className="bbf-service-card__meta-value">{duration}</dd>
            </>
          )}
          {commitment && (
            <>
              <dt className="bbf-service-card__meta-label">Compromiso</dt>
              <dd className="bbf-service-card__meta-value">{commitment}</dd>
            </>
          )}
        </dl>
      )}

      {body && <p className="bbf-service-card__body bbf-lede">{body}</p>}

      {deliverables && deliverables.length > 0 && (
        <>
          <hr className="bbf-service-card__divider" aria-hidden="true" />
          <ul className="bbf-service-card__deliverables">
            {deliverables.map((item, i) => (
              <li key={item.id ?? i} className="bbf-service-card__deliverable">
                <Icon icon={Icons.check} size="xs" aria-hidden />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}
