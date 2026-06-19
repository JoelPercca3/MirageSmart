// src/components/ui/Button.jsx

import { cn } from "../../utils/cn.js";

const variants = {
  primary: "bg-red-500 hover:bg-red-600 text-white",
  dark: "bg-gray-900 hover:bg-gray-800 text-white",

  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  outline: "border border-red-500 text-red-500 hover:bg-red-50",
  ghost: "hover:bg-gray-100 text-gray-700",
  danger: "bg-red-600 hover:bg-red-700 text-white",

};


const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-lg",
  icon: "p-2",
};

function SpinnerIcon({ className }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
      />

      <path
        fill="currentColor"
        className="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  loading = false,
  disabled,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
        "transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <SpinnerIcon className="h-4 w-4" />}

      {children}
    </button>
  );
}
