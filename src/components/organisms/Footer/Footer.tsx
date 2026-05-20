import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { cn } from '@/lib/utils';

type FooterProps = {
  className?: string;
};

const FOOTER_COPY = {
  es: {
    tagline: 'Piensa, y que trabaje tu marca.',
    contact: 'Contacto',
    privacy: 'Privacidad',
    contactEmail: 'contacto@brandbrainfoundry.com',
    rights: 'Todos los derechos reservados.',
  },
  en: {
    tagline: 'Think, and let your brand work.',
    contact: 'Contact',
    privacy: 'Privacy',
    contactEmail: 'contacto@brandbrainfoundry.com',
    rights: 'All rights reserved.',
  },
} as const;

export async function Footer({ className }: FooterProps) {
  const locale = await getLocale();
  const copy = FOOTER_COPY[locale === 'en' ? 'en' : 'es'];
  const contactHref = locale === 'en' ? '/en/contact' : '/contacto';
  const privacyHref = locale === 'en' ? '/en/privacy' : '/privacidad';
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'mt-24 border-t border-[var(--bbf-border-on-light)]',
        'bg-[var(--bbf-surface-sand)]',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-2 text-lg font-bold text-[var(--bbf-text-on-light)]">
              Brand Brain Foundry
            </div>
            <p className="max-w-xs text-sm text-[var(--bbf-text-on-light-secondary)]">
              {copy.tagline}
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation" className="flex flex-col gap-2">
            <Link
              href={contactHref}
              className="text-sm text-[var(--bbf-text-on-light)] transition-opacity hover:opacity-70"
            >
              {copy.contact}
            </Link>
            <Link
              href={privacyHref}
              className="text-sm text-[var(--bbf-text-on-light)] transition-opacity hover:opacity-70"
            >
              {copy.privacy}
            </Link>
          </nav>

          {/* Contact */}
          <div className="text-sm">
            <a
              href={`mailto:${copy.contactEmail}`}
              className="text-[var(--bbf-text-on-light)] transition-opacity hover:opacity-70"
            >
              {copy.contactEmail}
            </a>
          </div>
        </div>

        <div className="border-t border-[var(--bbf-border-on-light)] pt-6 text-xs text-[var(--bbf-text-on-light-muted)]">
          © {year} Brand Brain Foundry. {copy.rights}
        </div>
      </div>
    </footer>
  );
}
