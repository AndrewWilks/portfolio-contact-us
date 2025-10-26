import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import gsap from "gsap";

type DrawerProps = {
  open: boolean;
  onRequestClose: () => void;
  title?: React.ReactNode;
  headerRightSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  initialFocusSelector?: string;
  children: React.ReactNode;
};

// A reusable slide-in Drawer with overlay, escape handling and focus trap.
// Forwards a ref to the panel element so consumers can attach gesture handlers.
const Drawer = React.forwardRef<HTMLElement, DrawerProps>(function Drawer(
  {
    open,
    onRequestClose,
    title,
    headerRightSlot,
    footerSlot,
    initialFocusSelector,
    children,
  },
  forwardedRef
) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<"closed" | "opening" | "open" | "closing">(
    "closed"
  );
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const prevOverflow = useRef<string>("");
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => panelRef.current as HTMLElement, []);

  // Mount/unmount + animations
  useEffect(() => {
    let tl: gsap.core.Timeline | null = null;
    if (open) setMounted(true);

    if (open && mounted) {
      if (!overlayRef.current || !panelRef.current) return;
      prevOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setState("opening");

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
        setState("open");
        try {
          previouslyFocused.current = document.activeElement as HTMLElement;
        } catch (err) {
          void err;
        }
        const selector =
          initialFocusSelector ??
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const first = panelRef.current?.querySelector<HTMLElement>(selector);
        first?.focus();
      });

      return () => {
        tl?.kill();
        document.body.style.overflow = prevOverflow.current;
      };
    }

    if (!open && mounted) {
      if (!overlayRef.current || !panelRef.current) return;
      setState("closing");
      const out = gsap.timeline({ defaults: { ease: "power2.in" } });
      out.to(panelRef.current, { xPercent: 100, duration: 0.36 });
      out.to(
        overlayRef.current,
        { opacity: 0, duration: 0.28, pointerEvents: "none" },
        "-=-0.2"
      );
      out.eventCallback("onComplete", () => {
        setState("closed");
        setMounted(false);
        try {
          previouslyFocused.current?.focus();
        } catch (err) {
          void err;
        }
        document.body.style.overflow = prevOverflow.current;
      });
      return () => out.kill();
    }
  }, [open, mounted, initialFocusSelector]);

  // Escape and focus trap
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
    if (state === "open") {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [mounted, state, onRequestClose]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/40 opacity-0 pointer-events-none z-40"
        onClick={onRequestClose}
        aria-hidden
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-(--card) sm:border-l sm:border-l-zinc-200 sm:dark:border-l-zinc-700 z-50 shadow-2xl transform-gpu h-full grid grid-rows-[auto_1fr_auto]"
        data-state={state}
      >
        <div className="flex items-center justify-between p-4 border-b border-(--border)">
          {title ? <h3 className="text-lg font-semibold">{title}</h3> : <div />}
          {headerRightSlot}
        </div>
        <div className="px-4 py-3 overflow-auto">{children}</div>
        {footerSlot ? (
          <div className="p-3 border-t border-(--border) bg-(--card)">
            {footerSlot}
          </div>
        ) : null}
      </aside>
    </div>
  );
});

export default Drawer;
