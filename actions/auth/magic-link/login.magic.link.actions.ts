"use server";

import { baseServerAction } from "@/actions/base.server.actions";
import { authApi } from "@/api/auth.api";
import { hashToken } from "@/utils/auth-utils";
import { ORIGIN, SERVERLESS } from "@/utils/config";
import { prisma } from "@/utils/prisma";

export async function loginMagicLinkAction(email: string) {
  return baseServerAction(
    "authLoginMagicLink",
    async () => {
      if (SERVERLESS) {
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user)
          user = await prisma.user.create({
            data: { email },
          });

        const token = crypto.randomUUID();
        const tokenHash = await hashToken(token);
        const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await prisma.user.update({
          where: { id: user.id },
          data: {
            magicLinkToken: tokenHash,
            magicLinkTokenExpiration: expiration,
          },
        });

        if (process.env.NODE_ENV === "development")
          console.log(`Magic Link: ${ORIGIN}/auth/magic-link?token=${token}`);
        else
          console.log(`Magic Link: ${ORIGIN}/auth/magic-link?token=${token}`); // TODO: implement production magic link

        return true;
      }

      return await authApi.loginMagicLink(email);
    },
    {
      fallback: "MAGIC_LINK_FAILED",
    }
  );
}
