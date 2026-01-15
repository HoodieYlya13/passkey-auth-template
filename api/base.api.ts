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

export class ApiError extends Error {
  status: number;
  data: unknown;
  code?: string;
  timestamp?: string;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;

    if (data && typeof data === "object" && "code" in data)
      this.code = (data as APIErrorResponse).code;
    if (data && typeof data === "object" && "timestamp" in data)
      this.timestamp = (data as APIErrorResponse).timestamp;
  }
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

    const message =
      errorData && typeof errorData === "object" && "code" in errorData
        ? (errorData as APIErrorResponse).code
        : response.statusText || "";

    throw new ApiError(response.status, message, errorData);
  }

  if (response.status === 204) return {} as T;

  const setCookieHeader = response.headers.get("set-cookie");
  if (setCookieHeader) await setServerCookieHeader(setCookieHeader);

  const text = await response.text();

  const data = text && text.trim().length > 0 ? JSON.parse(text) : {};

  return data;
}
