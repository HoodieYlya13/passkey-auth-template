"use server";

import { baseServerAction } from "@/actions/base.server.actions";
import { EMAIL_FROM, RESEND_API_KEY } from "@/utils/config/config.server";
import { getServerCookie } from "@/utils/cookies/cookies.server";
import { ERROR_CODES } from "@/utils/errors.utils";

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
