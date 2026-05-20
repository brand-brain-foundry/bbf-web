/**
 * Disposable email domains blacklist
 * Source: github.com/disposable/disposable-email-domains
 * Updated: 2026-05-20 (quarterly review canon BBF)
 *
 * Lista curada — top 50 dominios más comunes en spam B2B
 * Update cadence: quarterly review
 */

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  '10minutemail.com',
  '10minutemail.net',
  'throwawaymail.com',
  'yopmail.com',
  'maildrop.cc',
  'sharklasers.com',
  'getairmail.com',
  'dispostable.com',
  'trashmail.com',
  'fakeinbox.com',
  'tempinbox.com',
  'mohmal.com',
  'mailnesia.com',
  'mailcatch.com',
  'getnada.com',
  'mintemail.com',
  'spambox.us',
  'mytemp.email',
  'tempmailo.com',
  'tmpmail.org',
  'tmpmail.net',
  'tmpeml.com',
  'tmpbox.net',
  'fakemail.fr',
  'fakemail.net',
  'fakemailgenerator.com',
  'discard.email',
  'spamgourmet.com',
  'mailtothis.com',
  'tempemail.com',
  'tempemail.net',
  'emailondeck.com',
  'emailfake.com',
  'mailpoof.com',
  'inboxbear.com',
  'inboxalias.com',
  'wegwerfemail.de',
  'mvrht.com',
  'mailforspam.com',
  'spambog.com',
  'spamoff.de',
  'jetable.org',
  'monumentmail.com',
  'mailtemp.info',
  'mailbox80.com',
  'trbvm.com',
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1]?.trim();
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}
