// components/review/ReviewsModal.jsx
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ChevronDown, Camera, ThumbsUp } from "lucide-react";
import { timeAgo } from "../../utils/formatDate.js";

// Componente StarRow reutilizable
const StarRow = ({ rating, size = 16 }) => (
    <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={size}
                className={
                    i < Math.round(rating)
                        ? "fill-gray-800 text-gray-800 dark:fill-gray-900 dark:text-gray-900"
                        : "text-gray-300 dark:text-gray-600"
                }
            />
        ))}
    </div>
);
// Componente ReviewCard para el modal
const ReviewCardModal = ({ rev, onClick }) => {
    const images = useMemo(() => {
        if (!rev.imagenes) return [];
        const arr = Array.isArray(rev.imagenes)
            ? rev.imagenes
            : (() => {
                try { return JSON.parse(rev.imagenes); } catch { return []; }
            })();
        return arr.filter((img) => img && typeof img === "string" && !img.startsWith("blob:"));
    }, [rev.imagenes]);

    return (
        <div
            className="py-4 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50/50 transition-colors rounded-lg -mx-2 px-2"
            onClick={onClick}
        >
            {/* Header: avatar + nombre + fecha */}
            <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 flex-shrink-0">
                    {rev.autor?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                        <p className="text-sm font-medium text-gray-800 truncate">{rev.autor}</p>
                        <span className="text-xs text-gray-400">{timeAgo(rev.created_at)}</span>
                    </div>
                    <StarRow rating={rev.calificacion} size={14} />
                </div>
            </div>

            {/* Etiqueta de "Excelente" si rating es alto */}
            {rev.calificacion >= 4 && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gradient-to-r from-orange-100 to-orange-50 mb-2">
                    <span className="text-xs font-bold text-orange-600">Excelente</span>
                </div>
            )}

            {/* Título y comentario */}
            {rev.titulo && <p className="text-sm font-medium text-gray-800 mb-1">{rev.titulo}</p>}
            {rev.comentario && <p className="text-sm text-gray-600 leading-relaxed">{rev.comentario}</p>}

            {/* Imágenes */}
            {images.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Foto de reseña ${idx + 1}`}
                            loading="lazy"
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition"
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                    ))}
                </div>
            )}

            {/* Botón de útil */}
            <div className="flex items-center gap-4 mt-3">
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition">
                    <ThumbsUp size={14} />
                    <span>Útil</span>
                    <span className="text-gray-300">(0)</span>
                </button>
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition">
                    Compartir
                </button>
            </div>
        </div>
    );
};

// Filtros rápidos predefinidos
const QUICK_FILTERS = [
    { id: "all", label: "Todas" },
    { id: "5", label: "5 estrellas" },
    { id: "4", label: "4 estrellas" },
    { id: "3", label: "3 estrellas" },
    { id: "2", label: "2 estrellas" },
    { id: "1", label: "1 estrella" },
];

const SORT_OPTIONS = [
    { id: "recent", label: "Más recientes" },
    { id: "highest", label: "Calificación más alta" },
    { id: "lowest", label: "Calificación más baja" },
    { id: "helpful", label: "Más útiles" },
];

const TAG_FILTERS = [
    { id: "with_photos", label: "Fotos/Videos" },
    { id: "recommended", label: "Recomendado" },
    { id: "verified", label: "Compra verificada" },
];

export default function ReviewsModal({
    isOpen,
    onClose,
    reviews = [],
    productName = "",
    onReviewClick // <-- Nueva prop
}) {
    // ✅ TODOS LOS HOOKS EN EL NIVEL SUPERIOR, SIN CONDICIONES
    const [selectedRating, setSelectedRating] = useState("all");
    const [sortBy, setSortBy] = useState("recent");
    const [activeTags, setActiveTags] = useState([]);
    const [showSortMenu, setShowSortMenu] = useState(false);

    // ✅ useEffect en el nivel superior
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    // ✅ useMemo en el nivel superior (no condicional)
    const filteredReviews = useMemo(() => {
        let filtered = [...reviews];

        // Filtrar por calificación
        if (selectedRating !== "all") {
            const ratingNum = parseInt(selectedRating);
            filtered = filtered.filter((r) => Math.round(r.calificacion) === ratingNum);
        }

        // Filtrar por tags (simplificado)
        if (activeTags.includes("with_photos")) {
            filtered = filtered.filter((r) => {
                const images = Array.isArray(r.imagenes) ? r.imagenes : (() => {
                    try { return JSON.parse(r.imagenes); } catch { return []; }
                })();
                return images.length > 0;
            });
        }

        // Ordenar
        switch (sortBy) {
            case "recent":
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case "highest":
                filtered.sort((a, b) => b.calificacion - a.calificacion);
                break;
            case "lowest":
                filtered.sort((a, b) => a.calificacion - b.calificacion);
                break;
            case "helpful":
                // Simulado - podrías tener un campo de "likes"
                break;
            default:
                break;
        }

        return filtered;
    }, [reviews, selectedRating, sortBy, activeTags]);

    // ✅ useMemo en el nivel superior (no condicional)
    const ratingStats = useMemo(() => {
        const total = reviews.length;
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((r) => {
            const rounded = Math.round(r.calificacion);
            if (rounded >= 1 && rounded <= 5) counts[rounded]++;
        });
        return { total, counts };
    }, [reviews]);

    // ✅ useMemo en el nivel superior (no condicional)
    const averageRating = useMemo(() => {
        if (reviews.length === 0) return 0;
        return reviews.reduce((acc, r) => acc + r.calificacion, 0) / reviews.length;
    }, [reviews]);

    // ✅ useEffect para manejar Escape (en el nivel superior)
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    // ✅ Funciones auxiliares (no son Hooks)
    const getPercentage = (count) => {
        return ratingStats.total > 0 ? (count / ratingStats.total) * 100 : 0;
    };

    const toggleTag = (tagId) => {
        setActiveTags((prev) =>
            prev.includes(tagId)
                ? prev.filter((t) => t !== tagId)
                : [...prev, tagId]
        );
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // ✅ SI isOpen ES FALSE, RETORNAMOS NULL PERO DESPUÉS DE TODOS LOS HOOKS
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="relative bg-white rounded-lg w-full max-w-[640px] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Reseñas de {productName || "artículos"}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Cerrar"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        {/* Contenido scrollable */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {/* Resumen de calificaciones */}
                            <div className="flex items-start gap-6 mb-6 pb-4 border-b border-gray-100">
                                <div className="text-center flex-shrink-0">
                                    <div className="text-3xl font-bold text-gray-900">
                                        {averageRating.toFixed(1)}
                                    </div>
                                    <div className="flex justify-center mt-1">
                                        <StarRow rating={averageRating} size={16} />
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">{reviews.length} reseñas</div>
                                </div>

                                <div className="flex-1 space-y-1">
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setSelectedRating(selectedRating === String(star) ? "all" : String(star))}
                                            className={`w-full flex items-center gap-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 px-1 py-0.5 rounded transition-colors ${selectedRating === String(star) ? "bg-blue-50 dark:bg-blue-900/30" : ""
                                                }`}
                                        >
                                            <span className="text-gray-600 dark:text-gray-400 w-6 text-right">{star}</span>
                                            <Star
                                                size={12}
                                                className="fill-gray-800 text-gray-800 dark:fill-gray-300 dark:text-gray-300"
                                            />
                                            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gray-800 dark:bg-gray-300 rounded-full transition-all duration-300"
                                                    style={{ width: `${getPercentage(ratingStats.counts[star])}%` }}
                                                />
                                            </div>
                                            <span className="text-gray-400 dark:text-gray-500 w-8 text-right">{ratingStats.counts[star]}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filtros rápidos - etiquetas tipo chips */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {QUICK_FILTERS.map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setSelectedRating(filter.id)}
                                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${selectedRating === filter.id
                                                ? "border-gray-800 bg-gray-900 text-white"
                                                : "border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tags y ordenamiento */}
                            <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                                <div className="flex flex-wrap gap-2">
                                    {TAG_FILTERS.map((tag) => (
                                        <button
                                            key={tag.id}
                                            onClick={() => toggleTag(tag.id)}
                                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${activeTags.includes(tag.id)
                                                    ? "border-gray-800 bg-gray-100 text-gray-800"
                                                    : "border-gray-200 text-gray-500 hover:border-gray-400"
                                                }`}
                                        >
                                            {tag.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative ml-auto">
                                    <button
                                        onClick={() => setShowSortMenu(!showSortMenu)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-full hover:border-gray-400 transition-colors"
                                    >
                                        {SORT_OPTIONS.find((s) => s.id === sortBy)?.label || "Ordenar"}
                                        <ChevronDown size={14} className={`transition-transform ${showSortMenu ? "rotate-180" : ""}`} />
                                    </button>

                                    {showSortMenu && (
                                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                                            {SORT_OPTIONS.map((option) => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => {
                                                        setSortBy(option.id);
                                                        setShowSortMenu(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition ${sortBy === option.id ? "text-gray-900 font-medium" : "text-gray-600"
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Lista de reseñas - ahora con onClick */}
                            <div className="space-y-1">
                                {filteredReviews.length > 0 ? (
                                    filteredReviews.map((rev) => (
                                        <ReviewCardModal
                                            key={rev.id}
                                            rev={rev}
                                            onClick={() => onReviewClick?.(rev)}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-400 text-sm">
                                        No hay reseñas con estos filtros
                                    </div>
                                )}
                            </div>
                        </div> {/* ← ESTE ES EL CIERRE QUE FALTABA */}

                        {/* Footer con contador */}
                        <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400 flex-shrink-0 bg-gray-50/50">
                            Mostrando {filteredReviews.length} de {reviews.length} reseñas
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}