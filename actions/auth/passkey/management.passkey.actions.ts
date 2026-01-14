"use server";

import { baseServerAction } from "@/actions/base.server.actions";
// import { authApi } from "@/api/auth.api";
import { SERVERLESS } from "@/utils/config/config.client";
import { ERROR_CODES } from "@/utils/errors.utils";
import { prisma } from "@/utils/config/prisma";
import { getServerCookie } from "@/utils/cookies/cookies.server";
import { revalidatePath } from "next/cache";
import { sendPasskeyDeletedMailAction } from "@/actions/mail/mail.actions";

export async function getUserPasskeysAction() {
  return baseServerAction(
    "getUserPasskeysAction",
    async () => {
      const userId = await getServerCookie("user_id");
      if (!userId) throw new Error(ERROR_CODES.AUTH[1]);

      if (!SERVERLESS) throw new Error("Not implemented for external API"); // TODO: Implement external API call if not serverless

      return await prisma.webAuthnCredential.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
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

      if (!SERVERLESS) throw new Error("Not implemented for external API"); // TODO: Implement external API call if not serverless

      const count = await prisma.webAuthnCredential.count({
        where: { id: credentialId, userId },
      });

      if (count === 0) throw new Error(ERROR_CODES.SYST[2]);

      await prisma.webAuthnCredential.update({
        where: { id: credentialId },
        data: { name: newName },
      });

      revalidatePath("/profile");
      return true;
    },
    { fallback: ERROR_CODES.PASSKEY.RENAME_FAILED }
  );
}

export async function deletePasskeyAction(credentialId: string) {
  return baseServerAction(
    "deletePasskeyAction",
    async () => {
      const userId = await getServerCookie("user_id");
      if (!userId) throw new Error(ERROR_CODES.AUTH[1]);

      if (!SERVERLESS) throw new Error("Not implemented for external API"); // TODO: Implement external API call if not serverless

      const credential = await prisma.webAuthnCredential.findFirst({
        where: { id: credentialId, userId },
      });

      if (!credential) throw new Error(ERROR_CODES.SYST[2]);

      await prisma.webAuthnCredential.delete({
        where: { id: credentialId },
      });

      revalidatePath("/profile");

      return await sendPasskeyDeletedMailAction(credential.name);
    },
    { fallback: ERROR_CODES.PASSKEY.DELETE_FAILED }
  );
}
