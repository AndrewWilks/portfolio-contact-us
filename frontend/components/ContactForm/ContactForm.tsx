import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactCreateSchema, type ContactCreate } from "@shared/schema";
import TextField from "../ui/TextField.tsx";

function toSnakeCasePayload(payload: ContactCreate) {
  return {
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
    phone: payload.phone ?? null,
    message: payload.message ?? null,
  };
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactCreate>({ resolver: zodResolver(ContactCreateSchema) });

  const onSubmit = async (data: ContactCreate) => {
    const body = toSnakeCasePayload(data);
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    // route-driven modal: navigate to thank-you route
    globalThis.location.href = "/contact/thank-you";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white">
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
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Message
        </label>
        <textarea
          id="message"
          {...register("message")}
          className="w-full border rounded px-3 py-2"
          rows={4}
        />
        {errors.message ? (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        ) : null}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {isSubmitting ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
