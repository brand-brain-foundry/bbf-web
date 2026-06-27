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
import { ChipGroup, type ChipOption } from '@/components/atoms/ChipGroup';
import { cn } from '@/lib/utils';
import { contactFormVariants, contactFormFeedbackVariants } from './ContactForm.variants';

type FormConfig = {
  title?: string | null;
  stageLabel?: string | null;
  roleLabel?: string | null;
  messagePlaceholder?: string | null;
  requiredHint?: string | null;
  submitLabel?: string | null;
  stageOptions?: ChipOption[] | null;
  roleOptions?: Array<{ value: string; label: string }> | null;
};

type ContactFormProps = {
  locale: 'es' | 'en';
  className?: string;
  formConfig?: FormConfig | null;
  successTitle?: string | null;
  successBody?: string | null;
};

const MESSAGE_MAXLENGTH = 5000;

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

export function ContactForm({
  locale,
  className,
  formConfig,
  successTitle,
  successBody,
}: ContactFormProps) {
  const [state, formAction] = useActionState<ContactFormState | null, FormData>(
    submitContact,
    null,
  );
  const [formLoadTime] = useState(() => Date.now());
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [stage, setStage] = useState('');
  const [rol, setRol] = useState('');
  const t = useTranslations('contact');

  const {
    register,
    watch,
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
      rol: '',
      stage: '',
    },
  });

  const messageLength = watch('message')?.length ?? 0;

  useEffect(() => {
    if (state?.success) {
      reset();
      setStage('');
      setRol('');
      const form = document.getElementById('bbf-contact-form') as HTMLFormElement | null;
      form?.reset();
      startTransition(() => {
        setTurnstileToken('');
        setTurnstileReady(false);
      });
    }
  }, [state?.success, reset]);

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

  const stageOptions = (formConfig?.stageOptions ?? []).filter(
    (o): o is ChipOption => typeof o.value === 'string' && typeof o.label === 'string',
  );

  const roleOptions = (formConfig?.roleOptions ?? []).filter(
    (o): o is { value: string; label: string } =>
      typeof o.value === 'string' && typeof o.label === 'string',
  );

  const stageLabel = formConfig?.stageLabel ?? t('stageLabel');
  const roleLabel = formConfig?.roleLabel ?? t('roleLabel');
  const requiredHint = formConfig?.requiredHint ?? t('requiredHint');
  const submitLabel = formConfig?.submitLabel ?? t('submit');
  const messagePlaceholder = formConfig?.messagePlaceholder ?? undefined;

  return (
    <div data-component="bbf-contact-form" className={cn(contactFormVariants(), className)}>
      <form
        id="bbf-contact-form"
        action={formAction}
        className="flex flex-col gap-3 lg:gap-4"
        noValidate
      >
        {/* Hidden fields security */}
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="formLoadTime" value={formLoadTime} />
        <input type="hidden" name="cf-turnstile-response" value={turnstileToken} />

        {/* Enrichment fields — not security-bearing, passed as context to submission */}
        <input type="hidden" name="stage" value={stage} />
        <input type="hidden" name="rol" value={rol} />

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

        {/* Stage chips — arriba, emula referencia */}
        {stageOptions.length > 0 && (
          <ChipGroup
            name="stage-display"
            legend={stageLabel}
            options={stageOptions}
            value={stage}
            onChange={setStage}
          />
        )}

        {/* Row 1: Nombre + Empresa — inline pair */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
          <FormField
            label={t('name')}
            required
            maxLength={120}
            autoComplete="name"
            error={errorFor('name')}
            {...register('name')}
          />
          <FormField
            label={t('company')}
            maxLength={200}
            autoComplete="organization"
            error={errorFor('company')}
            {...register('company')}
          />
        </div>

        {/* Row 2: Email + Rol — inline pair */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
          <FormField
            label={t('email')}
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            error={errorFor('email')}
            className={roleOptions.length === 0 ? 'sm:col-span-2' : undefined}
            {...register('email')}
          />
          {roleOptions.length > 0 && (
            <div data-component="bbf-select-field" className="flex flex-col">
              <label
                htmlFor="field-rol"
                className="mb-1.5 [font-size:var(--bbf-text-caption)] font-medium text-[var(--bbf-on-surface-body)]"
              >
                {roleLabel}
              </label>
              <select
                id="field-rol"
                name="rol-display"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className={cn(
                  'w-full appearance-none border',
                  '[font-size:var(--bbf-text-body-md)]',
                  'bg-[var(--bbf-on-surface-input-bg)]',
                  'text-[var(--bbf-on-surface-body)]',
                  'border-[var(--bbf-on-surface-input-border)]',
                  'transition-all duration-200 ease-out',
                  'focus:ring-2 focus:ring-[var(--bbf-on-surface-focus-ring)] focus:ring-offset-2 focus:outline-none',
                  'cursor-pointer',
                )}
              >
                <option value=""></option>
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Mensaje */}
        <FormField
          label={t('message')}
          type="textarea"
          required
          rows={6}
          maxLength={MESSAGE_MAXLENGTH}
          placeholder={messagePlaceholder}
          error={errorFor('message')}
          {...register('message')}
        />

        {/* Footer: required hint + counter + captcha + submit */}
        <div className="mt-2 flex flex-col gap-4 border-t border-[var(--bbf-on-surface-border)] pt-5">
          <div className="flex items-center justify-between gap-4">
            <Text variant="caption" color="secondary">
              {requiredHint}
            </Text>
            <span
              className="shrink-0 [font-family:var(--bbf-font-mono)] [font-size:var(--bbf-text-xs)] text-[var(--bbf-on-surface-muted)] tabular-nums"
              aria-live="polite"
              aria-label={`${messageLength} / ${MESSAGE_MAXLENGTH}`}
            >
              {messageLength}/{MESSAGE_MAXLENGTH}
            </span>
          </div>

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
              <Text variant="body-md">
                {state.success ? (successTitle ?? state.message) : state.message}
              </Text>
              {state.success && successBody && (
                <Text variant="body-sm" color="secondary" className="mt-1">
                  {successBody}
                </Text>
              )}
            </div>
          )}

          <SubmitButton
            submit={submitLabel}
            submitting={t('submitting')}
            verifying={t('verifying')}
            turnstileReady={turnstileReady}
            isValid={isSubmitted ? isValid : true}
          />
        </div>
      </form>
    </div>
  );
}
