import { ERROR_CODES, noWhitespace } from "@/utils/errors.utils";
import { z } from "zod";

export const createUpdatePasskeyNameSchema = (defaultPasskeyName = "") =>
  z.object({
    passkeyName: z
      .string()
      .max(30, ERROR_CODES.PASSKEY.TOO_LONG)
      .refine(noWhitespace, {
        message: ERROR_CODES.PASSKEY.HAS_WHITESPACE,
      })
      .refine((val) => val !== defaultPasskeyName, {
        message: ERROR_CODES.PASSKEY.SAME,
      }),
  });

export const UpdatePasskeyNameSchema = createUpdatePasskeyNameSchema("");

export type UpdatePasskeyNameValues = z.infer<typeof UpdatePasskeyNameSchema>;
