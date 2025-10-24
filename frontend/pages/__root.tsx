import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../blocks/Header.tsx";
import Footer from "../blocks/Footer.tsx";
import { useRef, useState, useLayoutEffect } from "react";

const RootLayout = () => {
  // TODO: forward ref for better layout vertical height handling
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

export const Route = createRootRoute({ component: RootLayout });
