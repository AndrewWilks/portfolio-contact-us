export type AppError = Error & {
  status?: number;
  code?: string;
};

const API_BASE = "/api";

function toAppError(
  err: unknown,
  fallbackMessage = "Request failed",
): AppError {
  if (err instanceof Error) return err as AppError;
  const e = new Error(fallbackMessage) as AppError;
  return e;
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text; // non-JSON response body
  }
}

type ErrorLike = { message?: unknown; error?: unknown; code?: unknown };

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const raw = await parseJsonSafe(res);
    let message = `Request failed with ${res.status}`;
    let code: string | undefined;
    if (typeof raw === "object" && raw !== null) {
      const obj = raw as ErrorLike;
      if (typeof obj.message === "string") message = obj.message;
      else if (typeof obj.error === "string") message = obj.error;
      if (typeof obj.code === "string") code = obj.code;
    } else if (typeof raw === "string" && raw.trim().length) {
      message = raw;
    }
    const err = new Error(message) as AppError;
    err.status = res.status;
    if (code) err.code = code;
    throw err;
  }
  const raw = await parseJsonSafe(res);
  return raw as T;
}

type FetchOpts = Omit<RequestInit, "body"> & {
  headers?: Record<string, string>;
};

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  opts: FetchOpts = {},
): Promise<T> {
  const url = path.startsWith("/")
    ? `${API_BASE}${path}`
    : `${API_BASE}/${path}`;
  const headers: Record<string, string> = Object.assign(
    { "Content-Type": "application/json" },
    opts.headers ?? {},
  );
  try {
    const res = await fetch(url, {
      method,
      ...opts,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return await handle<T>(res);
  } catch (err) {
    throw toAppError(err);
  }
}

export const api = {
  get: <T>(path: string, opts?: FetchOpts) =>
    request<T>("GET", path, undefined, opts),
  post: <TRes, TBody = unknown>(path: string, body?: TBody, opts?: FetchOpts) =>
    request<TRes>("POST", path, body, opts),
  put: <TRes, TBody = unknown>(path: string, body?: TBody, opts?: FetchOpts) =>
    request<TRes>("PUT", path, body, opts),
  patch: <TRes, TBody = unknown>(
    path: string,
    body?: TBody,
    opts?: FetchOpts,
  ) => request<TRes>("PATCH", path, body, opts),
  del: <T>(path: string, opts?: FetchOpts) =>
    request<T>("DELETE", path, undefined, opts),
};
