import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactCreateSchema, type ContactCreate } from "@shared/schema";
import Button from "@ui/Button.tsx";
import gsap from "gsap";
import TextField from "@ui/TextField.tsx";
import { CheckCheck } from "lucide-react";
import { useConfirm } from "../../hooks/useConfirm.tsx";

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
  }, [contact, reset]);

  // Internal mount state so we can keep DOM mounted while animating
  const [mounted, setMounted] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
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

      // ensure starting state (overlay should not capture events until visible)
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

  // confirm dialog hook (provided by ConfirmDialogProvider)
  // Use a defensive wrapper so if the provider/hook isn't available we fall
  // back to window.confirm. This avoids silent failures where no dialog
  // appears.
  const confirmDialog = useConfirm();

  const askConfirm = async (
    message: string,
    opts?: {
      title?: string;
      description?: string;
      confirmText?: string;
      cancelText?: string;
    }
  ): Promise<boolean> => {
    try {
      if (typeof confirmDialog === "function") {
        // confirmDialog's signature may vary; call via an unknown cast to avoid
        // TypeScript mismatches while still preserving a runtime call.
        return await (
          confirmDialog as unknown as (
            m: string,
            o?: unknown
          ) => Promise<boolean>
        )(message, opts);
      }
    } catch (_e) {
      // fallthrough to native confirm
    }
    // Fallback - keep message simple (native confirm doesn't support rich options)
    const nativeConfirm = (
      globalThis as unknown as { confirm?: (m: string) => boolean }
    ).confirm;
    return Promise.resolve(
      nativeConfirm ? nativeConfirm(opts?.title ?? message) : false
    );
  };

  // perform save without closing the panel
  const performSaveOnly = async (data: ContactCreate) => {
    await onSave(contact!.id, data);
  };

  // perform save and then close the panel (used by explicit close flows)
  const performSaveAndClose = async (data: ContactCreate) => {
    await onSave(contact!.id, data);
    onRequestClose();
  };

  // submit handler includes a confirmation step before saving (used by Save button)
  // NOTE: Save button should not close the panel per UX request; it only saves.
  const submit = async (data: ContactCreate) => {
    const ok = await askConfirm("Save changes?", {
      title: "Save changes",
      description: "Save changes to this contact?",
      confirmText: "Save",
      cancelText: "Cancel",
    });
    if (!ok) return;
    await performSaveOnly(data);
  };

  // discard handler - asks for confirmation if form is dirty
  // NOTE: Discard button should NOT close the panel; it only resets the form when confirmed.
  const handleDiscard = async () => {
    if (!isDirty) {
      // nothing to discard, just reset values
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
    const ok = await askConfirm("Discard changes?", {
      title: "Discard changes",
      description: "You have unsaved changes. Discard them?",
      confirmText: "Discard",
      cancelText: "Cancel",
    });
    if (!ok) return;
    // reset to the contact values but DO NOT close the panel
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

  // attempt to close the panel, confirming if there are unsaved changes
  const handleCloseAttempt = () => {
    if (!isDirty) {
      onRequestClose();
      return;
    }
    // Open the built-in 3-way confirm modal (Save | Discard | Cancel)
    setCloseModalOpen(true);
    return;
  };

  // swipe-to-close: use pointer events for more reliable detection across devices
  // Attach listeners only after the panel is mounted. Use a ref to the
  // latest handleCloseAttempt so handlers don't hold stale closures.
  const handleCloseAttemptRef = useRef<(() => Promise<void> | void) | null>(
    null
  );

  useEffect(() => {
    handleCloseAttemptRef.current = handleCloseAttempt;
  }, [handleCloseAttempt]);

  useEffect(() => {
    if (!mounted) return;
    const panel = panelRef.current;
    if (!panel) return;

    let startX = 0;
    let startY = 0;
    let pointerId: number | null = null;
    let moved = false;

    const onPointerDown = (e: PointerEvent) => {
      // only track primary touch/pen/mouse
      if (pointerId !== null) return;
      // If the pointerdown started on an interactive control (button, input,
      // link, etc.) treat it as an interaction and don't start pointer
      // capture for the swipe-to-close logic. This prevents the panel from
      // capturing the pointer and swallowing the click that should reach the
      // button.
      try {
        const targetEl = e.target as HTMLElement | null;
        if (
          targetEl &&
          targetEl.closest(
            "button, [role=button], a, input, textarea, select, label, summary"
          )
        ) {
          // Let the interactive element handle the pointer normally
          return;
        }
      } catch (_e) {
        /* ignore */
      }
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      moved = false;
      try {
        // @ts-ignore - setPointerCapture may not exist in ts lib defs
        panel.setPointerCapture?.(pointerId);
      } catch (_e) {
        // ignore
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointerId === null || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) moved = true;
    };

    const onPointerUp = async (e: PointerEvent) => {
      if (pointerId === null || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const threshold = 80; // px
      pointerId = null;
      try {
        panel.releasePointerCapture?.(e.pointerId);
      } catch (_e) {
        /* ignore */
      }
      if (!moved) return;
      if (dx > threshold && Math.abs(dy) < 100) {
        // route through the normal close-attempt flow which will prompt on dirty
        await handleCloseAttemptRef.current?.();
      }
    };

    panel.addEventListener("pointerdown", onPointerDown);
    panel.addEventListener("pointermove", onPointerMove);
    panel.addEventListener("pointerup", onPointerUp);

    return () => {
      panel.removeEventListener("pointerdown", onPointerDown);
      panel.removeEventListener("pointermove", onPointerMove);
      panel.removeEventListener("pointerup", onPointerUp);
    };
  }, [mounted]);

  // DEBUG: attach a capture-phase click listener to inspect where clicks go.
  // Remove this after debugging.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      try {
        // Log basic target
        // eslint-disable-next-line no-console
        console.log("[ContactDetailsSidebar] capture click target:", e.target);

        // Log composed path (first few entries)
        const cp =
          typeof (e as PointerEvent & { composedPath?: () => EventTarget[] })
            .composedPath === "function"
            ? (e as PointerEvent & { composedPath: () => EventTarget[] })
                .composedPath()
                .slice(0, 5)
            : null;
        // eslint-disable-next-line no-console
        console.log("[ContactDetailsSidebar] composedPath:", cp);

        // Log elementFromPoint at the click coordinates
        const x = e.clientX;
        const y = e.clientY;
        const elAtPoint = document.elementFromPoint(x, y);
        // eslint-disable-next-line no-console
        console.log(
          "[ContactDetailsSidebar] elementFromPoint:",
          elAtPoint,
          "computed pointer-events:",
          elAtPoint ? getComputedStyle(elAtPoint).pointerEvents : undefined
        );

        // Attach temporary native listeners to buttons inside the panel to see if native clicks fire
        const panel = panelRef.current;
        if (panel) {
          const buttons = Array.from(
            panel.querySelectorAll("button")
          ) as HTMLButtonElement[];
          buttons.forEach((b, i) => {
            if (
              !(b as unknown as { __debugAttached?: boolean }).__debugAttached
            ) {
              const nb = (ev: MouseEvent) => {
                // eslint-disable-next-line no-console
                console.log(
                  "[ContactDetailsSidebar] NATIVE button click ->",
                  i,
                  b,
                  ev.target
                );
              };
              b.addEventListener("click", nb);
              // mark so we don't reattach repeatedly
              (b as unknown as { __debugAttached?: boolean }).__debugAttached =
                true;
            }
          });
        }
      } catch (_e) {
        /* ignore */
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);
  // Focus trap + Escape handling while the panel is open.
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

  // (GSAP drives animation on overlayRef and panelRef)

  return (
    <div className="fixed inset-0 z-50">
      {/* full-screen overlay sits under the panel to avoid a hard seam during animation */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/40 opacity-0 pointer-events-none z-40"
        onClick={() => handleCloseAttempt()}
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
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b border-(--border)">
          <h3 id="contact-details-title" className="text-lg font-semibold">
            Contact details
          </h3>
          <Button
            onClick={() => {
              console.log("Closing contact details");
              handleCloseAttempt();
            }}
            aria-label="Close"
            size="small"
            variant="ghost"
            icon="XCircle"
          />
        </div>

        {/* body (scrollable) */}
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

        {/* footer (sticky) */}
        <div className="p-3 border-t border-(--border) bg-(--card)">
          <div className="flex justify-end gap-2">
            {isEditable ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => void handleDiscard()}
                >
                  Discard
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit(submit)}
                  loading={_isSubmitting}
                  variant="primary"
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

      {/* Local 3-way confirm modal for close attempts when the form is dirty */}
      {closeModalOpen ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setCloseModalOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="close-modal-title"
            className="relative bg-(--card) w-full max-w-lg mx-4 rounded shadow-2xl p-4 z-70"
          >
            <h4 id="close-modal-title" className="text-lg font-semibold">
              Unsaved changes
            </h4>
            <p className="text-sm text-(--muted) mt-2">
              You have unsaved changes. Would you like to save them before
              closing?
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCloseModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  // Discard changes and close
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
                  setCloseModalOpen(false);
                  onRequestClose();
                }}
              >
                Discard
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={async () => {
                  // Save then close
                  const valid = await trigger();
                  if (!valid) return;
                  const values = getValues();
                  try {
                    await performSaveAndClose(values as ContactCreate);
                  } finally {
                    setCloseModalOpen(false);
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
