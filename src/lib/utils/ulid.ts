import { ulid } from 'ulid';

export const generateUlid = (): string => ulid();

export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const isValidSlug = (s: string): boolean => slugRegex.test(s);
