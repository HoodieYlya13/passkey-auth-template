import { getErrorMessage } from "@/utils/errors";
import { tryCatch } from "@/utils/tryCatch";

export async function baseClientAction<T>(
  actionName: string,
  actions: () => Promise<T>,
  errorHandling: {
    fallback?: string;
    overrides?: Record<string, string>;
    rawError?: boolean;
  } = {}
): Promise<T> {
  const [data, error] = await tryCatch(actions);

  if (error) {
    console.error(actionName + " error:", error);

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
