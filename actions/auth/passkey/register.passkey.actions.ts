"use server";

import { baseServerAction } from "@/actions/base.server.actions";
import { authApi } from "@/api/auth.api";
import { APP_NAME, SERVERLESS } from "@/utils/config/config.client";
import { ORIGIN, RP_ID } from "@/utils/config/config.server";
import { ERROR_CODES } from "@/utils/errors.utils";
import { prisma } from "@/utils/config/prisma";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  type RegistrationResponseJSON,
} from "@simplewebauthn/server";
import { revalidatePath } from "next/cache";
import { getServerCookie } from "@/utils/cookies/cookies.server";
import { sendPasskeyCreatedMailAction } from "@/actions/mail/mail.actions";

export async function getPasskeyRegistrationOptionsAction(passkeyName: string) {
  return baseServerAction(
    "authRegisterPasskeyStart",
    async () => {
      if (!SERVERLESS) {
        const userEmail = await getServerCookie("user_email");
        if (!userEmail) throw new Error(ERROR_CODES.AUTH[1]);
        
        const response = await authApi.registerPasskeyStart(
          userEmail,
          passkeyName
        );
        return await response.json();
      }

      const userId = await getServerCookie("user_id");
      if (!userId) throw new Error(ERROR_CODES.AUTH[1]);

      if (!RP_ID) throw new Error(ERROR_CODES.SYST[1]);

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { credentials: true },
      });

      if (!user || !user.username) throw new Error(ERROR_CODES.AUTH[1]);

      const options = await generateRegistrationOptions({
        rpName: APP_NAME,
        rpID: RP_ID,
        userID: new TextEncoder().encode(userId),
        userName: user.username,
        excludeCredentials: user.credentials.map((cred) => ({
          id: cred.credentialId,
          transports: ["internal"],
        })),
        authenticatorSelection: {
          residentKey: "preferred",
          userVerification: "preferred",
          authenticatorAttachment: "platform",
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { currentChallenge: options.challenge },
      });

      return options;
    },
    { rawError: true }
  );
}

export async function verifyPasskeyRegistrationAction(
  credential: RegistrationResponseJSON,
  passkeyName: string
) {
  return baseServerAction(
    "authRegisterPasskeyFinish",
    async () => {
      if (!SERVERLESS) {
        const userEmail = await getServerCookie("user_email");
        if (!userEmail) throw new Error(ERROR_CODES.AUTH[1]);
        await authApi.registerPasskeyFinish(credential, userEmail, passkeyName);
        return true;
      }

      const userId = await getServerCookie("user_id");
      if (!userId) throw new Error(ERROR_CODES.AUTH[1]);

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.currentChallenge) throw new Error(ERROR_CODES.AUTH[1]);

      if (!RP_ID || !ORIGIN) throw new Error(ERROR_CODES.SYST[1]);

      const verification = await verifyRegistrationResponse({
        response: credential,
        expectedChallenge: user.currentChallenge,
        expectedOrigin: ORIGIN,
        expectedRPID: RP_ID,
      });

      if (verification.verified && verification.registrationInfo) {
        const { credential: regCred } = verification.registrationInfo;

        await prisma.$transaction([
          prisma.webAuthnCredential.create({
            data: {
              userId,
              credentialId: regCred.id,
              publicKey: Buffer.from(regCred.publicKey).toString("base64"),
              signCount: Number(regCred.counter),
              name: passkeyName,
            },
          }),
          prisma.user.update({
            where: { id: userId },
            data: { currentChallenge: null },
          }),
        ]);

        revalidatePath("/profile");

        return await sendPasskeyCreatedMailAction(passkeyName);
      }

      throw new Error(ERROR_CODES.AUTH[1]);
    },
    { rawError: true },
    true
  );
}
