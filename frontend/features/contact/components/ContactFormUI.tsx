import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@ui/Primitives/Button.tsx";
import { type ContactCreate, ContactCreateSchema } from "@shared/schema";
import TextField from "@ui/Fields/TextField.tsx";
import TextAreaField from "@ui/Fields/TextFieldArea.tsx";
import { onDiscard } from "../hooks/onDiscard.ts";

interface ContactFormUIProps {
  initialValues?: ContactCreate;
  onSubmit: (values: ContactCreate) => void | Promise<void>;
  submitLabel?: string;
  canDiscardChanges?: boolean;
  discardLabel?: string;
}

export default function ContactFormUI({
  initialValues,
  onSubmit,
  submitLabel = "Send message",
  canDiscardChanges,
  discardLabel = "Discard",
}: ContactFormUIProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ContactCreate>({
    defaultValues: {
      firstName: initialValues?.firstName ?? "",
      lastName: initialValues?.lastName ?? "",
      email: initialValues?.email ?? "",
      phone: initialValues?.phone ?? "",
      message: initialValues?.message ?? "",
    },
    resolver: zodResolver(ContactCreateSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <TextField
          disabled={isSubmitting}
          label="First Name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />

        <TextField
          disabled={isSubmitting}
          label="Last Name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <TextField
        type="email"
        disabled={isSubmitting}
        label="Email"
        error={errors.email?.message}
        {...register("email")}
      />

      <TextField
        disabled={isSubmitting}
        label="Phone"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <TextAreaField
        rows={4}
        disabled={isSubmitting}
        label="Message"
        error={errors.message?.message}
        {...register("message")}
      />

      <div className="flex justify-end gap-2">
        {canDiscardChanges && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => onDiscard(initialValues, reset)}
            disabled={isSubmitting || !isDirty}
            title={isDirty ? "Discard changes" : "No changes to discard"}
          >
            {discardLabel}
          </Button>
        )}

        <Button
          type="submit"
          loading={isSubmitting}
          variant="primary"
          disabled={!isDirty}
          title={isDirty
            ? `${submitLabel.slice(0, 1).toUpperCase()}${
              submitLabel.slice(
                1,
              )
            }`
            : `Please make changes to enable ${submitLabel.toLowerCase()}.`}
        >
          {isSubmitting ? "Sending..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
