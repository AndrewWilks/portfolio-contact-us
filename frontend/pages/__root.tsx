import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import ThemeToggle from "@components/ThemeToggle.tsx";

const RootLayout = () => (
  <>
    <div className="p-2 flex items-center justify-between">
      <div className="flex gap-4">
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
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
