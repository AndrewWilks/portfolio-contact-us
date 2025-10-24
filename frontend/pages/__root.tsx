import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <div className="p-2 flex gap-4">
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
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
