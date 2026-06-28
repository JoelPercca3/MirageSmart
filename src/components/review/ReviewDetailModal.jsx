import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Star, ThumbsUp, Share2, ShoppingCart } from "lucide-react";
import { timeAgo } from "../../utils/formatDate.js";
import { formatPrice } from "../../utils/formatPrice.js";

// Componente StarRow - VERSIÓN DARK
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

export default function ReviewDetailModal({
    isOpen,
    onClose,
    review,
    allReviews = [],
    productName = "",
    productPrice = 0,
    productImage = "",
    onAddToCart,
    onReviewChange
}) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    // Extraer imágenes de la reseña
    const images = useMemo(() => {
        if (!review?.imagenes) return [];
        const arr = Array.isArray(review.imagenes)
            ? review.imagenes
            : (() => {
                try { return JSON.parse(review.imagenes); } catch { return []; }
            })();
        return arr.filter((img) => img && typeof img === "string" && !img.startsWith("blob:"));
    }, [review]);

    // Encontrar índice de la reseña actual en todas las reseñas
    useEffect(() => {
        if (review && allReviews.length > 0) {
            const index = allReviews.findIndex((r) => r.id === review.id);
            if (index !== -1) {
                setCurrentReviewIndex(index);
            }
        }
    }, [review, allReviews]);

    // Resetear índice de imagen al cambiar de reseña
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [review]);

    // Navegar entre imágenes
    const nextImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Navegar entre reseñas
    const nextReview = useCallback(() => {
        if (allReviews.length > 0) {
            const nextIndex = (currentReviewIndex + 1) % allReviews.length;
            onReviewChange?.(allReviews[nextIndex]);
        }
    }, [allReviews, currentReviewIndex, onReviewChange]);

    const prevReview = useCallback(() => {
        if (allReviews.length > 0) {
            const prevIndex = (currentReviewIndex - 1 + allReviews.length) % allReviews.length;
            onReviewChange?.(allReviews[prevIndex]);
        }
    }, [allReviews, currentReviewIndex, onReviewChange]);

    // Cerrar con Escape
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    // Manejar click fuera
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Prevenir scroll del body
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen || !review) return null;

    const hasImages = images.length > 0;
    const showNav = hasImages && images.length > 1;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="relative bg-white rounded-lg w-full max-w-[1008px] max-h-[90vh] flex flex-col md:flex-row shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón cerrar */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                            aria-label="Cerrar"
                        >
                            <X size={20} />
                        </button>

                        {/* ── Sección de imagen (izquierda) ── */}
                        <div className="relative w-full md:w-1/2 bg-gray-100 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                            {hasImages ? (
                                <>
                                    <img
                                        src={images[currentImageIndex]}
                                        alt={`Foto de reseña ${currentImageIndex + 1}`}
                                        className="max-w-full max-h-[80vh] object-contain"
                                    />

                                    {/* Navegación entre imágenes */}
                                    {showNav && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                                            >
                                                <ChevronRight size={24} />
                                            </button>

                                            {/* Indicador de imágenes */}
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                                {images.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setCurrentImageIndex(idx)}
                                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex
                                                            ? "bg-white w-4"
                                                            : "bg-white/50 hover:bg-white/70"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* Contador de imágenes */}
                                    {showNav && (
                                        <div className="absolute top-4 right-16 px-2 py-1 bg-black/50 text-white text-xs rounded">
                                            {currentImageIndex + 1} / {images.length}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-gray-400 text-sm">Sin imágenes</div>
                            )}
                        </div>

                        {/* ── Sección de información (derecha) ── */}
                        <div className="flex-1 p-6 overflow-y-auto max-h-[90vh]">
                            {/* Encabezado del usuario */}
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 flex-shrink-0">
                                    {review.autor?.[0]?.toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center flex-wrap gap-2">
                                        <p className="text-sm font-medium text-gray-800">{review.autor}</p>
                                        <span className="text-xs text-gray-400">{timeAgo(review.created_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <StarRow rating={review.calificacion} size={16} />
                                        {review.calificacion >= 4 && (
                                            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                                Excelente
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Variante comprada */}
                            {review.variant_name && (
                                <div className="text-xs text-gray-500 mb-2">
                                    Compró: {review.variant_name}
                                </div>
                            )}

                            {/* Ajuste general */}
                            {review.fit && (
                                <div className="text-xs text-gray-500 mb-3">
                                    Ajuste general: {review.fit}
                                </div>
                            )}

                            {/* Título y comentario */}
                            {review.titulo && (
                                <h3 className="text-base font-semibold text-gray-900 mb-2">{review.titulo}</h3>
                            )}
                            {review.comentario && (
                                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                    {review.comentario}
                                </p>
                            )}

                            {/* Miniaturas de imágenes */}
                            {hasImages && (
                                <div className="mb-4">
                                    <p className="text-xs text-gray-400 mb-2">Fotos en esta reseña</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex
                                                    ? "border-gray-800"
                                                    : "border-transparent hover:border-gray-300"
                                                    }`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Miniatura ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Botones de interacción */}
                            <div className="flex items-center gap-6 mb-4 pb-4 border-b border-gray-100">
                                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                    <ThumbsUp size={18} />
                                    <span>Útil</span>
                                    <span className="text-xs text-gray-400">(0)</span>
                                </button>
                                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                    <Share2 size={18} />
                                    <span>Compartir</span>
                                </button>
                            </div>

                            {/* Producto relacionado */}
                            {productName && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-400 mb-2">Artículo comprado</p>
                                    <div className="flex items-center gap-3">
                                        {productImage && (
                                            <img
                                                src={productImage}
                                                alt={productName}
                                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-800 line-clamp-2">{productName}</p>
                                            {productPrice > 0 && (
                                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                                    {formatPrice(productPrice)}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => onAddToCart?.()}
                                            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm rounded-lg transition-colors flex items-center gap-1.5 flex-shrink-0"
                                        >
                                            <ShoppingCart size={16} />
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Navegación entre reseñas (flechas laterales) ── */}
                        {allReviews.length > 1 && (
                            <>
                                <button
                                    onClick={prevReview}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 ml-2 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors z-10 hidden md:block"
                                >
                                    <ChevronLeft size={28} />
                                </button>
                                <button
                                    onClick={nextReview}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors z-10 hidden md:block"
                                >
                                    <ChevronRight size={28} />
                                </button>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}