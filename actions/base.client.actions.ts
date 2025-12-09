import { getErrorMessage } from "@/api/api.errors";

export async function baseClientAction<T>(
  actionName: string,
  actions: () => Promise<T>,
  errorHandling: {
    fallback?: string;
    overrides?: Record<string, string>;
    rawError?: boolean;
  } = {}
) {
  try {
    return await actions();
  } catch (error) {
    console.error(actionName + " error:", error);

    if (errorHandling.rawError) throw error;

    const message = getErrorMessage(
      error,
      errorHandling.fallback,
      errorHandling.overrides
    );

    throw new Error(message);
  }
}
