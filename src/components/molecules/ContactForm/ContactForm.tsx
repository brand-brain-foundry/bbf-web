'use client';

import { useActionState, useCallback, useEffect, useState, startTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { submitContact, type ContactFormState } from '@/lib/actions/contact';
import { contactSchema, getContactErrorMessage, type ContactFormData } from '@/lib/schemas/contact';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { FormField } from '@/components/molecules/FormField';
import { Turnstile } from '@/components/molecules/Turnstile';
import { cn } from '@/lib/utils';
import { contactFormVariants, contactFormFeedbackVariants } from './ContactForm.variants';

type ContactFormProps = {
  locale: 'es' | 'en';
  className?: string;
};

function SubmitButton({
  submit,
  submitting,
  verifying,
  turnstileReady,
  isValid,
}: {
  submit: string;
  submitting: string;
  verifying: string;
  turnstileReady: boolean;
  isValid: boolean;
}) {
  const { pending } = useFormStatus();
  const disabled = pending || !turnstileReady || !isValid;

  return (
    <Button
      type="submit"
      intent="primary"
      size="lg"
      disabled={disabled}
      className="w-full md:w-auto"
    >
      {pending ? submitting : !turnstileReady ? verifying : submit}
    </Button>
  );
}

export function ContactForm({ locale, className }: ContactFormProps) {
  const [state, formAction] = useActionState<ContactFormState | null, FormData>(
    submitContact,
    null,
  );
  const [formLoadTime] = useState(() => Date.now());
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [turnstileReady, setTurnstileReady] = useState(false);
  const t = useTranslations('contact');

  const {
    register,
    formState: { errors, isValid, isSubmitted },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      company: '',
      message: '',
    },
  });

  // Reset form on success
  useEffect(() => {
    if (state?.success) {
      reset();
      const form = document.getElementById('bbf-contact-form') as HTMLFormElement | null;
      form?.reset();
      startTransition(() => {
        setTurnstileToken('');
        setTurnstileReady(false);
      });
    }
  }, [state?.success, reset]);

  // Stable callback refs — evitan re-render loop Turnstile widget
  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
    setTurnstileReady(true);
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileReady(false);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken('');
    setTurnstileReady(false);
  }, []);

  const errorFor = (field: keyof ContactFormData) => {
    const msg = errors[field]?.message;
    return msg ? getContactErrorMessage(msg, locale) : undefined;
  };

  return (
    <div data-component="bbf-contact-form" className={cn(contactFormVariants(), className)}>
      <form
        id="bbf-contact-form"
        action={formAction}
        className="flex flex-col gap-5 lg:gap-6"
        noValidate
      >
        {/* Hidden fields security */}
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="formLoadTime" value={formLoadTime} />
        <input type="hidden" name="cf-turnstile-response" value={turnstileToken} />

        {/* Honeypot — hidden a humanos, bots lo llenan */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 'auto',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          <label htmlFor="website">Website (leave blank)</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <FormField
          label={t('name')}
          required
          maxLength={120}
          autoComplete="name"
          error={errorFor('name')}
          {...register('name')}
        />

        <FormField
          label={t('email')}
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          error={errorFor('email')}
          {...register('email')}
        />

        <FormField
          label={t('company')}
          maxLength={200}
          autoComplete="organization"
          error={errorFor('company')}
          {...register('company')}
        />

        <FormField
          label={t('message')}
          type="textarea"
          required
          rows={6}
          maxLength={5000}
          error={errorFor('message')}
          {...register('message')}
        />

        <Text variant="caption" color="secondary">
          {t('requiredHint')}
        </Text>

        {/* Cloudflare Turnstile widget — flexible mode canon 2026 */}
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''}
          size="flexible"
          theme="auto"
          onSuccess={handleTurnstileSuccess}
          onError={handleTurnstileError}
          onExpire={handleTurnstileExpire}
        />

        {state && (
          <div
            className={contactFormFeedbackVariants({ success: state.success })}
            role={state.success ? 'status' : 'alert'}
            aria-live="polite"
          >
            <Text variant="body-md">{state.message}</Text>
          </div>
        )}

        <SubmitButton
          submit={t('submit')}
          submitting={t('submitting')}
          verifying={t('verifying')}
          turnstileReady={turnstileReady}
          isValid={isSubmitted ? isValid : true}
        />
      </form>
    </div>
  );
}
