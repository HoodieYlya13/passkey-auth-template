"use server";

import { baseServerAction } from "@/actions/base.server.actions";
import { authApi } from "@/api/auth.api";
import { hashToken } from "@/utils/auth.utils";
import { SERVERLESS } from "@/utils/config/config.client";
import { ORIGIN } from "@/utils/config/config.server";
import { getPreferredLocale } from "@/utils/cookies/cookies.server";
import { ERROR_CODES } from "@/utils/errors";
import { prisma } from "@/utils/config/prisma";
import { getTranslations } from "next-intl/server";

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

        if (!ORIGIN) throw new Error(ERROR_CODES.SYST[1]);

        const magicLink = `${ORIGIN}/auth/magic-link?token=${token}`;

        if (process.env.NODE_ENV === "production") {
          const { Resend } = await import("resend");

          const resendKey = process.env.RESEND_API_KEY;
          const fromEmail = process.env.EMAIL_FROM;

          if (!resendKey || !fromEmail) throw new Error(ERROR_CODES.SYST[1]);

          const locale = await getPreferredLocale();
          const t = await getTranslations({ locale, namespace: "MAGIC_LINK" });

          const resend = new Resend(resendKey);

          const { error } = await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: t("SUBJECT"),
            html: (t.raw("BODY") as string).replace("{link}", magicLink),
          });

          if (error) throw error;

          return true;
        }

        console.log(`Magic Link: ${magicLink}`);

        return true;
      }

      return await authApi.loginMagicLink(email);
    },
    {
      fallback: ERROR_CODES.MAGIC_LINK.FAILED,
    }
  );
}
