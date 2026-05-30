// src/components/ui/Accordion.jsx

import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn.js";

export default function Accordion({
  title,
  children,
  defaultOpen = false,
  className,
  titleClassName,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // IDs únicos para accesibilidad
  const uid = useId();
  const panelId = `accordion-panel-${uid}`;
  const buttonId = `accordion-btn-${uid}`;

  return (
    <div className={cn("border-b border-gray-100", className)}>
      <button
        id={buttonId}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center justify-between py-4 px-0 text-left hover:bg-gray-50/50 transition-colors group"
      >
        <span
          className={cn("font-medium text-gray-800 text-sm", titleClassName)}
        >
          {title}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0"
          aria-hidden="true"
        >
          <ChevronRight size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-gray-600 text-sm leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
