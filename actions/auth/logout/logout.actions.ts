"use server";

import {
  deleteUserSessionCookies,
  getUserAccessToken,
} from "@/utils/cookies/cookies.server";
import { SERVERLESS } from "@/utils/config/config.client";
import { baseServerAction } from "@/actions/base.server.actions";
import { authApi } from "@/api/auth.api";
import { tryCatch } from "@/utils/errors.utils";

export async function logoutAction() {
  return baseServerAction(
    "authLogout",
    async () => {
      if (!SERVERLESS) {
        const [error] = await tryCatch(authApi.logout());

        if (error) console.error(error);

        await deleteUserSessionCookies();
      }

      const userAccessToken = await getUserAccessToken();

      if (userAccessToken)
        // TODO: delete the cookie in the backend too

        await deleteUserSessionCookies();
    },
    {},
    false
  );
}

export async function deleteUserSessionAction() {
  return baseServerAction(
    "deleteUserSession",
    async () => {
      const [error] = await tryCatch(deleteUserSessionCookies());

      if (error) console.error("Delete user session error", error);
    },
    {}
  );
}
