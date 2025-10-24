import { Context } from "hono";

export function ok(c: Context, data: unknown) {
  return c.json({ ok: true, data }, 200);
}

export function created(c: Context, data: unknown) {
  return c.json({ ok: true, data }, 201);
}

export function noContent(c: Context) {
  return c.body(null, 204);
}

export function badRequest(c: Context, message = "Bad Request") {
  return c.json({ ok: false, error: { code: "bad_request", message } }, 400);
}

export function notFound(c: Context, message = "Not Found") {
  return c.json({ ok: false, error: { code: "not_found", message } }, 404);
}

export function internalError(c: Context, message = "Internal Server Error") {
  return c.json({ ok: false, error: { code: "internal_error", message } }, 500);
}

export default {
  ok,
  created,
  noContent,
  badRequest,
  notFound,
  internalError,
};
