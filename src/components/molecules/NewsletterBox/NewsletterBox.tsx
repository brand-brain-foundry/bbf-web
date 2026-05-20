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
        className={cn(
          'rounded-lg border border-[var(--bbf-color-success-border)] p-4',
          'bg-[var(--bbf-color-success-bg)] text-[var(--bbf-color-success-text)]',
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <p className="mb-1 text-sm font-medium">{copy.successTitle}</p>
        <p className="text-sm">{copy.successMessage}</p>
      </div>
    );
  }

  return (
    <div data-component="bbf-newsletter-box" className={cn('space-y-3', className)}>
      <div>
        <p className="mb-1 text-base font-bold text-[var(--bbf-text-on-light)]">{copy.title}</p>
        <p className="text-sm text-[var(--bbf-text-on-light)]/70">{copy.description}</p>
      </div>

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
              'flex-1 rounded-md border border-[var(--bbf-border-on-light)] px-3 py-2 text-sm',
              'bg-[var(--bbf-surface-sand)] text-[var(--bbf-text-on-light)]',
              'placeholder:text-[var(--bbf-text-on-light)]/50',
              'transition-opacity duration-150 ease-out',
              'focus:ring-2 focus:ring-[var(--bbf-color-focus-ring)] focus:ring-offset-1 focus:outline-none',
              'disabled:opacity-60',
            )}
          />
          <button
            type="submit"
            disabled={state.kind === 'submitting'}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium',
              'bg-[var(--bbf-text-on-light)] text-[var(--bbf-surface-sand)]',
              'transition-opacity duration-150 ease-out',
              'hover:opacity-90 active:opacity-80',
              'focus-visible:ring-2 focus-visible:ring-[var(--bbf-color-focus-ring)] focus-visible:ring-offset-2 focus-visible:outline-none',
              'disabled:opacity-60',
            )}
          >
            {state.kind === 'submitting' ? copy.submittingLabel : copy.submitLabel}
          </button>
        </div>

        <p className="text-xs text-[var(--bbf-text-on-light)]/60">{copy.privacyNote}</p>

        {state.kind === 'error' && (
          <p
            className="text-sm text-[var(--bbf-color-error-text)]"
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
