"use server";

import { getErrorMessage } from "@/utils/errors";
import { checkRateLimit } from "@/utils/rateLimit";
import { tryCatch } from "@/utils/tryCatch";

export async function baseServerAction<T>(
  actionName: string,
  actions: () => Promise<T>,
  errorHandling: {
    fallback?: string;
    overrides?: Record<string, string>;
    rawError?: boolean;
  } = {}
) {
  const [data, error] = await tryCatch(async () => {
    await checkRateLimit(actionName);
    return await actions();
  });

  if (error) {
    console.error(`${actionName} error:`);

    if (errorHandling.rawError) throw error;

    const message = getErrorMessage(
      error,
      errorHandling.fallback,
      errorHandling.overrides
    );

    throw new Error(message);
  }

  return data as T;
}