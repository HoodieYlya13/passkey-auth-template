"use client";

export function setClientCookie(
  name: string,
  value: string,
  options: Partial<{
    maxAge: number;
    path: string;
    domain: string;
    secure: boolean;
    sameSite: "Lax" | "Strict" | "None";
  }> = {}
) {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  if (options.maxAge) cookieString += `; max-age=${options.maxAge}`;
  cookieString += `; path=${options.path || "/"}`;
  if (options.domain) cookieString += `; domain=${options.domain}`;
  if (options.secure || options.sameSite === "None") cookieString += "; secure";
  if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`;
  
  document.cookie = cookieString;
}

export function getClientCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const rawValue = parts.pop()?.split(";").shift();
    
    if (rawValue)
      try {
        return decodeURIComponent(rawValue);
      } catch (e) {
        console.error('Cookie decoding failed', e);
        return rawValue;
      }
  }

  return undefined;
}

export function deleteClientCookie(name: string) {
  document.cookie = `${encodeURIComponent(
    name
  )}=; max-age=-1; path=/; samesite=lax`;
}
