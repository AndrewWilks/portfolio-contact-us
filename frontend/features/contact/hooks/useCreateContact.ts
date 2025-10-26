import { useNavigate } from "@tanstack/react-router";
import type { ContactCreate } from "@shared/schema";
import useToast from "@hooks/useToast.tsx";
import { createContact } from "../services/contact.api.ts";

export function useCreateContact() {
  const toast = useToast();
  const navigate = useNavigate();

  const submit = async (data: ContactCreate) => {
    try {
      await createContact(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      toast.open({
        title: "Failed to send",
        description: message,
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
  };

  return { submit };
}

export default useCreateContact;
