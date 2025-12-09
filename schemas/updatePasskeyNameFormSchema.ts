import { z } from "zod";

export const UpdatePasskeyNameSchema = z.object({
  name: z.string(),
});

export type UpdatePasskeyNameValues = z.infer<typeof UpdatePasskeyNameSchema>;