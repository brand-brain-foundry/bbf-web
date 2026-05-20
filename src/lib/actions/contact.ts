'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { getPayload } from 'payload';
import config from '@/payload-config';
import { contactRateLimit, getClientIp } from '@/lib/security/rate-limit';
import { verifyTurnstile } from '@/lib/security/turnstile';
import { isDisposableEmail } from '@/lib/security/disposable-emails';
import { contactSchema } from '@/lib/schemas/contact';

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactFormState = {
  success: boolean;
  message: string;
};

// Time threshold: humanos tardan al menos 2 segundos en llenar form
const MIN_FILL_TIME_MS = 2000;

export async function submitContact(
  prevState: ContactFormState | null,
  formData: FormData,
): Promise<ContactFormState> {
  // ===== EXTRAER DATA =====
  const name = formData.get('name')?.toString().trim() ?? '';
  const email = formData.get('email')?.toString().trim() ?? '';
  const company = formData.get('company')?.toString().trim() ?? '';
  const message = formData.get('message')?.toString().trim() ?? '';
  const locale = formData.get('locale')?.toString() === 'en' ? 'en' : 'es';

  // Honeypot field — bots llenan, humanos ignoran
  const honeypot = formData.get('website')?.toString().trim() ?? '';

  // Time-based check — submit timestamp from form load
  const formLoadTimestamp = Number(formData.get('formLoadTime') ?? 0);

  // Turnstile token
  const turnstileToken = formData.get('cf-turnstile-response')?.toString() ?? '';

  // ===== CAPA 1: HONEYPOT =====
  if (honeypot.length > 0) {
    // Bot detected — fail silently con mensaje genérico
    console.warn('[contact] honeypot triggered');
    return {
      success: false,
      message:
        locale === 'es' ? 'No se pudo procesar. Probá de nuevo.' : 'Could not process. Try again.',
    };
  }

  // ===== CAPA 2: TIME-BASED CHECK =====
  if (formLoadTimestamp > 0) {
    const elapsed = Date.now() - formLoadTimestamp;
    if (elapsed < MIN_FILL_TIME_MS) {
      console.warn('[contact] submit too fast:', elapsed, 'ms');
      return {
        success: false,
        message:
          locale === 'es'
            ? 'No se pudo procesar. Probá de nuevo.'
            : 'Could not process. Try again.',
      };
    }
  }

  // ===== CAPA 3: RATE LIMIT IP =====
  const headerList = await headers();
  const ip = getClientIp(headerList);

  const { success: rateLimitOk } = await contactRateLimit.limit(ip);

  if (!rateLimitOk) {
    console.warn('[contact] rate limited IP:', ip);
    return {
      success: false,
      message:
        locale === 'es'
          ? 'Demasiados intentos. Esperá 10 minutos.'
          : 'Too many attempts. Wait 10 minutes.',
    };
  }

  // ===== CAPA 4: TURNSTILE =====
  const turnstile = await verifyTurnstile(turnstileToken, ip);

  if (!turnstile.success) {
    console.warn('[contact] turnstile failed:', turnstile.errors);
    return {
      success: false,
      message:
        locale === 'es'
          ? 'Verificación de seguridad falló. Recargá la página.'
          : 'Security verification failed. Reload the page.',
    };
  }

  // ===== VALIDACIÓN ZOD (schema compartido con cliente) =====
  const parsed = contactSchema.safeParse({ name, email, company, message });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    console.warn('[contact] zod validation failed:', firstError?.message);
    return {
      success: false,
      message:
        locale === 'es'
          ? 'Por favor revisá los datos del formulario.'
          : 'Please review the form data.',
    };
  }

  // ===== CAPA 5: DISPOSABLE EMAIL =====
  if (isDisposableEmail(email)) {
    console.warn('[contact] disposable email blocked:', email);
    return {
      success: false,
      message:
        locale === 'es' ? 'Por favor usá un email permanente.' : 'Please use a permanent email.',
    };
  }

  // ===== LEER EMAILS DESDE SITECONTACT (SSOT) =====
  // Lookup SiteContact runtime — fresh por cada submission
  // (sin unstable_cache porque form submit es eventual, no hot path)
  const payload = await getPayload({ config });
  const siteContact = await payload.findGlobal({ slug: 'site-contact' });
  const recipientEmail = siteContact.primaryEmail;
  const fromEmail = siteContact.fromEmail;

  // ===== ENVIAR EMAIL =====
  try {
    const { error } = await resend.emails.send({
      from: `BBF Web <${fromEmail}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `Nuevo contacto BBF — ${name}${company ? ` · ${company}` : ''}`,
      text: [
        `Nombre: ${name}`,
        `Email: ${email}`,
        `Empresa: ${company || '—'}`,
        `Locale: ${locale}`,
        `IP: ${ip}`,
        '',
        'Mensaje:',
        message,
      ].join('\n'),
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      return {
        success: false,
        message:
          locale === 'es'
            ? 'Algo falló al enviar. Por favor intentá de nuevo.'
            : 'Sending failed. Please try again.',
      };
    }

    return {
      success: true,
      message:
        locale === 'es' ? 'Recibido. Te respondemos pronto.' : 'Received. We will respond soon.',
    };
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return {
      success: false,
      message:
        locale === 'es'
          ? 'Algo falló. Probá de nuevo o escribinos directamente.'
          : 'Something failed. Try again or write directly.',
    };
  }
}
