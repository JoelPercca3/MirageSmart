// src/components/product/ProductVariants.jsx
import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "../../utils/cn.js";

// Componente Tooltip simple (estilo Falabella)
function VariantTooltip({ content, children }) {
  return (
    <div className="relative inline-flex items-center group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-10 pointer-events-none">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
      </div>
    </div>
  );
}

export default function ProductVariants({
  variants,
  selectedVariant,
  onVariantChange,
}) {
  const [hoveredVariant, setHoveredVariant] = useState(null);

  if (!variants?.length) return null;

  // Agrupar variantes por atributo
  const variantGroups = {};
  variants.forEach((variant) => {
    const options =
      typeof variant.opciones === "string"
        ? JSON.parse(variant.opciones)
        : variant.opciones || {};

    Object.entries(options).forEach(([key, value]) => {
      if (!variantGroups[key]) variantGroups[key] = [];
      if (!variantGroups[key].includes(value)) variantGroups[key].push(value);
    });
  });

  return (
    <div className="space-y-5">
      {Object.entries(variantGroups).map(([attribute, values]) => (
        <div key={attribute}>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium text-gray-700 capitalize">
              {attribute}
            </p>
            <VariantTooltip
              content={`Selecciona el ${attribute} que prefieras`}
            >
              <HelpCircle size={14} className="text-gray-400 cursor-help" />
            </VariantTooltip>
          </div>

          <div className="flex flex-wrap gap-2">
            {values.map((value) => {
              const variant = variants.find((v) => {
                const opts =
                  typeof v.opciones === "string"
                    ? JSON.parse(v.opciones)
                    : v.opciones || {};
                return opts[attribute] === value;
              });

              const isSelected = selectedVariant?.id === variant?.id;
              const isOutOfStock = variant?.stock === 0;
              const isHovered = hoveredVariant === variant?.id;

              return (
                <button
                  key={value}
                  disabled={isOutOfStock}
                  onClick={() => onVariantChange(isSelected ? null : variant)}
                  onMouseEnter={() => setHoveredVariant(variant?.id)}
                  onMouseLeave={() => setHoveredVariant(null)}
                  className={cn(
                    "px-4 py-1.5 text-sm border transition-all duration-150 rounded-md",
                    isSelected
                      ? "border-gray-800 bg-gray-50 text-gray-900 shadow-sm"
                      : "border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50",
                    isOutOfStock && "opacity-50 cursor-not-allowed bg-gray-100",
                    isHovered &&
                      !isSelected &&
                      !isOutOfStock &&
                      "border-gray-400",
                  )}
                >
                  {value}
                  {isOutOfStock && (
                    <span className="ml-2 text-xs text-gray-400">
                      (Sin stock)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
