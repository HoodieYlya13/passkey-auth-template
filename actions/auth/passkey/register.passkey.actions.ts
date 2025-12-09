"use server";

import { baseServerAction } from "@/actions/base.server.actions";
import { authApi } from "@/api/auth.api";

export async function getPasskeyRegistrationOptionsAction(
  email: string,
  passkeyName: string
) {
  return baseServerAction(
    "authRegisterPasskeyStart",
    async () => {
      const response = await authApi.registerPasskeyStart(email, passkeyName);

      return await response.json();
    },
    {
      rawError: true,
    }
  );
}

export async function verifyPasskeyRegistrationAction(
  credential: unknown,
  email: string,
  passkeyName: string
) {
  return baseServerAction(
    "authRegisterPasskeyFinish",
    async () => {
      await authApi.registerPasskeyFinish(credential, email, passkeyName);

      return true;
    },
    {
      rawError: true,
    }
  );
}
