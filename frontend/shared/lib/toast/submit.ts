export type SubmitToastOptions<T = unknown> = {
  onSuccess?: (result: T) => void;
  onError?: (err: unknown) => void;
};

export async function submitWithToasts<T>(
  action: () => Promise<T>,
  opts: SubmitToastOptions<T> = {}
): Promise<T> {
  try {
    const result = await action();
    opts.onSuccess?.(result);
    return result;
  } catch (err) {
    opts.onError?.(err);
    throw err;
  }
}
