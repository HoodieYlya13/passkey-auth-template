"use server";

import { baseServerAction } from "@/actions/base.server.actions";
import { authApi } from "@/api/auth.api";
import { setServerCookie } from "@/utils/cookies/cookiesServer";

export async function verifyMagicLinkAction(token: string) {
  return baseServerAction(
    "authVerifyMagicLink",
    async () => {
      const result = await authApi.verifyMagicLink(token);
      await setServerCookie("user_access_token", result.token, {
        maxAge: result.expiresIn,
      });

      await setServerCookie("user_id", result.userId, {
        maxAge: result.expiresIn,
      });

      await setServerCookie("user_email", result.email, {
        maxAge: result.expiresIn,
      });

      if (result.username) {
        await setServerCookie("user_name", result.username, {
          maxAge: result.expiresIn,
        });
      }

      return result.username;
    },
    {}
  );
}
