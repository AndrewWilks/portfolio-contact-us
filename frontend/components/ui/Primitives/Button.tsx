import type React from "react";
import Spinner from "./Spinner.tsx";
import * as LucideIcons from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "accent"
    | "muted"
    | "danger"
    | "success"
    | "outline"
    | "link";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  icon?: keyof typeof LucideIcons;
  iconPosition?: "left" | "right";
}

function getVariantStyles(variant: ButtonProps["variant"]) {
  switch (variant) {
    case "primary":
      return "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-400 dark:text-white dark:hover:bg-blue-500";
    case "secondary":
      return "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600";
    case "ghost":
      return "bg-transparent text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800";
    case "accent":
      return "bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-400 dark:text-white dark:hover:bg-orange-500";
    case "muted":
      return "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700";
    case "danger":
      return "bg-red-500 text-white hover:bg-red-600 dark:bg-red-800 dark:text-white dark:hover:bg-red-700";
    case "success":
      return "bg-green-500 text-white hover:bg-green-600 dark:bg-green-500 dark:text-white dark:hover:bg-green-600";
    case "outline":
      return "bg-transparent border border-gray-300 text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800";
    case "link":
      return "bg-transparent underline text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300";
    default:
      return "bg-transparent";
  }
}

function getSizeStyles(size: ButtonProps["size"]) {
  switch (size) {
    case "small":
      return "px-2 py-1";
    case "large":
      return "px-6 py-3";
    default:
      return "px-4 py-2";
  }
}

function getTextSize(size: ButtonProps["size"]) {
  switch (size) {
    case "small":
      return "text-sm";
    case "large":
      return "text-lg";
    default:
      return "text-base";
  }
}

function getSpanPadding(size: ButtonProps["size"]) {
  switch (size) {
    case "small":
      return "pb-0 pt-0";
    case "large":
      return "pb-1 pt-1";
    default:
      return "pb-0.5 pt-0.5";
  }
}

export function Button({
  variant = "primary",
  size = "medium",
  children,
  className = "",
  loading = false,
  disabled,
  icon,
  iconPosition = "left",
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded focus:outline-none gap-2 font-medium transition-colors duration-150 ease-in-out";
  const styles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);
  const textSize = getTextSize(size);
  const spanPadding = getSpanPadding(size);

  const isDisabled = disabled || loading;

  const buttonType =
    (rest.type as "submit" | "reset" | "button" | undefined) ?? "button";

  const spinnerSize =
    size === "small" ? "w-3 h-3" : size === "large" ? "w-5 h-5" : "w-4 h-4";

  const iconSize = size === "small" ? 12 : size === "large" ? 20 : 16;

  let iconElement: React.ReactNode = null;
  if (icon) {
    if (typeof icon === "string") {
      // Assume lucide-react is imported
      const IconComponent = LucideIcons[
        icon as keyof typeof LucideIcons
      ] as React.ComponentType<LucideIcons.LucideProps>;
      if (IconComponent) {
        iconElement = (
          <IconComponent size={iconSize} className="text-current" />
        );
      }
    } else {
      iconElement = icon;
    }
  }

  return (
    <button
      type={buttonType}
      aria-busy={loading ? true : undefined}
      disabled={isDisabled}
      className={`${base} ${sizeStyles} ${styles} ${
        isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${className}`}
      {...rest}
    >
      {iconPosition === "left" && iconElement}
      {loading ? <Spinner className={`${spinnerSize} text-current`} /> : null}
      {children && (
        <span
          aria-hidden={loading ? true : undefined}
          className={`leading-none h-fit ${spanPadding} ${textSize}`}
        >
          {children}
        </span>
      )}
      {iconPosition === "right" && iconElement}
    </button>
  );
}

export default Button;
