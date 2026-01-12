export const ERROR_CODES = {
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  CORRECT_FIELDS_BEFORE_SUBMIT: "CORRECT_FIELDS_BEFORE_SUBMIT",
  SYST: { 1: "SYST.001", 2: "SYST.002" },
  JWT: { 1: "JWT.001", 2: "JWT.002" },
  AUTH: { 1: "AUTH.001", 2: "AUTH.002", 3: "AUTH.003", 4: "AUTH.004" },
  PASSKEY: {
    ERROR_LOGIN: "PASSKEY.ERROR_LOGIN",
    ERROR_REGISTER: "PASSKEY.ERROR_REGISTER",
    FAILED: "PASSKEY.FAILED",
    ALREADY_EXISTS: "PASSKEY.ALREADY_EXISTS",
    RENAME_FAILED: "PASSKEY.RENAME_FAILED",
    DELETE_FAILED: "PASSKEY.DELETE_FAILED",
    HAS_WHITESPACE: "PASSKEY.HAS_WHITESPACE",
    TOO_LONG: "PASSKEY.TOO_LONG",
    SAME: "PASSKEY.SAME",
  },
  MAGIC_LINK: { FAILED: "MAGIC_LINK.FAILED" },
  PASSWORD: {
    INCORRECT: "PASSWORD.INCORRECT",
    TOO_SHORT: "PASSWORD.TOO_SHORT",
    TOO_LONG: "PASSWORD.TOO_LONG",
    STARTS_OR_ENDS_WITH_WHITESPACE: "PASSWORD.STARTS_OR_ENDS_WITH_WHITESPACE",
  },
  USERNAME: {
    UPDATE_FAILED: "USERNAME.UPDATE_FAILED",
    HAS_WHITESPACE: "USERNAME.HAS_WHITESPACE",
    TOO_LONG: "USERNAME.TOO_LONG",
    SAME: "USERNAME.SAME",
  },
} as const;

type DeepValue<T> = T extends string ? T : T extends object ? DeepValue<T[keyof T]> : never;
export type ErrorCode = DeepValue<typeof ERROR_CODES>;

function getAllErrorCodes(obj: Record<string, unknown>): string[] {
  return Object.values(obj).flatMap((value) => {
    if (typeof value === "string") return value;
    
    if (typeof value === "object" && value !== null)
      return getAllErrorCodes(value as Record<string, unknown>);
    
    return [];
  });
}

const PUBLIC_ERRORS = new Set<string>(getAllErrorCodes(ERROR_CODES));

export function getErrorMessage(
  error: unknown,
  fallback?: string,
  overrides?: Record<string, string>
) {
  if (error instanceof Error) {
    if (overrides) {
      if (overrides[error.name]) return overrides[error.name];
      else if (overrides[error.message]) return overrides[error.message];
    }

    if (PUBLIC_ERRORS.has(error.message)) return error.message;
  }

  return fallback ?? "";
}

export const noWhitespace = (val: string) => !/\s/.test(val);

type Result<T, E = Error> = [T, null] | [null, E];

export async function tryCatch<T, E = Error>(
  promiseOrFn: Promise<T> | (() => Promise<T>)
): Promise<Result<T, E>> {
  try {
    const data = await (promiseOrFn instanceof Function ? promiseOrFn() : promiseOrFn);
    return [data, null];
  } catch (error) {
    return [null, error as E];
  }
}
