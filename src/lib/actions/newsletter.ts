'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { z } from 'zod';
import { getPayload } from 'payload';
import config from '@/payload-config';
import { newsletterRateLimit, getClientIp } from '@/lib/security/rate-limit';
import { isDisposableEmail } from '@/lib/security/disposable-emails';

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
// TODO FASE 6: migrar a getSiteIdentity() — módulo-level init impide llamada async por ahora
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sivarbrains.com';
const FROM_NEWSLETTER =
  process.env.RESEND_FROM_NEWSLETTER ?? 'Sivar Brains Newsletter <newsletter@sivarbrains.com>';

const NewsletterSchema = z.object({
  email: z.string().email(),
  locale: z.enum(['es', 'en']).default('es'),
});

type NewsletterResult = { ok: true } | { ok: false; error: string };

export async function subscribeNewsletter(formData: FormData): Promise<NewsletterResult> {
  if (!AUDIENCE_ID) {
    console.error('[newsletter] RESEND_AUDIENCE_ID missing');
    return { ok: false, error: 'serverConfig' };
  }

  const headerList = await headers();
  const ip = getClientIp(headerList);

  const { success: rateLimitOk } = await newsletterRateLimit.limit(`newsletter:${ip}`);
  if (!rateLimitOk) {
    console.warn('[newsletter] rate limited IP:', ip);
    return { ok: false, error: 'rateLimit' };
  }

  const parsed = NewsletterSchema.safeParse({
    email: formData.get('email'),
    locale: formData.get('locale') ?? 'es',
  });

  if (!parsed.success) {
    return { ok: false, error: 'validation' };
  }

  const { email, locale } = parsed.data;

  if (isDisposableEmail(email)) {
    return { ok: false, error: 'disposable' };
  }

  // Lookup SiteNewsletter runtime — fresh por cada submission
  const payload = await getPayload({ config });
  const newsletter = await payload.findGlobal({ slug: 'site-newsletter', locale });

  if (!newsletter.enabled) {
    return { ok: false, error: 'disabled' };
  }

  try {
    const { data: contactData, error: contactError } = await resend.contacts.create({
      audienceId: AUDIENCE_ID,
      email,
      unsubscribed: true,
    });

    if (contactError) {
      console.error('[newsletter] Resend contact creation failed', contactError);
      return { ok: false, error: 'provider' };
    }

    const confirmationUrl = `${SITE_URL}/api/newsletter/confirm?contactId=${contactData?.id}&audienceId=${AUDIENCE_ID}`;

    const { error: emailError } = await resend.emails.send({
      from: FROM_NEWSLETTER,
      to: email,
      subject: newsletter.confirmationEmailSubject ?? 'Confirmá tu suscripción a BBF Newsletter',
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h1 style="font-size: 20px; margin-bottom: 16px;">${newsletter.title ?? 'BBF Newsletter'}</h1>
          <p style="line-height: 1.6; margin-bottom: 24px;">
            ${newsletter.confirmationEmailBody ?? 'Hacé click en el link de abajo para confirmar tu suscripción.'}
          </p>
          <p>
            <a href="${confirmationUrl}"
               style="display: inline-block; padding: 12px 24px; background: #111; color: #fff; text-decoration: none; border-radius: 6px;">
              Confirmar suscripción
            </a>
          </p>
          <p style="font-size: 12px; color: #666; margin-top: 32px;">
            Si no te suscribiste, ignorá este email. No te enviaremos nada más.
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error('[newsletter] Confirmation email failed', emailError);
      return { ok: false, error: 'email' };
    }

    return { ok: true };
  } catch (err) {
    console.error('[newsletter] Unexpected error', err);
    return { ok: false, error: 'unexpected' };
  }
}
