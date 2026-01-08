"use server";

import {
  deleteUserSessionCookies,
  getUserAccessToken,
} from "@/utils/cookies/cookiesServer";
import { SERVERLESS } from "@/utils/config";
import { baseServerAction } from "@/actions/base.server.actions";

export async function logoutAction() {
  return baseServerAction(
      "authLogout",
      async () => {
        if (SERVERLESS) {
          const userAccessToken = await getUserAccessToken();

          if (userAccessToken) // TODO: delete the cookie in the backend too

          await deleteUserSessionCookies();
        }

        const userAccessToken = await getUserAccessToken();

        if (userAccessToken) // TODO: delete the cookie in the backend too

        await deleteUserSessionCookies();
      },
      {}
    );
}
