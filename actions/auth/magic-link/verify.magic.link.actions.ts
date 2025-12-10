"use server";

import { baseServerAction } from "@/actions/base.server.actions";
import { authApi } from "@/api/auth.api";
import { generateSessionToken, hashToken } from "@/utils/auth-utils";
import { ISSUER, SERVERLESS } from "@/utils/config";
import { setServerCookie } from "@/utils/cookies/cookiesServer";
import { prisma } from "@/utils/prisma";

export async function verifyMagicLinkAction(magicLinkToken: string) {
  return baseServerAction(
    "authVerifyMagicLink",
    async () => {
      if (SERVERLESS) {
        const tokenHash = await hashToken(magicLinkToken);
        const user = await prisma.user.findFirst({
          where: {
            magicLinkToken: tokenHash,
            magicLinkTokenExpiration: { gt: new Date() },
          },
        });

        if (!user) throw new Error("AUTH_001");

        await prisma.user.update({
          where: { id: user.id },
          data: {
            magicLinkToken: null,
            magicLinkTokenExpiration: null,
          },
        });

        const { token, expiresIn } = await generateSessionToken({
          sub: user.email,
          issuer: ISSUER,
        });

        await setServerCookie("user_access_token", token, {
          maxAge: expiresIn,
        });

        await setServerCookie("user_id", user.id, {
          maxAge: expiresIn,
        });

        await setServerCookie("user_email", user.email, {
          maxAge: expiresIn,
        });

        if (user.username)
          await setServerCookie("user_name", user.username, {
            maxAge: expiresIn,
          });

        return user.username;
      }

      const user = await authApi.verifyMagicLink(magicLinkToken);
      await setServerCookie("user_access_token", user.token, {
        maxAge: user.expiresIn,
      });

      await setServerCookie("user_id", user.userId, {
        maxAge: user.expiresIn,
      });

      await setServerCookie("user_email", user.email, {
        maxAge: user.expiresIn,
      });

      if (user.username) {
        await setServerCookie("user_name", user.username, {
          maxAge: user.expiresIn,
        });
      }

      return user.username;
    },
    {}
  );
}
