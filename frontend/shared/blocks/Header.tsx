import { Link } from "@tanstack/react-router";
import ThemeToggle from "@ui/Theme/ThemeToggle.tsx";
import { useState } from "react";
import { useEggTrigger } from "../lib/egg/trigger.ts";
import { EggPanel } from "@ui/Overlays/index.ts";
import { Ref } from "react";

interface HeaderProps {
  ref?: Ref<HTMLDivElement>;
}

export default function Header({ ref }: HeaderProps) {
  const { revealed, onClick, onKeyDown, reset } = useEggTrigger();
  const [open, setOpen] = useState(false);

  if (revealed && !open) {
    // Open panel once on reveal
    setOpen(true);
  }

  return (
    <header
      ref={ref}
      className="p-2 flex items-center justify-between container mx-auto h-16"
    >
      <div className="flex gap-4 ">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/contact" className="[&.active]:font-bold">
          Contact
        </Link>
        <Link to="/admin" className="[&.active]:font-bold">
          Admin
        </Link>
        <Link to="/me" className="[&.active]:font-bold">
          Me
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {/* Invisible but accessible click target to bootstrap egg before /me badge exists */}
        <button
          type="button"
          aria-label="Decoration"
          onClick={onClick}
          onKeyDown={(e) => onKeyDown(e as unknown as KeyboardEvent)}
          className="h-6 w-6 rounded-full opacity-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
        {/* Subtle, non-intrusive hint visible inline; kept short */}
        <span
          className="hidden sm:inline text-xs opacity-60 hover:opacity-100 transition"
          title="Some say seven is lucky."
        >
          {/* Intentionally short hint */}7 is lucky
        </span>
        <ThemeToggle />
      </div>
      <EggPanel
        open={open}
        onClose={() => {
          setOpen(false);
          // Allow re-discovery after closing
          setTimeout(() => reset(), 300);
        }}
      />
    </header>
  );
}
