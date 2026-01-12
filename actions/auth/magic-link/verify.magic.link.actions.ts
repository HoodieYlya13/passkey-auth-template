"use server";

import { baseServerAction } from "@/actions/base.server.actions";
import { authApi } from "@/api/auth.api";
import { generateSessionToken, hashToken } from "@/utils/auth.utils";
import { SERVERLESS } from "@/utils/config/config.client";
import { ISSUER } from "@/utils/config/config.server";
import { setUserSessionCookies } from "@/utils/cookies/cookies.server";
import { ERROR_CODES } from "@/utils/errors.utils";
import { prisma } from "@/utils/config/prisma";

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

        if (!user) throw new Error(ERROR_CODES.AUTH[1]);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            magicLinkToken: null,
            magicLinkTokenExpiration: null,
          },
        });

        if (!ISSUER) throw new Error(ERROR_CODES.SYST[1]);

        const { token, expiresIn } = await generateSessionToken({
          sub: user.email,
          issuer: ISSUER,
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
    {},
    false
  );
}
