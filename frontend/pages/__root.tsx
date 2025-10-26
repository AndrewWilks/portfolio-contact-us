import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "@blocks/Header.tsx";
import Footer from "@blocks/Footer.tsx";
import { useLayoutEffect, useRef, useState } from "react";
import Spinner from "@ui/Primitives/Spinner.tsx";

const RootLayout = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const [mainHeight, setMainHeight] = useState<number>(0);

  useLayoutEffect(() => {
    const calculateMainHeight = () => {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const footerHeight = footerRef.current?.offsetHeight || 0;
      const viewportHeight = globalThis.innerHeight;
      const calculatedHeight = viewportHeight - headerHeight - footerHeight;
      setMainHeight(calculatedHeight);
    };
    calculateMainHeight();
    globalThis.addEventListener("resize", calculateMainHeight);
    return () => {
      globalThis.removeEventListener("resize", calculateMainHeight);
    };
  }, []);

  return (
    <>
      <Header ref={headerRef} />
      <main
        ref={mainRef}
        className={`container mx-auto p-2 min-h-[${mainHeight}px]`}
      >
        <Outlet />
      </main>
      <Footer ref={footerRef} />
    </>
  );
};

const Pending = () => (
  <div className="flex items-center justify-center py-8 text-muted-foreground">
    <Spinner className="w-6 h-6 mr-2" />
    <span>Loading…</span>
  </div>
);

const ErrorBoundary = ({ error }: { error: unknown }) => {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div className="container mx-auto p-4">
      <div className="rounded-md border border-red-300 bg-red-50 text-red-800 p-4">
        <h2 className="font-semibold mb-1">Something went wrong</h2>
        <pre className="whitespace-pre-wrap text-sm">{message}</pre>
      </div>
    </div>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  pendingComponent: Pending,
  errorComponent: ErrorBoundary,
});
