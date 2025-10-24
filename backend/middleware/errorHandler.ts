import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";
import { badRequest, notFound, internalError } from "../utils/errors.ts";
import { HTTPResponseError } from "hono/types";

/**
 * onError handler for Hono. Uses the error envelope helpers from `backend/utils/errors.ts`.
 * - For HTTPException we map common status codes to existing helpers (400 -> badRequest, 404 -> notFound)
 * - For other errors return a 500 internal error envelope.
 */
export function onErrorHandler(err: Error | HTTPResponseError, c: Context) {
  console.error("Error occurred:", err);

  if (err instanceof HTTPException) {
    const httpErr = err as unknown as { status?: number; message?: string };
    const status = httpErr.status ?? 400;
    const message = httpErr.message ?? "Bad Request";

    if (status === 400) return badRequest(c, message);
    if (status === 404) return notFound(c, message);

    // Fallback: use the internal error envelope but keep the original status
    // Use explicit Response to avoid Hono typing mismatch for c.json with numeric status.
    const payload = JSON.stringify({
      ok: false,
      error: { code: "http_error", message },
    });
    return new Response(payload, {
      status,
      headers: { "content-type": "application/json" },
    });
  }

  return internalError(c, (err as Error)?.message ?? String(err));
}

export default onErrorHandler;
