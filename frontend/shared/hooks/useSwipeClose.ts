import { useEffect, useRef } from "react";

type Options = {
  threshold?: number; // pixels to trigger close
  onCloseAttempt: (info?: { direction: "left" | "right" }) => void;
};

// Guard helpers
const isInteractive = (el: EventTarget | null) => {
  if (!el || !(el instanceof Element)) return false;
  const tag = el.tagName.toLowerCase();
  if (["button", "a", "input", "textarea", "select"].includes(tag)) return true;
  if ((el as Element).getAttribute("role") === "button") return true;
  return false;
};

export default function useSwipeClose(
  ref: { current: HTMLElement | null },
  opts: Options,
) {
  const { threshold = 120, onCloseAttempt } = opts;
  const startX = useRef<number | null>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onPointerDown = (ev: PointerEvent) => {
      // If the initial target is interactive, don't start a capture/drag — allow clicks
      if (isInteractive(ev.target)) return;
      startX.current = ev.clientX;
      dragging.current = true;
      try {
        // only capture when starting from a non-interactive element
        (ev.target as Element).setPointerCapture(ev.pointerId);
      } catch (err) {
        // ignore failures to set pointer capture on some elements / browsers
        // (keeps lint happy by referencing the error)
        void err;
      }
    };

    const onPointerMove = (_ev: PointerEvent) => {
      if (!dragging.current || startX.current === null) return;
      // no-op: movement handled by parent for animation; hook only detects end-of-gesture
    };

    const onPointerUp = (ev: PointerEvent) => {
      if (!dragging.current || startX.current === null) {
        startX.current = null;
        dragging.current = false;
        return;
      }
      const delta = ev.clientX - startX.current;
      if (Math.abs(delta) > threshold) {
        onCloseAttempt({ direction: delta < 0 ? "left" : "right" });
      }
      startX.current = null;
      dragging.current = false;
      try {
        (ev.target as Element).releasePointerCapture(ev.pointerId);
      } catch (err) {
        // ignore release errors; reference err to satisfy linter
        void err;
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [ref, threshold, onCloseAttempt]);
}
