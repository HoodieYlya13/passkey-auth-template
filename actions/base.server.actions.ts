"use server";

import { getErrorMessage } from "@/utils/errors";
import { checkRateLimit } from "@/utils/rateLimit";

export async function baseServerAction<T>(
  actionName: string,
  actions: () => Promise<T>,
  errorHandling: {
    fallback?: string;
    overrides?: Record<string, string>;
    rawError?: boolean;
  }
) {
  try {
    await checkRateLimit(actionName);

    return await actions();
  } catch (error) {
    console.error(actionName + " error:");

    if (errorHandling.rawError) throw error;

    const message = getErrorMessage(
      error,
      errorHandling.fallback,
      errorHandling.overrides
    );

    throw new Error(message);
  }
}
