// src/components/ui/Modal.jsx

import { useEffect, useRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) {
  const titleId = useId();

  const closeRef = useRef(null);

  // Guardar scroll position
  const scrollYRef = useRef(0);

  // Bloqueo de scroll
  useEffect(() => {
    if (!isOpen) return;

    scrollYRef.current = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = "100%";
    document.body.style.overflowY = "scroll";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";

      window.scrollTo(0, scrollYRef.current);
    };
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [isOpen, onClose]);

  // Focus automático
  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{
              scale: 0.95,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.95,
              opacity: 0,
            }}
            transition={{ duration: 0.2 }}
            className={`relative bg-white rounded-2xl shadow-xl w-full ${sizes[size]} z-10`}
          >
            <div className="flex items-center justify-between p-5 border-b">
              <h3 id={titleId} className="text-lg font-semibold text-gray-800">
                {title}
              </h3>

              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Cerrar modal"
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} className="text-gray-500" aria-hidden="true" />
              </button>
            </div>

            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
