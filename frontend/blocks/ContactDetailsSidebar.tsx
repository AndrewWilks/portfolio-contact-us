import { useEffect, useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ContactCreate } from "@shared/schema";
import { ContactCreateSchema } from "@shared/schema";
import Button from "@ui/Primitives/Button.tsx";
import gsap from "gsap";
import TextField from "@ui/Fields/TextField.tsx";
import { CheckCheck } from "lucide-react";
import useSwipeClose from "../hooks/useSwipeClose.ts";
import { useConfirmContext } from "@ui/ConfirmDialog.tsx";

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

  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const prevActiveElement = useRef<HTMLElement | null>(null);
  const [panelState, setPanelState] = useState<
    "closed" | "opening" | "open" | "closing"
  >("closed");

  useEffect(() => {
    let tl: gsap.core.Timeline | null = null;
    if (open) setMounted(true);

    if (mounted && open) {
      if (!overlayRef.current || !panelRef.current) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setPanelState("opening");

      gsap.set(overlayRef.current, { opacity: 0, pointerEvents: "none" });
      gsap.set(panelRef.current, { xPercent: 100 });

      tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.to(
        overlayRef.current,
        { opacity: 1, duration: 0.28, pointerEvents: "auto" },
        0
      );
      tl.to(panelRef.current, { xPercent: 0, duration: 0.36 }, 0);

      tl.eventCallback("onComplete", () => {
        setPanelState("open");
        try {
          prevActiveElement.current = document.activeElement as HTMLElement;
        } catch (err) {
          void err;
        }
        const first = panelRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (first) first.focus();
      });

      return () => {
        document.body.style.overflow = prev;
        tl?.kill();
      };
    }

    if (!open && mounted) {
      if (!overlayRef.current || !panelRef.current) return;
      const prev = document.body.style.overflow;
      setPanelState("closing");
      const out = gsap.timeline({ defaults: { ease: "power2.in" } });
      out.to(panelRef.current, { xPercent: 100, duration: 0.36 });
      out.to(
        overlayRef.current,
        { opacity: 0, duration: 0.28, pointerEvents: "none" },
        "-=-0.2"
      );
      out.eventCallback("onComplete", () => {
        setPanelState("closed");
        setMounted(false);
        onClose();
        try {
          prevActiveElement.current?.focus();
        } catch (err) {
          void err;
        }
        document.body.style.overflow = prev;
      });

      return () => out.kill();
    }
  }, [open, mounted, onClose]);

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

  const performSaveAndClose = useCallback(
    async (data: ContactCreate) => {
      await onSave(contact!.id, data);
      onRequestClose();
    },
    [contact, onSave, onRequestClose]
  );

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

  // Three-way close attempt
  const handleCloseAttempt = useCallback(async () => {
    if (!isDirty) {
      onRequestClose();
      return;
    }

    if (confirmCtx?.confirmThreeWay) {
      const res = await confirmCtx.confirmThreeWay(
        "You have unsaved changes. Save before closing?"
      );
      if (res === "save") {
        const valid = await trigger();
        if (!valid) return;
        const values = getValues();
        await performSaveAndClose(values as ContactCreate);
        return;
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
        onRequestClose();
        return;
      }
      // cancel -> do nothing
      return;
    }

    // Fallback local three-way modal using global confirm + save flow
    const saveFirst = globalThis.confirm("Save changes before closing?");
    if (saveFirst) {
      const valid = await trigger();
      if (!valid) return;
      const values = getValues();
      await performSaveAndClose(values as ContactCreate);
      return;
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
      onRequestClose();
    }
  }, [
    contact,
    isDirty,
    confirmCtx,
    getValues,
    onRequestClose,
    performSaveAndClose,
    reset,
    trigger,
  ]);

  // Attach swipe handler via the hook
  useSwipeClose(panelRef, {
    threshold: 80,
    onCloseAttempt: () => void handleCloseAttempt(),
  });

  // Focus trap + Escape handling
  useEffect(() => {
    if (!mounted) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        void handleCloseAttempt();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const selector =
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const nodeList = Array.from(
        panel.querySelectorAll<HTMLElement>(selector)
      );
      const focusable = nodeList.filter(
        (el) =>
          !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
      );
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const currentIndex = focusable.indexOf(
        document.activeElement as HTMLElement
      );
      if (e.shiftKey) {
        if (currentIndex === 0 || document.activeElement === panel) {
          e.preventDefault();
          focusable[focusable.length - 1].focus();
        }
      } else {
        if (currentIndex === focusable.length - 1) {
          e.preventDefault();
          focusable[0].focus();
        }
      }
    };
    if (panelState === "open") {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
    return;
  }, [mounted, panelState, handleCloseAttempt]);

  if (!mounted || !contact) return null;

  const isEditable = !contact.verified;

  return (
    <div className="fixed inset-0 z-50">
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/40 opacity-0 pointer-events-none z-40"
        onClick={() => void handleCloseAttempt()}
        aria-hidden
      />
      <aside
        ref={panelRef}
        data-state={panelState}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-details-title"
        className={`fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-(--card) sm:border-l sm:border-l-zinc-200 sm:dark:border-l-zinc-700 z-50 shadow-2xl transform-gpu h-full grid grid-rows-[auto_1fr_auto]`}
      >
        <div className="flex items-center justify-between p-4 border-b border-(--border)">
          <h3 id="contact-details-title" className="text-lg font-semibold">
            Contact details
          </h3>
          <Button
            onClick={() => void handleCloseAttempt()}
            aria-label="Close"
            size="small"
            variant="ghost"
            icon="XCircle"
          />
        </div>

        <div className="px-4 py-3 overflow-auto">
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
          </form>
        </div>

        <div className="p-3 border-t border-(--border) bg-(--card)">
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
                <span className="text-xs"> | Read Only</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
