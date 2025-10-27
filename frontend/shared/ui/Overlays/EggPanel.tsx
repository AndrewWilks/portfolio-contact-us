import { useEffect } from "react";

export type EggPanelProps = {
  open: boolean;
  onClose(): void;
};

export default function EggPanel({ open, onClose }: EggPanelProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    globalThis.addEventListener("keydown", onKey as EventListener);
    return () =>
      globalThis.removeEventListener("keydown", onKey as EventListener);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Discovery"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative mx-4 max-w-md rounded-xl border border-white/10 bg-neutral-900/85 p-6 shadow-xl text-neutral-50">
        <h2 className="text-xl font-semibold">You found it ✨</h2>
        <p className="mt-2 text-sm text-neutral-200">
          Congratulations on discovering this Easter egg! I'm Andrew Wilks, a
          full-stack developer passionate about building web applications.
          <br />
          <br />
          This hidden panel is a little surprise for those curious enough to
          find it. If you're interested in learning more about me or my work,
          feel free to check out my portfolio.
        </p>
        <p className="mt-4 text-sm">
          Visit my portfolio:{" "}
          <a
            href="https://andrewwilks.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-sm"
          >
            andrewwilks.au
          </a>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex items-center rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          Close
        </button>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-linear-to-b from-sky-400/30 to-transparent blur-2xl motion-safe:animate-pulse" />
        </div>
      </div>
    </div>
  );
}
