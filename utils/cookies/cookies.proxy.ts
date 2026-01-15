import { NextRequest, NextResponse } from "next/server";

export function setProxyCookie(
  response: NextResponse,
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
  response.cookies.set({
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

export function getProxyCookie(
  req: NextRequest,
  name: string
): string | undefined {
  return req.cookies.get(name)?.value;
}

export function deleteProxyCookie(name: string, response: NextResponse) {
  response.cookies.set({
    name,
    value: "",
    path: "/",
    maxAge: 0,
    httpOnly: true,
  });
}

export function deleteUserSessionProxyCookies(response: NextResponse) {
  for (const name of [
    "user_access_token",
    "user_email",
    "user_id",
    "user_name",
  ])
    deleteProxyCookie(name, response);
}
