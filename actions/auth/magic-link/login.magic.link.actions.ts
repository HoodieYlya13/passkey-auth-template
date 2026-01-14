"use server";

import { baseServerAction } from "@/actions/base.server.actions";
import { authApi } from "@/api/auth.api";
import { hashToken } from "@/utils/auth.utils";
import { SERVERLESS } from "@/utils/config/config.client";
import { ORIGIN } from "@/utils/config/config.server";
import { getPreferredLocale } from "@/utils/cookies/cookies.server";
import { ERROR_CODES } from "@/utils/errors.utils";
import { prisma } from "@/utils/config/prisma";
import { getTranslations } from "next-intl/server";
import { sendMailAction } from "@/actions/mail/mail.actions";

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
      const locale = await getPreferredLocale();
      const t = await getTranslations({
        locale,
        namespace: "EMAILS.MAGIC_LINK",
      });

      const emailBody = (t.raw("BODY") as string).replace("{link}", magicLink);

      await sendMailAction(t("SUBJECT"), emailBody, email, false);

      if (process.env.NODE_ENV !== "production")
        console.log(`🔗 Magic Link: ${magicLink}`);

      return true;
    },
    {
      fallback: ERROR_CODES.MAGIC_LINK.FAILED,
    },
    false
  );
}
