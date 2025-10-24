import { createContact } from "@backend/repos";

const contacts = [
  {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    message: "Hello from John",
    verified: false,
  },
  {
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    phone: "987-654-3210",
    message: "Contact from Jane",
    verified: true,
  },
];

export async function seed() {
  for (const contact of contacts) {
    await createContact({ payload: contact });
  }
  console.log("Seeding completed.");
}
