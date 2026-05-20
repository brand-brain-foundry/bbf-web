'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactFormState = {
  success: boolean;
  message: string;
};

const CONTACT_EMAIL = 'hola@brandbrainfoundry.com';
const FROM_EMAIL = 'web@brandbrainfoundry.com';

export async function submitContact(
  prevState: ContactFormState | null,
  formData: FormData,
): Promise<ContactFormState> {
  const name = formData.get('name')?.toString().trim() ?? '';
  const email = formData.get('email')?.toString().trim() ?? '';
  const company = formData.get('company')?.toString().trim() ?? '';
  const message = formData.get('message')?.toString().trim() ?? '';
  const locale = formData.get('locale')?.toString() === 'en' ? 'en' : 'es';

  if (!name || !email || !message) {
    return {
      success: false,
      message:
        locale === 'es'
          ? 'Por favor completá nombre, email y mensaje.'
          : 'Please complete name, email and message.',
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      success: false,
      message: locale === 'es' ? 'El email no parece válido.' : 'The email does not look valid.',
    };
  }

  if (message.length > 5000) {
    return {
      success: false,
      message: locale === 'es' ? 'El mensaje es demasiado largo.' : 'The message is too long.',
    };
  }

  try {
    const { error } = await resend.emails.send({
      from: `BBF Web <${FROM_EMAIL}>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `Nuevo contacto BBF — ${name}${company ? ` · ${company}` : ''}`,
      text: [
        `Nombre: ${name}`,
        `Email: ${email}`,
        `Empresa: ${company || '—'}`,
        `Locale: ${locale}`,
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
            ? 'Algo falló al enviar. Escribinos a hola@brandbrainfoundry.com.'
            : 'Sending failed. Write to hola@brandbrainfoundry.com.',
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
