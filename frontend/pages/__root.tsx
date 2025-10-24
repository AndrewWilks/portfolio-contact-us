import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import ThemeToggle from "@components/ThemeToggle.tsx";

const RootLayout = () => (
  <>
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
    <hr />
    <main className="container mx-auto p-2 h-[calc(100vh-4rem)]">
      <Outlet />
    </main>
  </>
);

export const Route = createRootRoute({ component: RootLayout });
