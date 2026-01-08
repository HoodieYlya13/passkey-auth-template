import { ERROR_CODES } from '@/utils/errors';
import { z } from 'zod';

const noLeadingOrTrailingWhitespace = (val: string) =>
  val === val.trim();

export const LoginTestingModeSchema = z.object({
  password: z
    .string()
    .min(4, { message: ERROR_CODES.PASSWORD.TOO_SHORT })
    .max(30, { message: ERROR_CODES.PASSWORD.TOO_LONG })
    .refine(noLeadingOrTrailingWhitespace, {
      message: ERROR_CODES.PASSWORD.STARTS_OR_ENDS_WITH_WHITESPACE,
    }),
});

export type LoginTestingModeValues = z.infer<typeof LoginTestingModeSchema>;