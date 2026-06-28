import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";
import { useState } from "react";

const GUIAS = {
    mujer: {
        label: "Mujer",
        columnas: ["Talla", "Busto (cm)", "Cintura (cm)", "Cadera (cm)", "Largo (cm)"],
        filas: [
            ["XS", "76-80", "58-62", "84-88", "155-160"],
            ["S", "80-84", "62-66", "88-92", "158-163"],
            ["M", "84-88", "66-70", "92-96", "160-165"],
            ["L", "88-94", "70-76", "96-102", "162-167"],
            ["XL", "94-100", "76-82", "102-108", "163-168"],
            ["XXL", "100-108", "82-90", "108-116", "164-169"],
        ],
    },
    hombre: {
        label: "Hombre",
        columnas: ["Talla", "Pecho (cm)", "Cintura (cm)", "Cadera (cm)", "Hombros (cm)"],
        filas: [
            ["XS", "82-86", "68-72", "86-90", "38-40"],
            ["S", "86-90", "72-76", "90-94", "40-42"],
            ["M", "90-96", "76-82", "94-100", "42-44"],
            ["L", "96-102", "82-88", "100-106", "44-46"],
            ["XL", "102-108", "88-94", "106-112", "46-48"],
            ["XXL", "108-116", "94-102", "112-120", "48-50"],
        ],
    },
    ninos: {
        label: "Niños",
        columnas: ["Talla", "Edad aprox.", "Altura (cm)", "Pecho (cm)", "Cintura (cm)"],
        filas: [
            ["90", "1-2 años", "85-95", "48-50", "46-48"],
            ["100", "2-3 años", "95-105", "50-52", "48-50"],
            ["110", "3-5 años", "105-115", "52-54", "50-52"],
            ["120", "5-7 años", "115-125", "54-58", "52-54"],
            ["130", "7-9 años", "125-135", "58-62", "54-56"],
            ["140", "9-11 años", "135-145", "62-66", "56-58"],
            ["150", "11-13 años", "145-155", "66-70", "58-60"],
            ["160", "13-15 años", "155-165", "70-76", "60-62"],
        ],
    },
    calzado: {
        label: "Calzado",
        columnas: ["Talla EU", "Talla US", "Talla UK", "Largo pie (cm)"],
        filas: [
            ["35", "5", "3", "22.0"],
            ["36", "6", "4", "22.7"],
            ["37", "6.5", "4.5", "23.3"],
            ["38", "7.5", "5.5", "24.0"],
            ["39", "8", "6", "24.7"],
            ["40", "9", "7", "25.3"],
            ["41", "9.5", "7.5", "26.0"],
            ["42", "10", "8", "26.7"],
            ["43", "11", "9", "27.3"],
            ["44", "12", "10", "28.0"],
        ],
    },
};

// ── Ilustraciones SVG ─────────────────────────────────────

function SVGBusto() {
    return (
        <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <ellipse cx="60" cy="40" rx="14" ry="16" fill="#FDDCDC" stroke="#E2A0A0" strokeWidth="1.5" />
            <path d="M30 75 Q35 55 46 52 Q52 75 60 78 Q68 75 74 52 Q85 55 90 75 L88 120 H32 Z" fill="#FDDCDC" stroke="#E2A0A0" strokeWidth="1.5" />
            <path d="M34 78 Q60 88 86 78" stroke="#1e1e2f" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="20" y1="78" x2="34" y2="78" stroke="#1e1e2f" strokeWidth="1.2" />
            <polygon points="20,75 20,81 14,78" fill="#1e1e2f" />
            <line x1="100" y1="78" x2="86" y2="78" stroke="#1e1e2f" strokeWidth="1.2" />
            <polygon points="100,75 100,81 106,78" fill="#1e1e2f" />
            <rect x="45" y="88" width="30" height="14" rx="7" fill="#1e1e2f" />
            <text x="60" y="98" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">BUSTO</text>
        </svg>
    );
}

function SVGCintura() {
    return (
        <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <ellipse cx="60" cy="40" rx="14" ry="16" fill="#FDE8CC" stroke="#F5C08A" strokeWidth="1.5" />
            <path d="M30 75 Q35 55 46 52 Q52 75 60 78 Q68 75 74 52 Q85 55 90 75 L88 120 H32 Z" fill="#FDE8CC" stroke="#F5C08A" strokeWidth="1.5" />
            <path d="M40 94 Q60 100 80 94" stroke="#1e1e2f" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="20" y1="94" x2="40" y2="94" stroke="#1e1e2f" strokeWidth="1.2" />
            <polygon points="20,91 20,97 14,94" fill="#1e1e2f" />
            <line x1="100" y1="94" x2="80" y2="94" stroke="#1e1e2f" strokeWidth="1.2" />
            <polygon points="100,91 100,97 106,94" fill="#1e1e2f" />
            <rect x="42" y="104" width="36" height="14" rx="7" fill="#1e1e2f" />
            <text x="60" y="114" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">CINTURA</text>
        </svg>
    );
}

function SVGCadera() {
    return (
        <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <ellipse cx="60" cy="40" rx="14" ry="16" fill="#D4EDDA" stroke="#85C99A" strokeWidth="1.5" />
            <path d="M30 75 Q35 55 46 52 Q52 75 60 78 Q68 75 74 52 Q85 55 90 75 L88 120 H32 Z" fill="#D4EDDA" stroke="#85C99A" strokeWidth="1.5" />
            <path d="M32 108 Q60 118 88 108" stroke="#1e1e2f" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="14" y1="108" x2="32" y2="108" stroke="#1e1e2f" strokeWidth="1.2" />
            <polygon points="14,105 14,111 8,108" fill="#1e1e2f" />
            <line x1="106" y1="108" x2="88" y2="108" stroke="#1e1e2f" strokeWidth="1.2" />
            <polygon points="106,105 106,111 112,108" fill="#1e1e2f" />
            <rect x="42" y="118" width="36" height="14" rx="7" fill="#1e1e2f" />
            <text x="60" y="128" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">CADERA</text>
        </svg>
    );
}

function SVGLargo() {
    return (
        <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <ellipse cx="60" cy="40" rx="14" ry="16" fill="#E0D4F7" stroke="#B59FE8" strokeWidth="1.5" />
            <path d="M30 75 Q35 55 46 52 Q52 75 60 78 Q68 75 74 52 Q85 55 90 75 L88 120 H32 Z" fill="#E0D4F7" stroke="#B59FE8" strokeWidth="1.5" />
            <line x1="100" y1="24" x2="100" y2="120" stroke="#1e1e2f" strokeWidth="1.5" strokeDasharray="4 2" />
            <polygon points="97,24 103,24 100,18" fill="#1e1e2f" />
            <polygon points="97,120 103,120 100,126" fill="#1e1e2f" />
            <line x1="88" y1="24" x2="100" y2="24" stroke="#1e1e2f" strokeWidth="1" />
            <line x1="88" y1="120" x2="100" y2="120" stroke="#1e1e2f" strokeWidth="1" />
            <rect x="44" y="72" width="32" height="14" rx="7" fill="#1e1e2f" />
            <text x="60" y="82" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">LARGO</text>
        </svg>
    );
}

function SVGPie() {
    return (
        <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M25 65 Q22 45 30 30 Q38 18 50 20 Q58 20 62 28 L68 28 Q75 28 80 35 Q90 40 92 52 Q94 62 88 68 Q82 74 70 72 L30 72 Q26 70 25 65 Z"
                fill="#FDE8CC" stroke="#F5C08A" strokeWidth="1.5" />
            <ellipse cx="50" cy="20" rx="5" ry="7" fill="#FDDCDC" stroke="#E2A0A0" strokeWidth="1" />
            <ellipse cx="61" cy="19" rx="4.5" ry="6.5" fill="#FDDCDC" stroke="#E2A0A0" strokeWidth="1" />
            <ellipse cx="71" cy="21" rx="4" ry="6" fill="#FDDCDC" stroke="#E2A0A0" strokeWidth="1" />
            <ellipse cx="80" cy="26" rx="3.5" ry="5.5" fill="#FDDCDC" stroke="#E2A0A0" strokeWidth="1" />
            <ellipse cx="87" cy="33" rx="3" ry="5" fill="#FDDCDC" stroke="#E2A0A0" strokeWidth="1" />
            <line x1="25" y1="82" x2="92" y2="82" stroke="#1e1e2f" strokeWidth="1.5" strokeDasharray="4 2" />
            <polygon points="25,79 25,85 19,82" fill="#1e1e2f" />
            <polygon points="92,79 92,85 98,82" fill="#1e1e2f" />
            <rect x="38" y="88" width="44" height="10" rx="5" fill="#1e1e2f" />
            <text x="60" y="96" textAnchor="middle" fill="white" fontSize="6.5" fontWeight="bold">LARGO PIE</text>
        </svg>
    );
}

const TIPS = [
    {
        titulo: "Busto / Pecho",
        desc: "Mide la parte más ancha del pecho, pasando la cinta por debajo de los brazos.",
        svg: <SVGBusto />,
        color: "bg-red-50 border-red-100",
    },
    {
        titulo: "Cintura",
        desc: "Mide la parte más estrecha de tu cintura, generalmente 2-3 cm sobre el ombligo.",
        svg: <SVGCintura />,
        color: "bg-orange-50 border-orange-100",
    },
    {
        titulo: "Cadera",
        desc: "Mide la parte más ancha de tu cadera, unos 20 cm por debajo de la cintura.",
        svg: <SVGCadera />,
        color: "bg-green-50 border-green-100",
    },
    {
        titulo: "Largo",
        desc: "Mide desde el hombro hasta donde quieras que llegue la prenda.",
        svg: <SVGLargo />,
        color: "bg-purple-50 border-purple-100",
    },
];

export default function SizeGuideModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("mujer");
    const [unit, setUnit] = useState("cm");
    const [showTips, setShowTips] = useState(false);

    const guia = GUIAS[activeTab];

    const convertir = (valor) => {
        if (unit === "cm" || isNaN(Number(valor.split("-")[0]))) return valor;
        return valor
            .split("-")
            .map((v) => (Number(v) / 2.54).toFixed(1))
            .join("-");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-[9998]"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-[9999] bg-white rounded-t-2xl shadow-2xl max-h-[92vh] flex flex-col md:top-1/2 md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-none md:max-w-2xl md:w-full"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <Ruler size={18} className="text-[#1e1e2f]" />
                                <h2 className="font-bold text-[#1e1e2f] text-base">Guía de tallas</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[#1e1e2f] hover:text-white rounded-full transition text-gray-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Contenido scrollable */}
                        <div className="overflow-y-auto flex-1 px-5 py-4">

                            {/* Tabs */}
                            <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
                                {Object.entries(GUIAS).map(([key, val]) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition ${activeTab === key
                                            ? "border-[#1e1e2f] bg-[#1e1e2f] text-white"
                                            : "border-gray-200 text-gray-500 hover:border-[#1e1e2f] hover:text-[#1e1e2f]"
                                            }`}
                                    >
                                        {val.label}
                                    </button>
                                ))}
                            </div>

                            {/* Toggle cm / pulgadas */}
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs text-gray-500">
                                    Todas las medidas en{" "}
                                    <span className="font-semibold text-[#1e1e2f]">
                                        {unit === "cm" ? "centímetros" : "pulgadas"}
                                    </span>
                                </p>
                                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                                    {["cm", "in"].map((u) => (
                                        <button
                                            key={u}
                                            onClick={() => setUnit(u)}
                                            className={`px-3 py-1 text-xs font-medium transition ${unit === u
                                                ? "bg-[#1e1e2f] text-white"
                                                : "bg-white text-gray-500 hover:bg-[#1e1e2f] hover:text-white"
                                                }`}
                                        >
                                            {u}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tabla */}
                            <div className="overflow-x-auto rounded-xl border border-gray-100 mb-5">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            {guia.columnas.map((col, i) => (
                                                <th
                                                    key={i}
                                                    className={`py-2.5 px-3 text-xs font-bold text-[#1e1e2f] whitespace-nowrap ${i === 0 ? "text-left" : "text-center"
                                                        }`}
                                                >
                                                    {col}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {guia.filas.map((fila, i) => (
                                            <tr
                                                key={i}
                                                className={`border-t border-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                                    }`}
                                            >
                                                {fila.map((celda, j) => (
                                                    <td
                                                        key={j}
                                                        className={`py-2.5 px-3 text-xs whitespace-nowrap ${j === 0
                                                            ? "font-bold text-[#1e1e2f]"
                                                            : "text-center text-gray-600"
                                                            }`}
                                                    >
                                                        {j === 0 ? (
                                                            <span className="inline-block bg-[#1e1e2f] text-white font-bold px-2 py-0.5 rounded text-xs">
                                                                {celda}
                                                            </span>
                                                        ) : (
                                                            convertir(celda)
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Banner cómo medirse — toggle */}
                            <button
                                onClick={() => setShowTips((s) => !s)}
                                className="w-full flex items-center justify-between bg-[#1e1e2f]/5 border border-[#1e1e2f]/20 rounded-xl px-4 py-3 mb-3 transition hover:bg-[#1e1e2f]/10"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">📏</span>
                                    <span className="text-xs font-semibold text-[#1e1e2f]">
                                        ¿Cómo tomarme las medidas?
                                    </span>
                                </div>
                                <span className="text-[#1e1e2f]/60 text-xs font-medium">
                                    {showTips ? "Ocultar ▲" : "Ver guía ▼"}
                                </span>
                            </button>

                            {/* Tips con SVG */}
                            <AnimatePresence>
                                {showTips && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            {TIPS.map((tip, i) => (
                                                <div
                                                    key={i}
                                                    className={`rounded-xl border overflow-hidden ${tip.color}`}
                                                >
                                                    <div className="w-full flex items-center justify-center p-4" style={{ height: "130px" }}>
                                                        {tip.svg}
                                                    </div>
                                                    <div className="px-3 pb-3">
                                                        <p className="text-xs font-bold text-[#1e1e2f] mb-1">
                                                            {tip.titulo}
                                                        </p>
                                                        <p className="text-xs text-gray-500 leading-relaxed">
                                                            {tip.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Tip especial calzado */}
                                        {activeTab === "calzado" && (
                                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-3 flex gap-3">
                                                <div className="w-20 h-16 flex-shrink-0">
                                                    <SVGPie />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-[#1e1e2f] mb-1">
                                                        Largo del pie
                                                    </p>
                                                    <p className="text-xs text-gray-600 leading-relaxed">
                                                        Apoya el pie sobre papel, marca el talón y el dedo más largo. Mide la distancia entre ambas marcas.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Consejo general */}
                                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex gap-2 mb-3">
                                            <span className="text-base flex-shrink-0">💡</span>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                <span className="font-semibold text-[#1e1e2f]">Consejo:</span> Si estás entre dos tallas, elige la mayor para mayor comodidad. Usa una cinta métrica flexible y mide sobre ropa ajustada.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <p className="text-xs text-gray-400 text-center pb-2">
                                Las medidas son aproximadas y pueden variar según el fabricante.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}