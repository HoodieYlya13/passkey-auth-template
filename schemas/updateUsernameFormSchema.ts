import { z } from "zod";

const noWhitespace = (val: string) => !/\s/.test(val);

export const createUpdateUsernameSchema = (defaultUsername = "") =>
  z.object({
    username: z
      .string()
      .max(30, "USERNAME_TOO_LONG")
      .refine(noWhitespace, {
        message: "USERNAME_HAS_WHITESPACE",
      })
      .refine((val) => val !== defaultUsername, {
        message: "USERNAME_SAME",
      }),
  });

export const UpdateUsernameSchema = createUpdateUsernameSchema("");

export type UpdateUsernameValues = z.infer<typeof UpdateUsernameSchema>;
