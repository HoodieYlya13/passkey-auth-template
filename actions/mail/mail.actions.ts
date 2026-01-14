"use server";

import { baseServerAction } from "@/actions/base.server.actions";
import { EMAIL_FROM, RESEND_API_KEY } from "@/utils/config/config.server";
import { getServerCookie } from "@/utils/cookies/cookies.server";
import { ERROR_CODES, tryCatch } from "@/utils/errors.utils";
import { getPreferredLocale } from "@/utils/cookies/cookies.server";
import { getTranslations } from "next-intl/server";

async function getTranslationsContext(namespace: string) {
  const locale = await getPreferredLocale();
  const t = await getTranslations({
    locale,
    namespace: "EMAILS." + namespace,
  });

  return t;
}

export async function sendMailAction(
  subject: string,
  html: string,
  to?: string,
  authenticated = true
) {
  return baseServerAction(
    "sendMail",
    async () => {
      const email = to || (await getServerCookie("user_email"));

      if (!email) throw new Error(ERROR_CODES.SYST[1]);

      if (process.env.NODE_ENV !== "production") {
        console.log(`
          📧 [Email Dev Mode]
          To: ${email}
          Subject: ${subject}
          HTML Preview: ${html.substring(0, 50)}...
        `);
        return true;
      }

      const { Resend } = await import("resend");

      if (!RESEND_API_KEY || !EMAIL_FROM) throw new Error(ERROR_CODES.SYST[1]);

      const resend = new Resend(RESEND_API_KEY);

      const { error } = await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject,
        html,
      });

      if (error) throw error;

      return true;
    },
    {},
    authenticated
  );
}

export async function sendMagicLinkMailAction(
  email: string,
  magicLink: string
) {
  const t = await getTranslationsContext("MAGIC_LINK");

  const emailBody = (t.raw("BODY") as string).replace("{link}", magicLink);

  await sendMailAction(t("SUBJECT"), emailBody, email, false);

  if (process.env.NODE_ENV !== "production")
    console.log(`🔗 Magic Link: ${magicLink}`);

  return true;
}

export async function sendPasskeyDeletedMailAction(passkeyName: string) {
  const t = await getTranslationsContext("PASSKEY_DELETED");

  const [error] = await tryCatch(
    sendMailAction(
      t("SUBJECT", { passkeyName }),
      (t.raw("BODY") as string).replace("{passkeyName}", passkeyName)
    )
  );

  if (error) console.log(error);

  return true;
}

export async function sendPasskeyCreatedMailAction(passkeyName: string) {
  const t = await getTranslationsContext("PASSKEY_CREATED");

  const [error] = await tryCatch(
    sendMailAction(
      t("SUBJECT", { passkeyName }),
      (t.raw("BODY") as string).replace("{passkeyName}", passkeyName)
    )
  );

  if (error) console.log(error);

  return true;
}
