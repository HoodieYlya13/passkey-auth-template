"use server";

import { baseServerAction } from "@/actions/base.server.actions";
import { authApi } from "@/api/auth.api";
import { APP_NAME, ORIGIN, RP_ID, SERVERLESS } from "@/utils/config";
import { prisma } from "@/utils/prisma";
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

        if (!user) throw new Error("USER_001");

        const options = await generateRegistrationOptions({
          rpName: APP_NAME,
          rpID: RP_ID,
          userID: new TextEncoder().encode(user.id),
          userName: user.email,
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
        if (!user || !user.currentChallenge) throw new Error("AUTH_001");

        const verification = await verifyRegistrationResponse({
          response: credential,
          expectedChallenge: user.currentChallenge,
          expectedOrigin: ORIGIN,
          expectedRPID: RP_ID,
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
        throw new Error("AUTH_001");
      }
      await authApi.registerPasskeyFinish(credential, email, passkeyName);

      return true;
    },
    {
      rawError: true,
    }
  );
}
