import { AuthenticationResponseJSON, RegistrationResponseJSON } from "@simplewebauthn/browser";
import { fetchApi } from "./base.api";
import { AuthResponse } from "@/models/auth.models";

export const authApi = {
  loginMagicLink: (email: string) =>
    fetchApi<{ success: boolean }>("/auth/magic-link/request?email=" + email, {
      method: "POST",
      userAuthenticated: false,
    }),
  verifyMagicLink: (token: string) =>
    fetchApi<AuthResponse>("/auth/magic-link/verify?token=" + token, {
      method: "POST",
      userAuthenticated: false,
    }),

  loginStartPasskey: () =>
    fetchApi<Response>(
      "/auth/passkey/login/start",
      {
        method: "POST",
        userAuthenticated: false,
      },
      true
    ),

  loginPasskeyFinish: (credential: AuthenticationResponseJSON, cookieHeader: string) =>
    fetchApi<AuthResponse>("/auth/passkey/login/finish", {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
      body: JSON.stringify(credential),
      userAuthenticated: false,
    }),

  registerPasskeyStart: (email: string, passkeyName: string) =>
    fetchApi<Response>(
      `/auth/passkey/register/start?email=${encodeURIComponent(
        email
      )}&name=${encodeURIComponent(passkeyName)}`,
      {
        method: "POST",
      },
      true
    ),

  registerPasskeyFinish: (
    credential: RegistrationResponseJSON,
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
        userAuthenticated: false,
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
      userAuthenticated: false,
    }),
};
