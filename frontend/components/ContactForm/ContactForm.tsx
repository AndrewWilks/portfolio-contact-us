import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactCreateSchema, type ContactCreate } from "@shared/schema";
import TextField from "../ui/TextField.tsx";
import { useNavigate } from "@tanstack/react-router";
import ShinyCard from "@ui/ShinyCard.tsx";
import Button from "@ui/Button.tsx";
import useToast from "../../hooks/useToast.tsx";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactCreate>({ resolver: zodResolver(ContactCreateSchema) });

  const toast = useToast();

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
      toast.open({
        title: "Network error",
        description: "Check the console for details.",
        variant: "error",
      });
      return;
    }
    console.log("ContactForm: response", res.status, res.url);
    if (!res.ok) {
      let bodyText = "";
      try {
        const parsed = await res.json();
        bodyText =
          parsed?.error?.message ?? parsed?.message ?? JSON.stringify(parsed);
        // Map field errors if provided
        if (
          parsed?.error?.fieldErrors &&
          Array.isArray(parsed.error.fieldErrors)
        ) {
          type FieldError = { field?: string; message?: string };
          parsed.error.fieldErrors.forEach((fe: FieldError) => {
            if (fe?.field && fe?.message)
              setError(fe.field as keyof ContactCreate, {
                type: "server",
                message: fe.message,
              });
          });
        }
      } catch {
        bodyText = await res.text().catch(() => "Unknown server error");
      }
      console.error("ContactForm: non-ok response", res.status, bodyText);
      toast.open({
        title: "Failed to send",
        description: bodyText,
        variant: "error",
      });
      return;
    }

    // navigate to the thank-you route (route-driven modal)
    toast.open({
      title: "Message sent",
      description: "Thanks — we'll be in touch.",
      variant: "success",
    });
    navigate({ to: "/contact/thank-you" });
  };

  return (
    <ShinyCard>
      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="rounded card"
        aria-live="polite"
      >
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
          <Button
            type="submit"
            loading={isSubmitting}
            variant="primary"
            className="cursor-pointer"
          >
            Send message
          </Button>
        </div>
      </form>
    </ShinyCard>
  );
}

export default ContactForm;
