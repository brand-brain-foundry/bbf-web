'use client';

import { useState, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { subscribeNewsletter } from '@/lib/actions/newsletter';
import { Button } from '@/components/atoms/Button';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/utils';
import { newsletterBoxVariants } from './NewsletterBox.variants';

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
 * BBF NewsletterBox — mobile-first canon 2026
 *
 * MOBILE (default):
 *   - Stacked vertical: input on top, button below full-width
 *   - Input h-12 (48px touch target generous WCAG AA)
 *   - Button full width pill canon
 *
 * DESKTOP:
 *   - Stacked aún (mejor UX que inline en footer columns)
 *
 * Single source of truth: usa <Button> atom directamente
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
          '[border-radius:var(--bbf-radius-notification)] p-5',
          'bg-[var(--bbf-color-success-bg)]',
          'border border-[var(--bbf-color-success-border)]',
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <Text
          variant="body-md"
          weight="semibold"
          className="mb-1 text-[var(--bbf-color-success-text)]"
        >
          {copy.successTitle}
        </Text>
        <Text variant="body-sm" className="text-[var(--bbf-color-success-text)]">
          {copy.successMessage}
        </Text>
      </div>
    );
  }

  return (
    <div
      data-component="bbf-newsletter-box"
      data-state={state.kind}
      className={cn(newsletterBoxVariants(), className)}
    >
      {/* Heading + description */}
      <div className="space-y-1.5">
        <Heading level="h2" weight="bold" tone="default" asChild>
          <p>{copy.title}</p>
        </Heading>
        <Text variant="body-sm" className="text-[var(--bbf-on-surface-body)]">
          {copy.description}
        </Text>
      </div>

      {/* Form — stacked canon mobile-first */}
      <form action={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col [gap:var(--bbf-space-2\.5)]">
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
              'h-12 w-full [border-radius:var(--bbf-radius-interactive)] px-5',
              '[font-size:var(--bbf-text-body-md)]',
              'bg-[var(--bbf-on-surface-input-bg)]',
              'border border-[var(--bbf-on-surface-input-border)]',
              'text-[var(--bbf-on-surface-title)] placeholder:text-[var(--bbf-on-surface-muted)]',
              'transition-all [transition-duration:var(--bbf-motion-duration-fast)] [transition-timing-function:var(--bbf-motion-ease-out-quart)]',
              'focus:border-[var(--bbf-accent-blue)] focus:ring-2 focus:ring-[var(--bbf-on-surface-focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--bbf-on-surface-bg)] focus:outline-none',
              'disabled:cursor-not-allowed disabled:[opacity:var(--bbf-opacity-dim)]',
            )}
          />
          <Button
            type="submit"
            intent="primary"
            size="md"
            disabled={state.kind === 'submitting'}
            className="w-full"
          >
            {state.kind === 'submitting' ? copy.submittingLabel : copy.submitLabel}
          </Button>
        </div>

        <Text variant="caption" as="p" className="text-[var(--bbf-on-surface-muted)]">
          {copy.privacyNote}
        </Text>

        {state.kind === 'error' && (
          <p
            className="[font-size:var(--bbf-text-body-sm)] text-[var(--bbf-color-error-text)]"
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
