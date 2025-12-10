"use server";

import { userApi } from "@/api/user.api";
import {
  getServerCookie,
  getUserAccessToken,
  setServerCookie,
} from "@/utils/cookies/cookiesServer";
import { baseServerAction } from "../base.server.actions";
import { JWT_VALIDITY, SERVERLESS } from "@/utils/config";
import { prisma } from "@/utils/prisma";
import { verifySessionToken } from "@/utils/auth-utils";

export async function updateUsernameAction(username: string) {
  return baseServerAction(
    "updateUsername",
    async () => {
      if (SERVERLESS) {
        const token = await getUserAccessToken();
        if (!token) throw new Error("AUTH_001");

        const id = await getServerCookie("user_id");
        if (!id) throw new Error("USER_001");

        await prisma.user.update({
          where: { id },
          data: { username },
        });

        let maxAge = JWT_VALIDITY;

        try {
          const payload = await verifySessionToken(token);
          if (payload.exp) {
            const now = Math.floor(Date.now() / 1000);
            maxAge = payload.exp - now;
          }
        } catch {
          throw new Error("SYST_001");
        }

        return await setServerCookie("user_name", username, {
          maxAge,
          httpOnly: false,
        });
      }

      const json = await userApi.updateUsername(username);

      const token = await getUserAccessToken();
      if (!token) throw new Error("AUTH_001");

      let maxAge = JWT_VALIDITY;

      try {
        const payload = await verifySessionToken(token);
        if (payload.exp) {
          const now = Math.floor(Date.now() / 1000);
          maxAge = payload.exp - now;
        }
      } catch {
        throw new Error("SYST_001");
      }

      return await setServerCookie("user_name", json.username, {
        maxAge,
        httpOnly: false,
      });
    },
    {
      fallback: "USERNAME_UPDATE_FAILED",
    }
  );
}

export async function getCurrentUserAction() {
  return baseServerAction(
    "getCurrentUser",
    async () => {
      if (SERVERLESS) {
        const token = await getUserAccessToken();

        if (!token) throw new Error("AUTH_001");

        let payload;
        try {
          payload = await verifySessionToken(token);
        } catch {
          throw new Error("AUTH_003");
        }

        if (!payload || !payload.sub) throw new Error("AUTH_003");

        const user = await prisma.user.findUnique({
          where: { email: payload.sub },
        });

        if (!user) throw new Error("USER_001");

        return user;
      }

      return await userApi.getMe();
    },
    {}
  );
}
