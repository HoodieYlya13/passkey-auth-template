"use server";

import { userApi } from "@/api/user.api";
import {
  getServerCookie,
  getUserAccessToken,
  setServerCookie,
} from "@/utils/cookies/cookiesServer";
import { baseServerAction } from "../base.server.actions";
import { SERVERLESS } from "@/utils/config";
import { prisma } from "@/utils/prisma";
import { verifySessionToken } from "@/utils/auth-utils";
import { tryCatch } from "@/utils/tryCatch";
import { ERROR_CODES } from "@/utils/errors";

export async function updateUsernameAction(username: string) {
  return baseServerAction(
    "updateUsername",
    async () => {
      if (SERVERLESS) {
        const token = await getUserAccessToken();
        if (!token) throw new Error(ERROR_CODES.AUTH[4]);

        const id = await getServerCookie("user_id");
        if (!id) throw new Error(ERROR_CODES.AUTH[1]);

        await prisma.user.update({
          where: { id },
          data: { username },
        });

        const [payload, error] = await tryCatch(verifySessionToken(token));

        if (error || !payload || !payload.exp) throw new Error(ERROR_CODES.AUTH[1]);

        const now = Math.floor(Date.now() / 1000);
        const maxAge = payload.exp - now;

        return await setServerCookie("user_name", username, {
          maxAge,
          httpOnly: false,
        });
      }

      const json = await userApi.updateUsername(username);

      const token = await getUserAccessToken();
      if (!token) throw new Error(ERROR_CODES.AUTH[4]);

      const [payload, error] = await tryCatch(verifySessionToken(token));

      if (error || !payload || !payload.exp) throw new Error(ERROR_CODES.AUTH[1]);

      const now = Math.floor(Date.now() / 1000);
      const maxAge = payload.exp - now;

      return await setServerCookie("user_name", json.username, {
        maxAge,
        httpOnly: false,
      });
    },
    {
      fallback: ERROR_CODES.USERNAME.UPDATE_FAILED,
    }
  );
}

export async function getCurrentUserAction() {
  return baseServerAction(
    "getCurrentUser",
    async () => {
      if (SERVERLESS) {
        const token = await getUserAccessToken();

        if (!token) throw new Error(ERROR_CODES.AUTH[4]);

        const [payload, error] = await tryCatch(verifySessionToken(token));

        if (error) throw new Error(ERROR_CODES.SYST[1]);

        if (!payload || !payload.sub) throw new Error(ERROR_CODES.AUTH[3]);

        const user = await prisma.user.findUnique({
          where: { email: payload.sub },
        });

        if (!user) throw new Error(ERROR_CODES.AUTH[1]);

        return user;
      }

      return await userApi.getMe();
    },
    {}
  );
}
