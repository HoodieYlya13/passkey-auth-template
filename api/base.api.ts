import { ORIGIN } from "@/utils/config/config.server";
import {
  getUserAccessToken,
  setServerCookieHeader,
} from "@/utils/cookies/cookies.server";
import { ERROR_CODES, tryCatch } from "@/utils/errors.utils";

type FetchOptions = RequestInit & {
  userAuthenticated?: boolean;
};

export interface APIErrorResponse {
  code: string;
  description: string;
  timestamp: string;
}

export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { userAuthenticated = true, headers, ...rest } = options;

  let token = null;
  if (userAuthenticated) {
    token = await getUserAccessToken();
    if (!token) throw new Error(ERROR_CODES.AUTH[4]);
  }

  if (!ORIGIN) throw new Error(ERROR_CODES.SYST[1]);

  const url = `${ORIGIN}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) defaultHeaders["Authorization"] = `Bearer ${token}`;

  const [fetchError, response] = await tryCatch(
    fetch(url, {
      headers: { ...defaultHeaders, ...headers },
      ...rest,
    })
  );

  if (fetchError) throw fetchError;

  if (!response.ok) {
    const [, errorData] = await tryCatch(response.json());

    let message =
      errorData && typeof errorData === "object" && "code" in errorData
        ? (errorData as APIErrorResponse).code
        : "";

    if (message) {
      const match = message.match(/^([A-Z]+)_0*(\d+)$/);
      if (match) {
        const type = match[1] as keyof typeof ERROR_CODES;
        const index = parseInt(match[2], 10);

        if (type in ERROR_CODES) {
          const category = ERROR_CODES[type];
          if (
            typeof category === "object" &&
            category !== null &&
            index in category
          )
            message = (category as Record<number, string>)[index];
        }
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) return {} as T;

  const setCookieHeader = response.headers.get("set-cookie");
  if (setCookieHeader) await setServerCookieHeader(setCookieHeader);

  const text = await response.text();

  const data = text && text.trim().length > 0 ? JSON.parse(text) : {};

  return data;
}
