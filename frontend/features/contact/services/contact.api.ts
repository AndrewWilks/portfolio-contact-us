import type { ContactCreate } from "@shared/schema";

// Service: handles the POST /api/contacts call and throws on failure
export async function createContact(payload: ContactCreate): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`/api/contacts`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (_err) {
    throw new Error("Network error. Check console for details.");
  }

  if (!res.ok) {
    // Try to extract a meaningful error message
    try {
      const parsed = await res.json();
      const msg =
        parsed?.error?.message ?? parsed?.message ?? JSON.stringify(parsed);
      throw new Error(msg);
    } catch {
      const text = await res.text().catch(() => "Unknown server error");
      throw new Error(text);
    }
  }
}

export default { createContact };
