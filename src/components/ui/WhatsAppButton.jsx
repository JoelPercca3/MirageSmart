import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

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
                        className="bg-white rounded-2xl shadow-xl p-4 max-w-[220px] border border-gray-100"
                    >
                        <button
                            onClick={() => setShowTooltip(false)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
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
                            className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 px-3 rounded-xl transition"
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
                className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-colors"
                aria-label="Contactar por WhatsApp"
            >
                {/* Icono WhatsApp SVG oficial */}
                <svg viewBox="0 0 32 32" className="w-8 h-8 fill-white">
                    <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.738 5.49 2.027 7.8L0 32l8.418-2.01A15.938 15.938 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.267 13.267 0 01-6.73-1.827l-.483-.287-4.997 1.193 1.237-4.863-.317-.5A13.267 13.267 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.273-9.927c-.398-.2-2.355-1.16-2.72-1.293-.366-.133-.632-.2-.898.2-.266.398-1.03 1.293-1.263 1.56-.233.266-.465.3-.863.1-.398-.2-1.681-.619-3.202-1.974-1.183-1.054-1.982-2.356-2.214-2.754-.233-.398-.025-.613.175-.812.18-.178.398-.465.598-.698.2-.233.266-.398.398-.664.133-.266.067-.498-.033-.698-.1-.2-.898-2.164-1.23-2.963-.324-.778-.654-.672-.898-.685-.233-.012-.498-.015-.764-.015s-.698.1-.964.398c-.266.3-1.03 1.006-1.03 2.454 0 1.449 1.063 2.85 1.21 3.048.148.2 2.09 3.19 5.063 4.476.708.306 1.26.488 1.69.625.71.226 1.357.194 1.868.118.57-.085 1.755-.717 2.003-1.41.248-.692.248-1.285.174-1.41-.074-.124-.274-.198-.573-.298z" />
                </svg>

                {/* Pulso verde */}
                <span className="absolute w-14 h-14 rounded-full bg-green-400 opacity-30 animate-ping" />
            </motion.button>
        </div>
    );
}