"use server";

import { baseServerAction } from "@/actions/base.server.actions";
import { SERVERLESS } from "@/utils/config/config.client";
import { APP_PASSWORD } from "@/utils/config/config.server";
import { authApi } from "@/api/auth.api";
import { setServerCookie } from "@/utils/cookies/cookies.server";
import { ERROR_CODES } from "@/utils/errors";

export async function loginTestingModeAction(password: string) {
  return baseServerAction(
    "authTestingMode",
    async () => {
      if (SERVERLESS) {
        const isValid = password === APP_PASSWORD;

        if (!isValid) throw new Error(ERROR_CODES.PASSWORD.INCORRECT);

        return await setServerCookie("isAuthorized", "true", {
          maxAge: 60 * 60 * 24 * 31,
        });
      }

      const response = await authApi.loginTestingMode(password);

      if (!response) throw new Error(ERROR_CODES.PASSWORD.INCORRECT);

      return await setServerCookie("isAuthorized", "true", {
        maxAge: 60 * 60 * 24 * 31,
      });
    },
    {},
    false
  );
}
