import "server-only";
import { getErrorMessage, tryCatch } from "@/utils/errors.utils";
import { checkRateLimit } from "@/utils/config/rateLimit";
import { isAuthenticated } from "@/utils/auth.utils";

export async function baseServerAction<T>(
  actionName: string,
  actions: () => Promise<T>,
  errorHandling: {
    fallback?: string;
    overrides?: Record<string, string>;
  } = {},
  authenticationNeeded = true
) {
  const [error, data] = await tryCatch(async () => {
    await checkRateLimit(actionName);
    await isAuthenticated(authenticationNeeded);
    return await actions();
  });

  if (error) {
    console.error(`${actionName} error:`);

    const message = getErrorMessage(
      error,
      errorHandling.fallback,
      errorHandling.overrides
    );

    throw new Error(message);
  }

  return data as T;
}
