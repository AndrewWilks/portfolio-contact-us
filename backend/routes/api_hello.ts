import { Context } from "hono";

export function api_hello(c: Context) {
  return c.json({ message: "Hello from the Contact Us API!" });
}
