// src/components/product/ProductImages.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "../../utils/cn.js";

// Placeholder base64 para carga instantánea
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='1'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";

export default function ProductImages({ images, productName, onImageChange }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ backgroundPosition: "50% 50%" });
  const [fullscreen, setFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imageRef = useRef(null);

  // Procesar URL de imagen con diferentes tamaños (estilo Cloudinary/Falabella)
  const getImageUrl = (url, size = "medium") => {
    if (!url) return PLACEHOLDER_IMAGE;

    // Si es una URL de Cloudinary
    if (url.includes("cloudinary")) {
      const sizes = {
        thumb: "w_120,c_limit",
        medium: "w_800,c_limit",
        large: "w_1600,c_limit",
      };
      return url.replace("/upload/", `/upload/f_auto,q_auto/${sizes[size]}/`);
    }

    return url;
  };

  const imagesList =
    images?.length > 0 ? images : [{ url: PLACEHOLDER_IMAGE, es_principal: 1 }];

  // Precargar imágenes
  useEffect(() => {
    imagesList.forEach((img, idx) => {
      const imgUrl = getImageUrl(img.url, "medium");
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = imgUrl;
      document.head.appendChild(link);
    });
  }, []);

  // Control de teclado para modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!fullscreen) return;
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowLeft") {
        setSelectedImage(
          (prev) => (prev - 1 + imagesList.length) % imagesList.length,
        );
      }
      if (e.key === "ArrowRight") {
        setSelectedImage((prev) => (prev + 1) % imagesList.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreen, imagesList.length]);

  useEffect(() => {
    onImageChange?.(selectedImage);
  }, [selectedImage, onImageChange]);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({
      backgroundPosition: `${Math.min(Math.max(x, 0), 100)}% ${Math.min(Math.max(y, 0), 100)}%`,
    });
  };

  return (
    <>
      {/* FULLSCREEN MODAL (estilo Falabella) */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"
            onClick={() => setFullscreen(false)}
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-5 right-5 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition z-50"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(
                  (prev) => (prev - 1 + imagesList.length) % imagesList.length,
                );
              }}
              className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition"
              aria-label="Anterior"
            >
              <ChevronLeft size={28} />
            </button>

            <motion.img
              key={selectedImage}
              src={getImageUrl(imagesList[selectedImage]?.url, "large")}
              alt={`${productName} - Imagen ${selectedImage + 1}`}
              className="max-w-[95vw] max-h-[90vh] object-contain"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev + 1) % imagesList.length);
              }}
              className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition"
              aria-label="Siguiente"
            >
              <ChevronRight size={28} />
            </button>

            {/* Indicador de posición */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
              {selectedImage + 1} / {imagesList.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GALERÍA PRINCIPAL */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6">
        {/* MINIATURAS VERTICALES (estilo Falabella) */}
        {imagesList.length > 1 && (
          <div className="flex flex-row lg:flex-col gap-2 lg:w-20 overflow-x-auto lg:overflow-x-visible no-scrollbar">
            {imagesList.map((img, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setSelectedImage(idx)}
                onClick={() => setSelectedImage(idx)}
                className={cn(
                  "flex-shrink-0 w-16 h-16 lg:w-[72px] lg:h-[72px] border-2 transition-all duration-150 overflow-hidden rounded-md",
                  selectedImage === idx
                    ? "border-gray-800 shadow-sm"
                    : "border-gray-200 hover:border-gray-400",
                )}
                aria-label={`Ver imagen ${idx + 1}`}
              >
                <img
                  src={getImageUrl(img.url, "thumb")}
                  alt={`Miniatura ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </button>
            ))}
          </div>
        )}

        {/* IMAGEN PRINCIPAL CON ZOOM */}
        <div className="flex-1">
          <div
            ref={imageRef}
            className="relative w-full bg-white overflow-hidden cursor-crosshair rounded-lg"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onClick={() => setFullscreen(true)}
          >
            {/* Badge de zoom */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFullscreen(true);
              }}
              className="absolute bottom-3 right-3 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full transition"
              aria-label="Ampliar imagen"
            >
              <ZoomIn size={18} className="text-white" />
            </button>

            {/* Imagen principal */}
            <img
              src={getImageUrl(imagesList[selectedImage]?.url, "medium")}
              alt={productName}
              className="w-full h-auto object-contain"
              style={{ maxHeight: "500px", minHeight: "300px" }}
              onLoad={() => setIsLoading(false)}
            />

            {/* Skeleton mientras carga */}
            {isLoading && (
              <div className="absolute inset-0 shimmer flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin" />
              </div>
            )}

            {/* Efecto ZOOM (lupa) - estilo Falabella */}
            {isZooming && !isLoading && (
              <div
                className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-200"
                style={{
                  backgroundImage: `url(${getImageUrl(imagesList[selectedImage]?.url, "large")})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "250%",
                  backgroundPosition: zoomStyle.backgroundPosition,
                  opacity: isZooming ? 1 : 0,
                }}
              />
            )}
          </div>

          {/* Indicador de zoom */}
          <p className="text-center text-xs text-gray-400 mt-2">
            🔍 Pasa el mouse para ampliar | Click para ver en pantalla completa
          </p>
        </div>
      </div>
    </>
  );
}
