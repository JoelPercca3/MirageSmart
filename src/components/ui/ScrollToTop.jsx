import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    // FIX: passive:true le dice al browser que nunca llamamos preventDefault
    // → puede optimizar el scroll sin esperar a este listener.
    // FIX: ticking evita que setVisible() se llame 60 veces/seg — solo
    // se ejecuta una vez por frame de animación (requestAnimationFrame).
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 400);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          // FIX: type="button" explícito + aria-label descriptivo
          type="button"
          aria-label="Volver al inicio de la página"
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        >
          <ChevronUp size={22} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
