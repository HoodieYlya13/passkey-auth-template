export function getErrorMessage(
  error: unknown,
  fallback?: string,
  overrides?: Record<string, string>
) {
  let message = fallback ?? "";

  if (error instanceof Error) {
    if (overrides) {
      if (overrides[error.name]) message = overrides[error.name];
      else if (overrides[error.message]) message = overrides[error.message];
    }

    if (message === (fallback ?? "")) { // FIXME: remove this
      switch (true) {
        case error.message.startsWith("AUTH_00"):
        case error.message.startsWith("SYST_00"):
        case error.message === "TOO_MANY_REQUESTS":
        case error.message === "PASSWORD_INCORRECT":
          message = error.message;
          break;
      }
    }
  }

  return message;
}
