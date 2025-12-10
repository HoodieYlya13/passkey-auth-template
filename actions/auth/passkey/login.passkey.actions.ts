"use server";

import {
  getServerCookie,
  getServerCookies,
  setServerCookie,
} from "@/utils/cookies/cookiesServer";
import { baseServerAction } from "@/actions/base.server.actions";
import { authApi } from "@/api/auth.api";
import { ISSUER, ORIGIN, RP_ID, SERVERLESS } from "@/utils/config";
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  AuthenticationResponseJSON,
} from "@simplewebauthn/server";
import { generateSessionToken, verifySessionToken } from "@/utils/auth-utils";
import { prisma } from "@/utils/prisma";

export async function getPasskeyLoginOptionsAction() {
  return baseServerAction(
    "authLoginStartPasskey",
    async () => {
      if (SERVERLESS) {
        const options = await generateAuthenticationOptions({
          rpID: RP_ID,
          userVerification: "preferred",
        });

        const { token, expiresIn } = await generateSessionToken({
          challenge: options.challenge,
          type: "challenge",
        });

        await setServerCookie("passkey_challenge", token, {
          maxAge: expiresIn,
        });

        return options;
      }

      const response = await authApi.loginStartPasskey();

      if (!response.ok) throw new Error("AUTH_002");

      let [name, value] = ["", ""];
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader)
        setCookieHeader.split(/,(?=\s*[^;]+=[^;]+)/g).forEach((cookieStr) => {
          [name, value] = cookieStr.split(";")[0].split("=");
        });

      if (name && value)
        await setServerCookie(name, value, {
          maxAge: 60,
        });

      return await response.json();
    },
    {
      rawError: true,
    }
  );
}

export async function verifyPasskeyLoginAction(
  credential: AuthenticationResponseJSON
) {
  return baseServerAction(
    "authLoginPasskeyFinish",
    async () => {
      if (SERVERLESS) {
        const challengeToken = await getServerCookie("passkey_challenge");
        if (!challengeToken) throw new Error("AUTH_003");

        let payload;
        try {
          payload = await verifySessionToken(challengeToken);
        } catch {
          throw new Error("AUTH_003");
        }

        if (!payload || !payload.challenge || payload.type !== "challenge")
          throw new Error("AUTH_003");

        const expectedChallenge = payload.challenge as string;

        const userHandle = credential.response.userHandle;
        if (!userHandle) throw new Error("AUTH_001");

        const credentialId = credential.id;
        const dbCred = await prisma.webAuthnCredential.findFirst({
          where: { credentialId },
          include: { user: true },
        });

        console.log("dbCred", dbCred);

        if (!dbCred) throw new Error("AUTH_001");

        const user = dbCred.user;

        const verification = await verifyAuthenticationResponse({
          response: credential,
          expectedChallenge: expectedChallenge,
          expectedOrigin: ORIGIN,
          expectedRPID: RP_ID,
          credential: {
            id: dbCred.credentialId,
            publicKey: Buffer.from(dbCred.publicKey, "base64"),
            counter: dbCred.signCount,
          },
        });

        if (verification.verified) {
          const { newCounter } = verification.authenticationInfo;
          await prisma.webAuthnCredential.update({
            where: { id: dbCred.id },
            data: { signCount: Number(newCounter) },
          });

          const { token, expiresIn } = await generateSessionToken({
            sub: user.email,
            issuer: ISSUER,
          });

          await setServerCookie("user_access_token", token, {
            maxAge: expiresIn,
          });

          await setServerCookie("user_id", user.id, {
            maxAge: expiresIn,
          });

          await setServerCookie("user_email", user.email, {
            maxAge: expiresIn,
          });

          if (user.username)
            await setServerCookie("user_name", user.username, {
              maxAge: expiresIn,
            });

          return user.username;
        }

        throw new Error("AUTH_001");
      }
      const cookieHeader = await getServerCookies();

      const user = await authApi.loginPasskeyFinish(credential, cookieHeader);

      // TODO: create a full session cookie with all user info
      await setServerCookie("user_access_token", user.token, {
        maxAge: user.expiresIn,
      });

      await setServerCookie("user_id", user.userId, {
        maxAge: user.expiresIn,
      });

      await setServerCookie("user_email", user.email, {
        maxAge: user.expiresIn,
      });

      await setServerCookie("user_name", user.username, {
        maxAge: user.expiresIn,
      });

      return user.username;
    },
    {
      rawError: true,
    }
  );
}
