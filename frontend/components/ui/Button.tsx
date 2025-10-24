import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded focus:outline-none";
  const styles =
    variant === "primary"
      ? "bg-green-500 text-white hover:bg-green-600"
      : "bg-transparent text-green-500 hover:bg-green-100";
  return (
    <button
      type="button"
      className={`${base} ${styles} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
