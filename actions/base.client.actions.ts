import { getErrorMessage, tryCatch } from "@/utils/errors.utils";

export async function baseClientAction<T>(
  actionName: string,
  actions: () => Promise<T>,
  errorHandling: {
    fallback?: string;
    overrides?: Record<string, string>;
  } = {}
): Promise<T> {
  const [error, data] = await tryCatch(actions);

  if (error) {
    console.error(`${actionName} error: ${error}`);

    const message = getErrorMessage(
      error,
      errorHandling.fallback,
      errorHandling.overrides
    );

    throw new Error(message);
  }

  return data as T;
}
