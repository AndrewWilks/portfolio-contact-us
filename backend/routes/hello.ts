import { Context } from "hono";

export function hello(c: Context) {
  return c.json({ message: "Hello from the Contact Us API!" });
}
