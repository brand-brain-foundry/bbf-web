'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContact, type ContactFormState } from '@/lib/actions/contact';
import { Button } from '@/components/atoms/Button';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
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
  },
} as const;

function SubmitButton({ copy }: { copy: (typeof COPY)['es'] | (typeof COPY)['en'] }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      intent="primary"
      size="lg"
      disabled={pending}
      className="w-full md:w-auto"
    >
      {pending ? copy.submitting : copy.submit}
    </Button>
  );
}

const inputClass =
  'w-full px-4 py-3 border border-[var(--bbf-color-sand-base)] rounded-md bg-white focus:outline-none focus:border-[var(--bbf-color-red-base)] focus:ring-1 focus:ring-[var(--bbf-color-red-base)] transition-colors';

export function ContactForm({ locale, className }: ContactFormProps) {
  const [state, formAction] = useActionState<ContactFormState | null, FormData>(
    submitContact,
    null,
  );
  const copy = COPY[locale];

  return (
    <div data-component="bbf-contact-form" className={cn('contact-form', className)}>
      <Heading level="display-md" weight="bold" className="mb-6">
        {copy.title}
      </Heading>

      <Text variant="body-lg" color="secondary" className="mb-8 max-w-prose">
        {copy.intro}
      </Text>

      <form action={formAction} className="max-w-prose space-y-6">
        <input type="hidden" name="locale" value={locale} />

        <div>
          <label htmlFor="name" className="mb-2 block">
            <Text variant="body-md" weight="medium" as="span">
              {copy.name} *
            </Text>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block">
            <Text variant="body-md" weight="medium" as="span">
              {copy.email} *
            </Text>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="company" className="mb-2 block">
            <Text variant="body-md" weight="medium" as="span">
              {copy.company}
            </Text>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            maxLength={200}
            autoComplete="organization"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block">
            <Text variant="body-md" weight="medium" as="span">
              {copy.message} *
            </Text>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            maxLength={5000}
            className={inputClass}
          />
        </div>

        <Text variant="caption" color="secondary">
          {copy.requiredHint}
        </Text>

        {state && (
          <div
            className={cn(
              'rounded-md p-4',
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

        <SubmitButton copy={copy} />
      </form>
    </div>
  );
}
