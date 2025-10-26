import ContactFormUI from "./ContactFormUI.tsx";
import { useNavigate } from "@tanstack/react-router";
import useToast from "../../hooks/useToast.tsx";
import { onCreate } from "./handlers/onCreate.tsx";

export function ContactForm() {
  const toast = useToast();
  const navigate = useNavigate();

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <ContactFormUI
        onSubmit={(data) => onCreate(data, toast, navigate)}
        canDiscardChanges
      />
    </>
  );
}

export default ContactForm;
