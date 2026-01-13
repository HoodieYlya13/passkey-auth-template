import { ERROR_CODES } from "@/utils/errors.utils";
import { z } from "zod";

const noWhitespace = (val: string) => !/\s/.test(val);

export const createUpdateUsernameSchema = (defaultUsername = "") =>
  z.object({
    username: z
      .string()
      .max(30, ERROR_CODES.USERNAME.TOO_LONG)
      .refine(noWhitespace, {
        message: ERROR_CODES.USERNAME.HAS_WHITESPACE,
      })
      .refine(
        (val) => defaultUsername === "" || val !== defaultUsername,
        {
          message: ERROR_CODES.USERNAME.SAME,
        }
      ),
  });

export const UpdateUsernameSchema = createUpdateUsernameSchema("");

export type UpdateUsernameValues = z.infer<typeof UpdateUsernameSchema>;
