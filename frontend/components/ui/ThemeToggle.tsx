import { useTheme } from "@contexts/ThemeProvider.tsx";
import { Sun, Moon, Computer } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <>
      <label className="sr-only" htmlFor="theme-toggle">
        Theme
      </label>
      <button
        id="theme-toggle"
        type="button"
        onClick={toggle}
        className="px-2 py-1 border rounded bg-gray-100 dark:bg-gray-700"
        aria-label={`Toggle theme (current: ${theme})`}
      >
        {theme === "auto" ? (
          <Computer />
        ) : theme === "dark" ? (
          <Moon />
        ) : (
          <Sun />
        )}
      </button>
    </>
  );
}
