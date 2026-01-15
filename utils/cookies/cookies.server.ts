import "server-only";
import {
  DEFAULT_LOCALE_UPPERCASE,
  LocaleLanguages,
  LocaleLanguagesUpperCase,
} from "@/i18n/utils";
import { AuthResponse } from "@/models/auth.models";
import { DEFAULT_LOCALE } from "@/utils/config/config.client";
import { cookies } from "next/headers";

export async function setServerCookie(
  name: string,
  value: string,
  options: Partial<{
    maxAge?: number;
    path?: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
  }> = {}
) {
  (await cookies()).set({
    name,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
    ...options,
  });
}

export async function setServerCookieHeader(setCookieHeader: string) {
  const cookies = setCookieHeader.split(/,(?=\s*[^;]+=[^;]+)/g);

  for (const cookieStr of cookies) {
    const parts = cookieStr.split(";").map((p) => p.trim());
    const [nameValue] = parts;
    const [name, value] = nameValue.split("=");

    let maxAge = 300;
    const maxAgePart = parts.find((p) =>
      p.toLowerCase().startsWith("max-age=")
    );
    if (maxAgePart) {
      const parsedMaxAge = parseInt(maxAgePart.split("=")[1], 10);
      if (!isNaN(parsedMaxAge)) maxAge = parsedMaxAge;
    }

    if (name && value) await setServerCookie(name, value, { maxAge });
  }
}

export async function getServerCookie(
  name: string
): Promise<string | undefined> {
  return (await cookies()).get(name)?.value;
}

export async function getServerCookies(): Promise<string> {
  return (await cookies()).toString();
}

export async function deleteServerCookie(name: string) {
  (await cookies()).delete(name);
}

export async function deleteServerCookies(names: string[]) {
  const cookieStore = await cookies();
  for (const name of names) cookieStore.delete(name);
}

export async function deleteUserSessionCookies() {
  const cookieStore = await cookies();
  for (const name of [
    "user_access_token",
    "user_email",
    "user_id",
    "user_name",
  ])
    cookieStore.delete(name);
}

export async function setUserSessionCookies(user: AuthResponse) {
  await setServerCookie("user_access_token", user.token, {
    maxAge: user.expiresIn,
  });

  await setServerCookie("user_id", user.id, {
    maxAge: user.expiresIn,
  });

  await setServerCookie("user_email", user.email, {
    maxAge: user.expiresIn,
  });

  if (user.username) {
    await setServerCookie("user_name", user.username, {
      maxAge: user.expiresIn,
    });
  }
}

export async function getPreferredLocale(toUpperCase = false) {
  const locale = await getServerCookie("preferred_locale");
  return toUpperCase
    ? ((locale?.toUpperCase() ||
        DEFAULT_LOCALE_UPPERCASE) as LocaleLanguagesUpperCase)
    : ((locale || DEFAULT_LOCALE) as LocaleLanguages);
}

export async function getUserAccessToken(): Promise<string | undefined> {
  return await getServerCookie("user_access_token");
}

export async function getUserCountry() {
  const country = await getServerCookie("user_country");

  if (!country || country === "unknown") return undefined;

  return country as LocaleLanguagesUpperCase;
}

export async function getUserIp(): Promise<string | undefined> {
  return await getServerCookie("user_ip");
}
