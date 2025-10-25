import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactCreateSchema, type ContactCreate } from "@shared/schema";
import Button from "@ui/Button.tsx";
import TextField from "@ui/TextField.tsx";

type ContactRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  verified?: boolean;
};

interface Props {
  open: boolean;
  contact?: ContactRow | null;
  // called when the user requests the panel to close (overlay/cancel)
  onRequestClose: () => void;
  // called when the panel has finished closing (animation complete)
  onClose: () => void;
  onSave: (id: string, payload: ContactCreate) => Promise<void>;
}

export default function ContactDetailsSidebar({
  open,
  contact,
  onRequestClose,
  onClose,
  onSave,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactCreate>({
    resolver: zodResolver(ContactCreateSchema),
  });

  useEffect(() => {
    if (contact) {
      reset({
        firstName: contact.firstName ?? "",
        lastName: contact.lastName ?? "",
        email: contact.email ?? "",
        phone: contact.phone ?? undefined,
        message: contact.message ?? undefined,
      });
    }
  }, [contact, reset]);

  // Internal mount + visible state so we can animate in/out even if parent toggles `open`.
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // wait for next frame then show (so transition runs)
      requestAnimationFrame(() => setVisible(true));
    } else if (mounted) {
      // start hide animation
      setVisible(false);
      // after animation completes, unmount and notify parent
      const t = setTimeout(() => {
        setMounted(false);
        onClose();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open, mounted, onClose]);

  // Lock body scroll when visible
  useEffect(() => {
    if (visible) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return;
  }, [visible]);

  if (!mounted || !contact) return null;

  const isEditable = !contact.verified;

  const submit = async (data: ContactCreate) => {
    await onSave(contact.id, data);
    // close with animation
    onRequestClose();
  };

  const overlayOpacity = visible
    ? "opacity-100"
    : "opacity-0 pointer-events-none";
  const panelTransform = visible ? "translate-x-0" : "translate-x-full";

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className={`flex-1 bg-black/40 transition-opacity duration-300 ${overlayOpacity}`}
        onClick={() => onRequestClose()}
        aria-hidden
      />
      <aside
        className={`w-96 bg-(--card) p-4 border-l transform transition-transform duration-300 ${panelTransform}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Contact details</h3>
          <button
            type="button"
            onClick={() => onRequestClose()}
            aria-label="Close"
            className="text-sm cursor-pointer"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} noValidate>
          <TextField
            label="First name"
            {...register("firstName")}
            error={errors.firstName?.message}
            disabled={!isEditable}
          />
          <TextField
            label="Last name"
            {...register("lastName")}
            error={errors.lastName?.message}
            disabled={!isEditable}
          />
          <TextField
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            disabled={!isEditable}
          />
          <TextField
            label="Phone"
            {...register("phone")}
            error={errors.phone?.message}
            disabled={!isEditable}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-(--text) mb-1">
              Message
            </label>
            <textarea
              {...register("message")}
              className="w-full border rounded px-3 py-2 bg-(--card) text-(--text) border-(--border)"
              rows={6}
              disabled={!isEditable}
            />
            {errors.message ? (
              <p className="mt-1 text-sm text-(--danger)">
                {errors.message.message}
              </p>
            ) : null}
          </div>

          <div className="flex justify-end gap-2">
            {isEditable ? (
              <>
                <Button type="button" variant="ghost" onClick={() => reset()}>
                  Discard
                </Button>
                <Button type="submit" loading={isSubmitting} variant="primary">
                  Save
                </Button>
              </>
            ) : (
              <div className="text-sm text-(--muted) self-center">
                Verified - read only
              </div>
            )}
          </div>
        </form>
      </aside>
    </div>
  );
}
