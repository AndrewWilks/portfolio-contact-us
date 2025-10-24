import { createFileRoute } from "@tanstack/react-router";
import ContactForm from "@components/ContactForm/ContactForm.tsx";

export const Route = createFileRoute("/contact/")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <ContactForm />
    </div>
  );
}
