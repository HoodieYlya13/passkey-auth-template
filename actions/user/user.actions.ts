"use server";

import { userApi } from "@/api/user.api";
import { setServerCookie } from "@/utils/cookies/cookiesServer";
import { baseServerAction } from "../base.server.actions";

export async function updateUsernameAction(username: string) {
  return baseServerAction(
    "updateUsername",
    async () => {
      const json = await userApi.updateUsername(username);

      return await setServerCookie("user_name", json.username, {
        maxAge: json.expiresIn,
        httpOnly: false,
      });
    },
    {
      fallback: "USERNAME_UPDATE_FAILED",
    }
  );
}

export async function getUserAction() {
  return baseServerAction(
    "getUser",
    async () => {
      return await userApi.getMe();
    },
    {}
  );
}
