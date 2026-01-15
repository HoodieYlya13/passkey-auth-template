import { z } from "zod";

export const LoginMagicLinkSchema = z.object({
  email: z.email(),
});

export type LoginMagicLinkValues = z.infer<typeof LoginMagicLinkSchema>;
