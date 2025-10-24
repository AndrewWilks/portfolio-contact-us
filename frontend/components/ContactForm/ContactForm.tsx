import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactCreateSchema, type ContactCreate } from "@shared/schema";
import TextField from "../ui/TextField.tsx";
import { useNavigate } from "@tanstack/react-router";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactCreate>({ resolver: zodResolver(ContactCreateSchema) });

  const navigate = useNavigate();

  const onSubmit = async (data: ContactCreate) => {
    const body = data;
    const url = `${globalThis.location.origin}/api/contacts`;
    console.log("ContactForm: POST", url, body);
    let res: Response | null = null;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error("ContactForm: network error", err);
      alert("Network error sending message. Check the console for details.");
      return;
    }
    console.log("ContactForm: response", res.status, res.url);
    if (!res.ok) {
      const text = await res.text();
      console.error("ContactForm: non-ok response", res.status, text);
      alert(`Failed to send message: ${res.status} ${text}`);
      return;
    }
    if (!res.ok) {
      // Try to show a simple toast using Radix viewport (fallback to alert)
      try {
        // Radix toast doesn't expose a global API; fallback:
        alert("Failed to send message. Please try again.");
      } catch {
        /* ignore */
      }
      return;
    }

    // navigate to the thank-you route (route-driven modal)
    navigate({ to: "/contact/thank-you" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 rounded card">
      <TextField
        label="First name"
        {...register("firstName")}
        error={errors.firstName?.message}
      />
      <TextField
        label="Last name"
        {...register("lastName")}
        error={errors.lastName?.message}
      />
      <TextField
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <TextField
        label="Phone"
        {...register("phone")}
        error={errors.phone?.message}
      />
      <div className="mb-4">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-(--text) mb-1"
        >
          Message
        </label>
        <textarea
          id="message"
          {...register("message")}
          className="w-full border rounded px-3 py-2 bg-(--card) text-(--text) border-(--border)"
          rows={4}
        />
        {errors.message ? (
          <p className="mt-1 text-sm text-(--danger)">
            {errors.message.message}
          </p>
        ) : null}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-(--primary) text-(--primary-foreground) rounded hover:bg-(--primary-hover)"
        >
          {isSubmitting ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
