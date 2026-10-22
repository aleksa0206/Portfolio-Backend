import { z } from 'zod';
import { ErrorCode } from '../types/enums';

// a path/URL, or an inline image uploaded from the admin panel (resized client-side)
const imageUrl = z
  .string()
  .max(90_000)
  .refine((v) => !v.startsWith('data:') || /^data:image\/(jpeg|png|webp);base64,/.test(v))
  .optional();

// empty clears it; only https links, so nothing like javascript: ends up in an href
const profileUrl = z
  .string()
  .max(191)
  .refine((v) => v === '' || /^https:\/\/\S+$/.test(v))
  .optional();

export const saveAboutSchema = z.object({
  fullName: z.string().min(1, ErrorCode.FULL_NAME_REQUIRED),
  title: z.string().min(1, ErrorCode.TITLE_REQUIRED),
  bio: z.string().min(1, ErrorCode.BIO_REQUIRED),
  photoUrl: imageUrl,
  faviconUrl: imageUrl,
  tagline: z.string().max(500).optional(),
  linkedinUrl: profileUrl,
  githubUrl: profileUrl,
  // overrides for small static texts on the site, keyed by text id (defaults live in the frontend)
  texts: z.record(z.string().max(64), z.string().max(2000)).optional(),
  // extra contact rows; the frontend only renders https values as links
  contactLinks: z
    .array(z.object({ label: z.string().trim().min(1).max(30), value: z.string().trim().min(1).max(300) }))
    .max(20)
    .optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
});
