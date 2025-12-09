import { fetchApi } from "./base.api";
import { AuthResponse } from "@/models/auth.models";

export const authApi = {
  loginMagicLink: (email: string) =>
    fetchApi<{ success: boolean }>("/auth/magic-link/request?email=" + email, {
      method: "POST",
    }),
  verifyMagicLink: (token: string) =>
    fetchApi<AuthResponse>("/auth/magic-link/verify?token=" + token, {
      method: "POST",
    }),

  loginStartPasskey: () =>
    fetchApi<Response>(
      "/auth/passkey/login/start",
      {
        method: "POST",
      },
      true
    ),

  loginPasskeyFinish: (credential: unknown, cookieHeader: string) =>
    fetchApi<AuthResponse>("/auth/passkey/login/finish", {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
      body: JSON.stringify(credential),
    }),

  registerPasskeyStart: (email: string, passkeyName: string) =>
    fetchApi<Response>(
      `/auth/passkey/register/start?email=${encodeURIComponent(
        email
      )}&name=${encodeURIComponent(passkeyName)}`,
      {
        method: "POST",
        userAuthenticated: true,
      },
      true
    ),

  registerPasskeyFinish: (
    credential: unknown,
    email: string,
    passkeyName: string
  ) =>
    fetchApi<Response>(
      `/auth/passkey/register/finish?email=${encodeURIComponent(
        email
      )}&name=${encodeURIComponent(passkeyName)}`,
      {
        method: "POST",
        body: JSON.stringify(credential),
      },
      true
    ),

  loginTestingMode: (password: string) =>
    fetchApi<{ success: boolean }>("/auth/testing-mode", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: password,
    }),
};
