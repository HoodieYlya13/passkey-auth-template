"use server";

import { baseServerAction } from "@/actions/base.server.actions";
import { authApi } from "@/api/auth.api";
import { generateSessionToken, hashToken } from "@/utils/auth-utils";
import { SERVERLESS } from "@/utils/config";
import { setUserSessionCookies } from "@/utils/cookies/cookiesServer";
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
          select: {
            id: true,
            username: true,
            email: true,
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

        const issuer = process.env.ISSUER;
        if (!issuer) throw new Error("SYST_001");

        const { token, expiresIn } = await generateSessionToken({
          sub: user.email,
          issuer,
        });

        await setUserSessionCookies({
          ...user,
          token,
          expiresIn,
        });

        return user.username;
      }

      const user = await authApi.verifyMagicLink(magicLinkToken);

      await setUserSessionCookies(user);

      return user.username;
    },
    {}
  );
}
