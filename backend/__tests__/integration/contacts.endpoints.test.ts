// Ensure env is set before importing modules that read config at module-evaluation time
Deno.env.set("DB_FILE_NAME", "sqlite:./tmp/test.sqlite");

import { assertEquals, assertExists } from "@std/assert";
import { backend } from "../../server.ts";
import { clearContacts } from "../../db/utilities/clear.ts";
import { createContact } from "@backend/repos";

Deno.test.beforeEach(async () => {
  await clearContacts();
});

Deno.test("POST /api/contacts creates a contact and returns 201", async () => {
  const payload = {
    firstName: "Test",
    lastName: "User",
    email: "test.user@example.com",
    phone: "123456",
    message: "Hello",
  };

  const req = new Request("http://localhost/api/contacts", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const res = await backend.fetch(req);
  assertEquals(res.status, 201);
  const body = await res.json();
  assertEquals(body.ok, true);
  assertExists(body.data.id);
  assertEquals(body.data.firstName, payload.firstName);
  assertEquals(body.data.lastName, payload.lastName);
  assertEquals(body.data.email, payload.email);
});

Deno.test("POST /api/contacts returns 400 for invalid payload", async () => {
  const payload = { lastName: "NoFirstName", email: "bad@example.com" };
  const req = new Request("http://localhost/api/contacts", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const res = await backend.fetch(req);
  assertEquals(res.status, 400);
  const body = await res.json();
  assertEquals(body.ok, false);
  assertExists(body.error);
});

Deno.test(
  "GET /api/contacts lists contacts and supports query filters",
  async () => {
    // create one verified and one unverified contact via repo
    await createContact({
      payload: {
        first_name: "Alice",
        last_name: "Verified",
        email: "alice.verified@example.com",
        verified: true,
      },
    });
    await createContact({
      payload: {
        first_name: "Bob",
        last_name: "Unverified",
        email: "bob.unverified@example.com",
        verified: false,
      },
    });

    // list all
    let res = await backend.fetch(new Request("http://localhost/api/contacts"));
    assertEquals(res.status, 200);
    let body = await res.json();
    assertEquals(body.ok, true);
    assertEquals(Array.isArray(body.data), true);
    assertEquals(body.data.length >= 2, true);

    // filter verified=true
    res = await backend.fetch(
      new Request("http://localhost/api/contacts?verified=true"),
    );
    assertEquals(res.status, 200);
    body = await res.json();
    assertEquals(body.ok, true);
    // all returned items should have verified === true
    for (const item of body.data) {
      assertEquals(item.verified, true);
    }
  },
);

Deno.test("PATCH /api/contacts/:id/verify marks contact verified", async () => {
  const created = await createContact({
    payload: {
      first_name: "Charlie",
      last_name: "ToVerify",
      email: "charlie@example.com",
      verified: false,
    },
  });

  const res = await backend.fetch(
    new Request(`http://localhost/api/contacts/${created.id}/verify`, {
      method: "PATCH",
    }),
  );

  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.ok, true);
  assertEquals(body.data.id, created.id);
  assertEquals(body.data.verified, true);
});

Deno.test(
  "DELETE /api/contacts/:id deletes the contact and returns 204",
  async () => {
    const created = await createContact({
      payload: {
        first_name: "Delete",
        last_name: "Me",
        email: "delete.me@example.com",
        verified: false,
      },
    });

    const res = await backend.fetch(
      new Request(`http://localhost/api/contacts/${created.id}`, {
        method: "DELETE",
      }),
    );

    assertEquals(res.status, 204);

    // Ensure not found when attempting to verify/delete again
    const res2 = await backend.fetch(
      new Request(`http://localhost/api/contacts/${created.id}`, {
        method: "DELETE",
      }),
    );
    // second delete should return 404
    assertEquals(res2.status, 404);
  },
);
