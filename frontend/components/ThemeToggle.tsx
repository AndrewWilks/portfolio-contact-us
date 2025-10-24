import { useTheme } from "@contexts/ThemeProvider.tsx";

export default function ThemeToggle() {
  const { theme, toggle, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <label className="sr-only">Theme</label>
      <button
        type="button"
        onClick={toggle}
        className="px-2 py-1 border rounded bg-gray-100 dark:bg-gray-700"
        aria-label={`Toggle theme (current: ${theme})`}
      >
        {theme === "auto" ? "Auto" : theme === "dark" ? "Dark" : "Light"}
      </button>
      <div className="hidden sm:block">
        <select
          aria-label="Select theme"
          value={theme}
          onChange={(e) =>
            setTheme(e.target.value as "auto" | "light" | "dark")
          }
          className="px-2 py-1 border rounded bg-white dark:bg-gray-800"
        >
          <option value="auto">Auto</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </div>
  );
}
