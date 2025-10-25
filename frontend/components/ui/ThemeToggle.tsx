import { useTheme } from "@contexts/ThemeProvider.tsx";
import Button from "./Button.tsx";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <>
      <label className="sr-only" htmlFor="theme-toggle">
        Theme
      </label>
      <Button
        id="theme-toggle"
        type="button"
        onClick={toggle}
        variant="outline"
        size="small"
        aria-label={`Toggle theme (current: ${theme})`}
        icon={theme === "auto" ? "Computer" : theme === "dark" ? "Moon" : "Sun"}
      />
    </>
  );
}
