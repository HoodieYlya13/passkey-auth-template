"use server";

import { baseServerAction } from "@/actions/base.server.actions";
import { authApi } from "@/api/auth.api";

export async function loginMagicLinkAction(email: string) {
  return baseServerAction(
    "authLoginMagicLink",
    async () => {
      return await authApi.loginMagicLink(email);
    },
    {
      fallback: "MAGIC_LINK_FAILED",
    }
  );
}
