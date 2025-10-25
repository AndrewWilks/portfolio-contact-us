import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactCreateSchema, type ContactCreate } from "@shared/schema";
import Button from "@ui/Button.tsx";
import gsap from "gsap";
import TextField from "@ui/TextField.tsx";
import { CheckCheck } from "lucide-react";

// TODO: Componentise this into reusable components with GSAP animations

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

  // Internal mount state so we can keep DOM mounted while animating
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const prevActiveElement = useRef<HTMLElement | null>(null);
  const [panelState, setPanelState] = useState<
    "closed" | "opening" | "open" | "closing"
  >("closed");

  useEffect(() => {
    let tl: gsap.core.Timeline | null = null;

    if (open) {
      setMounted(true);
    }

    // animate in when mounted and open
    if (mounted && open) {
      if (!overlayRef.current || !panelRef.current) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      setPanelState("opening");

      // ensure starting state
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
        } catch (_e) {
          /* ignore */
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

    // animate out then unmount
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
        } catch (_e) {
          /* ignore */
        }
        document.body.style.overflow = prev;
      });

      return () => out.kill();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mounted, contact]);
  // Focus trap + Escape handling while the panel is open.
  useEffect(() => {
    if (!mounted) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onRequestClose();
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
      const focusable = nodeList.filter((el) => {
        // element must be visible
        return !!(
          el.offsetWidth ||
          el.offsetHeight ||
          el.getClientRects().length
        );
      });

      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const currentIndex = focusable.indexOf(
        document.activeElement as HTMLElement
      );

      if (e.shiftKey) {
        // Move backward
        if (currentIndex === 0 || document.activeElement === panel) {
          e.preventDefault();
          focusable[focusable.length - 1].focus();
        }
      } else {
        // Move forward
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
  }, [mounted, panelState, onRequestClose]);

  // don't render until we've mounted and have a contact to show
  if (!mounted || !contact) return null;

  const isEditable = !contact.verified;

  const submit = async (data: ContactCreate) => {
    await onSave(contact.id, data);
    // close with animation
    onRequestClose();
  };

  // (GSAP drives animation on overlayRef and panelRef)

  return (
    <div className="fixed inset-0 z-50">
      {/* full-screen overlay sits under the panel to avoid a hard seam during animation */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/40 opacity-0 pointer-events-none z-40"
        onClick={() => onRequestClose()}
        aria-hidden
      />
      <aside
        ref={panelRef}
        data-state={panelState}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-details-title"
        className={`fixed right-0 top-0 bottom-0 w-96 bg-(--card) p-4 border-l border-l-zinc-200 dark:border-l-zinc-700 z-50 shadow-2xl transform-gpu`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 id="contact-details-title" className="text-lg font-semibold">
            Contact details
          </h3>
          <Button
            onClick={() => onRequestClose()}
            aria-label="Close"
            size="small"
            variant="ghost"
            icon="XCircle"
          />
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
        </form>
      </aside>
    </div>
  );
}
