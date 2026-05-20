'use client';

import { useActionState, useCallback, useEffect, useState, startTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitContact, type ContactFormState } from '@/lib/actions/contact';
import { contactSchema, getContactErrorMessage, type ContactFormData } from '@/lib/schemas/contact';
import { Button } from '@/components/atoms/Button';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { FormField } from '@/components/molecules/FormField';
import { Turnstile } from '@/components/molecules/Turnstile';
import { cn } from '@/lib/utils';

type ContactFormProps = {
  locale: 'es' | 'en';
  className?: string;
};

const COPY = {
  es: {
    title: 'Sentémonos a pensar',
    intro: 'Contanos qué necesitás. Te respondemos para coordinar conversación.',
    name: 'Nombre',
    email: 'Email',
    company: 'Empresa (opcional)',
    message: 'Mensaje',
    submit: 'Enviar',
    submitting: 'Enviando…',
    requiredHint: 'Los campos con * son obligatorios.',
    verifying: 'Verificando seguridad…',
  },
  en: {
    title: 'Let us think together',
    intro: 'Tell us what you need. We respond to coordinate a conversation.',
    name: 'Name',
    email: 'Email',
    company: 'Company (optional)',
    message: 'Message',
    submit: 'Send',
    submitting: 'Sending…',
    requiredHint: 'Fields marked * are required.',
    verifying: 'Verifying security…',
  },
} as const;

function SubmitButton({
  copy,
  turnstileReady,
  isValid,
}: {
  copy: (typeof COPY)['es'] | (typeof COPY)['en'];
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
      {pending ? copy.submitting : !turnstileReady ? copy.verifying : copy.submit}
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
  const copy = COPY[locale];

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
    <div data-component="bbf-contact-form" className={cn('contact-form', className)}>
      <Heading level="display-md" weight="bold" className="mb-6">
        {copy.title}
      </Heading>

      <Text variant="body-lg" color="secondary" className="mb-8 max-w-prose">
        {copy.intro}
      </Text>

      <form id="bbf-contact-form" action={formAction} className="max-w-prose space-y-6" noValidate>
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
          label={copy.name}
          required
          maxLength={120}
          autoComplete="name"
          error={errorFor('name')}
          {...register('name')}
        />

        <FormField
          label={copy.email}
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          error={errorFor('email')}
          {...register('email')}
        />

        <FormField
          label={copy.company}
          maxLength={200}
          autoComplete="organization"
          error={errorFor('company')}
          {...register('company')}
        />

        <FormField
          label={copy.message}
          type="textarea"
          required
          rows={6}
          maxLength={5000}
          error={errorFor('message')}
          {...register('message')}
        />

        <Text variant="caption" color="secondary">
          {copy.requiredHint}
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
            className={cn(
              'rounded-md p-4',
              'transition-all duration-300',
              state.success
                ? 'bg-[oklch(0.95_0.05_140)] text-[oklch(0.45_0.15_140)]'
                : 'bg-[oklch(0.95_0.05_25)] text-[var(--bbf-color-red-base)]',
            )}
            role={state.success ? 'status' : 'alert'}
            aria-live="polite"
          >
            <Text variant="body-md">{state.message}</Text>
          </div>
        )}

        <SubmitButton
          copy={copy}
          turnstileReady={turnstileReady}
          isValid={isSubmitted ? isValid : true}
        />
      </form>
    </div>
  );
}
