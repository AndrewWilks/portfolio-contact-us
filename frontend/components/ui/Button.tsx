import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export function Button({
  variant = "primary",
  children,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded focus:outline-none";
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-transparent text-gray-700 hover:bg-gray-100";
  return (
    <button type="button" className={`${base} ${styles}`} {...rest}>
      {children}
    </button>
  );
}

export default Button;
