import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ContactCreate } from "@shared/schema";
import { ContactCreateSchema } from "@shared/schema";
import Button from "@ui/Primitives/Button.tsx";
import TextField from "@ui/Fields/TextField.tsx";
import { CheckCheck } from "lucide-react";
import { useConfirmContext } from "@ui/ConfirmDialog.tsx";
import TextAreaField from "@ui/Fields/TextFieldArea.tsx";
import Drawer from "@ui/Overlays/Drawer.tsx";

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
  onRequestClose: () => void;
  onClose: () => void;
  onSave: (id: string, payload: ContactCreate) => Promise<void>;
}

export default function ContactDetailsSidebarBlock({
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
    getValues,
    trigger,
    formState: { errors, isSubmitting: _isSubmitting, isDirty },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact]);

  const panelRef = useRef<HTMLElement | null>(null);

  // When transitioning from open -> closed, inform parent
  const prevOpen = useRef<boolean>(open);
  useEffect(() => {
    if (prevOpen.current && !open) {
      onClose();
    }
    prevOpen.current = open;
  }, [open, onClose]);

  // Confirm provider
  let confirmCtx: ReturnType<typeof useConfirmContext> | null = null;
  try {
    confirmCtx = useConfirmContext();
  } catch {
    confirmCtx = null;
  }

  const performSaveOnly = useCallback(
    async (data: ContactCreate) => {
      await onSave(contact!.id, data);
    },
    [contact, onSave]
  );

  // kept for reference earlier; not used in the new unified close flow
  // const _performSaveAndClose = useCallback(
  //   async (data: ContactCreate) => {
  //     await onSave(contact!.id, data);
  //     onRequestClose();
  //   },
  //   [contact, onSave, onRequestClose]
  // );

  const submit = async (data: ContactCreate) => {
    const ok = confirmCtx
      ? await confirmCtx.confirm("Save changes?", {
          title: "Save changes",
          description: "Save changes to this contact?",
          confirmText: "Save",
          cancelText: "Cancel",
        })
      : Promise.resolve(globalThis.confirm("Save changes?"));
    if (!ok) return;
    await performSaveOnly(data);
  };

  const handleDiscard = async () => {
    if (!isDirty) {
      reset(
        contact
          ? {
              firstName: contact.firstName ?? "",
              lastName: contact.lastName ?? "",
              email: contact.email ?? "",
              phone: contact.phone ?? undefined,
              message: contact.message ?? undefined,
            }
          : undefined
      );
      return;
    }
    const ok = confirmCtx
      ? await confirmCtx.confirm("Discard changes?", {
          title: "Discard changes",
          description: "You have unsaved changes. Discard them?",
          confirmText: "Discard",
          cancelText: "Cancel",
        })
      : Promise.resolve(globalThis.confirm("Discard changes?"));
    if (!ok) return;
    reset(
      contact
        ? {
            firstName: contact.firstName ?? "",
            lastName: contact.lastName ?? "",
            email: contact.email ?? "",
            phone: contact.phone ?? undefined,
            message: contact.message ?? undefined,
          }
        : undefined
    );
  };

  // Prepare confirm workflow that returns a boolean and performs actions (save/discard)
  const confirmClose = useCallback(async (): Promise<boolean> => {
    if (!isDirty) {
      return true;
    }

    if (confirmCtx?.confirmThreeWay) {
      const res = await confirmCtx.confirmThreeWay(
        "You have unsaved changes. Save before closing?"
      );
      if (res === "save") {
        const valid = await trigger();
        if (!valid) return false;
        const values = getValues();
        await performSaveOnly(values as ContactCreate);
        return true;
      }
      if (res === "discard") {
        reset(
          contact
            ? {
                firstName: contact.firstName ?? "",
                lastName: contact.lastName ?? "",
                email: contact.email ?? "",
                phone: contact.phone ?? undefined,
                message: contact.message ?? undefined,
              }
            : undefined
        );
        return true;
      }
      // cancel -> do nothing
      return false;
    }

    // Fallback local three-way modal using global confirm + save flow
    const saveFirst = globalThis.confirm("Save changes before closing?");
    if (saveFirst) {
      const valid = await trigger();
      if (!valid) return false;
      const values = getValues();
      await performSaveOnly(values as ContactCreate);
      return true;
    }
    const discard = globalThis.confirm("Discard changes?");
    if (discard) {
      reset(
        contact
          ? {
              firstName: contact.firstName ?? "",
              lastName: contact.lastName ?? "",
              email: contact.email ?? "",
              phone: contact.phone ?? undefined,
              message: contact.message ?? undefined,
            }
          : undefined
      );
      return true;
    }
    return false;
  }, [
    contact,
    isDirty,
    confirmCtx,
    getValues,
    performSaveOnly,
    reset,
    trigger,
  ]);

  // Three-way close attempt for header button etc.
  const handleCloseAttempt = useCallback(async () => {
    const ok = await confirmClose();
    if (ok) onRequestClose();
  }, [confirmClose, onRequestClose]);

  if (!contact) return null;

  const isEditable = !contact.verified;

  const footer = (
    <div className="flex justify-end gap-2">
      {isEditable ? (
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={() => void handleDiscard()}
            disabled={!isDirty}
            title={isDirty ? "Discard changes" : "No changes to discard"}
          >
            Discard
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(submit)}
            loading={_isSubmitting}
            variant="primary"
            disabled={!isDirty}
            title={isDirty ? "Save changes" : "No changes to save"}
          >
            Save
          </Button>
        </>
      ) : (
        <div className="text-sm text-(--muted) self-center flex items-center gap-1">
          <CheckCheck
            size={16}
            className="text-green-500 dark:text-green-300 mr-1"
          />
          <span className="font-medium">Verified</span>
          <span className="text-xs">| Read Only</span>
        </div>
      )}
    </div>
  );

  return (
    <Drawer
      ref={panelRef}
      open={open}
      onRequestClose={() => void handleCloseAttempt()}
      onBeforeClose={confirmClose}
      title={<span id="contact-details-title">Contact details</span>}
      headerRightSlot={
        <Button
          onClick={() => void handleCloseAttempt()}
          aria-label="Close"
          size="small"
          variant="ghost"
          icon="XCircle"
        />
      }
      footerSlot={footer}
    >
      <form
        onSubmit={handleSubmit(submit)}
        noValidate
        className="flex flex-col gap-4"
      >
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
        <TextAreaField
          {...register("message")}
          rows={6}
          disabled={!isEditable}
          label="Message"
          error={errors.message?.message}
        />
      </form>
    </Drawer>
  );
}
