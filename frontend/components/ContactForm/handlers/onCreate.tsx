import { useNavigate } from "@tanstack/react-router";
import type { ContactCreate } from "../../../../shared/schema/contact.ts";
import useToast from "../../../hooks/useToast.tsx";

export async function onCreate(
  data: ContactCreate,
  toast: ReturnType<typeof useToast>,
  navigate: ReturnType<typeof useNavigate>,
) {
  const body = data;
  const url = `${globalThis.location.origin}/api/contacts`;
  let res: Response | null = null;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("ContactForm: network error", err);
    toast.open({
      title: "Network error",
      description: "Check the console for details.",
      variant: "error",
    });
    return;
  }

  if (!res.ok) {
    let bodyText = "";
    try {
      const parsed = await res.json();
      bodyText = parsed?.error?.message ?? parsed?.message ??
        JSON.stringify(parsed);
    } catch {
      bodyText = await res.text().catch(() => "Unknown server error");
    }
    toast.open({
      title: "Failed to send",
      description: bodyText,
      variant: "error",
    });
    return;
  }

  toast.open({
    title: "Message sent",
    description: "Thanks | We'll be in touch.",
    variant: "success",
  });
  navigate({ to: "/contact/thank-you" });
}
