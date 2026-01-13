"use server";

import { baseServerAction } from "@/actions/base.server.actions";
// import { authApi } from "@/api/auth.api";
import { SERVERLESS } from "@/utils/config/config.client";
import { ERROR_CODES } from "@/utils/errors.utils";
import { prisma } from "@/utils/config/prisma";
import {
  getServerCookie,
  getPreferredLocale,
} from "@/utils/cookies/cookies.server";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

export async function getUserPasskeysAction() {
  return baseServerAction(
    "getUserPasskeysAction",
    async () => {
      const userId = await getServerCookie("user_id");
      if (!userId) throw new Error(ERROR_CODES.AUTH[1]);

      if (SERVERLESS) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            credentials: {
              select: {
                id: true,
                name: true,
                createdAt: true,
              },
              orderBy: { createdAt: "desc" },
            },
          },
        });

        if (!user) throw new Error(ERROR_CODES.AUTH[1]);

        return user.credentials;
      }

      // TODO: Implement external API call if not serverless
      throw new Error("Not implemented for external API");
    },
    {}
  );
}

export async function renamePasskeyAction(
  credentialId: string,
  newName: string
) {
  return baseServerAction(
    "renamePasskeyAction",
    async () => {
      const userId = await getServerCookie("user_id");
      if (!userId) throw new Error(ERROR_CODES.AUTH[1]);

      if (SERVERLESS) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) throw new Error(ERROR_CODES.AUTH[1]);

        const credential = await prisma.webAuthnCredential.findFirst({
          where: {
            id: credentialId,
            userId: user.id,
          },
        });

        if (!credential) throw new Error(ERROR_CODES.SYST[2]);

        await prisma.webAuthnCredential.update({
          where: { id: credentialId },
          data: { name: newName },
        });

        revalidatePath("/profile");

        return true;
      }

      // TODO: Implement external API call if not serverless
      throw new Error("Not implemented for external API");
    },
    {
      fallback: ERROR_CODES.PASSKEY.RENAME_FAILED,
    }
  );
}

export async function deletePasskeyAction(credentialId: string) {
  return baseServerAction(
    "deletePasskeyAction",
    async () => {
      const userId = await getServerCookie("user_id");
      if (!userId) throw new Error(ERROR_CODES.AUTH[1]);

      if (SERVERLESS) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) throw new Error(ERROR_CODES.AUTH[1]);

        const credential = await prisma.webAuthnCredential.findFirst({
          where: {
            id: credentialId,
            userId: user.id,
          },
        });

        if (!credential) throw new Error(ERROR_CODES.SYST[2]);

        await prisma.webAuthnCredential.delete({
          where: { id: credentialId },
        });

        revalidatePath("/profile");

        const locale = await getPreferredLocale();
        const t = await getTranslations({ locale, namespace: "EMAILS" });

        const { sendMailAction } = await import("@/actions/mail/mail.actions");

        await sendMailAction(
          t("PASSKEY_DELETED.SUBJECT", { name: credential.name }),
          t("PASSKEY_DELETED.BODY", { name: credential.name })
        );

        return true;
      }

      // TODO: Implement external API call if not serverless
      throw new Error("Not implemented for external API");
    },
    {
      fallback: ERROR_CODES.PASSKEY.DELETE_FAILED,
    }
  );
}
