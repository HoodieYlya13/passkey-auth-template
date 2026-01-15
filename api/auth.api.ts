import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/browser";
import { fetchApi } from "./base.api";
import { AuthResponse } from "@/models/auth.models";
import { Passkey } from "@/models/passkey.models";

export const authApi = {
  logout: () => fetchApi<void>("/auth/logout", { method: "POST" }),

  loginMagicLink: (email: string) =>
    fetchApi<{ success: boolean }>("/auth/magic-link/request", {
      method: "POST",
      body: JSON.stringify({ email }),
      userAuthenticated: false,
    }),

  verifyMagicLink: (token: string) =>
    fetchApi<AuthResponse>("/auth/magic-link/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
      userAuthenticated: false,
    }),

  loginStartPasskey: () =>
    fetchApi<PublicKeyCredentialRequestOptionsJSON>(
      "/auth/passkey/login/start",
      {
        method: "POST",
        userAuthenticated: false,
      }
    ),

  loginPasskeyFinish: (
    credential: AuthenticationResponseJSON,
    cookieHeader: string
  ) =>
    fetchApi<AuthResponse>("/auth/passkey/login/finish", {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
      body: JSON.stringify(credential),
      userAuthenticated: false,
    }),

  registerPasskeyStart: (email: string, passkeyName: string) =>
    fetchApi<PublicKeyCredentialCreationOptionsJSON>(
      "/auth/passkey/register/start",
      {
        method: "POST",
        body: JSON.stringify({ email, passkeyName }),
      }
    ),

  registerPasskeyFinish: (
    credential: RegistrationResponseJSON,
    email: string,
    passkeyName: string
  ) =>
    fetchApi<void>("/auth/passkey/register/finish", {
      method: "POST",
      body: JSON.stringify({
        ...credential,
        email,
        passkeyName,
      }),
      userAuthenticated: false,
    }),

  loginTestingMode: (password: string) =>
    fetchApi<{ success: boolean }>("/auth/testing-mode", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: password,
      userAuthenticated: false,
    }),

  getUserPasskeys: (userId: string) =>
    fetchApi<Passkey[]>(`/auth/passkeys/${userId}`, {
      method: "GET",
    }),

  renamePasskey: (userId: string, passkeyId: string, passkeyName: string) =>
    fetchApi<void>(`/auth/passkeys/${userId}/${passkeyId}`, {
      method: "PUT",
      body: JSON.stringify({ passkeyName }),
    }),

  deletePasskey: (userId: string, passkeyId: string) =>
    fetchApi<void>(`/auth/passkeys/${userId}/${passkeyId}`, {
      method: "DELETE",
    }),
};
