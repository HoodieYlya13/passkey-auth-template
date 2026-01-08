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