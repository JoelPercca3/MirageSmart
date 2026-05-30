// src/components/ui/Input.jsx

import { forwardRef, useId } from "react";
import { cn } from "../../utils/cn.js";

const Input = forwardRef(
  ({ label, error, className, id: idProp, ...props }, ref) => {
    // ID automático único
    const autoId = useId();
    const id = idProp ?? `input-${autoId}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border text-sm transition-all outline-none",
            "border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100",
            error && "border-red-400 focus:ring-red-100",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />

        {error && (
          <p
            id={`${id}-error`}
            className="mt-1 text-xs text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
