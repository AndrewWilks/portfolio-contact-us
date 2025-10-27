import {
  ContactRow,
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
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      verified: false,
    };
    const contact = await createContact({ payload });

    assert(contact.id, "Contact should have an id");
    assert(typeof contact.id === "string");
    assert(contact.firstName === payload.firstName);
    assert(contact.lastName === payload.lastName);
    assert(contact.email === payload.email);
    assert(contact.phone === null);
    assert(contact.message === null);
    assert(contact.verified === false);
    assert(typeof contact.createdAt === "number");
  },
);

Deno.test("createContact sets optional fields if provided", async () => {
  const payload = {
    firstName: "Jane",
    lastName: "Smith",
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
    firstName: "Alice",
    lastName: "Brown",
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
  },
);

Deno.test(
  "listContacts returns all contacts ordered by created_at descending",
  async () => {
    const payloads = [
      {
        firstName: "First",
        lastName: "User",
        email: "first.user@example.com",
        verified: false,
      },
      {
        firstName: "Second",
        lastName: "User",
        email: "second.user@example.com",
        verified: true,
      },
      {
        firstName: "Third",
        lastName: "User",
        email: "third.user@example.com",
        verified: false,
      },
    ];

    // Create contacts with a slight delay to ensure different created_at values
    const contactsCreated: ContactRow[] = [];
    for (const payload of payloads) {
      const contact = await createContact({ payload });
      contactsCreated.push(contact);
      await new Promise((r) => setTimeout(r, 5));
    }

    const contacts = await listContacts();
    assert(contacts.length === 3);

    // Should be ordered by createdAt descending
    assert(
      contacts[0].createdAt >= contacts[1].createdAt &&
        contacts[1].createdAt >= contacts[2].createdAt,
    );

    // IDs should match the created contacts in reverse order
    assert(contacts[0].id === contactsCreated[2].id);
    assert(contacts[1].id === contactsCreated[1].id);
    assert(contacts[2].id === contactsCreated[0].id);
  },
);

Deno.test(
  "getContactById returns the correct contact when it exists",
  async () => {
    const payload = {
      firstName: "Emily",
      lastName: "Clark",
      email: "emily.clark@example.com",
      verified: false,
    };
    const created = await createContact({ payload });

    const contact = await getContactById({ id: created.id });
    assert(contact, "Contact should be found");
    assert(contact.id === created.id);
    assert(contact.firstName === payload.firstName);
    assert(contact.lastName === payload.lastName);
    assert(contact.email === payload.email);
    assert(contact.verified === false);
  },
);

Deno.test("getContactById returns undefined for non-existent id", async () => {
  const contact = await getContactById({ id: "non-existent-id" });
  assert(contact === undefined);
});

Deno.test(
  "verifyContact sets verified to true for an existing contact",
  async () => {
    const payload = {
      firstName: "Mark",
      lastName: "Lee",
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
  },
);

Deno.test(
  "unverifyContact sets verified to false for an existing contact",
  async () => {
    const payload = {
      firstName: "Undo",
      lastName: "Verify",
      email: "undo.verify@example.com",
      verified: true,
    };
    const created = await createContact({ payload });

    // Initially verified
    assert(created.verified === true);

    const updated = await (
      await import("@backend/repos")
    ).unverifyContact({ id: created.id });
    assert(updated, "Updated contact should be returned");
    assert(updated?.id === created.id);
    assert(updated?.verified === false);
  },
);

Deno.test(
  "verifyContact returns undefined for non-existent contact",
  async () => {
    const result = await verifyContact({ id: "non-existent-id" });
    assert(result === undefined);
  },
);

Deno.test(
  "deleteContact deletes an existing contact and returns the deleted record",
  async () => {
    const payload = {
      firstName: "Delete",
      lastName: "Me",
      email: "delete.me@example.com",
      verified: false,
    };
    const created = await createContact({ payload });

    const deleted = await deleteContact({ id: created.id });
    assert(deleted, "Deleted contact should be returned");
    assert(deleted.id === created.id);
    assert(deleted.firstName === payload.firstName);
    assert(deleted.lastName === payload.lastName);
    assert(deleted.email === payload.email);

    // Ensure the contact is no longer in the database
    const found = await getContactById({ id: created.id });
    assert(found === undefined);
  },
);

Deno.test(
  "deleteContact returns undefined for non-existent contact",
  async () => {
    const deleted = await deleteContact({ id: "non-existent-id" });
    assert(deleted === undefined);
  },
);
