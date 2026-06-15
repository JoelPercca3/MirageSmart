import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "51944174400"; // ← cambia por tu número peruano
const WHATSAPP_MESSAGE = "Hola! Estoy interesado en sus productos 😊";

export default function WhatsAppButton() {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleClick = () => {
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl shadow-xl p-4 max-w-[220px] border border-gray-100 relative"
                    >
                        <button
                            onClick={() => setShowTooltip(false)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={14} />
                        </button>
                        <p className="text-xs font-bold text-gray-800 mb-1">
                            ¿Necesitas ayuda? 👋
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Escríbenos por WhatsApp y te respondemos al instante.
                        </p>
                        <button
                            onClick={handleClick}
                            className="mt-3 w-full bg-[#25D366] hover:bg-[#20B859] text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors"
                        >
                            Iniciar chat →
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Botón principal */}
            <motion.button
                onClick={() => setShowTooltip((prev) => !prev)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-14 h-14 bg-[#25D366] hover:bg-[#20B859] rounded-full shadow-lg flex items-center justify-center transition-colors relative"
                aria-label="Contactar por WhatsApp"
            >
                {/* Icono WhatsApp usando react-icons */}
                <FaWhatsapp className="w-7 h-7 text-white" />

                {/* Pulso verde - efecto de notificación */}
                <span className="absolute inset-0 w-full h-full rounded-full bg-[#25D366] opacity-40 animate-ping" />
            </motion.button>
        </div>
    );
}