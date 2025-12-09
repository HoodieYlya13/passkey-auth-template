"use server";

import {
  getServerCookies,
  setServerCookie,
} from "@/utils/cookies/cookiesServer";
import { baseServerAction } from "@/actions/base.server.actions";
import { authApi } from "@/api/auth.api";

export async function getPasskeyLoginOptionsAction() {
  return baseServerAction(
    "authLoginStartPasskey",
    async () => {
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

export async function verifyPasskeyLoginAction(credential: unknown) {
  return baseServerAction(
    "authLoginPasskeyFinish",
    async () => {
      const cookieHeader = await getServerCookies();

      const response = await authApi.loginPasskeyFinish(
        credential,
        cookieHeader
      );

      await setServerCookie("user_access_token", response.token, {
        maxAge: response.expiresIn,
      });

      await setServerCookie("user_id", response.userId, {
        maxAge: response.expiresIn,
      });

      await setServerCookie("user_email", response.email, {
        maxAge: response.expiresIn,
      });

      await setServerCookie("user_name", response.username, {
        maxAge: response.expiresIn,
      });

      return response.username;
    },
    {
      rawError: true,
    }
  );
}
