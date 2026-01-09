"use server";

import { baseServerAction } from "@/actions/base.server.actions";
import { authApi } from "@/api/auth.api";
import { APP_NAME } from "@/utils/config/config.client";
import { SERVERLESS } from "@/utils/config/config.client";
import { ORIGIN, RP_ID } from "@/utils/config/config.server";
import { ERROR_CODES } from "@/utils/errors";
import { prisma } from "@/utils/config/prisma";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  RegistrationResponseJSON,
} from "@simplewebauthn/server";

export async function getPasskeyRegistrationOptionsAction(
  email: string,
  passkeyName: string
) {
  return baseServerAction(
    "authRegisterPasskeyStart",
    async () => {
      if (SERVERLESS) {
        const user = await prisma.user.findUnique({
          where: { email },
          include: { credentials: true },
        });

        if (!user || !user.username) throw new Error(ERROR_CODES.AUTH[1]);

        if (!RP_ID) throw new Error(ERROR_CODES.SYST[1]);

        const options = await generateRegistrationOptions({
          rpName: APP_NAME,
          rpID: RP_ID,
          userID: new TextEncoder().encode(user.id),
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
          where: { id: user.id },
          data: { currentChallenge: options.challenge },
        });

        return options;
      }

      const response = await authApi.registerPasskeyStart(email, passkeyName);

      return await response.json();
    },
    {
      rawError: true,
    }
  );
}

export async function verifyPasskeyRegistrationAction(
  credential: RegistrationResponseJSON,
  email: string,
  passkeyName: string
) {
  return baseServerAction(
    "authRegisterPasskeyFinish",
    async () => {
      if (SERVERLESS) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error(ERROR_CODES.AUTH[1]);

        const expectedRPID = RP_ID;
        if (!expectedRPID || !ORIGIN || !user.currentChallenge)
          throw new Error(ERROR_CODES.SYST[1]);

        const verification = await verifyRegistrationResponse({
          response: credential,
          expectedChallenge: user.currentChallenge,
          expectedOrigin: ORIGIN,
          expectedRPID,
        });

        if (verification.verified && verification.registrationInfo) {
          const { credential } = verification.registrationInfo;
          const { id, publicKey, counter } = credential;

          const credentialId = id;
          const publicKeyStr = Buffer.from(publicKey).toString("base64");

          await prisma.webAuthnCredential.create({
            data: {
              userId: user.id,
              credentialId,
              publicKey: publicKeyStr,
              signCount: Number(counter),
              name: passkeyName,
            },
          });

          await prisma.user.update({
            where: { id: user.id },
            data: { currentChallenge: null },
          });

          return true;
        }
        throw new Error(ERROR_CODES.AUTH[1]);
      }

      await authApi.registerPasskeyFinish(credential, email, passkeyName);

      return true;
    },
    {
      rawError: true,
    }
  );
}
