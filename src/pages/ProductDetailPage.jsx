import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Plus,
  Minus,
  HelpCircle,
  Check,
} from "lucide-react";
import ProductZoom from "../components/ui/ProductZoom";

import {
  useProduct,
  useRelatedProducts,
  useProductReviews,
} from "../hooks/useProducts.js";
import { useAddToCart } from "../hooks/useCart.js";
import { useToggleWishlist } from "../hooks/useWishlist.js";
import { categoryAPI } from "../api/category.api.js";

import ProductCard from "../components/product/ProductCard.jsx";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";

import { formatPrice } from "../utils/formatPrice.js";
import { timeAgo } from "../utils/formatDate.js";

import useAuthStore from "../store/useAuthStore.js";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";

function Accordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-0 text-left hover:bg-gray-50/50 transition-colors group"
      >
        <span className="font-medium text-gray-800 text-sm md:text-base">
          {title}
        </span>
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
            <div className="pb-4 text-gray-600 text-sm leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center group">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
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

export default function ProductDetailPage() {
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [hoveredVariant, setHoveredVariant] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("descripcion");
  const [addedToCart, setAddedToCart] = useState(false);

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

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Producto no encontrado</p>
        <Link to="/products">
          <Button className="mt-4">Ver productos</Button>
        </Link>
      </div>
    );
  }

  const images =
    product.images?.length > 0
      ? product.images
      : [{ url: PLACEHOLDER_IMAGE, es_principal: 1 }];

  const precio = selectedVariant
    ? Number(product.precio_base) + Number(selectedVariant.precio_extra || 0)
    : Number(product.precio_final || product.precio_oferta || product.precio_base);

  const precioBase = selectedVariant
    ? Number(product.precio_base)
    : Number(product.precio_base);

  const porcentajeDesc =
    product.precio_oferta && product.precio_base > product.precio_oferta
      ? product.porcentaje_desc
      : 0;

  const getImageUrl = (url, size = "medium") => {
    if (!url) return PLACEHOLDER_IMAGE;
    if (!url.includes("cloudinary")) {
      if (url.startsWith("http")) return url;
      return `http://localhost:4000${url}`;
    }
    const transformations = {
      thumb: "w_120,h_120,c_limit,f_webp,q_80",
      small: "w_240,h_240,c_limit,f_webp,q_80",
      medium: "w_600,h_600,c_limit,f_webp,q_80",
      large: "w_1200,h_1200,c_limit,f_webp,q_80",
    };
    const transform = transformations[size] || transformations.medium;
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return url;
    const base = url.substring(0, uploadIndex + 8);
    const path = url.substring(uploadIndex + 8);
    return `${base}${transform}/${path}`;
  };

  const handleAddToCart = () => {
    // Si no tiene variantes, enviar sin variant_id
    const hasVariants = product.variants?.length > 0;

    addToCart.mutate(
      {
        product_id: product.id,
        variant_id: hasVariants ? (selectedVariant?.id || null) : null,
        cantidad: quantity,
      },
      {
        onSuccess: () => {
          setAddedToCart(true);
          setTimeout(() => setAddedToCart(false), 2000);
        },
      }
    );
  };

  const handleWishlist = () => {
    if (!token) return;
    setWishlisted(!wishlisted);
    toggleWish.mutate(product.id);
  };

  return (
    <>
      <AnimatePresence>
        {addedToCart && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-xl z-[9999] flex items-center gap-3"
          >
            <Check size={18} className="text-green-400" />
            <span className="text-sm">Producto agregado al carrito</span>
            <Link to="/cart" className="ml-4 text-sm text-white underline hover:no-underline">
              Ver carrito
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-8 pt-2 pb-6 lg:pt-3 lg:pb-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 overflow-x-auto pb-1">
          <Link to="/" className="hover:text-gray-600 transition whitespace-nowrap">
            Home
          </Link>
          <span className="text-gray-300">›</span>
          {category && (
            <>
              <Link
                to={`/category/${product.category_id}`}
                className="hover:text-gray-600 transition whitespace-nowrap capitalize"
              >
                {category.nombre}
              </Link>
              <span className="text-gray-300">›</span>
            </>
          )}
          <span className="text-gray-600 line-clamp-1 whitespace-nowrap">
            {product.nombre}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-18">
          <div className="lg:w-[62.5%]">
            <div className="sticky top-4">
              <ProductZoom
                images={images}
                getImageUrl={getImageUrl}
                productName={product.nombre}
              />
            </div>
          </div>

          <div className="lg:w-[37.5%]">
            <div className="flex items-center gap-1 mb-3">
              <span className="text-xs text-gray-500">Vendido por</span>
              <span className="text-xs font-medium text-gray-800 uppercase bg-gray-100 px-1.5 py-0.5 rounded">
                falabella
              </span>
              <Tooltip content="Producto publicado directamente por falabella.pe">
                <HelpCircle size={12} className="text-gray-400 cursor-help" />
              </Tooltip>
            </div>

            {product.marca && (
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs text-gray-400">Marca:</span>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {product.marca}
                </p>
              </div>
            )}

            <h1 className="text-xl lg:text-2xl font-light text-gray-900 leading-tight mb-4">
              {product.nombre}
            </h1>

            {product.rating_count > 0 && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.round(product.rating_promedio)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {Number(product.rating_promedio).toFixed(1)} ({product.rating_count} reseñas)
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-500">
                  {product.ventas_count} vendidos
                </span>
              </div>
            )}

            <div className="mb-5">
              {porcentajeDesc > 0 ? (
                <>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(precio)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(precioBase)}
                    </span>
                    <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      -{porcentajeDesc}%
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Ahorras {formatPrice(precioBase - precio)}
                  </p>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(precio)}
                </span>
              )}
            </div>

            {/* VARIANTES */}
            {product.variants?.length > 0 && (
              <div className="space-y-4 mb-5">
                {/* TALLA */}
                {(() => {
                  const tallas = [
                    ...new Set(
                      product.variants.map((v) => {
                        const opts = typeof v.opciones === "string" ? JSON.parse(v.opciones) : v.opciones;
                        return opts.Talla;
                      }).filter(Boolean)
                    ),
                  ];
                  if (tallas.length === 0) return null;
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">Talla</p>
                        <button className="text-xs text-red-500 hover:text-red-600 font-medium">
                          Guía de tallas
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tallas.map((talla) => {
                          const variantsWithTalla = product.variants.filter((v) => {
                            const opts = typeof v.opciones === "string" ? JSON.parse(v.opciones) : v.opciones;
                            return opts.Talla === talla;
                          });
                          const hasStock = variantsWithTalla.some((v) => v.stock > 0);
                          const selectedOpts = selectedVariant?.opciones
                            ? (typeof selectedVariant.opciones === "string" ? JSON.parse(selectedVariant.opciones) : selectedVariant.opciones)
                            : null;
                          const isSelected = selectedOpts?.Talla === talla;
                          return (
                            <button
                              key={talla}
                              disabled={!hasStock}
                              onClick={() => {
                                let variantToSelect;
                                if (selectedOpts?.Color) {
                                  variantToSelect = variantsWithTalla.find((v) => {
                                    const opts = typeof v.opciones === "string" ? JSON.parse(v.opciones) : v.opciones;
                                    return opts.Color === selectedOpts.Color && v.stock > 0;
                                  });
                                }
                                if (!variantToSelect) {
                                  variantToSelect = variantsWithTalla.find((v) => v.stock > 0);
                                }
                                if (variantToSelect) setSelectedVariant(variantToSelect);
                              }}
                              className={`
                                min-w-[48px] px-4 py-2 text-sm border-2 rounded-md transition-all duration-150 font-medium
                                ${isSelected && selectedVariant
                                  ? "border-gray-800 bg-gray-50 text-gray-900 shadow-sm"
                                  : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                                }
                                ${!hasStock ? "opacity-50 cursor-not-allowed bg-gray-100 line-through" : ""}
                              `}
                            >
                              {talla}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* COLOR */}
                {(() => {
                  const colores = [
                    ...new Set(
                      product.variants.map((v) => {
                        const opts = typeof v.opciones === "string" ? JSON.parse(v.opciones) : v.opciones;
                        return opts.Color;
                      }).filter(Boolean)
                    ),
                  ];
                  if (colores.length === 0) return null;
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">Color</p>
                        <span className="text-xs text-gray-500">
                          {(() => {
                            const opts = selectedVariant?.opciones
                              ? (typeof selectedVariant.opciones === "string" ? JSON.parse(selectedVariant.opciones) : selectedVariant.opciones)
                              : null;
                            return opts?.Color || "";
                          })()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {colores.map((color) => {
                          const variantsWithColor = product.variants.filter((v) => {
                            const opts = typeof v.opciones === "string" ? JSON.parse(v.opciones) : v.opciones;
                            return opts.Color === color;
                          });
                          const selectedOpts = selectedVariant?.opciones
                            ? (typeof selectedVariant.opciones === "string" ? JSON.parse(selectedVariant.opciones) : selectedVariant.opciones)
                            : null;
                          let hasStock = false;
                          if (selectedOpts?.Talla) {
                            hasStock = variantsWithColor.some((v) => {
                              const opts = typeof v.opciones === "string" ? JSON.parse(v.opciones) : v.opciones;
                              return opts.Talla === selectedOpts.Talla && v.stock > 0;
                            });
                          } else {
                            hasStock = variantsWithColor.some((v) => v.stock > 0);
                          }
                          const isSelected = selectedOpts?.Color === color;
                          const colorNameLower = color?.toLowerCase() || "";
                          return (
                            <button
                              key={color}
                              disabled={!hasStock}
                              onClick={() => {
                                let variantToSelect;
                                if (selectedOpts?.Talla) {
                                  variantToSelect = product.variants.find((v) => {
                                    const opts = typeof v.opciones === "string" ? JSON.parse(v.opciones) : v.opciones;
                                    return opts.Color === color && opts.Talla === selectedOpts.Talla && v.stock > 0;
                                  });
                                }
                                if (!variantToSelect) {
                                  variantToSelect = product.variants.find((v) => {
                                    const opts = typeof v.opciones === "string" ? JSON.parse(v.opciones) : v.opciones;
                                    return opts.Color === color && v.stock > 0;
                                  });
                                }
                                if (variantToSelect) setSelectedVariant(variantToSelect);
                              }}
                              className={`
                                flex items-center gap-2 px-3 py-2 text-sm border-2 rounded-md transition-all duration-150
                                ${isSelected
                                  ? "border-gray-800 bg-gray-50 shadow-sm"
                                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                }
                                ${!hasStock ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}
                              `}
                            >
                              <span
                                className={`w-5 h-5 rounded-full border ${isSelected ? "ring-2 ring-gray-800 ring-offset-1" : "border-gray-300"}`}
                                style={{
                                  backgroundColor:
                                    colorNameLower === "rojo" ? "#e53e3e" :
                                      colorNameLower === "azul" ? "#3182ce" :
                                        colorNameLower === "negro" ? "#1a202c" :
                                          colorNameLower === "blanco" ? "#ffffff" :
                                            colorNameLower === "verde" ? "#38a169" :
                                              colorNameLower === "amarillo" ? "#ecc94b" :
                                                colorNameLower === "rosa" ? "#ed64a6" :
                                                  colorNameLower === "morado" ? "#805ad5" :
                                                    "#cccccc"
                                }}
                              />
                              <span className={isSelected ? "font-medium text-gray-900" : "text-gray-700"}>
                                {color}
                              </span>
                              {isSelected && (
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* CANTIDAD Y BOTONES */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(
                      product.variants?.length > 0
                        ? (selectedVariant?.stock || product.stock_total || 99)
                        : (product.stock_total || 99),
                      quantity + 1
                    ))
                  }
                  disabled={quantity >= (product.variants?.length > 0
                    ? (selectedVariant?.stock || product.stock_total || 99)
                    : (product.stock_total || 99)
                  )}
                  className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={14} />
                </button>
              </div>
              <Button
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium"
                onClick={handleAddToCart}
                loading={addToCart.isPending}
                disabled={(product.variants?.length > 0 && !selectedVariant) || selectedVariant?.stock === 0 || product.stock_total === 0}
              >
                <ShoppingCart size={16} className="mr-2" />
                {product.variants?.length > 0 && !selectedVariant
                  ? "Elige opciones"
                  : selectedVariant?.stock === 0 || product.stock_total === 0
                    ? "Sin stock"
                    : "Agregar al Carro"}
              </Button>

              <button
                onClick={handleWishlist}
                className="p-2 border border-gray-200 hover:border-gray-400 transition rounded-md"
              >
                <Heart
                  size={18}
                  className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}
                />
              </button>
            </div>

            {/* GARANTÍAS */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-gray-100 mb-5">
              {[
                { icon: Truck, text: "Despacho a domicilio", tooltip: "Entrega en 3-5 días hábiles" },
                { icon: Shield, text: "Compra 100% segura", tooltip: "Tus datos están protegidos" },
                { icon: RotateCcw, text: "30 días", tooltip: "Cambios y devoluciones gratuitas" },
              ].map(({ icon: Icon, text, tooltip }) => (
                <Tooltip key={text} content={tooltip}>
                  <div className="flex flex-col items-center gap-1 cursor-help">
                    <Icon size={18} className="text-gray-500" />
                    <span className="text-xs text-gray-500 text-center">{text}</span>
                  </div>
                </Tooltip>
              ))}
            </div>

            {product.descripcion_corta && (
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                {product.descripcion_corta}
              </p>
            )}

            {product.atributos?.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-medium text-gray-800 mb-2">
                  Información adicional
                </h3>
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

            <p className="text-xs text-gray-400">
              Código: {product.sku || product.id}
            </p>
          </div>
        </div>

        {/* INFORMACIÓN ADICIONAL */}
        <div className="mt-12 pt-6 border-t border-gray-100">
          <div className="hidden md:block">
            <div className="flex border-b border-gray-200 gap-8">
              {[
                { id: "descripcion", label: "Información adicional" },
                { id: "especificaciones", label: "Especificaciones técnicas" },
                { id: "politicas", label: "Satisfacción garantizada" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    pb-3 text-sm font-medium transition
                    ${activeTab === tab.id
                      ? "border-b-2 border-gray-800 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="pt-6">
              {activeTab === "descripcion" && (
                <div className="prose max-w-none text-gray-600 text-sm leading-relaxed">
                  {product.descripcion || <p className="text-gray-400">No hay descripción disponible.</p>}
                </div>
              )}
              {activeTab === "especificaciones" && product.atributos?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.atributos.map((attr, i) => (
                    <div key={i} className="flex text-sm py-2 border-b border-gray-50">
                      <span className="text-gray-500 w-32 capitalize">{attr.atributo}:</span>
                      <span className="text-gray-700">{attr.valor}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "politicas" && (
                <div className="text-gray-600 text-sm space-y-3">
                  <p className="flex items-start gap-2">
                    <span className="text-green-600">✔</span>
                    <span>30 días para cambios y devoluciones desde la fecha de recepción.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-600">✔</span>
                    <span>Producto nuevo, 100% original con garantía de fábrica.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-600">✔</span>
                    <span>Para cambios o devoluciones, el producto debe estar en su empaque original.</span>
                  </p>
                  <Link to="/reembolsos" className="text-gray-800 hover:text-gray-600 text-sm font-medium inline-flex items-center gap-1 mt-4">
                    Ver política completa →
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="block md:hidden">
            <Accordion title="Información adicional">
              {product.descripcion || "No hay descripción disponible."}
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
            <Accordion title="Satisfacción garantizada">
              <div className="space-y-2">
                <p>✔ 30 días para cambios y devoluciones desde la fecha de recepción.</p>
                <p>✔ Producto nuevo, 100% original con garantía de fábrica.</p>
                <p>✔ Para cambios o devoluciones, el producto debe estar en su empaque original.</p>
                <Link to="/reembolsos" className="text-gray-800 hover:text-gray-600 text-sm font-medium inline-flex items-center gap-1 mt-2">
                  Ver política completa →
                </Link>
              </div>
            </Accordion>
          </div>
        </div>

        {/* RESEÑAS */}
        {reviewsData?.data?.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Opiniones de clientes</h3>
            <div className="space-y-5">
              {reviewsData.data.slice(0, 3).map((rev) => (
                <div key={rev.id} className="pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {rev.autor?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{rev.autor}</p>
                      <p className="text-xs text-gray-400">{timeAgo(rev.created_at)}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < rev.calificacion ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                  {rev.titulo && <p className="text-sm font-medium text-gray-700 mb-1">{rev.titulo}</p>}
                  {rev.comentario && <p className="text-sm text-gray-600 leading-relaxed">{rev.comentario}</p>}
                </div>
              ))}
            </div>
            {reviewsData.data.length > 3 && (
              <button
                onClick={() => setActiveTab("resenas")}
                className="mt-4 text-sm text-gray-700 hover:text-gray-900 font-medium underline"
              >
                Ver todas las reseñas ({reviewsData.data.length})
              </button>
            )}
          </div>
        )}

        {/* PRODUCTOS RELACIONADOS */}
        {related?.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-6 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M17.5 12.7083C17.8452 12.7083 18.125 12.9882 18.125 13.3333V15C18.125 16.7259 16.7259 18.125 15 18.125H13.3333C12.9882 18.125 12.7083 17.8452 12.7083 17.5C12.7083 17.1548 12.9882 16.875 13.3333 16.875H15C16.0355 16.875 16.875 16.0355 16.875 15V13.3333C16.875 12.9882 17.1548 12.7083 17.5 12.7083Z" fill="#333333" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.7083 2.5C12.7083 2.15482 12.9882 1.875 13.3333 1.875H15C16.7259 1.875 18.125 3.27411 18.125 5V6.66667C18.125 7.01184 17.8452 7.29167 17.5 7.29167C17.1548 7.29167 16.875 7.01184 16.875 6.66667V5C16.875 3.96447 16.0355 3.125 15 3.125H13.3333C12.9882 3.125 12.7083 2.84518 12.7083 2.5Z" fill="#333333" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M2.5 12.7083C2.84518 12.7083 3.125 12.9882 3.125 13.3333V15C3.125 16.0355 3.96447 16.875 5 16.875H6.66667C7.01184 16.875 7.29167 17.1548 7.29167 17.5C7.29167 17.8452 7.01184 18.125 6.66667 18.125H5C3.27411 18.125 1.875 16.7259 1.875 15V13.3333C1.875 12.9882 2.15482 12.7083 2.5 12.7083Z" fill="#333333" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M5 3.125C3.96447 3.125 3.125 3.96447 3.125 5V6.66667C3.125 7.01184 2.84518 7.29167 2.5 7.29167C2.15482 7.29167 1.875 7.01184 1.875 6.66667V5C1.875 3.27411 3.27411 1.875 5 1.875H6.66667C7.01184 1.875 7.29167 2.15482 7.29167 2.5C7.29167 2.84518 7.01184 3.125 6.66667 3.125H5Z" fill="#333333" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.12499 13.3333C8.12499 12.9882 8.40481 12.7083 8.74999 12.7083H11.25C11.5952 12.7083 11.875 12.9882 11.875 13.3333C11.875 13.6785 11.5952 13.9583 11.25 13.9583H8.74999C8.40481 13.9583 8.12499 13.6785 8.12499 13.3333Z" fill="#333333" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.61111 6.04167C8.95629 6.04167 9.23611 6.32149 9.23611 6.66667V10.8333C9.23611 11.1785 8.95629 11.4583 8.61111 11.4583C8.26593 11.4583 7.98611 11.1785 7.98611 10.8333V6.66667C7.98611 6.32149 8.26593 6.04167 8.61111 6.04167Z" fill="#333333" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.3889 6.04167C11.7341 6.04167 12.0139 6.32149 12.0139 6.66667V10.8333C12.0139 11.1785 11.7341 11.4583 11.3889 11.4583C11.0437 11.4583 10.7639 11.1785 10.7639 10.8333V6.66667C10.7639 6.32149 11.0437 6.04167 11.3889 6.04167Z" fill="#333333" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800">Comprados juntos frecuentemente</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {related.slice(0, 5).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}