"use server";

import { baseServerAction } from "@/actions/base.server.actions";
import { authApi } from "@/api/auth.api";
import { hashToken } from "@/utils/auth.utils";
import { SERVERLESS } from "@/utils/config/config.client";
import { ORIGIN } from "@/utils/config/config.server";
import { ERROR_CODES } from "@/utils/errors.utils";
import { prisma } from "@/utils/config/prisma";
import { sendMagicLinkMailAction } from "@/actions/mail/mail.actions";

export async function loginMagicLinkAction(email: string) {
  return baseServerAction(
    "authLoginMagicLink",
    async () => {
      if (!SERVERLESS) return await authApi.loginMagicLink(email);

      if (!ORIGIN) throw new Error(ERROR_CODES.SYST[1]);

      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email },
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

      const magicLink = `${ORIGIN}/auth/magic-link?token=${token}`;

      return await sendMagicLinkMailAction(email, magicLink);
    },
    {
      fallback: ERROR_CODES.MAGIC_LINK.FAILED,
    },
    false
  );
}
