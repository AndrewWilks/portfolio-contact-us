import type React from "react";
import Spinner from "@ui/Spinner.tsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  loading = false,
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded focus:outline-none gap-2";
  const styles =
    variant === "primary"
      ? "bg-(--primary) text-(--primary-foreground) hover:bg-(--primary-hover)"
      : "bg-transparent text-(--text) hover:bg-(--card)";

  const isDisabled = disabled || loading;

  const buttonType =
    (rest.type as "submit" | "reset" | "button" | undefined) ?? "button";

  return (
    <button
      type={buttonType}
      aria-busy={loading ? true : undefined}
      disabled={isDisabled}
      className={`${base} ${styles} ${className}`}
      {...rest}
    >
      {loading ? (
        <Spinner className="w-4 h-4 text-(--primary-foreground)" />
      ) : null}
      <span aria-hidden={loading ? true : undefined}>{children}</span>
    </button>
  );
}

export default Button;
