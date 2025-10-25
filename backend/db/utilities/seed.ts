import { createContact } from "@backend/repos";

const contacts = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    message: "Hello from John",
    verified: false,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
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
