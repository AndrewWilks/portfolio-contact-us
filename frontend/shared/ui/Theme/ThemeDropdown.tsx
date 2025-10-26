import { useTheme } from "@contexts/ThemeProvider.tsx";

export default function ThemeDropdown() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <label className="sr-only" htmlFor="theme-select">
        Theme
      </label>
      <div className="hidden sm:block">
        <select
          id="theme-select"
          aria-label="Select theme"
          value={theme}
          onChange={(e) =>
            setTheme(e.target.value as "auto" | "light" | "dark")}
          className="px-2 py-1 border rounded bg-white dark:bg-gray-800"
        >
          <option value="auto">Auto</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </>
  );
}
