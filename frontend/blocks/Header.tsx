import { Link } from "@tanstack/react-router";
import ThemeToggle from "@ui/ThemeToggle.tsx";
import { Ref } from "react";

interface HeaderProps {
  ref?: Ref<HTMLDivElement>;
}

export default function Header({ ref }: HeaderProps) {
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
      </div>
      <div>
        <ThemeToggle />
      </div>
    </header>
  );
}
