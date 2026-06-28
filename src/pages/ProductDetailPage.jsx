import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import SizeGuideModal from "../components/product/SizeGuideModal.jsx";

import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  HelpCircle,
  Check,
  X,
  ChevronDown
} from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";
import { useProduct, useRelatedProducts, useProductReviews } from "../hooks/useProducts.js";
import { useAddToCart } from "../hooks/useCart.js";
import { useToggleWishlist } from "../hooks/useWishlist.js";
import { categoryAPI } from "../api/category.api.js";

import ProductZoom from "../components/ui/ProductZoom";
import ProductCard from "../components/product/ProductCard.jsx";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import ReviewsModal from "../components/review/ReviewsModal.jsx";
import ReviewDetailModal from "../components/review/ReviewDetailModal.jsx";

import { formatPrice } from "../utils/formatPrice.js";
import { timeAgo } from "../utils/formatDate.js";
import useAuthStore from "../store/useAuthStore.js";

// ─── Constantes ───────────────────────────────────────────────────────────────

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";

const CLOUDINARY_TRANSFORMS = {
  thumb: "w_300,h_400,c_limit,f_webp,q_85",
  small: "w_450,h_600,c_limit,f_webp,q_88",
  medium: "w_700,h_933,c_limit,f_webp,q_90",
  large: "w_1000,h_1333,c_limit,f_webp,q_93",
  xl: "w_1350,h_1800,c_limit,f_webp,q_95",
};

const COLOR_HEX = {
  rojo: "#e53e3e",
  azul: "#3182ce",
  negro: "#1a202c",
  blanco: "#f7fafc",
  verde: "#38a169",
  amarillo: "#ecc94b",
  rosa: "#ed64a6",
  rosado: "#ed64a6",
  morado: "#805ad5",
  gris: "#a0aec0",
  naranja: "#ed8936",
  beige: "#c8a876",
  cafe: "#7b341e",
  marron: "#7b341e",
};

const GUARANTEES = [
  { icon: Truck, text: "Despacho a domicilio", tooltip: "Entrega en 3-5 días hábiles" },
  { icon: Shield, text: "Compra 100% segura", tooltip: "Tus datos están protegidos" },
  { icon: RotateCcw, text: "30 días", tooltip: "Cambios y devoluciones gratuitas" },
];

// ─── Utilidades ───────────────────────────────────────────────────────────────

export function getImageUrl(url, size = "medium") {
  if (!url) return PLACEHOLDER_IMAGE;
  if (!url.includes("cloudinary")) {
    return url.startsWith("http") ? url : `http://localhost:4000${url}`;
  }
  const transform = CLOUDINARY_TRANSFORMS[size] ?? CLOUDINARY_TRANSFORMS.medium;
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return url;
  return `${url.substring(0, uploadIndex + 8)}${transform}/${url.substring(uploadIndex + 8)}`;
}

function parseOpts(raw) {
  if (!raw) return {};
  if (typeof raw === "object") return raw;
  try { return JSON.parse(raw); } catch { return {}; }
}

function calcPrecio(product, variant) {
  const base = product.precio_oferta != null && product.precio_oferta !== ""
    ? Number(product.precio_oferta)
    : Number(product.precio_base);
  return base + Number(variant?.precio_extra ?? 0);
}

function calcMaxStock(product, variant) {
  if (product.variants?.length > 0) return variant?.stock ?? 0;
  return product.stock_total ?? 99;
}

// ─── Sub-componentes puros ────────────────────────────────────────────────────

function StarRow({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating)
              ? "fill-gray-800 text-gray-800 dark:fill-gray-900 dark:text-gray-900" // Estrellas llenas oscuras
              : "text-gray-300 dark:text-gray-600" // Estrellas vacías
          }
        />
      ))}
    </div>
  );
}

function Accordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 px-0 text-left hover:bg-gray-50/50 transition-colors group"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-800 text-sm md:text-base">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 group-hover:text-gray-600 transition-colors"
        >
          <ChevronRight size={18} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-gray-600 text-sm leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Tooltip({ children, content }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-flex items-center group">
      <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)} className="cursor-help">
        {children}
      </div>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10 pointer-events-none"
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuantitySelector({ value, max, onChange }) {
  return (
    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" // ← AÑADIDO
      >
        <Minus size={16} />
      </button>
      <span className="w-12 text-center text-sm font-medium" aria-live="polite">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" // ← AÑADIDO
        aria-label="Aumentar cantidad"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

function ReviewCard({ rev, onClick }) {
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
      className="pb-2 border-b border-gray-300 cursor-pointer hover:bg-gray-50/50 transition-colors rounded-lg -mx-2 px-2 py-1"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700" aria-hidden="true">
          {rev.autor?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{rev.autor}</p>
          <p className="text-xs text-gray-400">{timeAgo(rev.created_at)}</p>
        </div>
        <div className="ml-auto">
          <StarRow rating={rev.calificacion} size={12} />
        </div>
      </div>
      {rev.titulo && <p className="text-sm font-medium text-gray-700 mb-1">{rev.titulo}</p>}
      {rev.comentario && <p className="text-sm text-gray-600 leading-relaxed">{rev.comentario}</p>}
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
    </div>
  );
}

// ─── Sección: Todas las imágenes del producto ─────────────────────────────────
// ─── Sección: Todas las imágenes del producto (VERSIÓN VERTICAL) ─────────────

// ─── Sección: Todas las imágenes del producto (UNA COLUMNA) ─────────────────

// ─── Sección: Todas las imágenes del producto (UNA COLUMNA) ─────────────────

// ─── Sección: Todas las imágenes del producto (SIN ESPACIOS EN BLANCO) ──────

function ProductImageGallery({ images, getImageUrl, productName }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const PREVIEW_COUNT = 3;

  const validImages = useMemo(() => {
    return images?.filter(img => img?.url) ?? [];
  }, [images]);

  if (validImages.length <= 1) return null;

  const previewImages = validImages.slice(0, PREVIEW_COUNT);
  const hiddenImages = validImages.slice(PREVIEW_COUNT);
  const hasMore = hiddenImages.length > 0;

  const getImageStyle = () => ({
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    display: 'block',
    backgroundColor: 'transparent',
  });

  const openModal = (img) => {
    setSelectedImage(img);
    setIsModalOpen(true);
  };

  return (
    <div className="mt-10 pt-6 border-t border-gray-100">


      <div className="flex flex-col gap-1">
        {/* Primeras imágenes del preview (todas menos la última) */}
        {previewImages.slice(0, PREVIEW_COUNT - 1).map((img, index) => (
          <div
            key={img.id || index}
            className="overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => openModal(img)}
          >
            <img
              src={getImageUrl(img.url, "xl")}
              alt={`${productName} - imagen ${index + 1}`}
              style={getImageStyle()}
              loading="lazy"
              className="w-full h-auto"
            />
          </div>
        ))}

        {/* Última imagen del preview con fade encima */}
        {previewImages.length >= PREVIEW_COUNT && (
          <div
            className="relative overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => openModal(previewImages[PREVIEW_COUNT - 1])}
          >
            <img
              src={getImageUrl(previewImages[PREVIEW_COUNT - 1].url, "xl")}
              alt={`${productName} - imagen ${PREVIEW_COUNT}`}
              style={getImageStyle()}
              loading="lazy"
              className="w-full h-auto"
            />
            {/* Overlay de fade — solo si hay más imágenes y no está expandido */}
            {hasMore && !isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
          </div>
        )}

        {/* Botón "Ver más" */}
        {hasMore && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center justify-center gap-2 w-full py-3 mt-1 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ChevronDown size={18} className="text-gray-400" />
            Ver más ({hiddenImages.length})
          </button>
        )}

        {/* Imágenes ocultas — aparecen al expandir */}
        {isExpanded && hiddenImages.map((img, index) => (
          <div
            key={img.id || index}
            className="overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => openModal(img)}
          >
            <img
              src={getImageUrl(img.url, "xl")}
              alt={`${productName} - imagen ${PREVIEW_COUNT + index + 1}`}
              style={getImageStyle()}
              loading="lazy"
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>


      {/* Modal */}
      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition z-50"
          >
            <X size={24} />
          </button>

          <motion.img
            key={selectedImage.id}
            src={getImageUrl(selectedImage.url, "xl")}
            alt={`${productName} - ampliada`}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Navegación */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const currentIndex = validImages.findIndex(img => img.id === selectedImage.id);
              const prevIndex = (currentIndex - 1 + validImages.length) % validImages.length;
              setSelectedImage(validImages[prevIndex]);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition z-50"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const currentIndex = validImages.findIndex(img => img.id === selectedImage.id);
              const nextIndex = (currentIndex + 1) % validImages.length;
              setSelectedImage(validImages[nextIndex]);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition z-50"
          >
            <ChevronRight size={24} />
          </button>

          {/* Contador */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
            {validImages.findIndex(img => img.id === selectedImage.id) + 1} / {validImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
// ─── Sección: Variantes ───────────────────────────────────────────────────────

function TallaSelector({ variants, selectedVariant, onSelect, onSizeGuide }) {
  const tallas = useMemo(() => [
    ...new Set(variants.map((v) => parseOpts(v.opciones).Talla).filter(Boolean)),
  ], [variants]);

  if (!tallas.length) return null;

  const selectedOpts = parseOpts(selectedVariant?.opciones);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-800">Talla</p>
        <button
          onClick={onSizeGuide}
          className="text-xs rounded-none bg-blue-300 w-28 p-1 text-gray-900 hover:text-black font-medium cursor-pointer">Guía de tallas</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tallas.map((talla) => {
          const matching = variants.filter((v) => parseOpts(v.opciones).Talla === talla);
          const hasStock = matching.some((v) => v.stock > 0);
          const isSelected = selectedOpts.Talla === talla;

          return (
            <button
              key={talla}
              disabled={!hasStock}
              aria-pressed={isSelected}
              onClick={() => {
                const next =
                  (selectedOpts.Color
                    ? matching.find((v) => parseOpts(v.opciones).Color === selectedOpts.Color && v.stock > 0)
                    : null) ?? matching.find((v) => v.stock > 0);
                if (next) onSelect(next);
              }}
              className={`min-w-[48px] px-4 py-2 text-sm border rounded-md transition-all duration-150 font-medium cursor-pointer // ← AÑADIDO
                ${isSelected ? "border-gray-800 bg-orange-100 text-gray-900 shadow-sm" : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"}
                ${!hasStock ? "opacity-50 cursor-not-allowed bg-gray-100 line-through" : ""}`}
            >
              {talla}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ColorSelector({ variants, selectedVariant, images, onSelect }) {
  const selectedOpts = parseOpts(selectedVariant?.opciones);

  const colores = useMemo(() => [
    ...new Set(variants.map((v) => parseOpts(v.opciones).Color).filter(Boolean)),
  ], [variants]);

  const swatchImageMap = useMemo(() => {
    const map = {};
    for (const color of colores) {
      const variant = variants.find((v) => parseOpts(v.opciones).Color === color);
      if (variant) {
        const img = images?.find((img) => img.variant_id === variant.id);
        map[color] = img?.url ?? null;
      }
    }
    return map;
  }, [colores, variants, images]);

  if (!colores.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-700">Color</p>
        <span className="text-xs text-gray-500">{selectedOpts.Color ?? ""}</span>
      </div>
      <div className="flex flex-wrap gap-4">
        {colores.map((color) => {
          const matching = variants.filter((v) => parseOpts(v.opciones).Color === color);
          const hasStock = selectedOpts.Talla
            ? matching.some((v) => parseOpts(v.opciones).Talla === selectedOpts.Talla && v.stock > 0)
            : matching.some((v) => v.stock > 0);
          const isSelected = selectedOpts.Color === color;
          const swatchUrl = swatchImageMap[color];
          const hexColor = COLOR_HEX[color.toLowerCase()] ?? "#cbd5e0";

          return (
            <button
              key={color}
              disabled={!hasStock}
              aria-pressed={isSelected}
              aria-label={`Color ${color}${!hasStock ? " – agotado" : ""}`}
              onClick={() => {
                const next =
                  (selectedOpts.Talla
                    ? matching.find((v) => parseOpts(v.opciones).Talla === selectedOpts.Talla && v.stock > 0)
                    : null) ?? matching.find((v) => v.stock > 0);
                if (next) onSelect(next);
              }}
              className="flex flex-col items-center gap-1.5 transition-all duration-150 group"
            >
              <div className="relative">
                <div
                  className={`w-18 h-20 rounded-none overflow-hidden border transition-all duration-200 cursor-pointer // ← AÑADIDO
                    ${isSelected ? "border-black scale-105 shadow-md" : "border-gray-100"}
                    ${!hasStock ? "grayscale opacity-40" : ""}`}
                >
                  {swatchUrl ? (
                    <img
                      src={getImageUrl(swatchUrl, "thumb")}
                      alt={color}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full" style={{ backgroundColor: hexColor }} />
                  )}
                </div>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {color}
                </span>
              </div>
              <span className={`text-xs font-medium transition-colors duration-200 ${isSelected ? "text-black" : "text-gray-600 group-hover:text-black"}`}>
                {color}
              </span>
              {!hasStock && <span className="text-[10px] text-gray-400 -mt-1">Agotado</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sección: Tabs de información ─────────────────────────────────────────────

const TABS = [
  { id: "descripcion", label: "Información adicional" },
  { id: "especificaciones", label: "Especificaciones técnicas" },
  { id: "politicas", label: "Satisfacción garantizada" },
];

function PoliticasContent() {
  return (
    <div className="text-gray-600 text-sm space-y-3">
      {[
        "30 días para cambios y devoluciones desde la fecha de recepción.",
        "Producto nuevo, 100% original con garantía de fábrica.",
        "Para cambios o devoluciones, el producto debe estar en su empaque original.",
      ].map((text) => (
        <p key={text} className="flex items-start gap-2">
          <span className="text-green-600 mt-0.5">✔</span>
          {text}
        </p>
      ))}
      <Link to="/reembolsos" className="text-gray-800 hover:text-gray-600 text-sm font-medium inline-flex items-center gap-1 mt-4">
        Ver política completa →
      </Link>
    </div>
  );
}

function AtributosGrid({ atributos }) {
  if (!atributos?.length) return <p className="text-gray-400">Sin especificaciones disponibles.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {atributos.map((attr, i) => (
        <div key={i} className="flex text-sm py-2 border-b border-gray-50">
          <span className="text-gray-500 w-32 capitalize">{attr.atributo}:</span>
          <span className="text-gray-700">{attr.valor}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [displayImages, setDisplayImages] = useState([]);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("descripcion");
  const [addedToCart, setAddedToCart] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showReviewDetail, setShowReviewDetail] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const reviewsRef = useRef(null);
  const token = useAuthStore((s) => s.token);

  const addToCart = useAddToCart();
  const toggleWish = useToggleWishlist();

  const { data: product, isLoading } = useProduct(id);
  const { data: related } = useRelatedProducts(id);
  const { data: reviewsData } = useProductReviews(id);

  const { data: category } = useQuery({
    queryKey: ["category", product?.category_id],
    queryFn: () => categoryAPI.getOne(product?.category_id),
    select: (res) => res.data,
    enabled: !!product?.category_id,
  });

  // ← AGREGAR ESTO
  const { data: parentCategory } = useQuery({
    queryKey: ["category", category?.parent_id],
    queryFn: () => categoryAPI.getOne(category?.parent_id),
    select: (res) => res.data,
    enabled: !!category?.parent_id,
  });


  useEffect(() => {
    if (!product) return;

    const baseImages = product.images?.filter((img) => !img.variant_id) ?? [];

    if (selectedVariant) {
      // Si hay variante seleccionada, mostrar sus imágenes o las base
      const variantImages = product.images?.filter((img) => img.variant_id === selectedVariant.id) ?? [];
      setDisplayImages(variantImages.length ? variantImages : baseImages);
    } else {
      // Sin variante: solo imágenes base, nunca todas
      setDisplayImages(baseImages);
    }

    if (product.variants?.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);
  const handleVariantChange = useCallback((variant) => {
    const prevOpts = parseOpts(selectedVariant?.opciones);
    const newOpts = parseOpts(variant?.opciones);

    setSelectedVariant(variant);
    setQuantity(1);

    // Solo cambiar imágenes si cambió el color
    const colorCambio = prevOpts.Color !== newOpts.Color;
    if (colorCambio) {
      const variantImages = product?.images?.filter((img) => img.variant_id === variant.id) ?? [];
      const baseImages = product?.images?.filter((img) => !img.variant_id) ?? [];
      setDisplayImages(variantImages.length ? variantImages : baseImages);
    }
  }, [product, selectedVariant]);
  const openReviewsModal = useCallback(() => setShowReviewsModal(true), []);
  const closeReviewsModal = useCallback(() => setShowReviewsModal(false), []);
  const openReviewDetail = useCallback((review) => {
    setSelectedReview(review);
    setShowReviewDetail(true);
  }, []);
  const closeReviewDetail = useCallback(() => {
    setShowReviewDetail(false);
    setSelectedReview(null);
  }, []);
  const handleReviewChange = useCallback((review) => setSelectedReview(review), []);

  const precio = useMemo(() => calcPrecio(product ?? {}, selectedVariant), [product, selectedVariant]);
  const precioBase = product?.precio_base ?? 0;
  const descuento = product?.precio_oferta && precioBase > product.precio_oferta
    ? product.porcentaje_desc
    : 0;
  const maxStock = useMemo(() => calcMaxStock(product ?? {}, selectedVariant), [product, selectedVariant]);
  const hasVariants = (product?.variants?.length ?? 0) > 0;
  const outOfStock = hasVariants ? selectedVariant?.stock === 0 : product?.stock_total === 0;
  const noVariantChosen = hasVariants && !selectedVariant;

  const handleAddToCart = useCallback(() => {
    if (noVariantChosen) {
      toast.error("Por favor selecciona una opción (talla/color)");
      return;
    }
    addToCart.mutate(
      {
        product_id: product.id,
        variant_id: hasVariants ? selectedVariant?.id : null,
        cantidad: quantity,
      },
      {
        onSuccess: () => {
          setAddedToCart(true);
          setTimeout(() => setAddedToCart(false), 3000);
        },
        onError: () => toast.error("Error al agregar al carrito"),
      },
    );
  }, [noVariantChosen, addToCart, product, hasVariants, selectedVariant, quantity]);

  const handleWishlist = useCallback(() => {
    if (!token) {
      toast.error("Inicia sesión para guardar en favoritos");
      return;
    }
    setWishlisted((w) => !w);
    toggleWish.mutate(product.id);
  }, [token, toggleWish, product]);

  if (isLoading) {
    return <div className="text-center py-20"><Spinner /></div>;
  }
  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Producto no encontrado</p>
        <Link to="/products"><Button>Ver productos</Button></Link>
      </div>
    );
  }

  const reviews = reviewsData?.data ?? [];
  const productImage = product.images?.[0]?.url || "";

  return (
    <>
      {/* Toast "Agregado al carrito" */}
      <AnimatePresence>
        {addedToCart && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-xl z-[9999] flex items-center gap-3"
            role="status"
            aria-live="polite"
          >
            <Check size={18} className="text-green-400" />
            <span className="text-sm">Producto agregado al carrito</span>
            <Link to="/cart" className="ml-4 text-sm text-white underline hover:no-underline">
              Ver carrito
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 pt-2 pb-6 lg:pt-3 lg:pb-8">

        {/* ── Breadcrumb ── */}
        <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-xs text-gray-400 mb-3 overflow-x-auto pb-1">
          <Link to="/" className="hover:text-gray-600 transition whitespace-nowrap">Home</Link>
          <span className="text-gray-300" aria-hidden="true">›</span>

          {/* Categoría padre (Electrónica) */}
          {parentCategory && (
            <>
              <Link to={`/category/${parentCategory.id}`} className="hover:text-gray-600 transition whitespace-nowrap capitalize">
                {parentCategory.nombre}
              </Link>
              <span className="text-gray-300" aria-hidden="true">›</span>
            </>
          )}

          {/* Subcategoría (Audífonos) */}
          {category && (
            <>
              <Link to={`/category/${product.category_id}`} className="hover:text-gray-600 transition whitespace-nowrap capitalize">
                {category.nombre}
              </Link>
              <span className="text-gray-300" aria-hidden="true">›</span>
            </>
          )}

          <span className="text-gray-600 line-clamp-1 whitespace-nowrap" aria-current="page">
            {product.nombre}
          </span>
        </nav>

        {/* ── Grid principal con sticky ── */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start">

          {/* ── Columna IZQUIERDA: imágenes + tabs + reseñas ── */}
          <div className="w-full lg:w-[45%] min-w-0">

            {/* Galería */}
            <ProductZoom
              images={displayImages.length > 0 ? displayImages : product.images?.filter((img) => !img.variant_id) ?? []}
              getImageUrl={getImageUrl}
              productName={product.nombre}
            />

            {/* ── Tabs de información (desktop) ── */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="hidden md:block">
                <div className="flex border-b border-gray-200 gap-8" role="tablist">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-3 text-sm font-medium transition ${activeTab === tab.id
                        ? "border-b-2 border-gray-800 text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div role="tabpanel" className="pt-6">
                  {activeTab === "descripcion" && (
                    <div className="prose max-w-none text-gray-600 text-sm leading-relaxed">
                      {product.descripcion ?? <p className="text-gray-400">No hay descripción disponible.</p>}
                    </div>
                  )}
                  {activeTab === "especificaciones" && <AtributosGrid atributos={product.atributos} />}
                  {activeTab === "politicas" && <PoliticasContent />}
                </div>
              </div>

              {/* Accordions (mobile) */}
              <div className="block md:hidden">
                <Accordion title="Información adicional">
                  {product.descripcion ?? "No hay descripción disponible."}
                </Accordion>
                {product.atributos?.length > 0 && (
                  <Accordion title="Especificaciones técnicas">
                    <div className="space-y-2">
                      {product.atributos.map((attr, i) => (
                        <div key={i} className="flex text-sm py-1">
                          <span className="text-gray-500 w-32 capitalize">{attr.atributo}:</span>
                          <span className="text-gray-700">{attr.valor}</span>
                        </div>
                      ))}
                    </div>
                  </Accordion>
                )}
                <Accordion title="Satisfacción garantizada"><PoliticasContent /></Accordion>
              </div>
            </div>

            {/* ── Reseñas ── */}
            <div ref={reviewsRef} className="mt-10 pt-6 border-t border-gray-100 scroll-mt-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-800">Opiniones de clientes</h2>
                {reviews.length > 0 && (
                  <button
                    onClick={openReviewsModal}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
                  >
                    Ver todas <ChevronRight size={16} />
                  </button>
                )}
              </div>

              {reviews.length > 0 ? (
                <>
                  <div className="space-y-5">
                    {reviews.slice(0, 3).map((rev) => (
                      <ReviewCard
                        key={rev.id}
                        rev={rev}
                        onClick={() => openReviewDetail(rev)}
                      />
                    ))}
                  </div>
                  {reviews.length > 3 && (
                    <button
                      onClick={openReviewsModal}
                      className="mt-4 text-sm text-gray-700 hover:text-gray-900 font-medium underline transition-colors"
                    >
                      Ver todas las reseñas ({reviews.length})
                    </button>
                  )}
                </>
              ) : (
                <p className="text-gray-400">No hay reseñas aún. ¡Sé el primero en opinar!</p>
              )}
            </div>

            {/* ── ✅ NUEVO: Todas las imágenes del producto ── */}
            <ProductImageGallery
              images={product.images?.filter((img) => !img.variant_id)}
              getImageUrl={getImageUrl}
              productName={product.nombre}
            />

          </div>
          {/* fin columna izquierda */}

          {/* ── Columna DERECHA: sticky ── */}
          <div className="w-full lg:w-[52%] lg:sticky lg:top-[72px] lg:self-start shrink-0">

            {/* Vendedor */}
            <div className="flex items-center gap-1 mb-5">
              <span className="text-xs text-gray-500">Vendido por</span>
              <span className="text-xs font-medium text-white uppercase bg-violet-900 px-1.5 py-0.5 rounded">
                MirageMart
              </span>
              <Tooltip content="Producto publicado directamente por MirageMart">
                <HelpCircle size={12} className="text-gray-400" />
              </Tooltip>
            </div>
            {/* Marca */}
            {product.marca && (
              <p className="text-xs text-gray-400 mb-1">
                Marca: <span className="font-medium text-gray-600 uppercase tracking-wide">{product.marca}</span>
              </p>
            )}

            {/* Nombre */}
            <h1 className="text-xl lg:text-xl font-stretch-50% text-gray-900 leading-tight mb-6">
              {product.nombre}
            </h1>

            {/* Rating */}
            {product.rating_count > 0 && (
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <StarRow rating={product.rating_promedio} />
                <button
                  onClick={openReviewsModal}
                  className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition"
                >
                  {Number(product.rating_promedio).toFixed(1)} ({product.rating_count} reseñas)
                </button>
                <span className="text-gray-300" aria-hidden="true">|</span>
                <span className="text-xs text-gray-500">{product.ventas_count} vendidos</span>
              </div>
            )}

            {/* Precio */}
            <div className="mb-10">
              {descuento > 0 ? (
                <>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl font-bold text-gray-900">{formatPrice(precio)}</span>
                    <span className="text-sm text-gray-400 line-through">{formatPrice(precioBase)}</span>
                    <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      -{descuento}%
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Ahorras {formatPrice(precioBase - precio)}
                  </p>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">{formatPrice(precio)}</span>
              )}
            </div>

            {/* Variantes */}
            {hasVariants && (
              <div className="space-y-4 mb-5">
                <TallaSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onSelect={handleVariantChange}
                  onSizeGuide={() => setShowSizeGuide(true)}

                />
                <ColorSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  images={product.images}
                  onSelect={handleVariantChange}
                />
              </div>
            )}

            {/* Cantidad + Botones */}
            <div className="flex items-center gap-4 mb-6">
              <QuantitySelector value={quantity} max={maxStock} onChange={setQuantity} />
              <Button
                variant="dark"
                className="w-auto px-8 font-medium"
                onClick={handleAddToCart}
                loading={addToCart.isPending}
                disabled={noVariantChosen || outOfStock}
              >
                <ShoppingCart size={24} className="mr-2" />
                {noVariantChosen ? "Elige opciones" : outOfStock ? "Sin stock" : "Agregar al carro"}
              </Button>
              <button
                variant="dark"
                onClick={handleWishlist}
                aria-label={wishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
                aria-pressed={wishlisted}
                className="p-2 border border-gray-200 hover:border-gray-400 transition rounded-md cursor-pointer" // ← AÑADIDO
              >
                <Heart size={26} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-900"} />
              </button>
            </div>

            {/* Garantías */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-gray-100 mb-5">
              {GUARANTEES.map(({ icon: Icon, text, tooltip }, index) => {
                const styles = [
                  {
                    icon: "text-blue-600",
                    text: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    icon: "text-green-600",
                    text: "text-green-600",
                    bg: "bg-green-50",
                  },
                  {
                    icon: "text-orange-600",
                    text: "text-orange-600",
                    bg: "bg-orange-50",
                  },
                ];

                const style = styles[index];

                return (
                  <Tooltip key={text} content={tooltip}>
                    <div className={`flex flex-col items-center gap-1 p-2 rounded-lg ${style.bg}`}>
                      <Icon size={18} className={style.icon} />
                      <span className={`text-xs text-center font-medium ${style.text}`}>
                        {text}
                      </span>
                    </div>
                  </Tooltip>
                );
              })}
            </div>
            {/* Descripción corta */}
            {product.descripcion_corta && (
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">{product.descripcion_corta}</p>
            )}

            {/* Atributos (preview) */}
            {product.atributos?.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-medium text-gray-800 mb-2">Información adicional</h3>
                <div className="space-y-1.5">
                  {product.atributos.slice(0, 4).map((attr, i) => (
                    <div key={i} className="flex text-sm">
                      <span className="text-gray-500 w-28 capitalize">{attr.atributo}:</span>
                      <span className="text-gray-700">{attr.valor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-400">Código: {product.sku || product.id}</p>
          </div>
          {/* fin columna derecha */}

        </div>
        {/* fin grid principal */}

        {/* ── Modales ── */}
        <ReviewsModal
          isOpen={showReviewsModal}
          onClose={closeReviewsModal}
          reviews={reviews}
          productName={product.nombre}
          onReviewClick={openReviewDetail}
        />
        <ReviewDetailModal
          isOpen={showReviewDetail}
          onClose={closeReviewDetail}
          review={selectedReview}
          allReviews={reviews}
          productName={product.nombre}
          productPrice={precio}
          productImage={productImage}
          onReviewChange={handleReviewChange}
          onAddToCart={() => {
            handleAddToCart();
            closeReviewDetail();
          }}
        />

        {/* ── Comprados juntos / Productos relacionados ── */}
        {related?.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-medium text-gray-800 mb-5">Comprados juntos frecuentemente</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {related.slice(0, 5).map((item, idx) => (
                <ProductCard key={`related-${item.id}-${idx}`} product={item} />
              ))}
            </div>
          </div>
        )}

      </div>
      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />
    </>
  );
}