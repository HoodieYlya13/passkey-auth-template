"use server";

import {
  deleteServerCookie,
  deleteServerCookies,
  deleteUserSessionCookies,
  getServerCookie,
  getServerCookies,
  setServerCookie,
} from "./cookiesServer";

export async function setClientCookie(
  name: string,
  value: string,
  options: Partial<{
    maxAge: number;
    path: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
  }> = {}
) {
  return setServerCookie(name, value, options);
}

export async function getClientCookie(
  name: string
): Promise<string | undefined> {
  return getServerCookie(name);
}

export async function getClientCookies(): Promise<string> {
  return getServerCookies();
}

export async function deleteClientCookie(name: string) {
  return deleteServerCookie(name);
}

export async function deleteClientCookies(names: string[]) {
  return deleteServerCookies(names);
}

export async function deleteClientUserCookies() {
  return deleteUserSessionCookies();
}
