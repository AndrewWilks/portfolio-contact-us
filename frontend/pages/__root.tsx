import { Link, createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "@blocks/Header.tsx";
import Footer from "@blocks/Footer.tsx";
import { useLayoutEffect, useRef, useState } from "react";
import Spinner from "@ui/Primitives/Spinner.tsx";
import { TriangleAlert, SearchX, ArrowLeft } from "lucide-react";

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
    <section className="flex flex-col items-center justify-center py-32 px-4 text-(--text) max-w-2xl mx-auto text-center min-h-fit h-[70vh]">
      <TriangleAlert className="w-12 h-12 mx-auto text-red-500" />
      <h2 className="mt-4 text-2xl font-semibold">Something went wrong</h2>
      <p className="mt-2 text-(--muted) whitespace-pre-wrap text-sm">
        {message}
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 px-4 py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </section>
  );
};

const NotFound = () => {
  return (
    <section className="flex flex-col items-center justify-center py-32 px-4 text-(--text) max-w-2xl mx-auto text-center min-h-fit h-[70vh]">
      <SearchX className="w-12 h-12 mx-auto text-gray-400" />
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-(--muted)">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 px-4 py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to home
        </Link>
      </div>
    </section>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  pendingComponent: Pending,
  errorComponent: ErrorBoundary,
  notFoundComponent: NotFound,
});
