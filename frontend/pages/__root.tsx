import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../blocks/Header.tsx";
import Footer from "../blocks/Footer.tsx";

const RootLayout = () => (
  // TODO: forward ref for better layout vertical height handling
  <>
    <Header />
    <hr />
    <main className="container mx-auto p-2 h-[calc(100vh-4rem)]">
      <Outlet />
    </main>
    <Footer />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
