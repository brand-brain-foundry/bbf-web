/**
 * Cloudflare Turnstile server-side verification
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

type TurnstileResponse = {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
};

/**
 * Verifica token Turnstile del cliente contra Cloudflare
 * @param token - cf-turnstile-response del form
 * @param ip - IP del cliente (opcional, mejora precisión)
 * @returns success boolean + error codes si falla
 */
export async function verifyTurnstile(
  token: string,
  ip?: string,
): Promise<{ success: boolean; errors?: string[] }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.error('[turnstile] TURNSTILE_SECRET_KEY missing');
    return { success: false, errors: ['missing-secret'] };
  }

  if (!token) {
    return { success: false, errors: ['missing-token'] };
  }

  try {
    const formData = new FormData();
    formData.append('secret', secret);
    formData.append('response', token);
    if (ip) formData.append('remoteip', ip);

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('[turnstile] verify HTTP error:', response.status);
      return { success: false, errors: ['network-error'] };
    }

    const data = (await response.json()) as TurnstileResponse;

    if (!data.success) {
      console.warn('[turnstile] verification failed:', data['error-codes']);
      return { success: false, errors: data['error-codes'] };
    }

    return { success: true };
  } catch (err) {
    console.error('[turnstile] verify exception:', err);
    return { success: false, errors: ['exception'] };
  }
}
