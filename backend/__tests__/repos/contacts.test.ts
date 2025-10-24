import {
  createContact,
  deleteContact,
  getContactById,
  listContacts,
  verifyContact,
} from "@backend/repos";

import { assert } from "@std/assert";
import { clearContacts } from "../../db/utilities/clear.ts";

Deno.test.afterEach(async () => {
  await clearContacts();
});

Deno.test("placeholder contacts repo test", async () => {});

Deno.test(
  "createContact creates a new contact with required fields",
  async () => {
    const payload = {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      verified: false,
    };
    const contact = await createContact({ payload });

    assert(contact.id, "Contact should have an id");
    assert(typeof contact.id === "string");
    assert(contact.first_name === payload.first_name);
    assert(contact.last_name === payload.last_name);
    assert(contact.email === payload.email);
    assert(contact.phone === null);
    assert(contact.message === null);
    assert(contact.verified === false);
    assert(typeof contact.created_at === "number");
  }
);

Deno.test("createContact sets optional fields if provided", async () => {
  const payload = {
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    phone: "1234567890",
    message: "Hello!",
    verified: true,
  };
  const contact = await createContact({ payload });

  assert(contact.phone === payload.phone);
  assert(contact.message === payload.message);
  assert(contact.verified === true);
});

Deno.test("createContact coerces verified to boolean", async () => {
  const payload = {
    first_name: "Alice",
    last_name: "Brown",
    email: "alice.brown@example.com",
    verified: 1 as unknown as boolean,
  };
  const contact = await createContact({ payload });

  assert(contact.verified === true);
});

Deno.test(
  "listContacts returns an empty array when no contacts exist",
  async () => {
    const contacts = await listContacts();
    assert(Array.isArray(contacts));
    assert(contacts.length === 0);
  }
);

Deno.test(
  "listContacts returns all contacts ordered by created_at descending",
  async () => {
    const payloads = [
      {
        first_name: "First",
        last_name: "User",
        email: "first.user@example.com",
        verified: false,
      },
      {
        first_name: "Second",
        last_name: "User",
        email: "second.user@example.com",
        verified: true,
      },
      {
        first_name: "Third",
        last_name: "User",
        email: "third.user@example.com",
        verified: false,
      },
    ];

    // Create contacts with a slight delay to ensure different created_at values
    const contactsCreated: any[] = [];
    for (const payload of payloads) {
      const contact = await createContact({ payload });
      contactsCreated.push(contact);
      await new Promise((r) => setTimeout(r, 5));
    }

    const contacts = await listContacts();
    assert(contacts.length === 3);

    // Should be ordered by created_at descending
    assert(
      contacts[0].created_at >= contacts[1].created_at &&
        contacts[1].created_at >= contacts[2].created_at
    );

    // IDs should match the created contacts in reverse order
    assert(contacts[0].id === contactsCreated[2].id);
    assert(contacts[1].id === contactsCreated[1].id);
    assert(contacts[2].id === contactsCreated[0].id);
  }
);

Deno.test(
  "getContactById returns the correct contact when it exists",
  async () => {
    const payload = {
      first_name: "Emily",
      last_name: "Clark",
      email: "emily.clark@example.com",
      verified: false,
    };
    const created = await createContact({ payload });

    const contact = await getContactById({ id: created.id });
    assert(contact, "Contact should be found");
    assert(contact.id === created.id);
    assert(contact.first_name === payload.first_name);
    assert(contact.last_name === payload.last_name);
    assert(contact.email === payload.email);
    assert(contact.verified === false);
  }
);

Deno.test("getContactById returns undefined for non-existent id", async () => {
  const contact = await getContactById({ id: "non-existent-id" });
  assert(contact === undefined);
});

Deno.test(
  "verifyContact sets verified to true for an existing contact",
  async () => {
    const payload = {
      first_name: "Mark",
      last_name: "Lee",
      email: "mark.lee@example.com",
      verified: false,
    };
    const created = await createContact({ payload });

    // Initially not verified
    assert(created.verified === false);

    const updated = await verifyContact({ id: created.id });
    assert(updated, "Updated contact should be returned");
    assert(updated.id === created.id);
    assert(updated.verified === true);
  }
);

Deno.test(
  "verifyContact returns undefined for non-existent contact",
  async () => {
    const result = await verifyContact({ id: "non-existent-id" });
    assert(result === undefined);
  }
);

Deno.test(
  "deleteContact deletes an existing contact and returns the deleted record",
  async () => {
    const payload = {
      first_name: "Delete",
      last_name: "Me",
      email: "delete.me@example.com",
      verified: false,
    };
    const created = await createContact({ payload });

    const deleted = await deleteContact({ id: created.id });
    assert(deleted, "Deleted contact should be returned");
    assert(deleted.id === created.id);
    assert(deleted.first_name === payload.first_name);
    assert(deleted.last_name === payload.last_name);
    assert(deleted.email === payload.email);

    // Ensure the contact is no longer in the database
    const found = await getContactById({ id: created.id });
    assert(found === undefined);
  }
);

Deno.test(
  "deleteContact returns undefined for non-existent contact",
  async () => {
    const deleted = await deleteContact({ id: "non-existent-id" });
    assert(deleted === undefined);
  }
);
