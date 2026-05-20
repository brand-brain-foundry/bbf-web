import { z } from 'zod';

export const contactSchemaKeys = {
  nameRequired: 'name.required',
  nameMin: 'name.min',
  nameMax: 'name.max',
  emailRequired: 'email.required',
  emailInvalid: 'email.invalid',
  emailMax: 'email.max',
  companyMax: 'company.max',
  messageRequired: 'message.required',
  messageMin: 'message.min',
  messageMax: 'message.max',
} as const;

export type ContactSchemaKey = (typeof contactSchemaKeys)[keyof typeof contactSchemaKeys];

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: contactSchemaKeys.nameRequired })
    .min(2, { message: contactSchemaKeys.nameMin })
    .max(120, { message: contactSchemaKeys.nameMax }),

  email: z
    .string()
    .trim()
    .min(1, { message: contactSchemaKeys.emailRequired })
    .email({ message: contactSchemaKeys.emailInvalid })
    .max(200, { message: contactSchemaKeys.emailMax }),

  company: z
    .string()
    .trim()
    .max(200, { message: contactSchemaKeys.companyMax })
    .optional()
    .or(z.literal('')),

  message: z
    .string()
    .trim()
    .min(1, { message: contactSchemaKeys.messageRequired })
    .min(10, { message: contactSchemaKeys.messageMin })
    .max(5000, { message: contactSchemaKeys.messageMax }),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const contactErrorMessages = {
  es: {
    [contactSchemaKeys.nameRequired]: 'El nombre es obligatorio.',
    [contactSchemaKeys.nameMin]: 'El nombre debe tener al menos 2 caracteres.',
    [contactSchemaKeys.nameMax]: 'El nombre es demasiado largo.',
    [contactSchemaKeys.emailRequired]: 'El email es obligatorio.',
    [contactSchemaKeys.emailInvalid]: 'El email no parece válido.',
    [contactSchemaKeys.emailMax]: 'El email es demasiado largo.',
    [contactSchemaKeys.companyMax]: 'El nombre de empresa es demasiado largo.',
    [contactSchemaKeys.messageRequired]: 'El mensaje es obligatorio.',
    [contactSchemaKeys.messageMin]: 'El mensaje debe tener al menos 10 caracteres.',
    [contactSchemaKeys.messageMax]: 'El mensaje es demasiado largo (máx 5000).',
  },
  en: {
    [contactSchemaKeys.nameRequired]: 'Name is required.',
    [contactSchemaKeys.nameMin]: 'Name must be at least 2 characters.',
    [contactSchemaKeys.nameMax]: 'Name is too long.',
    [contactSchemaKeys.emailRequired]: 'Email is required.',
    [contactSchemaKeys.emailInvalid]: 'Email does not look valid.',
    [contactSchemaKeys.emailMax]: 'Email is too long.',
    [contactSchemaKeys.companyMax]: 'Company name is too long.',
    [contactSchemaKeys.messageRequired]: 'Message is required.',
    [contactSchemaKeys.messageMin]: 'Message must be at least 10 characters.',
    [contactSchemaKeys.messageMax]: 'Message is too long (max 5000).',
  },
} as const;

export function getContactErrorMessage(key: string | undefined, locale: 'es' | 'en'): string {
  if (!key) return '';
  const messages = contactErrorMessages[locale];
  return messages[key as keyof typeof messages] ?? key;
}
