import { assertEquals } from "@std/assert";
import { backend } from "../server.ts";

Deno.test("GET /hello returns message", async () => {
  const req = new Request("http://localhost/hello");
  const resp = await backend.fetch(req);
  assertEquals(resp.status, 200);
  const body = await resp.json();
  assertEquals(body.message, "Hello from the Contact Us API!");
});
