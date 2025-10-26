import ContactFormUI from "./ContactFormUI.tsx";
import { useCreateContact } from "../hooks/useCreateContact.ts";

export function ContactForm() {
  const { submit } = useCreateContact();

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <ContactFormUI onSubmit={submit} canDiscardChanges />
    </>
  );
}

export default ContactForm;
