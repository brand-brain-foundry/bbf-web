'use client';

import { useState, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { subscribeNewsletter } from '@/lib/actions/newsletter';
import { cn } from '@/lib/utils';

type NewsletterCopy = {
  title: string;
  description: string;
  emailPlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  successTitle: string;
  successMessage: string;
  privacyNote: string;
};

type NewsletterBoxProps = {
  copy: NewsletterCopy;
  className?: string;
};

type State =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; reason: string };

/**
 * BBF NewsletterBox — canon Wave 5 design system
 * Button submit: gradient red animado (matching Header CTA D-BBF-KB-108)
 * Input + button: h-11 rounded-full (pill canon)
 * Typography: tokens semantic Wave 5
 */
export function NewsletterBox({ copy, className }: NewsletterBoxProps) {
  const locale = useLocale();
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setState({ kind: 'submitting' });
    formData.set('locale', locale);
    startTransition(async () => {
      const result = await subscribeNewsletter(formData);
      if (result.ok) {
        setState({ kind: 'success' });
      } else {
        setState({ kind: 'error', reason: result.error });
      }
    });
  }

  if (state.kind === 'success') {
    return (
      <div
        data-component="bbf-newsletter-box"
        data-state="success"
        className={cn(
          'rounded-2xl p-5',
          'bg-[var(--bbf-color-success-bg)]',
          'border border-[var(--bbf-color-success-border)]',
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <p className="mb-1 text-[length:var(--bbf-text-base)] font-[var(--bbf-weight-semibold)] text-[var(--bbf-color-success-text)]">
          {copy.successTitle}
        </p>
        <p className="text-[length:var(--bbf-text-sm)] text-[var(--bbf-color-success-text)]">
          {copy.successMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      data-component="bbf-newsletter-box"
      data-state={state.kind}
      className={cn('flex flex-col gap-3', className)}
    >
      {/* Heading + description */}
      <div className="space-y-1.5">
        <p className="text-[length:var(--bbf-text-h2)] leading-[var(--bbf-leading-snug)] font-[var(--bbf-font-display)] font-[var(--bbf-weight-bold)] tracking-[var(--bbf-tracking-tight)] text-[var(--bbf-text-on-sand)]">
          {copy.title}
        </p>
        <p className="text-[length:var(--bbf-text-sm)] leading-[var(--bbf-leading-snug-small)] text-[var(--bbf-text-on-sand-muted)]">
          {copy.description}
        </p>
      </div>

      {/* Form */}
      <form action={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="newsletter-email">
            Email
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            required
            placeholder={copy.emailPlaceholder}
            disabled={state.kind === 'submitting'}
            aria-invalid={state.kind === 'error' ? 'true' : undefined}
            className={cn(
              'h-11 flex-1 rounded-full px-4',
              'text-[length:var(--bbf-text-sm)]',
              'bg-[var(--bbf-color-white)]',
              'border border-[var(--bbf-border-on-sand)]',
              'text-[var(--bbf-text-on-sand)] placeholder:text-[var(--bbf-text-on-sand-subtle)]',
              'transition-all duration-200 ease-out',
              'focus:border-[var(--bbf-accent-red)] focus:ring-2 focus:ring-[var(--bbf-color-focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--bbf-surface-sand)] focus:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-60',
            )}
          />
          <button
            type="submit"
            disabled={state.kind === 'submitting'}
            className={cn(
              'inline-flex h-11 items-center justify-center gap-2 rounded-full px-6',
              'text-[length:var(--bbf-text-sm)] font-[var(--bbf-weight-semibold)]',
              'text-[var(--bbf-text-on-gradient-red)]',
              '[background-size:200%_200%] [background-position:0%_50%] [background:var(--bbf-gradient-red)]',
              'shadow-sm',
              'transition-all duration-200 ease-out',
              'hover:-translate-y-px hover:[background-position:100%_50%] hover:shadow-md',
              'active:scale-[0.97]',
              'focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-2 focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0',
            )}
          >
            {state.kind === 'submitting' ? copy.submittingLabel : copy.submitLabel}
          </button>
        </div>

        <p className="text-[length:var(--bbf-text-xs)] text-[var(--bbf-text-on-sand-subtle)]">
          {copy.privacyNote}
        </p>

        {state.kind === 'error' && (
          <p
            className="text-[length:var(--bbf-text-sm)] text-[var(--bbf-color-error-text)]"
            role="alert"
            aria-live="assertive"
          >
            {state.reason === 'disposable'
              ? locale === 'en'
                ? 'Please use a permanent email.'
                : 'Por favor usá un email permanente.'
              : state.reason === 'validation'
                ? locale === 'en'
                  ? 'Invalid email.'
                  : 'Email inválido.'
                : locale === 'en'
                  ? 'Something went wrong. Try again.'
                  : 'Algo falló. Probá de nuevo.'}
          </p>
        )}
      </form>
    </div>
  );
}
