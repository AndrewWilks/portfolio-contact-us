import { Link } from "@tanstack/react-router";
import ThemeToggle from "@components/ThemeToggle.tsx";

export default function Header() {
  return (
    <header className="p-2 flex items-center justify-between container mx-auto h-16">
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
