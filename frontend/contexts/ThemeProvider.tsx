import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "auto";

interface ThemeContextValue {
  theme: Theme;
  current: "light" | "dark";
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const getInitial = (): Theme => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark" || stored === "auto")
        return stored as Theme;
      // default to auto if not set
      return "auto";
    } catch {
      return "auto";
    }
  };

  const [theme, setThemeState] = useState<Theme>(getInitial);
  const [current, setCurrent] = useState<"light" | "dark">("light");

  useEffect(() => {
    setCurrent(shouldUseDark(theme) ? "dark" : "light");
  }, [theme]);

  // helper to determine whether dark should be applied
  const shouldUseDark = (t: Theme) => {
    if (t === "dark") return true;
    if (t === "light") return false;
    // auto: follow prefers-color-scheme
    try {
      const g = globalThis as unknown as {
        matchMedia?: (q: string) => MediaQueryList;
      };
      return (
        !!g.matchMedia && g.matchMedia("(prefers-color-scheme: dark)").matches
      );
    } catch {
      return false;
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* ignore */
    }

    const apply = () => {
      if (shouldUseDark(theme)) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    apply();

    // If auto, listen for changes to prefers-color-scheme
    type LegacyMQL = MediaQueryList & {
      addListener?: (handler: (e: MediaQueryListEvent) => void) => void;
      removeListener?: (handler: (e: MediaQueryListEvent) => void) => void;
    };
    let mq: LegacyMQL | null = null;
    const handle = () => apply();
    if (theme === "auto") {
      try {
        const g = globalThis as unknown as {
          matchMedia?: (q: string) => LegacyMQL;
        };
        if (g.matchMedia) {
          mq = g.matchMedia("(prefers-color-scheme: dark)");
          if (mq && typeof mq.addEventListener === "function") {
            mq.addEventListener("change", handle as EventListener);
          } else if (mq && typeof mq.addListener === "function") {
            mq.addListener(handle as (e: MediaQueryListEvent) => void);
          }
        }
      } catch (_e) {
        // ignore if matchMedia is not available
      }
    }

    return () => {
      if (mq) {
        try {
          if (typeof mq.removeEventListener === "function") {
            mq.removeEventListener("change", handle as EventListener);
          } else if (typeof mq.removeListener === "function") {
            mq.removeListener(handle as (e: MediaQueryListEvent) => void);
          }
        } catch (_e) {
          // ignore errors while removing listener
        }
      }
    };
  }, [theme]);

  const toggle = () =>
    setThemeState((t) =>
      t === "dark" ? "light" : t === "light" ? "auto" : "dark"
    );
  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme, current }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export default ThemeProvider;
