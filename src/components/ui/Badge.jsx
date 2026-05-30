// src/components/ui/Badge.jsx

import { cn } from "../../utils/cn.js";

const variants = {
  red: "bg-red-500 text-white",
  green: "bg-green-500 text-white",

  // FIX: yellow con texto oscuro
  yellow: "bg-yellow-400 text-yellow-900",

  gray: "bg-gray-200 text-gray-800",
  blue: "bg-blue-500 text-white",
};

export default function Badge({ children, variant = "red", className }) {
  return (
    <span
      className={cn(
        "inline-block text-xs font-bold px-2 py-0.5 rounded-full",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
