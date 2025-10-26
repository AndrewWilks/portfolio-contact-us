import { useNavigate } from "@tanstack/react-router";
import type { ContactCreate } from "@shared/schema";
import useToast from "@hooks/useToast.tsx";
import { createContact } from "../services/contact.api.ts";
import { submitWithToasts } from "../../../shared/lib/toast/submit.ts";

export function useCreateContact() {
  const toast = useToast();
  const navigate = useNavigate();

  const submit = async (data: ContactCreate) => {
    await submitWithToasts(() => createContact(data), {
      onSuccess: () => {
        toast.open({
          title: "Message sent",
          description: "Thanks | We'll be in touch.",
          variant: "success",
        });
        navigate({ to: "/contact/thank-you" });
      },
      onError: (e) => {
        const message = e instanceof Error ? e.message : String(e);
        toast.open({
          title: "Failed to send",
          description: message,
          variant: "error",
        });
      },
    });
  };

  return { submit };
}

export default useCreateContact;
